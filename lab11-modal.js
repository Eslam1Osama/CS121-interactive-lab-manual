/**
 * Lab 11 MOD-7 Counter Simulator Modal Functionality
 * 
 * This file contains all the MOD-7 counter simulator logic for Lab 11's counter experiment,
 * including clock signal generation, JK Flip Flop simulation, 7-segment display, and LED outputs.
 * 
 * Features:
 * - Clock Signal Generator (100% same as Lab 10)
 * - 3-bit MOD-7 Counter (A, B, C inputs)
 * - 7-Segment Display for decimal output
 * - 3 LED outputs for binary representation
 * - JK Flip Flop Debug Logger
 * - Comprehensive tooltip system
 * - Accessibility features
 * - Modern UI interactions
 */

// MOD-7 Counter Simulator Functionality for Lab 11
// Initialize when script loads and DOM is ready
function initializeLab11WhenReady() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeLab11MOD7Counter);
    } else {
        // DOM is already ready, initialize immediately
        initializeLab11MOD7Counter();
    }
}

// Initialize the comprehensive MOD-7 counter simulator
initializeLab11WhenReady();

// Fallback initialization for dynamic loading
if (typeof window !== 'undefined') {
    window.initializeLab11MOD7Counter = initializeLab11MOD7Counter;
}

