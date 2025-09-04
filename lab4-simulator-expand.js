(function(){
    'use strict';

    // Initialize mobile expand for Lab 4 Boolean Expression Simulator
    function init(){
        if (!window.attachSimulatorExpand) return;
        // For Lab 4, the boolean expression simulator lives inside a generic container
        // Use the same patterns as Lab 2/3 (header moved outside, expand button synced with modal)
        window.attachSimulatorExpand({
            labId: 'lab4',
            containerSelector: '.boolean-sim-module.boolean-expr-sim, .simulator-container',
            innerHeaderSelector: '.section-title',
            expandButtonHTML: '<i class="fas fa-expand"></i> Expand',
            modalTitle: 'Boolean Expression Simulator'
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();


