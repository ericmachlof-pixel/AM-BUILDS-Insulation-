/* =========================================================
   LENIS SMOOTH SCROLL — AM Builders
   ========================================================= */
(function () {
  'use strict';

  // Skip if reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Wait for Lenis to be available
  function initLenis() {
    if (typeof Lenis === 'undefined') return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Expose globally for GSAP ScrollTrigger integration
    window.__lenis = lenis;

    // Hook into GSAP ScrollTrigger if available
    function connectScrollTrigger() {
      if (window.ScrollTrigger) {
        lenis.on('scroll', window.ScrollTrigger.update);

        window.gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        window.gsap.ticker.lagSmoothing(0);
      }
    }

    // RAF loop (fallback if no GSAP)
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    if (window.gsap && window.ScrollTrigger) {
      connectScrollTrigger();
    } else {
      requestAnimationFrame(raf);
      // Also try connecting once GSAP loads
      document.addEventListener('gsapReady', connectScrollTrigger, { once: true });
    }

    // Anchor link smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const id = anchor.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80, duration: 1.4 });
      });
    });

    // Expose for external control
    window.lenisScrollTo = (target, opts) => lenis.scrollTo(target, opts);
  }

  // Try immediately, retry on load
  initLenis();
  window.addEventListener('load', initLenis, { once: true });
})();
