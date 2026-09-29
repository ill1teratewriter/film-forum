/* Counting a ballot.
 *
 * Kept apart from the function that talks to the network so it can be tested on
 * its own: give it a set of votes and it tells you who won and how the room
 * divided. No storage, no request, no clock beyond what it is handed.
 */

/* One vote per person. Names are matched loosely — case and spacing do not
   count — so "sarah  whitfield" and "Sarah Whitfield" are the same member. */
export function normalise(name) {
  return String(name || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

/* the same, with punctuation gone, so "R. Julian" and "R Julian" are one thing */
function plain(name) {
  return normalise(name).replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function words(name) {
  return plain(name).split(' ').filter(Boolean);
}

/* Damerau–Levenshtein, capped: it only has to answer "is this within n edits",
   and the words being compared are people's names, not paragraphs. A swap of two
   neighbouring letters counts as one edit, because that is the typo people
   actually make — Tuttel for Tuttle. */
function within(a, b, n) {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > n) return false;
  const d = [];
  for (let i = 0; i <= a.length; i++) d[i] = [i];
  for (let j = 0; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length] <= n;
}

/* Who counts as the chair.
 *
 * FF_ME is a list of every name he might type, in any order and any number:
 *   FF_ME="R. Julian Tuttle, Julian, Robert, Tuttle, RJT"
 *
 * A name is his if it matches one of those outright, or if any word of it is one
 * of the distinctive words in that list — Julian, Robert, Tuttle — spelled right
 * or spelled nearly right. Short scraps like initials have to be exact, because
 * a two-letter fuzzy match would catch half the room. */
export function me(raw, never) {
  const full = new Set();
  const distinct = new Set();
  for (const piece of String(raw || '').split(',')) {
    const p = plain(piece);
    if (!p) continue;
    full.add(p);
    full.add(p.replace(/ /g, ''));      /* so R.J.T and RJT are one thing */
    for (const w of p.split(' ')) if (w.length >= 4) distinct.add(w);
  }
  if (!full.size) return null;

  /* Spelled nearly right is right, which means a name that is nearly his gets
     caught too — Julia is one letter from Julian, Turtle one from Tuttle. There
     is no rule that can tell a typo from a different person, so FF_NOT_ME is the
     place to name anyone who joins and keeps being mistaken for him:
       FF_NOT_ME="Julia Reyes, Julia"                                        */
  const no = new Set();
  for (const piece of String(never || '').split(',')) {
    const p = plain(piece);
    if (p) { no.add(p); no.add(p.replace(/ /g, '')); }
  }

  return function isMe(name) {
    const p = plain(name);
    if (!p) return false;
    if (no.has(p) || no.has(p.replace(/ /g, ''))) return false;
    if (full.has(p) || full.has(p.replace(/ /g, ''))) return true;
    for (const w of words(name)) {
      if (no.has(w)) continue;
      for (const d of distinct) {
        /* one slip in a short name, two in a long one */
        const slack = w.length >= 8 && d.length >= 8 ? 2 : 1;
        if (w.length >= 4 && within(w, d, slack)) return true;
      }
    }
    return false;
  };
}

/* A vote is stored as { road, at } so the newest one can be told from the oldest.
   Older ballots hold a bare road string; both shapes read the same way here. */
export function roadOf(v) { return typeof v === 'string' ? v : (v && v.road) || null; }
export function atOf(v) {
  if (!v || typeof v !== 'object' || !v.at) return 0;
  var t = Date.parse(v.at);
  return isNaN(t) ? 0 : t;
}

/* Silencing a vote by hand.
 *
 * The chair's own double is caught by name. Anybody else's is not, and cannot
 * be: two rows that look like one person might be one person on two devices or
 * two people with similar names, and no rule can tell. So the chair silences one
 * by hand from the roster, and the silence is recorded as
 *
 *   silenced[name] = { since: <when he silenced it>, at: <the vote it silenced> }
 *
 * `at` is the moment that vote was cast. It is there so a silence sets aside a
 * *vote*, not a person: if that name votes again afterwards, the newer vote is a
 * new statement and it counts, and the roster says so in plain sight. A member
 * losing their latest vote to a silence nobody remembers setting would be the
 * worse failure of the two.
 *
 * Nothing is ever deleted. A silenced vote is still in the store and still on
 * the roster, greyed, one tap from counting again. */
export function hushOf(rec, v) {
  if (!rec) return null;
  const mark = (rec && typeof rec === 'object' && Number(rec.at)) || 0;
  return atOf(v) > mark ? 'revoted' : 'hushed';
}

/* One row per person.
 *
 * The chair answers to several names, which means he can end up in the room
 * twice — once as "Julian" on a laptop, once as "Julian Tuttle" on a phone. Two
 * rows for one man is not a tie-break problem, it is a miscount: it invents a
 * vote. So his rows collapse to the most recent one before anything is counted.
 *
 * This is done for him and nobody else, deliberately. He is the only person
 * whose several names are declared; folding two members together because their
 * names look alike would be a far worse bug than the one it fixed. Everybody
 * else's double is handled by hand, above. */
export function collapse(votes, isMe, silenced) {
  const out = {};
  const superseded = [];
  const hushed = [];
  let chair = null, chairAt = -1, chairRoad = null;
  for (const [name, v] of Object.entries(votes || {})) {
    const road = roadOf(v);
    if (!road) continue;
    /* silenced by hand: out of the count entirely, before anything else looks at
       it, so silencing one of the chair's own rows works the same way */
    if (silenced && hushOf(silenced[name], v) === 'hushed') { hushed.push(name); continue; }
    if (isMe && isMe(name)) {
      const at = atOf(v);
      if (chair === null || at > chairAt) {
        if (chair !== null) superseded.push(chair);
        chair = name; chairAt = at; chairRoad = road;
      } else {
        superseded.push(name);
      }
      continue;
    }
    out[name] = road;
  }
  if (chair !== null) out[chair] = chairRoad;
  return { votes: out, chair, superseded, hushed };
}

/* `votes` is { normalisedName: 'hb' | 'sb' | {road, at} }.
   `isMe` is the matcher above, or null. The chair votes like everybody else and
   his vote sits in the split like everybody else's — it is only on an exact tie
   that it is withdrawn, so that he never breaks a deadlock in his own favour. */
export function tally(votes, isMe, silenced) {
  const one = collapse(votes, isMe, silenced);
  let hb = 0, sb = 0;
  for (const road of Object.values(one.votes)) {
    if (road === 'hb') hb++;
    else if (road === 'sb') sb++;
  }
  const cast = hb + sb;
  if (!cast) return { cast: 0, winner: null, split: null, broke: null,
                      superseded: one.superseded, hushed: one.hushed };

  let winner, broke = null;
  if (hb !== sb) {
    winner = hb > sb ? 'hb' : 'sb';
  } else {
    /* a dead heat: take his one vote back out again */
    const his = one.chair ? one.votes[one.chair] : null;
    if (his) { winner = his === 'hb' ? 'sb' : 'hb'; broke = 'chair withdrew'; }
    else { winner = 'hb'; broke = 'no vote to withdraw'; }   /* the canon road takes it */
  }

  /* percentages of the votes cast, never a headcount, and always summing to 100 */
  const pct = Math.round((hb / cast) * 100);
  return { cast, winner, split: { hb: pct, sb: 100 - pct }, broke,
           superseded: one.superseded, hushed: one.hushed };
}
