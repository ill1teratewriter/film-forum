/* ===========================================================================
   FILM FORUM · THE ELEMENTS OF FILM
   The one file that knows the book.

   Nine chapters in three parts. Every page reads this: the contents page,
   the tab strip and masthead on each chapter, the "what's next" block, and
   the ballot sign that follows a member around the site.

   To move the book forward, edit CHAPTERS below:
     - a chapter gets `page: true` once its field guide is uploaded
     - `ballot` opens voting on the contents page at `opens`, closes at `closes`
     - once the room has chosen, add `voted`, `color`, `rule`, and the films
     - `split: { hb: 68, sb: 32 }` prints how the room divided, as a share of the
       votes cast. It appears only after the ballot has closed, and never as a
       headcount, so a thin week still reads as a result. Leave it out and the
       cards simply say nothing.
   Dates are discussion dates (YYYY-MM-DD). Ballot times carry a time zone.

   THE RHYTHM · everything lands on a Sunday, two weeks to a chapter:
     Sunday 1, 6:00 PM PT   we meet and talk about the chapter
     Sunday 1, that evening the next chapter's two films go on the ballot
     Sunday 2, 11:59 PM PT  voting closes, the winner is announced
     Sunday 3, 6:00 PM PT   we meet about the next chapter
   So a member gets a week to vote and then a week to watch whatever won.
   =========================================================================== */
