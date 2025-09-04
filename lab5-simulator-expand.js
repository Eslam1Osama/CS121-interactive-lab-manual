(function(){
    'use strict';

    // Initialize mobile expand for Lab 5 Boolean Expression Simulator
    function init(){
        if (!window.attachSimulatorExpand) return;
        // For Lab 5, boolean expression simulator shares container patterns
        window.attachSimulatorExpand({
            labId: 'lab5',
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


