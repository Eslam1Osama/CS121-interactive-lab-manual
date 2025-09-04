(function(){
    'use strict';

    function isMobile(){
        return window.matchMedia('(max-width: 768px)').matches;
    }

    // Convert K-Map nav buttons into a dropdown on mobile, syncing both ways
    function initKmapDropdown(){
        var lab = document.getElementById('lab11');
        if (!lab) return;
        var nav = lab.querySelector('.kmap-navigation');
        if (!nav) return;

        var btns = {
            JA: document.getElementById('showJAkmapBtn'),
            KA: document.getElementById('showKAkmapBtn'),
            JB: document.getElementById('showJBkmapBtn'),
            KB: document.getElementById('showKBkmapBtn'),
            JC: document.getElementById('showJCkmapBtn'),
            KC: document.getElementById('showKCkmapBtn'),
            ALL: document.getElementById('showAllKmapsBtn')
        };
        if (!btns.JA || !btns.KA || !btns.JB || !btns.KB || !btns.JC || !btns.KC || !btns.ALL) return;

        var container = nav.querySelector('.nav-buttons-container');
        if (!container) return;

        // Build or reuse select
        var select = nav.querySelector('select.lab11-kmap-nav');
        if (!select){
            select = document.createElement('select');
            select.className = 'lab11-kmap-nav';
            select.setAttribute('aria-label', 'Choose K-Map');
            select.style.width = '100%';
            select.style.maxWidth = '420px';
            select.style.padding = '0.6rem 0.8rem';
            select.style.border = '1px solid var(--border)';
            select.style.borderRadius = '8px';
            select.style.background = 'var(--bg-primary)';
            select.style.color = 'var(--text)';
            select.style.fontWeight = '600';
            select.style.display = 'none';

            var options = [
                { value: 'JA', label: 'JA' },
                { value: 'KA', label: 'KA' },
                { value: 'JB', label: 'JB' },
                { value: 'KB', label: 'KB' },
                { value: 'JC', label: 'JC' },
                { value: 'KC', label: 'KC' },
                { value: 'ALL', label: 'Show All' }
            ];
            options.forEach(function(opt){
                var o = document.createElement('option');
                o.value = opt.value;
                o.textContent = opt.label;
                select.appendChild(o);
            });

            nav.insertBefore(select, container);
        }

        function click(btn){ if (btn) btn.click(); }

        select.addEventListener('change', function(){
            switch(select.value){
                case 'JA': click(btns.JA); break;
                case 'KA': click(btns.KA); break;
                case 'JB': click(btns.JB); break;
                case 'KB': click(btns.KB); break;
                case 'JC': click(btns.JC); break;
                case 'KC': click(btns.KC); break;
                default: click(btns.ALL);
            }
        });

        function syncFromButtons(){
            if (btns.ALL.classList.contains('active')){ select.value = 'ALL'; return; }
            var map = [
                { key: 'JA', btn: btns.JA },
                { key: 'KA', btn: btns.KA },
                { key: 'JB', btn: btns.JB },
                { key: 'KB', btn: btns.KB },
                { key: 'JC', btn: btns.JC },
                { key: 'KC', btn: btns.KC }
            ];
            var active = map.find(function(m){ return m.btn.classList.contains('active'); });
            select.value = active ? active.key : 'JA';
        }

        function adapt(){
            if (isMobile()){
                container.style.display = 'none';
                select.style.display = 'inline-block';
                syncFromButtons();
            } else {
                container.style.display = 'flex';
                select.style.display = 'none';
            }
        }

        adapt();
        window.addEventListener('resize', adapt);

        // Keep dropdown in sync if user taps original buttons (e.g., on desktop)
        Object.values(btns).forEach(function(btn){
            btn.addEventListener('click', function(){ setTimeout(syncFromButtons, 0); });
        });
    }

    // Comprehensive responsive behavior for MOD-7 Counter Simulator
    function initMod7Responsive(){
        var lab = document.getElementById('lab11');
        if (!lab) return;

        var simContainer = lab.querySelector('.simulator-container');
        if (!simContainer) return;

        // Main grid layout container
        var gridLayout = simContainer.querySelector('.grid-layout');
        if (!gridLayout) return;

        // Key sections
        var clockPanel = simContainer.querySelector('.clock-control-panel');
        var counterInputSection = simContainer.querySelector('.counter-input-section');
        var segSection = simContainer.querySelector('.counter-seg-section');
        var ledSection = simContainer.querySelector('.counter-led-section');
        var debugSection = simContainer.querySelector('.jk-debug-section');

        // 7-segment SVG elements
        var sevenSegSvg = lab.querySelector('#counterSevenSegmentSVG');
        var sevenSegContainer = sevenSegSvg ? sevenSegSvg.closest('.counter-seg-container') : null;

        // LED container (scope to simulator container so it still matches inside modal)
        var ledContainer = simContainer.querySelector('.counter-led-container');

        // Counter switches container (scope to simulator container for modal)
        var switchRow = simContainer.querySelector('.counter-switch-row');

        function applyMod7Responsive(){
            if (!isMobile()){
                // Desktop layout
                if (gridLayout){
                    gridLayout.style.gridTemplateColumns = '1fr 1fr';
                }

                // Reset section styles
                [clockPanel, counterInputSection, segSection, ledSection, debugSection].forEach(function(section){
                    if (section){
                        section.style.width = '';
                        section.style.maxWidth = '';
                        section.style.margin = '';
                    }
                });

                // Reset 7-segment display
                if (sevenSegSvg){
                    sevenSegSvg.style.width = '';
                    sevenSegSvg.style.height = '';
                    sevenSegSvg.style.maxWidth = '100%';
                }
                if (sevenSegContainer){
                    sevenSegContainer.style.textAlign = '';
                    sevenSegContainer.style.overflow = '';
                }

                // Reset LED container - maintain horizontal layout on desktop
                if (ledContainer){
                    ledContainer.style.display = 'grid';
                    ledContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
                    ledContainer.style.gap = '1rem';
                    ledContainer.style.justifyContent = 'center';
                    ledContainer.style.maxWidth = '';
                    ledContainer.style.margin = '';
                    ledContainer.style.padding = '';

                    // Reset LED display styles for desktop
                    var ledDisplays = ledContainer.querySelectorAll('.counter-led-display');
                    ledDisplays.forEach(function(display){
                        display.style.display = 'flex';
                        display.style.flexDirection = 'column';
                        display.style.alignItems = 'center';
                        display.style.minWidth = '90px';
                        display.style.maxWidth = '120px';
                        display.style.padding = '';
                        display.style.borderRadius = '';
                        display.style.minWidth = '';
                        display.style.maxWidth = '';
                        display.style.textAlign = '';
                        var labels = display.querySelectorAll('.input-label');
                        if (labels.length > 0){
                            labels[0].style.marginBottom = '0.35rem';
                            labels[0].style.whiteSpace = 'nowrap';
                            labels[0].style.textAlign = 'center';
                        }
                    });

                    // Reset LED sizes for desktop
                    var leds = ledContainer.querySelectorAll('.led-output');
                    leds.forEach(function(led){
                        led.style.width = '';
                        led.style.height = '';
                        led.style.margin = '';
                    });

                    // Reset LED labels for desktop
                    var ledLabels = ledContainer.querySelectorAll('.input-label');
                    ledLabels.forEach(function(label){
                        label.style.fontSize = '';
                        label.style.lineHeight = '';
                    });
                }

                // Reset Counter State (ABC) switches - maintain horizontal layout on desktop
                if (switchRow){
                    switchRow.style.display = 'flex';
                    switchRow.style.justifyContent = 'center';
                    switchRow.style.gap = '1.5rem';
                    switchRow.style.flexWrap = 'wrap';
                    switchRow.style.alignItems = 'center';
                    switchRow.style.maxWidth = '';
                    switchRow.style.margin = '';
                    switchRow.style.padding = '';

                    // Reset switch block styles for desktop
                    var switchBlocks = switchRow.querySelectorAll('.counter-switch-block');
                    switchBlocks.forEach(function(block){
                        block.style.textAlign = '';
                        block.style.minWidth = '';
                        block.style.maxWidth = '';
                        block.style.flex = '';
                        block.style.padding = '';
                    });

                    // Reset switch labels for desktop
                    var switchLabels = switchRow.querySelectorAll('.input-label');
                    switchLabels.forEach(function(label){
                        label.style.fontSize = '';
                        label.style.lineHeight = '';
                        label.style.whiteSpace = '';
                    });

                    // Reset switches for desktop
                    var switches = switchRow.querySelectorAll('.input-switch');
                    switches.forEach(function(switchEl){
                        switchEl.style.transform = '';
                        switchEl.style.margin = '';
                    });
                }

                // Align Counter State (ABC) switches precisely on desktop
                if (switchRow){
                    // Keep horizontal row and allow wrap on large screens
                    switchRow.style.display = 'flex';
                    switchRow.style.justifyContent = 'center';
                    switchRow.style.gap = '1.5rem';
                    switchRow.style.flexWrap = 'wrap';
                    switchRow.style.alignItems = 'flex-start';

                    var switchBlocksDesktop = switchRow.querySelectorAll('.counter-switch-block');
                    switchBlocksDesktop.forEach(function(block){
                        block.style.display = 'flex';
                        block.style.flexDirection = 'column';
                        block.style.alignItems = 'center';
                        block.style.minWidth = '90px';
                        block.style.maxWidth = '120px';
                        block.style.textAlign = 'center';
                    });

                    var switchTogglesDesktop = switchRow.querySelectorAll('.input-switch');
                    switchTogglesDesktop.forEach(function(s){
                        s.style.margin = '0 auto';
                    });

                    var switchLabelsDesktop = switchRow.querySelectorAll('.counter-switch-block .input-label');
                    switchLabelsDesktop.forEach(function(label){
                        label.style.marginTop = '0.35rem';
                        label.style.textAlign = 'center';
                        label.style.whiteSpace = 'nowrap';
                    });
                }

                // Reset debug logger
                if (debugSection){
                    var debugRow = debugSection.querySelector('.jk-debug-row');
                    if (debugRow){
                        debugRow.style.gridTemplateColumns = '';
                        debugRow.style.gap = '';
                    }
                }

            } else {
                // Mobile layout - single column stack
                if (gridLayout){
                    gridLayout.style.gridTemplateColumns = '1fr';
                    gridLayout.style.gap = '1rem';
                }

                // Make sections full width with proper mobile spacing
                [clockPanel, counterInputSection, segSection, ledSection, debugSection].forEach(function(section){
                    if (section){
                        section.style.width = '100%';
                        section.style.maxWidth = '100%';
                        section.style.margin = '0';
                    }
                });

                // Optimize clock control panel for mobile
                if (clockPanel){
                    // Make buttons smaller and more touch-friendly
                    var buttons = clockPanel.querySelectorAll('.btn');
                    buttons.forEach(function(btn){
                        btn.style.padding = '0.6rem 0.8rem';
                        btn.style.fontSize = '0.85rem';
                        btn.style.minWidth = '60px';
                    });

                    // Optimize frequency selector
                    var freqSelect = clockPanel.querySelector('#clockFrequencyLab11');
                    if (freqSelect){
                        freqSelect.style.fontSize = '0.85rem';
                        freqSelect.style.padding = '0.4rem';
                    }
                }

                // Optimize counter input section
                if (counterInputSection){
                    // Make switches more touch-friendly
                    var switches = counterInputSection.querySelectorAll('.input-switch');
                    switches.forEach(function(switchEl){
                        switchEl.style.transform = 'scale(1.1)';
                    });

                    // Optimize counter values display
                    var valuesDisplay = counterInputSection.querySelector('.counter-values-display');
                    if (valuesDisplay){
                        valuesDisplay.style.fontSize = '0.9rem';
                        valuesDisplay.style.padding = '0.7rem';
                    }
                }

                // Optimize 7-segment display for mobile
                if (sevenSegSvg){
                    // Make display larger and more readable on mobile
                    sevenSegSvg.style.width = '120px';
                    sevenSegSvg.style.height = '195px';
                    sevenSegSvg.style.maxWidth = '90vw';
                }
                if (sevenSegContainer){
                    sevenSegContainer.style.textAlign = 'center';
                    sevenSegContainer.style.overflow = 'hidden';
                }

                // Optimize LED container for mobile - maintain horizontal layout
                if (ledContainer){
                    // Keep horizontal layout on all screen sizes with optimized spacing
                    ledContainer.style.display = 'grid';
                    ledContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
                    ledContainer.style.gap = '0.8rem';
                    ledContainer.style.justifyContent = 'center';
                    ledContainer.style.maxWidth = '350px';
                    ledContainer.style.margin = '0 auto';
                    ledContainer.style.padding = '0.5rem';

                    // Make LED displays touch-friendly and consistently spaced
                    var ledDisplays = ledContainer.querySelectorAll('.counter-led-display');
                    ledDisplays.forEach(function(display){
                        display.style.padding = '0.6rem 0.3rem';
                        display.style.borderRadius = '8px';
                        display.style.textAlign = 'center';
                        display.style.minWidth = '80px';
                        display.style.maxWidth = '100px';
                    });

                    // Optimize LED sizes for mobile
                    var leds = ledContainer.querySelectorAll('.led-output');
                    leds.forEach(function(led){
                        led.style.width = '28px';
                        led.style.height = '28px';
                        led.style.margin = '0.3rem auto';
                    });

                    // Adjust label font sizes for mobile
                    var ledLabels = ledContainer.querySelectorAll('.input-label');
                    ledLabels.forEach(function(label){
                        label.style.fontSize = '0.8rem';
                        label.style.lineHeight = '1.3';
                    });
                }

                // Optimize Counter State (ABC) switches - maintain horizontal layout
                if (switchRow){
                    // Force horizontal layout when expand button appears (<=700px) or when inside modal
                    var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
                    var inModal = !!simContainer.closest('.modal-content');
                    var expandMobile = window.matchMedia('(max-width: 700px)').matches;

                    if (inModal || expandMobile){
                        // Grid ensures no vertical stacking inside modal
                        switchRow.style.display = 'grid';
                        switchRow.style.gridTemplateColumns = 'repeat(3, minmax(0, 1fr))';
                        switchRow.style.placeItems = 'center';
                        switchRow.style.columnGap = (vw <= 320 ? 6 : (vw <= 360 ? 8 : 12)) + 'px';
                        switchRow.style.rowGap = '0px';
                        switchRow.style.width = '100%';
                        switchRow.style.maxWidth = '100%';
                        switchRow.style.margin = '0 auto';
                        switchRow.style.padding = '0.4rem 0.2rem';
                    } else {
                        switchRow.style.display = 'flex';
                        switchRow.style.justifyContent = 'center';
                        switchRow.style.alignItems = 'center';
                        switchRow.style.flexWrap = 'nowrap';
                        switchRow.style.margin = '0 auto';
                        switchRow.style.padding = '0.4rem';
                        var gapPx = vw <= 320 ? 6 : (vw <= 360 ? 8 : 12);
                        var maxW = vw <= 320 ? 260 : (vw <= 360 ? 300 : 340);
                        switchRow.style.gap = gapPx + 'px';
                        switchRow.style.maxWidth = maxW + 'px';
                    }

                    var switchBlocks = switchRow.querySelectorAll('.counter-switch-block');
                    switchBlocks.forEach(function(block){
                        block.style.textAlign = 'center';
                        var minW = vw <= 320 ? 68 : 75;
                        var maxInner = vw <= 320 ? 88 : 95;
                        block.style.minWidth = minW + 'px';
                        block.style.maxWidth = maxInner + 'px';
                        block.style.flex = '1';
                        block.style.padding = '0.3rem';
                    });

                    var switchLabels = switchRow.querySelectorAll('.input-label');
                    switchLabels.forEach(function(label){
                        label.style.fontSize = vw <= 320 ? '0.72rem' : '0.8rem';
                        label.style.lineHeight = '1.15';
                        label.style.whiteSpace = 'nowrap';
                    });

                    var switches = switchRow.querySelectorAll('.input-switch');
                    switches.forEach(function(switchEl){
                        var scale = vw <= 320 ? 1.0 : (vw <= 360 ? 1.05 : 1.1);
                        // Slightly smaller when constrained to guarantee 3-in-a-row
                        if ((inModal || expandMobile) && vw <= 360) scale = 0.96;
                        switchEl.style.transform = 'scale(' + scale + ')';
                        switchEl.style.margin = '0.15rem auto';
                    });
                }

                // Optimize JK debug logger for mobile
                if (debugSection){
                    var debugRow = debugSection.querySelector('.jk-debug-row');
                    if (debugRow){
                        // Single column layout for debug blocks
                        debugRow.style.gridTemplateColumns = '1fr';
                        debugRow.style.gap = '1rem';
                    }

                    var debugBlocks = debugSection.querySelectorAll('.jk-debug-block');
                    debugBlocks.forEach(function(block){
                        block.style.padding = '0.8rem';
                        block.style.fontSize = '0.9rem';
                        block.style.textAlign = 'center';
                    });
                }
            }
        }

        // Apply responsive behavior
        applyMod7Responsive();

        // Listen for resize and orientation changes
        window.addEventListener('resize', applyMod7Responsive);
        window.addEventListener('orientationchange', function(){
            setTimeout(applyMod7Responsive, 100);
        });

        // Re-apply when simulator moves into/out of modal
        var bodyObserver = new MutationObserver(function(){
            if (!simContainer) return;
            var isInModal = !!simContainer.closest('.modal-content');
            if (isInModal) applyMod7Responsive();
        });
        bodyObserver.observe(document.body, { childList: true, subtree: true });
    }

    function init(){
        if (!document.getElementById('lab11')) return;
        initKmapDropdown();
        initMod7Responsive();
    }

    if (document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

