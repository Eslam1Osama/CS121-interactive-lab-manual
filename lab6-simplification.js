/**
 * Lab 6 Simplification Functionality
 * 
 * This file handles the rich text editor for Lab 6's simplification question,
 * including toolbar functionality, answer comparison modal, and copy-to-clipboard.
 * 
 * Features:
 * - Rich text editor with comprehensive toolbar
 * - Modal system for answer comparison
 * - Copy to clipboard functionality
 * - Accessibility features
 * - Keyboard shortcuts for all formatting options
 */

document.addEventListener('DOMContentLoaded', function() {
    // Editor Elements
    const editor = document.getElementById('simplification-editor-lab6');
    const toolbar = document.querySelector('#lab6 .editor-toolbar');
    
    // Modal Elements
    const modal = document.getElementById('answer-modal-lab6-simplification');
    const showAnswerBtn = document.getElementById('show-answer-btn-lab6-simplification');
    const closeModalBtn = document.getElementById('close-modal-lab6-simplification');
    const closeModalFooterBtn = document.getElementById('close-modal-footer-lab6-simplification');
    const copyAnswerBtn = document.getElementById('copy-answer-btn-lab6-simplification');
    const userAnswerDisplay = document.getElementById('user-answer-display-lab6-simplification');
    
    // Ensure modal starts in correct state
    if (modal) {
        modal.setAttribute('aria-hidden', 'true');
        modal.style.display = 'none';
    }
    
    // Rich Text Editor Toolbar Functionality
    if (toolbar && editor) {
        toolbar.addEventListener('click', function(e) {
            const button = e.target.closest('.toolbar-btn');
            if (button) {
                e.preventDefault();
                const command = button.dataset.command;
                const text = button.dataset.text;
                
                // Ensure editor has focus for command execution
                if (document.activeElement !== editor) {
                    editor.focus();
                }
                
                // Handle special commands
                if (command === 'insertText' && text) {
                    document.execCommand('insertText', false, text);
                } else {
                    // Execute the command regardless of current selection
                    document.execCommand(command, false, null);
                }
                
                // Sync button states after command execution
                setTimeout(syncButtonStates, 10);
            }
        });
        
        // Keyboard shortcuts for all formatting options
        editor.addEventListener('keydown', function(e) {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                switch (e.key.toLowerCase()) {
                    case 'b':
                        document.execCommand('bold', false, null);
                        break;
                    case 'i':
                        document.execCommand('italic', false, null);
                        break;
                    case 'u':
                        document.execCommand('underline', false, null);
                        break;
                    case 's':
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
                        document.execCommand('redo', false, null);
                        break;
                    case 'a':
                        document.execCommand('selectAll', false, null);
                        break;
                    case 'l':
                        if (e.shiftKey) {
                            document.execCommand('insertUnorderedList', false, null);
                        } else {
                            document.execCommand('justifyLeft', false, null);
                        }
                        break;
                    case 'o':
                        if (e.shiftKey) {
                            document.execCommand('insertOrderedList', false, null);
                        }
                        break;
                    case 'c':
                        if (e.shiftKey) {
                            document.execCommand('justifyCenter', false, null);
                        }
                        break;
                    case 'r':
                        if (e.shiftKey) {
                            document.execCommand('justifyRight', false, null);
                        }
                        break;
                    case 'f':
                        if (e.shiftKey) {
                            document.execCommand('removeFormat', false, null);
                        }
                        break;
                }
                setTimeout(syncButtonStates, 10);
            }
        });
        
        // Optimized event handling for button state synchronization
        let syncTimeout;
        
        // Debounced sync function to prevent excessive calls
        function debouncedSync() {
            clearTimeout(syncTimeout);
            syncTimeout = setTimeout(syncButtonStates, 50);
        }
        
        // Core events that need immediate sync
        editor.addEventListener('input', function() {
            debouncedSync();
        });
        
        editor.addEventListener('focus', function() {
            syncButtonStates();
        });
        
        // Selection and navigation events
        editor.addEventListener('selectionchange', function() {
            debouncedSync();
        });
        
        editor.addEventListener('mouseup', function() {
            debouncedSync();
        });
        
        // Content modification events
        editor.addEventListener('paste', function() {
            setTimeout(syncButtonStates, 10);
        });
        
        editor.addEventListener('drop', function() {
            setTimeout(syncButtonStates, 10);
        });
    }
    
    // Function to sync button states with editor content
    function syncButtonStates() {
        if (!toolbar || !editor) return;
        
        try {
            // First, clear all active states to prevent conflicts
            toolbar.querySelectorAll('.toolbar-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Check if editor has focus (but don't require selection)
            const isEditorFocused = document.activeElement === editor;
            
            // Update states if editor has focus (selection not required)
            if (isEditorFocused) {
                const boldBtn = toolbar.querySelector('[data-command="bold"]');
                const italicBtn = toolbar.querySelector('[data-command="italic"]');
                const underlineBtn = toolbar.querySelector('[data-command="underline"]');
                const strikeBtn = toolbar.querySelector('[data-command="strikeThrough"]');
                const subscriptBtn = toolbar.querySelector('[data-command="subscript"]');
                const superscriptBtn = toolbar.querySelector('[data-command="superscript"]');
                
                // Check each command state individually and update buttons
                if (boldBtn && document.queryCommandState('bold')) {
                    boldBtn.classList.add('active');
                }
                
                if (italicBtn && document.queryCommandState('italic')) {
                    italicBtn.classList.add('active');
                }
                
                if (underlineBtn && document.queryCommandState('underline')) {
                    underlineBtn.classList.add('active');
                }
                
                if (strikeBtn && document.queryCommandState('strikeThrough')) {
                    strikeBtn.classList.add('active');
                }
                
                if (subscriptBtn && document.queryCommandState('subscript')) {
                    subscriptBtn.classList.add('active');
                }
                
                if (superscriptBtn && document.queryCommandState('superscript')) {
                    superscriptBtn.classList.add('active');
                }
            }
        } catch (error) {
            // Fallback: remove all active states if there's an error
            console.warn('Error syncing button states:', error);
            if (toolbar) {
                toolbar.querySelectorAll('.toolbar-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
            }
        }
    }
    
    // Show Answer Modal
    if (showAnswerBtn) {
        showAnswerBtn.addEventListener('click', function() {
            // Capture user's answer
            if (userAnswerDisplay && editor) {
                const userAnswer = editor.innerHTML.trim();
                if (userAnswer) {
                    userAnswerDisplay.innerHTML = userAnswer;
                } else {
                    userAnswerDisplay.innerHTML = '<em>No answer provided</em>';
                }
            }
            
            // Show modal
            if (modal) {
                modal.style.display = 'flex';
                modal.setAttribute('aria-hidden', 'false');
                modal.setAttribute('aria-modal', 'true');
                document.body.style.overflow = 'hidden';
                
                // Focus the first focusable element in the modal
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
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
            modal.removeAttribute('aria-modal');
            document.body.style.overflow = '';
            
            // Return focus to the show answer button
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
        
        // Close modal on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
                closeModal();
            }
        });
        
        // Focus trapping within the modal
        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Tab' && modal.style.display === 'flex') {
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
            const correctAnswer = document.getElementById('correct-answer-display-lab6-simplification');
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
    
    // Validate editor configuration on load
    function validateEditor() {
        if (!toolbar || !editor) {
            console.warn('Lab 6: Toolbar or editor not found');
            return false;
        }
        
        const requiredButtons = ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript'];
        const missingButtons = [];
        
        requiredButtons.forEach(cmd => {
            if (!toolbar.querySelector(`[data-command="${cmd}"]`)) {
                missingButtons.push(cmd);
            }
        });
        
        if (missingButtons.length > 0) {
            console.warn(`Lab 6: Missing buttons: ${missingButtons.join(', ')}`);
            return false;
        }
        
        return true;
    }
    
    // Validate editor configuration on load
    validateEditor();
});
