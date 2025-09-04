/**
 * Lab 3: Boolean Expression Simulator - Mobile Modal
 * - Mirrors Lab 2 approach: header outside, Expand button above simulator, modal full-width on mobile.
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
    title.textContent = 'Boolean Expression Simulator';
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
    const lab3 = document.getElementById('lab3');
    if (!lab3) return;

    // Find the Lab 3 boolean simulator module
    const sim = lab3.querySelector('.boolean-sim-module.boolean-expr-sim');
    if (!sim) return;

    // Insert Expand button just before the simulator module
    expandBtn = document.createElement('button');
    expandBtn.type = 'button';
    expandBtn.className = 'btn btn-info';
    expandBtn.style.alignSelf = 'flex-end';
    expandBtn.style.marginBottom = '0.75rem';
    expandBtn.innerHTML = '<i class="fas fa-expand"></i> Expand';
    sim.parentNode.insertBefore(expandBtn, sim);

    // Move the inner header out of the white container to sit above the button
    const innerHeader = sim.querySelector('.section-title');
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


