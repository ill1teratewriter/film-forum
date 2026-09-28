/* The ballot, counted by the server.
 *
 * POST  {chapter, road, name}   records a vote. One per person; voting again
 *       replaces the earlier one. Nothing is returned but an acknowledgement —
 *       no running total, because the site never shows one.
 * POST  {chapter, clear, name}  takes a vote back out. A member who clears their
 *       vote and then walks away used to leave their old pick in the count.
 * GET   ?chapter=3              says whether voting is open. While it is open it
 *       gives no numbers at all. Once it has closed it gives the winner and how
 *       the room divided, as percentages of the votes cast.
 * GET   ?chapter=3&key=…        the roster: every name and their current pick,
 *       for the chair only, open or closed. This is the one place in the whole
 *       site where the standings exist before Sunday night, which is why it is
 *       behind a key.
 *
 * Votes are kept in Netlify Blobs, keyed by chapter. Names are the identity —
 * there are no accounts — so a member can change their mind and the second vote
 * lands on top of the first.
 */
import { getStore } from '@netlify/blobs';
import { BALLOTS } from './ballots.mjs';
import { tally, me, normalise, roadOf, atOf } from './tally.mjs';

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

export default async (req) => {
  const url = new URL(req.url);
  const store = getStore('ff-ballots');

  if (req.method === 'POST') {
    let sent;
    try { sent = await req.json(); } catch { return json({ error: 'bad request' }, 400); }

    const n = String(sent.chapter || '');
    const name = normalise(sent.name);
    const b = BALLOTS[n];

    if (!b) return json({ error: 'no such ballot' }, 404);
    if (!name || name.length > 60) return json({ error: 'name needed' }, 400);

    const now = Date.now();
    if (now < Date.parse(b.opens)) return json({ error: 'not open yet' }, 409);
    if (now > Date.parse(b.closes)) return json({ error: 'voting has closed' }, 409);

    const votes = (await store.get(`ch${n}`, { type: 'json' })) || {};

    /* taking a vote back out */
    if (sent.clear) {
      if (!(name in votes)) return json({ ok: true, had: false });
      delete votes[name];
      await store.setJSON(`ch${n}`, votes);
      return json({ ok: true, had: true });
    }

    if (sent.road !== 'hb' && sent.road !== 'sb') return json({ error: 'no such road' }, 400);
    /* the hour it was cast, so the newest of the chair's several names can win */
    votes[name] = { road: sent.road, at: new Date().toISOString() };
    await store.setJSON(`ch${n}`, votes);
    return json({ ok: true });
  }

  if (req.method === 'GET') {
    const n = String(url.searchParams.get('chapter') || '');
    const b = BALLOTS[n];
    if (!b) return json({ error: 'no such ballot' }, 404);

    const isMe = me(process.env.FF_ME, process.env.FF_NOT_ME);

    /* the chair's own view: who voted, and what they picked, at any hour */
    const key = url.searchParams.get('key');
    if (key) {
      /* FF_KEY is the name; FF_ADMIN is accepted too, because a half-finished
         earlier attempt at this told the chair to set that one instead */
      const want = String(process.env.FF_KEY || process.env.FF_ADMIN || '');
      if (!want || key !== want) return json({ error: 'no' }, 403);
      const votes = (await store.get(`ch${n}`, { type: 'json' })) || {};
      const result = tally(votes, isMe);
      const dropped = new Set(result.superseded || []);
      return json({
        state: Date.now() > Date.parse(b.closes) ? 'closed'
             : Date.now() < Date.parse(b.opens) ? 'soon' : 'open',
        opens: b.opens, closes: b.closes, films: b.films,
        roster: Object.entries(votes)
          .map(([name, v]) => ({
            name, road: roadOf(v), at: atOf(v) || null,
            chair: isMe ? !!isMe(name) : false,
            superseded: dropped.has(name),
          }))
          .filter((r) => r.road)
          .sort((x, y) => x.name.localeCompare(y.name)),
        cast: result.cast, winner: result.winner, split: result.split, broke: result.broke,
      });
    }

    const now = Date.now();
    if (now < Date.parse(b.opens)) return json({ state: 'soon' });
    if (now <= Date.parse(b.closes)) return json({ state: 'open' });   /* deliberately no numbers */

    const votes = (await store.get(`ch${n}`, { type: 'json' })) || {};
    const result = tally(votes, isMe);
    if (!result.winner) return json({ state: 'closed', winner: null });
    return json({
      state: 'closed',
      winner: result.winner,
      film: b.films[result.winner],
      split: result.split,
    });
  }

  return json({ error: 'method not allowed' }, 405);
};

export const config = { path: '/api/ballot' };
