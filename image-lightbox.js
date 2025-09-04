/**
 * Generic Mobile Image Lightbox for Labs
 * - Activates on mobile widths (<= 600px)
 * - Applies to specific lab images (by src file name) without modifying markup
 * - Reuses existing modal classes for consistent styling and a11y
 */

(function() {
    'use strict';

    var TARGET_IMAGES = new Set([
        'media/image1.png',
        'media/full_adder.png',
        'media/full_adder_internal.png',
        'media/parallel_adder.png',
        'media/Gen_Decoder.png',
        'media/Mux_struc.png',
        'media/DeMux_struc.png',
        'media/D_Flip Flop_understaning.PNG',
        'media/JK_Flip Flop_understaning.PNG',
        'media/74175_D_FlipFlop.png',
        'media/74114_JK_FlipFlop.gif',
        'media/JK-transition-truthtable.PNG'
    ]);

    function isMobileWidth() {
        // Use global function if available, fallback to local implementation
        return window.isMobileWidth ? window.isMobileWidth() : window.matchMedia('(max-width: 700px)').matches;
    }
    
    function isTouchDevice() {
        // Use global function if available, fallback to local implementation
        return window.isTouchDevice ? window.isTouchDevice() : ('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0);
    }

    function createLightbox() {
        var overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.style.zIndex = '1000';

        var container = document.createElement('div');
        container.className = 'modal-container';
        container.setAttribute('role', 'dialog');
        container.setAttribute('aria-modal', 'true');
        container.setAttribute('aria-label', 'Image preview');
        container.style.zIndex = '1001';

        var content = document.createElement('div');
        content.className = 'modal-content';

        var img = document.createElement('img');
        img.alt = 'Image preview';
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';

        content.appendChild(img);
        container.appendChild(content);

        var wrapper = document.createElement('div');
        wrapper.className = 'answer-modal';
        wrapper.setAttribute('aria-hidden', 'true');
        wrapper.style.display = 'none';
        wrapper.style.zIndex = '2000';

        wrapper.appendChild(overlay);
        wrapper.appendChild(container);

        document.body.appendChild(wrapper);

        return { wrapper: wrapper, overlay: overlay, container: container, img: img };
    }

    function enhanceImages() {
        var images = document.querySelectorAll('.image-frame img, .image-frame .responsive-img, img');
        if (!images || images.length === 0) return;

        var lightbox = null;
        var lastFocused = null;
        var resizeHandler = null;
        var isOpen = false;

        function openLightbox(src) {
            if (!isMobileWidth() && !isTouchDevice()) return;
            if (!lightbox) {
                lightbox = createLightbox();
                lightbox.wrapper.addEventListener('click', function(e) {
                    if (e.target === lightbox.wrapper || e.target === lightbox.overlay) {
                        closeLightbox();
                    }
                });
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape' && lightbox && lightbox.wrapper.style.display === 'flex') {
                        closeLightbox();
                    }
                });
            }
            lastFocused = document.activeElement;
            lightbox.img.src = src;
            lightbox.wrapper.style.display = 'flex';
            lightbox.wrapper.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            lightbox.container.setAttribute('tabindex', '-1');
            lightbox.container.focus();
            isOpen = true;
            // Attach resize/orientation listeners to auto-close when leaving mobile
            resizeHandler = function() {
                if (isOpen && !isMobileWidth() && !isTouchDevice()) {
                    closeLightbox();
                }
            };
            window.addEventListener('resize', resizeHandler, { passive: true });
            window.addEventListener('orientationchange', resizeHandler);
            
            // Enhanced touch support for swipe gestures
            if (isTouchDevice()) {
                var startY = 0;
                var currentY = 0;
                
                lightbox.container.addEventListener('touchstart', function(e) {
                    startY = e.touches[0].clientY;
                }, { passive: true });
                
                lightbox.container.addEventListener('touchmove', function(e) {
                    currentY = e.touches[0].clientY;
                    var deltaY = currentY - startY;
                    
                    // Swipe down to close
                    if (deltaY > 100) {
                        closeLightbox();
                    }
                }, { passive: true });
            }
        }

        function closeLightbox() {
            if (!lightbox) return;
            lightbox.wrapper.style.display = 'none';
            lightbox.wrapper.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            if (lastFocused && lastFocused.focus) {
                lastFocused.focus();
            }
            isOpen = false;
            if (resizeHandler) {
                window.removeEventListener('resize', resizeHandler);
                window.removeEventListener('orientationchange', resizeHandler);
                resizeHandler = null;
            }
        }

        function updateCursors() {
            var mobile = isMobileWidth() || isTouchDevice();
            images.forEach(function(img) {
                try {
                    var src = img.getAttribute('src') || '';
                    if (!TARGET_IMAGES.has(src)) return;
                    img.style.cursor = mobile ? 'zoom-in' : 'pointer';
                    // Enhanced accessibility
                    img.setAttribute('role', 'button');
                    img.setAttribute('aria-label', 'Click to view full size image');
                    img.setAttribute('tabindex', '0');
                } catch (_) { /* no-op */ }
            });
        }

        images.forEach(function(img) {
            try {
                var src = img.getAttribute('src') || '';
                // Only target requested media files
                if (!TARGET_IMAGES.has(src)) return;

                img.addEventListener('click', function() {
                    if (isMobileWidth() || isTouchDevice()) {
                        // Use currentSrc when available for responsive images
                        openLightbox(img.currentSrc || src);
                    }
                });
                
                // Enhanced keyboard accessibility
                img.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (isMobileWidth() || isTouchDevice()) {
                            openLightbox(img.currentSrc || src);
                        }
                    }
                });
                
                // Visual feedback for non-touch devices
                if (!isTouchDevice()) {
                    img.addEventListener('mouseenter', function() {
                        img.style.transform = 'scale(1.02)';
                        img.style.transition = 'transform 0.2s ease';
                    });
                    
                    img.addEventListener('mouseleave', function() {
                        img.style.transform = 'scale(1)';
                    });
                }
            } catch (_) { /* no-op */ }
        });

        // Initialize cursor state and keep it in sync with viewport
        updateCursors();
        window.addEventListener('resize', updateCursors, { passive: true });
        window.addEventListener('orientationchange', updateCursors);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', enhanceImages);
    } else {
        enhanceImages();
    }
})();


