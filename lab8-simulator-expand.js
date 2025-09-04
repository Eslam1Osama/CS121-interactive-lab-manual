(function(){
    'use strict';

    // Initialize mobile expand for Lab 8: 3x8 Decoder with OR Gates Simulator
    function init(){
        if (!window.attachSimulatorExpand) return;

        // Use the shared utility; move the section header group (title + button) outside if authored inside
        window.attachSimulatorExpand({
            labId: 'lab8',
            // The simulator card container for Lab 8
            containerSelector: '.simulator-container',
            // Let the utility try to move `.section-title` (and its wrapper when it includes buttons) above the Expand button
            innerHeaderSelector: '.section-title',
            expandButtonHTML: '<i class="fas fa-expand"></i> Expand',
            modalTitle: '3x8 Decoder with OR Gates Simulator'
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();


