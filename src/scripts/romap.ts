/**
 * The map: Romania and the Republic of Moldova as one lit plate.
 *
 * Both countries are drawn as extruded plates -- one per county and per raion --
 * standing on a dark table, with light arcs leaving the two points where the
 * brand has a starting point: Bucharest (Otopeni is that same pixel at this
 * scale) and Chisinau. An arc lands, the unit under it glows, its name is
 * written in the air for two seconds, and the whole thing rocks slowly so the
 * plate reads as an object rather than a picture.
 *
 * The geometry is in src/data/ro-map.json: a bounding box, the two origins and
 * the outlines, already projected and simplified, as flat number arrays. It is
 * imported as raw text and parsed, which keeps 92 KB of coordinates out of the
 * type-checker and out of the module graph as anything but a string.
 *
 * Like the maquette, this is a separate chunk fetched only when the section is
 * near, and it is never fetched at all under reduced motion -- the pre-rendered
 * poster is the whole section until this file says otherwise.
 *
 * Ported from the standalone page the client built in Claude Code. Two things
 * changed and nothing else: the colours are the brand's, and the three.js calls
 * are the modern ones. r128 had no colour management, so every colour was
 * hand-converted to linear and light intensities carried an implicit factor of
 * PI; r185 does both itself, so the conversions are gone and the intensities
 * are the old ones times PI. The point lights that ride the arcs are the one
 * value that could not simply be scaled: their falloff is inverse-square now
 * rather than a linear ramp, so the number is re-derived, not converted.
 */
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  ConeGeometry,
  CubicBezierCurve3,
  DirectionalLight,
  DoubleSide,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Group,
  HemisphereLight,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  Path,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  Points,
  PointsMaterial,
  RingGeometry,
  Scene,
  ShaderMaterial,
  ShadowMaterial,
  Shape,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  TubeGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import raw from '../data/ro-map.json?raw';
import { prefersReducedMotion } from '../lib/motion';

type RoData = {
  /** [minX, minY, maxX, maxY] of both countries together */
  bbox: [number, number, number, number];
  /** where the arcs leave from; `home` are the units they never target */
  origins: { p: [number, number]; g: number; home: string[] }[];
  /** n: name, c: code, g: country, p: label point, parts: rings of flat x,y pairs */
  counties: { n: string; c: string; g: number; p: [number, number]; parts: number[][][] }[];
};

const CONFIG = {
  accent: 0x13b4c6, // the brand turquoise -- the arcs, the beacons, the glow
  accentCore: 0xe9fffd, // the hot core of an arrow
  mapTop: 0x2a2c30, // anthracite: the top face of a county
  mapSide: 0x141619, // darker anthracite: the extruded edge
  lineColor: 0xc3cad4, // the hairlines between counties
  lineOpacity: 0.34,
  borderColor: 0xe1e7ee, // the outline of each country
  borderOpacity: 0.72,
  depth: 0.28, // thickness of the plate
  intervalMin: 1500, // ms between launches
  intervalMax: 2400,
  burst: [0.25, 0.4, 0.35], // Romania: odds of 1, 2 or 3 arcs per launch
  burstMoldova: [0.6, 0.4], // Moldova: odds of 1 or 2
  intervalScale: [1, 1.2], // Moldova launches a little less often
  burstStagger: 110, // ms between the arcs of one launch
  maxArcs: 12, // arcs in the air at once, both countries together
  originLabels: ['SMARTINO', 'SMARTINO'],
  rotationAmplitude: 0.17, // radians, the slow rock
  rotationSpeed: 0.4,
  particles: 220,
  pixelRatioMax: 2,
  /** r128 had no physical light units; these are the old values times PI */
  lightScale: Math.PI,
  /** re-derived, not converted: inverse-square falloff replaced a linear ramp */
  arcLight: 0.38,
  /** air around the silhouette, where the arcs and the names go */
  fitMargin: 1.1,
} as const;

const RO = JSON.parse(raw) as RoData;

/* Colours are written as sRGB and converted by three itself now, so there is
 * no hand conversion here -- doing it as well would darken everything twice. */
