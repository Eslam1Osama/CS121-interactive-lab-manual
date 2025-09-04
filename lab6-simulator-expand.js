(function(){
    'use strict';

    // Initialize mobile expand for Lab 6 Function F and Function H simulators
    function init(){
        if (!window.attachSimulatorExpand) return;
        // Function F Simulator
        window.attachSimulatorExpand({
            labId: 'lab6',
            containerSelector: '.function-f-sim, .simulator-container',
            innerHeaderSelector: '.section-title',
            expandButtonHTML: '<i class="fas fa-expand"></i> Expand',
            modalTitle: 'Function F Simulator'
        });

        // Function H Simulator
        window.attachSimulatorExpand({
            labId: 'lab6',
            containerSelector: '.function-h-sim, .boolean-sim-module.boolean-expr-sim, .simulator-container',
            innerHeaderSelector: '.section-title',
            expandButtonHTML: '<i class="fas fa-expand"></i> Expand',
            modalTitle: 'Function H Simulator'
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();


