(function(){
  "use strict";

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============ YEAR ============ */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============ NAV SCROLL STATE ============ */
  var nav = document.getElementById('siteNav');
  var lastY = window.scrollY;
  function onScroll(){
    var y = window.scrollY;
    if (nav) nav.classList.toggle('is-scrolled', y > 40);
    var fab = document.getElementById('fabWhatsapp');
    if (fab) fab.classList.toggle('is-visible', y > window.innerHeight * 0.6);
    lastY = y;
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ============ MOBILE MENU ============ */
  var toggle = document.getElementById('navToggle');
var menu = document.getElementById('mobileMenu');
var menuBack = document.getElementById('mobileMenuBack');
function closeMenu(){
  if (!menu) return;
  menu.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  if (toggle) toggle.setAttribute('aria-expanded', 'false');
}
if (toggle && menu){
  toggle.addEventListener('click', function(){
    var open = menu.classList.toggle('is-open');
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  menu.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', closeMenu);
  });
}
if (menuBack){
  menuBack.addEventListener('click', closeMenu);
}
document.addEventListener('keydown', function(e){
  if (e.key === 'Escape') closeMenu();
});

  /* ============ ACTIVE NAV LINK ON SCROLL ============ */
  var sections = ['retreat','spaces','moments','rates','visit'].map(function(id){
    return document.getElementById(id);
  }).filter(Boolean);
  var navLinks = document.querySelectorAll('[data-nav]');
  if ('IntersectionObserver' in window && sections.length){
    var navObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          var id = entry.target.id;
          navLinks.forEach(function(link){
            var match = link.getAttribute('href') === '#' + id;
            link.classList.toggle('is-active', match);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function(s){ navObserver.observe(s); });
  }

  /* ============ SCROLL REVEAL ============ */
  var revealEls = document.querySelectorAll('.reveal, .reveal-line');
  if ('IntersectionObserver' in window && revealEls.length){
    var revealObserver = new IntersectionObserver(function(entries, obs){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function(el){ revealObserver.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('is-visible'); });
  }

  /* Hero line reveal (runs on load, not scroll) */
  window.addEventListener('load', function(){
    document.querySelectorAll('.reveal-line').forEach(function(el, i){
      setTimeout(function(){
        el.style.transform = 'translateY(0)';
      }, 150 + i * 130);
    });
  });

  /* ============ COUNT-UP STATS ============ */
  var counters = document.querySelectorAll('[data-count]');
  function animateCount(el){
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (reduceMotion){ el.textContent = target; return; }
    var start = 0;
    var duration = 1100;
    var startTime = null;
    function step(ts){
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + (target - start) * eased);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window && counters.length){
    var countObserver = new IntersectionObserver(function(entries, obs){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function(c){ countObserver.observe(c); });
  }

  /* ============ FIVE SPACES SELECTOR ============ */
  var spaceData = {
    'full-property': { img: 'assets/img/thumb-full-property.jpg', name: 'The Full Property', price: '₹1,25,000', target: '#full-property' },
    'pandal-lawns':  { img: 'assets/img/thumb-pandal.jpg',        name: 'Pandal &amp; Lawns',  price: '₹80,000',   target: '#pandal-lawns' },
    'anchor-villa':  { img: 'assets/img/thumb-villa.jpg',         name: 'Anchor Villa',        price: '₹35,000',   target: '#anchor-villa' },
    'ivory-suite':   { img: 'assets/img/thumb-ivory.jpg',         name: 'Ivory Suite',         price: '₹18,000',   target: '#ivory-suite' },
    'suites':        { img: 'assets/img/thumb-suites.jpg',        name: 'Saffron &amp; Sandal Suites', price: '₹12,500', target: '#suites' }
  };

  var selectorItems = document.querySelectorAll('.selector-item');
  var selectorImg = document.getElementById('selectorImg');
  var selectorCapName = document.getElementById('selectorCapName');
  var selectorCapPrice = document.getElementById('selectorCapPrice');
  var selectorCta = document.getElementById('selectorCta');
  var shorelineFill = document.getElementById('shorelineFill');
  var preloadedImgs = {};

  function preload(src){
    if (preloadedImgs[src]) return;
    var im = new Image();
    im.src = src;
    preloadedImgs[src] = im;
  }
  Object.keys(spaceData).forEach(function(key){ preload(spaceData[key].img); });

  function setActiveSpace(key, index){
    var data = spaceData[key];
    if (!data || !selectorImg) return;

    selectorItems.forEach(function(item){
      var isActive = item.getAttribute('data-target') === key;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    selectorImg.classList.remove('is-shown');
    setTimeout(function(){
      selectorImg.src = data.img;
      selectorImg.alt = data.name.replace(/&amp;/g,'&') + ' at Theeram Backwaters';
      requestAnimationFrame(function(){ selectorImg.classList.add('is-shown'); });
    }, reduceMotion ? 0 : 220);

    selectorCapName.innerHTML = data.name;
    selectorCapPrice.innerHTML = data.price + ' <em>+ GST</em>';
    selectorCta.setAttribute('href', data.target);
    selectorCta.innerHTML = 'View ' + data.name + ' <span aria-hidden="true">\u2192</span>';

    if (shorelineFill){
      var total = selectorItems.length;
      var pct = 100 / total;
      shorelineFill.style.top = (index * pct) + '%';
      shorelineFill.style.height = pct + '%';
    }
  }

  selectorItems.forEach(function(item){
    item.addEventListener('click', function(){
      var key = item.getAttribute('data-target');
      var index = parseInt(item.getAttribute('data-index'), 10) || 0;
      setActiveSpace(key, index);
    });
    item.addEventListener('mouseenter', function(){
      var data = spaceData[item.getAttribute('data-target')];
      if (data) preload(data.img);
    });
  });

  // reveal selector image on first paint
  if (selectorImg){
    requestAnimationFrame(function(){
      setTimeout(function(){ selectorImg.classList.add('is-shown'); }, 200);
    });
  }

  /* ============ HERO PARALLAX (subtle, disabled on reduced motion) ============ */
  var heroImg = document.getElementById('heroImg');
  if (heroImg && !reduceMotion){
    var ticking = false;
    window.addEventListener('scroll', function(){
      if (!ticking){
        requestAnimationFrame(function(){
          var y = window.scrollY;
          var vh = window.innerHeight;
          if (y < vh){
            heroImg.style.transform = 'translateY(' + (y * 0.18) + 'px) scale(' + (1 + y * 0.0002) + ')';
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ============ SMOOTH ANCHOR CLOSE FOR MOBILE MENU LINKS ALREADY HANDLED ABOVE ============ */

/* ============ SPACES GALLERY — LIGHTBOX ============ */
  (function(){
    var galleryImgs = document.querySelectorAll('.space-detail img');
    if (!galleryImgs.length) return;

    // build the lightbox markup once
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-hidden', 'true');
    lb.innerHTML =
      '<button type="button" class="lightbox-zoom" aria-label="Zoom image">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M9 11h4M11 9v4" stroke-linecap="round"/></svg>' +
      '</button>' +
      '<button type="button" class="lightbox-close" aria-label="Close">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 5l14 14M19 5L5 19" stroke-linecap="round"/></svg>' +
      '</button>' +
      '<figure class="lightbox-figure">' +
        '<img class="lightbox-img" src="" alt="">' +
      '</figure>' +
      '<div class="lightbox-caption"></div>';
    document.body.appendChild(lb);

    var lbImg     = lb.querySelector('.lightbox-img');
    var lbCaption = lb.querySelector('.lightbox-caption');
    var lbFigure  = lb.querySelector('.lightbox-figure');
    var lastFocused = null;

    function openLightbox(imgEl){
      lastFocused = document.activeElement;
      lbImg.src = imgEl.currentSrc || imgEl.src;
      lbImg.alt = imgEl.alt || '';
      lbCaption.textContent = imgEl.alt || '';
      lbImg.classList.remove('is-zoomed');
      lb.classList.add('is-open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      lb.querySelector('.lightbox-close').focus();
    }

    function closeLightbox(){
      lb.classList.remove('is-open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      lbImg.classList.remove('is-zoomed');
      lbFigure.scrollTop = 0;
      lbFigure.scrollLeft = 0;
      if (lastFocused) lastFocused.focus();
    }

    galleryImgs.forEach(function(img){
      img.addEventListener('click', function(){ openLightbox(img); });
    });

    lb.querySelector('.lightbox-close').addEventListener('click', closeLightbox);

    lb.querySelector('.lightbox-zoom').addEventListener('click', function(){
      lbImg.classList.toggle('is-zoomed');
    });

    lbImg.addEventListener('click', function(){
      lbImg.classList.toggle('is-zoomed');
    });

    // click outside the image closes it
    lb.addEventListener('click', function(e){
      if (e.target === lb || e.target === lbFigure){
        closeLightbox();
      }
    });

    // esc key closes it
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && lb.classList.contains('is-open')){
        closeLightbox();
      }
    });
  })();

})();
