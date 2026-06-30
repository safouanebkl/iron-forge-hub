/* ============================================
   IRONFORGE — Interactive Behaviors
   Vanilla JS. No dependencies.
   ============================================ */

(() => {
  /* ---------- Theme Toggle (with localStorage) ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const stored = localStorage.getItem('ironforge-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = stored || (prefersDark ? 'dark' : 'light');
  root.setAttribute('data-theme', initial);

  themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('ironforge-theme', next);
  });

  /* ---------- Sticky Navbar Shadow on Scroll ---------- */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    backToTop.classList.toggle('visible', window.scrollY > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile Hamburger Menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const closeMenu = () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  };
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  /* ---------- Back to Top ---------- */
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Scroll Reveal (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        // Stagger slightly when entering at once
        setTimeout(() => e.target.classList.add('visible'), i * 40);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));

  /* ---------- Animated Counters (About stats) ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1600;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(target * eased).toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString() + (target >= 1000 ? '+' : '');
      };
      requestAnimationFrame(step);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterIO.observe(c));

  /* ---------- Testimonials Carousel ---------- */
  const track = document.getElementById('carouselTrack');
  const slides = track.children;
  const dotsWrap = document.getElementById('dots');
  let index = 0;

  // Build dots
  Array.from(slides).forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', `Go to slide ${i + 1}`);
    d.addEventListener('click', () => go(i));
    dotsWrap.appendChild(d);
  });
  const dots = dotsWrap.children;

  const go = (i) => {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    Array.from(dots).forEach((d, k) => d.classList.toggle('active', k === index));
  };

  document.getElementById('prevBtn').addEventListener('click', () => go(index - 1));
  document.getElementById('nextBtn').addEventListener('click', () => go(index + 1));

  // Auto-rotate (pause on hover)
  let timer = setInterval(() => go(index + 1), 6000);
  const carousel = document.getElementById('carousel');
  carousel.addEventListener('mouseenter', () => clearInterval(timer));
  carousel.addEventListener('mouseleave', () => timer = setInterval(() => go(index + 1), 6000));

  /* ---------- Contact Form (frontend-only) ---------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    if (!data.get('name') || !data.get('email')) {
      status.textContent = 'Please fill in your name and email.';
      status.style.color = 'var(--accent)';
      return;
    }
    status.textContent = `Thanks ${data.get('name')}! We'll be in touch within 24 hours.`;
    status.style.color = 'var(--accent)';
    form.reset();
  });

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();