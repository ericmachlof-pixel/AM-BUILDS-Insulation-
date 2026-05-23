/* =========================================================
   CONTACT FORM â€” Insulara
   Client-side validation, AJAX POST, floating labels.
   ========================================================= */
(function () {
  'use strict';

  const form     = document.getElementById('contactForm');
  const submitBtn = document.getElementById('formSubmit');
  const response  = document.getElementById('formResponse');

  if (!form) return;

  // ---- Field validators ----
  const validators = {
    name: (v) => v.trim().length >= 2 ? null : 'Please enter your full name (min 2 characters).',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Please enter a valid email address.',
    phone: (v) => v.trim().replace(/\D/g, '').length >= 7 ? null : 'Please enter a valid phone number.',
    service: (v) => v ? null : 'Please select a service.',
    message: (v) => v.trim().length >= 10 ? null : 'Please describe your project (min 10 characters).',
  };

  function getErrorEl(field) {
    return field.parentElement.querySelector('.form-error');
  }

  function validateField(field) {
    const validator = validators[field.name];
    if (!validator) return true;

    const error = validator(field.value);
    const errorEl = getErrorEl(field);

    field.classList.toggle('is-error', !!error);
    if (errorEl) errorEl.textContent = error || '';

    return !error;
  }

  // Live validation on blur
  form.querySelectorAll('.form-control').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('is-error')) validateField(field);
    });
  });

  // ---- Submit ----
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all
    const fields = [...form.querySelectorAll('.form-control')];
    const allValid = fields.map(f => validateField(f)).every(Boolean);

    if (!allValid) {
      // Focus first error
      const firstError = form.querySelector('.is-error');
      if (firstError) firstError.focus();
      return;
    }

    // Loading state
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;
    response.className = 'form-response';
    response.textContent = '';

    const data = new FormData(form);

    try {
      const res = await fetch('/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: new URLSearchParams(data).toString(),
      });

      const json = await res.json();

      if (json.success) {
        response.className = 'form-response success';
        response.textContent = json.message || "Your message was sent! We'll be in touch within 24 hours.";
        form.reset();

        // Scroll to response
        response.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Confetti-style micro celebration (optional)
        triggerSuccessAnimation();
      } else {
        const errorMsg = json.errors ? json.errors.join(' ') : (json.error || 'Something went wrong. Please try again.');
        response.className = 'form-response error';
        response.textContent = errorMsg;
      }
    } catch (err) {
      response.className = 'form-response error';
      response.textContent = 'Network error. Please check your connection and try again, or call us directly.';
    } finally {
      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;
    }
  });

  // ---- Success micro-animation ----
  function triggerSuccessAnimation() {
    if (!window.gsap) return;
    const btn = submitBtn;

    window.gsap.timeline()
      .to(btn, { scale: 0.95, duration: 0.1 })
      .to(btn, { scale: 1,    duration: 0.4, ease: 'elastic.out(1.5, 0.5)' });
  }

  // ---- Phone input formatting ----
  const phoneInput = form.querySelector('#phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 10) val = val.slice(0, 10);
      if (val.length >= 7) {
        val = `(${val.slice(0,3)}) ${val.slice(3,6)}-${val.slice(6)}`;
      } else if (val.length >= 4) {
        val = `(${val.slice(0,3)}) ${val.slice(3)}`;
      } else if (val.length >= 1) {
        val = `(${val}`;
      }
      e.target.value = val;
    });
  }

})();

