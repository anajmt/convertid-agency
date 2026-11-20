// ConvertID website — menu, header shadow, scorecard form
(function () {
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Scorecard form posts to the Formspree endpoint set in the form's action attribute.
  var form = document.querySelector('form[name="scorecard"]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('.form-status');
      var btn = form.querySelector('button[type="submit"]');
      if (!form.checkValidity()) { form.reportValidity(); return; }
      btn.disabled = true;
      status.className = 'form-status';
      status.textContent = 'Sending…';
      var body = new URLSearchParams(new FormData(form)).toString();
      fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
        body: body
      }).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        form.reset();
        status.className = 'form-status ok';
        status.textContent = 'Thank you. Your scorecard request is in. We will review your emails and send the scorecard to your inbox.';
      }).catch(function () {
        status.className = 'form-status err';
        status.innerHTML = 'Sorry, that did not send. Please email <a href="mailto:support.convertid@gmail.com">support.convertid@gmail.com</a>.';
      }).finally(function () { btn.disabled = false; });
    });
  }

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
