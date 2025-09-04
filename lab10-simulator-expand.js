(function(){
    'use strict';

    function init(){
        if (!window.attachSimulatorExpand) return;
        // Lab 10 Flip Flop Simulator expand-to-modal
        window.attachSimulatorExpand({
            labId: 'lab10',
            containerSelector: '.simulator-container',
            innerHeaderSelector: '.section-title',
            expandButtonHTML: '<i class="fas fa-expand"></i> Expand',
            modalTitle: 'Flip Flop Simulator'
        });
    }

    if (document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();


