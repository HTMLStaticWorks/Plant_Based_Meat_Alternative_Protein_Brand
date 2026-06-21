document.addEventListener('DOMContentLoaded', () => {
  // --- INITS ---
  initTheme();
  initRtl();
  initNavbarScroll();
  initScrollspy();
  initScrollAnimations();
  initCounters();
  initTestimonialSliders();
  initForms();
  initParallaxEffects();
  initAccordions();
  initBackToTop();
});

// --- THEME SWITCHER (DARK MODE) ---
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  themeToggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    let targetTheme = (theme === 'dark') ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', targetTheme);
    localStorage.setItem('theme', targetTheme);
    updateThemeIcon(targetTheme);
  });
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#theme-toggle i');
  if (!icon) return;
  if (theme === 'dark') {
    icon.className = 'bi bi-sun-fill';
  } else {
    icon.className = 'bi bi-moon-fill';
  }
}

// --- RTL TOGGLE ---
function initRtl() {
  const rtlToggle = document.getElementById('rtl-toggle');
  if (!rtlToggle) return;

  const currentDir = localStorage.getItem('dir') || 'ltr';
  document.documentElement.setAttribute('dir', currentDir);
  updateRtlButtonText(currentDir);

  rtlToggle.addEventListener('click', () => {
    let dir = document.documentElement.getAttribute('dir');
    let targetDir = (dir === 'rtl') ? 'ltr' : 'rtl';
    
    document.documentElement.setAttribute('dir', targetDir);
    localStorage.setItem('dir', targetDir);
    updateRtlButtonText(targetDir);
  });
}

function updateRtlButtonText(dir) {
  const btn = document.getElementById('rtl-toggle');
  if (!btn) return;
  btn.setAttribute('aria-label', dir === 'rtl' ? 'Toggle LTR' : 'Toggle RTL');
  btn.setAttribute('title', dir === 'rtl' ? 'Switch to Left-to-Right' : 'Switch to Right-to-Left');
}

// --- NAVBAR SCROLL EFFECT ---
function initNavbarScroll() {
  const navbar = document.querySelector('.premium-navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// --- SCROLLSPY ACTIVE NAV HIGHLIGHT ---
function initScrollspy() {
  const navLinks = document.querySelectorAll('.premium-navbar .nav-link');
  const sections = document.querySelectorAll('section[id]');
  
  if (sections.length === 0) return;

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(currentId)) {
          link.classList.add('active');
        }
      });
    }
  });
}

// --- ANIMATE ON SCROLL (REVEAL BLUR/SLIDE) ---
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.reveal-on-scroll, .reveal-scale');
  if (animatedElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));
}

// --- NUMERIC STATISTICS COUNTER ---
function initCounters() {
  const counters = document.querySelectorAll('.counter-num');
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  el.classList.add('counted');
  const target = parseFloat(el.getAttribute('data-target'));
  const speed = parseInt(el.getAttribute('data-speed')) || 2000;
  const isFloat = el.getAttribute('data-float') === 'true';
  const suffix = el.getAttribute('data-suffix') || '';
  
  let start = 0;
  const increment = target / (speed / 16); // ~60fps
  
  const updateCount = () => {
    start += increment;
    if (start >= target) {
      el.textContent = (isFloat ? target.toFixed(1) : Math.floor(target)) + suffix;
    } else {
      el.textContent = (isFloat ? start.toFixed(1) : Math.floor(start)) + suffix;
      requestAnimationFrame(updateCount);
    }
  };
  
  updateCount();
}

