/*
 * Scroll Animations — fade-in sections on scroll using Intersection Observer
 */
(function () {
  // Inject animation styles
  var style = document.createElement('style');
  style.textContent =
    '.sa-hidden {' +
      'opacity: 0;' +
      'transform: translateY(32px);' +
      'transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);' +
    '}' +
    '.sa-visible {' +
      'opacity: 1;' +
      'transform: translateY(0);' +
    '}';
  document.head.appendChild(style);

  function init() {
    // Target sections, cards, grids, role blocks, stat strips, diagrams
    var targets = document.querySelectorAll(
      '.section, .about-card, .cs-card, .role-block, .thinking-block, ' +
      '.stat-strip, .phase-card, .learning-card, .finding-card, .stream-card, ' +
      '.framework-card, .concept-card, .compare-card, .opp-card, .principle, ' +
      '.diagram, .north-star, .quote-block, .img-full, .img-wide, .img-pair'
    );

    for (var i = 0; i < targets.length; i++) {
      targets[i].classList.add('sa-hidden');
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Stagger children slightly for grid items
          var delay = 0;
          var parent = entry.target.parentElement;
          if (parent) {
            var siblings = parent.querySelectorAll('.sa-hidden');
            for (var j = 0; j < siblings.length; j++) {
              if (siblings[j] === entry.target) {
                delay = j * 80;
                break;
              }
            }
          }
          var el = entry.target;
          setTimeout(function () {
            el.classList.add('sa-visible');
          }, Math.min(delay, 320));
          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    for (var k = 0; k < targets.length; k++) {
      observer.observe(targets[k]);
    }
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
