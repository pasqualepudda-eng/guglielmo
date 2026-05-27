/* ================================================================
   STUDIO GUGLIELMO v2.0 — Animations & Interactions
   ================================================================ */

const qs  = (s,r=document) => r.querySelector(s);
const qsa = (s,r=document) => r.querySelectorAll(s);
const db  = (fn,ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

/* ── Custom Cursor ──────────────────────────────────────────── */
(function initCursor() {
  const cur  = qs('.cursor');
  const ring = qs('.cursor-ring');
  if (!cur || !ring || window.innerWidth < 769) return;

  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  const tickRing = () => {
    rx += (mx - rx) * .12;
    ry += (my - ry) * .12;
    cur.style.left  = mx + 'px';
    cur.style.top   = my + 'px';
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(tickRing);
  };
  tickRing();

  document.querySelectorAll('a,button,.card,.faq-question').forEach(el => {
    el.addEventListener('mouseenter', () => { cur.classList.add('hovered'); ring.classList.add('hovered'); });
    el.addEventListener('mouseleave', () => { cur.classList.remove('hovered'); ring.classList.remove('hovered'); });
  });
})();

/* ── Scroll Progress Bar ────────────────────────────────────── */
(function initProgress() {
  const bar = qs('.scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = h.scrollTop / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ── Navbar scroll ──────────────────────────────────────────── */
(function initNav() {
  const nav = qs('.nav');
  if (!nav) return;
  const fn = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', fn, { passive: true });
  fn();
})();

/* ── Mobile nav ─────────────────────────────────────────────── */
(function initMobileNav() {
  const ham  = qs('.nav__hamburger');
  const mob  = qs('.nav__mobile');
  if (!ham || !mob) return;
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    mob.classList.toggle('open');
    document.body.style.overflow = mob.classList.contains('open') ? 'hidden' : '';
  });
  qsa('.nav__mobile-link').forEach(l => l.addEventListener('click', () => {
    ham.classList.remove('open'); mob.classList.remove('open'); document.body.style.overflow = '';
  }));
})();

/* ── Active nav link ────────────────────────────────────────── */
(function () {
  const cur = window.location.pathname.split('/').pop() || 'index.html';
  qsa('.nav__link').forEach(l => {
    if ((l.getAttribute('href') || '').split('/').pop() === cur) l.classList.add('active');
  });
})();

/* ── Scroll Reveal ──────────────────────────────────────────── */
(function initReveal() {
  const els = qsa('.reveal,.reveal-left,.reveal-right,.reveal-scale');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -44px 0px' });
  els.forEach(el => io.observe(el));
})();

/* ── Animated Counters ──────────────────────────────────────── */
(function initCounters() {
  const els = qsa('[data-counter]');
  if (!els.length) return;
  const anim = el => {
    const target  = parseFloat(el.dataset.target || '0');
    const suffix  = el.dataset.suffix || '';
    const prefix  = el.dataset.prefix || '';
    const dur     = 1800;
    const t0      = performance.now();
    const decimal = String(target).includes('.');
    const tick = now => {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      const v = e * target;
      el.textContent = prefix + (decimal ? v.toFixed(1) : Math.floor(v)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.animated) {
        e.target.dataset.animated = '1';
        anim(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: .5 });
  els.forEach(el => io.observe(el));
})();

/* ── FAQ Accordion ──────────────────────────────────────────── */
(function initFaq() {
  qsa('.faq-item').forEach(item => {
    const q = qs('.faq-question', item);
    if (!q) return;
    q.addEventListener('click', () => {
      const open = item.classList.contains('open');
      qsa('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!open) item.classList.add('open');
    });
  });
  /* BEM variant */
  qsa('.faq__item').forEach(item => {
    const q = qs('.faq__q', item);
    if (!q) return;
    q.addEventListener('click', () => {
      const open = item.classList.contains('faq__item--open');
      qsa('.faq__item--open').forEach(i => {
        i.classList.remove('faq__item--open');
        const btn = qs('.faq__q', i);
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
      if (!open) {
        item.classList.add('faq__item--open');
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

/* ── Card Tilt Effect ───────────────────────────────────────── */
(function initTilt() {
  if (window.innerWidth < 769) return;
  qsa('.card:not(.card--notilt)').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - .5;
      const y = (e.clientY - r.top)  / r.height - .5;
      card.style.transform = `translateY(-8px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg)`;
      card.style.transition = 'transform .1s var(--ease), box-shadow .4s var(--ease), border-color .4s';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform .4s var(--ease), box-shadow .4s var(--ease), border-color .4s';
    });
  });
})();

/* ── Magnetic Buttons ───────────────────────────────────────── */
(function initMagneticBtns() {
  if (window.innerWidth < 769) return;
  qsa('.btn-grad,.btn-red,.btn-white').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * .35;
      const y = (e.clientY - r.top  - r.height / 2) * .35;
      btn.style.transform = `translate(${x}px,${y}px) translateY(-2px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();

/* ── Hero Canvas ────────────────────────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, pts, mouse = { x: 0, y: 0 };

  const resize = () => {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  };
  const build = () => {
    const n = Math.min(Math.floor((W * H) / 16000), 90);
    pts = Array.from({ length: n }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - .5) * .22,
      vy: (Math.random() - .5) * .22,
      r:  Math.random() * 1.6 + .4,
      op: Math.random() * .45 + .1,
      c:  Math.random() > .5 ? '37,99,235' : '124,58,237',
    }));
  };
  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    /* Connections */
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < 140) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${pts[i].c},${ .14 * (1 - d/140) })`;
          ctx.lineWidth = .6;
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
      /* Mouse repulsion */
      const dx = pts[i].x - mouse.x, dy = pts[i].y - mouse.y;
      const d  = Math.sqrt(dx*dx + dy*dy);
      if (d < 120) {
        pts[i].vx += (dx / d) * .3;
        pts[i].vy += (dy / d) * .3;
      }
    }
    /* Particles */
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${p.c},${p.op})`;
      ctx.fill();
      p.vx *= .99; p.vy *= .99;
      p.x += p.vx; p.y += p.vy;
      if (p.x < -8)  p.x = W + 8;
      if (p.x > W+8) p.x = -8;
      if (p.y < -8)  p.y = H + 8;
      if (p.y > H+8) p.y = -8;
    });
    requestAnimationFrame(draw);
  };

  resize(); build(); draw();

  const hero = canvas.closest('.hero');
  if (hero) hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  }, { passive: true });

  window.addEventListener('resize', db(() => { resize(); build(); }, 200));
})();

/* ── Contact Form ───────────────────────────────────────────── */
(function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn  = qs('[type=submit]', form);
    const orig = btn.innerHTML;
    btn.innerHTML = '<svg style="width:18px;height:18px;animation:spin 1s linear infinite" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-dasharray="31.4" stroke-dashoffset="10"/></svg> Invio...';
    btn.disabled = true;
    setTimeout(() => {
      const al = document.getElementById('form-success');
      if (al) al.classList.add('show');
      btn.innerHTML = orig; btn.disabled = false; form.reset();
      setTimeout(() => { if (al) al.classList.remove('show'); }, 5000);
    }, 1400);
  });
})();

/* ── Smooth Anchor Scroll ───────────────────────────────────── */
qsa('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = qs(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  });
});

/* ── Spin keyframe for loading ──────────────────────────────── */
const st = document.createElement('style');
st.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
document.head.appendChild(st);
