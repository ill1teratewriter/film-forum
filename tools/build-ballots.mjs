/* Tell the ballot function what it is allowed to count.
 *
 * Read off chapters.js at build time so the closing times can never drift apart
 * from the ones the site shows. Only what the server needs: the chapter number,
 * when its ballot opens and closes, and the two film titles.
 *
 * Julian's own picks are NOT here — they are a tie-break and live in a Netlify
 * environment variable, so they never reach the repository or the browser.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const js = readFileSync(join(ROOT, 'chapters.js'), 'utf8');

const ballots = {};
const re = /n: (\d+), part: \d+, slug: 'chapter-\d'([\s\S]*?)(?=\{ n: \d+, part|\n {2}\];)/g;
let m;
while ((m = re.exec(js))) {
  const n = +m[1], body = m[2];
  const opens = body.match(/opens:\s*'([^']+)'/);
  const closes = body.match(/closes:\s*'([^']+)'/);
  if (!opens || !closes) continue;
  const films = {};
  for (const road of ['hb', 'sb']) {
    const f = body.match(new RegExp(road + ": \\['((?:[^'\\\\]|\\\\.)*)'"));
    if (f) films[road] = f[1].replace(/\\u2019/g, '’').replace(/\\'/g, "'");
  }
  ballots[n] = { opens: opens[1], closes: closes[1], films };
}

const dir = join(ROOT, 'netlify', 'functions');
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'ballots.mjs'),
  '/* Written by tools/build-ballots.mjs on every deploy. Do not edit by hand. */\n' +
  'export const BALLOTS = ' + JSON.stringify(ballots, null, 2) + ';\n');

console.log(`ballots: ${Object.keys(ballots).length} chapters the server will count`);
