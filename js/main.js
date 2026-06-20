/* ---- Sticky header ---- */
(function () {
  const header = document.querySelector('.header');
  if (!header) return;
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();

/* ---- Burger menu ---- */
(function () {
  const burger = document.querySelector('.header__burger');
  const nav    = document.querySelector('.header__nav');
  if (!burger || !nav) return;

  burger.addEventListener('click', function () {
    const isOpen = nav.classList.toggle('open');
    burger.classList.toggle('active', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  nav.querySelectorAll('.header__link').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('open');
      burger.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
})();

/* ---- Scroll fade-in ---- */
(function () {
  const sections = document.querySelectorAll(
    '.tagline, .benefits, .products-trio, .composition, .target, .comparison, .price-section, .order, .faq, .contact'
  );

  if (!('IntersectionObserver' in window)) {
    sections.forEach(function (el) { el.classList.add('visible'); });
    return;
  }

  sections.forEach(function (el) { el.classList.add('fade-in-up'); });

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  sections.forEach(function (el) { observer.observe(el); });
})();

/* ---- Target cards slider ---- */
(function () {
  var cards = document.querySelectorAll('.target__card');
  if (!cards.length) return;

  var current = 1;

  function setActive(index) {
    cards.forEach(function (c) { c.classList.remove('target__card--active'); });
    cards[index].classList.add('target__card--active');
    current = index;
  }

  var prevBtn = document.getElementById('targetPrev');
  var nextBtn = document.getElementById('targetNext');

  if (prevBtn) prevBtn.addEventListener('click', function () {
    setActive((current - 1 + cards.length) % cards.length);
  });
  if (nextBtn) nextBtn.addEventListener('click', function () {
    setActive((current + 1) % cards.length);
  });

  cards.forEach(function (card, i) {
    card.addEventListener('click', function () { setActive(i); });
  });
})();

/* ---- Phone mask ---- */
(function () {
  function applyPhoneMask(input) {
    var pos = input.selectionStart;
    var raw = input.value.replace(/\D/g, '');
    if (raw.startsWith('8')) raw = '7' + raw.slice(1);
    if (!raw.startsWith('7') && raw.length) raw = '7' + raw;
    raw = raw.slice(0, 11);

    var formatted = '';
    if (raw.length >= 1)  formatted  = '+7';
    if (raw.length >= 2)  formatted += ' (' + raw.slice(1, Math.min(4, raw.length));
    if (raw.length >= 4)  formatted += ') ' + raw.slice(4, Math.min(7, raw.length));
    if (raw.length >= 7)  formatted += '-' + raw.slice(7, Math.min(9, raw.length));
    if (raw.length >= 9)  formatted += '-' + raw.slice(9, 11);

    input.value = formatted;
  }

  document.querySelectorAll('input[type="tel"]').forEach(function (input) {
    input.addEventListener('input', function () { applyPhoneMask(input); });
    input.addEventListener('focus', function () {
      if (!input.value) input.value = '+7 (';
    });
    input.addEventListener('blur', function () {
      if (input.value === '+7 (' || input.value === '+7') input.value = '';
    });
  });
})();

/* ---- Form submission ---- */
(function () {
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setError(field) {
    field.style.borderColor = '#ef4444';
    field.addEventListener('input', function () { field.style.borderColor = ''; }, { once: true });
  }

  function validateField(f) {
    if (f.type === 'checkbox') return f.checked;
    if (!f.value.trim()) return false;
    if (f.type === 'tel') return f.value.replace(/\D/g, '').length === 11;
    if (f.type === 'email') return emailRe.test(f.value);
    return true;
  }

  document.querySelectorAll('input[type="email"]').forEach(function (input) {
    input.addEventListener('blur', function () {
      if (input.value && !emailRe.test(input.value)) setError(input);
    });
    input.addEventListener('input', function () {
      input.style.borderColor = '';
    });
  });

  function handleSubmit(form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var valid = true;

      form.querySelectorAll('[required]').forEach(function (f) {
        if (!validateField(f)) { setError(f); valid = false; }
      });

      form.querySelectorAll('input[type="email"]').forEach(function (f) {
        if (f.value && !emailRe.test(f.value)) { setError(f); valid = false; }
      });

      if (!valid) return;

      var original = form.innerHTML;
      form.innerHTML =
        '<div class="form-success">' +
          '<div class="form-success__icon">' +
            '<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M6 14l5 5 11-10" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '</div>' +
          '<p class="form-success__title">Заявка отправлена!</p>' +
          '<p class="form-success__text">Мы свяжемся с вами в ближайшее время.</p>' +
        '</div>';

      setTimeout(function () { form.innerHTML = original; handleSubmit(form); }, 5000);
    });
  }

  document.querySelectorAll('form').forEach(handleSubmit);
})();

/* ---- Benefits: wave draw + card slide-in ---- */
(function () {
  var wavePath = document.querySelector('.benefits__wave-path');
  var cards = document.querySelectorAll('.benefits .benefits__card');
  var section = document.querySelector('.benefits');

  if (!('IntersectionObserver' in window)) {
    if (wavePath) wavePath.classList.add('wave-drawn');
    cards.forEach(function (c) { c.classList.add('card-anim', 'card-visible'); });
    return;
  }

  if (wavePath && section) {
    new IntersectionObserver(function (entries, obs) {
      if (entries[0].isIntersecting) {
        wavePath.classList.add('wave-drawn');
        obs.disconnect();
      }
    }, { threshold: 0.05 }).observe(section);
  }

  cards.forEach(function (card) {
    card.classList.add('card-anim');
    new IntersectionObserver(function (entries, obs) {
      if (entries[0].isIntersecting) {
        card.classList.add('card-visible');
        obs.disconnect();
      }
    }, { threshold: 0.2 }).observe(card);
  });
})();

/* ---- Smooth scroll (anchors + data-scroll buttons) ---- */
(function () {
  function scrollTo(id) {
    if (!id || id === '#') return;
    var target = document.querySelector(id);
    if (!target) return;
    var top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      scrollTo(link.getAttribute('href'));
    });
  });

  document.querySelectorAll('button[data-scroll]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      scrollTo(btn.getAttribute('data-scroll'));
    });
  });
})();

/* ---- Benefits cards slider ---- */
(function () {
  var wrapper = document.querySelector('.benefits__cards-wrapper');
  if (!wrapper) return;
  var areas = wrapper.querySelectorAll('.benefits__area');
  if (!areas.length) return;
  var current = 0;
  var cardWidth = areas[0].offsetWidth + 12;

  wrapper.addEventListener('scroll', function () {
    current = Math.round(wrapper.scrollLeft / cardWidth);
  }, { passive: true });
})();

/* ---- FAQ accordion animation ---- */
(function () {
  document.querySelectorAll('.faq__item').forEach(function (item) {
    var summary = item.querySelector('.faq__question');
    var answer  = item.querySelector('.faq__answer');
    if (!summary || !answer) return;

    function openItem() {
      item.classList.add('is-open');
      answer.style.maxHeight = '0px';
      requestAnimationFrame(function () {
        answer.style.maxHeight = (answer.scrollHeight + 24) + 'px';
      });
    }

    function closeItem() {
      item.classList.remove('is-open');
      answer.style.maxHeight = '0px';
    }

    summary.addEventListener('click', function (e) {
      e.preventDefault();
      if (item.classList.contains('is-open')) closeItem();
      else openItem();
    });
  });
})();
