/**
 * Platform Preloader for CS121 Lab Manual
 * Handles theme synchronization, platform detection, and initialization
 */

(function() {
    'use strict';
    
    // Platform detection
    const platform = {
        isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
        isAndroid: /Android/.test(navigator.userAgent),
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        isDesktop: !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)),
        isChrome: /Chrome/.test(navigator.userAgent),
        isFirefox: /Firefox/.test(navigator.userAgent),
        isSafari: /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent),
        isEdge: /Edg/.test(navigator.userAgent),
        // Protocol and environment detection
        isLocalFile: window.location.protocol === 'file:',
        isLocalhost: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
        isProduction: window.location.protocol === 'https:' && !window.location.hostname.includes('localhost'),
        isDevelopment: window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    };
    
    // Theme management
    const themeManager = {
        currentTheme: 'dark',
        
        init: function() {
            this.loadTheme();
            this.applyTheme();
            this.setupThemeToggle();
            this.setupSystemThemeListener();
        },
        
        loadTheme: function() {
            const savedTheme = localStorage.getItem('cs121-theme');
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            this.currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        },
        
        applyTheme: function() {
            const body = document.body;
            const isLight = this.currentTheme === 'light';
            // Keep legacy class for existing CSS while moving to data-theme tokens
            body.classList.toggle('light-mode', isLight);
            document.documentElement.setAttribute('data-theme', isLight ? 'light' : 'dark');
            // Update theme color meta tag
            const themeColorMeta = document.querySelector('meta[name="theme-color"]');
            if (themeColorMeta) {
                themeColorMeta.setAttribute('content', isLight ? '#1976d2' : '#3498db');
            }
            // Update theme toggle button/icon state
            this.updateThemeToggleState();
        },
        
        toggleTheme: function() {
            // Debounce rapid toggles
            if (this._toggleBusy) return;
            this._toggleBusy = true;

            const nextTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
            const apply = () => {
                this.currentTheme = nextTheme;
                localStorage.setItem('cs121-theme', this.currentTheme);
                this.applyTheme();
                // Clear switching flags
                document.documentElement.classList.remove('theme-switching');
                document.documentElement.classList.remove('theme-fade');
                this._toggleBusy = false;
            };

            try {
                // Add suppression class to avoid heavy per-element transitions
                document.documentElement.classList.add('theme-switching');
                // Use View Transitions API if available
                if (document.startViewTransition) {
                    document.startViewTransition(apply);
                } else {
                    // Fallback: brief fade class to smooth change
                    document.documentElement.classList.add('theme-fade');
                    // Batch DOM updates to next frame for smoother paint
                    requestAnimationFrame(() => {
                        requestAnimationFrame(apply);
                    });
                }
            } catch (e) {
                apply();
            }
        },
        
        setupThemeToggle: function() {
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle) {
                themeToggle.addEventListener('click', () => {
                    this.toggleTheme();
                });
            }
        },
        
        updateThemeToggleState: function() {
            const themeToggle = document.getElementById('themeToggle');
            const isLight = this.currentTheme === 'light';
            if (themeToggle) {
                // Update button style classes
                themeToggle.classList.toggle('sun', isLight);
                themeToggle.classList.toggle('moon', !isLight);
                // Update icon SVG and state
                const icon = themeToggle.querySelector('.theme-toggle-icon');
                if (icon) {
                    if (isLight) {
                        icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0112 2.25zm0 16.5a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zm9-6.75a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75zm-16.5 0a.75.75 0 01-.75.75H2.25a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75zm12.72-5.47a.75.75 0 011.06 1.06l-1.06 1.06a.75.75 0 11-1.06-1.06l1.06-1.06zm-9.19 9.19a.75.75 0 011.06 1.06l-1.06 1.06a.75.75 0 11-1.06-1.06l1.06-1.06zm12.02 1.06a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 101.06 1.06l1.06-1.06zm-9.19-9.19a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 101.06 1.06l1.06-1.06zM12 6.75a5.25 5.25 0 100 10.5 5.25 5.25 0 000-10.5z"/></svg>';
                        icon.classList.remove('toggled');
                    } else {
                        icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"/></svg>';
                        icon.classList.add('toggled');
                    }
                }
            }
        },
        
        setupSystemThemeListener: function() {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            mediaQuery.addEventListener('change', (e) => {
                // Only auto-switch if user hasn't manually set a preference
                if (!localStorage.getItem('cs121-theme')) {
                    this.currentTheme = e.matches ? 'dark' : 'light';
                    this.applyTheme();
                }
            });
        }
    };
    
    // Performance optimizations
    const performanceOptimizer = {
        init: function() {
            this.setupIntersectionObserver();
            this.optimizeImages();
            this.setupLazyLoading();
            this.setupCodeSplitting();
        },
        
        setupIntersectionObserver: function() {
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                                img.removeAttribute('data-src');
                                observer.unobserve(img);
                            }
                        }
                    });
                });
                
                // Observe images with data-src attribute
                document.querySelectorAll('img[data-src]').forEach(img => {
                    imageObserver.observe(img);
                });
            }
        },
        
        optimizeImages: function() {
            const images = document.querySelectorAll('img');
            
            images.forEach(img => {
                // Add loading="lazy" for images below the fold
                if (!img.hasAttribute('loading')) {
                    img.setAttribute('loading', 'lazy');
                }
                
                // Add decoding="async" for better performance
                if (!img.hasAttribute('decoding')) {
                    img.setAttribute('decoding', 'async');
                }
                
                // Ensure images are visible by default
                if (img.style.opacity === '0' || img.style.opacity === '') {
                    img.style.opacity = '1';
                }
                
                // Add fallback visibility for development environment
                if (platform.isDevelopment) {
                    setTimeout(() => {
                        if (img.style.opacity !== '1') {
                            img.style.opacity = '1';
                        }
                    }, 200);
                }
            });
        },
        
        setupLazyLoading: function() {
            // Implement lazy loading for heavy content sections
            const sections = document.querySelectorAll('.lab-section');
            
            if ('IntersectionObserver' in window) {
                const sectionObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('loaded');
                            // Load lab-specific JavaScript when section becomes visible
                            this.loadLabScript(entry.target.id);
                        }
                    });
                }, {
                    threshold: 0.1
                });
                
                sections.forEach(section => {
                    sectionObserver.observe(section);
                });
            }
        },
        
        setupCodeSplitting: function() {
            // Initialize code splitting for lab-specific scripts
            this.labScripts = {
                'lab1': ['image-lightbox.js', 'lab1-simulator-modal.js'],
                'lab2': 'lab2-simulator-modal.js',
                'lab3': ['lab3-modal.js', 'lab3-simulator-modal.js'],
                'lab4': ['lab4-modal.js'],
                'lab5': ['lab5-modal.js'],
                'lab6': ['lab6-kmap.js', 'lab6-simplification.js', 'lab6-function-h-kmap.js'],
                'lab7': ['image-lightbox.js', 'simulator-expand.js', 'lab7-simulator-expand.js'],
                'lab8': ['image-lightbox.js', 'simulator-expand.js', 'lab8-simulator-expand.js'],
                'lab9': ['image-lightbox.js', 'simulator-expand.js', 'lab9-simulator-expand.js'],
                'lab10': ['image-lightbox.js', 'simulator-expand.js', 'lab10-simulator-expand.js', 'lab10-responsive.js'],
                'lab11': ['image-lightbox.js', 'simulator-expand.js', 'lab11-simulator-expand.js', 'lab11-modal.js', 'lab11-responsive.js']
            };
            
            this.loadedScripts = new Set();
        },
        
        loadLabScript: function(labId) {
            // Load lab-specific JavaScript files only when needed
            if (this.loadedScripts.has(labId)) {
                return Promise.resolve();
            }
            
            const scripts = this.labScripts[labId];
            if (!scripts) {
                return Promise.resolve();
            }
            
            const scriptArray = Array.isArray(scripts) ? scripts : [scripts];
            const loadPromises = scriptArray.map(script => this.loadScript(script));
            
            return Promise.all(loadPromises).then(() => {
                this.loadedScripts.add(labId);
            });
        },
        
        loadScript: function(scriptPath) {
            return new Promise((resolve, reject) => {
                // Check if script is already loaded
                if (document.querySelector(`script[src="${scriptPath}"]`)) {
                    resolve();
                    return;
                }
                
                const script = document.createElement('script');
                script.src = scriptPath;
                script.async = true;
                
                script.onload = () => resolve();
                script.onerror = () => reject(new Error(`Failed to load ${scriptPath}`));
                
                document.head.appendChild(script);
            });
        }
    };
    
    // Accessibility enhancements
    const accessibilityEnhancer = {
        init: function() {
            this.setupKeyboardNavigation();
            this.setupFocusManagement();
            this.setupScreenReaderSupport();
        },
        
        setupKeyboardNavigation: function() {
            // Add keyboard navigation for interactive elements
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    document.body.classList.add('keyboard-navigation');
                }
            });
            
            document.addEventListener('mousedown', () => {
                document.body.classList.remove('keyboard-navigation');
            });
        },
        
        setupFocusManagement: function() {
            // Manage focus for modals and dropdowns
            const modals = document.querySelectorAll('[role="dialog"]');
            
            modals.forEach(modal => {
                const focusableElements = modal.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                
                if (focusableElements.length > 0) {
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];
                    
                    // Trap focus within modal
                    modal.addEventListener('keydown', (e) => {
                        if (e.key === 'Tab') {
                            if (e.shiftKey) {
                                if (document.activeElement === firstElement) {
                                    e.preventDefault();
                                    lastElement.focus();
                                }
                            } else {
                                if (document.activeElement === lastElement) {
                                    e.preventDefault();
                                    firstElement.focus();
                                }
                            }
                        }
                    });
                }
            });
        },
        
        setupScreenReaderSupport: function() {
            // Add ARIA live regions for dynamic content
            const liveRegion = document.createElement('div');
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            document.body.appendChild(liveRegion);
            
            // Announce important changes
            window.announceToScreenReader = function(message) {
                liveRegion.textContent = message;
                setTimeout(() => {
                    liveRegion.textContent = '';
                }, 1000);
            };
        }
    };
    
    // Platform-specific optimizations
    const platformOptimizer = {
        init: function() {
            this.applyPlatformSpecificStyles();
            this.setupTouchOptimizations();
            this.setupBrowserSpecificFeatures();
            this.handleManifestLoading();
        },
        
        applyPlatformSpecificStyles: function() {
            const body = document.body;
            
            // Add platform-specific classes
            Object.keys(platform).forEach(key => {
                if (platform[key]) {
                    body.classList.add(key);
                }
            });
            
            // iOS-specific optimizations
            if (platform.isIOS) {
                this.setupIOSOptimizations();
            }
            
            // Android-specific optimizations
            if (platform.isAndroid) {
                this.setupAndroidOptimizations();
            }
        },
        
        setupIOSOptimizations: function() {
            // Prevent zoom on input focus
            const inputs = document.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    input.style.fontSize = '16px';
                });
            });
            
            // Add iOS-specific viewport meta
            const viewportMeta = document.querySelector('meta[name="viewport"]');
            if (viewportMeta) {
                viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover');
            }
        },
        
        setupAndroidOptimizations: function() {
            // Optimize for Android Chrome
            if (platform.isChrome) {
                // Add Android-specific optimizations
                document.body.classList.add('android-chrome');
            }
        },
        
        setupTouchOptimizations: function() {
            if (platform.isMobile) {
                // Add touch-friendly styles
                document.body.classList.add('touch-device');
                
                // Optimize touch targets
                const touchTargets = document.querySelectorAll('button, a, input, select, textarea');
                touchTargets.forEach(target => {
                    target.style.minHeight = '44px';
                    target.style.minWidth = '44px';
                });
            }
        },
        
        setupBrowserSpecificFeatures: function() {
            // Chrome-specific features
            if (platform.isChrome) {
                document.body.classList.add('chrome-browser');
            }
            
            // Firefox-specific features
            if (platform.isFirefox) {
                document.body.classList.add('firefox-browser');
            }
            
            // Safari-specific features
            if (platform.isSafari) {
                document.body.classList.add('safari-browser');
            }
        },
        
        handleManifestLoading: function() {
            // Handle manifest loading for different environments
            if (platform.isLocalFile) {
                // Remove manifest link in file:// protocol to prevent CORS errors
                const manifestLink = document.getElementById('pwa-manifest');
                if (manifestLink) {
                    manifestLink.remove();
                }
            }
        }
    };
    
    // Error handling and logging
    const errorHandler = {
        init: function() {
            this.setupGlobalErrorHandling();
            this.setupConsoleFiltering();
        },
        
        setupGlobalErrorHandling: function() {
            window.addEventListener('error', (event) => {
                // Filter out common noise
                if (this.shouldIgnoreError(event)) {
                    event.preventDefault();
                    return;
                }
                
                console.error('[Platform Error]', {
                    message: event.message,
                    filename: event.filename,
                    lineno: event.lineno,
                    colno: event.colno,
                    error: event.error,
                    platform: platform
                });
            });
            
            window.addEventListener('unhandledrejection', (event) => {
                console.error('[Unhandled Promise Rejection]', event.reason);
                event.preventDefault();
            });
        },
        
        shouldIgnoreError: function(event) {
            const message = event.message || '';
            const filename = event.filename || '';
            
            return (
                message.includes('React DevTools') ||
                filename.includes('chrome-extension') ||
                message.includes('ResizeObserver loop limit exceeded') ||
                message.includes('Script error') ||
                message.includes('Failed to load resource') ||
                message.includes('net::ERR_') ||
                message.includes('Uncaught (in promise)') ||
                // Development-specific errors to ignore
                (platform.isDevelopment && (
                    message.includes('Service Worker') ||
                    message.includes('CORS policy') ||
                    message.includes('file://') ||
                    message.includes('manifest') ||
                    message.includes('Access to internal resource') ||
                    message.includes('Cross origin requests') ||
                    message.includes('protocol schemes')
                ))
            );
        },
        
        setupConsoleFiltering: function() {
            const originalError = console.error;
            const originalWarn = console.warn;
            
            console.error = function(...args) {
                const message = args.join(' ');
                if (!message.includes('React DevTools') && 
                    !message.includes('chrome-extension') &&
                    !message.includes('Failed to load resource') &&
                    // Development-specific filtering
                    !(platform.isDevelopment && (
                        message.includes('Service Worker') ||
                        message.includes('CORS policy') ||
                        message.includes('file://') ||
                        message.includes('manifest') ||
                        message.includes('Access to internal resource') ||
                        message.includes('Cross origin requests') ||
                        message.includes('protocol schemes')
                    ))) {
                    originalError.apply(console, args);
                }
            };
            
            console.warn = function(...args) {
                const message = args.join(' ');
                if (!message.includes('React DevTools') && 
                    !message.includes('chrome-extension') &&
                    // Development-specific filtering
                    !(platform.isDevelopment && (
                        message.includes('Service Worker') ||
                        message.includes('CORS policy') ||
                        message.includes('file://') ||
                        message.includes('manifest') ||
                        message.includes('Access to internal resource') ||
                        message.includes('Cross origin requests') ||
                        message.includes('protocol schemes')
                    ))) {
                    originalWarn.apply(console, args);
                }
            };
        }
    };
    
    // Main initialization
    function initializePlatform() {
        // Initialize all modules
        themeManager.init();
        performanceOptimizer.init();
        accessibilityEnhancer.init();
        platformOptimizer.init();
        errorHandler.init();
        
        // Mark platform as ready
        document.body.classList.add('platform-ready');
        
        // Add environment-specific classes
        if (platform.isDevelopment) {
            document.body.classList.add('development-mode');
        }
        if (platform.isProduction) {
            document.body.classList.add('production-mode');
        }
        if (platform.isLocalFile) {
            document.body.classList.add('local-file-mode');
        }
        
        // Platform initialization complete - no console logging for clean user experience
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializePlatform);
    } else {
        initializePlatform();
    }
    
    // Input sanitization utility
    const sanitizer = {
        sanitizeHTML: function(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        },
        
        sanitizeAttribute: function(str) {
            return str.replace(/[<>\"'&]/g, function(match) {
                const escape = {
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#x27;',
                    '&': '&amp;'
                };
                return escape[match];
            });
        },
        
        validateEmail: function(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
        
        validateURL: function(url) {
            try {
                new URL(url);
                return true;
            } catch {
                return false;
            }
        }
    };
    
    // Export for global access
    window.CS121Platform = {
        platform,
        themeManager,
        performanceOptimizer,
        accessibilityEnhancer,
        platformOptimizer,
        errorHandler,
        sanitizer
    };
    
})();
