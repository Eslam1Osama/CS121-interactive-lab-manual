(function(){
    'use strict';

    /**
     * Attach mobile Expand-to-Modal behavior to a simulator section.
     * - Inserts an Expand button above the simulator on small screens
     * - Moves inner header (if found) outside the white container
     * - Opens simulator inside an accessible modal on click
     * - Restores simulator back to its original position on close
     *
     * @param {Object} options
     * @param {string} options.labId - Section id (e.g., 'lab4')
     * @param {string} options.containerSelector - CSS selector to find simulator container within the lab section
     * @param {string} [options.innerHeaderSelector='.section-title'] - Selector for inner header to move out of simulator card
     * @param {string} [options.expandButtonHTML='<i class="fas fa-expand"></i> Expand'] - HTML for expand button
     * @param {string} [options.modalTitle='Simulator'] - Title shown in modal header
     */
    function attachSimulatorExpand(options){
        var labId = options && options.labId;
        var containerSelector = options && options.containerSelector;
        var innerHeaderSelector = (options && options.innerHeaderSelector) || '.section-title';
        var expandButtonHTML = (options && options.expandButtonHTML) || '<i class="fas fa-expand"></i> Expand';
        var modalTitle = (options && options.modalTitle) || 'Simulator';

        if (!labId || !containerSelector) return;

        var labSection = document.getElementById(labId);
        if (!labSection) return;

        // Initialize for all matching containers within the lab section
        var containers = labSection.querySelectorAll(containerSelector);
        if (!containers || containers.length === 0) return;

        function isMobileWidth(){
            return window.matchMedia('(max-width: 700px)').matches;
        }

        containers.forEach(function(simContainer){
            try {
                // Avoid double-initialization if multiple selectors match the same node
                if (simContainer.dataset.expandInitialized === 'true') return;
                simContainer.dataset.expandInitialized = 'true';

                var expandBtn = document.createElement('button');
                expandBtn.type = 'button';
                expandBtn.className = 'btn btn-info';
                expandBtn.style.alignSelf = 'flex-end';
                expandBtn.style.marginBottom = '0.75rem';
                expandBtn.innerHTML = expandButtonHTML;

                // Insert the expand button just before the simulator container
                if (simContainer.parentNode) {
                    simContainer.parentNode.insertBefore(expandBtn, simContainer);
                }

                // If the section title (and potentially its wrapper with action buttons) is inside the simulator card,
                // move the whole header group outside above the Expand button for better mobile layout.
                // Skip header extraction if innerHeaderSelector is null (for Lab 11 consistency)
                if (innerHeaderSelector) {
                    var innerHeader = simContainer.querySelector(innerHeaderSelector);
                    if (innerHeader && simContainer.parentNode) {
                        var headerWrapper = innerHeader.parentElement;
                        var shouldMoveWrapper = false;
                        // Move the wrapper instead of only the title when:
                        // - The wrapper is a direct child of the simulator container, and
                        // - The wrapper contains any interactive button (e.g., Logic Design button)
                        if (headerWrapper && headerWrapper.parentElement === simContainer) {
                            var hasActionButton = !!headerWrapper.querySelector('button');
                            shouldMoveWrapper = hasActionButton;
                        }
                        var nodeToMove = shouldMoveWrapper ? headerWrapper : innerHeader;
                        // Only move if the node currently lives inside the simulator container
                        if (nodeToMove && nodeToMove.parentNode && nodeToMove.parentNode === (shouldMoveWrapper ? simContainer : simContainer)) {
                            simContainer.parentNode.insertBefore(nodeToMove, expandBtn);
                        }
                    }
                }

                var placeholder = document.createElement('div');
                placeholder.style.height = simContainer.offsetHeight + 'px';
                placeholder.style.display = 'none';

                var currentModal = null;

                function createModal(content){
                    var overlay = document.createElement('div');
                    overlay.className = 'modal-overlay show';
                    overlay.style.zIndex = '1000';

                    var container = document.createElement('div');
                    container.className = 'modal-container';
                    container.setAttribute('role','dialog');
                    container.setAttribute('aria-modal','true');
                    container.style.maxWidth = '98vw';
                    container.style.width = '98vw';
                    container.style.zIndex = '1001';

                    var header = document.createElement('div');
                    header.className = 'modal-header';
                    var h = document.createElement('h3');
                    h.textContent = modalTitle;
                    var close = document.createElement('button');
                    close.className = 'modal-close';
                    close.setAttribute('aria-label','Close');
                    close.innerHTML = '&times;';
                    header.appendChild(h);
                    header.appendChild(close);

                    var body = document.createElement('div');
                    body.className = 'modal-content';
                    body.appendChild(content);

                    var wrapper = document.createElement('div');
                    wrapper.className = 'answer-modal';
                    wrapper.style.display = 'flex';
                    wrapper.setAttribute('aria-hidden','false');
                    wrapper.appendChild(overlay);
                    wrapper.appendChild(container);
                    container.appendChild(header);
                    container.appendChild(body);

                    function closeModal(){
                        wrapper.style.display = 'none';
                        wrapper.setAttribute('aria-hidden','true');
                        if (placeholder && content) placeholder.replaceWith(content);
                        document.body.style.overflow = '';
                        expandBtn && expandBtn.focus();
                        wrapper.remove();
                        currentModal = null;
                    }

                    overlay.addEventListener('click', closeModal);
                    close.addEventListener('click', closeModal);
                    document.addEventListener('keydown', function onKey(e){
                        if (e.key==='Escape'){
                            document.removeEventListener('keydown', onKey);
                            closeModal();
                        }
                    });

                    document.body.appendChild(wrapper);
                    document.body.style.overflow = 'hidden';

                    return { wrapper: wrapper, closeModal: closeModal };
                }

                expandBtn.addEventListener('click', function(){
                    if (!isMobileWidth()) return;
                    placeholder.style.height = simContainer.offsetHeight + 'px';
                    placeholder.style.display = 'block';
                    if (simContainer.parentNode) simContainer.parentNode.replaceChild(placeholder, simContainer);
                    currentModal = createModal(simContainer);
                });

                function adapt(){
                    var mobile = isMobileWidth();
                    expandBtn.style.display = mobile ? 'inline-flex' : 'none';
                    if (!mobile && currentModal && currentModal.wrapper && currentModal.wrapper.style.display==='flex'){
                        currentModal.closeModal();
                    }
                }
                window.addEventListener('resize', adapt, { passive: true });
                window.addEventListener('orientationchange', adapt);
                adapt();
            } catch (_) {}
        });
    }

    // expose globally
    window.attachSimulatorExpand = attachSimulatorExpand;
})();


