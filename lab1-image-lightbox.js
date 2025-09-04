/**
 * Lab 1 Mobile Image Lightbox
 * Opens the Lab 1 image in a full-screen lightbox on small screens.
 * - Activates only on mobile widths (<= 600px)
 * - Click image to open; click backdrop to close; ESC closes
 * - Uses accessible markup with role="dialog" and focus management
 */

(function() {
    'use strict';

    function isMobileWidth() {
        return window.matchMedia('(max-width: 600px)').matches;
    }

    function createLightbox() {
        // Build lightbox elements once
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.setAttribute('data-lab1-lightbox', '');

        const container = document.createElement('div');
        container.className = 'modal-container';
        container.setAttribute('role', 'dialog');
        container.setAttribute('aria-modal', 'true');
        container.setAttribute('aria-label', 'Image preview');

        const content = document.createElement('div');
        content.className = 'modal-content';

        const img = document.createElement('img');
        img.alt = 'Image preview';
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';

        content.appendChild(img);
        container.appendChild(content);

        const wrapper = document.createElement('div');
        wrapper.className = 'answer-modal';
        wrapper.setAttribute('aria-hidden', 'true');
        wrapper.style.display = 'none';
        wrapper.style.zIndex = '2000';

        wrapper.appendChild(overlay);
        wrapper.appendChild(container);

        document.body.appendChild(wrapper);

        return { wrapper, overlay, container, img };
    }

    function init() {
        // Locate the Lab 1 image inside the image-frame
        const lab1Section = document.getElementById('lab1') || document.body;
        const targetImg = lab1Section.querySelector('.image-frame .responsive-img[src$="media/image1.png"], .image-frame img[src$="media/image1.png"]');
        if (!targetImg) return;

        // Create lightbox lazily
        let lightbox = null;
        let lastFocused = null;

        function openLightbox() {
            if (!isMobileWidth()) return;
            if (!lightbox) {
                lightbox = createLightbox();
                // Close on overlay click
                lightbox.wrapper.addEventListener('click', function(e) {
                    if (e.target === lightbox.wrapper || e.target === lightbox.overlay) {
                        closeLightbox();
                    }
                });
                // ESC to close
                document.addEventListener('keydown', function onKey(e) {
                    if (e.key === 'Escape' && lightbox && lightbox.wrapper.style.display === 'flex') {
                        closeLightbox();
                    }
                });
            }

            lastFocused = document.activeElement;
            lightbox.img.src = targetImg.currentSrc || targetImg.src;
            lightbox.wrapper.style.display = 'flex';
            lightbox.wrapper.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            // Focus the container for accessibility
            lightbox.container.setAttribute('tabindex', '-1');
            lightbox.container.focus();
        }

        function closeLightbox() {
            if (!lightbox) return;
            lightbox.wrapper.style.display = 'none';
            lightbox.wrapper.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            if (lastFocused && lastFocused.focus) {
                lastFocused.focus();
            }
        }

        // Activate on click/tap only on small screens
        targetImg.style.cursor = 'zoom-in';
        targetImg.addEventListener('click', function() {
            if (isMobileWidth()) {
                openLightbox();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();


