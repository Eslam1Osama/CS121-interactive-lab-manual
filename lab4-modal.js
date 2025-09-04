/**
 * Lab 4 Simplification Modal Functionality
 * 
 * This file contains all the modal logic for Lab 4's simplification question,
 * including rich text editor functionality and answer comparison modal.
 * 
 * Features:
 * - Rich text editor with toolbar
 * - Modal system for answer comparison
 * - Copy to clipboard functionality
 * - Keyboard shortcuts support
 * - Accessibility features
 */

// Rich Editor and Modal Functionality for Lab 4
(function(){
function initLab4Modal(){
    // Rich Editor Functionality
    let editor = document.getElementById('simplification-editor-lab4');
    let toolbar = document.querySelector('#lab4 .editor-toolbar');
    
    // Retry mechanism if elements are not found immediately
    if (!editor || !toolbar) {
        setTimeout(() => {
            editor = document.getElementById('simplification-editor-lab4');
            toolbar = document.querySelector('#lab4 .editor-toolbar');
            
            if (editor && toolbar) {
                initializeLab4Editor();
            }
        }, 100);
        return;
    }
    
    function initializeLab4Editor() {
        // Toolbar button functionality
        toolbar.addEventListener('click', function(e) {
            // Find the closest toolbar button (handles event delegation)
            const button = e.target.closest('.toolbar-btn');
            if (button) {
                e.preventDefault();
                const command = button.dataset.command;
                const text = button.dataset.text;
                
                // Handle special commands
                if (command === 'insertText' && text) {
                    document.execCommand('insertText', false, text);
                } else if (command === 'undo') {
                    document.execCommand('undo', false, null);
                } else if (command === 'redo') {
                    document.execCommand('redo', false, null);
                } else if (command === 'selectAll') {
                    document.execCommand('selectAll', false, null);
                } else if (command === 'removeFormat') {
                    document.execCommand('removeFormat', false, null);
                } else if (command === 'justifyLeft' || command === 'justifyCenter' || command === 'justifyRight') {
                    document.execCommand(command, false, null);
                } else {
                    document.execCommand(command, false, null);
                }
                
                // Handle active states for toggle buttons
                if (['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript'].includes(command)) {
                    button.classList.toggle('active');
                } else if (['justifyLeft', 'justifyCenter', 'justifyRight'].includes(command)) {
                    // Remove active from all alignment buttons
                    toolbar.querySelectorAll('[data-command^="justify"]').forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                } else {
                    // Remove active from all buttons
                    toolbar.querySelectorAll('.toolbar-btn').forEach(btn => btn.classList.remove('active'));
                }
                
                // Focus back to editor
                editor.focus();
            }
        });
        
        // Keyboard shortcuts
        editor.addEventListener('keydown', function(e) {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'b':
                        e.preventDefault();
                        document.execCommand('bold', false, null);
                        break;
                    case 'i':
                        e.preventDefault();
                        document.execCommand('italic', false, null);
                        break;
                    case 'u':
                        e.preventDefault();
                        document.execCommand('underline', false, null);
                        break;
                    case 's':
                        e.preventDefault();
                        document.execCommand('strikeThrough', false, null);
                        break;
                    case 'z':
                        if (e.shiftKey) {
                            document.execCommand('redo', false, null);
                        } else {
                            document.execCommand('undo', false, null);
                        }
                        break;
                    case 'y':
                        e.preventDefault();
                        document.execCommand('redo', false, null);
                        break;
                    case 'a':
                        e.preventDefault();
                        document.execCommand('selectAll', false, null);
                        break;
                }
            } else if (e.ctrlKey && e.shiftKey) {
                switch(e.key) {
                    case 'S':
                        e.preventDefault();
                        document.execCommand('subscript', false, null);
                        break;
                    case 'P':
                        e.preventDefault();
                        document.execCommand('superscript', false, null);
                        break;
                    case 'L':
                        e.preventDefault();
                        document.execCommand('insertUnorderedList', false, null);
                        break;
                    case 'O':
                        e.preventDefault();
                        document.execCommand('insertOrderedList', false, null);
                        break;
                    case 'F':
                        e.preventDefault();
                        document.execCommand('removeFormat', false, null);
                        break;
                }
            }
        });
    }
    
    // Call the initialization function
    initializeLab4Editor();
    
    // Modal Functionality
    const modal = document.getElementById('answer-modal-lab4');
    const showAnswerBtn = document.getElementById('show-answer-btn-lab4');
    const closeModalBtn = document.getElementById('close-modal-lab4');
    const closeModalFooterBtn = document.getElementById('close-modal-footer-lab4');
    const copyAnswerBtn = document.getElementById('copy-answer-btn-lab4');
    const userAnswerDisplay = document.getElementById('user-answer-display-lab4');
    
    function openModal() {
        if (modal && editor) {
            // Display user's answer
            userAnswerDisplay.innerHTML = editor.innerHTML || '<em>No answer provided</em>';
            
            // Show modal
            modal.classList.add('show');
            modal.setAttribute('aria-hidden', 'false');
            modal.setAttribute('aria-modal', 'true');
            document.body.style.overflow = 'hidden';
            
            // Focus management
            closeModalBtn.focus();
        }
    }
    
    function closeModal() {
        if (modal) {
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
            modal.removeAttribute('aria-modal');
            document.body.style.overflow = '';
            showAnswerBtn.focus();
        }
    }
    
    // Event listeners
    if (showAnswerBtn) {
        showAnswerBtn.addEventListener('click', openModal);
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (closeModalFooterBtn) {
        closeModalFooterBtn.addEventListener('click', closeModal);
    }
    
    // Close modal on overlay click
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Close modal on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
                closeModal();
            }
        });
    }
    
    // Copy answer functionality
    if (copyAnswerBtn) {
        copyAnswerBtn.addEventListener('click', function() {
            const correctAnswer = document.getElementById('correct-answer-display-lab4').textContent;
            navigator.clipboard.writeText(correctAnswer).then(function() {
                const originalText = copyAnswerBtn.innerHTML;
                copyAnswerBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                copyAnswerBtn.style.background = '#27ae60';
                
                setTimeout(() => {
                    copyAnswerBtn.innerHTML = originalText;
                    copyAnswerBtn.style.background = '';
                }, 2000);
            }).catch(function() {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = correctAnswer;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                const originalText = copyAnswerBtn.innerHTML;
                copyAnswerBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                copyAnswerBtn.style.background = '#27ae60';
                
                setTimeout(() => {
                    copyAnswerBtn.innerHTML = originalText;
                    copyAnswerBtn.style.background = '';
                }, 2000);
            });
        });
    }
}

if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initLab4Modal);
} else {
    initLab4Modal();
}
})();
