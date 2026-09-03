document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.section, .hero, .page-hero, .footer').forEach((element, index) => {
    element.classList.add('reveal');
    element.style.transitionDelay = `${index * 70}ms`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

  const animatedWords = document.querySelectorAll('.hero-animated-word');
  if (animatedWords.length) {
    let activeIndex = 0;

    setInterval(() => {
      const current = animatedWords[activeIndex];
      activeIndex = (activeIndex + 1) % animatedWords.length;
      const next = animatedWords[activeIndex];

      // Exit: slide current word upward
      current.classList.remove('is-active');
      current.classList.add('is-leaving');

      // Clean up leaving class after transition completes
      setTimeout(() => {
        current.classList.remove('is-leaving');
      }, 560);

      // Enter: slide next word in from below
      next.classList.add('is-active');
    }, 2400);
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('mobileNav');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });

    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
      });
    });
  }

  document.querySelectorAll('.faq-item').forEach((item) => {
    const button = item.querySelector('.faq-question');

    if (!button) return;

    button.addEventListener('click', () => {
      const shouldOpen = item.getAttribute('data-open') !== 'true';

      document.querySelectorAll('.faq-item').forEach((other) => {
        other.setAttribute('data-open', 'false');
      });

      item.setAttribute('data-open', shouldOpen ? 'true' : 'false');
    });
  });
});