const col = (hex: number): Color => new Color(hex);
const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t: number): number => {
  const c1 = 1.2;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const easeInOutSine = (t: number): number => -(Math.cos(Math.PI * t) - 1) / 2;
const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const rand = (a: number, b: number): number => a + Math.random() * (b - a);

const UP_Y = new Vector3(0, 1, 0);
const _v = new Vector3();

type County = {
  name: string;
  code: string;
  g: number;
  topMat: MeshStandardMaterial;
  meshes: Mesh[];
  glow: number;
  point: Vector3;
  dist: number;
  delay: number;
};

type Arc = {
  group: Group;
  curve: CubicBezierCurve3;
  core: Mesh<BufferGeometry, ShaderMaterial>;
  sheath: Mesh<BufferGeometry, ShaderMaterial>;
  head: Sprite;
  cone: Mesh<ConeGeometry, MeshBasicMaterial>;
  light: PointLight | null;
  county: County;
  start: number;
  duration: number;
  landed: boolean;
  landedAt: number;
  done: boolean;
};

export function mount(section: HTMLElement): void {
  const stage = section.querySelector<HTMLElement>('[data-romap-stage]');
  const host = section.querySelector<HTMLElement>('[data-romap-canvas]');
  const labelLayer = section.querySelector<HTMLElement>('[data-romap-labels]');
  if (!stage || !host || !labelLayer) return;
  const reduced = prefersReducedMotion();

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return; // no WebGL: the poster is the section
  }
  const shadows = stage.clientWidth >= 900;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, CONFIG.pixelRatioMax));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.shadowMap.enabled = shadows;
  renderer.shadowMap.type = PCFSoftShadowMap;
  host.appendChild(renderer.domElement);

  function radialTexture(size: number, stops: [number, string][]): CanvasTexture {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    for (const s of stops) g.addColorStop(s[0], s[1]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    return t;
  }

  /* ---- scene and camera ------------------------------------------------- */
  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 0.1, 200);
  const CAM_ELEV = Math.atan2(0.82, 1); // ~39 degrees above the horizon
  const CAM_TARGET = new Vector3((RO.bbox[0] + RO.bbox[2]) / 2, (RO.bbox[1] + RO.bbox[3]) / 2, 0.1);
  let fitDist = 20;
  function placeCamera(elev: number, dist: number): void {
    camera.position.set(0, -Math.cos(elev) * dist, Math.sin(elev) * dist).add(CAM_TARGET);
    camera.lookAt(CAM_TARGET);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld(true);
  }

  // a procedural studio: three softboxes, so the anthracite has something to
  // reflect. Without it the plates read as flat grey paper.
  {
    const pmrem = new PMREMGenerator(renderer);
    const s = new Scene();
    s.background = new Color(0x101114);
    const geo = new PlaneGeometry(1, 1);
    const panel = (hex: number, k: number, w: number, h: number, pos: Vector3): void => {
      const m = new Mesh(geo, new MeshBasicMaterial({ color: new Color(hex).multiplyScalar(k), side: DoubleSide }));
      m.scale.set(w, h, 1);
      m.position.copy(pos);
      m.lookAt(0, 0, 0);
      s.add(m);
    };
    panel(0xffffff, 1.6, 8, 4, new Vector3(0, -3, 9));
    panel(0xd6dde8, 0.8, 10, 1.6, new Vector3(2, 8, 5));
    panel(0xffe7c9, 0.45, 3, 6, new Vector3(-9, 0, 3));
    scene.environment = pmrem.fromScene(s, 0).texture;
    pmrem.dispose();
  }

  scene.add(new HemisphereLight(col(0xe4e6ea), col(0x0a0a0b), 0.5 * CONFIG.lightScale));
  const key = new DirectionalLight(col(0xffffff), 0.95 * CONFIG.lightScale);
  key.position.set(-5, -7, 9);
  if (shadows) {
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    const sc = key.shadow.camera;
    sc.left = -7.5;
    sc.right = 7.5;
    sc.top = 7.5;
    sc.bottom = -7.5;
    sc.near = 1;
    sc.far = 40;
    sc.updateProjectionMatrix();
    key.shadow.bias = -0.0006;
  }
  scene.add(key);
  const rim = new DirectionalLight(col(0xc2cfe0), 0.45 * CONFIG.lightScale);
  rim.position.set(6, 9, 4);
  scene.add(rim);

  const tiltGroup = new Group();
  scene.add(tiltGroup);
  const mapGroup = new Group();
  tiltGroup.add(mapGroup);

  /* ---- the table under the map ------------------------------------------ */
  const poolTex = radialTexture(512, [
    [0, 'rgba(90,175,182,0.20)'],
    [0.45, 'rgba(70,140,148,0.06)'],
    [1, 'rgba(0,0,0,0)'],
  ]);
  const pool = new Mesh(
    new PlaneGeometry(26, 26),
    new MeshBasicMaterial({ map: poolTex, transparent: true, depthWrite: false })
  );
  pool.position.set(CAM_TARGET.x, CAM_TARGET.y, -0.02);
  tiltGroup.add(pool); // the table tilts with the map, or the plate sinks under it
  if (shadows) {
    const sh = new Mesh(new PlaneGeometry(30, 30), new ShadowMaterial({ opacity: 0.5 }));
    sh.receiveShadow = true;
    sh.position.set(CAM_TARGET.x, CAM_TARGET.y, -0.01);
    tiltGroup.add(sh);
  }

  /* ---- the counties, as extruded plates ---------------------------------- */
  const sideMat = new MeshStandardMaterial({
    color: col(CONFIG.mapSide),
    roughness: 0.78,
    metalness: 0.25,
    envMapIntensity: 0.5,
  });
  const origins = RO.origins.map((o) => ({
    v: new Vector3(o.p[0], o.p[1], CONFIG.depth),
    g: o.g,
    home: o.home,
  }));

  const counties: County[] = RO.counties.map((c) => {
    const topMat = new MeshStandardMaterial({
      color: col(CONFIG.mapTop),
      roughness: 0.5,
      metalness: 0.3,
      envMapIntensity: 0.85,
      emissive: col(CONFIG.accent),
      emissiveIntensity: 0,
    });
    const meshes = c.parts.map((part) => {
      const rings = part.map((flat) => {
        const pts: Vector2[] = [];
        for (let i = 0; i < flat.length; i += 2) pts.push(new Vector2(flat[i], flat[i + 1]));
        return pts;
      });
      const shape = new Shape(rings[0]);
      for (let i = 1; i < rings.length; i++) shape.holes.push(new Path(rings[i]));
      const geo = new ExtrudeGeometry(shape, { depth: CONFIG.depth, bevelEnabled: false });
      const mesh = new Mesh(geo, [topMat, sideMat]);
      mesh.castShadow = shadows;
      mapGroup.add(mesh);
      return mesh;
    });
    return {
      name: c.n,
      code: c.c,
      g: c.g,
      topMat,
      meshes,
      glow: 0,
      delay: 0,
      point: new Vector3(c.p[0], c.p[1], CONFIG.depth),
      dist: Math.hypot(c.p[0] - origins[c.g].v.x, c.p[1] - origins[c.g].v.y),
    };
  });

  /* ---- the hairlines ------------------------------------------------------
   * An edge shared by two counties is an inner line, an edge belonging to one
   * is the country's outline. Counting how often each segment appears sorts
   * them without knowing anything about the geography. */
  const lineZ = CONFIG.depth + 0.004;
  const segs = new Map<string, { n: number; ax: number; ay: number; bx: number; by: number }>();
  for (const c of RO.counties) {
    for (const part of c.parts) {
      for (const flat of part) {
        const n = flat.length / 2;
        for (let i = 0; i < n; i++) {
          const j = (i + 1) % n;
          const a = flat[2 * i] + ',' + flat[2 * i + 1];
          const b = flat[2 * j] + ',' + flat[2 * j + 1];
          const k = a < b ? a + '|' + b : b + '|' + a;
          const e = segs.get(k);
          if (e) e.n++;
          else segs.set(k, { n: 1, ax: flat[2 * i], ay: flat[2 * i + 1], bx: flat[2 * j], by: flat[2 * j + 1] });
        }
      }
    }
  }
  const innerPts: number[] = [];
  const outerPts: number[] = [];
  segs.forEach((s) => {
    (s.n > 1 ? innerPts : outerPts).push(s.ax, s.ay, lineZ, s.bx, s.by, lineZ);
  });
  function lineObj(arr: number[], hex: number, opacity: number): LineSegments<BufferGeometry, LineBasicMaterial> {
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(arr, 3));
    const m = new LineBasicMaterial({ color: col(hex), transparent: true, opacity, depthWrite: false });
    const l = new LineSegments(g, m);
    l.renderOrder = 2;
    return l;
  }
  const innerLines = lineObj(innerPts, CONFIG.lineColor, CONFIG.lineOpacity);
  const outerLines = lineObj(outerPts, CONFIG.borderColor, CONFIG.borderOpacity);
  mapGroup.add(innerLines, outerLines);

  /* ---- sprites and rings -------------------------------------------------- */
  const glowTex = radialTexture(128, [
    [0, 'rgba(255,255,255,1)'],
    [0.2, 'rgba(255,255,255,0.55)'],
    [0.5, 'rgba(255,255,255,0.12)'],
    [1, 'rgba(255,255,255,0)'],
  ]);
  function makeSprite(hex: number, scale: number): Sprite {
    const m = new SpriteMaterial({
      map: glowTex,
      color: col(hex),
      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false,
      depthTest: false,
    });
    const s = new Sprite(m);
    s.scale.set(scale, scale, 1);
    s.renderOrder = 5;
    return s;
  }
  const ringGeo = new RingGeometry(0.455, 0.5, 72);
  function ringMesh(): Mesh<RingGeometry, MeshBasicMaterial> {
    const m = new Mesh(
      ringGeo,
      new MeshBasicMaterial({
        color: col(CONFIG.accent),
        transparent: true,
        opacity: 0,
        blending: AdditiveBlending,
        depthWrite: false,
        side: DoubleSide,
      })
    );
    m.renderOrder = 4;
    return m;
  }

  /* ---- the two beacons ---------------------------------------------------- */
  const beacons = origins.map((o, oi) => {
    const grp = new Group();
    grp.position.copy(o.v);
    mapGroup.add(grp);
    const dot = new Mesh(new SphereGeometry(0.05, 16, 12), new MeshBasicMaterial({ color: col(CONFIG.accentCore) }));
    dot.position.z = 0.03;
    grp.add(dot);
    const glow = makeSprite(CONFIG.accent, 0.9);
    glow.position.z = 0.06;
    grp.add(glow);
    const rings = [0, 1].map((i) => {
      const r = ringMesh();
      r.position.z = 0.008;
      r.userData.phase = i * 0.5 + oi * 0.25;
      grp.add(r);
      return r;
    });
    return { group: grp, glow, rings };
  });

  /* ---- ambient particles --------------------------------------------------- */
  let particles: Points | null = null;
  if (CONFIG.particles > 0) {
    const N = CONFIG.particles;
    const pos = new Float32Array(N * 3);
    const vel = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      pos[3 * i] = rand(-9.5, 9.5);
      pos[3 * i + 1] = rand(-7, 8);
      pos[3 * i + 2] = rand(0.1, 4.5);
      vel[i] = rand(0.04, 0.12);
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(pos, 3));
    const m = new PointsMaterial({
      size: 0.09,
      map: glowTex,
      color: col(0x8fc6cb),
      transparent: true,
      opacity: 0.5,
      blending: AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    particles = new Points(g, m);
    particles.userData.vel = vel;
    scene.add(particles);
  }

  /* ---- the arcs ------------------------------------------------------------
   * The tube is drawn whole and revealed by the shader: uHead is where the
   * light has got to, uTail where it has already faded. Two of them -- a thin
   * hot core and a wide soft sheath whose rim falls off with the viewing angle. */
  const arcVert = `
    varying float vT; varying vec3 vN; varying vec3 vV;
    void main() {
      vT = uv.x;
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vN = normalize(normalMatrix * normal);
      vV = normalize(-mv.xyz);
      gl_Position = projectionMatrix * mv;
    }`;
  const arcFrag = `
    uniform vec3 uColor; uniform vec3 uHot; uniform float uHead; uniform float uTail;
    uniform float uOpacity; uniform float uSoft;
    varying float vT; varying vec3 vN; varying vec3 vV;
    void main() {
      float f = abs(dot(normalize(vN), normalize(vV)));
      float radial = mix(1.0, pow(f, 2.5), uSoft);
      float ahead = 1.0 - smoothstep(uHead - 0.012, uHead, vT);
      float behind = smoothstep(uTail, uTail + 0.3, vT);
      float hot = smoothstep(uHead - 0.18, uHead, vT);
      float a = ahead * behind * radial * uOpacity;
      vec3 c = mix(uColor, uHot, hot * (1.0 - uSoft * 0.6)) * (1.0 + hot * 0.8);
      gl_FragColor = vec4(c * a, a);
    }`;
  function arcMaterial(soft: number, opacity: number): ShaderMaterial {
    return new ShaderMaterial({
      uniforms: {
        uColor: { value: col(CONFIG.accent) },
        uHot: { value: col(CONFIG.accentCore) },
        uHead: { value: 0 },
        uTail: { value: 0 },
        uOpacity: { value: opacity },
        uSoft: { value: soft },
      },
      vertexShader: arcVert,
      fragmentShader: arcFrag,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      premultipliedAlpha: true,
    });
  }
  const coneGeo = new ConeGeometry(0.06, 0.2, 12);
  coneGeo.translate(0, -0.1, 0); // the tip sits exactly at the head of the arc

  // the lights that ride the arcs live in the scene permanently: a fixed count
  // means the shader is compiled once and never again
  const lightPool: PointLight[] = [];
  for (let i = 0; i < CONFIG.maxArcs; i++) {
    const L = new PointLight(col(CONFIG.accent), 0, 4, 2);
    L.position.set(0, 0, 1);
    mapGroup.add(L);
    lightPool.push(L);
  }

  const arcs: Arc[] = [];
  const ripples: { mesh: Mesh<RingGeometry, MeshBasicMaterial>; start: number; life: number }[] = [];
  const splashes: { mesh: Mesh<PlaneGeometry, MeshBasicMaterial>; start: number; life: number }[] = [];
  const labels: { el: HTMLElement; anchor: Vector3; start: number; life: number; w: number }[] = [];
  const splashGeo = new PlaneGeometry(1, 1);
  let nowMs = 0;

  function launchArc(county: County, delay: number): void {
    const S = origins[county.g].v.clone();
    const E = county.point.clone();
    const chord = E.clone().sub(S);
    const d = chord.length();
    const lift = MathUtils.clamp(d * 0.45, 0.5, 2.6);
    const c1 = S.clone().addScaledVector(chord, 0.22);
    c1.z += lift;
    const c2 = S.clone().addScaledVector(chord, 0.78);
    c2.z += lift;
    const curve = new CubicBezierCurve3(S, c1, c2, E);
    const g = new Group();
    const core = new Mesh(new TubeGeometry(curve, 110, 0.02, 6, false), arcMaterial(0, 1.0));
    const sheath = new Mesh(new TubeGeometry(curve, 110, 0.085, 10, false), arcMaterial(1, 0.62));
    core.renderOrder = 6;
    sheath.renderOrder = 6;
    const head = makeSprite(CONFIG.accent, 0.55);
    head.renderOrder = 7;
    const cone = new Mesh(
      coneGeo,
      new MeshBasicMaterial({
        color: col(CONFIG.accentCore),
        transparent: true,
        blending: AdditiveBlending,
        depthWrite: false,
      })
    );
    cone.renderOrder = 7;
    g.add(core, sheath, head, cone);
    mapGroup.add(g);
    arcs.push({
      group: g,
      curve,
      core,
      sheath,
      head,
      cone,
      light: lightPool.pop() ?? null,
      county,
      start: nowMs + delay,
      duration: MathUtils.clamp(850 + d * 170, 1000, 2100),
      landed: false,
      landedAt: 0,
      done: false,
    });
  }

  function impact(county: County, p: Vector3): void {
    county.glow = 1;
    for (let i = 0; i < 2; i++) {
      const r = ringMesh();
      r.position.set(p.x, p.y, CONFIG.depth + 0.008);
      mapGroup.add(r);
      ripples.push({ mesh: r, start: nowMs + i * 220, life: 1300 });
    }
    // a flat pool of light lying on the county's face, so the plate cannot cut it
    const sp = new Mesh(
      splashGeo,
      new MeshBasicMaterial({
        map: glowTex,
        color: col(CONFIG.accent),
        transparent: true,
        opacity: 0.9,
        blending: AdditiveBlending,
        depthWrite: false,
      })
    );
    sp.position.set(p.x, p.y, CONFIG.depth + 0.012);
    sp.renderOrder = 4;
    mapGroup.add(sp);
    splashes.push({ mesh: sp, start: nowMs, life: 1000 });

    const el = document.createElement('span');
    el.className = 'romap__name';
    el.textContent = county.name;
    labelLayer!.appendChild(el);
    labels.push({
      el,
      anchor: county.point.clone().add(new Vector3(0, 0, 0.36)),
      start: nowMs,
      life: 2300,
      w: el.offsetWidth, // measured once, here, rather than every frame
    });
  }

  function disposeArc(arc: Arc): void {
    mapGroup.remove(arc.group);
    arc.core.geometry.dispose();
    arc.core.material.dispose();
    arc.sheath.geometry.dispose();
    arc.sheath.material.dispose();
    arc.head.material.dispose();
    arc.cone.material.dispose();
    if (arc.light) {
      arc.light.intensity = 0;
      lightPool.push(arc.light);
    }
  }

  function updateArc(arc: Arc): void {
    const e = nowMs - arc.start;
    const D = arc.duration;
    arc.group.visible = e >= 0;
    if (e < 0) return;
    const hp = clamp01(e / D);
    const tp = clamp01((e - 0.6 * D) / (D * 1.1));
    const head = easeInOutSine(hp);
    const tail = easeInOutSine(tp);
    arc.core.material.uniforms.uHead.value = head;
    arc.core.material.uniforms.uTail.value = tail;
    arc.sheath.material.uniforms.uHead.value = head;
    arc.sheath.material.uniforms.uTail.value = tail;
    const p = arc.curve.getPointAt(head);
    const tan = arc.curve.getTangentAt(Math.min(head, 0.999));
    arc.head.position.copy(p);
    arc.cone.position.copy(p);
    arc.cone.quaternion.setFromUnitVectors(UP_Y, tan);
    if (arc.light) arc.light.position.set(p.x, p.y, p.z + 0.25);
    if (!arc.landed) {
      if (arc.light) arc.light.intensity = CONFIG.arcLight * clamp01(e / 250);
      const s = 0.55 + 0.1 * Math.sin(nowMs * 0.02);
      arc.head.scale.set(s, s, 1);
      if (hp >= 1) {
        arc.landed = true;
        arc.landedAt = nowMs;
        impact(arc.county, p);
      }
    }
    if (arc.landed) {
      const k = 1 - clamp01((nowMs - arc.landedAt) / 750);
      const fs = 0.55 + (1 - k) * 0.8;
      arc.head.scale.set(fs, fs, 1);
      arc.head.material.opacity = k;
      arc.cone.material.opacity = k;
      if (arc.light) arc.light.intensity = CONFIG.arcLight * k;
      if (tp >= 1 && nowMs - arc.landedAt > 800) arc.done = true;
    }
  }

  /* ---- the names, as HTML projected from 3D anchors ------------------------ */
  let width = 1;
  let height = 1;
  const originLabels = origins.map((o, i) => {
    const el = document.createElement('span');
    el.className = 'romap__name romap__name--origin';
    el.textContent = CONFIG.originLabels[i] ?? 'SMARTINO';
    labelLayer.appendChild(el);
    return { el, v: o.v, w: el.offsetWidth };
  });
  function project(anchor: Vector3, w = 0): { x: number; y: number; ok: boolean } {
    _v.copy(anchor).applyMatrix4(mapGroup.matrixWorld).project(camera);
    const x = (_v.x * 0.5 + 0.5) * width;
    const half = w / 2 + 6;
    return {
      x: half * 2 < width ? Math.min(width - half, Math.max(half, x)) : x,
      y: (-_v.y * 0.5 + 0.5) * height,
      ok: _v.z < 1,
    };
  }
  function updateLabels(lineAlpha: number): void {
    for (const L of originLabels) {
      const s = project(L.v, L.w);
      L.el.style.opacity = String((s.ok ? 0.9 : 0) * lineAlpha);
      L.el.style.transform = `translate(${s.x.toFixed(1)}px,${s.y.toFixed(1)}px) translate(-50%, 12px)`;
    }
    for (let i = labels.length - 1; i >= 0; i--) {
      const L = labels[i];
      const t = nowMs - L.start;
      if (t > L.life) {
        L.el.remove();
        labels.splice(i, 1);
        continue;
      }
      const op = t < 250 ? t / 250 : t < L.life - 500 ? 1 : (L.life - t) / 500;
      const s = project(L.anchor, L.w);
      L.el.style.opacity = String(s.ok ? op : 0);
      L.el.style.transform = `translate(${s.x.toFixed(1)}px,${(s.y + (1 - op) * 6).toFixed(1)}px) translate(-50%, -100%)`;
    }
  }

  /* ---- framing ------------------------------------------------------------
   * The camera distance is searched, not guessed: the plate has to fit at every
   * angle of the rock and at every aspect ratio, without a margin anyone tuned.
   *
   * What it is fitted against is the silhouette, not the bounding box. Three of
   * that box's four corners are open sea, and the near ones -- the bottom two,
   * closest to a camera looking down at 39 degrees -- spread the widest under
   * perspective, so fitting them kept the camera far enough back to leave the
   * map filling less than half the frame. A convex hull of the outline is
   * enough and is exact: a projective transform maps the hull of a set to the
   * hull of its image, so whatever holds for these points holds for all of
   * them. Then one margin on top, for the arcs that fly above the plate. */
  const HULL = ((): [number, number][] => {
    const p: [number, number][] = [];
    for (let i = 0; i < outerPts.length; i += 3) p.push([outerPts[i], outerPts[i + 1]]);
    p.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cross = (o: [number, number], a: [number, number], b: [number, number]): number =>
      (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lower: [number, number][] = [];
    for (const q of p) {
      while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop();
      lower.push(q);
    }
    const upper: [number, number][] = [];
    for (let i = p.length - 1; i >= 0; i--) {
      const q = p[i];
      while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop();
      upper.push(q);
    }
    lower.pop();
    upper.pop();
    return lower.concat(upper);
  })();

  function fitCamera(): void {
    const amp = reduced ? 0 : CONFIG.rotationAmplitude;
    const pts: Vector3[] = [];
    const zt = CONFIG.depth + 0.7;
    for (const a of [-amp, 0, amp]) {
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      for (const [x, y] of HULL) {
        for (const z of [0, zt]) pts.push(new Vector3(x * ca - y * sa, x * sa + y * ca, z));
      }
    }
    let lo = 4;
    let hi = 80;
    for (let i = 0; i < 28; i++) {
      const mid = (lo + hi) / 2;
      placeCamera(CAM_ELEV, mid);
      const ok = pts.every((p) => {
        _v.copy(p).project(camera);
        return Math.abs(_v.x) <= 0.98 && Math.abs(_v.y) <= 0.96;
      });
      if (ok) hi = mid;
      else lo = mid;
    }
    fitDist = hi * CONFIG.fitMargin;
    placeCamera(CAM_ELEV, fitDist);
  }
  function resize(): void {
    const w = stage!.clientWidth;
    const h = stage!.clientHeight;
    if (!w || !h) return;
    width = w;
    height = h;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    fitCamera();
  }
  if (window.ResizeObserver) new ResizeObserver(resize).observe(stage);
  else window.addEventListener('resize', resize);
  resize();

  /* ---- the hand ------------------------------------------------------------ */
  let mouseX = 0;
  let mouseY = 0;
  let tiltX = 0;
  let tiltY = 0;
  if (!reduced) {
    stage.addEventListener('pointermove', (ev) => {
      const r = stage.getBoundingClientRect();
      mouseX = ((ev.clientX - r.left) / r.width - 0.5) * 2;
      mouseY = ((ev.clientY - r.top) / r.height - 0.5) * 2;
    });
    stage.addEventListener('pointerleave', () => {
      mouseX = 0;
      mouseY = 0;
    });
  }

  /* ---- who gets an arc, and when ------------------------------------------
   * One scheduler per origin, each firing only at its own country, never at the
   * unit it sits in, and never at the last few it already lit. */
  const hubs = origins.map((o, i) => ({
    eligible: counties.filter((c) => c.g === o.g && o.home.indexOf(c.code) === -1),
    burst: i === 0 ? CONFIG.burst : CONFIG.burstMoldova,
    scale: CONFIG.intervalScale[i] ?? 1,
    recent: [] as County[],
    next: 0,
  }));
  function pickCounty(hub: (typeof hubs)[number]): County {
    const pool = hub.eligible.filter((c) => hub.recent.indexOf(c) === -1);
    const c = pool[Math.floor(Math.random() * pool.length)];
    hub.recent.push(c);
    if (hub.recent.length > Math.min(8, hub.eligible.length - 2)) hub.recent.shift();
    return c;
  }

  /* ---- the entrance: the plate rises in a wave out of Bucharest ------------ */
  const INTRO_MS = reduced ? 0 : 1600;
  const SWOOP_MS = reduced ? 0 : 2600;
  const maxDist = counties.reduce((m, c) => Math.max(m, c.dist), 0);
  for (const c of counties) {
    c.delay = (SWOOP_MS ? 350 : 0) + (c.dist / maxDist) * INTRO_MS * 0.85;
    for (const m of c.meshes) m.scale.z = reduced ? 1 : 0.08;
  }
  hubs.forEach((h, i) => {
    h.next = Math.max(INTRO_MS + 500, SWOOP_MS + 400) + i * 900;
  });
  let introDone = reduced;
  let introYaw = 0;

  /* ---- the loop ------------------------------------------------------------ */
  let rafId = 0;
  let lastT = 0;
  let visible = false;
  let pageVisible = !document.hidden;
  let painted = false;

  function frame(t: number): void {
    rafId = 0;
    if (!visible || !pageVisible) return;
    rafId = requestAnimationFrame(frame);
    let dt = lastT ? (t - lastT) / 1000 : 0.016;
    lastT = t;
    dt = Math.min(0.05, Math.max(0.001, dt));
    nowMs += dt * 1000;
    const el = nowMs / 1000;

    let lineAlpha = 1;
    if (!introDone) {
      for (const c of counties) {
        const p = clamp01((nowMs - c.delay) / 650);
        const s = 0.08 + 0.92 * easeOutBack(p);
        for (const m of c.meshes) m.scale.z = s;
      }
      lineAlpha = 0.35 + 0.65 * clamp01((nowMs - INTRO_MS * 0.55) / 900);
      innerLines.material.opacity = CONFIG.lineOpacity * lineAlpha;
      outerLines.material.opacity = CONFIG.borderOpacity * lineAlpha;
      for (const b of beacons) b.glow.material.opacity = clamp01((nowMs - (SWOOP_MS ? 500 : 150)) / 500);
      if (nowMs > INTRO_MS + 1400) {
        introDone = true;
        for (const c of counties) for (const m of c.meshes) m.scale.z = 1;
        innerLines.material.opacity = CONFIG.lineOpacity;
        outerLines.material.opacity = CONFIG.borderOpacity;
        for (const b of beacons) b.glow.material.opacity = 1;
      }
    }

    // the camera drops out of a top-down view into its final angle
    if (SWOOP_MS > 0 && nowMs <= SWOOP_MS + 40) {
      const p = easeInOutCubic(clamp01(nowMs / SWOOP_MS));
      placeCamera(MathUtils.lerp(1.45, CAM_ELEV, p), fitDist * (1 + 0.55 * (1 - p)));
      introYaw = 0.5 * (1 - p);
    } else {
      introYaw = 0;
    }

    mapGroup.rotation.z = reduced
      ? introYaw
      : Math.sin(el * CONFIG.rotationSpeed) * CONFIG.rotationAmplitude + introYaw;
    const breathe = reduced ? 0 : Math.sin(el * 0.27) * 0.035;
    const k = 1 - Math.exp(-dt * 2.5);
    tiltX += (-mouseY * 0.07 - tiltX) * k;
    tiltY += (mouseX * 0.09 - tiltY) * k;
    tiltGroup.rotation.x = tiltX + breathe;
    tiltGroup.rotation.y = tiltY;

    const pulse = 1 + 0.12 * Math.sin(el * 3.2);
    for (const b of beacons) {
      b.glow.scale.set(0.9 * pulse, 0.9 * pulse, 1);
      for (const r of b.rings) {
        const period = 2.4;
        const tt = ((el + (r.userData.phase as number) * period) % period) / period;
        const s = 0.1 + easeOutCubic(tt) * 0.9;
        r.scale.set(s, s, 1);
        r.material.opacity =
          Math.pow(1 - tt, 1.8) * 0.7 * (introDone ? 1 : clamp01((nowMs - (SWOOP_MS ? 700 : 300)) / 600));
      }
    }

    if (introDone) {
      for (const hub of hubs) {
        if (nowMs < hub.next || arcs.length >= CONFIG.maxArcs) continue;
        const r = Math.random();
        let n = 1;
        let acc = 0;
        for (let i = 0; i < hub.burst.length; i++) {
          acc += hub.burst[i];
          if (r < acc) {
            n = i + 1;
            break;
          }
        }
        n = Math.min(n, CONFIG.maxArcs - arcs.length);
        for (let i = 0; i < n; i++) launchArc(pickCounty(hub), i * CONFIG.burstStagger);
        hub.next = nowMs + rand(CONFIG.intervalMin, CONFIG.intervalMax) * hub.scale;
      }
    }
    for (let i = arcs.length - 1; i >= 0; i--) {
      updateArc(arcs[i]);
      if (arcs[i].done) {
        disposeArc(arcs[i]);
        arcs.splice(i, 1);
      }
    }
    for (let i = ripples.length - 1; i >= 0; i--) {
      const R = ripples[i];
      const tt = (nowMs - R.start) / R.life;
      if (tt < 0) {
        R.mesh.material.opacity = 0;
        continue;
      }
      if (tt >= 1) {
        mapGroup.remove(R.mesh);
        R.mesh.material.dispose();
        ripples.splice(i, 1);
        continue;
      }
      const s = 0.1 + easeOutCubic(tt) * 1.0;
      R.mesh.scale.set(s, s, 1);
      R.mesh.material.opacity = Math.pow(1 - tt, 1.7) * 0.85;
    }
    for (let i = splashes.length - 1; i >= 0; i--) {
      const S = splashes[i];
      const tt = (nowMs - S.start) / S.life;
      if (tt >= 1) {
        mapGroup.remove(S.mesh);
        S.mesh.material.dispose();
        splashes.splice(i, 1);
        continue;
      }
      const s = 0.7 + easeOutCubic(tt) * 1.1;
      S.mesh.scale.set(s, s, 1);
      S.mesh.material.opacity = Math.pow(1 - tt, 1.5) * 0.9;
    }
    for (const c of counties) {
      if (c.glow > 0) {
        c.glow = Math.max(0, c.glow - dt * 0.75);
        c.topMat.emissiveIntensity = easeOutCubic(c.glow) * 0.22;
      }
    }

    if (particles) {
      const pos = particles.geometry.attributes.position.array as Float32Array;
      const vel = particles.userData.vel as Float32Array;
      for (let i = 0; i < vel.length; i++) {
        pos[3 * i + 2] += vel[i] * dt;
        pos[3 * i] += Math.sin(el * 0.3 + i) * 0.02 * dt;
        if (pos[3 * i + 2] > 4.8) {
          pos[3 * i + 2] = 0.1;
          pos[3 * i] = rand(-9.5, 9.5);
          pos[3 * i + 1] = rand(-7, 8);
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
    updateLabels(lineAlpha);
    if (!painted) {
      painted = true;
      // only now is there something under the poster worth showing
      section.setAttribute('data-ready', '');
    }
  }

  function wake(): void {
    if (!rafId && visible && pageVisible) {
      lastT = 0;
      rafId = requestAnimationFrame(frame);
    }
  }
  // The clock only runs while the stage is on screen, so the entrance plays for
  // the person watching it rather than for an empty room above the fold.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        wake();
      },
      { threshold: 0.25 }
    ).observe(stage);
  } else {
    visible = true;
  }
  document.addEventListener('visibilitychange', () => {
    pageVisible = !document.hidden;
    wake();
  });
  wake();
}
