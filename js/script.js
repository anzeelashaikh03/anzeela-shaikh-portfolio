(() => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealItems = document.querySelectorAll('.reveal');
  if (revealItems.length && !reducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.14, rootMargin: '40px 0px -10px 0px' });

    revealItems.forEach((el) => observer.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add('show'));
  }

  const setVars = (x, y) => {
    document.documentElement.style.setProperty('--mx', `${x}px`);
    document.documentElement.style.setProperty('--my', `${y}px`);
  };

  let raf = 0;
  window.addEventListener('pointermove', (e) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      setVars(e.clientX, e.clientY);
      raf = 0;
    });
  }, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      const target = id && document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, { passive: false });
  });

  const mobileLinkedIn = 'linkedin://in/anzeela-cpa/';
  const desktopLinkedIn = 'https://www.linkedin.com/in/anzeela-cpa/';

  document.querySelectorAll('.linkedin-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      if (!isMobile) return;

      const href = link.getAttribute('href') || desktopLinkedIn;
      e.preventDefault();

      let fallbackTimer = window.setTimeout(() => {
        window.location.href = href;
      }, 650);

      const cancelFallback = () => {
        window.clearTimeout(fallbackTimer);
      };

      window.addEventListener('pagehide', cancelFallback, { once: true });

      try {
        window.location.href = mobileLinkedIn;
      } catch {
        window.location.href = href;
      }
    });
  });

  const nav = document.querySelector('nav[aria-label="Primary"]');
  if (nav) {
    nav.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof HTMLAnchorElement)) return;
      const hash = target.getAttribute('href');
      if (!hash || !hash.startsWith('#')) return;
      const section = document.querySelector(hash);
      if (!section) return;
      e.preventDefault();
      section.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
  }
})();