function initializeLab11MOD7Counter() {
    // Clock Signal Generator Elements (Lab 11)
    const clockFrequencyLab11 = document.getElementById('clockFrequencyLab11');
    const startClockBtnLab11 = document.getElementById('startClockBtnLab11');
    const stopClockBtnLab11 = document.getElementById('stopClockBtnLab11');
    const singlePulseBtnLab11 = document.getElementById('singlePulseBtnLab11');
    const resetCounterBtnLab11 = document.getElementById('resetCounterBtnLab11');
    const clockWaveformLab11 = document.getElementById('clockWaveformLab11');
    const clockSignalLab11 = document.getElementById('clockSignalLab11');
    const clockStateLab11 = document.getElementById('clockStateLab11');
    const clockEdgeLab11 = document.getElementById('clockEdgeLab11');
    
    // Check if essential elements exist
    if (!startClockBtnLab11 || !stopClockBtnLab11 || !singlePulseBtnLab11 || !resetCounterBtnLab11) {
        return;
    }
    
    // Counter Input Elements
    const counterA = document.getElementById('counterA');
    const counterB = document.getElementById('counterB');
    const counterC = document.getElementById('counterC');
    
    // Counter Display Elements
    const counterBinaryValue = document.getElementById('counterBinaryValue');
    const counterDecimalValue = document.getElementById('counterDecimalValue');
    
    // 7-Segment Display Elements
    const counterSegA = document.getElementById('counterSegA');
    const counterSegB = document.getElementById('counterSegB');
    const counterSegC = document.getElementById('counterSegC');
    const counterSegD = document.getElementById('counterSegD');
    const counterSegE = document.getElementById('counterSegE');
    const counterSegF = document.getElementById('counterSegF');
    const counterSegG = document.getElementById('counterSegG');
    
    // LED Output Elements
    const counterALed = document.getElementById('counterALed');
    const counterBLed = document.getElementById('counterBLed');
    const counterCLed = document.getElementById('counterCLed');
    const counterAState = document.getElementById('counterAState');
    const counterBState = document.getElementById('counterBState');
    const counterCState = document.getElementById('counterCState');
    
    // JK Debug Logger Elements
    const jkDebugJA = document.getElementById('jkDebugJA');
    const jkDebugKA = document.getElementById('jkDebugKA');
    const jkDebugQA = document.getElementById('jkDebugQA');
    const jkDebugQABar = document.getElementById('jkDebugQABar');
    const jkDebugJB = document.getElementById('jkDebugJB');
    const jkDebugKB = document.getElementById('jkDebugKB');
    const jkDebugQB = document.getElementById('jkDebugQB');
    const jkDebugQBBar = document.getElementById('jkDebugQBBar');
    const jkDebugJC = document.getElementById('jkDebugJC');
    const jkDebugKC = document.getElementById('jkDebugKC');
    const jkDebugQC = document.getElementById('jkDebugQC');
    const jkDebugQCBar = document.getElementById('jkDebugQCBar');
    
    // Clock Signal Generator State
    let clockInterval = null;
    let clockState = 'LOW';
    let clockPosition = 0;
    let isClockRunning = false;
    
    // Counter State
    let counterState = { A: 0, B: 0, C: 0 };
    let decimalValue = 0;
    
    // JK Flip Flop States
    let jkStates = {
        A: { J: 0, K: 0, Q: 0, QBar: 1 },
        B: { J: 0, K: 0, Q: 0, QBar: 1 },
        C: { J: 0, K: 0, Q: 0, QBar: 1 }
    };
    
    // 7-Segment Display Patterns (0-6)
    const sevenSegmentPatterns = {
        0: { A: 1, B: 1, C: 1, D: 1, E: 1, F: 1, G: 0 },
        1: { A: 0, B: 1, C: 1, D: 0, E: 0, F: 0, G: 0 },
        2: { A: 1, B: 1, C: 0, D: 1, E: 1, F: 0, G: 1 },
        3: { A: 1, B: 1, C: 1, D: 1, E: 0, F: 0, G: 1 },
        4: { A: 0, B: 1, C: 1, D: 0, E: 0, F: 1, G: 1 },
        5: { A: 1, B: 0, C: 1, D: 1, E: 0, F: 1, G: 1 },
        6: { A: 1, B: 0, C: 1, D: 1, E: 1, F: 1, G: 1 }
    };
    
    // Initialize Clock Signal Generator
    function initializeClockGenerator() {
        if (!startClockBtnLab11 || !stopClockBtnLab11 || !singlePulseBtnLab11 || !resetCounterBtnLab11) {
            return;
        }
        
        // Start Clock Button
        startClockBtnLab11.addEventListener('click', startClock);
        
        // Stop Clock Button
        stopClockBtnLab11.addEventListener('click', stopClock);
        
        // Single Pulse Button
        singlePulseBtnLab11.addEventListener('click', singlePulse);
        
        // Reset Counter Button
        resetCounterBtnLab11.addEventListener('click', resetCounter);
        
        // Frequency Change
        if (clockFrequencyLab11) {
            clockFrequencyLab11.addEventListener('change', updateClockFrequency);
        }
        
        // Initialize clock display
        updateClockDisplay();
    }
    
    // Clock Control Functions
    function startClock() {
        if (isClockRunning) return;
        
        isClockRunning = true;
        startClockBtnLab11.style.display = 'none';
        stopClockBtnLab11.style.display = 'inline-block';
        
        const frequency = parseFloat(clockFrequencyLab11.value);
        const interval = 1000 / (frequency * 2); // Half period for toggle
        
        clockInterval = setInterval(() => {
            clockState = clockState === 'LOW' ? 'HIGH' : 'LOW';
            updateClockDisplay();
            
            if (clockState === 'HIGH') {
                // Rising edge - trigger counter
                handleClockRisingEdge();
            }
        }, interval);
    }
    
    function stopClock() {
        if (!isClockRunning) return;
        
        isClockRunning = false;
        startClockBtnLab11.style.display = 'inline-block';
        stopClockBtnLab11.style.display = 'none';
        
        if (clockInterval) {
            clearInterval(clockInterval);
            clockInterval = null;
        }
    }
    
    function singlePulse() {
        if (isClockRunning) return;
        
        clockState = 'HIGH';
        updateClockDisplay();
        handleClockRisingEdge();
        
        setTimeout(() => {
            clockState = 'LOW';
            updateClockDisplay();
        }, 200);
    }
    
    function updateClockFrequency() {
        if (isClockRunning) {
            stopClock();
            startClock();
        }
    }
    
    function updateClockDisplay() {
        if (!clockStateLab11) return;
        
        clockStateLab11.textContent = clockState;
        
        if (clockSignalLab11) {
            if (clockState === 'HIGH') {
                clockSignalLab11.style.background = '#e74c3c';
                clockEdgeLab11.textContent = 'Rising Edge';
            } else {
                clockSignalLab11.style.background = '#3498db';
                clockEdgeLab11.textContent = 'Falling Edge';
            }
        }
    }
    
    // Counter Logic Functions
    function handleClockRisingEdge() {
        // Calculate next state based on MOD-7 counter logic
        const nextState = calculateNextState();
        
        // Update counter state
        counterState = nextState;
        
        // Update JK states
        updateJKStates();
        
        // Update displays
        updateCounterDisplays();
        updateSevenSegmentDisplay();
        updateLEDOutputs();
        updateJKDebugLogger();
    }
    
    function calculateNextState() {
        const currentDecimal = counterState.A * 4 + counterState.B * 2 + counterState.C;
        let nextDecimal = (currentDecimal + 1) % 7; // MOD-7 counter
        
        // Convert decimal back to binary
        return {
            A: Math.floor(nextDecimal / 4) % 2,
            B: Math.floor(nextDecimal / 2) % 2,
            C: nextDecimal % 2
        };
    }
    
    function updateJKStates() {
        // Calculate JK inputs based on current state and next state
        const currentDecimal = counterState.A * 4 + counterState.B * 2 + counterState.C;
        const nextDecimal = (currentDecimal + 1) % 7;
        
        // For MOD-7 counter, JK inputs are determined by the transition logic
        // This is a simplified implementation - in reality, these would come from external gates
        jkStates.A.J = (nextDecimal >= 4) ? 1 : 0;
        jkStates.A.K = (nextDecimal < 4) ? 1 : 0;
        jkStates.A.Q = counterState.A;
        jkStates.A.QBar = 1 - counterState.A;
        
        jkStates.B.J = ((nextDecimal % 4) >= 2) ? 1 : 0;
        jkStates.B.K = ((nextDecimal % 4) < 2) ? 1 : 0;
        jkStates.B.Q = counterState.B;
        jkStates.B.QBar = 1 - counterState.B;
        
        jkStates.C.J = (nextDecimal % 2) ? 1 : 0;
        jkStates.C.K = (nextDecimal % 2) ? 0 : 1;
        jkStates.C.Q = counterState.C;
        jkStates.C.QBar = 1 - counterState.C;
    }
    
    // Display Update Functions
    function updateCounterDisplays() {
        if (counterBinaryValue) {
            counterBinaryValue.textContent = `${counterState.A}${counterState.B}${counterState.C}`;
        }
        
        if (counterDecimalValue) {
            decimalValue = counterState.A * 4 + counterState.B * 2 + counterState.C;
            counterDecimalValue.textContent = decimalValue;
        }
    }
    
    function updateSevenSegmentDisplay() {
        if (!counterSegA || decimalValue > 6) return;
        
        const pattern = sevenSegmentPatterns[decimalValue];
        
        // Update segment colors
        counterSegA.style.fill = pattern.A ? '#ff0000' : '#2a0000';
        counterSegB.style.fill = pattern.B ? '#ff0000' : '#2a0000';
        counterSegC.style.fill = pattern.C ? '#ff0000' : '#2a0000';
        counterSegD.style.fill = pattern.D ? '#ff0000' : '#2a0000';
        counterSegE.style.fill = pattern.E ? '#ff0000' : '#2a0000';
        counterSegF.style.fill = pattern.F ? '#ff0000' : '#2a0000';
        counterSegG.style.fill = pattern.G ? '#ff0000' : '#2a0000';
    }
    
    function updateLEDOutputs() {
        // Update LED A
        if (counterALed) {
            if (counterState.A) {
                counterALed.classList.add('active');
            } else {
                counterALed.classList.remove('active');
            }
        }
        if (counterAState) {
            counterAState.textContent = `${counterState.A} (${counterState.A ? 'HIGH' : 'LOW'})`;
        }
        
        // Update LED B
        if (counterBLed) {
            if (counterState.B) {
                counterBLed.classList.add('active');
            } else {
                counterBLed.classList.remove('active');
            }
        }
        if (counterBState) {
            counterBState.textContent = `${counterState.B} (${counterState.B ? 'HIGH' : 'LOW'})`;
        }
        
        // Update LED C
        if (counterCLed) {
            if (counterState.C) {
                counterCLed.classList.add('active');
    } else {
                counterCLed.classList.remove('active');
            }
        }
        if (counterCState) {
            counterCState.textContent = `${counterState.C} (${counterState.C ? 'HIGH' : 'LOW'})`;
        }
    }
    
    function updateJKDebugLogger() {
        // Update Flip Flop A
        if (jkDebugJA) jkDebugJA.textContent = jkStates.A.J;
        if (jkDebugKA) jkDebugKA.textContent = jkStates.A.K;
        if (jkDebugQA) jkDebugQA.textContent = jkStates.A.Q;
        if (jkDebugQABar) jkDebugQABar.textContent = jkStates.A.QBar;
        
        // Update Flip Flop B
        if (jkDebugJB) jkDebugJB.textContent = jkStates.B.J;
        if (jkDebugKB) jkDebugKB.textContent = jkStates.B.K;
        if (jkDebugQB) jkDebugQB.textContent = jkStates.B.Q;
        if (jkDebugQBBar) jkDebugQBBar.textContent = jkStates.B.QBar;
        
        // Update Flip Flop C
        if (jkDebugJC) jkDebugJC.textContent = jkStates.C.J;
        if (jkDebugKC) jkDebugKC.textContent = jkStates.C.K;
        if (jkDebugQC) jkDebugQC.textContent = jkStates.C.Q;
        if (jkDebugQCBar) jkDebugQCBar.textContent = jkStates.C.QBar;
    }
    
    // Counter Control Functions
    function resetCounter() {
        // Stop clock if running
        if (isClockRunning) {
            stopClock();
        }
        
        // Reset counter state
        counterState = { A: 0, B: 0, C: 0 };
        decimalValue = 0;
        
        // Reset JK states
        jkStates = {
            A: { J: 0, K: 0, Q: 0, QBar: 1 },
            B: { J: 0, K: 0, Q: 0, QBar: 1 },
            C: { J: 0, K: 0, Q: 0, QBar: 1 }
        };
        
        // Reset input switches
        if (counterA) counterA.checked = false;
        if (counterB) counterB.checked = false;
        if (counterC) counterC.checked = false;
        
        // Update all displays
        updateCounterDisplays();
        updateSevenSegmentDisplay();
        updateLEDOutputs();
        updateJKDebugLogger();
        
        // Reset clock display
        clockState = 'LOW';
        updateClockDisplay();
    }
    
    // Input Switch Event Listeners
    function initializeInputSwitches() {
        if (!counterA || !counterB || !counterC) {
            return;
        }
        
        counterA.addEventListener('change', handleInputChange);
        counterB.addEventListener('change', handleInputChange);
        counterC.addEventListener('change', handleInputChange);
    }
    
    function handleInputChange() {
        // Update counter state from input switches
        if (counterA) counterState.A = counterA.checked ? 1 : 0;
        if (counterB) counterState.B = counterB.checked ? 1 : 0;
        if (counterC) counterState.C = counterC.checked ? 1 : 0;
        
        // Update displays
        updateCounterDisplays();
        updateSevenSegmentDisplay();
        updateLEDOutputs();
        
        // Update JK states
        updateJKStates();
        updateJKDebugLogger();
    }
    
    // Enhanced Tooltip System
    function initializeEnhancedTooltips() {
        // MOD-7 Counter Simulator Tooltip
        const mod7Tooltip = document.getElementById('mod7-counter-tooltip');
        const mod7Trigger = document.querySelector('[data-tooltip="mod7-counter-tooltip"]');
        
        if (mod7Tooltip && mod7Trigger) {
            mod7Trigger.addEventListener('click', () => {
                mod7Tooltip.style.display = 'block';
            });
            
            const closeBtn = mod7Tooltip.querySelector('.tooltip-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    mod7Tooltip.style.display = 'none';
                });
            }
        }
        

    }
    
    // Initialize everything
    function initializeAll() {
        // Initialize clock generator
        initializeClockGenerator();
        
        // Initialize input switches
        initializeInputSwitches();
        
        // Initialize enhanced tooltips
        initializeEnhancedTooltips();
        
        // Set initial state
        updateCounterDisplays();
        updateSevenSegmentDisplay();
        updateLEDOutputs();
        updateJKDebugLogger();
        updateClockDisplay();
        
    
    }
    
    // Start initialization
    initializeAll();
    
    // Initialize K-Map Navigation System
    initializeKMapNavigation();
    

}

