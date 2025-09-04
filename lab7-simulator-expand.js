(function(){
    'use strict';

    // Initialize mobile expand for Lab 7 BCD to Excess-3 Converter Simulator
    function init(){
        // Ensure the shared expander is present
        if (!window.attachSimulatorExpand) return;

        // Move section title out of the white card (if authoring placed it inside)
        // The util already supports moving an inner header selected by `.section-title`
        window.attachSimulatorExpand({
            labId: 'lab7',
            // The simulator card container for lab 7
            containerSelector: '.bcd-excess3-sim-card',
            // If a `.section-title` is found inside the card, move it above the Expand button
            innerHeaderSelector: '.section-title',
            expandButtonHTML: '<i class="fas fa-expand"></i> Expand',
            modalTitle: 'BCD to Excess-3 Converter Simulator'
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();



