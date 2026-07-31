import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ARCHETYPES } from '../js/data/archetypes.js';
import { HOOKS } from '../js/data/hooks.js';
import { OMENS } from '../js/data/omens.js';
import { slugify, arch, hook, victim, omenA, omenB } from './gen-prompts.mjs';

const REPO = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
// Sibling checkout, same convention as dramgid-vault next to dramgid-lore-gallery.
// Override with BLEAKWOOD_VAULT if your checkout lives somewhere else.
const VAULT = process.env.BLEAKWOOD_VAULT || path.join(REPO, '..', 'bleakwood-vault');
const PAGES_BASE = 'https://irgendjemandkeinkorper.github.io/bleakwood-vale';

const STYLE_A = 'Painterly gothic illustration, moody desaturated oil painting style, thick visible brushwork, dramatic chiaroscuro lighting, single dominant light source, heavy shadow. Victorian-era (1880s England) setting. Restrained, muted palette — near-black backgrounds, warm parchment cream, tarnished gold, oxblood red, deep moss and slate greens, pale moonlight grey-green. No text, no letters, no words, no borders, no frame — full-bleed image only. Atmosphere of fog, candlelight, and dread; unsettling but not gory or graphic. A single unified image only — one scene, one figure, not a repeating pattern, not a triptych, not tiled, not a grid or filmstrip of multiple panels or copies.';
const STYLE_B = 'Gothic tarot-card illustration, in the tradition of hand-painted Major Arcana artwork — bold flat color fields with fine metallic linework detail, symmetrical/ceremonial frontal composition (like a tarot court card), the central figure or object rendered as a flat stylized icon rather than photorealistic, rich jewel-tone palette against a deep black or midnight background, small celestial motifs (a crescent moon or a star) worked into the composition as symbolism, not decoration. No literal card frame, no text, no numerals. Mood: mystical, ominous, ritualistic rather than cinematic. A single unified image only — one figure or object, not a repeating pattern, not a triptych, not tiled, not a grid or filmstrip of multiple panels or copies of the subject.';

const ASPECT = { archetypes:'3:4', hooks:'3:4', victims:'3:4', omens:'1:1' };

const manifest = [];
const vaultEntities = [];

function addManifest({ id, category, style, side, promptBody, name }) {
  const styleBlock = style === 'painterly' ? STYLE_A : STYLE_B;
  const slugSuffix = side ? `--${side}` : '';
  const savePathRel = `art/images/${style}/${category}/${id}${slugSuffix}`;
  const field = side ? `image_${style}_${side}` : `image_${style}`;
  manifest.push({
    id, category, style, side, field, name,
    prompt: `${styleBlock} ${promptBody}`,
    aspectRatio: ASPECT[category],
    savePath: `${savePathRel}.png`,
    imageUrl: `${PAGES_BASE}/${savePathRel}.png`,
    vaultPath: `${category}/${id}.md`
  });
}

// ---- Archetypes ----
ARCHETYPES.forEach(a => {
  const id = slugify(a.role);
  const d = arch[a.role];
  addManifest({ id, category:'archetypes', style:'painterly', side:'front', promptBody:d.a.front, name:a.role });
  addManifest({ id, category:'archetypes', style:'painterly', side:'turned', promptBody:d.a.turned, name:a.role });
  addManifest({ id, category:'archetypes', style:'tarot', side:'front', promptBody:d.b.front, name:a.role });
  addManifest({ id, category:'archetypes', style:'tarot', side:'turned', promptBody:d.b.turned, name:a.role });
  vaultEntities.push({
    id, type:'archetype', name:a.role,
    tags:['archetype', a.sides[0].tone.toLowerCase(), a.sides[1].tone.toLowerCase()],
    summary:a.flavor,
    body:`# ${a.role}\n\n*${a.flavor}*\n\n## Sides\n- **Side I** (${a.sides[0].tone}) — flips ${a.sides[0].cond}\n- **Side II** (${a.sides[1].tone}) — flips ${a.sides[1].cond}\n\n## Setup questions by Incident\n${HOOKS.map(h=>`- **${h.title}:** ${a.setup[h.id]}`).join('\n')}\n`,
    images:[
      {field:'image_painterly_front', url:null}, {field:'image_painterly_turned', url:null},
      {field:'image_tarot_front', url:null}, {field:'image_tarot_turned', url:null}
    ]
  });
});

// ---- Hooks ----
HOOKS.forEach(h => {
  const id = h.id;
  const d = hook[h.id];
  addManifest({ id, category:'hooks', style:'painterly', side:null, promptBody:d.a, name:h.title });
  addManifest({ id, category:'hooks', style:'tarot', side:null, promptBody:d.b, name:h.title });
  vaultEntities.push({
    id, type:'hook', name:h.title,
    tags:['hook', 'incident'],
    summary:h.epigraph,
    body:`# ${h.title}\n\n*${h.epigraph}*\n\n${h.victimLine}\n\n## Read-aloud intro\n${h.intro.replace(/<br><br>/g, '\n\n')}\n`,
    images:[{field:'image_painterly', url:null}, {field:'image_tarot', url:null}]
  });
});

