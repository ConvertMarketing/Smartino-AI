/**
 * The hero's 3D scene: VIZAVI, literally.
 *
 * Two glowing volumes face each other across a lit gap on a dark showroom
 * floor -- the group's two physical stores, drawn as objects instead of
 * illustrated. Dust drifts up through the light. The camera breathes, follows
 * the pointer, and pulls back as the hero scrolls away.
 *
 * The scene answers the page: hovering a physical-store card in the DOM makes
 * the OPPOSITE building flare -- the same response interaction, carried into
 * the third dimension.
 *
 * Loaded lazily after first paint; the module never runs under
 * prefers-reduced-motion and bails silently when WebGL is unavailable, leaving
 * the drifting CSS gradients as the floor.
 */
import * as THREE from 'three';

const host = document.querySelector<HTMLElement>('[data-scene]');
if (host) init(host);

function init(mount: HTMLElement): void {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch {
    return; // no WebGL: the CSS glows already cover this ground
  }
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0b0f10, 8, 22);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
  camera.position.set(0, 2.1, 8.4);

  // -- floor: a dark plane plus a fading measurement grid --------------------
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60),
    new THREE.MeshStandardMaterial({ color: 0x0c1214, roughness: 0.9, metalness: 0.2 })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const grid = new THREE.GridHelper(40, 56, 0x1a3d43, 0x142b30);
  (grid.material as THREE.Material).transparent = true;
  (grid.material as THREE.Material).opacity = 0.5;
  grid.position.y = 0.001;
  scene.add(grid);

  // -- the two stores, facing across the gap --------------------------------
  const makeStore = (x: number, w: number, h: number, d: number) => {
    const group = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      new THREE.MeshStandardMaterial({ color: 0x101b1e, roughness: 0.35, metalness: 0.55 })
    );
    body.position.y = h / 2;
    group.add(body);

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(body.geometry),
      new THREE.LineBasicMaterial({ color: 0x13b4c6, transparent: true, opacity: 0.85 })
    );
    edges.position.copy(body.position);
    group.add(edges);

    // the lit face turned toward the gap
    const face = new THREE.Mesh(
      new THREE.PlaneGeometry(d * 0.86, h * 0.62),
      new THREE.MeshBasicMaterial({ color: 0x0d6d7a, transparent: true, opacity: 0.9 })
    );
    face.position.set(x > 0 ? -w / 2 - 0.005 : w / 2 + 0.005, h * 0.44, 0);
    face.rotation.y = x > 0 ? -Math.PI / 2 : Math.PI / 2;
    group.add(face);

    group.position.x = x;
    scene.add(group);
    return { edges: edges.material as THREE.LineBasicMaterial, face: face.material as THREE.MeshBasicMaterial };
  };
  // 01 Supermarket (left, smaller, first) · 02 Home (right, larger)
  const s01 = makeStore(-2.7, 2.6, 1.5, 3.4);
  const s02 = makeStore(2.9, 3.1, 2.0, 3.8);

  // -- the band, laid on the floor between them ------------------------------
  const band = new THREE.Mesh(
    new THREE.PlaneGeometry(0.5, 4.4),
    new THREE.MeshBasicMaterial({ color: 0x4bd8e8, transparent: true, opacity: 0.32 })
  );
  band.rotation.x = -Math.PI / 2;
  band.position.y = 0.01;
  scene.add(band);

  // -- light -----------------------------------------------------------------
  scene.add(new THREE.AmbientLight(0x28444b, 1.6));
  const glow = new THREE.PointLight(0x13b4c6, 26, 18, 1.8);
  glow.position.set(0, 2.6, 0.6);
  scene.add(glow);
  const rim = new THREE.DirectionalLight(0x4bd8e8, 0.9);
  rim.position.set(-4, 6, 6);
  scene.add(rim);

  // -- dust in the light -----------------------------------------------------
  const N = 500;
  const pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 16;
    pos[i * 3 + 1] = Math.random() * 6;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const dust = new THREE.Points(
    dustGeo,
    new THREE.PointsMaterial({
      color: 0x4bd8e8, size: 0.035, transparent: true, opacity: 0.55,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
  );
  scene.add(dust);

  // -- DOM -> scene: the response, in 3D ------------------------------------
  // Hovering card 01 flares building 02 and vice versa, mirroring the page.
  const rows = document.querySelector<HTMLElement>('[data-rows]');
  let flare01 = 0, flare02 = 0;
  if (rows) {
    new MutationObserver(() => {
      const a = rows.dataset.active;
      flare02 = a === '01' ? 1 : 0;
      flare01 = a === '02' ? 1 : 0;
    }).observe(rows, { attributes: true, attributeFilter: ['data-active'] });
  }

  // -- pointer + scroll ------------------------------------------------------
  let mx = 0, my = 0;
  window.addEventListener('pointermove', (e) => {
    mx = (e.clientX / window.innerWidth) * 2 - 1;
    my = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  const top = document.querySelector<HTMLElement>('.top')!;
  let leave = 0; // 0 in the hero -> 1 fully scrolled past
  const measure = (): void => {
    const r = top.getBoundingClientRect();
    leave = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight / 2)));
  };
  window.addEventListener('scroll', measure, { passive: true });

  const size = (): void => {
    const w = mount.clientWidth, h = mount.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', size);
  size();
  measure();

  // pause the loop while the hero is offscreen
  new IntersectionObserver((e) => {
    renderer.setAnimationLoop(e[0].isIntersecting ? tick : null);
  }).observe(mount);

  const lerp = (a: number, b: number, k: number): number => a + (b - a) * k;
  let f01 = 0, f02 = 0;

  function tick(t: number): void {
    const s = t / 1000;

    // camera: slow breathing + pointer parallax + scroll pull-back
    camera.position.x = Math.sin(s * 0.16) * 0.5 + mx * 0.9;
    camera.position.y = lerp(2.1 + my * -0.35, 5.2, leave);
    camera.position.z = 8.4 + leave * 4.5;
    camera.lookAt(0, 0.9 - leave * 0.4, 0);

    // dust rises and wraps
    const p = dustGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < N; i++) {
      let y = p.getY(i) + 0.0035;
      if (y > 6) y = 0;
      p.setY(i, y);
    }
    p.needsUpdate = true;

    // the light between them breathes
    glow.intensity = 24 + Math.sin(s * 1.4) * 5;
    band.material.opacity = 0.26 + Math.sin(s * 1.4) * 0.08;

    // response flares ease in and out
    f01 = lerp(f01, flare01, 0.12);
    f02 = lerp(f02, flare02, 0.12);
    s01.edges.opacity = 0.85 + f01 * 0.15;
    s01.face.opacity = 0.9 * (1 + f01 * 0.6);
    s01.face.color.setHex(f01 > 0.5 ? 0x13b4c6 : 0x0d6d7a);
    s02.edges.opacity = 0.85 + f02 * 0.15;
    s02.face.opacity = 0.9 * (1 + f02 * 0.6);
    s02.face.color.setHex(f02 > 0.5 ? 0x13b4c6 : 0x0d6d7a);

    renderer.render(scene, camera);
  }
}
