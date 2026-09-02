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
 */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, instance, flatten, join, weld, quantize, prune, meshopt, textureCompress } from '@gltf-transform/functions';
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
for (const node of root.listNodes()) {
  if (KEEP.test(node.getName()) && node.getMesh()) node.setMesh(node.getMesh().clone());
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
