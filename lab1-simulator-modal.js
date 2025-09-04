/**
 * Lab 1: 7447 BCD to 7-Segment Smart Simulator - Mobile Modal
 * - Adds an "Expand" control for mobile to open the simulator in a centered modal
 * - Reuses existing modal classes and accessibility patterns
 */
(function(){
    'use strict';

    function isMobileWidth(){
        return window.matchMedia('(max-width: 700px)').matches;
    }

    function createModal(simContent){
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay show';
        overlay.style.zIndex = '1000';

        const container = document.createElement('div');
        container.className = 'modal-container';
        container.setAttribute('role','dialog');
        container.setAttribute('aria-modal','true');
        container.style.maxWidth = '98vw';
        container.style.width = '98vw';
        container.style.zIndex = '1001';

        const header = document.createElement('div');
        header.className = 'modal-header';
        const h = document.createElement('h3');
        h.textContent = '7447 BCD to 7-Segment Simulator';
        const close = document.createElement('button');
        close.className = 'modal-close';
        close.setAttribute('aria-label','Close');
        close.innerHTML = '&times;';
        header.appendChild(h);
        header.appendChild(close);

        const content = document.createElement('div');
        content.className = 'modal-content';
        content.appendChild(simContent);

        const wrapper = document.createElement('div');
        wrapper.className = 'answer-modal';
        wrapper.style.display = 'flex';
        wrapper.setAttribute('aria-hidden','false');
        wrapper.appendChild(overlay);
        wrapper.appendChild(container);
        container.appendChild(header);
        container.appendChild(content);

        // Close interactions
        function closeModal(){
            wrapper.style.display = 'none';
            wrapper.setAttribute('aria-hidden','true');
            if (simPlaceholder && simContent) {
                simPlaceholder.replaceWith(simContent);
            }
            document.body.style.overflow = '';
            expandBtn && expandBtn.focus();
            wrapper.remove();
            currentModal = null;
        }
        overlay.addEventListener('click', closeModal);
        close.addEventListener('click', closeModal);
        document.addEventListener('keydown', function onKey(e){
            if(e.key==='Escape'){
                document.removeEventListener('keydown', onKey);
                closeModal();
            }
        });

        document.body.appendChild(wrapper);
        document.body.style.overflow = 'hidden';

        return { wrapper, closeModal };
    }

    let expandBtn, simPlaceholder, currentModal = null;

    function init(){
        const lab1Section = document.getElementById('lab1');
        if (!lab1Section) return;

        const simCard = lab1Section.querySelector('.lab1-sim-card');
        if (!simCard) return;

        // Add an expand control only on mobile
        expandBtn = document.createElement('button');
        expandBtn.type = 'button';
        expandBtn.className = 'btn btn-info';
        expandBtn.style.alignSelf = 'flex-end';
        expandBtn.style.marginBottom = '0.75rem';
        expandBtn.innerHTML = '<i class="fas fa-expand"></i> Expand';

        // Insert expand button just before the simulator card
        simCard.parentNode.insertBefore(expandBtn, simCard);

        // Prepare a placeholder to keep flow when modal is open
        simPlaceholder = document.createElement('div');
        simPlaceholder.style.height = simCard.offsetHeight + 'px';
        simPlaceholder.style.display = 'none';

        expandBtn.addEventListener('click', function(){
            if (!isMobileWidth()) return;
            // Move the simulator into modal content to maximize horizontal space
            simPlaceholder.style.height = simCard.offsetHeight + 'px';
            simPlaceholder.style.display = 'block';
            simCard.parentNode.replaceChild(simPlaceholder, simCard);
            const modal = createModal(simCard);
            currentModal = modal;
        });

        // Hide button on larger screens
        function adapt(){
            const mobile = isMobileWidth();
            expandBtn.style.display = mobile ? 'inline-flex' : 'none';
            // If modal is open and we exit mobile, close it automatically
            if (!mobile && currentModal && currentModal.wrapper && currentModal.wrapper.style.display === 'flex') {
                currentModal.closeModal();
            }
        }
        window.addEventListener('resize', adapt, { passive: true });
        window.addEventListener('orientationchange', adapt);
        adapt();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();


