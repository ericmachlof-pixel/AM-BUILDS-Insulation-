/* =========================================================
   MAIN.JS â€” Insulara
   Nav, mobile menu, magnetic buttons, testimonial
   carousel, page transitions, misc interactions.
   ========================================================= */
(function () {
  'use strict';

  // =========================================================
  // MOBILE MENU
  // =========================================================
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('is-open');
      mobileMenu.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';

      // Pause/resume Lenis
      if (window.__lenis) {
        isOpen ? window.__lenis.stop() : window.__lenis.start();
      }
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('is-open');
        mobileMenu.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        if (window.__lenis) window.__lenis.start();
      });
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        hamburger.classList.remove('is-open');
        mobileMenu.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        if (window.__lenis) window.__lenis.start();
      }
    });
  }

  // =========================================================
  // SERVICE AREAS DROPDOWN
  // =========================================================
  const dropdownParent = document.querySelector('.nav-dropdown');
  const dropdownToggle = document.querySelector('.nav-dropdown__toggle');
  const dropdownMenu   = document.querySelector('.nav-dropdown__menu');

  if (dropdownParent && dropdownToggle && dropdownMenu) {
    // Toggle on click
    dropdownToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdownParent.classList.toggle('is-open');
      dropdownToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close when clicking outside
    document.addEventListener('click', () => {
      dropdownParent.classList.remove('is-open');
      dropdownToggle.setAttribute('aria-expanded', 'false');
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dropdownParent.classList.remove('is-open');
        dropdownToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Keep open when clicking inside menu
    dropdownMenu.addEventListener('click', (e) => e.stopPropagation());
  }

  // =========================================================
  // NAV ACTIVE LINK (non-GSAP fallback)
  // =========================================================
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (href !== '/' && currentPath.startsWith(href))) {
      link.classList.add('is-active');
    }
  });

  // =========================================================
  // MAGNETIC BUTTONS
  // =========================================================
  if (!window.matchMedia('(pointer: coarse)').matches) {
    document.querySelectorAll('[data-magnetic]').forEach(btn => {
      const strength = 0.35;

      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top  + rect.height / 2;
        const dx = (e.clientX - cx) * strength;
        const dy = (e.clientY - cy) * strength;

        if (window.gsap) {
          window.gsap.to(btn, {
            x: dx, y: dy,
            duration: 0.4,
            ease: 'power2.out',
          });
        } else {
          btn.style.transform = `translate(${dx}px, ${dy}px)`;
        }
      });

      btn.addEventListener('mouseleave', () => {
        if (window.gsap) {
          window.gsap.to(btn, {
            x: 0, y: 0,
            duration: 0.7,
            ease: 'elastic.out(1, 0.5)',
          });
        } else {
          btn.style.transform = '';
        }
      });
    });
  }

  // =========================================================
  // TESTIMONIALS CAROUSEL â€” drag + button scroll
  // =========================================================
  const carousel = document.getElementById('testimonialsCarousel');
  const prevBtn  = document.getElementById('carouselPrev');
  const nextBtn  = document.getElementById('carouselNext');

  if (carousel) {
    // Button scroll
    const SCROLL_AMOUNT = () => carousel.querySelector('.testimonial-card')
      ? carousel.querySelector('.testimonial-card').offsetWidth + 24
      : 480;

    if (prevBtn) prevBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: -SCROLL_AMOUNT(), behavior: 'smooth' });
    });

    if (nextBtn) nextBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: SCROLL_AMOUNT(), behavior: 'smooth' });
    });

    // Drag to scroll
    let isDown = false, startX, scrollLeft;

    carousel.addEventListener('mousedown', (e) => {
      isDown    = true;
      startX    = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
      carousel.classList.add('is-dragging');
    });

    carousel.addEventListener('mouseleave', () => {
      isDown = false;
      carousel.classList.remove('is-dragging');
    });

    carousel.addEventListener('mouseup', () => {
      isDown = false;
      carousel.classList.remove('is-dragging');
    });

    carousel.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x    = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 1.5;
      carousel.scrollLeft = scrollLeft - walk;
    });

    // Touch support (native)
    let touchStartX = 0;
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        carousel.scrollBy({
          left: diff > 0 ? SCROLL_AMOUNT() : -SCROLL_AMOUNT(),
          behavior: 'smooth'
        });
      }
    });
  }

  // =========================================================
  // PAGE TRANSITIONS (intra-site links)
  // =========================================================
  const pageTransition = document.getElementById('pageTransition');

  if (pageTransition && window.gsap) {
    // Animate out when navigating to another page
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');

      // Only internal links, skip anchors, tel, mailto, external
      if (!href || href.startsWith('#') || href.startsWith('tel:') ||
          href.startsWith('mailto:') || href.startsWith('http') ||
          link.target === '_blank') return;

      link.addEventListener('click', (e) => {
        e.preventDefault();

        window.gsap.fromTo(pageTransition,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            duration: 0.5,
            ease: 'power4.in',
            onComplete: () => {
              window.location.href = href;
            }
          }
        );
      });
    });

    // Animate in on page enter
    window.addEventListener('pageshow', () => {
      window.gsap.to(pageTransition, {
        scaleX: 0,
        transformOrigin: 'right center',
        duration: 0.6,
        ease: 'power4.out',
        delay: 0.05,
      });
    });
  }

  // =========================================================
  // SCROLL-ACTIVATED NAV (fallback for non-GSAP pages)
  // =========================================================
  const header = document.getElementById('siteHeader');
  if (header && !window.ScrollTrigger) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 80);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // =========================================================
  // STATS COUNTER (CSS fallback if GSAP not loaded)
  // =========================================================
  if (!window.gsap) {
    function countUp(el) {
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      let current  = 0;
      const step   = Math.ceil(target / 60);
      const interval = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + suffix;
        if (current >= target) clearInterval(interval);
      }, 30);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-num').forEach(el => observer.observe(el));
  }

  // =========================================================
  // SCROLL REVEAL (Intersection Observer fallback)
  // =========================================================
  if (!window.gsap) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'none';
          entry.target.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-text, .reveal-up').forEach(el => revealObs.observe(el));
  }

})();

