/* ===========================================================
   PITAYA ROCKETZ — interações (awwwards edition)
   =========================================================== */
(function () {
  'use strict';
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- loader ---------- */
  window.addEventListener('load', function () {
    var loader = document.getElementById('loader');
    if (loader) setTimeout(function () { loader.classList.add('is-done'); }, 550);
  });

  /* ---------- ano ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- nav scroll ---------- */
  var nav = document.getElementById('nav');
  function onScroll() { if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 12); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- menu mobile ---------- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () { links.classList.toggle('is-open'); });
    links.addEventListener('click', function (e) { if (e.target.tagName === 'A') links.classList.remove('is-open'); });
  }

  /* ---------- cursor glow ---------- */
  var cursor = document.getElementById('cursor');
  if (cursor && window.matchMedia('(hover:hover)').matches && !prefersReduced) {
    var cx = 0, cy = 0, tx = 0, ty = 0;
    window.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; cursor.classList.add('is-on'); });
    (function loop() {
      cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
      cursor.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a, button, [data-tilt]').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.classList.add('is-hover'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('is-hover'); });
    });
  }

  /* ---------- reveal (generic + lines) ---------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-line');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });

    /* rail line */
    var rail = document.querySelector('.rail');
    if (rail) {
      var ro = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-visible'); ro.unobserve(e.target); } });
      }, { threshold: 0.3 });
      ro.observe(rail);
    }
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- manifesto word-by-word lighting ---------- */
  var words = document.querySelectorAll('.reveal-word');
  if (words.length && 'IntersectionObserver' in window) {
    var wo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var nodes = Array.prototype.slice.call(words);
          nodes.forEach(function (w, i) { setTimeout(function () { w.classList.add('is-lit'); }, i * 90); });
          wo.disconnect();
        }
      });
    }, { threshold: 0.5 });
    wo.observe(words[0]);
  }

  /* ---------- counters ---------- */
  var counters = document.querySelectorAll('.num');
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var dur = 1600, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (counters.length && 'IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCount(entry.target); co.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  }

  /* ---------- magnetic buttons ---------- */
  if (!prefersReduced && window.matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var mx = e.clientX - r.left - r.width / 2;
        var my = e.clientY - r.top - r.height / 2;
        el.style.transform = 'translate(' + mx * 0.3 + 'px,' + my * 0.4 + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- bento tilt + shine ---------- */
  if (!prefersReduced && window.matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        var rx = (py - 0.5) * -8;
        var ry = (px - 0.5) * 8;
        el.style.transform = 'perspective(800px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-4px)';
        el.style.setProperty('--mx', px * 100 + '%');
        el.style.setProperty('--my', py * 100 + '%');
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- hero flame parallax ---------- */
  var flame = document.querySelector('.hero__media');
  if (flame && !prefersReduced) {
    window.addEventListener('scroll', function () {
      var sc = window.scrollY;
      flame.style.transform = 'translateY(' + sc * 0.18 + 'px)';
    }, { passive: true });
  }

  /* ---------- sparks: raios da marca emitidos pela chama ---------- */
  var sparksCanvas = document.getElementById('sparksCanvas');
  if (sparksCanvas && flame && !prefersReduced) {
    var sctx = sparksCanvas.getContext('2d');
    var parts = [];
    var COLORS = ['#FF0A78', '#FF4FA3', '#2BD46A', '#FF0A78'];

    function fitCanvas() {
      var dpr = window.devicePixelRatio || 1;
      var r = flame.getBoundingClientRect();
      sparksCanvas.width = Math.max(r.width, 1) * dpr;
      sparksCanvas.height = Math.max(r.height, 1) * dpr;
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    fitCanvas();
    window.addEventListener('resize', fitCanvas);

    function burst(n) {
      var r = flame.getBoundingClientRect();
      var cx = r.width / 2, cy = r.height / 2;
      for (var i = 0; i < n; i++) {
        var ang = Math.random() * Math.PI * 2;
        var sp = 1.4 + Math.random() * 2.4;
        parts.push({
          x: cx + Math.cos(ang) * 52, y: cy + Math.sin(ang) * 52,
          vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
          life: 1, decay: 0.011 + Math.random() * 0.013,
          size: 7 + Math.random() * 10, ang: ang,
          color: COLORS[(Math.random() * COLORS.length) | 0]
        });
      }
    }
    burst(9);
    setInterval(function () { burst(6 + (Math.random() * 4 | 0)); }, 1600);

    (function tick() {
      var r = flame.getBoundingClientRect();
      sctx.clearRect(0, 0, r.width, r.height);
      for (var i = parts.length - 1; i >= 0; i--) {
        var p = parts[i];
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.986; p.vy *= 0.986;
        p.life -= p.decay;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        sctx.save();
        sctx.globalAlpha = Math.max(p.life, 0);
        sctx.translate(p.x, p.y);
        sctx.rotate(p.ang);
        sctx.fillStyle = p.color;
        var s = p.size;
        sctx.beginPath();
        sctx.moveTo(-s, 0);
        sctx.lineTo(-s * 0.15, -s * 0.3);
        sctx.lineTo(s * 0.75, 0);
        sctx.lineTo(-s * 0.15, s * 0.3);
        sctx.closePath();
        sctx.fill();
        sctx.restore();
      }
      requestAnimationFrame(tick);
    })();
  }

  /* ---------- form ---------- */
  var form = document.getElementById('leadForm');
  var feedback = document.getElementById('formFeedback');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (feedback) feedback.hidden = false;
      var btn = form.querySelector('button[type="submit"]');
      if (btn) btn.innerHTML = 'Enviado 🚀';
      form.querySelectorAll('input').forEach(function (i) { i.value = ''; i.disabled = true; });
    });
  }
})();
