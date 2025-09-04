(function(){
    'use strict';

    function isMobile(){
        return window.matchMedia('(max-width: 768px)').matches;
    }

    function initMobileDropdownNav(){
        var navWrap = document.querySelector('#lab10 .simulator-navigation');
        var btnRow = navWrap ? navWrap.querySelector('.nav-buttons-container') : null;
        if (!navWrap || !btnRow) return;

        // Build or reuse a select element for mobile
        var existing = navWrap.querySelector('select.lab10-sim-nav');
        var select = existing || document.createElement('select');
        if (!existing){
            select.className = 'lab10-sim-nav';
            select.setAttribute('aria-label', 'Choose Flip Flop Simulator');
            select.style.width = '100%';
            select.style.maxWidth = '420px';
            select.style.padding = '0.6rem 0.8rem';
            select.style.border = '1px solid var(--border)';
            select.style.borderRadius = '8px';
            select.style.background = 'var(--bg-primary)';
            select.style.color = 'var(--text)';
            select.style.fontWeight = '600';
            select.style.display = 'none';

            var optD = document.createElement('option');
            optD.value = 'd';
            optD.textContent = 'D Flip Flop (74175)';
            var optJK = document.createElement('option');
            optJK.value = 'jk';
            optJK.textContent = 'JK Flip Flop (74114)';
            var optBoth = document.createElement('option');
            optBoth.value = 'both';
            optBoth.textContent = 'Show Both';
            select.appendChild(optD);
            select.appendChild(optJK);
            select.appendChild(optBoth);

            navWrap.insertBefore(select, btnRow);
        }

        var dBtn = document.getElementById('showDFlipFlopBtn');
        var jkBtn = document.getElementById('showJKFlipFlopBtn');
        var bothBtn = document.getElementById('showBothBtn');

        function syncFromButtons(){
            if (dBtn && dBtn.classList.contains('active')) select.value = 'd';
            else if (jkBtn && jkBtn.classList.contains('active')) select.value = 'jk';
            else select.value = 'both';
        }

        function clickButton(btn){
            if (!btn) return;
            btn.click();
        }

        select.addEventListener('change', function(){
            if (select.value === 'd') clickButton(dBtn);
            else if (select.value === 'jk') clickButton(jkBtn);
            else clickButton(bothBtn);
        });

        function adapt(){
            var mobile = isMobile();
            if (mobile){
                btnRow.style.display = 'none';
                select.style.display = 'inline-block';
                syncFromButtons();
            } else {
                btnRow.style.display = 'flex';
                select.style.display = 'none';
            }
        }

        adapt();
        window.addEventListener('resize', adapt);
    }

    // Reorder nav above clock panel on mobile for reduced scrolling
    function reorderNavAboveClockOnMobile(){
        var lab = document.getElementById('lab10');
        if (!lab) return;
        var simContainer = lab.querySelector('.simulator-container');
        if (!simContainer) return;

        var clockPanel = simContainer.querySelector('.clock-control-panel');
        var navWrap = simContainer.querySelector('.simulator-navigation');
        if (!clockPanel || !navWrap) return;

        // Keep original position references for restoration
        var originalParent = navWrap.parentNode;
        var originalNext = navWrap.nextSibling;

        function restore(){
            if (navWrap.parentNode !== originalParent){
                originalParent.insertBefore(navWrap, originalNext);
            }
        }

        function adapt(){
            // If the nav is currently moved into the modal header by expand, don't reorder here
            var inModalHeader = document.querySelector('.answer-modal .modal-container .modal-header .lab10-modal-nav-holder');
            if (inModalHeader && navWrap.parentNode && navWrap.parentNode.closest('.lab10-modal-nav-holder')){
                return;
            }

            if (isMobile()){
                if (clockPanel && navWrap && clockPanel.parentNode === simContainer){
                    // Move nav before clock panel
                    if (navWrap.nextSibling !== clockPanel){
                        simContainer.insertBefore(navWrap, clockPanel);
                    }
                }
            } else {
                restore();
            }
        }

        adapt();
        window.addEventListener('resize', adapt);
        // Also observe modal close to restore if needed
        var observer = new MutationObserver(function(){
            var modalOpen = document.querySelector('.answer-modal .modal-container');
            if (!modalOpen){
                setTimeout(adapt, 0);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function fixDFlipFlopLayout(){
        var dContainer = document.querySelector('#dFlipFlopSimulator .input-container');
        if (!dContainer) return;

        // Ensure inputs wrap into columns on mobile
        dContainer.style.display = 'flex';
        dContainer.style.flexWrap = 'wrap';
        dContainer.style.gap = '1rem';

        // Group: Finds the Clear/Preset row and ensures D Input is placed centered below on mobile
        var clrPresetRow = dContainer.querySelector('div[style*="display: flex"][style*="gap: 1rem"]');
        var dInputEl = document.getElementById('dFlipFlopInput');
        var dInputBlock = null;
        if (dInputEl){
            var inputSwitch = dInputEl.closest('.input-switch') || dInputEl.parentElement;
            dInputBlock = inputSwitch ? inputSwitch.parentElement : null; // outer block containing input-switch + label
        }
        if (clrPresetRow && dInputBlock){
            // Lightweight wrapper to center D Input at natural size on mobile
            var dWrapper = document.querySelector('#dFlipFlopSimulator .lab10-d-input-mobile-wrapper');
            if (!dWrapper){
                dWrapper = document.createElement('div');
                dWrapper.className = 'lab10-d-input-mobile-wrapper';
                dWrapper.style.width = '100%';
                dWrapper.style.display = 'none';
                dWrapper.style.justifyContent = 'center';
                dWrapper.style.alignItems = 'center';
            }
            function adapt(){
                if (isMobile()){
                    // Insert wrapper after CLR/PRESET row and place D block inside it
                    if (!dWrapper.parentNode){
                        clrPresetRow.parentNode.insertBefore(dWrapper, clrPresetRow.nextSibling);
                    }
                    if (dInputBlock.parentNode !== dWrapper){
                        dWrapper.appendChild(dInputBlock);
                    }
                    dWrapper.style.display = 'flex';
                    // Keep D input natural size like other switches
                    dInputBlock.style.width = 'auto';
                    dInputBlock.style.flex = '0 0 auto';
                    dInputBlock.style.display = '';
                    dInputBlock.style.justifyContent = '';
                } else {
                    // Restore default inline flow
                    dWrapper.style.display = 'none';
                    dInputBlock.style.width = '';
                    dInputBlock.style.flex = '';
                    dInputBlock.style.display = '';
                    dInputBlock.style.justifyContent = '';
                    if (dWrapper.parentNode){
                        // Place D input back after wrapper and remove wrapper
                        clrPresetRow.parentNode.insertBefore(dInputBlock, dWrapper.nextSibling);
                        dWrapper.parentNode.removeChild(dWrapper);
                    }
                }
            }
            adapt();
            window.addEventListener('resize', adapt);
        }

        // Prevent logic states overflow
        var states = document.querySelector('#dFlipFlopSimulator .gate-display');
        if (states){
            states.style.overflow = 'hidden';
            states.style.wordBreak = 'break-word';
        }
    }

    function fixJKFlipFlopLayout(){
        var jkContainer = document.querySelector('#jkFlipFlopSimulator .input-container');
        if (!jkContainer) return;

        jkContainer.style.display = 'flex';
        jkContainer.style.flexWrap = 'wrap';
        jkContainer.style.gap = '1rem';

        // Place J/K inputs below Clear/Preset on mobile and center them
        var clrPresetRow = jkContainer.querySelector('div[style*="display: flex"][style*="gap: 1rem"][style*="margin-bottom: 1rem"]');
        var jkRow = jkContainer.querySelector('div[style*="display: flex"][style*="gap: 1rem"]:not([style*="margin-bottom"])');
        if (clrPresetRow && jkRow){
            function adaptJK(){
                if (isMobile()){
                    if (jkRow.nextSibling !== clrPresetRow.nextSibling){
                        clrPresetRow.parentNode.insertBefore(jkRow, clrPresetRow.nextSibling);
                    }
                    jkRow.style.width = '100%';
                    jkRow.style.display = 'flex';
                    jkRow.style.justifyContent = 'center';
                    jkRow.style.gap = '1rem';
                } else {
                    jkRow.style.width = '';
                    jkRow.style.display = 'flex';
                    jkRow.style.justifyContent = '';
                }
            }
            adaptJK();
            window.addEventListener('resize', adaptJK);
        }

        // Prevent logic states overflow
        var states = document.querySelector('#jkFlipFlopSimulator .gate-display');
        if (states){
            states.style.overflow = 'hidden';
            states.style.wordBreak = 'break-word';
        }

        // Center output LEDs on mobile
        var outputs = document.querySelector('#jkFlipFlopSimulator .output-container');
        if (outputs){
            function adaptOut(){
                if (isMobile()){
                    outputs.style.display = 'flex';
                    outputs.style.justifyContent = 'center';
                    outputs.style.gap = '2rem';
                } else {
                    outputs.style.display = '';
                    outputs.style.justifyContent = '';
                    outputs.style.gap = '';
                }
            }
            adaptOut();
            window.addEventListener('resize', adaptOut);
        }
    }

    function init(){
        // Only run when Lab 10 is present
        if (!document.getElementById('lab10')) return;
        initMobileDropdownNav();
        reorderNavAboveClockOnMobile();
        fixDFlipFlopLayout();
        fixJKFlipFlopLayout();
    }

    if (document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();


