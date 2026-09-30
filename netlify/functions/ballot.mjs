/* The ballot, counted by the server.
 *
 * POST  {chapter, road, name}   records a vote. One per person; voting again
 *       replaces the earlier one. Nothing is returned but an acknowledgement —
 *       no running total, because the site never shows one.
 * POST  {chapter, clear, name}  takes a vote back out. A member who clears their
 *       vote and then walks away used to leave their old pick in the count.
 * POST  {chapter, key, silence, on}  the chair, by hand, setting one vote aside
 *       or letting it count again. Nothing is deleted; the vote stays in the
 *       store and stays on the roster. This is the only write that needs the key,
 *       and the only one allowed after a ballot has closed — a miscount found on
 *       Monday still has to be fixable.
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
import { tally, me, normalise, roadOf, atOf, hushOf } from './tally.mjs';

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

/* the chair's key, compared here and never sent to a browser. FF_ADMIN is
   accepted too, because a half-finished earlier attempt told him to set that. */
const opens = (key) => {
  const want = String(process.env.FF_KEY || process.env.FF_ADMIN || '');
  return !!want && key === want;
};

/* the silences live in their own key, so recording one can never land on top of
   a vote arriving at the same moment, and a vote can never wipe a silence */
const hushKey = (n) => `ch${n}-silenced`;

/* Calling a ballot before Sunday.
 *
 * The calendar closes every ballot at 23:59 on the Sunday. Sometimes the room
 * has plainly decided long before that — everyone who is going to vote has
 * voted — and the chair wants to call it in the meeting and move on. This is
 * that: one record saying the ballot is over early, written by the chair alone.
 *
 * It stores WHEN, not WHO WON. The winner is still worked out from the votes
 * every time anybody asks, so a vote silenced afterwards still corrects the
 * published result. Freezing the answer here would quietly undo that. */
const calledKey = (n) => `ch${n}-called`;
const calledAt = (rec) => {
  if (!rec || typeof rec !== 'object' || !rec.at) return 0;
  const t = Date.parse(rec.at);
  return isNaN(t) ? 0 : t;
};

/* Everything the roster page says about how the room works lives here rather
 * than in the page, and is sent only with a key that checks out.
 *
 * The page itself is public — anybody who guesses the address gets it, and can
 * read its source. It gives up no votes either way, because the votes are behind
 * the key. But the explanation of how the counting works is worth keeping back
 * too: that the chair has a key at all, that names are matched loosely, that a
 * tie withdraws his vote, that a vote can be silenced. None of that is secret in
 * the sense that it would matter if it got out, and all of it is the sort of
 * thing a member does not need to be thinking about while they vote. So the
 * locked page says nothing, and this arrives with the room. */
const NOTES = {
  heading: 'The room',
  badge: 'Chair only',
  title: 'The room · Film Forum',
  intro:
    'Who has voted, what they picked, and when — newest vote at the top. A member ' +
    'who changed their mind under the same name appears once, with the pick that counts. ' +
    'A vote that shouldn’t count can be silenced by hand, and silencing never deletes ' +
    'anything.',
  notes: [
    '<b>This is the only place the standings exist before Sunday night.</b> The site ' +
    'itself shows no numbers at all while a ballot is open — not to members, not to ' +
    'you — so that nobody votes for the side that is winning. Keep the key to yourself ' +
    'and this stays true.',

    '<b>The key is <code>FF_KEY</code></b> in the Netlify environment variables, and it is ' +
    'remembered in this browser once you have typed it. <b>Chair</b> beside a name means the ' +
    'counter recognises that person as you, from <code>FF_ME</code> — that is the vote ' +
    'that gets withdrawn if the room ties exactly.',

    '<b>Silence</b> takes one vote out of the count and leaves everything else alone. Use it ' +
    'when the same member has voted twice under two spellings — phone and desktop — ' +
    'and the count has no way of knowing they are one person. <b>Nothing is deleted.</b> The ' +
    'vote stays in the store, stays on this page greyed out, and <b>Count it</b> puts it back. ' +
    'Your own older spellings say <b>Superseded</b> instead and need no help; the counter ' +
    'already folds those together.',

    '<b>Rows run newest first, with the hour under each name.</b> So when one person appears ' +
    'twice, the two rows sit near each other and <b>the lower of the two is the older vote</b> ' +
    '— that is the one to silence. If they changed their mind rather than voted twice, ' +
    'the same rule holds: silence the older, keep the one on top.',

    'A silence sets aside a <b>vote</b>, not a person. If a name you silenced votes again ' +
    'afterwards, that newer vote counts and the row is marked <b>Voted again</b> — ' +
    'because a member quietly losing their latest vote to a silence nobody remembers setting ' +
    'would be the worse mistake of the two. Silence it again if it is still one person twice.',
  ],
};