// --- TESTIMONIALS SLIDER ---
function initTestimonialSliders() {
  const sliderContainers = document.querySelectorAll('.testimonial-wrapper');
  
  sliderContainers.forEach(container => {
    const track = container.querySelector('.testimonial-container');
    const slides = container.querySelectorAll('.testimonial-slide');
    const dotsContainer = container.querySelector('.slider-dots');
    
    if (!track || slides.length === 0 || !dotsContainer) return;
    
    let currentIndex = 0;
    
    // Clear and build dots
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = `dot ${idx === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => {
        goToSlide(idx);
      });
      dotsContainer.appendChild(dot);
    });
    
    const dots = dotsContainer.querySelectorAll('.dot');
    
    function goToSlide(index) {
      currentIndex = index;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((d, i) => {
        d.className = `dot ${i === currentIndex ? 'active' : ''}`;
      });
    }
    
    // Auto cycle testimonials
    let cycleInterval = setInterval(() => {
      let nextIndex = (currentIndex + 1) % slides.length;
      goToSlide(nextIndex);
    }, 6000);
    
    container.addEventListener('mouseenter', () => clearInterval(cycleInterval));
    container.addEventListener('mouseleave', () => {
      cycleInterval = setInterval(() => {
        let nextIndex = (currentIndex + 1) % slides.length;
        goToSlide(nextIndex);
      }, 6000);
    });
  });
}

// --- FORMS SUBMISSIONS VALIDATIONS ---
function initForms() {
  const forms = document.querySelectorAll('.premium-form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const inputs = form.querySelectorAll('.premium-form-control, input, textarea');
      
      inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
          isValid = false;
          input.classList.add('is-invalid');
        } else {
          input.classList.remove('is-invalid');
        }
        
        // Email match check
        if (input.type === 'email' && input.value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(input.value)) {
            isValid = false;
            input.classList.add('is-invalid');
          }
        }
      });
      
      if (isValid) {
        // Find parent container or target to replace
        const successCard = form.nextElementSibling;
        if (successCard && successCard.classList.contains('form-success-card')) {
          form.style.display = 'none';
          successCard.style.display = 'block';
          
          // Trigger animations on success icons
          const successIcon = successCard.querySelector('i');
          if (successIcon) {
            successIcon.classList.add('animate__animated', 'animate__bounceIn');
          }
        } else {
          alert('Submission successful! Thank you.');
          form.reset();
        }
      }
    });
  });
}

// --- PARALLAX EFFECT FOR 3D FLOATING ITEMS ---
function initParallaxEffects() {
  document.addEventListener('mousemove', (e) => {
    const items = document.querySelectorAll('.floating-element, .floating-element-slow');
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    items.forEach(item => {
      const speed = item.classList.contains('floating-element-slow') ? 0.02 : 0.05;
      const x = (window.innerWidth - mouseX * speed) / 20;
      const y = (window.innerHeight - mouseY * speed) / 20;
      
      item.style.transform = `translateX(${x}px) translateY(${y}px)`;
    });
  });
}

// --- CUSTOM INTERACTIVE ACCORDIONS ---
function initAccordions() {
  const accordionHeaders = document.querySelectorAll('.accordion-header-btn');
  
  accordionHeaders.forEach(btn => {
    btn.addEventListener('click', () => {
      const body = btn.nextElementSibling;
      const icon = btn.querySelector('i');
      
      // Close other accordion items
      const siblingAccordions = btn.closest('.accordion-system')?.querySelectorAll('.accordion-body-content') || [];
      const siblingIcons = btn.closest('.accordion-system')?.querySelectorAll('.accordion-header-btn i') || [];
      
      siblingAccordions.forEach(sa => {
        if (sa !== body) {
          sa.style.maxHeight = null;
          sa.classList.remove('active');
        }
      });
      siblingIcons.forEach(si => {
        if (si !== icon) {
          si.className = 'bi bi-chevron-down';
        }
      });
      
      // Toggle current
      if (body.style.maxHeight) {
        body.style.maxHeight = null;
        body.classList.remove('active');
        icon.className = 'bi bi-chevron-down';
      } else {
        body.style.maxHeight = body.scrollHeight + "px";
        body.classList.add('active');
        icon.className = 'bi bi-chevron-up';
      }
    });
  });
}

// --- BACK TO TOP BUTTON ---
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
