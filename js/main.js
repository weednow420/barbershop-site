/**
 * L'ATELIER — Modern Hair Salon & Barbershop
 * Main JavaScript functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  initTelegramWebApp();
  initNavbar();
  initServiceTabs();
  initGalleryFilter();
  initGalleryModal();
  initFaqAccordion();
  initBookingModal();
  initSmoothScroll();
});

/* ==========================================================================
   1. Header Scroll & Mobile Menu
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.header');
  const burgerBtn = document.querySelector('.burger-btn');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Add background on scroll
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // Burger Menu Toggle
  if (burgerBtn && navMenu) {
    burgerBtn.addEventListener('click', () => {
      burgerBtn.classList.toggle('open');
      navMenu.classList.toggle('open');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        burgerBtn.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active Link on Scroll (Scrollspy)
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (targetLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetLink.classList.add('active');
        } else {
          targetLink.classList.remove('active');
        }
      }
    });
  });
}

/* ==========================================================================
   2. Services Tabs Filter
   ========================================================================== */
function initServiceTabs() {
  const tabBtns = document.querySelectorAll('.services-tabs .tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  if (!tabBtns.length || !serviceCards.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from buttons
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
        }
      });
    });
  });
}

/* ==========================================================================
   3. Gallery Filter
   ========================================================================== */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.gallery-filters .filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!filterBtns.length || !galleryItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 20);
        } else {
          item.style.display = 'none';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
        }
      });
    });
  });
}

/* ==========================================================================
   4. Gallery Lightbox Modal
   ========================================================================== */
function initGalleryModal() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  if (!lightboxModal || !galleryItems.length) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-title');
      const category = item.querySelector('.gallery-category');

      if (img && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Работа салона';
      }
      if (lightboxCaption && title) {
        const catText = category ? category.textContent + ' — ' : '';
        lightboxCaption.textContent = catText + title.textContent;
      }

      lightboxModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightboxModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('open')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   5. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   6. Booking Modal & Form Handling
   ========================================================================== */
function initBookingModal() {
  const modal = document.getElementById('bookingModal');
  const openBtns = document.querySelectorAll('.open-booking-modal');
  const closeBtn = document.getElementById('closeBookingModal');
  const bookingForm = document.getElementById('bookingForm');
  const serviceSelect = document.getElementById('bookService');
  const masterSelect = document.getElementById('bookMaster');
  const successBox = document.getElementById('bookingSuccess');
  const resetBtn = document.getElementById('bookingResetBtn');
  const bookDateInput = document.getElementById('bookDate');

  if (!modal) return;

  // Set min date for booking to today
  if (bookDateInput) {
    const today = new Date().toISOString().split('T')[0];
    bookDateInput.min = today;
  }

  // Open Modal
  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      const preSelectedService = btn.getAttribute('data-service');
      const preSelectedMaster = btn.getAttribute('data-master');

      if (preSelectedService && serviceSelect) {
        serviceSelect.value = preSelectedService;
      }
      if (preSelectedMaster && masterSelect) {
        masterSelect.value = preSelectedMaster;
      }

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close Modal Function
  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Handle Form Submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('bookName').value.trim();
      const phone = document.getElementById('bookPhone').value.trim();
      const service = serviceSelect ? serviceSelect.options[serviceSelect.selectedIndex].text : '';
      const master = masterSelect ? masterSelect.options[masterSelect.selectedIndex].text : '';
      const date = document.getElementById('bookDate').value;
      const time = document.getElementById('bookTime').value;

      if (!name || !phone || !date || !time) {
        alert('Пожалуйста, заполните все обязательные поля');
        return;
      }

      // Fill summary in success box
      const summaryElem = document.getElementById('bookingSummaryDetails');
      if (summaryElem) {
        summaryElem.innerHTML = `
          <strong>Клиент:</strong> ${name}<br>
          <strong>Телефон:</strong> ${phone}<br>
          <strong>Услуга:</strong> ${service}<br>
          <strong>Мастер:</strong> ${master}<br>
          <strong>Дата и время:</strong> ${date} в ${time}
        `;
      }

      // Display success message
      bookingForm.style.display = 'none';
      if (successBox) {
        successBox.style.display = 'block';
      }
    });
  }

  // Reset booking form
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      bookingForm.reset();
      bookingForm.style.display = 'flex';
      if (successBox) {
        successBox.style.display = 'none';
      }
      closeModal();
    });
  }
}

/* ==========================================================================
   7. Smooth Scroll for in-page anchors
   ========================================================================== */
function initSmoothScroll() {
  const scrollLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

  scrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================================================
   8. Telegram Mini App Integration
   ========================================================================== */
function initTelegramWebApp() {
  if (typeof window.Telegram !== 'undefined' && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    
    // Notify Telegram that the Mini App is ready
    tg.ready();
    tg.expand();

    // Autofill client name if user is in Telegram
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
      const user = tg.initDataUnsafe.user;
      const nameInput = document.getElementById('bookName');
      if (nameInput && !nameInput.value) {
        const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');
        nameInput.value = fullName || user.username || '';
      }
    }

    // Add haptic feedback to interactive buttons
    const interactiveElements = document.querySelectorAll('.btn, .tab-btn, .filter-btn, .faq-header');
    interactiveElements.forEach(el => {
      el.addEventListener('click', () => {
        if (tg.HapticFeedback) {
          tg.HapticFeedback.impactOccurred('light');
        }
      });
    });

    console.log("[TMA] Telegram Mini App SDK успешно инициализирован.");
  }
}
