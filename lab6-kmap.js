/**
 * Lab 6 K-Map Functionality
 * 
 * This file handles the interactive K-Map for Lab 6's simplification question,
 * including K-Map input handling, simple text editor, and answer comparison modal.
 * 
 * Features:
 * - Interactive 4x4 K-Map with input validation
 * - Simple text editor for simplified expression
 * - Modal system for answer comparison
 * - Copy to clipboard functionality
 * - Accessibility features
 */

function initLab6KMap() {
    // K-Map Elements
    const kMapInputs = document.querySelectorAll('#k-map-lab6 .k-map-input');
    const fillKMapBtn = document.getElementById('fill-kmap-btn-lab6');
    const clearKMapBtn = document.getElementById('clear-kmap-btn-lab6');
    
    // Simple Editor Elements
    const simpleEditor = document.getElementById('kmap-simplification-editor-lab6');
    const simpleToolbar = document.getElementById('lab6-simple-editor-toolbar');
    
    // Modal Elements
    const kmapModal = document.getElementById('kmap-answer-modal-lab6');
    const showKMapAnswerBtn = document.getElementById('show-kmap-answer-btn-lab6');
    const closeKMapModalBtn = document.getElementById('close-kmap-modal-lab6');
    const closeKMapModalFooterBtn = document.getElementById('close-kmap-modal-footer-lab6');
    const copyKMapAnswerBtn = document.getElementById('copy-kmap-answer-btn-lab6');
    const userKMapDisplay = document.getElementById('user-kmap-display-lab6');
    const userExpressionDisplay = document.getElementById('user-expression-display-lab6');
    
    // Correct K-Map values for Lab 6 function F(A,B,C,D) = Σ(1,3,5,7,9,15) with don't care d(A,B,C,D) = Σ(4,6,12,13)
    // K-Map structure: Rows: CD(11), CD'(10), C'D'(00), C'D(01) | Columns: AB(11), AB'(10), A'B'(00), A'B(01)
    // Minterms: 1(0001), 3(0011), 5(0101), 7(0111), 9(1001), 15(1111)
    // Don't cares: 4(0100), 6(0110), 12(1100), 13(1101) - 13 converted to 1, others to 0
    // Current K-Map display: CD row [1,0,1,1], CD' row [0,0,0,0], C'D' row [0,0,0,0], C'D row [1,1,1,1]
    const correctKMapValues = [
        [1, 0, 1, 1], // CD row: AB, AB', A'B', A'B (minterms 15, 3, 7)
        [0, 0, 0, 0], // CD' row: AB, AB', A'B', A'B (don't care 6)
        [0, 0, 0, 0], // C'D' row: AB, AB', A'B', A'B (don't cares 4, 12)
        [1, 1, 1, 1]  // C'D row: AB, AB', A'B', A'B (minterms 1, 5, 9, don't care 13)
    ];
    
    // Don't care positions (4,6,12,13) mapped to K-Map coordinates
    const dontCarePositions = [
        [1, 2], // CD'-A'B (0110) = position 6
        [2, 2], // C'D'-A'B (0100) = position 4
        [2, 0], // C'D'-AB (1100) = position 12
        [3, 0]  // C'D-AB (1101) = position 13
    ];
    
    // Ensure modal starts in correct state
    if (kmapModal) {
        kmapModal.setAttribute('aria-hidden', 'true');
    }
    
    // K-Map Input Handling
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
            console.warn('Lab 6: Toolbar or editor not found');
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
            console.warn(`Lab 6: Missing buttons: ${missingButtons.join(', ')}`);
            return false;
        }
        
        return true;
    }
    
    // Show K-Map Answer Modal
    if (showKMapAnswerBtn) {
        showKMapAnswerBtn.addEventListener('click', function() {
            showKMapAnswerModal();
        });
    }
    
    // Close Modal Buttons
    if (closeKMapModalBtn) {
        closeKMapModalBtn.addEventListener('click', function() {
            closeKMapModal();
        });
    }
    
    if (closeKMapModalFooterBtn) {
        closeKMapModalFooterBtn.addEventListener('click', function() {
            closeKMapModal();
        });
    }
    
    // Copy Answer Button
    if (copyKMapAnswerBtn) {
        copyKMapAnswerBtn.addEventListener('click', function() {
            copyKMapAnswer();
        });
    }
    
    // Close modal when clicking overlay
    if (kmapModal) {
        kmapModal.addEventListener('click', function(e) {
            if (e.target === kmapModal) {
                closeKMapModal();
            }
        });
    }
    
    // Keyboard navigation for modal (Escape key to close)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && kmapModal && kmapModal.style.display === 'flex') {
            closeKMapModal();
        }
    });
    
    // Functions
    function validateKMapInput(input) {
        const value = input.value.toLowerCase();
        const row = parseInt(input.dataset.row);
        const col = parseInt(input.dataset.col);
        
        // Check if this is a don't care position
        const isDontCare = dontCarePositions.some(pos => pos[0] === row && pos[1] === col);
        
        if (value === '') {
            input.classList.remove('correct', 'incorrect');
            input.style.borderColor = 'var(--border)';
        } else if (value === '1' || value === '0' || value === 'x') {
            input.classList.remove('incorrect');
            input.classList.add('correct');
            input.style.borderColor = '#2ecc71';
        } else {
            input.classList.remove('correct');
            input.classList.add('incorrect');
            input.style.borderColor = '#e74c3c';
            input.value = value.slice(-1); // Keep only last character
        }
    }
    
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
    
    function getKMapInput(row, col) {
        if (row < 0 || row > 3 || col < 0 || col > 3) return null;
        return document.querySelector(`#k-map-lab6 .k-map-input[data-row="${row}"][data-col="${col}"]`);
    }
    
    function getNextKMapInput(row, col) {
        if (col < 3) {
            return getKMapInput(row, col + 1);
        } else if (row < 3) {
            return getKMapInput(row + 1, 0);
        }
        return null;
    }
    
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
    
    function clearKMap() {
        kMapInputs.forEach(input => {
            input.value = '';
            input.classList.remove('correct', 'incorrect', 'empty');
        });
    }
    
    function showKMapAnswerModal() {
        if (!kmapModal) return;
        
        // Get user's K-Map values
        const userKMapValues = [];
        for (let row = 0; row < 4; row++) {
            const rowValues = [];
            for (let col = 0; col < 4; col++) {
                const input = getKMapInput(row, col);
                rowValues.push(input ? input.value || '—' : '—');
            }
            userKMapValues.push(rowValues);
        }
        
        // Display user's K-Map values
        if (userKMapDisplay) {
            userKMapDisplay.innerHTML = createKMapDisplayHTML(userKMapValues);
        }
        
        // Display user's expression
        if (userExpressionDisplay && simpleEditor) {
            userExpressionDisplay.innerHTML = simpleEditor.innerHTML || '<em>No expression entered</em>';
        }
        
        // Show modal
        kmapModal.setAttribute('aria-hidden', 'false');
        kmapModal.style.display = 'flex';
        
        // Focus management
        const firstFocusable = kmapModal.querySelector('button, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) firstFocusable.focus();
        
        // Trap focus
        trapFocus(kmapModal);
    }
    
    function createKMapDisplayHTML(values) {
        const headers = ['', 'AB', 'AB\'', 'A\'B\'', 'A\'B'];
        const rowLabels = ['CD', 'CD\'', 'C\'D\'', 'C\'D'];
        
        let html = '<div class="kmap-grid-display">';
        
        // Add header row with column labels
        html += '<div class="kmap-row">';
        for (let j = 0; j < 5; j++) {
            html += `<div class="kmap-header-cell">${headers[j]}</div>`;
        }
        html += '</div>';
        
        // Add data rows
        for (let i = 0; i < 4; i++) {
            html += '<div class="kmap-row">';
            html += `<div class="kmap-header-cell">${rowLabels[i]}</div>`;
            for (let j = 0; j < 4; j++) {
                const value = values[i][j];
                html += `<div class="kmap-cell">${value}</div>`;
            }
            html += '</div>';
        }
        
        html += '</div>';
        return html;
    }
    
    function closeKMapModal() {
        if (!kmapModal) return;
        
        kmapModal.setAttribute('aria-hidden', 'true');
        kmapModal.style.display = 'none';
        
        // Restore focus to show answer button
        if (showKMapAnswerBtn) {
            showKMapAnswerBtn.focus();
        }
    }
    
    function copyKMapAnswer() {
        const answerText = 'F = A\'D + C\'D + BD = D(A\' + C\' + B)';
        
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(answerText).then(() => {
                // Show success feedback
                const originalText = copyKMapAnswerBtn.innerHTML;
                copyKMapAnswerBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                copyKMapAnswerBtn.style.backgroundColor = '#2ecc71';
                
                setTimeout(() => {
                    copyKMapAnswerBtn.innerHTML = originalText;
                    copyKMapAnswerBtn.style.backgroundColor = '';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = answerText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            // Show success feedback
            const originalText = copyKMapAnswerBtn.innerHTML;
            copyKMapAnswerBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                copyKMapAnswerBtn.style.backgroundColor = '#2ecc71';
            
            setTimeout(() => {
                copyKMapAnswerBtn.innerHTML = originalText;
                copyKMapAnswerBtn.style.backgroundColor = '';
            }, 2000);
        }
    }
    
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }
    
    // Validate toolbar configuration on load
    validateToolbar();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLab6KMap);
} else {
    initLab6KMap();
}
