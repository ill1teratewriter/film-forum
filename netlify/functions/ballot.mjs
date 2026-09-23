/* The ballot, counted by the server.
 *
 * POST  {chapter, road, name}  records a vote. One per person; voting again
 *       replaces the earlier one. Nothing is returned but an acknowledgement —
 *       no running total, because the site never shows one.
 * GET   ?chapter=3             says whether voting is open. While it is open it
 *       gives no numbers at all. Once it has closed it gives the winner and how
 *       the room divided, as percentages of the votes cast.
 *
 * Votes are kept in Netlify Blobs, keyed by chapter. Names are the identity —
 * there are no accounts — so a member can change their mind and the second vote
 * lands on top of the first.
 */
import { getStore } from '@netlify/blobs';
import { BALLOTS } from './ballots.mjs';
import { tally, stars, normalise } from './tally.mjs';

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
    const road = sent.road;
    const name = normalise(sent.name);
    const b = BALLOTS[n];

    if (!b) return json({ error: 'no such ballot' }, 404);
    if (road !== 'hb' && road !== 'sb') return json({ error: 'no such road' }, 400);
    if (!name || name.length > 60) return json({ error: 'name needed' }, 400);

    const now = Date.now();
    if (now < Date.parse(b.opens)) return json({ error: 'not open yet' }, 409);
    if (now > Date.parse(b.closes)) return json({ error: 'voting has closed' }, 409);

    const votes = (await store.get(`ch${n}`, { type: 'json' })) || {};
    votes[name] = road;
    await store.setJSON(`ch${n}`, votes);
    return json({ ok: true });
  }

  if (req.method === 'GET') {
    const n = String(url.searchParams.get('chapter') || '');
    const b = BALLOTS[n];
    if (!b) return json({ error: 'no such ballot' }, 404);

    const now = Date.now();
    if (now < Date.parse(b.opens)) return json({ state: 'soon' });
    if (now <= Date.parse(b.closes)) return json({ state: 'open' });   /* deliberately no numbers */

    const votes = (await store.get(`ch${n}`, { type: 'json' })) || {};
    const result = tally(votes, stars(process.env.FF_STARS)[n]);
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
