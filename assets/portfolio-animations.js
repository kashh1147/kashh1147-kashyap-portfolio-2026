(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const style = document.createElement('style');
  style.textContent = `
    .motion-progress{position:fixed;top:0;left:0;width:100%;height:3px;z-index:9999;pointer-events:none;background:transparent}
    .motion-progress-fill{height:100%;width:0;background:linear-gradient(90deg,#c3833f,#5f8d7a,#2f6690,#6860a8);background-size:220% 100%;animation:motionShimmer 4s ease-in-out infinite}
    @keyframes motionShimmer{0%,100%{background-position:0 50%}50%{background-position:100% 50%}}
    .motion-canvas{position:fixed;inset:0;z-index:-2;pointer-events:none;opacity:.48}
    .motion-cursor{position:fixed;left:0;top:0;width:360px;height:360px;border-radius:50%;z-index:-1;pointer-events:none;opacity:0;transform:translate3d(-50%,-50%,0);background:radial-gradient(circle,rgba(195,131,63,.18),rgba(95,141,122,.09) 38%,transparent 70%);transition:opacity .25s ease}
    .motion-enter{opacity:0;transform:translateY(28px);transition:opacity .85s cubic-bezier(.16,1,.3,1),transform .85s cubic-bezier(.16,1,.3,1)}
    .motion-enter.motion-visible{opacity:1;transform:translateY(0)}
    .motion-section{opacity:0;transform:translateY(34px);transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1)}
    .motion-section.motion-visible{opacity:1;transform:translateY(0)}
    .motion-section .card{opacity:0;transform:translateY(22px);transition:opacity .65s cubic-bezier(.16,1,.3,1),transform .65s cubic-bezier(.16,1,.3,1),box-shadow .25s ease,border-color .25s ease}
    .motion-section.motion-visible .card{opacity:1;transform:translateY(0)}
    .hero{isolation:isolate}
    .hero::before{content:"";position:absolute;width:340px;height:340px;right:-120px;top:-150px;border-radius:50%;border:1px solid rgba(47,102,144,.18);box-shadow:0 0 0 46px rgba(47,102,144,.035),0 0 0 92px rgba(95,141,122,.025);animation:motionOrbit 15s linear infinite;pointer-events:none;z-index:0}
    @keyframes motionOrbit{to{transform:rotate(360deg)}}
    .card{will-change:transform}
    .card.motion-tilt{transition:transform .15s ease,box-shadow .2s ease!important}
    .topbar{transition:box-shadow .25s ease,background .25s ease}
    .topbar.motion-scrolled{box-shadow:0 8px 28px rgba(15,23,42,.09);background:rgba(251,252,253,.97)}
    @media (prefers-reduced-motion:reduce){.motion-enter,.motion-section,.motion-section .card{opacity:1!important;transform:none!important;transition:none!important}.hero::before,.motion-progress-fill{animation:none!important}.motion-cursor,.motion-canvas{display:none!important}}
  `;
  document.head.appendChild(style);

  const progress = document.createElement('div');
  progress.className = 'motion-progress';
  progress.innerHTML = '<div class="motion-progress-fill"></div>';
  document.body.prepend(progress);
  const progressFill = progress.firstElementChild;

  const canvas = document.createElement('canvas');
  canvas.className = 'motion-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);

  const cursor = document.createElement('div');
  cursor.className = 'motion-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  document.body.prepend(cursor);

  const topbar = document.querySelector('.topbar');
  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressFill.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    topbar?.classList.toggle('motion-scrolled', window.scrollY > 18);
  };
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  if (reduceMotion) return;

  const heroItems = document.querySelectorAll('.hero .eyebrow, .hero h1, .hero .lead, .hero .status-line, .hero .actions, .hero .stats');
  heroItems.forEach((el, i) => {
    el.classList.add('motion-enter');
    el.style.transitionDelay = `${100 + i * 130}ms`;
  });
  requestAnimationFrame(() => requestAnimationFrame(() => heroItems.forEach(el => el.classList.add('motion-visible'))));

  const sections = document.querySelectorAll('.panel');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('motion-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

  sections.forEach(section => {
    section.classList.add('motion-section');
    section.querySelectorAll('.card').forEach((card, i) => {
      card.style.transitionDelay = `${Math.min(i * 75, 450)}ms`;
    });
    observer.observe(section);
  });

  if (window.matchMedia('(hover:hover)').matches) {
    window.addEventListener('pointermove', event => {
      cursor.style.opacity = '1';
      cursor.style.transform = `translate3d(${event.clientX - 180}px,${event.clientY - 180}px,0)`;
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });

    document.querySelectorAll('.card').forEach(card => {
      card.classList.add('motion-tilt');
      card.addEventListener('pointermove', event => {
        const r = card.getBoundingClientRect();
        const rx = ((event.clientY - r.top) / r.height - .5) * -4;
        const ry = ((event.clientX - r.left) / r.width - .5) * 4;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let dpr = 1;
  let phase = 0;

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  window.addEventListener('resize', resize, { passive: true });
  resize();

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    const grid = 44;
    const drift = (phase % grid);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(47,102,144,.075)';
    for (let x = -grid + drift; x < width + grid; x += grid) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = -grid + drift * .35; y < height + grid; y += grid) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }
    const pulse = 5 + Math.sin(phase * .025) * 2;
    [[width*.14,height*.22],[width*.83,height*.28],[width*.72,height*.72],[width*.26,height*.78]].forEach(([x,y],i) => {
      ctx.beginPath();
      ctx.arc(x + Math.sin(phase*.012+i)*9, y + Math.cos(phase*.01+i)*7, pulse, 0, Math.PI*2);
      ctx.fillStyle = i % 2 ? 'rgba(95,141,122,.16)' : 'rgba(195,131,63,.14)';
      ctx.fill();
    });
    phase += .18;
    requestAnimationFrame(draw);
  };
  draw();
})();
