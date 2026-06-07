    // ─── VORTEX CANVAS ────────────────────────────────────────────
    (function () {
      const canvas = document.getElementById('vortex-canvas');
      const ctx = canvas.getContext('2d');
      let W, H, cx, cy;
      const COLORS = ['#00e5ff', '#0066ff', '#00bbff', '#ffffff', '#00ffcc', '#4488ff'];
      const COUNT = 240;
      let particles = [];
      let mouse = { x: -9999, y: -9999 };

      function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        cx = W / 2; cy = H / 2;
      }

      class Particle {
        constructor() { this.init(true); }
        init(rand) {
          this.angle = rand ? Math.random() * Math.PI * 2 : 0;
          this.radius = rand ? 30 + Math.random() * Math.min(W, H) * 0.44 : 30;
          this.speed = (Math.random() * 0.007 + 0.002) * (Math.random() < 0.5 ? 1 : -1);
          this.drift = (Math.random() - 0.5) * 0.5;
          this.size = Math.random() * 2.4 + 0.3;
          this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
          this.alpha = Math.random() * 0.6 + 0.15;
          this.fadeDir = Math.random() < 0.5 ? 1 : -1;
          this.life = Math.random() * 250 + 100;
          this.age = 0;
          this.t = Math.random() * 300;
          this.trail = [];
        }
        update() {
          this.t++; this.age++;
          // spiral + wave
          this.angle += this.speed + Math.sin(this.t * 0.018) * 0.003;
          this.radius += this.drift * 0.025 + Math.sin(this.t * 0.012) * 0.15;

          // clamp radius
          const maxR = Math.min(W, H) * 0.47;
          if (this.radius > maxR) { this.radius = maxR; this.drift = -Math.abs(this.drift); }
          if (this.radius < 12) { this.radius = 12; this.drift = Math.abs(this.drift); }

          // mouse repulsion
          const baseR = this.radius;
          const px = cx + Math.cos(this.angle) * baseR;
          const py = cy + Math.sin(this.angle) * baseR;
          const dx = px - mouse.x, dy = py - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            const force = (1 - dist / 110);
            this.angle += 0.05 * force;
            this.radius += 2.5 * force;
          }

          // fade
          this.alpha += 0.007 * this.fadeDir;
          if (this.alpha > 0.85 || this.alpha < 0.05) this.fadeDir *= -1;

          this.x = cx + Math.cos(this.angle) * this.radius;
          this.y = cy + Math.sin(this.angle) * this.radius;
          this.trail.push({ x: this.x, y: this.y, a: this.alpha });
          if (this.trail.length > 14) this.trail.shift();

          if (this.age > this.life) this.init(false);
        }
        draw() {
          if (this.trail.length > 2) {
            ctx.beginPath();
            ctx.moveTo(this.trail[0].x, this.trail[0].y);
            for (let i = 1; i < this.trail.length; i++) {
              ctx.lineTo(this.trail[i].x, this.trail[i].y);
            }
            ctx.strokeStyle = this.color;
            ctx.globalAlpha = this.alpha * 0.22;
            ctx.lineWidth = this.size * 0.55;
            ctx.stroke();
          }
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.globalAlpha = this.alpha;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

      function drawGrid() {
        ctx.globalAlpha = 0.022;
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 0.5;
        const step = 60;
        for (let x = 0; x < W; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
        for (let y = 0; y < H; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
        ctx.globalAlpha = 1;
      }

      function drawCore() {
        const t = Date.now() * 0.002;
        const pulse = Math.sin(t) * 0.25 + 0.75;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 100 * pulse);
        g.addColorStop(0, `rgba(0,229,255,${0.2 * pulse})`);
        g.addColorStop(0.4, `rgba(0,85,255,${0.1 * pulse})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, 100 * pulse, 0, Math.PI * 2);
        ctx.fill();
      }

      function drawRings() {
        const t = Date.now() * 0.001;
        for (let i = 1; i <= 5; i++) {
          const r = (Math.min(W, H) * 0.075 * i) + Math.sin(t * 0.8 + i) * 14;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0,229,255,${0.055 - i * 0.008})`;
          ctx.lineWidth = 0.8;
          ctx.globalAlpha = 0.6;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }

      function drawConnections() {
        const nearby = particles.slice(0, 60);
        for (let i = 0; i < nearby.length; i++) {
          for (let j = i + 1; j < nearby.length; j++) {
            const dx = nearby[i].x - nearby[j].x;
            const dy = nearby[i].y - nearby[j].y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 55) {
              ctx.beginPath();
              ctx.moveTo(nearby[i].x, nearby[i].y);
              ctx.lineTo(nearby[j].x, nearby[j].y);
              ctx.strokeStyle = '#00e5ff';
              ctx.globalAlpha = (1 - d / 55) * 0.12;
              ctx.lineWidth = 0.5;
              ctx.stroke();
              ctx.globalAlpha = 1;
            }
          }
        }
      }

      function loop() {
        ctx.clearRect(0, 0, W, H);

        // bg
        const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.75);
        bg.addColorStop(0, 'rgba(5,15,36,0.94)');
        bg.addColorStop(0.5, 'rgba(2,10,22,0.97)');
        bg.addColorStop(1, 'rgba(2,8,16,1)');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        drawGrid();
        drawCore();
        drawRings();
        drawConnections();
        particles.forEach(p => { p.update(); p.draw(); });

        requestAnimationFrame(loop);
      }

      function init() {
        resize();
        particles = Array.from({ length: COUNT }, () => new Particle());
        loop();
      }

      window.addEventListener('resize', resize);
      window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
      window.addEventListener('touchmove', e => { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; });

      init();
    })();

    // ─── CUSTOM CURSOR ────────────────────────────────────────────
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    document.addEventListener('mousemove', e => {
      dot.style.left = e.clientX + 'px'; dot.style.top = e.clientY + 'px';
      ring.style.left = e.clientX + 'px'; ring.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('a,button,input,textarea').forEach(el => {
      el.addEventListener('mouseenter', () => { dot.style.transform = 'translate(-50%,-50%) scale(2.5)'; ring.style.width = '50px'; ring.style.height = '50px'; });
      el.addEventListener('mouseleave', () => { dot.style.transform = 'translate(-50%,-50%) scale(1)'; ring.style.width = '32px'; ring.style.height = '32px'; });
    });

    // ─── SIDEBAR ──────────────────────────────────────────────────
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sidebarClose = document.getElementById('sidebarClose');

    function openSidebar() { sidebar.classList.add('open'); overlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
    function closeSidebar() { sidebar.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow = ''; }

    hamburgerBtn.addEventListener('click', openSidebar);
    sidebarClose.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);
    document.querySelectorAll('[data-close]').forEach(l => l.addEventListener('click', closeSidebar));

    // Auth removed — site is static. Admin lives at /admin.


    // ─── CONTACT FORM ─────────────────────────────────────────────
    document.getElementById('contactForm').addEventListener('submit', e => {
      e.preventDefault(); showToast("Message sent! We'll be in touch soon. ⚡"); e.target.reset();
    });

    // ─── TOAST ────────────────────────────────────────────────────
    function showToast(msg) {
      const t = document.getElementById('toast');
      t.textContent = msg; t.classList.add('show');
      setTimeout(() => t.classList.remove('show'), 3600);
    }

    // ─── SCROLL REVEAL ────────────────────────────────────────────
    const observer = new IntersectionObserver(entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) setTimeout(() => entry.target.classList.add('visible'), i * 90);
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // ─── ACTIVE NAV ───────────────────────────────────────────────
    const sections = document.querySelectorAll('[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const secObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('active'));
          const link = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
          if (link) link.classList.add('active');
        }
      });
    }, { rootMargin: '-35% 0px -35% 0px' });
    sections.forEach(s => secObs.observe(s));

    // ─── KEYBOARD ─────────────────────────────────────────────────
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { closeSidebar(); closeAuthModal(); }
    });

    // ─── TYPEWRITER TAGLINE ───────────────────────────────────────
    (function () {
      const phrases = [
        'One Vortex at a Time',
        'Engineering the Future',
        'Speed. Privacy. Power.',
        'Open Source. No Limits.',
        'Built by Teens. Built for All.'
      ];
      const el = document.getElementById('taglineText');
      let pi = 0, ci = 0, deleting = false;
      function tick() {
        const phrase = phrases[pi];
        if (!deleting) {
          el.textContent = phrase.slice(0, ++ci);
          if (ci === phrase.length) { deleting = true; setTimeout(tick, 2200); return; }
          setTimeout(tick, 85);
        } else {
          el.textContent = phrase.slice(0, --ci);
          if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(tick, 400); return; }
          setTimeout(tick, 42);
        }
      }
      tick();
    })();

    // ─── ANIMATED STAT COUNTERS ───────────────────────────────────
    const statNums = document.querySelectorAll('.stat-num[data-target]');
    const statObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = +el.dataset.target;
        const duration = target > 1000 ? 2000 : 900;
        const start = Date.now();
        const step = () => {
          const p = Math.min((Date.now() - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(ease * target);
          if (p < 1) requestAnimationFrame(step);
        };
        step();
        statObs.unobserve(el);
      });
    }, { threshold: 0.3 });
    statNums.forEach(n => statObs.observe(n));

    // ─── 3D TILT ON PROJECT CARDS ─────────────────────────────────
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.style.transition = 'box-shadow 0.15s, border-color 0.3s';
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg) translateY(-6px)`;
        card.style.boxShadow = `${-x * 20}px ${-y * 20}px 40px rgba(0,229,255,0.11), 0 20px 45px rgba(0,0,0,0.45)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
      });
    });

    // ─── TILT ON WORD/TEAM CARDS ──────────────────────────────────
    document.querySelectorAll('.word-card, .team-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(600px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });

    // ─── CLICK PARTICLE BURST ─────────────────────────────────────
    document.addEventListener('click', e => {
      const colors = ['#00e5ff', '#0066ff', '#ffffff', '#00ffcc', '#ff00cc'];
      for (let i = 0; i < 10; i++) {
        const p = document.createElement('div');
        p.className = 'click-particle';
        const size = Math.random() * 5 + 2;
        const angle = Math.random() * Math.PI * 2;
        const dist = 30 + Math.random() * 55;
        p.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;width:${size}px;height:${size}px;background:${colors[Math.floor(Math.random() * colors.length)]};--tx:${Math.cos(angle) * dist}px;--ty:${Math.sin(angle) * dist}px;box-shadow:0 0 6px currentColor;animation-duration:${0.45 + Math.random() * 0.4}s;`;
        document.body.appendChild(p);
        p.addEventListener('animationend', () => p.remove());
      }
    });

    // ─── FLOATING AMBIENT ORBS ────────────────────────────────────
    (function () {
      const configs = [
        { w: 500, color: '#00e5ff', top: '8%', left: '4%', dur: '20s' },
        { w: 380, color: '#0055ff', top: '58%', left: '72%', dur: '25s' },
        { w: 280, color: '#00ffcc', top: '78%', left: '18%', dur: '17s' },
      ];
      configs.forEach(cfg => {
        const orb = document.createElement('div');
        orb.className = 'orb';
        orb.style.cssText = `width:${cfg.w}px;height:${cfg.w}px;background:${cfg.color};top:${cfg.top};left:${cfg.left};animation-duration:${cfg.dur};`;
        document.body.appendChild(orb);
      });
    })();

    // ─── MAGNETIC BUTTONS ─────────────────────────────────────────
    document.querySelectorAll('.btn-cta-primary, .btn-outline').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.28;
        const y = (e.clientY - r.top - r.height / 2) * 0.28;
        btn.style.transform = `translate(${x}px,${y}px) translateY(-2px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });

    // ─── NAV SCROLL ENHANCEMENT ───────────────────────────────────
    window.addEventListener('scroll', () => {
      const nav = document.getElementById('navbar');
      const s = Math.min(window.scrollY / 200, 1);
      nav.style.background = `rgba(2,10,20,${0.7 + 0.25 * s})`;
      nav.style.boxShadow = s > 0.3 ? `0 2px 30px rgba(0,229,255,${0.06 * s})` : '';
    }, { passive: true });

