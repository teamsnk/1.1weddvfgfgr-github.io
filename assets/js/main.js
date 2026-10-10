(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav a');

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      nav.classList.toggle('open', !isOpen);
      document.body.classList.toggle('menu-open', !isOpen);
    });
    navLinks.forEach(link => link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
      document.body.classList.remove('menu-open');
    }));
  }

  // Scroll reveal, with a graceful fallback for older browsers.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  // Subtle pointer glow on desktop only.
  const glow = document.querySelector('.cursor-glow');
  if (glow && window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('pointermove', event => {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
      glow.style.opacity = '1';
    }, { passive: true });
    document.addEventListener('pointerleave', () => { glow.style.opacity = '0'; });
  }

  // Contact form uses the visitor's default email app; no backend is required.
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const project = String(data.get('project') || '').trim();
      const subject = encodeURIComponent(`SNK Design enquiry from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nProject details:\n${project}`);
      window.location.href = `mailto:hello@snkdesign.studio?subject=${subject}&body=${body}`;
      if (note) note.textContent = 'Your email app should open with the enquiry pre-filled. Update the email address in index.html if needed.';
    });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Keep one service detail expanded at a time for a tidy accordion.
  const serviceItems = document.querySelectorAll('.service-item');
  serviceItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) serviceItems.forEach(other => { if (other !== item) other.open = false; });
    });
  });
})();