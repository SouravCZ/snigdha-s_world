/**
 * main.js - Core site functionality & Luxury UX
 * - Dynamic Glassmorphism header scroll detection
 * - Shared mobile navigation hamburger toggle
 * - Active navigation link state
 * - Luxury service cards rendering (for services.html)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Glassmorphism Header Scroll State
  const header = document.querySelector('.site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // Mobile Navigation Hamburger Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('is-active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
      if (
        !navMenu.contains(event.target) &&
        !navToggle.contains(event.target) &&
        navMenu.classList.contains('is-active')
      ) {
        navMenu.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navMenu.classList.contains('is-active')) {
        navMenu.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  // Highlight active page link in navigation
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-menu a');
  navLinks.forEach((link) => {
    const linkHref = link.getAttribute('href');
    if (
      linkHref === currentPath ||
      (currentPath === '' && linkHref === 'index.html')
    ) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // Services Rendering (for services.html)
  const servicesContainer = document.getElementById('services-list');
  if (servicesContainer) {
    const services = [
      {
        name: 'Gel Manicure',
        description: 'Meticulous dry e-file cuticle detailing, nail plate contouring, and chip-resistant Japanese gel polish cured with zero heat spikes. Lasts 3+ weeks with luminous shine.',
        price: '₹1,200',
        duration: '60 mins'
      },
      {
        name: 'Acrylic Full Set',
        description: 'Sculpted extensions tailored to your natural nail bed with high-clarity acrylic powder. Includes customized shaping (Almond, Coffin, Stiletto, or Square) and premium gel color.',
        price: '₹2,500',
        duration: '90-120 mins'
      },
      {
        name: 'Nail Art (per nail)',
        description: 'Bespoke hand-painted fine lines, 3D sculpted bows, liquid chrome powders, Korean magnetic cat-eye velvet finishes, or Swarovski crystal clusters.',
        price: '₹150 - ₹350',
        duration: '15-30 mins'
      },
      {
        name: 'Removal',
        description: 'Damage-free e-file gentle reduction and foil wrap soak-off. Finished with organic Japanese cuticle oil and keratin nail plate conditioning.',
        price: '₹400',
        duration: '30-45 mins'
      },
      {
        name: 'Pedicure',
        description: 'Aromatic therapeutic foot soak, botanical sugar scrub exfoliation, callus smoothing, cuticle tidy, relaxing acupressure massage, and high-shine long-wear polish.',
        price: '₹1,500',
        duration: '60 mins'
      }
    ];

    servicesContainer.innerHTML = services
      .map(
        (service) => `
        <article class="service-card">
          <div class="service-card-header">
            <h3 class="service-card-title">${service.name}</h3>
            <span class="service-card-price">${service.price}</span>
          </div>
          <div class="service-card-duration">${service.duration}</div>
          <p class="service-card-desc">${service.description}</p>
          <div style="margin-top: auto;">
            <a href="contact.html?service=${encodeURIComponent(service.name)}" class="btn btn-sm">Reserve This Service &rarr;</a>
          </div>
        </article>
      `
      )
      .join('');
  }

  // Course Enrollment Form Handling (for index.html #course-enroll-form)
  const courseForm = document.getElementById('course-enroll-form');
  if (courseForm) {
    const courseSuccessBanner = document.getElementById('course-success-banner');
    const studentName = document.getElementById('student-name');
    const studentPhone = document.getElementById('student-phone');
    const batchSelect = document.getElementById('preferred-batch');

    courseForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Clear previous error states
      const errorGroups = courseForm.querySelectorAll('.form-group.has-error');
      errorGroups.forEach((g) => g.classList.remove('has-error'));

      let isValid = true;

      // Validate Name
      if (!studentName.value.trim() || studentName.value.trim().length < 2) {
        showCourseError(studentName, 'Please enter your full name (at least 2 characters).');
        isValid = false;
      }

      // Validate Phone (digits, minimum 10)
      const phoneDigits = studentPhone.value.replace(/[\s\-\(\)\+]/g, '');
      if (!/^\d{10,15}$/.test(phoneDigits)) {
        showCourseError(studentPhone, 'Please enter a valid 10-digit contact number.');
        isValid = false;
      }

      // Validate Batch Selection
      if (!batchSelect.value) {
        showCourseError(batchSelect, 'Please select your preferred batch timing.');
        isValid = false;
      }

      if (isValid) {
        const nameVal = studentName.value.trim();
        const phoneVal = studentPhone.value.trim();
        const batchText = batchSelect.options[batchSelect.selectedIndex].text;
        const encodedMsg = encodeURIComponent(
          `Hi Snigdha! My name is ${nameVal} (Phone: ${phoneVal}). I have applied for the 12 Days Basic to Advance Nail Extension Course (${batchText}) at Birati. Please confirm my seat.`
        );

        if (courseSuccessBanner) {
          courseSuccessBanner.className = 'form-message-banner success';
          courseSuccessBanner.innerHTML = `
            <strong>🎉 Enrollment Request Received!</strong><br />
            Thank you, <strong>${nameVal}</strong>! Your seat inquiry for the <em>12 Days Nail Extension Course (${batchText})</em> has been recorded. 
            We will call you at <strong>${phoneVal}</strong> shortly.<br />
            <div style="margin-top: 10px;">
              <a href="https://wa.me/918777248449?text=${encodedMsg}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary">
                💬 Instant WhatsApp Confirmation (8777248449)
              </a>
            </div>
          `;
          courseSuccessBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        courseForm.reset();
      }
    });

    function showCourseError(inputElement, message) {
      const group = inputElement.closest('.form-group');
      if (!group) return;
      group.classList.add('has-error');
      let errorElem = group.querySelector('.form-error');
      if (!errorElem) {
        errorElem = document.createElement('div');
        errorElem.className = 'form-error';
        group.appendChild(errorElem);
      }
      errorElem.textContent = message;
    }
  }
});
