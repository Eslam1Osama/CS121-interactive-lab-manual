// Lab 5 Modal Functionality for Minterm Expression Question
// Handles rich text editor, modal display, and answer comparison

document.addEventListener('DOMContentLoaded', function() {
    // Rich Text Editor Functionality
    const editor = document.getElementById('simplification-editor-lab5');
    const toolbar = document.querySelector('#lab5 .editor-toolbar');
    
    if (toolbar) {
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
    }
    
    // Keyboard Shortcuts
    if (editor) {
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
    
    // Modal Functionality
    const showAnswerBtn = document.getElementById('show-answer-btn-lab5');
    const modal = document.getElementById('answer-modal-lab5');
    const closeModalBtn = document.getElementById('close-modal-lab5');
    const closeModalFooterBtn = document.getElementById('close-modal-footer-lab5');
    const copyAnswerBtn = document.getElementById('copy-answer-btn-lab5');
    const userAnswerDisplay = document.getElementById('user-answer-display-lab5');
    
    // Ensure modal starts in correct state
    if (modal) {
        modal.setAttribute('aria-hidden', 'true');
        modal.removeAttribute('aria-modal');
        modal.classList.remove('show');
    }
    
    // Show Modal
    if (showAnswerBtn) {
        showAnswerBtn.addEventListener('click', function() {
            // Capture user's answer
            if (editor && userAnswerDisplay) {
                const userAnswer = editor.innerHTML.trim();
                if (userAnswer) {
                    userAnswerDisplay.innerHTML = userAnswer;
                } else {
                    userAnswerDisplay.innerHTML = '<em>No answer provided yet.</em>';
                }
            }
            
            // Show modal
            if (modal) {
                modal.classList.add('show');
                modal.setAttribute('aria-hidden', 'false');
                modal.setAttribute('aria-modal', 'true');
                document.body.style.overflow = 'hidden';
                
                // Focus the first focusable element in the modal for better accessibility
                const firstFocusableElement = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                if (firstFocusableElement) {
                    firstFocusableElement.focus();
                }
            }
        });
    }
    
    // Close Modal Functions
    function closeModal() {
        if (modal) {
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
            modal.removeAttribute('aria-modal');
            document.body.style.overflow = '';
            
            // Return focus to the show answer button for better accessibility
            if (showAnswerBtn) {
                showAnswerBtn.focus();
            }
        }
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (closeModalFooterBtn) {
        closeModalFooterBtn.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking overlay
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
            closeModal();
        }
    });
    
    // Focus trapping within the modal
    if (modal) {
        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Tab' && modal.classList.contains('show')) {
                const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey) {
                    // Shift + Tab: going backwards
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    // Tab: going forwards
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }
    
    // Copy Answer Functionality
    if (copyAnswerBtn) {
        copyAnswerBtn.addEventListener('click', function() {
            const correctAnswer = document.getElementById('correct-answer-display-lab5');
            if (correctAnswer) {
                const textToCopy = correctAnswer.textContent || correctAnswer.innerText;
                
                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(textToCopy).then(function() {
                        // Show success feedback
                        const originalText = copyAnswerBtn.innerHTML;
                        copyAnswerBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                        copyAnswerBtn.style.backgroundColor = '#27ae60';
                        
                        setTimeout(function() {
                            copyAnswerBtn.innerHTML = originalText;
                            copyAnswerBtn.style.backgroundColor = '';
                        }, 2000);
                    }).catch(function(err) {
                        console.error('Failed to copy: ', err);
                        fallbackCopyTextToClipboard(textToCopy);
                    });
                } else {
                    fallbackCopyTextToClipboard(textToCopy);
                }
            }
        });
    }
    
    // Fallback copy function for older browsers
    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.position = 'fixed';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                const originalText = copyAnswerBtn.innerHTML;
                copyAnswerBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                copyAnswerBtn.style.backgroundColor = '#27ae60';
                
                setTimeout(function() {
                    copyAnswerBtn.innerHTML = originalText;
                    copyAnswerBtn.style.backgroundColor = '';
                }, 2000);
            }
        } catch (err) {
            console.error('Fallback copy failed: ', err);
        }
        
        document.body.removeChild(textArea);
    }
});