// K-Map Navigation System for Lab 11
function initializeKMapNavigation() {

    
    // Get navigation buttons
    const showJAkmapBtn = document.getElementById('showJAkmapBtn');
    const showKAkmapBtn = document.getElementById('showKAkmapBtn');
    const showJBkmapBtn = document.getElementById('showJBkmapBtn');
    const showKBkmapBtn = document.getElementById('showKBkmapBtn');
    const showJCkmapBtn = document.getElementById('showJCkmapBtn');
    const showKCkmapBtn = document.getElementById('showKCkmapBtn');
    const showAllKmapsBtn = document.getElementById('showAllKmapsBtn');
    
    // Get K-map sections
    const kmapSectionJA = document.getElementById('kmap-section-ja');
    const kmapSectionKA = document.getElementById('kmap-section-ka');
    const kmapSectionJB = document.getElementById('kmap-section-jb');
    const kmapSectionKB = document.getElementById('kmap-section-kb');
    const kmapSectionJC = document.getElementById('kmap-section-jc');
    const kmapSectionKC = document.getElementById('kmap-section-kc');
    
    // Check if all elements exist
    if (!showJAkmapBtn || !showKAkmapBtn || !showJBkmapBtn || !showKBkmapBtn || !showJCkmapBtn || !showKCkmapBtn || !showAllKmapsBtn) {
        console.error('Some K-map navigation buttons not found');
        return;
    }
    
    if (!kmapSectionJA || !kmapSectionKA || !kmapSectionJB || !kmapSectionKB || !kmapSectionJC || !kmapSectionKC) {
        console.error('Some K-map sections not found');
        return;
    }
    
    // Set initial state - show JA K-map by default
    kmapSectionJA.style.display = 'block';
    kmapSectionKA.style.display = 'none';
    kmapSectionJB.style.display = 'none';
    kmapSectionKB.style.display = 'none';
    kmapSectionJC.style.display = 'none';
    kmapSectionKC.style.display = 'none';
    
    // Helper function to update button states
    function updateButtonStates(activeButton) {
        // Remove active class from all buttons
        [showJAkmapBtn, showKAkmapBtn, showJBkmapBtn, showKBkmapBtn, showJCkmapBtn, showKCkmapBtn, showAllKmapsBtn].forEach(btn => {
            btn.classList.remove('active');
        });
        // Add active class to clicked button
        activeButton.classList.add('active');
    }
    
    // Helper function to hide all K-map sections
    function hideAllKmapSections() {
        [kmapSectionJA, kmapSectionKA, kmapSectionJB, kmapSectionKB, kmapSectionJC, kmapSectionKC].forEach(section => {
            section.style.display = 'none';
        });
    }
    
    // JA K-Map button click handler
    showJAkmapBtn.addEventListener('click', function() {
        updateButtonStates(showJAkmapBtn);
        hideAllKmapSections();
        kmapSectionJA.style.display = 'block';

    });
    
    // KA K-Map button click handler
    showKAkmapBtn.addEventListener('click', function() {
        updateButtonStates(showKAkmapBtn);
        hideAllKmapSections();
        kmapSectionKA.style.display = 'block';

    });
    
    // JB K-Map button click handler
    showJBkmapBtn.addEventListener('click', function() {
        updateButtonStates(showJBkmapBtn);
        hideAllKmapSections();
        kmapSectionJB.style.display = 'block';

    });
    
    // KB K-Map button click handler
    showKBkmapBtn.addEventListener('click', function() {
        updateButtonStates(showKBkmapBtn);
        hideAllKmapSections();
        kmapSectionKB.style.display = 'block';

    });
    
    // JC K-Map button click handler
    showJCkmapBtn.addEventListener('click', function() {
        updateButtonStates(showJCkmapBtn);
        hideAllKmapSections();
        kmapSectionJC.style.display = 'block';

    });
    
    // KC K-Map button click handler
    showKCkmapBtn.addEventListener('click', function() {
        updateButtonStates(showKCkmapBtn);
        hideAllKmapSections();
        kmapSectionKC.style.display = 'block';

    });
    
    // Show All K-maps button click handler
    showAllKmapsBtn.addEventListener('click', function() {
        updateButtonStates(showAllKmapsBtn);
        [kmapSectionJA, kmapSectionKA, kmapSectionJB, kmapSectionKB, kmapSectionJC, kmapSectionKC].forEach(section => {
            section.style.display = 'block';
        });

    });
    

}
