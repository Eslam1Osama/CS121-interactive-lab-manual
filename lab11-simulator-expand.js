(function(){
    'use strict';

    function init(){
        if (!window.attachSimulatorExpand) return;
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


