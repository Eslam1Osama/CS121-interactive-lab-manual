(function(){
    'use strict';

    // Initialize mobile expand for Lab 9: 8×1 Multiplexer Simulator
    function init(){
        if (!window.attachSimulatorExpand) return;

        window.attachSimulatorExpand({
            labId: 'lab9',
            // The MUX simulator uses the boolean-expr-sim card; add fallback to generic class
            containerSelector: '.boolean-sim-module.boolean-expr-sim, .simulator-container',
            innerHeaderSelector: '.section-title',
            expandButtonHTML: '<i class="fas fa-expand"></i> Expand',
            modalTitle: '8×1 Multiplexer Simulator'
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();


