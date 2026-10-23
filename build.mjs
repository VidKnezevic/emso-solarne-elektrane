// Statički build bez ovisnosti: spaja partiale, puni SEO meta podatke,
// generira sitemap.xml, robots.txt i kopira assete u dist/.
//   node build.mjs                                  → GitHub Pages pregled
//   SITE_URL=https://emso.hr node build.mjs         → produkcija
//   NOINDEX=1 node build.mjs                        → staging koji se ne indeksira
import { readFile, writeFile, mkdir, cp, readdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import config from './site.config.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');

const SITE_URL = (process.env.SITE_URL || config.siteUrl).replace(/\/+$/, '');
const BASE = new URL(SITE_URL + '/').pathname;
const NOINDEX = process.env.NOINDEX === '1';
const BUILD_ID = Date.now().toString(36);
const TODAY = new Date().toISOString().slice(0, 10);

const c = config.company;
const globals = {
  siteUrl: SITE_URL,
  base: BASE,
  siteName: config.siteName,
  locale: config.locale,
  lang: config.lang,
  themeColor: config.themeColor,
  buildId: BUILD_ID,
  today: TODAY,
  year: String(new Date().getFullYear()),
  formEndpoint: config.formEndpoint,
  robots: NOINDEX ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  ...Object.fromEntries(Object.entries(c).map(([k, v]) => ['c.' + k, v])),
  ...Object.fromEntries(Object.entries(config.media).map(([k, v]) => ['m.' + k, v])),
};

async function readPartials() {
  const dir = path.join(SRC, 'partials');
  const out = {};
  for (const f of await readdir(dir)) {
    if (f.endsWith('.html')) out[f.replace(/\.html$/, '')] = await readFile(path.join(dir, f), 'utf8');
  }
  return out;
}

function parsePage(raw, file) {
  const m = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (!m) throw new Error(`${file}: nedostaje front-matter blok`);
  let meta;
  try {
    meta = JSON.parse(m[1]);
  } catch (e) {
    throw new Error(`${file}: neispravan JSON u front-matteru – ${e.message}`);
  }
  return { meta, body: raw.slice(m[0].length) };
}

function render(tpl, vars, partials, depth = 0) {
  if (depth > 10) throw new Error('Preduboko ugniježđeni partiali');
  let out = tpl.replace(/\{\{>\s*([\w-]+)\s*\}\}/g, (_, name) => {
    if (!(name in partials)) throw new Error(`Nepostojeći partial: ${name}`);
    return render(partials[name], vars, partials, depth + 1);
  });
  // {{#if key}}…{{/if}}
  out = out.replace(/\{\{#if ([\w.]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, k, inner) => (vars[k] ? inner : ''));
  out = out.replace(/\{\{([\w.]+)\}\}/g, (whole, k) => {
    if (!(k in vars)) throw new Error(`Nepoznata varijabla {{${k}}}`);
    return vars[k];
  });
  return out;
}

// Tvrdi razmak između broja i jedinice (50 %, 6.000 €, 6,3 kWp) – izvan <script> blokova.
const typo = (html) =>
  html
    .split(/(<script[\s\S]*?<\/script>)/g)
    .map((part, i) => (i % 2 ? part : part.replace(/(\d) (%|€|kWp|kWh|kW|km|god\.|m²)(?=[\s<.,;:)!?/–]|$)/g, '$1&nbsp;$2')))
    .join('');

const escAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    // "+" i "-" se ne diraju jer calc() zahtijeva razmake oko njih
    .replace(/\s*([{};,>~])\s*/g, '$1')
    .replace(/;}/g, '}')
    .replace(/:\s+/g, ':')
    .trim();
}

