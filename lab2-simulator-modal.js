/**
 * Lab 2: Logic Gate Simulator - Mobile Modal
 * Mirrors Lab 1 modal behavior: an Expand control on mobile opens the simulator full-width in a centered modal.
 * The section header remains outside (unchanged), only the simulator container moves into the modal.
 */
(function(){
  'use strict';

  function isMobileWidth(){
    return window.matchMedia('(max-width: 700px)').matches;
  }

  function createModal(content){
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
    const title = document.createElement('h3');
    title.textContent = 'Logic Gate Simulator';
    const close = document.createElement('button');
    close.className = 'modal-close';
    close.setAttribute('aria-label','Close');
    close.innerHTML = '&times;';
    header.appendChild(title);
    header.appendChild(close);

    const body = document.createElement('div');
    body.className = 'modal-content';
    body.appendChild(content);

    const wrapper = document.createElement('div');
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

    return { wrapper, closeModal };
  }

  let expandBtn, placeholder, currentModal = null;

  function init(){
    const lab2 = document.getElementById('lab2');
    if (!lab2) return;
    // The simulator container used across labs
    const sim = lab2.querySelector('.simulator-container');
    if (!sim) return;

    // Add an Expand control on mobile right above the simulator container
    expandBtn = document.createElement('button');
    expandBtn.type = 'button';
    expandBtn.className = 'btn btn-info';
    expandBtn.style.alignSelf = 'flex-end';
    expandBtn.style.marginBottom = '0.75rem';
    expandBtn.innerHTML = '<i class="fas fa-expand"></i> Expand';
    sim.parentNode.insertBefore(expandBtn, sim);

    // Move the section header outside the white container and above the Expand button
    var innerHeader = sim.querySelector('.section-title');
    if (innerHeader && innerHeader.parentNode === sim) {
      sim.parentNode.insertBefore(innerHeader, expandBtn);
    }

    placeholder = document.createElement('div');
    placeholder.style.height = sim.offsetHeight + 'px';
    placeholder.style.display = 'none';

    expandBtn.addEventListener('click', function(){
      if (!isMobileWidth()) return;
      placeholder.style.height = sim.offsetHeight + 'px';
      placeholder.style.display = 'block';
      sim.parentNode.replaceChild(placeholder, sim);
      currentModal = createModal(sim);
    });

    function adapt(){
      const mobile = isMobileWidth();
      expandBtn.style.display = mobile ? 'inline-flex' : 'none';
      if (!mobile && currentModal && currentModal.wrapper && currentModal.wrapper.style.display==='flex'){
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


