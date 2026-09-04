/**
 * The maquette: the Smartino Snagov model, live, one fold below the hero.
 *
 * This is the one place the site ships a 3D engine. three.js and the model
 * come in as a separate chunk, only once the section is within a screen of the
 * viewport, so the first paint never waits for them. The client asked for the
 * model in plain words and overruled the JS budget for it; the numbers are in
 * docs/design-plan.md.
 *
 * What it does: the camera flies a three-key path driven by scroll through
 * the pinned section, the hand can turn the model at any point, the whole
 * thing drifts slowly by itself when left alone, and the two buildings answer
 * hover -- in the scene and on their HTML labels, which are real links
 * projected from real 3D anchors every frame.
 *
 * What it refuses to do: move on its own under reduced motion (the drag still
 * works, since that is the person moving it), or hijack the scroll wheel. If
 * WebGL is missing or the model fails, the pre-rendered poster simply stays.
 */
import {
  ACESFilmicToneMapping,
  Box3,
  Color,
  DirectionalLight,
  HemisphereLight,
  InstancedMesh,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Raycaster,
  Scene,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { prefersReducedMotion } from '../lib/motion';
import { withBase } from '../lib/paths';

type Key = { yaw: number; pitch: number; dist: number; ty: number };
type Pin = { key: string; el: HTMLElement; anchor: Vector3; meshes: Mesh[] };

/** The flight: an establishing shot, a low pass by the supermarket, arrival over the ring. */
const KEYS: Key[] = [
  { yaw: 0.58, pitch: 0.68, dist: 2.7, ty: 0 },
  { yaw: -0.2, pitch: 0.3, dist: 1.5, ty: 6 },
  { yaw: -1.25, pitch: 0.55, dist: 1.85, ty: 0 },
];

const BRAND = new Color(0x13b4c6);

const smooth = (t: number): number => t * t * (3 - 2 * t);
const lerpKey = (a: Key, b: Key, t: number): Key => ({
  yaw: MathUtils.lerp(a.yaw, b.yaw, t),
  pitch: MathUtils.lerp(a.pitch, b.pitch, t),
  dist: MathUtils.lerp(a.dist, b.dist, t),
  ty: MathUtils.lerp(a.ty, b.ty, t),
});
const flight = (p: number): Key =>
  p < 0.5 ? lerpKey(KEYS[0], KEYS[1], smooth(p / 0.5)) : lerpKey(KEYS[1], KEYS[2], smooth((p - 0.5) / 0.5));

export function mount(section: HTMLElement): void {
  const host = section.querySelector<HTMLElement>('[data-mq-canvas]');
  if (!host) return;

  const reduced = prefersReducedMotion();
  const coarse = matchMedia('(pointer: coarse)').matches;

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return; // no WebGL: the poster stays, and that is the whole fallback
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, coarse ? 1.5 : 1.75));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  host.appendChild(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 10, 5000);

  scene.add(new HemisphereLight(0xe8f0f1, 0x0b0f10, 1.1));
  const key = new DirectionalLight(0xfff1dc, 2.4);
  key.position.set(-260, 420, 300);
  key.castShadow = true;
  const shadowRes = coarse ? 1024 : 2048;
  key.shadow.mapSize.set(shadowRes, shadowRes);
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.8;
  Object.assign(key.shadow.camera, { left: -330, right: 330, top: 330, bottom: -330, near: 50, far: 1400 });
  key.shadow.camera.updateProjectionMatrix();
  scene.add(key);
  const rim = new DirectionalLight(BRAND, 0.9);
  rim.position.set(320, 140, -360);
  scene.add(rim);

  // ---- state ---------------------------------------------------------------
  let radius = 300;
  let visible = false;
  let ready = false;
  let raf = 0;
  let last = 0;
  let intro = reduced ? 1 : 0;
  let lastP = -1;
  let driftYaw = 0;
  let uYaw = 0;
  let uPitch = 0;
  let uYawT = 0;
  let uPitchT = 0;
  let dragging = false;
  let dragged = false;
  let lastTouch = 0;
  let hot: string | null = null;
  const pins: Pin[] = [];
  const hoverables: Mesh[] = [];
  const ptr = new Vector2();
  let ptrDirty = false;
  const ray = new Raycaster();
  const v = new Vector3();

  // ---- the model -----------------------------------------------------------
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  loader.load(
    withBase('/models/snagov-plaza.glb'),
    (gltf) => {
      const model = gltf.scene;
      const box = new Box3().setFromObject(model);
      const centre = box.getCenter(new Vector3());
      const size = box.getSize(new Vector3());
      radius = Math.hypot(size.x, size.z) / 2;
      model.position.sub(centre);
      model.updateMatrixWorld(true);

      const groups: Record<string, Mesh[]> = { supermarket: [], home: [] };
      model.traverse((o: Object3D) => {
        if (o instanceof Mesh || o instanceof InstancedMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
        }
        const n = o.name;
        // the baked label plaques give way to the HTML labels; poles and tips stay
        if (n.startsWith('pin_placa')) o.visible = false;
        if (o instanceof Mesh && !(o instanceof InstancedMesh)) {
          const g = n.startsWith('supermarket') ? 'supermarket' : n.startsWith('mall_') ? 'home' : null;
          if (g) {
            // a private material, so the glow never leaks to the other building
            o.material = (o.material as MeshStandardMaterial).clone();
            o.userData.pin = g;
            groups[g].push(o);
            hoverables.push(o);
          }
        }
      });

      for (const el of section.querySelectorAll<HTMLElement>('[data-pin]')) {
        const k = el.dataset.pin!;
        const plaque = model.getObjectByName(k === 'home' ? 'pin_placa_home' : 'pin_placa_supermarket');
        if (!plaque) continue;
        const anchor = plaque.getWorldPosition(new Vector3());
        pins.push({ key: k, el, anchor, meshes: groups[k] });
        el.addEventListener('pointerenter', () => setHot(k));
        el.addEventListener('pointerleave', () => setHot(null));
      }

      scene.add(model);
      resize();
      if (visible && !raf) raf = requestAnimationFrame(tick);
    },
    undefined,
    () => {
      /* the poster stays */
    }
  );

  // ---- hover ---------------------------------------------------------------
  const setHot = (k: string | null): void => {
    if (k === hot) return;
    hot = k;
    for (const pin of pins) {
      const on = pin.key === k;
      pin.el.toggleAttribute('data-hot', on);
      for (const m of pin.meshes) {
        const mat = m.material as MeshStandardMaterial;
        mat.emissive.copy(on ? BRAND : new Color(0));
        mat.emissiveIntensity = on ? 0.32 : 0;
      }
    }
    host.style.cursor = k ? 'pointer' : '';
  };

  // ---- the hand ------------------------------------------------------------
  let x0 = 0;
  let y0 = 0;
  let yaw0 = 0;
  let pitch0 = 0;
  host.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    dragging = true;
    dragged = false;
    x0 = e.clientX;
    y0 = e.clientY;
    yaw0 = uYawT;
    pitch0 = uPitchT;
    lastTouch = performance.now();
    host.setPointerCapture(e.pointerId);
    section.setAttribute('data-dragging', '');
  });
  host.addEventListener('pointermove', (e) => {
    lastTouch = performance.now();
    if (dragging && host.hasPointerCapture(e.pointerId)) {
      const dx = e.clientX - x0;
      const dy = e.clientY - y0;
      if (Math.abs(dx) + Math.abs(dy) > 5) {
        dragged = true;
        section.setAttribute('data-dragged', '');
      }
      uYawT = yaw0 + dx * 0.006;
      uPitchT = pitch0 + dy * 0.004;
      return;
    }
    const r = host.getBoundingClientRect();
    ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ptrDirty = true;
  });
  const drop = (e: PointerEvent): void => {
    if (!dragging) return;
    dragging = false;
    section.removeAttribute('data-dragging');
    if (host.hasPointerCapture(e.pointerId)) host.releasePointerCapture(e.pointerId);
  };
  host.addEventListener('pointerup', drop);
  host.addEventListener('pointercancel', drop);
  host.addEventListener('pointerleave', () => {
    if (!dragging) setHot(null);
  });
  host.addEventListener('click', (e) => {
    if (dragged) {
      e.preventDefault();
      return;
    }
    if (hot) pins.find((p) => p.key === hot)?.el.click();
  });
  host.addEventListener('dragstart', (e) => e.preventDefault());

  // ---- geometry ------------------------------------------------------------
  let fit = 1;
  let portrait = false;
  const resize = (): void => {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // a portrait screen needs the camera further back to hold the whole
    // plot, and the model sat lower, under the words
    portrait = camera.aspect < 1.15;
    fit = portrait ? Math.pow(1.15 / camera.aspect, 0.85) : 1;
  };
  new ResizeObserver(resize).observe(host);

  // ---- the loop ------------------------------------------------------------
  const tick = (t: number): void => {
    if (!visible || !hoverables.length) {
      raf = 0;
      return;
    }
    raf = requestAnimationFrame(tick);
    const dt = Math.min(64, t - (last || t));
    last = t;

    const r = section.getBoundingClientRect();
    const travel = Math.max(1, r.height - innerHeight);
    const p = reduced ? 0 : MathUtils.clamp(-r.top / travel, 0, 1);
    if (Math.abs(p - lastP) > 0.004) {
      lastP = p;
      section.style.setProperty('--mqp', p.toFixed(3));
    }

    if (intro < 1) intro = Math.min(1, intro + dt / 1600);
    const ease = 1 - Math.pow(1 - intro, 3);
    if (!reduced && !dragging && t - lastTouch > 1800) driftYaw += 0.00007 * dt;
    uYaw += (uYawT - uYaw) * 0.12;
    uPitch += (uPitchT - uPitch) * 0.12;

    const k = flight(p);
    const yaw = k.yaw + uYaw + driftYaw;
    const pitch = MathUtils.clamp(k.pitch + uPitch, 0.14, 1.25);
    const dist = k.dist * radius * fit * (1.3 - 0.3 * ease);
    const ty = k.ty + (portrait ? 78 : 0);
    camera.position.set(Math.sin(yaw) * Math.cos(pitch) * dist, Math.sin(pitch) * dist, Math.cos(yaw) * Math.cos(pitch) * dist);
    camera.lookAt(0, ty, 0);

    if (ptrDirty && !dragging) {
      ptrDirty = false;
      ray.setFromCamera(ptr, camera);
      const hit = ray.intersectObjects(hoverables, false)[0];
      setHot(hit ? (hit.object.userData.pin as string) : null);
    }

    const w = host.clientWidth;
    const h = host.clientHeight;
    for (const pin of pins) {
      v.copy(pin.anchor).project(camera);
      const x = ((v.x + 1) / 2) * w;
      pin.el.style.left = `${x}px`;
      pin.el.style.top = `${((1 - v.y) / 2) * h}px`;
      pin.el.toggleAttribute('data-behind', v.z > 1);
      // near an edge the tag swings inward while the dot stays on the building
      const edge = x < w * 0.22 ? 'l' : x > w * 0.78 ? 'r' : '';
      if (edge) pin.el.dataset.edge = edge;
      else delete pin.el.dataset.edge;
    }

    renderer.render(scene, camera);
    if (!ready) {
      ready = true;
      section.setAttribute('data-ready', '');
    }
  };

  new IntersectionObserver(
    (entries) => {
      visible = entries.some((e) => e.isIntersecting);
      if (visible && !raf) raf = requestAnimationFrame(tick);
    },
    { rootMargin: '10% 0px' }
  ).observe(section);

  renderer.domElement.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    ready = false;
    section.removeAttribute('data-ready');
  });
  renderer.domElement.addEventListener('webglcontextrestored', () => {
    if (visible && !raf) raf = requestAnimationFrame(tick);
  });
}
