/* =========================================================
   GSAP + ScrollTrigger ANIMATIONS â€” Insulara
   Hero word split, scroll reveals, stat counters,
   clip-path image reveals, parallax orb.
   ========================================================= */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Show everything immediately
    document.querySelectorAll('.reveal-text, .reveal-up').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  function init() {
    if (!window.gsap || !window.ScrollTrigger) return;

    const gsap = window.gsap;
    gsap.registerPlugin(ScrollTrigger);
    document.dispatchEvent(new CustomEvent('gsapReady'));

    // -----------------------------------------------------------
    // 1. HERO WORD-BY-WORD ANIMATION (triggered after preloader)
    // -----------------------------------------------------------
    function animateHero() {
      const words = document.querySelectorAll('.hero__word');
      if (!words.length) return;

      gsap.set(words, { y: '110%', opacity: 0 });

      gsap.to(words, {
        y: '0%',
        opacity: 1,
        duration: 1,
        ease: 'power4.out',
        stagger: 0.12,
        delay: 0.2,
      });

      // Eyebrow + sub + ctas
      const heroExtras = document.querySelectorAll('.hero__eyebrow, .hero__sub, .hero__ctas');
      gsap.to(heroExtras, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        delay: 0.7,
      });
    }

    // Set initial state for hero extras
    gsap.set('.hero__eyebrow, .hero__sub, .hero__ctas', { opacity: 0, y: 20 });

    document.addEventListener('preloaderDone', animateHero, { once: true });
    // Fallback â€” fire even if preloader event was missed
    setTimeout(animateHero, 2400);

    // -----------------------------------------------------------
    // 2. SPLIT HEADING â€” word-by-word reveal on scroll
    // -----------------------------------------------------------
    function splitAndReveal(heading) {
      const text = heading.textContent;
      // Preserve <br> as line breaks
      const html = heading.innerHTML;
      const lines = html.split('<br>');

      heading.innerHTML = lines.map(line => {
        const words = line.trim().split(' ');
        return words.map(w => {
          if (!w) return '';
          return `<span class="word-wrap"><span class="word">${w}</span></span>`;
        }).join(' ');
      }).join('<br>');

      const wordEls = heading.querySelectorAll('.word');

      gsap.fromTo(wordEls,
        { y: '105%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          duration: 0.8,
          ease: 'power4.out',
          stagger: 0.06,
          scrollTrigger: {
            trigger: heading,
            start: 'top 88%',
            toggleActions: 'play none none none',
          }
        }
      );
    }

    // Run on all split-heading elements NOT in the hero
    document.querySelectorAll('.split-heading').forEach((h) => {
      if (!h.closest('.hero')) splitAndReveal(h);
    });

    // -----------------------------------------------------------
    // 3. REVEAL TEXT (fade + translate Y)
    // -----------------------------------------------------------
    document.querySelectorAll('.reveal-text').forEach((el) => {
      if (el.closest('.hero')) return; // hero handled separately
      gsap.fromTo(el,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: 'power3.out',
          delay: parseFloat(getComputedStyle(el).getPropertyValue('--delay') || '0'),
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
          }
        }
      );
    });

    // -----------------------------------------------------------
    // 4. REVEAL UP (cards, steps, badges)
    // -----------------------------------------------------------
    document.querySelectorAll('.reveal-up').forEach((el) => {
      const delay = parseFloat(getComputedStyle(el).getPropertyValue('--delay') || '0');
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          }
        }
      );
    });

    // -----------------------------------------------------------
    // 5. SERVICE CARDS â€” stagger
    // -----------------------------------------------------------
    const serviceCards = document.querySelectorAll('.service-card');
    if (serviceCards.length) {
      gsap.fromTo(serviceCards,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.services-grid',
            start: 'top 85%',
          }
        }
      );
    }

    // -----------------------------------------------------------
    // 6. STAT COUNTERS
    // -----------------------------------------------------------
    document.querySelectorAll('.stat-num').forEach((el) => {
      const target  = parseInt(el.dataset.target, 10);
      const suffix  = el.dataset.suffix || '';
      const obj     = { val: 0 };

      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = Math.round(obj.val) + suffix;
            }
          });
        }
      });
    });

    // -----------------------------------------------------------
    // 7. IMAGE CLIP-PATH REVEALS
    // -----------------------------------------------------------
    document.querySelectorAll('.service-detail__img-wrap').forEach((wrap) => {
      gsap.fromTo(wrap,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1.1,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: wrap,
            start: 'top 85%',
          }
        }
      );
    });

    const storyImgWrap = document.querySelector('.story__img-wrap');
    if (storyImgWrap) {
      gsap.fromTo(storyImgWrap,
        { clipPath: 'inset(0 0 100% 0)' },
        {
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.1,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: storyImgWrap,
            start: 'top 85%',
          }
        }
      );
    }

    // -----------------------------------------------------------
    // 8. HERO ORB MOUSE PARALLAX
    // -----------------------------------------------------------
    const orb = document.querySelector('.hero .hero__orb');
    if (orb) {
      document.addEventListener('mousemove', (e) => {
        const xPct = (e.clientX / window.innerWidth - 0.5) * 30;
        const yPct = (e.clientY / window.innerHeight - 0.5) * 15;
        gsap.to(orb, {
          x: xPct,
          y: yPct,
          duration: 2,
          ease: 'power2.out',
        });
      });
    }

    // -----------------------------------------------------------
    // 9. SCROLL PROGRESS BAR
    // -----------------------------------------------------------
    let progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.className = 'scroll-progress';
      document.body.appendChild(progressBar);
    }

    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        progressBar.style.width = (self.progress * 100) + '%';
      }
    });

    // -----------------------------------------------------------
    // 10. NAV SHRINK ON SCROLL
    // -----------------------------------------------------------
    const header = document.getElementById('siteHeader');
    if (header) {
      ScrollTrigger.create({
        trigger: document.body,
        start: 'top+=80 top',
        onEnter: ()  => header.classList.add('is-scrolled'),
        onLeaveBack: () => header.classList.remove('is-scrolled'),
      });
    }

    // -----------------------------------------------------------
    // 11. PROCESS STEP â€” STAGGER
    // -----------------------------------------------------------
    const processSteps = document.querySelectorAll('.process__step');
    if (processSteps.length) {
      gsap.fromTo(processSteps,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: '.process__steps',
            start: 'top 85%',
          }
        }
      );
    }

    // -----------------------------------------------------------
    // 12. HORIZONTAL MARQUEE â€” speed on scroll
    // -----------------------------------------------------------
    const marqueeInner = document.querySelector('.marquee__inner');
    if (marqueeInner) {
      ScrollTrigger.create({
        trigger: '.hero__marquee',
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const speed = 1 + Math.abs(self.getVelocity()) / 300;
          marqueeInner.style.animationDuration = (30 / Math.min(speed, 5)) + 's';
        }
      });
    }

    // Refresh on images load
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }

  // Run after DOM ready + small delay to allow CDN scripts to parse
  if (document.readyState !== 'loading') {
    setTimeout(init, 50);
  } else {
    document.addEventListener('DOMContentLoaded', () => setTimeout(init, 50));
  }
})();