(function () {
  var PARTS = {
    1: { no: 'Part One',   name: 'Story',  line: 'The shape, the clock, the narrator.' },
    2: { no: 'Part Two',   name: 'Craft'  },
    3: { no: 'Part Three', name: 'People' }
  };

  var CHAPTERS = [
    { n: 1, part: 1, slug: 'chapter-1', page: true,
      /* the question the next chapter opens with, used to end the one before */
      hook: 'Who decided a story needs three acts, and what were films doing before anybody said so?',
      aw: { hb: { bp: true, t: 'Won 3 Academy Awards in 1944, including Best Picture' } },
      title: 'Rules Before We Break Them', subj: 'Structure', line: 'the shape under every story', date: '2026-09-13',
      rule: 'The three act rulebook was published in 1979, thirty seven years after Casablanca was shot without one.',
      hb: ['Casablanca', '1942 · 102 min · dir. Michael Curtiz'],
      sb: ['Sullivan’s Travels', '1941 · 90 min · dir. Preston Sturges'],
      voted: 'hb', color: '#e8bd5c' },
    { n: 2, part: 1, slug: 'chapter-2', page: true,
      /* the question the next chapter opens with, used to end the one before */
      hook: 'What happens to a story once the clock is running?',
      aw: { hb: { t: 'Won 3 Academy Awards in 2018: Film Editing, Sound Editing, Sound Mixing' } },
      title: 'Ticking Clock', subj: 'Time', line: 'how a film spends your minutes', date: '2026-09-27',
      rule: 'That a story must fit inside one day began as an Italian scholar’s commentary in 1570, and France enforced it for a century and a half under Aristotle’s name.',
      hb: ['Dunkirk', '2017 · 106 min · dir. Christopher Nolan'],
      sb: ['Run Lola Run', '1998 · 80 min · dir. Tom Tykwer'],
      voted: 'hb', color: '#7fb3de' },
    { n: 3, part: 1, slug: 'chapter-3', title: 'Who\u2019s Watching', subj: 'Point of View', line: 'whose eyes the story lends you',
      /* the question the next chapter opens with, used to end the one before */
      hook: 'Whose eyes does a film lend you — and can the camera lie?',
      rule: 'That the camera never lies grew out of Percy Lubbock turning Henry James’s habits into law in 1921, and Hitchcock broke it with a lying flashback in 1950.', date: '2026-10-11',
      /* hidden until the last minutes of chapter 02's call */
      /* the poster colours the winning card takes on the contents page */
      col: { hb: '#c9433f', sb: '#79b7e8' },
      ballot: {
        opens:  '2026-09-27T18:55:00-07:00',
        closes: '2026-10-04T23:59:00-07:00',
        hb: ['Rear Window', '1954 \u00b7 112 min \u00b7 dir. Alfred Hitchcock',
             'A photographer stuck at home with a broken leg starts watching his neighbours across the courtyard, and becomes sure one of them has committed murder.'],
        sb: ['The Truman Show', '1998 \u00b7 103 min \u00b7 dir. Peter Weir',
             'An insurance salesman slowly realises his whole life has been a television show, broadcast around the clock to the whole world.']
      } },
    { n: 4, part: 2, slug: 'chapter-4', title: 'Frame Game',            subj: 'Frame', line: 'where the film puts things',
      /* the question the next chapter opens with, used to end the one before */
      hook: 'Where does a film put things, and what is it keeping out of the frame?',
      aw: { hb: { t: 'Won 4 Academy Awards in 2015: Production Design, Costume Design, Makeup and Hairstyling, Original Score' } },
      rule: 'The rule of thirds began as a tentative note in an engraver’s 1797 book on landscape painting.',       date: '2026-10-25',
      /* the poster colours the winning card takes on the contents page */
      col: { hb: '#e88fb0', sb: '#cf3b4a' },
      ballot: {
        opens:  '2026-10-11T18:55:00-07:00',
        closes: '2026-10-18T23:59:00-07:00',
        hb: ['The Grand Budapest Hotel', '2014 · 99 min · dir. Wes Anderson',
             'A legendary hotel concierge and his teenage lobby boy are framed for murder in a made-up European country, just as war arrives.'],
        sb: ['In the Mood for Love', '2000 · 98 min · dir. Wong Kar-wai',
             'Hong Kong, 1962. Two neighbours discover their husband and wife are having an affair with each other, and slowly fall into something they refuse to call love. Watch with subtitles on.']
      } },
    { n: 5, part: 2, slug: 'chapter-5', title: 'Witchcraft', subj: 'Editing', line: 'what happens between the shots',
      /* the question the next chapter opens with, used to end the one before */
      hook: 'What happens in the gap between two shots?',
      rule: 'The invisible cut was written down as law in 1953, thirty years after Kuleshov showed the cut was doing all the work.', date: '2026-11-08', spooky: true,
      /* hidden until the last minutes of chapter 04's call; watched over Halloween */
      /* the poster colours the winning card takes on the contents page */
      col: { hb: '#93a08c', sb: '#b9a06a' },
      ballot: {
        opens:  '2026-10-25T18:55:00-07:00',
        closes: '2026-11-01T23:59:00-08:00',
        hb: ['The Blair Witch Project', '1999 \u00b7 81 min \u00b7 dir. Daniel Myrick & Eduardo S\u00e1nchez',
             'Three film students head into the Maryland woods to make a documentary about a local legend, and their footage is all that\u2019s left.'],
        sb: ['The Witch', '2015 \u00b7 92 min \u00b7 dir. Robert Eggers',
             'A Puritan family banished to the edge of a New England forest in the 1630s starts to come apart after their baby vanishes. Watch with subtitles on.']
      } },
    { n: 6, part: 2, slug: 'chapter-6', title: 'Beats and Bullets',     subj: 'Sound', line: 'the half of a film you hear',
      /* the question the next chapter opens with, used to end the one before */
      hook: 'How much of a film are you hearing rather than watching?',
      aw: { hb: { bp: true, t: 'Won 4 Academy Awards in 2008, including Best Picture' } },
      rule: 'That a score should go unnoticed was Hollywood habit, named decades later, after three Soviet directors warned in 1928 that sound would kill the cut.',       date: '2026-11-22',
      /* the poster colours the winning card takes on the contents page */
      col: { hb: '#c8a870', sb: '#e8464a' },
      ballot: {
        opens:  '2026-11-08T18:55:00-08:00',
        closes: '2026-11-15T23:59:00-08:00',
        hb: ['No Country for Old Men', '2007 · 122 min · dir. Joel & Ethan Coen',
             'A Texas hunter stumbles on a drug deal gone wrong and walks off with two million dollars, and a killer with a cattle gun comes after him.'],
        sb: ['Baby Driver', '2017 · 113 min · dir. Edgar Wright',
             'A young getaway driver with ringing in his ears times every heist to the song in his headphones, then falls in love and tries to get out.']
      } },
    { n: 7, part: 3, slug: 'chapter-7', title: 'Family Business',       subj: 'Character', line: 'who someone is, and whether they change',
      /* the question the next chapter opens with, used to end the one before */
      hook: 'Does anybody really change, or do they just get found out?',
      aw: { hb: { bp: true, t: 'Won 3 Academy Awards in 1973, including Best Picture' }, sb: { t: 'Won Best Original Screenplay in 2004' } },
      rule: 'Joseph Campbell described the world’s myths in 1949, and a seven-page Disney memo in 1985 turned them into a checklist.',   date: '2026-12-06',
      /* the poster colours the winning card takes on the contents page */
      col: { hb: '#c9a227', sb: '#f28ab2' },
      ballot: {
        opens:  '2026-11-22T18:55:00-08:00',
        closes: '2026-11-29T23:59:00-08:00',
        hb: ['The Godfather', '1972 · 175 min · dir. Francis Ford Coppola',
             'The youngest son of a New York crime family wants nothing to do with the business. Then someone tries to kill his father.'],
        sb: ['Lost in Translation', '2003 · 102 min · dir. Sofia Coppola',
             'A fading movie star and a young woman stuck in the same Tokyo hotel can’t sleep, and for one week they keep each other company.']
      } },
    { n: 8, part: 3, slug: 'chapter-8', title: 'Real Tears',            subj: 'Performance', line: 'becoming someone, or simply being there',
      /* the question the next chapter opens with, used to end the one before */
      hook: 'Is it acting, or is it being?',
      aw: { hb: { t: 'Won 2 Academy Awards in 2020: Best Actor, Original Score' } },
      rule: 'Lee Strasberg made one piece of Stanislavski’s system into the Method, and Stella Adler came back from Paris saying he had it wrong.', date: '2026-12-20',
      /* the poster colours the winning card takes on the contents page */
      col: { hb: '#7ab648', sb: '#f0a23c' },
      ballot: {
        opens:  '2026-12-06T18:55:00-08:00',
        closes: '2026-12-13T23:59:00-08:00',
        hb: ['Joker', '2019 · 122 min · dir. Todd Phillips',
             'Gotham, 1981. A failed comedian with a condition that makes him laugh uncontrollably is beaten down by the city, until he stops trying to be ignored.'],
        sb: ['City of God', '2002 · 130 min · dir. Fernando Meirelles & Kátia Lund',
             'Two boys grow up in the same Rio de Janeiro housing project. One wants to be a photographer, the other wants to run the place. Watch with subtitles on.']
      } },
    { n: 9, part: 3, slug: 'chapter-9', title: 'Southbound',            subj: 'Genre', line: 'the promise a film makes before it starts',
      /* the question the next chapter opens with, used to end the one before */
      hook: 'What does a film promise you before it starts, and what happens when it breaks that promise?',
      aw: { hb: { t: 'Won Best Original Screenplay in 1992' } },
      rule: 'Nobody in Hollywood called it film noir. A French critic named it in 1946, and Americans started making it on purpose in the 1970s.',       date: '2027-01-03',
      /* the poster colours the winning card takes on the contents page */
      col: { hb: '#4f9fd1', sb: '#e23b3b' },
      ballot: {
        opens:  '2026-12-20T18:55:00-08:00',
        closes: '2026-12-27T23:59:00-08:00',
        hb: ['Thelma & Louise', '1991 · 130 min · dir. Ridley Scott',
             'Two friends leave for a weekend away from their small lives in Arkansas. One night at a roadside bar changes everything, and they keep driving.'],
        sb: ['From Dusk Till Dawn', '1996 · 108 min · dir. Robert Rodriguez',
             'Two bank-robbing brothers take a preacher and his kids hostage and run for the Mexican border, where they plan to hide out until dawn at a roadside bar.']
      } }
  ];

  /* ---------- time ---------- */
  var MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var DAY = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  function day(s) { var p = s.slice(0, 10).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function short(s) { var x = day(s); return MON[x.getMonth()] + ' ' + x.getDate(); }
  function withDay(s) { var x = day(s); return DAY[x.getDay()] + ', ' + MON[x.getMonth()] + ' ' + x.getDate(); }
  function longDate(s) { var x = day(s); return DAYS[x.getDay()] + ', ' + MONTHS[x.getMonth()] + ' ' + x.getDate(); }
  function weekday(s) { return DAYS[day(s).getDay()]; }
  function pad(n) { return '' + n; }
  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function today() { var t = new Date(); t.setHours(0, 0, 0, 0); return t; }
  function daysFromToday(s) { return Math.round((day(s) - today()) / 86400000); }
  function countdown(s) {
    var n = daysFromToday(s);
    if (n < 0) return 'Already run';
    if (n === 0) return 'Today';
    if (n === 1) return 'Tomorrow';
    if (n < 14) return 'In ' + n + ' days';
    return 'In ' + Math.round(n / 7) + ' weeks';
  }

  /* ---------- the Forum hour ----------
     Every discussion is 6:00 PM in Los Angeles. We work out the real moment that
     lands on, then print it in whatever zone the reader's own browser is set to,
     so a member in Chicago or Berlin never has to do the arithmetic. Only the
     Forum line carries a zone: a vote deadline is simply the end of that Sunday,
     and naming a zone there only muddies it. */
  var MEET_TZ = 'America/Los_Angeles', MEET_HOUR = 18;

  /* ---------- where the forum happens ----------
     ONE place to keep the room link. Paste the Google Meet link between the
     quotes below and every join button on the site starts working; leave it
     empty and the site quietly says the link goes out by email instead.
     A free Google Meet room closes at 60 minutes, which is why `minutes` is 60
     — it is also how long the calendar invitations block out. */
  var FORUM = {
    place: 'Google Meet',
    url: 'https://meet.google.com/caw-wosy-mvn',
    minutes: 60
  };
  function forumUrl() { return (FORUM.url || '').trim(); }
  /* the join button is worth showing from an hour before to the end of the call */
  function forumLive(c) {
    var t = meetAt(c).getTime(), now = Date.now();
    return now > t - 60 * 60000 && now < t + FORUM.minutes * 60000;
  }
  function zoneOffset(d, tz) {
    try {
      var f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour12: false, year: 'numeric',
        month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
      var p = {};
      f.formatToParts(d).forEach(function (x) { p[x.type] = x.value; });
      return (Date.UTC(+p.year, +p.month - 1, +p.day, (+p.hour) % 24, +p.minute, +p.second) - d.getTime()) / 60000;
    } catch (e) { return null; }
  }
  function meetAt(c) {
    var p = (c.date || c).slice(0, 10).split('-');
    var base = Date.UTC(+p[0], +p[1] - 1, +p[2], MEET_HOUR, 0);
    var off = zoneOffset(new Date(base + 8 * 3600000), MEET_TZ);   /* probe well clear of the 2 AM switch */
    if (off === null || isNaN(off)) off = -480;
    return new Date(base - off * 60000);
  }
  /* { day: 'Sun, Oct 11', time: '6 PM PDT' } in the reader's own zone */
  function meetLocal(c, long) {
    var d = meetAt(c), dd, tt;
    try {
      dd = new Intl.DateTimeFormat(undefined, long
        ? { weekday: 'long', month: 'long', day: 'numeric' }
        : { weekday: 'short', month: 'short', day: 'numeric' }).format(d);
      tt = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }).format(d);
    } catch (e) {
      dd = long ? longDate(c.date) : withDay(c.date);
      tt = '6:00 PM PT';
    }
    return { at: d, day: dd, time: tt.replace(':00 ', ' ') };
  }

  /* What a chapter is waiting on at this moment, which is the only thing its
     date should ever say: the ballot is coming, the ballot is open, the Forum
     is coming, or it has already run. */
  function beat(c) {
    var now = Date.now();
    if (now >= meetAt(c).getTime() + 2 * 3600000) return 'done';
    if (c.ballot && !c.voted) {
      if (now < new Date(c.ballot.opens).getTime()) return 'soon';
      if (now <= new Date(c.ballot.closes).getTime()) return 'vote';
    }
    return 'forum';
  }

  /* A chapter page should also be able to get somebody into the room: the
     calendar invitation whenever the forum is still ahead, and a join button
     from an hour before the call. */
  function forumRow(c) {
    if (!c || beat(c) === 'done') return '';
    var url = forumUrl(), live = forumLive(c);
    var ics = '/calendar/film-forum-ch' + (c.n < 10 ? '0' : '') + c.n + '.ics';
    return '<div class="forumrow">' +
      (live ? (url
        ? '<a class="join" href="' + esc(url) + '" target="_blank" rel="noopener">Join the forum &rarr;</a>'
        : '<span class="join off">The room link goes out by email</span>') : '') +
      '<a class="ical" href="' + ics + '" download>Add to calendar</a></div>';
  }

  /* the chapter we are on is the first whose discussion has not passed */
  var cur = CHAPTERS.length - 1;
  for (var i = 0; i < CHAPTERS.length; i++) { if (daysFromToday(CHAPTERS[i].date) >= 0) { cur = i; break; } }

  function ballotPhase(c) {
    if (!c.ballot || c.voted) return null;
    var now = Date.now();
    if (now < new Date(c.ballot.opens).getTime()) return null;
    if (now > new Date(c.ballot.closes).getTime()) return 'closed';
    return 'open';
  }
  var bookDone = daysFromToday(CHAPTERS[CHAPTERS.length - 1].date) < 0;
  function state(i) {
    var c = CHAPTERS[i], b = ballotPhase(c);
    if (b) return b === 'open' ? 'ballot' : 'closed';
    if (bookDone) return 'past';
    if (i < cur) return 'past';
    if (i === cur) return c.page ? 'now' : 'next';
    if (i === cur + 1) return 'next';
    return 'future';
  }
  function openBallot() {
    for (var i = 0; i < CHAPTERS.length; i++) if (state(i) === 'ballot') return CHAPTERS[i];
    return null;
  }

  /* previews hosted elsewhere can map a chapter to their own address */
  function href(slug) { return window.FF_HREF ? window.FF_HREF(slug) : '/' + slug + '/'; }
  var HOME = window.FF_HOME || '/';

  /* ---------- your vote, remembered in this browser ---------- */
  function voteKey(c) { return 'ff-vote-' + c.n; }
  function getVote(c) { try { var v = localStorage.getItem(voteKey(c)); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
  function setVote(c, v) { try { localStorage.setItem(voteKey(c), JSON.stringify(v)); } catch (e) {} }
  function clearVote(c) { try { localStorage.removeItem(voteKey(c)); } catch (e) {} }
  /* A member types their name on the first ballot and never again: it is kept in
     their own browser only, and clearing a vote does not forget it. */
  function getName() { try { return localStorage.getItem('ff-name') || ''; } catch (e) { return ''; } }

  /* ---------- which chapters this reader has actually read ----------
     A tick on the film strip used to mean "you voted in this ballot", which
     vanished the moment the ballot closed — it marked a week, not a reader.
     Now it means "you read this chapter's guide", it is earned by reaching the
     end of the guide (or by staying with it a good while), and it stays. */
  function readKey(n) { return 'ff-read-' + n; }
  function isRead(n) { try { return !!localStorage.getItem(readKey(n)); } catch (e) { return false; } }
  function markRead(n) {
    if (isRead(n)) return;
    try { localStorage.setItem(readKey(n), String(Date.now())); } catch (e) {}
    document.dispatchEvent(new CustomEvent('ff:read', { detail: n }));
  }
  function readCount() {
    var k = 0;
    CHAPTERS.forEach(function (c) { if (isRead(c.n)) k++; });
    return k;
  }
  function saveName(n) { try { if (n && n.trim()) localStorage.setItem('ff-name', n.trim()); } catch (e) {} }
  function sendVote(c, road, name) {
    var body = new URLSearchParams({
      'form-name': 'ballot', 'bot-field': '',
      chapter: 'Chapter ' + pad(c.n) + ' · ' + c.title,
      road: road === 'hb' ? 'Hollywood Blvd.' : 'Sunset Blvd.',
      film: c.ballot[road][0], name: name
    }).toString();
    /* The vote goes two places: to the counting function, which is what decides
       the result, and to the Netlify form, which keeps a readable record Julian
       can look through. The form is the one that must succeed for the member to
       be told their vote is in; the counter is allowed to be unreachable (it is,
       for instance, while the site is still being dragged in as a folder). */
    var toCounter = fetch('/api/ballot', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapter: c.n, road: road, name: name })
    }).catch(function () {});
    return fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body })
      .then(function (r) { if (!r.ok) throw new Error('not saved'); })
      .then(function () { return toCounter; });
  }

  /* ---------- the result, once the room has decided ----------
     Every chapter whose ballot has closed asks the server who won. The server
     answers with the winner and how the room divided, and the page fills itself
     in: the winning film, its colour, the share, and the link to its guide. No
     edit, no deploy. If the server cannot be reached the page simply stays as
     it was, which is how it behaved before any of this existed. */
  function fetchResults() {
    var now = Date.now(), waiting = [];
    CHAPTERS.forEach(function (c) {
      if (!c.ballot || c.voted) return;
      if (now <= new Date(c.ballot.closes).getTime()) return;
      waiting.push(fetch('/api/ballot?chapter=' + c.n, { headers: { accept: 'application/json' } })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) {
          if (!d || d.state !== 'closed' || !d.winner) return false;
          c.voted = d.winner;
          if (d.split) c.split = d.split;
          if (c.col && c.col[d.winner]) c.color = c.col[d.winner];
          c.hb = c.ballot.hb.slice(0, 2);
          c.sb = c.ballot.sb.slice(0, 2);
          c.page = true;
          return true;
        })
        .catch(function () { return false; }));
    });
    if (!waiting.length) return;
    Promise.all(waiting).then(function (got) {
      if (got.some(Boolean)) document.dispatchEvent(new CustomEvent('ff:result'));
    });
  }

  var here = (document.body.getAttribute('data-chapter') || '').trim();
  var mine = -1;
  CHAPTERS.forEach(function (c, i) { if (String(c.n) === here) mine = i; });

  /* ---------- shared styles for the pieces this file draws ---------- */
  var base = document.createElement('style');
  base.textContent =
    '.vchip{font-family:Oswald,"Arial Narrow",sans-serif;font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;' +
      'border-radius:999px;padding:7px 13px;text-decoration:none;white-space:nowrap;cursor:pointer;display:inline-block}' +
    '.vchip.open{color:#0c0a12;background:#ff9d2e;font-weight:600}' +
    '.vchip.done{color:#8fd9a8;border:1px solid rgba(143,217,168,.5)}' +
    '.swap .b,.swap .c{display:none}' +
    '@media(hover:hover){.swap:hover .a,.swap:focus-visible .a{display:none}.swap:hover .b,.swap:focus-visible .b{display:inline}}' +
    '.swap.armed .a,.swap.armed .b{display:none}.swap.armed .c{display:inline}' +
    '.vchip.swap:hover,.vchip.swap:focus-visible,.pill.swap:hover,.pill.swap:focus-visible{color:#ffb4c4 !important;border-color:rgba(255,180,196,.6) !important}' +
    '.vchip .cs{display:none}' +
    '@media(max-width:560px){.masthead .vchip{font-size:9.5px;padding:6px 10px;letter-spacing:.14em}' +
      '.masthead .vchip .cl{display:none}.masthead .vchip .cs{display:inline}}' +
    '@media print{.vchip{display:none !important}}' +
    /* getting to the forum, from a chapter page */
    '.forumrow{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:10px 14px;margin-top:18px}' +
    '.forumrow a{font-family:Oswald,"Arial Narrow",sans-serif;font-size:12px;letter-spacing:.18em;' +
      'text-transform:uppercase;text-decoration:none;border-radius:999px;padding:10px 20px;white-space:nowrap}' +
    '.forumrow .join{color:#0c0a12;background:#8fd9a8;font-weight:600;border:1px solid #8fd9a8}' +
    '.forumrow .join.off{background:none;color:#7a7090;border:1px dashed rgba(255,255,255,.18);font-weight:400}' +
    '.forumrow .ical{color:#efe9f5;border:1px solid rgba(255,255,255,.18)}' +
    '.forumrow .ical:hover{border-color:#efe9f5}' +
    '@media print{.forumrow{display:none !important}}' +
    /* a chapter ends on the next one's question: a title is a label, a question is an itch */
    '.nhook{font-family:"Playfair Display",Georgia,serif;font-style:italic;font-size:17px;line-height:1.5;' +
      'color:#d8cfe6;max-width:34ch;margin:14px auto 4px}';
  document.head.appendChild(base);

  /* ---------- the tab strip on chapter pages ---------- */
  var strip = document.querySelector('[data-ff="tabs"]');
  if (strip) {
    var last = Math.max(cur + 1, mine);
    strip.innerHTML = CHAPTERS.slice(0, last + 1).map(function (c, i) {
      var st = state(i);
      var cls = 'tab' + (i === mine ? ' on' : '') + (c.page ? '' : ' future');
      var now = st === 'now' ? ' <span class="live">Now</span>' : (st === 'ballot' ? ' <span class="live">Vote</span>' : '');
      var inner = '<span class="ti">' + pad(c.n) + now + '</span><span class="tn">' + esc(c.title) + '</span>';
      if (c.page) return '<a class="' + cls + '" href="' + href(c.slug) + '">' + inner + '</a>';
      if (st === 'ballot') return '<a class="' + cls + '" href="' + HOME + '?ballot=' + c.n + '">' + inner + '</a>';
      return '<span class="' + cls + '">' + inner + '</span>';
    }).join('');
    var on = strip.querySelector('.tab.on');
    if (on) {
      var over = on.offsetLeft + on.offsetWidth - strip.clientWidth;
      if (over > 0) strip.scrollLeft = over + 16;
    }
  }

  /* ---------- the masthead: current chapter button, and the ballot sign ---------- */
  var curBtn = document.querySelector('[data-ff="current"]');
  if (curBtn) {
    var live = -1;
    for (var k = CHAPTERS.length - 1; k >= 0; k--) { if (CHAPTERS[k].page && k <= cur) { live = k; break; } }
    if (live < 0 || live === mine) curBtn.parentNode.removeChild(curBtn);
    else { curBtn.setAttribute('href', href(CHAPTERS[live].slug)); curBtn.textContent = 'Current chapter →'; }
  }

  function drawChip() {
    var slot = document.getElementById('vchip');
    if (!slot) {
      var host = document.querySelector('.masthead .mast-r') || document.querySelector('.masthead .wrap');
      if (!host) return;
      slot = document.createElement('span');
      slot.id = 'vchip';
      host.insertBefore(slot, host.firstChild);
    }
    var b = openBallot();
    if (!b) { slot.innerHTML = ''; return; }
    slot.innerHTML = getVote(b)
      ? '<span class="vchip done swap" role="button" tabindex="0" data-clear="' + b.n + '" title="Clear my vote">' +
          '<span class="a"><span class="cl">✓ Chapter ' + pad(b.n) + ' vote is in</span><span class="cs">✓ Voted</span></span>' +
          '<span class="b">Clear my vote</span><span class="c">Tap again to clear</span></span>'
      : '<a class="vchip open" href="' + HOME + '?ballot=' + b.n + '"><span class="cl">Chapter ' + pad(b.n) + ' ballot is open · Vote</span>' +
          '<span class="cs">Vote · Ch ' + pad(b.n) + '</span></a>';
  }
  drawChip();

  function doClear(n) {
    var c = CHAPTERS[n - 1];
    if (!c) return;
    clearVote(c);
    drawChip();
    document.dispatchEvent(new CustomEvent('ff:vote'));
  }
  /* Clearing a vote is destructive, and on a touch screen the "Clear my vote"
     label never appears because there is no hover — the chip just says "Voted".
     So on touch the first tap arms it and says so, and only the second tap
     clears; the armed state forgets itself after five seconds. */
  var NO_HOVER = !(window.matchMedia && window.matchMedia('(hover:hover)').matches);
  function disarm() {
    document.querySelectorAll('.swap.armed').forEach(function (x) {
      clearTimeout(x._armT); x.classList.remove('armed');
    });
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-clear]');
    if (!el) { disarm(); return; }
    e.preventDefault(); e.stopPropagation();
    /* a button that says what it does needs no arming; only the little green
       chips do, since on a touch screen they only ever read "Voted" */
    if (NO_HOVER && el.classList.contains('swap') && !el.classList.contains('armed')) {
      disarm();
      el.classList.add('armed');
      el._armT = setTimeout(function () { el.classList.remove('armed'); }, 5000);
      return;
    }
    doClear(+el.getAttribute('data-clear'));
  }, true);
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var el = e.target.closest && e.target.closest('[data-clear]');
    if (!el) return;
    e.preventDefault();
    doClear(+el.getAttribute('data-clear'));
  });
  document.addEventListener('ff:vote', drawChip);

  /* ---------- what comes after this chapter ---------- */
  var next = document.querySelector('[data-ff="next"]');
  if (next) {
    var ni = mine + 1, nc = CHAPTERS[ni];
    if (!nc) {
      next.innerHTML = '<div class="nlab">The end</div>' +
        '<div class="nid">The Elements of Film</div>' +
        '<div class="ntitle">is finished</div>' +
        '<div class="ndate">Nine chapters, eighteen films. Every guide stays up.</div>';
    }
    else {
      var nst = state(ni), lab, go, link = null;
      if (nst === 'ballot') {
        lab = getVote(nc) ? '✓ Your vote is in' : 'The ballot is open';
        go = getVote(nc) ? '<div class="ngo dim">The field guide lands once voting closes</div>' : '<div class="ngo">Vote on the contents page →</div>';
        link = getVote(nc) ? null : HOME + '?ballot=' + nc.n;
      } else if (nc.page) {
        lab = ni === cur ? 'Running now' : 'Next';
        go = '<div class="ngo">Open the field guide →</div>';
        link = href(nc.slug);
      } else if (nst === 'closed') {
        lab = 'Votes counted';
        go = '<div class="ngo dim">The winner and its field guide land here shortly</div>';
      } else {
        lab = countdown(nc.date);
        go = '<div class="ngo dim">The films are chosen by vote at the end of this chapter’s call</div>';
      }
      var body =
        '<div class="nlab">' + lab + '</div>' +
        '<div class="nid">Chapter ' + pad(nc.n) + '</div>' +
        '<div class="ntitle">' + esc(nc.title) + '</div>' +
        (nst === 'ballot' ? '<div class="ndate">Vote by the end of ' + longDate(nc.ballot.closes) + '</div>' : '') +
        (beat(nc) === 'soon' ? '<div class="ndate">Votes open ' + longDate(nc.ballot.opens) + '</div>' : '') +
        (nc.hook ? '<div class="nhook">' + esc(nc.hook) + '</div>' : '') +
        '<div class="ndate">Forum ' + meetLocal(nc, true).day + ' · ' + meetLocal(nc).time + '</div>' + go;
      next.innerHTML = (link ? '<a class="nlink" href="' + link + '">' + body + '</a>' : body) + forumRow(nc);
    }
  }

  /* Earning the tick, on a chapter page: it lands when the reader reaches the
     end of the guide, or after a long enough sitting that they plainly read it.
     Printing does not count, and neither does opening the tab and leaving. */
  if (mine >= 0) {
    var chapNo = CHAPTERS[mine].n;
    var endMark = document.querySelector('[data-ff="next"]') || document.querySelector('footer');
    if (endMark && window.IntersectionObserver) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (en) { if (en.isIntersecting) { markRead(chapNo); io.disconnect(); } });
      }, { threshold: 0.4 });
      io.observe(endMark);
    }
    setTimeout(function () { markRead(chapNo); }, 4 * 60000);
  }

  /* ---------- reading a chapter ----------
     Three small things that matter far more on a phone than on a laptop: how
     long this is going to take, how far through it you are, and getting back to
     where you stopped when something interrupted you. */
  if (mine >= 0) {
    var chN = CHAPTERS[mine].n;
    var css = document.createElement('style');
    css.textContent =
      '.ffprog{position:fixed;top:0;left:0;right:0;height:2px;z-index:80;background:rgba(255,255,255,.06)}' +
      '.ffprog i{display:block;height:100%;width:0;background:linear-gradient(90deg,#ff5c7a,#ff9d2e);' +
        'transition:width .12s linear}' +
      '.ffmins{font-family:Oswald,"Arial Narrow",sans-serif;font-size:10.5px;letter-spacing:.24em;' +
        'text-transform:uppercase;color:#7a7090;margin-top:14px}' +
      '.ffresume{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(16px + env(safe-area-inset-bottom,0px));' +
        'z-index:81;display:flex;gap:2px;align-items:center;background:rgba(20,16,32,.95);' +
        'border:1px solid rgba(255,255,255,.18);border-radius:999px;padding:4px 4px 4px 16px;' +
        'box-shadow:0 18px 40px -22px #000;backdrop-filter:blur(8px);font-size:13.5px;color:#efe9f5;' +
        'opacity:0;transition:opacity .3s ease}' +
      '.ffresume.in{opacity:1}' +
      '.ffresume button{font:inherit;font-family:Oswald,"Arial Narrow",sans-serif;font-size:11px;' +
        'letter-spacing:.16em;text-transform:uppercase;border:0;border-radius:999px;padding:9px 14px;' +
        'margin-left:10px;cursor:pointer;background:#efe9f5;color:#0c0a12;font-weight:600}' +
      '.ffresume .no{background:none;color:#a99fbd;font-weight:400;margin-left:0;padding:9px 10px}' +
      '@media print{.ffprog,.ffresume{display:none !important}}';
    document.head.appendChild(css);

    var bar = document.createElement('div');
    bar.className = 'ffprog';
    bar.innerHTML = '<i></i>';
    document.body.appendChild(bar);
    var fill = bar.firstChild;

    /* How long this will take, said out loud before anybody starts: two honest
       numbers, the page as it stands and the page with both film guides opened
       out. Nobody abandons a long thing; they abandon a thing of unknown length. */
    var wOpen = 0, wAll = 0;
    document.querySelectorAll('.wrap').forEach(function (w) {
      if (w.hasAttribute('data-ff')) return;                 /* the tab strip is not reading */
      wOpen += (w.innerText || '').trim().split(/\s+/).length;
      wAll  += (w.textContent || '').trim().split(/\s+/).length;
    });
    var mins = Math.max(2, Math.round(wOpen / 220));
    var minsAll = Math.max(mins + 1, Math.round(wAll / 220));
    var hero = document.querySelector('.hero');
    if (hero) {
      var m = document.createElement('div');
      m.className = 'ffmins';
      m.textContent = mins + ' min read · ' + minsAll + ' with both films opened out';
      hero.appendChild(m);
    }

    var posKey = 'ff-pos-' + chN;
    function depth() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      return h > 0 ? Math.min(1, Math.max(0, window.pageYOffset / h)) : 0;
    }
    var tick = null;
    window.addEventListener('scroll', function () {
      var d = depth();
      fill.style.width = (d * 100).toFixed(1) + '%';
      if (tick) return;
      tick = setTimeout(function () {
        tick = null;
        var now = depth();                                    /* where they are now, not where they were */
        try {
          if (now > 0.04 && now < 0.94) localStorage.setItem(posKey, String(Math.round(now * 1000)));
          else localStorage.removeItem(posKey);
        } catch (e) {}
      }, 400);
    }, { passive: true });

    /* phone reading is interrupted reading: offer the way back, never take it */
    var saved = 0;
    try { saved = +(localStorage.getItem(posKey) || 0) / 1000; } catch (e) {}
    if (saved > 0.06 && saved < 0.94 && depth() < 0.02) {
      var chip = document.createElement('div');
      chip.className = 'ffresume';
      chip.innerHTML = '<span>You were ' + Math.round(saved * 100) + '% through</span>' +
        '<button type="button" data-go="1">Pick up there</button>' +
        '<button type="button" class="no" data-go="0" aria-label="Start from the top">Start over</button>';
      document.body.appendChild(chip);
      setTimeout(function () { chip.classList.add('in'); }, 400);
      var drop = function () { chip.classList.remove('in'); setTimeout(function () { chip.remove(); }, 320); };
      chip.addEventListener('click', function (e) {
        var b = e.target.closest('[data-go]');
        if (!b) return;
        if (b.getAttribute('data-go') === '1') {
          var h = document.documentElement.scrollHeight - window.innerHeight;
          window.scrollTo({ top: h * saved, behavior: 'smooth' });
        } else {
          try { localStorage.removeItem(posKey); } catch (e2) {}
        }
        drop();
      });
      setTimeout(drop, 12000);
    }
  }

  /* ---------- the desktop rail and the keyboard ----------
     A laptop has room to spare down the sides and hands already on the keys.
     The rail keeps the whole book — and how much of it you have read — in view
     while you read one chapter; the arrows move between chapters without
     reaching for the mouse. Neither exists on a narrow screen. */
  if (mine >= 0) {
    var rcss = document.createElement('style');
    rcss.textContent =
      '.ffrail{position:fixed;left:18px;top:50%;transform:translateY(-50%);z-index:40;display:none;' +
        'flex-direction:column;gap:6px}' +
      '.ffrail a{position:relative;width:34px;height:26px;border-radius:4px;display:flex;align-items:center;' +
        'justify-content:center;font-family:Oswald,"Arial Narrow",sans-serif;font-size:12px;' +
        'text-decoration:none;color:#7a7090;border:1px solid rgba(255,255,255,.14);' +
        'background:#141020;transition:.18s}' +
      '.ffrail a:hover{color:#efe9f5;border-color:rgba(255,255,255,.4);transform:translateX(2px)}' +
      '.ffrail a.on{color:#fff;background:linear-gradient(160deg,#ff8fa4,#ff5c7a 40%,#b8335a);' +
        'border-color:#ff5c7a}' +
      '.ffrail a.soon{opacity:.45;pointer-events:none}' +
      '.ffrail a i{position:absolute;top:0;right:2px;font-style:normal;font-size:8px;color:#8fd9a8}' +
      '.ffrail a.on i{color:#12060c}' +
      '.ffrail .lab{font-family:Oswald,"Arial Narrow",sans-serif;font-size:9px;letter-spacing:.18em;' +
        'text-transform:uppercase;color:#7a7090;text-align:center;margin-top:4px}' +
      '@media (min-width:1180px) and (hover:hover){.ffrail{display:flex}}' +
      '@media print{.ffrail{display:none !important}}';
    document.head.appendChild(rcss);

    var rail = document.createElement('nav');
    rail.className = 'ffrail';
    rail.setAttribute('aria-label', 'Chapters');
    rail.innerHTML = CHAPTERS.map(function (c, i) {
      var here = i === mine, open = c.page, tick = isRead(c.n) ? '<i aria-hidden="true">✓</i>' : '';
      var cls = (here ? ' on' : '') + (open ? '' : ' soon');
      var label = 'Chapter ' + pad(c.n) + ' · ' + c.title;
      return open
        ? '<a class="' + cls.trim() + '" href="' + href(c.slug) + '" title="' + esc(label) + '"' +
            (here ? ' aria-current="page"' : '') + '>' + pad(c.n) + tick + '</a>'
        : '<a class="' + cls.trim() + '" title="' + esc(label) + '" aria-disabled="true">' + pad(c.n) + tick + '</a>';
    }).join('') + '<span class="lab">' + readCount() + '/' + CHAPTERS.length + '</span>';
    document.body.appendChild(rail);

    /* left and right walk the chapters that exist; escape closes an open film */
    document.addEventListener('keydown', function (e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      var t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.key === 'Escape') {
        var op = document.querySelector('details.road[open]');
        if (op) { op.open = false; e.preventDefault(); }
        return;
      }
      var step = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : 0;
      if (!step) return;
      for (var i = mine + step; i >= 0 && i < CHAPTERS.length; i += step) {
        if (CHAPTERS[i].page) { e.preventDefault(); location.href = href(CHAPTERS[i].slug); return; }
      }
    });
  }

  fetchResults();

  /* ---------- hand the book to the contents page ---------- */
  window.FF = {
    PARTS: PARTS, CHAPTERS: CHAPTERS, cur: cur, state: state, href: href, done: bookDone,
    getVote: getVote, setVote: setVote, clearVote: clearVote, sendVote: sendVote, drawChip: drawChip,
    short: short, withDay: withDay, longDate: longDate, weekday: weekday, pad: pad, esc: esc,
    beat: beat, meetAt: meetAt, meetLocal: meetLocal,
    FORUM: FORUM, forumUrl: forumUrl, forumLive: forumLive, name: getName, saveName: saveName,
    isRead: isRead, markRead: markRead, readCount: readCount
  };

  /* ---------- opening a film takes over the page ----------
     The site recolours to that film's poster, and the rest of the chapter steps
     aside until the tab is closed again. The PDF builder and printing skip it. */
  (function () {
    var roads = document.querySelectorAll('details.road[data-color]');
    if (!roads.length) return;
    var root = document.documentElement;
    var KEYS = ['--film', '--film-deep', '--ink', '--ink-2', '--hb', '--sb'];

    var css = document.createElement('style');
    css.textContent =
      'body{transition:background-color .45s ease}' +
      'html.ff-focus body::before{opacity:.26 !important;background:' +
        'radial-gradient(900px 520px at 12% -8%,var(--film),transparent 62%),' +
        'radial-gradient(800px 460px at 92% 4%,var(--film-deep),transparent 62%) !important}' +
      '.ff-hide{display:none !important}' +
      '.road .notsel{font-family:Oswald,"Arial Narrow",sans-serif;font-size:10px;letter-spacing:.22em;text-transform:uppercase;' +
        'color:var(--text-faint,#7a7090);border:1px solid rgba(255,255,255,.18);border-radius:999px;padding:4px 10px;align-self:center}' +
      'details.road[open]:not(.took) .sfilm{font-weight:700 !important}' +
      'html.ff-focus details.road[open]{border-color:var(--film) !important;' +
        'box-shadow:0 34px 90px -50px var(--film),0 0 0 1px rgba(255,255,255,.04) inset !important}' +
      'html.ff-focus details.road[open]:not(.took) .sfilm{color:var(--film) !important}' +
      '.ff-back{position:fixed;left:50%;bottom:calc(18px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);' +
        'z-index:80;font-family:Oswald,"Arial Narrow",sans-serif;font-size:12px;letter-spacing:.18em;text-transform:uppercase;' +
        'color:#0c0a12;background:var(--film);border:0;border-radius:999px;padding:12px 22px;cursor:pointer;' +
        'box-shadow:0 14px 34px -12px rgba(0,0,0,.7)}' +
      '.ff-back:focus-visible{outline:2px solid #fff;outline-offset:3px}' +
      '@media print{.ff-back{display:none !important}}';
    document.head.appendChild(css);

    var back = document.createElement('button');
    back.type = 'button';
    back.className = 'ff-back';
    back.hidden = true;
    back.textContent = '← Back to the chapter';
    document.body.appendChild(back);

    var active = null, printing = false;

    function keep(el) { return el.matches('.masthead,.tabs,script,style,link,.ff-back'); }
    function jump(el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 84, behavior: 'auto' });
    }
    function clear() {
      document.querySelectorAll('.ff-hide').forEach(function (e) { e.classList.remove('ff-hide'); });
      KEYS.forEach(function (k) { root.style.removeProperty(k); });
      root.classList.remove('ff-focus');
      back.hidden = true;
    }
    function focus(d) {
      root.style.setProperty('--film', d.getAttribute('data-color'));
      root.style.setProperty('--film-deep', d.getAttribute('data-deep'));
      root.style.setProperty('--ink', d.getAttribute('data-ink'));
      root.style.setProperty('--ink-2', d.getAttribute('data-ink2'));
      root.style.setProperty('--hb', d.getAttribute('data-color'));
      root.style.setProperty('--sb', d.getAttribute('data-color'));
      root.classList.add('ff-focus');
      var node = d;
      while (node && node !== document.body) {
        var p = node.parentElement;
        Array.prototype.forEach.call(p.children, function (sib) {
          if (sib !== node && !keep(sib)) sib.classList.add('ff-hide');
        });
        node = p;
      }
      back.hidden = false;
    }
    function sync() {
      if (printing || root.hasAttribute('data-pdf')) return;
      var open = null;
      roads.forEach(function (r) { if (r.open) open = r; });
      if (open === active) return;
      clear();
      active = open;
      if (open) { focus(open); jump(open); }
      else {
        var sec = document.querySelector('section.roads');
        if (sec) jump(sec);
      }
    }
    roads.forEach(function (r) {
      r.addEventListener('toggle', function () { requestAnimationFrame(sync); });
    });
    back.addEventListener('click', function () { if (active) active.open = false; });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && active) active.open = false;
    });
    window.addEventListener('beforeprint', function () { printing = true; clear(); active = null; });
    window.addEventListener('afterprint', function () { printing = false; });
  })();

  /* ---------- a link into a closed panel should open it ---------- */
  function reveal(hash) {
    if (!hash || hash === '#') return;
    var t;
    try { t = document.querySelector(hash); } catch (e) { return; }
    if (!t) return;
    var d = t.closest ? t.closest('details') : null;
    while (d) {
      if (d.hasAttribute('name')) {
        var g = d.getAttribute('name');
        document.querySelectorAll('details[name="' + g + '"]').forEach(function (o) {
          if (o !== d) o.open = false;
        });
      }
      d.open = true;
      d = d.parentNode && d.parentNode.closest ? d.parentNode.closest('details') : null;
    }
    setTimeout(function () {
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
    }, 40);
  }
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a[href^="#"]');
    if (!a) return;
    var h = a.getAttribute('href');
    if (h.length < 2) return;
    ev.preventDefault();
    reveal(h);
  });
  if (location.hash) reveal(location.hash);
})();