async function build() {
  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });

  const partials = await readPartials();
  const pageFiles = (await readdir(path.join(SRC, 'pages'))).filter((f) => f.endsWith('.html'));
  const sitemap = [];
  const warnings = [];

  for (const file of pageFiles) {
    const raw = await readFile(path.join(SRC, 'pages', file), 'utf8');
    const { meta, body } = parsePage(raw, file);
    const slug = meta.slug ?? '';
    const pageUrl = SITE_URL + '/' + (slug ? slug + '/' : '');

    if (meta.title.length > 62) warnings.push(`${file}: title ima ${meta.title.length} znakova (preporuka ≤ 60)`);
    if (meta.description.length > 160) warnings.push(`${file}: description ima ${meta.description.length} znakova (preporuka ≤ 160)`);

    const crumbs = [{ name: 'Solarne elektrane', url: SITE_URL + '/' }, ...(meta.breadcrumb || []).map((b) => ({ name: b, url: pageUrl }))];
    const breadcrumbScript =
      crumbs.length < 2
        ? ''
        : `<script type="application/ld+json">${JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: crumbs.map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b.name, item: b.url })),
          })}</script>`;

    const vars = {
      ...globals,
      title: escAttr(meta.title),
      ...(meta.robots ? { robots: meta.robots } : {}),
      description: escAttr(meta.description),
      url: pageUrl,
      slug,
      ogImage: SITE_URL + '/assets/img/' + (meta.ogImage || 'og-solarne-elektrane.png'),
      ogImageAlt: escAttr(meta.ogImageAlt || meta.title),
      ogType: meta.ogType || 'website',
      bodyClass: meta.bodyClass || '',
      pageScripts: (meta.scripts || [])
        .map((s) => `<script type="module" src="${BASE}assets/js/${s}.js?v=${BUILD_ID}"></script>`)
        .join('\n    '),
      preloadImage: meta.preloadImage ? `<link rel="preload" as="image" href="${meta.preloadImage}" fetchpriority="high">` : '',
      breadcrumbScript,
      navActiveSolar: slug === '' ? 'aria-current="page"' : '',
      navActiveEv: slug === 'elektro-punionice' ? 'aria-current="page"' : '',
      navActivePoticaji: slug === 'poticaji-za-solarne-elektrane-2026' ? 'aria-current="page"' : '',
      isHome: slug === '' ? '1' : '',
      // Na naslovnici sidra vode na sekcije iste stranice, drugdje na naslovnicu.
      home: slug === '' ? '' : BASE,
    };
    const bodyHtml = render(body, vars, partials);
    const html = typo(render(partials.layout, { ...vars, content: bodyHtml }, partials));

    const outFile = meta.outFile ? path.join(DIST, meta.outFile) : path.join(DIST, slug, 'index.html');
    await mkdir(path.dirname(outFile), { recursive: true });
    await writeFile(outFile, html);

    if (!meta.excludeFromSitemap) sitemap.push({ loc: pageUrl, priority: meta.priority ?? '0.8', lastmod: meta.lastmod || TODAY });
  }

  // Asseti
  await cp(path.join(SRC, 'assets'), path.join(DIST, 'assets'), { recursive: true });
  const cssPath = path.join(DIST, 'assets/css/main.css');
  await writeFile(cssPath, minifyCss(await readFile(cssPath, 'utf8')));
  await cp(path.join(SRC, 'static'), DIST, { recursive: true });
  for (const f of ['site.webmanifest', 'llms.txt']) {
    const p = path.join(DIST, f);
    await writeFile(p, render(await readFile(p, 'utf8'), globals, partials));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap
  .sort((a, b) => b.priority - a.priority)
  .map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <priority>${u.priority}</priority>\n  </url>`)
  .join('\n')}
</urlset>
`;
  await writeFile(path.join(DIST, 'sitemap.xml'), xml);
  await writeFile(
    path.join(DIST, 'robots.txt'),
    NOINDEX ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
  );
  await writeFile(path.join(DIST, '.nojekyll'), '');

  const size = (await stat(cssPath)).size;
  console.log(`✓ ${pageFiles.length} stranica → dist/  (SITE_URL=${SITE_URL}, base=${BASE}, css=${(size / 1024).toFixed(1)} kB)`);
  warnings.forEach((w) => console.warn('⚠ ' + w));
}

build().catch((e) => {
  console.error('✗ Build nije uspio:', e.message);
  process.exit(1);
});
