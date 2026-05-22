/* =========================================================
   CUSTOM CURSOR — AM Builders
   Orange dot + ghost ring, scales on hover.
   ========================================================= */
(function () {
  'use strict';

  // Skip on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mouseX = -100, mouseY = -100;
  let followerX = -100, followerY = -100;
  let raf;

  // ---- Track mouse ----
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // ---- Animate loop ----
  function animateCursor() {
    // Instant for the dot
    cursor.style.left   = mouseX + 'px';
    cursor.style.top    = mouseY + 'px';

    // Lag for the follower
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';

    raf = requestAnimationFrame(animateCursor);
  }
  raf = requestAnimationFrame(animateCursor);

  // ---- Hover state ----
  const hoverTargets = 'a, button, [data-magnetic], .service-card, .testimonial-card, .carousel-btn, .social-link, input, textarea, select';

  function onEnter() {
    cursor.classList.add('is-hover');
    follower.classList.add('is-hover');
  }

  function onLeave() {
    cursor.classList.remove('is-hover');
    follower.classList.remove('is-hover');
  }

  // Use event delegation
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) onEnter();
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) onLeave();
  });

  // ---- Hide when leaving window ----
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '';
  });
})();
