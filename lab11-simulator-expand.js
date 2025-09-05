(function(){
    'use strict';

    function init(){
        // Enhanced initialization with state management to prevent race conditions
        if (!window.attachSimulatorExpand) {
            // Retry if core module not loaded yet
            setTimeout(init, 100);
            return;
        }
        
        // Check if Lab 11 is already initialized to prevent conflicts
        if (window.lab11SimulatorExpandInitialized) {
            return;
        }
        
        // Mark as initializing to prevent duplicate calls
        window.lab11SimulatorExpandInitialized = true;
        
        // MOD-7 Counter Simulator expand-to-modal with header preservation
        // Modified to keep header inside the white container consistently
        window.attachSimulatorExpand({
            labId: 'lab11',
            containerSelector: '.simulator-container',
            innerHeaderSelector: null, // Disable header extraction to keep it inside
            expandButtonHTML: '<i class="fas fa-expand"></i> Expand',
            modalTitle: 'MOD-7 Counter Simulator'
        });
    }

    if (document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();


