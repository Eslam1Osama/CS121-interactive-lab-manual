(function(){
    'use strict';

    function init(){
        if (!window.attachSimulatorExpand) return;
        // MOD-7 Counter Simulator expand-to-modal with header extraction
        window.attachSimulatorExpand({
            labId: 'lab11',
            containerSelector: '.simulator-container',
            innerHeaderSelector: '.section-title',
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


