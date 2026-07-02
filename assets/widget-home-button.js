(() => {
  if (document.querySelector('[data-portfolio-home-button]')) return;

  const style = document.createElement('style');
  style.textContent = `
    .portfolio-home-button {
      position: fixed;
      left: 18px;
      bottom: 18px;
      z-index: 10000;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 42px;
      padding: 0 15px;
      border: 1px solid rgba(30, 41, 59, 0.18);
      border-radius: 999px;
      background: rgba(17, 24, 39, 0.94);
      color: #fff;
      font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.02em;
      text-decoration: none;
      box-shadow: 0 12px 30px rgba(15, 23, 42, 0.22);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      transition: transform 220ms cubic-bezier(.16, 1, .3, 1), box-shadow 220ms ease, background 220ms ease;
    }
    .portfolio-home-button:hover,
    .portfolio-home-button:focus-visible {
      transform: translateY(-3px);
      background: #1f4d70;
      box-shadow: 0 16px 36px rgba(15, 23, 42, 0.28);
      outline: none;
    }
    .portfolio-home-button svg {
      width: 16px;
      height: 16px;
      flex: 0 0 auto;
    }
    @media (max-width: 620px) {
      .portfolio-home-button {
        left: 12px;
        bottom: 12px;
        min-height: 40px;
        padding: 0 13px;
      }
    }
    @media print {
      .portfolio-home-button { display: none !important; }
    }
  `;
  document.head.appendChild(style);

  const home = document.createElement('a');
  home.className = 'portfolio-home-button';
  home.href = '../index.html';
  home.setAttribute('data-portfolio-home-button', 'true');
  home.setAttribute('aria-label', 'Return to portfolio home page');
  home.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3 11.5 12 4l9 7.5"></path>
      <path d="M5.5 10.5V20h13v-9.5"></path>
      <path d="M9.5 20v-6h5v6"></path>
    </svg>
    <span>Home</span>
  `;
  document.body.appendChild(home);
})();