export default async (req) => {
  const url = new URL(req.url);
  const store = getStore('ff-ballots');

  if (req.method === 'POST') {
    let sent;
    try { sent = await req.json(); } catch { return json({ error: 'bad request' }, 400); }

    const n = String(sent.chapter || '');
    const b = BALLOTS[n];
    if (!b) return json({ error: 'no such ballot' }, 404);

    /* the chair setting a vote aside, or letting it count again */
    if (sent.silence !== undefined) {
      if (!opens(sent.key)) return json({ error: 'no' }, 403);
      const who = normalise(sent.silence);
      if (!who) return json({ error: 'name needed' }, 400);

      const votes = (await store.get(`ch${n}`, { type: 'json' })) || {};
      if (!(who in votes)) return json({ error: 'nobody of that name has voted' }, 404);

      const silenced = (await store.get(hushKey(n), { type: 'json' })) || {};
      if (sent.on === false) {
        delete silenced[who];
      } else {
        /* the moment that vote was cast, so a later one from the same name
           surfaces again instead of disappearing into an old decision */
        silenced[who] = { since: new Date().toISOString(), at: atOf(votes[who]) };
      }
      await store.setJSON(hushKey(n), silenced);
      return json({ ok: true, silenced: sent.on !== false });
    }

    /* the chair ending it early, or putting it back */
    if (sent.call !== undefined) {
      if (!opens(sent.key)) return json({ error: 'no' }, 403);
      if (Date.now() < Date.parse(b.opens)) return json({ error: 'not open yet' }, 409);
      if (sent.call === false) {
        await store.setJSON(calledKey(n), null);
        return json({ ok: true, called: null });
      }
      const rec = { at: new Date().toISOString() };
      await store.setJSON(calledKey(n), rec);
      return json({ ok: true, called: rec });
    }

    const name = normalise(sent.name);
    if (!name || name.length > 60) return json({ error: 'name needed' }, 400);

    const now = Date.now();
    if (now < Date.parse(b.opens)) return json({ error: 'not open yet' }, 409);
    if (now > Date.parse(b.closes)) return json({ error: 'voting has closed' }, 409);
    /* called early: shut to voting exactly as if Sunday had come */
    if (calledAt(await store.get(calledKey(n), { type: 'json' }))) {
      return json({ error: 'voting has closed' }, 409);
    }

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
      if (!opens(key)) return json({ error: 'no' }, 403);
      const votes = (await store.get(`ch${n}`, { type: 'json' })) || {};
      const silenced = (await store.get(hushKey(n), { type: 'json' })) || {};
      const called = await store.get(calledKey(n), { type: 'json' });
      const early = calledAt(called);
      const result = tally(votes, isMe, silenced);
      const dropped = new Set(result.superseded || []);
      return json({
        called: early ? { at: called.at } : null,
        state: early || Date.now() > Date.parse(b.closes) ? 'closed'
             : Date.now() < Date.parse(b.opens) ? 'soon' : 'open',
        opens: b.opens, closes: b.closes, films: b.films,
        roster: Object.entries(votes)
          .map(([name, v]) => {
            const hush = hushOf(silenced[name], v);
            return {
              name, road: roadOf(v), at: atOf(v) || null,
              chair: isMe ? !!isMe(name) : false,
              superseded: dropped.has(name),
              silenced: hush === 'hushed',
              /* he silenced this name, and then it voted again: the new vote
                 counts, and he is told rather than left to wonder */
              revoted: hush === 'revoted',
            };
          })
          .filter((r) => r.road)
          /* newest vote first, so a member who appears twice sits next to
             themselves and the older of the two is plainly the lower row —
             that is the one to silence. Votes stored before the hour was
             recorded have nothing to sort on and go to the bottom. */
          .sort((x, y) => (y.at || 0) - (x.at || 0) || x.name.localeCompare(y.name)),
        cast: result.cast, winner: result.winner, split: result.split, broke: result.broke,
        /* the page has no words of its own until the key checks out — even the
           heading and the tab title come down with the room */
        heading: NOTES.heading, badge: NOTES.badge, title: NOTES.title,
        intro: NOTES.intro, notes: NOTES.notes,
      });
    }

    const now = Date.now();
    /* called early counts as Sunday having come: voting shut, result out */
    const early = calledAt(await store.get(calledKey(n), { type: 'json' }));
    if (!early) {
      if (now < Date.parse(b.opens)) return json({ state: 'soon' });
      if (now <= Date.parse(b.closes)) return json({ state: 'open' });  /* deliberately no numbers */
    }

    const votes = (await store.get(`ch${n}`, { type: 'json' })) || {};
    const silenced = (await store.get(hushKey(n), { type: 'json' })) || {};
    const result = tally(votes, isMe, silenced);
    if (!result.winner) return json({ state: 'closed', winner: null, early: !!early });
    return json({
      state: 'closed',
      winner: result.winner,
      film: b.films[result.winner],
      split: result.split,
      early: !!early,          /* the room called it rather than the calendar */
    });
  }

  return json({ error: 'method not allowed' }, 405);
};

export const config = { path: '/api/ballot' };
