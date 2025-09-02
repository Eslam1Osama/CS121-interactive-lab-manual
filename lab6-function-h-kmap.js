/**
 * Lab 6 Function H K-Map Functionality
 * 
 * This file handles the interactive K-Map for Lab 6's Function H,
 * including full keyboard navigation, input validation, fill/clear functionality, 
 * and answer comparison modal.
 * 
 * Features:
 * - Interactive 4x4 K-Map with full keyboard navigation (arrow keys, Tab/Enter)
 * - Input validation for 0, 1 values only
 * - Fill K-Map with correct values
 * - Clear K-Map functionality
 * - Answer comparison modal
 * - Copy to clipboard functionality
 * - Accessibility features
 * - Identical UI/UX to existing K-Map implementation
 */

document.addEventListener('DOMContentLoaded', function() {
    // K-Map Elements
    const kMap = document.getElementById('k-map-lab6-function-h');
    const kMapInputs = kMap.querySelectorAll('.k-map-input');
    const fillKMapBtn = document.getElementById('fill-kmap-btn-lab6-function-h');
    const clearKMapBtn = document.getElementById('clear-kmap-btn-lab6-function-h');
    
    // Simple Editor Elements
    const simpleEditor = document.getElementById('kmap-simplification-editor-lab6-function-h');
    const simpleToolbar = document.getElementById('lab6-function-h-simple-editor-toolbar');
    
    // Modal Elements
    const modal = document.getElementById('kmap-answer-modal-lab6-function-h');
    const showKMapAnswerBtn = document.getElementById('show-kmap-answer-btn-lab6-function-h');
    const closeModalBtn = document.getElementById('close-kmap-modal-lab6-function-h');
    const closeModalFooterBtn = document.getElementById('close-kmap-modal-footer-lab6-function-h');
    const copyKMapAnswerBtn = document.getElementById('copy-kmap-answer-btn-lab6-function-h');
    const userKMapDisplay = document.getElementById('user-kmap-display-lab6-function-h');
    const userExpressionDisplay = document.getElementById('user-expression-display-lab6-function-h');
    
    // Correct K-Map values for the function H = AB' + ABC + ABD' + A'CD' + A'BC'
    // Based on the minterms: {2, 4, 5, 6, 8, 9, 10, 11, 12, 14, 15}
    // K-Map structure: Columns: AB(11), AB'(10), A'B'(00), A'B(01) | Rows: CD(11), CD'(10), C'D'(00), C'D(01)
    const correctKMapValues = [
        [1, 1, 0, 0], // CD row (row 0): minterms 15, 11, 3, 7
        [1, 1, 0, 0], // CD' row (row 1): minterms 14, 10, 2, 6
        [1, 1, 1, 1], // C'D' row (row 2): minterms 12, 8, 0, 4
        [0, 1, 0, 1]  // C'D row (row 3): minterms 13, 9, 1, 5
    ];
    
    // Ensure modal starts in correct state
    if (modal) {
        modal.setAttribute('aria-hidden', 'true');
        modal.style.display = 'none';
    }
    
    // K-Map Input Handling with Full Keyboard Navigation
    if (kMapInputs.length > 0) {
        kMapInputs.forEach((input, index) => {
            const row = Math.floor(index / 4);
            const col = index % 4;
            
            // Add event listeners
            input.addEventListener('input', function() {
                validateKMapInput(this);
            });
            
            input.addEventListener('keydown', function(e) {
                handleKMapKeydown(e, this, row, col);
            });
            
            input.addEventListener('focus', function() {
                this.style.borderColor = 'var(--accent)';
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.style.borderColor = 'var(--border)';
                }
            });
        });
    }
    
    // Validate K-Map input
    function validateKMapInput(input) {
        const value = input.value;
        if (value !== '' && value !== '0' && value !== '1') {
            input.value = '';
            input.classList.add('invalid');
            setTimeout(() => {
                input.classList.remove('invalid');
            }, 1000);
        } else {
            input.classList.remove('invalid');
        }
    }
    
    // Handle keyboard navigation for K-Map inputs
    function handleKMapKeydown(e, input, row, col) {
        switch(e.key) {
            case 'Tab':
                e.preventDefault();
                const nextInput = getNextKMapInput(row, col);
                if (nextInput) nextInput.focus();
                break;
            case 'Enter':
                e.preventDefault();
                const nextRowInput = getNextKMapInput(row, col);
                if (nextRowInput) nextRowInput.focus();
                break;
            case 'ArrowUp':
                e.preventDefault();
                const upInput = getKMapInput(row - 1, col);
                if (upInput) upInput.focus();
                break;
            case 'ArrowDown':
                e.preventDefault();
                const downInput = getKMapInput(row + 1, col);
                if (downInput) downInput.focus();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                const leftInput = getKMapInput(row, col - 1);
                if (leftInput) leftInput.focus();
                break;
            case 'ArrowRight':
                e.preventDefault();
                const rightInput = getKMapInput(row, col + 1);
                if (rightInput) rightInput.focus();
                break;
        }
    }
    
    // Get K-Map input by row and column
    function getKMapInput(row, col) {
        if (row < 0 || row > 3 || col < 0 || col > 3) return null;
        return kMap.querySelector(`.k-map-input[data-row="${row}"][data-col="${col}"]`);
    }
    
    // Get next K-Map input for Tab/Enter navigation
    function getNextKMapInput(row, col) {
        if (col < 3) {
            return getKMapInput(row, col + 1);
        } else if (row < 3) {
            return getKMapInput(row + 1, 0);
        }
        return null;
    }
    
    // Fill K-Map with Correct Values
    if (fillKMapBtn) {
        fillKMapBtn.addEventListener('click', function() {
            fillKMapWithCorrectValues();
        });
    }
    
    // Clear K-Map
    if (clearKMapBtn) {
        clearKMapBtn.addEventListener('click', function() {
            clearKMap();
        });
    }
    
    // Fill K-Map with correct values
    function fillKMapWithCorrectValues() {
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
    }
    
    // Clear K-Map
    function clearKMap() {
        kMapInputs.forEach(input => {
            input.value = '';
            input.classList.remove('correct', 'incorrect', 'empty');
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
    
    // Execute command with error handling
    function executeCommand(command, value = null) {
        try {
            if (command === 'insertText' && value) {
                document.execCommand('insertText', false, value);
            } else {
                document.execCommand(command, false, null);
            }
        } catch (error) {
            console.warn(`Error executing command ${command}:`, error);
        }
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
    
    // Show K-Map Answer Modal
    if (showKMapAnswerBtn) {
        showKMapAnswerBtn.addEventListener('click', function() {
            // Capture user's K-Map values
            if (userKMapDisplay) {
                const userKMapHTML = createKMapDisplayHTML();
                userKMapDisplay.innerHTML = userKMapHTML;
            }
            
            // Capture user's expression
            if (userExpressionDisplay && simpleEditor) {
                const userExpression = simpleEditor.innerHTML.trim();
                if (userExpression) {
                    userExpressionDisplay.innerHTML = userExpression;
                } else {
                    userExpressionDisplay.innerHTML = '<em>No expression provided</em>';
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
    
    // Create K-Map display HTML for user's input
    function createKMapDisplayHTML() {
        let html = '<div class="kmap-grid-display">';
        
        // Header row
        html += '<div class="kmap-row">';
        html += '<div class="kmap-header-cell"></div>';
        html += '<div class="kmap-header-cell">AB</div>';
        html += '<div class="kmap-header-cell">AB\'</div>';
        html += '<div class="kmap-header-cell">A\'B\'</div>';
        html += '<div class="kmap-header-cell">A\'B</div>';
        html += '</div>';
        
        // Data rows
        const rowLabels = ['CD', 'CD\'', 'C\'D\'', 'C\'D'];
        rowLabels.forEach((label, rowIndex) => {
            html += '<div class="kmap-row">';
            html += `<div class="kmap-header-cell">${label}</div>`;
            
            for (let colIndex = 0; colIndex < 4; colIndex++) {
                const input = kMap.querySelector(`[data-row="${rowIndex}"][data-col="${colIndex}"]`);
                const value = input ? input.value : '';
                const isEmpty = value === '';
                const cellClass = isEmpty ? 'kmap-cell empty-display' : 'kmap-cell';
                const displayValue = isEmpty ? '—' : value;
                
                html += `<div class="${cellClass}">${displayValue}</div>`;
            }
            html += '</div>';
        });
        
        html += '</div>';
        return html;
    }
    
    // Close Modal Functions
    function closeModal() {
        if (modal) {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
            modal.removeAttribute('aria-modal');
            document.body.style.overflow = '';
            
            // Return focus to the show answer button
            if (showKMapAnswerBtn) {
                showKMapAnswerBtn.focus();
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
    if (copyKMapAnswerBtn) {
        copyKMapAnswerBtn.addEventListener('click', function() {
            const correctAnswer = document.getElementById('correct-expression-display-lab6-function-h');
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
    
    // Validate K-Map configuration on load
    function validateKMap() {
        if (!kMap || !simpleEditor) {
            console.warn('Lab 6 Function H K-Map: K-Map or editor not found');
            return false;
        }
        
        if (kMapInputs.length !== 16) {
            console.warn(`Lab 6 Function H K-Map: Expected 16 inputs, found ${kMapInputs.length}`);
            return false;
        }
        
        return true;
    }
    
    // Validate simple editor configuration on load
    function validateSimpleEditor() {
        if (!simpleToolbar || !simpleEditor) {
            console.warn('Lab 6 Function H K-Map: Toolbar or editor not found');
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
            console.warn(`Lab 6 Function H K-Map: Missing buttons: ${missingButtons.join(', ')}`);
            return false;
        }
        
        return true;
    }
    
    // Validate configurations on load
    validateKMap() && validateSimpleEditor();
});
