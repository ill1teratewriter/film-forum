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

/* `votes` is { normalisedName: 'hb' | 'sb' }.
   `star` is the road Julian picked, which is withdrawn on a tie so the room
   never ends up deadlocked and he never breaks a tie in his own favour. */
export function tally(votes, star) {
  let hb = 0, sb = 0;
  for (const road of Object.values(votes || {})) {
    if (road === 'hb') hb++;
    else if (road === 'sb') sb++;
  }
  const cast = hb + sb;
  if (!cast) return { cast: 0, winner: null, split: null };

  let winner;
  if (hb !== sb) {
    winner = hb > sb ? 'hb' : 'sb';
  } else if (star === 'hb' || star === 'sb') {
    winner = star === 'hb' ? 'sb' : 'hb';        /* his vote is withdrawn */
  } else {
    winner = 'hb';                               /* nothing to break it with */
  }

  /* percentages of the votes cast, never a headcount, and always summing to 100 */
  const pct = Math.round((hb / cast) * 100);
  return { cast, winner, split: { hb: pct, sb: 100 - pct } };
}

/* Julian's picks live in an environment variable, never in the repository:
   FF_STARS="3:hb,4:sb,5:sb,6:sb,7:sb,8:hb,9:sb" */
export function stars(raw) {
  const out = {};
  for (const pair of String(raw || '').split(',')) {
    const [n, road] = pair.split(':').map((x) => (x || '').trim());
    if (n && (road === 'hb' || road === 'sb')) out[n] = road;
  }
  return out;
}
