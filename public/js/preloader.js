/* =========================================================
   PRELOADER — AM Builders
   Counts 0→100%, then curtain-wipes the screen away.
   ========================================================= */
(function () {
  'use strict';

  const preloader   = document.getElementById('preloader');
  const countEl     = document.getElementById('preloaderCount');
  const barFill     = document.getElementById('preloaderBar');
  const curtainL    = preloader && preloader.querySelector('.preloader__curtain--left');
  const curtainR    = preloader && preloader.querySelector('.preloader__curtain--right');

  if (!preloader) return;

  let count   = 0;
  let start   = null;
  const DURATION = 1600; // ms

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function tick(ts) {
    if (!start) start = ts;
    const elapsed  = ts - start;
    const progress = Math.min(elapsed / DURATION, 1);
    const eased    = easeOutCubic(progress);
    count          = Math.round(eased * 100);

    if (countEl) countEl.textContent = count;
    if (barFill)  barFill.style.width = count + '%';

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      revealSite();
    }
  }

  function revealSite() {
    // GSAP curtain wipe — if GSAP loaded, use it; else CSS fallback
    if (window.gsap) {
      const tl = window.gsap.timeline({
        onComplete: () => {
          preloader.style.display = 'none';
          document.body.classList.remove('is-loading');
        }
      });

      tl.to(preloader.querySelector('.preloader__inner'), {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
      })
      .to([curtainL, curtainR], {
        scaleX: 0,
        duration: 0.8,
        ease: 'power4.inOut',
        stagger: 0.08,
        transformOrigin: (i) => (i === 0 ? 'left center' : 'right center')
      })
      .then(() => {
        // trigger hero animations
        document.dispatchEvent(new CustomEvent('preloaderDone'));
      });

    } else {
      // CSS fallback
      if (curtainL) curtainL.classList.add('preloader__curtain--exit-left');
      if (curtainR) curtainR.classList.add('preloader__curtain--exit-right');

      setTimeout(() => {
        preloader.style.display = 'none';
        document.body.classList.remove('is-loading');
        document.dispatchEvent(new CustomEvent('preloaderDone'));
      }, 900);
    }
  }

  // Defer tick until GSAP and fonts are as ready as possible
  function start_() {
    requestAnimationFrame(tick);
  }

  if (document.readyState === 'complete') {
    start_();
  } else {
    window.addEventListener('load', start_);
    // Safety — start after 200ms regardless (avoids stall on slow CDN)
    setTimeout(start_, 200);
  }
})();
