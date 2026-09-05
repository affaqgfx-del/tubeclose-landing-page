document.addEventListener('DOMContentLoaded', () => {
  const supabaseUrl = 'https://argnkigepffzbykthksw.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyZ25raWdlcGZmemJ5a3Roa3N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1Njc2NzUsImV4cCI6MjEwNDE0MzY3NX0.3IXLvKn9Lsux-FNWnQq_POZikuIKYubStjj4ceVYnE4';

  async function loadSiteContent() {
    const response = await fetch(`${supabaseUrl}/rest/v1/site_content?select=key,value`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseAnonKey}` }
    });
    if (!response.ok) return;
    const rows = await response.json();
    const content = Object.fromEntries(rows.map((row) => [row.key, row.value]));
    const headline = document.getElementById('heroHeadline');
    if (headline && content.hero_headline) headline.textContent = content.hero_headline;
    document.querySelectorAll('a[href="#qualification-form"]').forEach((link) => {
      if (content.hero_cta_text) link.childNodes[0].nodeValue = `${content.hero_cta_text} `;
    });
    const vslSection = document.getElementById('vslSection');
    const vslPlayer = document.getElementById('vslPlayer');
    if (vslSection && vslPlayer && content.vsl_wistia_id) {
      vslSection.hidden = false;
      const player = document.createElement('iframe');
      player.src = `https://fast.wistia.net/embed/iframe/${encodeURIComponent(content.vsl_wistia_id)}?videoFoam=true`;
      player.title = 'TubeClose strategy video';
      player.allow = 'autoplay; fullscreen';
      player.allowFullscreen = true;
      vslPlayer.append(player);
    }
    const testimonialSection = document.getElementById('testimonialVideoSection');
    const testimonialPlayer = document.getElementById('testimonialPlayer');
    const testimonialTitle = document.getElementById('testimonialVideoTitle');
    if (testimonialSection && testimonialPlayer && content.testimonial_wistia_id) {
      testimonialSection.hidden = false;
      if (testimonialTitle && content.testimonial_client_name) {
        testimonialTitle.textContent = `${content.testimonial_client_name}: a client story`;
      }
      const player = document.createElement('iframe');
      player.src = `https://fast.wistia.net/embed/iframe/${encodeURIComponent(content.testimonial_wistia_id)}?videoFoam=true`;
      player.title = 'TubeClose client testimonial';
      player.allow = 'autoplay; fullscreen';
      player.allowFullscreen = true;
      testimonialPlayer.append(player);
    }
  }

  loadSiteContent().catch(() => {});

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
