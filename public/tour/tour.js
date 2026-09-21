/* ==========================================================================
   The tour driver — PLAN.md §1.5.

   One file for all four tours. A tour describes itself in its own markup:
   each <section class="scene"> carries data-dur and data-label, and holds a
   <p class="scene-caption"> that is the prose for that scene. The driver
   reads those rather than carrying a parallel array of strings, because a
   caption that lives in JS is a caption that does not exist with JS off —
   and one that silently drifts out of step with the scene it describes.

   Reduced motion (motion.md, §1.5): every scene is rendered stacked and
   settled, with its caption beneath it, and no clock is started at all. The
   controls are not merely disabled, they are removed — a pause button for
   an animation that is not running is a control with no job.
   ========================================================================== */

(function () {
  var scenes = Array.prototype.slice.call(document.querySelectorAll('.scene'));
  if (!scenes.length) return;

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    document.documentElement.classList.add('static-scenes');
    scenes.forEach(function (s) { s.classList.add('on'); });
    return;
  }

  var rail = document.getElementById('rail');
  var captionEl = document.getElementById('caption');
  var counterEl = document.getElementById('counter');
  var playBtn = document.getElementById('playBtn');
  var replayBtn = document.getElementById('replayBtn');

  var labels = scenes.map(function (s) { return s.getAttribute('data-label') || ''; });
  var captions = scenes.map(function (s) {
    var c = s.querySelector('.scene-caption');
    return c ? c.textContent.trim() : '';
  });

  var steps = [], fills = [];

  scenes.forEach(function (s, i) {
    var b = document.createElement('button');
    b.className = 'step';
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', 'Scene ' + (i + 1) + ': ' + labels[i]);
    b.innerHTML =
      '<span class="n">' + (i + 1 < 10 ? '0' : '') + (i + 1) + '</span>' +
      '<span class="l"></span>' +
      '<span class="track"><span class="fill"></span></span>';
    b.querySelector('.l').textContent = labels[i];
    b.addEventListener('click', function () { go(i); if (!playing) togglePlay(); });
    b.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      var n = (i + d + scenes.length) % scenes.length;
      steps[n].focus();
      go(n);
    });
    rail.appendChild(b);
    steps.push(b);
    fills.push(b.querySelector('.fill'));
  });

  var idx = -1, playing = true, elapsed = 0, dur = 0, last = null, raf = null;

  function go(i) {
    if (idx >= 0) {
      scenes[idx].classList.remove('on');
      steps[idx].classList.remove('active');
    }
    steps.forEach(function (s, j) {
      s.classList.toggle('done', j < i);
      if (j >= i) fills[j].style.width = '0%';
    });
    idx = i;
    scenes[i].querySelectorAll('*').forEach(function (el) { el.style.animationPlayState = ''; });
    scenes[i].classList.add('on');
    steps[i].classList.add('active');
    steps.forEach(function (s, j) { s.setAttribute('aria-selected', j === i ? 'true' : 'false'); });
    captionEl.textContent = captions[i];
    counterEl.textContent = 'Scene ' + (i + 1) + ' of ' + scenes.length;
    dur = parseInt(scenes[i].getAttribute('data-dur'), 10) || 7000;
    elapsed = 0;
    last = null;
  }

  function tick(ts) {
    raf = null;
    if (!playing) return;
    if (last !== null) elapsed += ts - last;
    last = ts;
    fills[idx].style.width = Math.min(100, (elapsed / dur) * 100) + '%';
    if (elapsed >= dur) {
      if (idx < scenes.length - 1) {
        go(idx + 1);
      } else {
        playing = false;
        playBtn.textContent = 'Replay';
        steps[idx].classList.add('done');
        fills[idx].style.width = '100%';
        return;
      }
    }
    raf = requestAnimationFrame(tick);
  }

  function togglePlay() {
    if (!playing && idx === scenes.length - 1 && elapsed >= dur) { restart(); return; }
    playing = !playing;
    playBtn.textContent = playing ? 'Pause' : 'Play';
    playBtn.setAttribute('aria-pressed', playing ? 'false' : 'true');
    last = null;
    if (playing && !raf) raf = requestAnimationFrame(tick);
    scenes[idx].querySelectorAll('*').forEach(function (el) {
      el.style.animationPlayState = playing ? '' : 'paused';
    });
  }

  function restart() {
    scenes.forEach(function (s) { s.classList.remove('on'); });
    steps.forEach(function (s, j) { s.classList.remove('done', 'active'); fills[j].style.width = '0%'; });
    idx = -1;
    go(0);
    playing = true;
    playBtn.textContent = 'Pause';
    playBtn.setAttribute('aria-pressed', 'false');
    last = null;
    if (!raf) raf = requestAnimationFrame(tick);
  }

  playBtn.addEventListener('click', togglePlay);
  replayBtn.addEventListener('click', restart);

  /* Paused while off screen. An embedded tour that animates in a viewport
     nobody is looking at is burning a main thread for no one — and on the
     case-study page it would be competing with the prose for attention. */
  if ('IntersectionObserver' in window) {
    var wasPlaying = false;
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting && playing) { wasPlaying = true; togglePlay(); }
        else if (e.isIntersecting && wasPlaying && !playing) { wasPlaying = false; togglePlay(); }
      });
    }, { threshold: 0.25 }).observe(document.getElementById('stage'));
  }

  go(0);
  raf = requestAnimationFrame(tick);
})();