// ---- Victims (hook-scoped) ----
HOOKS.forEach(h => {
  const id = h.id;
  const d = victim[h.id];
  addManifest({ id, category:'victims', style:'painterly', side:null, promptBody:d.a, name:`The Victim — ${h.title}` });
  addManifest({ id, category:'victims', style:'tarot', side:null, promptBody:d.b, name:`The Victim — ${h.title}` });
  vaultEntities.push({
    id, type:'victim', name:`The Victim — ${h.title}`,
    tags:['victim', h.id],
    summary:h.victimLine,
    related:[h.id],
    body:`# The Victim — ${h.title}\n\n${h.victimLine}\n\nThe Victim's name and specific facts are established live at the table each session, so this entity intentionally has no fixed identity — the art is an obscured/veiled figure that works regardless of what a given table decides.\n`,
    images:[{field:'image_painterly', url:null}, {field:'image_tarot', url:null}]
  });
});

// ---- Omens ----
OMENS.forEach(o => {
  const id = slugify(o.title);
  addManifest({ id, category:'omens', style:'painterly', side:null, promptBody:omenA[o.title], name:o.title });
  addManifest({ id, category:'omens', style:'tarot', side:null, promptBody:omenB[o.title], name:o.title });
  vaultEntities.push({
    id, type:'omen', name:o.title,
    tags:['omen'],
    summary:o.line,
    body:`# ${o.glyph} ${o.title}\n\n*${o.line}*\n`,
    images:[{field:'image_painterly', url:null}, {field:'image_tarot', url:null}]
  });
});

fs.writeFileSync(path.join(REPO, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log('Wrote manifest.json —', manifest.length, 'entries');

// ---- Write vault markdown files ----
let vaultCount = 0;
vaultEntities.forEach(e => {
  const dir = path.join(VAULT, `${e.type}s`);
  fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, `${e.id}.md`);
  const existingImages = {};
  const unrelatedFields = [];

  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Check if starts with ---
    if (!content.startsWith('---\n') && !content.startsWith('---\r\n')) {
      throw new Error(`Malformed frontmatter in ${filePath}: File does not start with '---'`);
    }

    const rest = content.substring(content.indexOf('\n') + 1);
    const endBoundaryIndex = rest.search(/^(?:---)(?:\r?\n|$)/m);

    if (endBoundaryIndex === -1) {
      throw new Error(`Malformed frontmatter in ${filePath}: Closing '---' boundary not found`);
    }

    const fmText = rest.substring(0, endBoundaryIndex);
    const fmLines = fmText.split(/\r?\n/);
    const parsedFields = {};

    for (let i = 0; i < fmLines.length; i++) {
      const line = fmLines[i];
      const trimmed = line.trim();
      if (!trimmed) continue;

      const colonIdx = line.indexOf(':');
      if (colonIdx === -1) {
        throw new Error(`Malformed frontmatter in ${filePath} at line ${i + 2}: Missing colon separator in line "${line}"`);
      }

      const key = line.substring(0, colonIdx).trim();
      const val = line.substring(colonIdx + 1).trim();

      if (!key) {
        throw new Error(`Malformed frontmatter in ${filePath} at line ${i + 2}: Empty key in line "${line}"`);
      }

      parsedFields[key] = val;
    }

    const standardKeys = new Set([
      'id', 'name', 'type', 'tags', 'related', 'summary',
      'image_painterly_front', 'image_painterly_turned',
      'image_tarot_front', 'image_tarot_turned',
      'image_painterly', 'image_tarot'
    ]);

    for (const [key, val] of Object.entries(parsedFields)) {
      if (key.startsWith('image_') && standardKeys.has(key)) {
        if (val) {
          existingImages[key] = val;
        }
      } else if (!standardKeys.has(key)) {
        unrelatedFields.push({ key, val });
      }
    }
  }

  const fmLines = [
    '---',
    `id: ${e.id}`,
    `name: ${JSON.stringify(e.name)}`,
    `type: ${e.type}`,
    `tags: [${e.tags.map(t=>JSON.stringify(t)).join(', ')}]`,
    e.related ? `related: [${e.related.map(t=>JSON.stringify(t)).join(', ')}]` : null,
    `summary: ${JSON.stringify(e.summary)}`,
    ...e.images.map(im => {
      const val = existingImages[im.field] || im.url || '';
      return `${im.field}: ${val}`;
    }),
    ...unrelatedFields.map(field => `${field.key}: ${field.val}`),
    '---'
  ].filter(l => l !== null);

  const fm = fmLines.join('\n') + '\n';
  fs.writeFileSync(filePath, fm + '\n' + e.body);
  vaultCount++;
});
console.log('Wrote', vaultCount, 'vault entity files');

// ---- Vault index.json (mirrors dramgid-vault's schema) ----
const index = {
  world: 'Bleakwood Vale',
  count: vaultEntities.length,
  entities: vaultEntities.map(e => ({
    id: e.id, name: e.name, type: e.type, tags: e.tags,
    related: e.related || [], summary: e.summary, path: `${e.type}s/${e.id}.md`
  }))
};
fs.writeFileSync(path.join(VAULT, 'index.json'), JSON.stringify(index, null, 2));
console.log('Wrote vault index.json');
