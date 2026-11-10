/**
 * gallery.js - Dynamic Gallery & Lightbox for Snigdha's World
 * - Loads items from data/gallery.json with local fallback
 * - Tag filter buttons (all, french, chrome, 3D, bridal) on gallery.html
 * - Featured preview (first 6 items) on index.html
 * - Accessible click-to-open lightbox with close button and Escape key support
 */

// Fallback data matching the local placeholder image assets
const FALLBACK_GALLERY = [
  {
    src: "assets/images/gallery/01.png",
    alt: "Amber velvet magnetic cat-eye with 3D metallic gold chrome outline",
    tags: ["chrome"],
    caption: "Amber Velvet & Gold Chrome"
  },
  {
    src: "assets/images/gallery/02.svg",
    alt: "Hailey Glazed Chrome on sheer pearlescent base",
    tags: ["chrome"],
    caption: "Hailey Glazed Chrome"
  },
  {
    src: "assets/images/gallery/03.svg",
    alt: "Hand-sculpted 3D floral petals with micro pearl centers",
    tags: ["3D"],
    caption: "3D Sculpted Charms"
  },
  {
    src: "assets/images/gallery/04.svg",
    alt: "Seamless soft blush bridal ombré with subtle shimmer",
    tags: ["bridal", "french"],
    caption: "Soft Bridal Ombré"
  },
  {
    src: "assets/images/gallery/05.svg",
    alt: "Minimalist ultra-fine black smile lines on bare nail bed",
    tags: ["french"],
    caption: "Micro French Edge"
  },
  {
    src: "assets/images/gallery/06.svg",
    alt: "High-shine liquid silver mirror chrome finish",
    tags: ["chrome"],
    caption: "Liquid Silver Chrome"
  },
  {
    src: "assets/images/gallery/07.svg",
    alt: "Clear 3D waterdrop gel accents on sheer pink",
    tags: ["3D"],
    caption: "3D Dewdrops & Pearls"
  },
  {
    src: "assets/images/gallery/08.svg",
    alt: "Bridal lace hand-painted detailing with crystal studs",
    tags: ["bridal"],
    caption: "Bridal Lace & Shimmer"
  },
  {
    src: "assets/images/gallery/09.svg",
    alt: "Champagne gold metallic chrome powder on coffin shape",
    tags: ["chrome"],
    caption: "Champagne Gold Chrome"
  },
  {
    "src": "assets/images/gallery/10.svg",
    "alt": "Sculpted 3D milky ribbon bow and pearl cluster",
    "tags": ["3D", "bridal"],
    "caption": "3D Ribbon & Bow"
  },
  {
    "src": "assets/images/gallery/11.svg",
    "alt": "Deep architectural V-cut French smile lines",
    "tags": ["french"],
    "caption": "Deep V-Cut French"
  },
  {
    "src": "assets/images/gallery/12.svg",
    "alt": "Luminous sheer bridal veil with iridescent pearlescent glaze",
    "tags": ["bridal", "chrome"],
    "caption": "Luminous Pearl Glaze"
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const galleryGrid = document.getElementById('gallery-grid');
  const featuredGrid = document.getElementById('featured-gallery');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  let allItems = [];

  // Fetch gallery.json with fallback support
  fetch('data/gallery.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      allItems = Array.isArray(data) && data.length ? data : FALLBACK_GALLERY;
      init();
    })
    .catch((error) => {
      console.warn('Using local dataset for gallery:', error);
      allItems = FALLBACK_GALLERY;
      init();
    });

  function init() {
    // If on homepage: render first 6 items in #featured-gallery
    if (featuredGrid) {
      renderGalleryItems(featuredGrid, allItems.slice(0, 6));
    }

    // If on gallery page: render all items and set up filters
    if (galleryGrid) {
      renderGalleryItems(galleryGrid, allItems);
      setupFilters();
    }

    setupLightbox();
  }

  // Render gallery item cards into container
  function renderGalleryItems(container, items) {
    if (!items.length) {
      container.innerHTML = '<p class="text-muted" style="grid-column: 1 / -1; text-align: center; padding: 40px 0;">No portfolio sets found matching this curation.</p>';
      return;
    }

    container.innerHTML = items
      .map((item, index) => {
        const tagBadges = (item.tags || [])
          .map((t) => `<span class="gallery-tag">${escapeHtml(t)}</span>`)
          .join('');

        return `
          <figure class="gallery-item" data-index="${index}" tabindex="0" role="button" aria-label="Inspect ${escapeHtml(item.caption || item.alt || 'nail work')}">
            <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt || item.caption || 'Nail art work')}" loading="lazy" />
            <figcaption class="gallery-caption">
              <strong>${escapeHtml(item.caption || '')}</strong>
              <div class="gallery-tag-list">${tagBadges}</div>
            </figcaption>
          </figure>
        `;
      })
      .join('');

    // Attach click and enter/space key listeners to items
    const renderedItems = container.querySelectorAll('.gallery-item');
    renderedItems.forEach((card) => {
      const openAction = () => {
        const img = card.querySelector('img');
        const captionStrong = card.querySelector('.gallery-caption strong');
        openLightbox(img.src, img.alt, captionStrong ? captionStrong.textContent : '');
      };

      card.addEventListener('click', openAction);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openAction();
        }
      });
    });
  }

  // Setup tag filtering on gallery.html
  function setupFilters() {
    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        filterButtons.forEach((b) => b.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');
        if (filterValue === 'all') {
          renderGalleryItems(galleryGrid, allItems);
        } else {
          const filtered = allItems.filter((item) =>
            item.tags && item.tags.includes(filterValue)
          );
          renderGalleryItems(galleryGrid, filtered);
        }
      });
    });
  }

  // Lightbox functionality
  function setupLightbox() {
    if (!lightbox) return;

    // Close button
    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    // Backdrop click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Keyboard support: Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
        closeLightbox();
      }
    });
  }

  function openLightbox(src, alt, caption) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'Enlarged nail art photography';
    if (lightboxCaption) {
      lightboxCaption.textContent = caption || alt || '';
    }
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    if (lightboxImg) lightboxImg.src = '';
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
