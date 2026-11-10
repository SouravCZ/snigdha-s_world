/**
 * booking.js - Form validation for contact.html
 * - Validates: name, phone, preferred date, service dropdown, message
 * - Shows inline errors
 * - Displays success feedback banner upon valid submission
 * - Pre-selects service from URL parameter (?service=...)
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('booking-form');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const dateInput = document.getElementById('date');
  const serviceSelect = document.getElementById('service');
  const messageInput = document.getElementById('message');
  const successBanner = document.getElementById('form-success-banner');

  // Prevent selecting past dates
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // Pre-fill service dropdown if query param ?service=... exists
  const urlParams = new URLSearchParams(window.location.search);
  const requestedService = urlParams.get('service');
  if (requestedService && serviceSelect) {
    for (let i = 0; i < serviceSelect.options.length; i++) {
      if (
        serviceSelect.options[i].text.toLowerCase().includes(requestedService.toLowerCase()) ||
        serviceSelect.options[i].value.toLowerCase().includes(requestedService.toLowerCase())
      ) {
        serviceSelect.selectedIndex = i;
        break;
      }
    }
  }

  // Handle Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      showError(nameInput, 'Please enter your name.');
      isValid = false;
    } else if (nameInput.value.trim().length < 2) {
      showError(nameInput, 'Name must be at least 2 characters.');
      isValid = false;
    }

    // Validate Phone (digits, minimum 10)
    const phoneVal = phoneInput.value.replace(/[\s\-\(\)\+]/g, '');
    if (!phoneInput.value.trim()) {
      showError(phoneInput, 'Please enter your phone number.');
      isValid = false;
    } else if (!/^\d{10,15}$/.test(phoneVal)) {
      showError(phoneInput, 'Please enter a valid 10-digit phone number.');
      isValid = false;
    }

    // Validate Preferred Date
    if (!dateInput.value) {
      showError(dateInput, 'Please select your preferred appointment date.');
      isValid = false;
    } else {
      const selectedDate = new Date(dateInput.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        showError(dateInput, 'Date cannot be in the past.');
        isValid = false;
      }
    }

    // Validate Service Dropdown
    if (!serviceSelect.value) {
      showError(serviceSelect, 'Please select a service.');
      isValid = false;
    }

    // If valid, show success message and reset form
    if (isValid) {
      if (successBanner) {
        successBanner.textContent = `Thank you, ${nameInput.value.trim()}! Your booking request for ${serviceSelect.options[serviceSelect.selectedIndex].text} on ${dateInput.value} has been received. We will confirm via WhatsApp or call shortly.`;
        successBanner.className = 'form-message-banner success';
      }

      form.reset();
      // Scroll to message
      if (successBanner) {
        successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  });

  // Realtime clear on input
  [nameInput, phoneInput, dateInput, serviceSelect].forEach((element) => {
    if (!element) return;
    element.addEventListener('input', () => {
      const group = element.closest('.form-group');
      if (group && group.classList.contains('has-error')) {
        group.classList.remove('has-error');
      }
    });
  });

  function showError(inputElement, message) {
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

  function clearErrors() {
    const errorGroups = form.querySelectorAll('.form-group.has-error');
    errorGroups.forEach((g) => g.classList.remove('has-error'));
    if (successBanner) {
      successBanner.className = 'form-message-banner';
      successBanner.textContent = '';
    }
  }
});
