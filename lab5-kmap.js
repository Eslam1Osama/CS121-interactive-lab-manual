/**
 * Lab 5 K-Map Functionality
 * 
 * This file handles the interactive K-Map for Lab 5's simplification question,
 * including K-Map input handling, simple text editor, and answer comparison modal.
 * 
 * Features:
 * - Interactive 4x4 K-Map with input validation
 * - Simple text editor for simplified expression
 * - Modal system for answer comparison
 * - Copy to clipboard functionality
 * - Accessibility features
 */

document.addEventListener('DOMContentLoaded', function() {
    // K-Map Elements
    const kMapInputs = document.querySelectorAll('#k-map-lab5 .k-map-input');
    const fillKMapBtn = document.getElementById('fill-kmap-btn-lab5');
    const clearKMapBtn = document.getElementById('clear-kmap-btn-lab5');
    
    // Simple Editor Elements
    const simpleEditor = document.getElementById('kmap-simplification-editor-lab5');
    const simpleToolbar = document.getElementById('lab5-simple-editor-toolbar');
    
    // Modal Elements
    const kmapModal = document.getElementById('kmap-answer-modal-lab5');
    const showKMapAnswerBtn = document.getElementById('show-kmap-answer-btn-lab5');
    const closeKMapModalBtn = document.getElementById('close-kmap-modal-lab5');
    const closeKMapModalFooterBtn = document.getElementById('close-kmap-modal-footer-lab5');
    const copyKMapAnswerBtn = document.getElementById('copy-kmap-answer-btn-lab5');
    const userKMapDisplay = document.getElementById('user-kmap-display-lab5');
    const userExpressionDisplay = document.getElementById('user-expression-display-lab5');
    
    // Correct K-Map values for 4-input majority encoder
    const correctKMapValues = [
        [1, 1, 0, 1], // CD row: AB, AB', A'B', A'B
        [1, 0, 0, 0], // CD' row: AB, AB', A'B', A'B
        [0, 0, 0, 0], // C'D' row: AB, AB', A'B', A'B
        [1, 0, 0, 0]  // C'D row: AB, AB', A'B', A'B
    ];
    
    // Ensure modal starts in correct state
    if (kmapModal) {
        kmapModal.setAttribute('aria-hidden', 'true');
        kmapModal.removeAttribute('aria-modal');
        kmapModal.style.display = 'none';
    }
    
    // K-Map Input Validation
    kMapInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            const value = e.target.value;
            if (value === '0' || value === '1') {
                e.target.classList.add('valid');
                e.target.classList.remove('invalid');
            } else if (value !== '') {
                e.target.classList.add('invalid');
                e.target.classList.remove('valid');
                e.target.value = '';
            }
        });
        
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === 'Tab') {
                e.preventDefault();
                const currentIndex = Array.from(kMapInputs).indexOf(this);
                const nextInput = kMapInputs[currentIndex + 1];
                if (nextInput) {
                    nextInput.focus();
                }
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                const currentIndex = Array.from(kMapInputs).indexOf(this);
                const currentRow = Math.floor(currentIndex / 4);
                const currentCol = currentIndex % 4;
                let targetIndex = currentIndex;
                
                switch (e.key) {
                    case 'ArrowUp':
                        if (currentRow > 0) {
                            targetIndex = currentIndex - 4;
                        }
                        break;
                    case 'ArrowDown':
                        if (currentRow < 3) {
                            targetIndex = currentIndex + 4;
                        }
                        break;
                    case 'ArrowLeft':
                        if (currentCol > 0) {
                            targetIndex = currentIndex - 1;
                        }
                        break;
                    case 'ArrowRight':
                        if (currentCol < 3) {
                            targetIndex = currentIndex + 1;
                        }
                        break;
                }
                
                if (targetIndex !== currentIndex && targetIndex >= 0 && targetIndex < kMapInputs.length) {
                    kMapInputs[targetIndex].focus();
                }
            }
        });
    });
    
    // Fill K-Map with Correct Values
    if (fillKMapBtn) {
        fillKMapBtn.addEventListener('click', function() {
            kMapInputs.forEach((input, index) => {
                const row = Math.floor(index / 4);
                const col = index % 4;
                const correctValue = correctKMapValues[row][col];
                const userValue = input.value.trim();
                
                // Clear previous styling
                input.classList.remove('correct', 'incorrect', 'empty');
                
                if (userValue === '') {
                    // Empty cell - show blue highlight
                    input.classList.add('empty');
                    input.value = correctValue;
                } else if (userValue === correctValue.toString()) {
                    // Correct answer - show green highlight
                    input.classList.add('correct');
                } else {
                    // Wrong answer - show red highlight
                    input.classList.add('incorrect');
                    input.value = correctValue;
                }
            });
        });
    }
    
    // Clear K-Map
    if (clearKMapBtn) {
        clearKMapBtn.addEventListener('click', function() {
            kMapInputs.forEach(input => {
                input.value = '';
                input.classList.remove('valid', 'invalid', 'correct', 'incorrect', 'empty');
            });
        });
    }
    
            // Simple Editor Toolbar Functionality
        if (simpleToolbar && simpleEditor) {
            simpleToolbar.addEventListener('click', function(e) {
                const button = e.target.closest('.toolbar-btn');
                if (button) {
                    e.preventDefault();
                    const command = button.dataset.command;
                    const text = button.dataset.text;
                    
                    // Ensure editor has focus for command execution
                    if (document.activeElement !== simpleEditor) {
                        simpleEditor.focus();
                    }
                    
                    // Handle special commands
                    if (command === 'insertText' && text) {
                        executeCommand('insertText', text);
                    } else {
                        // Execute the command regardless of current selection
                        executeCommand(command);
                    }
                    
                    // Sync button states after command execution
                    setTimeout(syncButtonStates, 10);
                }
            });
        
        // Keyboard shortcuts removed to prevent conflicts with system shortcuts
        // Users can use mouse clicks for all formatting options
        
        // Optimized event handling for button state synchronization
        let syncTimeout;
        
        // Debounced sync function to prevent excessive calls
        function debouncedSync() {
            clearTimeout(syncTimeout);
            syncTimeout = setTimeout(syncButtonStates, 50);
        }
        
        // Core events that need immediate sync
        simpleEditor.addEventListener('input', function() {
            debouncedSync();
        });
        
        simpleEditor.addEventListener('focus', function() {
            syncButtonStates();
        });
        
        // Selection and navigation events
        simpleEditor.addEventListener('selectionchange', function() {
            debouncedSync();
        });
        
        simpleEditor.addEventListener('mouseup', function() {
            debouncedSync();
        });
        
        // Content modification events
        simpleEditor.addEventListener('paste', function() {
            setTimeout(syncButtonStates, 10);
        });
        
        simpleEditor.addEventListener('drop', function() {
            setTimeout(syncButtonStates, 10);
        });
    }
    
    // Function to sync button states with editor content
    function syncButtonStates() {
        if (!simpleToolbar || !simpleEditor) return;
        
        try {
            // First, clear all active states to prevent conflicts
            simpleToolbar.querySelectorAll('.toolbar-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Check if editor has focus (but don't require selection)
            const isEditorFocused = document.activeElement === simpleEditor;
            
            // Update states if editor has focus (selection not required)
            if (isEditorFocused) {
                const boldBtn = simpleToolbar.querySelector('[data-command="bold"]');
                const italicBtn = simpleToolbar.querySelector('[data-command="italic"]');
                const superscriptBtn = simpleToolbar.querySelector('[data-command="superscript"]');
                
                // Check each command state individually and update buttons
                if (boldBtn && document.queryCommandState('bold')) {
                    boldBtn.classList.add('active');
                }
                
                if (italicBtn && document.queryCommandState('italic')) {
                    italicBtn.classList.add('active');
                }
                
                if (superscriptBtn && document.queryCommandState('superscript')) {
                    superscriptBtn.classList.add('active');
                }
            }
        } catch (error) {
            // Fallback: remove all active states if there's an error
            console.warn('Error syncing button states:', error);
            if (simpleToolbar) {
                simpleToolbar.querySelectorAll('.toolbar-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
            }
        }
    }
    
    // Enhanced button functionality with fallback
    function executeCommand(command, text = null) {
        try {
            if (command === 'insertText' && text) {
                document.execCommand('insertText', false, text);
            } else {
                document.execCommand(command, false, null);
            }
            return true;
        } catch (error) {
            console.warn(`Failed to execute command ${command}:`, error);
            return false;
        }
    }
    
    // Validate toolbar configuration
    function validateToolbar() {
        if (!simpleToolbar || !simpleEditor) {
            console.warn('Lab 5: Toolbar or editor not found');
            return false;
        }
        
        const requiredButtons = ['bold', 'italic', 'superscript'];
        const missingButtons = [];
        
        requiredButtons.forEach(cmd => {
            if (!simpleToolbar.querySelector(`[data-command="${cmd}"]`)) {
                missingButtons.push(cmd);
            }
        });
        
        if (missingButtons.length > 0) {
            console.warn(`Lab 5: Missing buttons: ${missingButtons.join(', ')}`);
            return false;
        }
        
        return true;
    }
    
    // Show K-Map Answer Modal
    if (showKMapAnswerBtn) {
        showKMapAnswerBtn.addEventListener('click', function() {
            // Capture user's K-Map values
            if (userKMapDisplay) {
                const kMapValues = Array.from(kMapInputs).map(input => input.value || '');
                const kMapGrid = [];
                for (let i = 0; i < 4; i++) {
                    kMapGrid.push(kMapValues.slice(i * 4, (i + 1) * 4));
                }
                
                let kMapHTML = '<div class="kmap-grid-display">';
                kMapHTML += '<div class="kmap-row">';
                kMapHTML += '<div class="kmap-header-cell">CD\\AB</div>';
                kMapHTML += '<div class="kmap-header-cell">AB</div>';
                kMapHTML += '<div class="kmap-header-cell">AB\'</div>';
                kMapHTML += '<div class="kmap-header-cell">A\'B\'</div>';
                kMapHTML += '<div class="kmap-header-cell">A\'B</div>';
                kMapHTML += '</div>';
                
                kMapHTML += '<div class="kmap-row">';
                kMapHTML += '<div class="kmap-header-cell">CD</div>';
                kMapHTML += '<div class="kmap-cell">' + (kMapGrid[0][0] || '—') + '</div>';
                kMapHTML += '<div class="kmap-cell">' + (kMapGrid[0][1] || '—') + '</div>';
                kMapHTML += '<div class="kmap-cell">' + (kMapGrid[0][2] || '—') + '</div>';
                kMapHTML += '<div class="kmap-cell">' + (kMapGrid[0][3] || '—') + '</div>';
                kMapHTML += '</div>';
                
                kMapHTML += '<div class="kmap-row">';
                kMapHTML += '<div class="kmap-header-cell">CD\'</div>';
                kMapHTML += '<div class="kmap-cell">' + (kMapGrid[1][0] || '—') + '</div>';
                kMapHTML += '<div class="kmap-cell">' + (kMapGrid[1][1] || '—') + '</div>';
                kMapHTML += '<div class="kmap-cell">' + (kMapGrid[1][2] || '—') + '</div>';
                kMapHTML += '<div class="kmap-cell">' + (kMapGrid[1][3] || '—') + '</div>';
                kMapHTML += '</div>';
                
                kMapHTML += '<div class="kmap-row">';
                kMapHTML += '<div class="kmap-header-cell">C\'D\'</div>';
                kMapHTML += '<div class="kmap-cell">' + (kMapGrid[2][0] || '—') + '</div>';
                kMapHTML += '<div class="kmap-cell">' + (kMapGrid[2][1] || '—') + '</div>';
                kMapHTML += '<div class="kmap-cell">' + (kMapGrid[2][2] || '—') + '</div>';
                kMapHTML += '<div class="kmap-cell">' + (kMapGrid[2][3] || '—') + '</div>';
                kMapHTML += '</div>';
                
                kMapHTML += '<div class="kmap-row">';
                kMapHTML += '<div class="kmap-header-cell">C\'D</div>';
                kMapHTML += '<div class="kmap-cell">' + (kMapGrid[3][0] || '—') + '</div>';
                kMapHTML += '<div class="kmap-cell">' + (kMapGrid[3][1] || '—') + '</div>';
                kMapHTML += '<div class="kmap-cell">' + (kMapGrid[3][2] || '—') + '</div>';
                kMapHTML += '<div class="kmap-cell">' + (kMapGrid[3][3] || '—') + '</div>';
                kMapHTML += '</div>';
                kMapHTML += '</div>';
                
                // Always show the K-Map structure, even when empty
                userKMapDisplay.innerHTML = kMapHTML;
            }
            
            // Capture user's simplified expression
            if (userExpressionDisplay && simpleEditor) {
                const userExpression = simpleEditor.innerHTML.trim();
                if (userExpression) {
                    userExpressionDisplay.innerHTML = userExpression;
                } else {
                    userExpressionDisplay.innerHTML = '<em>No expression provided</em>';
                }
            }
            
            // Show modal
            if (kmapModal) {
                kmapModal.style.display = 'flex';
                kmapModal.setAttribute('aria-hidden', 'false');
                kmapModal.setAttribute('aria-modal', 'true');
                document.body.style.overflow = 'hidden';
                
                // Focus the first focusable element in the modal
                const firstFocusableElement = kmapModal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                if (firstFocusableElement) {
                    firstFocusableElement.focus();
                }
            }
        });
    }
    
    // Close K-Map Modal Functions
    function closeKMapModal() {
        if (kmapModal) {
            kmapModal.style.display = 'none';
            kmapModal.setAttribute('aria-hidden', 'true');
            kmapModal.removeAttribute('aria-modal');
            document.body.style.overflow = '';
            
            // Return focus to the show answer button
            if (showKMapAnswerBtn) {
                showKMapAnswerBtn.focus();
            }
        }
    }
    
    if (closeKMapModalBtn) {
        closeKMapModalBtn.addEventListener('click', closeKMapModal);
    }
    
    if (closeKMapModalFooterBtn) {
        closeKMapModalFooterBtn.addEventListener('click', closeKMapModal);
    }
    
    // Close modal when clicking overlay
    if (kmapModal) {
        kmapModal.addEventListener('click', function(e) {
            if (e.target === kmapModal) {
                closeKMapModal();
            }
        });
        
        // Close modal on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && kmapModal && kmapModal.style.display === 'flex') {
                closeKMapModal();
            }
        });
        
        // Focus trapping within the modal
        kmapModal.addEventListener('keydown', function(e) {
            if (e.key === 'Tab' && kmapModal.style.display === 'flex') {
                const focusableElements = kmapModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
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
    
    // Copy K-Map Answer Functionality
    if (copyKMapAnswerBtn) {
        copyKMapAnswerBtn.addEventListener('click', function() {
            const correctAnswer = document.getElementById('correct-expression-display-lab5');
            if (correctAnswer) {
                const textToCopy = correctAnswer.textContent || correctAnswer.innerText;
                
                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(textToCopy).then(function() {
                        // Show success feedback
                        const originalText = copyKMapAnswerBtn.innerHTML;
                        copyKMapAnswerBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                        copyKMapAnswerBtn.style.backgroundColor = '#27ae60';
                        
                        setTimeout(function() {
                            copyKMapAnswerBtn.innerHTML = originalText;
                            copyKMapAnswerBtn.style.backgroundColor = '';
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
                const originalText = copyKMapAnswerBtn.innerHTML;
                copyKMapAnswerBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                copyKMapAnswerBtn.style.backgroundColor = '#27ae60';
                
                setTimeout(function() {
                    copyKMapAnswerBtn.innerHTML = originalText;
                    copyKMapAnswerBtn.style.backgroundColor = '';
                }, 2000);
            }
        } catch (err) {
            console.error('Fallback copy failed: ', err);
        }
        
        document.body.removeChild(textArea);
    }
    
    // Validate toolbar configuration on load
    validateToolbar();
});
