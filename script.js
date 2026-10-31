document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const themeToggle = document.getElementById('themeToggle');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const savedTheme = localStorage.getItem('lucas_theme');

  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else {
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    document.documentElement.setAttribute('data-theme', prefersLight ? 'light' : 'dark');
  }

  function updateThemeColorMeta(theme) {
    if (themeMeta) {
      themeMeta.setAttribute('content', theme === 'dark' ? '#171717' : '#FAF8F4');
    }
  }

  updateThemeColorMeta(document.documentElement.getAttribute('data-theme'));

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('lucas_theme', newTheme);
      updateThemeColorMeta(newTheme);
      showToast(newTheme === 'dark' ? 'Modo escuro ativado' : 'Modo claro ativado');
    });
  }

  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburgerBtn && navMenu) {
    function toggleNav(open) {
      const isOpen = open !== undefined ? open : !navMenu.classList.contains('open');
      navMenu.classList.toggle('open', isOpen);
      hamburgerBtn.classList.toggle('active', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    hamburgerBtn.addEventListener('click', () => toggleNav());

    navLinks.forEach(link => {
      link.addEventListener('click', () => toggleNav(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        toggleNav(false);
      }
    });
  }

  const heroStaggerItems = document.querySelectorAll('.hero-stagger');
  const dynamicWordEl = document.getElementById('dynamicWord');
  const wordsToRotate = [
    'landing pages focadas em conversão',
    'páginas de vendas rápidas',
    'páginas integradas ao WhatsApp',
    'landing pages institucionais'
  ];
  let wordIndex = 0;

  heroStaggerItems.forEach((el, idx) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, prefersReducedMotion ? 0 : 160 * (idx + 1));
  });

  if (dynamicWordEl && !prefersReducedMotion) {
    setInterval(() => {
      dynamicWordEl.classList.add('fade-out');
      setTimeout(() => {
        wordIndex = (wordIndex + 1) % wordsToRotate.length;
        dynamicWordEl.textContent = wordsToRotate[wordIndex];
        dynamicWordEl.classList.remove('fade-out');
      }, 340);
    }, 3200);
  }

  const revealElements = document.querySelectorAll('.reveal');

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }

  const sections = document.querySelectorAll('main section[id]');
  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(sec => navObserver.observe(sec));
  }

  const scrollProgress = document.getElementById('scrollProgress');
  const header = document.getElementById('header');
  const backToTop = document.getElementById('backToTop');
  const timeline = document.getElementById('timeline');
  const timelineProgress = document.getElementById('timelineProgress');
  const parallaxItems = document.querySelectorAll('[data-parallax]');

  let isTicking = false;

  function onScrollUpdate() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;

    if (scrollProgress) {
      scrollProgress.style.transform = `scaleX(${progress})`;
    }

    if (header) {
      header.classList.toggle('scrolled', scrollY > 40);
    }

    if (backToTop) {
      backToTop.classList.toggle('visible', scrollY > 500);
    }

    if (timeline && timelineProgress && !prefersReducedMotion) {
      const rect = timeline.getBoundingClientRect();
      const windowHalf = window.innerHeight * 0.7;
      if (rect.top < windowHalf) {
        const factor = Math.min(Math.max((windowHalf - rect.top) / rect.height, 0), 1);
        timelineProgress.style.transform = `scaleY(${factor})`;
      }
    }

    if (!isTouchDevice && !prefersReducedMotion) {
      parallaxItems.forEach(item => {
        const speed = parseFloat(item.getAttribute('data-parallax')) || 0;
        item.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
      });
    }

    isTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!isTicking) {
      window.requestAnimationFrame(onScrollUpdate);
      isTicking = true;
    }
  }, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const quickViewBtns = document.querySelectorAll('.quick-view-btn');
  const projectModals = document.querySelectorAll('.project-modal');

  quickViewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal && typeof targetModal.showModal === 'function') {
        targetModal.showModal();
        document.body.style.overflow = 'hidden';
      }
    });
  });

  projectModals.forEach(modal => {
    const closeBtns = modal.querySelectorAll('[data-close-modal]');
    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        modal.close();
        document.body.style.overflow = '';
      });
    });

    modal.addEventListener('click', (e) => {
      const rect = modal.querySelector('.modal-card').getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        modal.close();
        document.body.style.overflow = '';
      }
    });

    modal.addEventListener('close', () => {
      document.body.style.overflow = '';
    });
  });

  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answerEl = item.querySelector('.faq-answer');

    if (questionBtn && answerEl) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('open');
            const otherBtn = other.querySelector('.faq-question');
            const otherAns = other.querySelector('.faq-answer');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            if (otherAns) otherAns.style.maxHeight = '0px';
          }
        });

        if (!isOpen) {
          item.classList.add('open');
          questionBtn.setAttribute('aria-expanded', 'true');
          answerEl.style.maxHeight = `${answerEl.scrollHeight + 20}px`;
        } else {
          item.classList.remove('open');
          questionBtn.setAttribute('aria-expanded', 'false');
          answerEl.style.maxHeight = '0px';
        }
      });
    }
  });

  const contactForm = document.getElementById('contactForm');
  const userNameInput = document.getElementById('userName');
  const userServiceSelect = document.getElementById('userService');
  const userMessageInput = document.getElementById('userMessage');
  const waPreviewBubble = document.getElementById('waPreviewBubble');
  const formSuccess = document.getElementById('formSuccess');

  function updateWhatsAppPreview() {
    if (!waPreviewBubble) return;

    const name = userNameInput ? userNameInput.value.trim() : '';
    const service = userServiceSelect ? userServiceSelect.value : '';
    const message = userMessageInput ? userMessageInput.value.trim() : '';

    if (!name && !service && !message) {
      waPreviewBubble.innerHTML = '<em>Preencha os campos acima para ver a mensagem que será enviada.</em>';
      return;
    }

    const formatted = `Olá, Lucas! Me chamo *${name || '[Seu Nome]'}*.\nVim pelo seu site e tenho interesse em uma: *${service || '[Modelo de Landing Page]'}*.\n\nSobre meu serviço/projeto: ${message || '[Resumo do projeto]'}`;
    waPreviewBubble.textContent = formatted;
  }

  if (userNameInput) userNameInput.addEventListener('input', updateWhatsAppPreview);
  if (userServiceSelect) userServiceSelect.addEventListener('change', updateWhatsAppPreview);
  if (userMessageInput) userMessageInput.addEventListener('input', updateWhatsAppPreview);

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = userNameInput.value.trim();
      const service = userServiceSelect.value;
      const message = userMessageInput.value.trim();

      if (!name || !service || !message) {
        showToast('Por favor, preencha todos os campos.');
        return;
      }

      if (formSuccess) formSuccess.classList.add('active');

      const phoneNumber = '5538988399608';
      const text = `Olá, Lucas! Me chamo *${name}*.\nVim pelo seu site e gostaria de um orçamento para: *${service}*.\n\nSobre o meu projeto: ${message}`;
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;

      setTimeout(() => {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        contactForm.reset();
        updateWhatsAppPreview();
        setTimeout(() => {
          if (formSuccess) formSuccess.classList.remove('active');
        }, 1600);
      }, 1300);
    });
  }

  const copyPhoneBtn = document.getElementById('copyPhoneBtn');

  if (copyPhoneBtn) {
    copyPhoneBtn.addEventListener('click', () => {
      const phone = '(38) 98839-9608';
      navigator.clipboard.writeText('5538988399608').then(() => {
        showToast(`${phone} copiado para a área de transferência!`);
      }).catch(() => {
        showToast(`Telefone: ${phone}`);
      });
    });
  }

  function showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  const floatingWa = document.getElementById('floatingWa');
  const waTooltip = document.getElementById('waTooltip');
  const closeTooltip = document.getElementById('closeTooltip');

  setTimeout(() => {
    if (floatingWa) floatingWa.classList.add('visible');
  }, 1000);

  setTimeout(() => {
    const dismissed = sessionStorage.getItem('wa_tooltip_dismissed');
    if (waTooltip && !dismissed) waTooltip.classList.add('show');
  }, 3500);

  if (closeTooltip && waTooltip) {
    closeTooltip.addEventListener('click', () => {
      waTooltip.classList.remove('show');
      sessionStorage.setItem('wa_tooltip_dismissed', 'true');
    });
  }

  const rippleBtns = document.querySelectorAll('.ripple-btn');

  rippleBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top = `${e.clientY - rect.top}px`;
      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  const cursorDot = document.getElementById('cursorDot');
  const cursorOutline = document.getElementById('cursorOutline');

  if (!isTouchDevice && !prefersReducedMotion && cursorDot && cursorOutline) {
    let mouseX = -100;
    let mouseY = -100;
    let outlineX = -100;
    let outlineY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`;
    }, { passive: true });

    function animateCursor() {
      outlineX += (mouseX - outlineX) * 0.15;
      outlineY += (mouseY - outlineY) * 0.15;

      cursorOutline.style.transform = `translate3d(${outlineX - 16}px, ${outlineY - 16}px, 0)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
  }
});
