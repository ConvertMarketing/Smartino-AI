/**
 * The maquette pipeline: source GLB -> the file the site ships.
 *
 * The source is the raw three.js export from Claude Design (2.3 MB, full
 * float precision; an earlier Draco hand-off had quantized the details
 * away). It carries 2.964 individually named nodes -- every tree, car and
 * parking line -- so rendered as-is it would cost ~3.000 draw calls a frame.
 * That is what makes a phone stutter, not the triangle count (~204k with
 * every instance counted).
 *
 * So: keep names only on what the runtime addresses (the two buildings, the
 * label pins, the plinth), join everything else by material, quantize, and
 * compress with meshopt -- whose decoder is a 30 KB module, against Draco's
 * 300 KB. The building material is also moved onto the brand turquoise, since
 * the palette allows exactly one.
 *
 *   node scripts/model.mjs
 *
 * The Home building photograph on the hero's second card is a frame from the
 * group's campaign film, lifted once with ffmpeg. That is a one-off: the
 * still is committed, and ffmpeg is NOT a dependency of this project -- it
 * would add 77 MB to every CI install for a task nobody repeats. To redo it:
 *
 *   npm i -D --no-save ffmpeg-static
 *   FF=$(node -p "require('ffmpeg-static')")
 *   "$FF" -ss 1.0 -i film.mp4 -frames:v 1 -q:v 2 out.jpg
 */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, instance, flatten, join, weld, quantize, prune, meshopt, textureCompress, transformMesh } from '@gltf-transform/functions';
import sharp from 'sharp';
import draco3d from 'draco3dgltf';
import { MeshoptEncoder } from 'meshoptimizer';
import fs from 'node:fs';

const SRC = 'src/assets/models/snagov-plaza.source.glb';
const OUT = 'public/models/snagov-plaza.glb';

/** Nodes the runtime finds by name: the buildings, the baked pins, the base. */
const KEEP = /^(supermarket|mall_|pin_|soclu$|teren_gazon$)/;

/** #13b4c6 as linear-light RGB, the form glTF stores. */
const srgbToLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const BRAND_TURQUOISE = [0x13, 0xb4, 0xc6].map((v) => srgbToLinear(v / 255));

await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'draco3d.decoder': await draco3d.createDecoderModule(),
  'meshopt.encoder': MeshoptEncoder,
});

const doc = await io.read(SRC);
const root = doc.getRoot();

// Draco was the source's compression; once decoded it must not come back on
// write, meshopt takes its place below.
root.listExtensionsUsed().find((e) => e.extensionName === 'KHR_draco_mesh_compression')?.dispose();

for (const node of root.listNodes()) if (!KEEP.test(node.getName())) node.setName('');
for (const mesh of root.listMeshes()) mesh.setName('');
for (const mat of root.listMaterials()) {
  if (mat.getName() === 'turcoaz') mat.setBaseColorFactor([...BRAND_TURQUOISE, 1]);
}

await doc.transform(dedup());

// After dedup, the supermarket's body and roof are the same unit cube as
// hundreds of other boxes, the pin poles the same cylinder as the umbrella
// poles; instancing would fold them into anonymous batches and leave the
// named nodes empty -- the building simply vanished. A private copy of the
// mesh keeps every addressable node its own geometry.
// quantize() compensates a mesh's node scale once per distinct vertex data,
// and the buildings are all the same unit cube: the body came out right, the
// parapet and the roof exactly twice too big. So every addressable node gets
// a private copy of its mesh AND its node transform baked into the vertices,
// which makes the data unique per node. The label plaques keep their
// translation on the node, since the runtime reads it as the pin anchor.
const IDENTITY = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
for (const node of root.listNodes()) {
  if (!KEEP.test(node.getName()) || !node.getMesh()) continue;
  const mesh = node.getMesh().clone();
  for (const prim of mesh.listPrimitives()) {
    for (const semantic of prim.listSemantics()) prim.setAttribute(semantic, prim.getAttribute(semantic).clone());
    if (prim.getIndices()) prim.setIndices(prim.getIndices().clone());
  }
  if (node.getName().startsWith('pin_placa')) {
    const [sx, sy, sz] = node.getScale();
    transformMesh(mesh, [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1]);
    node.setScale([1, 1, 1]);
  } else {
    transformMesh(mesh, node.getMatrix());
    node.setMatrix(IDENTITY);
  }
  node.setMesh(mesh);
}

await doc.transform(
  // 179 cars, 232 trees, 264 parking lines... each a reuse of one mesh. GPU
  // instancing keeps them as one geometry plus a transform per copy; joining
  // them instead would bake every copy into unique vertices (1.7 MB).
  instance({ min: 3 }),
  flatten(),
  join({ keepNamed: true }),
  weld(),
  // 16-bit positions cost the same bytes as 14-bit (int16 either way) and
  // keep four times the precision: the fine parking lines survive.
  quantize({ quantizePosition: 16, quantizeNormal: 12, quantizeTexcoord: 12 }),
  prune(),
  // the billboard and the two plaque faces: PNG -> WebP, invisible at scene scale
  textureCompress({ encoder: sharp, targetFormat: 'webp', quality: 86 }),
  meshopt({ encoder: MeshoptEncoder, level: 'medium' })
);

fs.mkdirSync('public/models', { recursive: true });
await io.write(OUT, doc);

const bytes = fs.statSync(OUT).size;
let tris = 0, inst = 0;
for (const node of root.listNodes()) {
  const mesh = node.getMesh();
  if (!mesh) continue;
  const batch = node.getExtension('EXT_mesh_gpu_instancing');
  const copies = batch ? batch.listAttributes()[0]?.getCount() ?? 1 : 1;
  inst += batch ? 1 : 0;
  for (const prim of mesh.listPrimitives()) tris += ((prim.getIndices()?.getCount() ?? prim.getAttribute('POSITION').getCount()) / 3) * copies;
}
console.log(`triunghiuri randate: ${Math.round(tris)}, noduri instantiate: ${inst}`);
const named = root.listNodes().filter((n) => n.getName()).map((n) => n.getName());
console.log(`${OUT}: ${(bytes / 1024).toFixed(0)} KB, ${root.listNodes().length} noduri, ${root.listMeshes().length} mesh-uri`);
console.log('noduri cu nume:', named.join(' '));
