/* Build the calendar invitations for the forum.
 *
 * Netlify runs this on every deploy, so the nine .ics files and the season file
 * are always made from the current chapters.js — including the Google Meet link.
 * Paste the link into FORUM.url, push, and the invitations carry it.
 *
 * One .ics per chapter plus one for the whole season, written to /calendar/.
 * A real file beats a download built in the browser: tapping one on a phone
 * hands it straight to the calendar app, which is the whole point.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://illiterate-film-forum.netlify.app';
const TZ = 'America/Los_Angeles';
const HOUR = 18;

const js = readFileSync(join(ROOT, 'chapters.js'), 'utf8');

/* the room link and the length of the call, kept in one place in chapters.js */
const forumUrl = (js.match(/var FORUM = \{[\s\S]*?url:\s*'([^']*)'/) || [, ''])[1].trim();
const minutes = +(js.match(/minutes:\s*(\d+)/) || [, 60])[1];

/* every chapter: number, slug, title, discussion date */
const chapters = [];
const re = /n: (\d+), part: \d+, slug: '(chapter-\d)'([\s\S]*?)(?=\{ n: \d+, part|\n {2}\];)/g;
let m;
while ((m = re.exec(js))) {
  const [, n, slug, body] = m;
  const t = body.match(/title: '((?:[^'\\]|\\.)*)'/);
  const d = body.match(/date: '(\d{4}-\d\d-\d\d)'/);
  if (!t || !d) continue;
  chapters.push({
    n: +n, slug,
    title: t[1].replace(/\\u2019/g, '\u2019').replace(/\\'/g, "'"),
    date: d[1],
  });
}
if (chapters.length !== 9) throw new Error(`found ${chapters.length} chapters, expected 9`);

/* 6 PM in Los Angeles on a given day, as a real instant, daylight saving and all */
function meetAt(date) {
  const [y, mo, d] = date.split('-').map(Number);
  const guess = Date.UTC(y, mo - 1, d, HOUR + 8);
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ, hour12: false, year: 'numeric', month: '2-digit',
    day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const p = {};
  for (const x of f.formatToParts(new Date(guess))) p[x.type] = x.value;
  const asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second);
  const off = (asUTC - guess) / 60000;
  return new Date(Date.UTC(y, mo - 1, d, HOUR) - off * 60000);
}

const stamp = (dt) => dt.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '').replace(/\d\dZ$/, '00Z');
const esc = (t) => t.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

/* iCalendar allows no line over 75 octets; continuations begin with a space */
function fold(line) {
  const out = [];
  let cur = '';
  for (const ch of line) {
    if (Buffer.byteLength(cur + ch) > 73) { out.push(cur); cur = ' '; }
    cur += ch;
  }
  out.push(cur);
  return out.join('\r\n');
}

const NOW = stamp(new Date());

function event(c) {
  const start = meetAt(c.date);
  const end = new Date(start.getTime() + minutes * 60000);
  const page = `${SITE}/${c.slug}/`;
  const where = forumUrl || page;
  let desc = `The Illiterate Writer's Film Forum \u00b7 chapter ${c.n}, ${c.title}. ` +
    `We watch, then we talk it through. The field guide, both roads and the paper editions are at ${page}`;
  desc += forumUrl ? `\nJoin: ${forumUrl}` : '\nThe room link goes out by email before the call.';
  return [
    'BEGIN:VEVENT',
    `UID:ff-elements-ch${c.n}@illiterate-film-forum.netlify.app`,
    `DTSTAMP:${NOW}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    fold(`SUMMARY:${esc(`Film Forum \u00b7 Chapter ${c.n} \u00b7 ${c.title}`)}`),
    fold(`LOCATION:${esc(where)}`),
    fold(`URL:${esc(page)}`),
    fold(`DESCRIPTION:${esc(desc)}`),
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Film Forum starts in 30 minutes',
    'END:VALARM',
    'END:VEVENT',
  ];
}

function calendar(list, name) {
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0',
    "PRODID:-//The Illiterate Writer's Film Forum//The Elements of Film//EN",
    'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    fold(`X-WR-CALNAME:${esc(name)}`),
    `X-WR-TIMEZONE:${TZ}`,
    ...list.flatMap(event),
    'END:VCALENDAR',
  ].join('\r\n') + '\r\n';
}

const out = join(ROOT, 'calendar');
if (!existsSync(out)) mkdirSync(out, { recursive: true });
for (const c of chapters) {
  writeFileSync(join(out, `film-forum-ch${String(c.n).padStart(2, '0')}.ics`),
    calendar([c], `Film Forum \u00b7 Chapter ${c.n}`));
}
writeFileSync(join(out, 'film-forum-season.ics'),
  calendar(chapters, "The Illiterate Writer\u2019s Film Forum"));

console.log(`calendar: ${chapters.length} chapters + the season file`);
console.log(`room link: ${forumUrl || '(none yet — invitations point at the chapter page)'}`);

/* The ballot table is built here too, so one build command does both jobs and
   the two can never be deployed out of step with each other. */
await import('./build-ballots.mjs');
