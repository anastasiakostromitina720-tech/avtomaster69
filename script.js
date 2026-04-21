/* =========================================================
   АВТОМАСТЕР69 · МОТИОН-ПАКЕТ (EXTENDED)
   1. preloader (speedometer)
   2. custom cursor
   3. section tracker (sidebar)
   4. scroll progress
   5. scroll reveal + invoice typewriter trigger
   6. stats counter
   7. hero photo parallax
   8. magnetic CTA
   9. card tilt
  10. hero title scramble
   ========================================================= */

(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- 1. PRELOADER ---------- */
  const preloader = document.getElementById('preloader');
  const pctEl = document.getElementById('preloader-pct');
  if (preloader) {
    const duration = reduceMotion ? 300 : 1400;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const pct = Math.round(eased * 100);
      if (pctEl) pctEl.textContent = String(pct).padStart(2, '0');
      if (t < 1) requestAnimationFrame(tick);
      else {
        document.body.classList.add('is-loaded');
        setTimeout(() => preloader.classList.add('is-done'), 120);
      }
    };
    requestAnimationFrame(tick);
  } else {
    document.body.classList.add('is-loaded');
  }

  /* ---------- 2. CUSTOM CURSOR ---------- */
  const cursor = document.querySelector('.cursor');
  if (cursor && canHover && !reduceMotion) {
    const ring = cursor.querySelector('.cursor__ring');
    const dot  = cursor.querySelector('.cursor__dot');
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;

    document.body.classList.add('has-cursor');
    cursor.classList.add('is-active');

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform  = `translate(${mx}px, ${my}px)`;
    });

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(loop);
    };
    loop();

    const hoverSel = 'a, button, summary, .btn, .faq summary, .svc-grid li, .fears article, .approach article';
    document.querySelectorAll(hoverSel).forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });

    document.addEventListener('mousedown', () => cursor.classList.add('is-click'));
    document.addEventListener('mouseup',   () => cursor.classList.remove('is-click'));

    document.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));
    document.addEventListener('mouseenter', () => cursor.classList.add('is-active'));
  }

  /* ---------- 3. SECTION TRACKER ---------- */
  const tracker = document.querySelector('.tracker');
  const trackerNum = tracker?.querySelector('.tracker__num');
  const trackerLabel = tracker?.querySelector('.tracker__label');
  const sections = document.querySelectorAll('[data-section]');

  if (tracker && sections.length && 'IntersectionObserver' in window) {
    const ioS = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.35) {
          const num = entry.target.dataset.section;
          const lbl = entry.target.dataset.label || '';
          if (trackerNum)   trackerNum.textContent = `${num} / 13`;
          if (trackerLabel) trackerLabel.textContent = lbl;
        }
      });
    }, { threshold: [0.35, 0.6] });
    sections.forEach((s) => ioS.observe(s));

    const showTracker = () => {
      if (window.scrollY > 300) tracker.classList.add('is-active');
      else tracker.classList.remove('is-active');
    };
    document.addEventListener('scroll', showTracker, { passive: true });
    showTracker();
  }

  /* ---------- 4. SCROLL PROGRESS ---------- */
  const progress = document.querySelector('.scroll-progress span');
  if (progress) {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? (h.scrollTop / max) * 100 : 0;
      progress.style.width = p.toFixed(2) + '%';
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 5. SCROLL REVEAL + INVOICE TRIGGER ---------- */
  const revealNodes = document.querySelectorAll('[data-reveal], [data-reveal-group], .invoice');
  if ('IntersectionObserver' in window && revealNodes.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealNodes.forEach((n) => io.observe(n));
  } else {
    revealNodes.forEach((n) => n.classList.add('is-in'));
  }

  /* ---------- 6. STATS COUNTER ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const runCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const pad = parseInt(el.dataset.pad || '0', 10);
    const duration = 1100;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(target * eased);
      el.textContent = pad ? String(value).padStart(pad, '0') : String(value);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (counters.length) {
    if (reduceMotion) {
      counters.forEach((el) => {
        const pad = parseInt(el.dataset.pad || '0', 10);
        el.textContent = pad ? String(el.dataset.count).padStart(pad, '0') : el.dataset.count;
      });
    } else if ('IntersectionObserver' in window) {
      const ioC = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            ioC.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach((el) => ioC.observe(el));
    } else {
      counters.forEach(runCounter);
    }
  }

  /* ---------- 7. HERO PHOTO PARALLAX ---------- */
  const heroPhoto = document.querySelector('.hero__photo');
  const hero = document.querySelector('.hero');
  if (heroPhoto && hero && !reduceMotion) {
    let ticking = false;
    const onScrollPhoto = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const progress = Math.max(-1, Math.min(1, -rect.top / (rect.height || 1)));
        const shift = progress * -50;
        heroPhoto.style.transform = `translate3d(0, ${shift}px, 0)`;
        ticking = false;
      });
    };
    document.addEventListener('scroll', onScrollPhoto, { passive: true });
    onScrollPhoto();
  }

  /* ---------- 8. MAGNETIC BUTTONS ---------- */
  const magnetic = document.querySelectorAll('.btn--primary');
  if (!reduceMotion && canHover) {
    magnetic.forEach((btn) => {
      const strength = 14;
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        const dx = (x / r.width) * strength;
        const dy = (y / r.height) * strength;
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ---------- 9. CARD TILT ---------- */
  const tiltTargets = document.querySelectorAll('.svc-grid li, .fears article, .approach article');
  if (!reduceMotion && canHover) {
    tiltTargets.forEach((card) => {
      const max = 6;
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rx = (0.5 - py) * max;
        const ry = (px - 0.5) * max;
        card.style.transform =
          `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-3px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ---------- 10. HERO TITLE SCRAMBLE ---------- */
  const scrambleEls = document.querySelectorAll('[data-scramble]');
  const scrambleChars = '!<>-_\\/[]{}—=+*^?#_$%&@АВЕКМНРСТХУ';
  const scramble = (el, finalText, duration = 1200, startDelay = 0) => {
    const len = finalText.length;
    const start = performance.now() + startDelay;
    const tick = (now) => {
      if (now < start) { requestAnimationFrame(tick); return; }
      const t = Math.min(1, (now - start) / duration);
      const revealCount = Math.floor(t * len);
      let out = '';
      for (let i = 0; i < len; i++) {
        if (i < revealCount || finalText[i] === ' ') {
          out += finalText[i];
        } else {
          out += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        }
      }
      el.textContent = out;
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = finalText;
    };
    requestAnimationFrame(tick);
  };

  if (scrambleEls.length && !reduceMotion) {
    const startAll = () => {
      scrambleEls.forEach((el, i) => {
        const text = el.dataset.scramble || el.textContent;
        scramble(el, text, 1100, i * 120);
      });
    };
    // Wait for preloader to finish before scrambling
    if (preloader) {
      const waitPreload = () => {
        if (preloader.classList.contains('is-done')) startAll();
        else setTimeout(waitPreload, 100);
      };
      waitPreload();
    } else {
      startAll();
    }
  }

})();
