/**
 * Builds the site for a classic web host (cPanel, FTP) and zips it.
 *
 *   node scripts/pack.mjs                      -> https://smartino.ai, root of the domain
 *   node scripts/pack.mjs https://exemplu.ro   -> another domain
 *   node scripts/pack.mjs https://exemplu.ro /subfolder
 *
 * Two things differ from the GitHub Pages build:
 *
 * 1. The base path. Pages serves the project from /Smartino-AI/, so every
 *    asset there is prefixed. On a domain of its own the site sits at the
 *    root and the prefix has to go, or every stylesheet and image 404s.
 * 2. An .htaccess. The host serves the files; it needs to be told to compress
 *    text, to cache the hashed assets for a year and the HTML not at all, and
 *    what a .glb is -- Apache does not know, and an unknown type is served as
 *    a download, which breaks the 3D model.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const site = process.argv[2] ?? 'https://smartino.ai';
const base = process.argv[3] ?? '/';
const out = 'smartino-site.zip';

console.log(`construiesc pentru ${site}${base === '/' ? '' : base}`);
fs.rmSync('dist', { recursive: true, force: true });
execFileSync('npx', ['astro', 'build'], {
  stdio: 'inherit',
  env: { ...process.env, SITE_URL: site, BASE_PATH: base },
});

fs.writeFileSync(
  path.join('dist', '.htaccess'),
  `# Smartino — configurație pentru hosting clasic (Apache / LiteSpeed).
# Fișierul este citit automat; nu trebuie activat de nicăieri.

# --- Compresie -------------------------------------------------------------
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json image/svg+xml model/gltf-binary
</IfModule>

# --- Tipuri pe care Apache nu le știe --------------------------------------
<IfModule mod_mime.c>
  AddType model/gltf-binary .glb
  AddType image/webp .webp
  AddType font/woff2 .woff2
</IfModule>

# --- Cache -----------------------------------------------------------------
# Fișierele din /_astro/ au hash în nume: dacă se schimbă conținutul, se
# schimbă și numele, deci pot fi ținute un an. HTML-ul nu se cache-uiește,
# altfel o modificare publicată nu ajunge la vizitatorii care au fost deja.
<IfModule mod_headers.c>
  <FilesMatch "\\.(css|js|woff2|webp|jpg|png|svg|glb)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  <FilesMatch "\\.html$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
</IfModule>

# --- Adrese fără slash final ------------------------------------------------
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_URI} !/$
  RewriteRule ^(.*)$ /$1/ [R=301,L]
</IfModule>
`,
  'utf8'
);

fs.rmSync(out, { force: true });
execFileSync('zip', ['-qry', `../${out}`, '.'], { cwd: 'dist' });

const kb = fs.statSync(out).size / 1024;
console.log(`\n${out}: ${(kb / 1024).toFixed(1)} MB`);
console.log('conține:', fs.readdirSync('dist').join(' '));
