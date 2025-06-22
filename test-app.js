// Simple test script to verify the application functionality
// This script can be run in the browser console to test basic functionality

console.log('🧪 Testing Portfolio Command Center Application...');

// Test 1: Check if the application loads
function testAppLoad() {
    console.log('📋 Test 1: Application Load');
    
    const appContainer = document.getElementById('app-container');
    const hubView = document.getElementById('project-hub-view');
    
    if (appContainer && hubView) {
        console.log('✅ App container and hub view found');
        return true;
    } else {
        console.log('❌ Missing app container or hub view');
        return false;
    }
}

// Test 2: Check if Firebase is initialized
function testFirebase() {
    console.log('📋 Test 2: Firebase Initialization');
    
    if (typeof firebase !== 'undefined') {
        console.log('✅ Firebase is available');
        return true;
    } else {
        console.log('❌ Firebase not found');
        return false;
    }
}

// Test 3: Check if global functions are accessible
function testGlobalFunctions() {
    console.log('📋 Test 3: Global Functions');
    
    const functions = ['editProject', 'deleteProject', 'selectProject'];
    let allFound = true;
    
    functions.forEach(funcName => {
        if (typeof window[funcName] === 'function') {
            console.log(`✅ ${funcName} function found`);
        } else {
            console.log(`❌ ${funcName} function missing`);
            allFound = false;
        }
    });
    
    return allFound;
}

// Test 4: Check if UI elements exist
function testUIElements() {
    console.log('📋 Test 4: UI Elements');
    
    const elements = [
        'new-project-btn',
        'project-list',
        'new-project-modal',
        'ai-modal'
    ];
    
    let allFound = true;
    
    elements.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            console.log(`✅ ${elementId} element found`);
        } else {
            console.log(`❌ ${elementId} element missing`);
            allFound = false;
        }
    });
    
    return allFound;
}

// Test 5: Test modal functionality
function testModalFunctionality() {
    console.log('📋 Test 5: Modal Functionality');
    
    try {
        const newProjectBtn = document.getElementById('new-project-btn');
        const modal = document.getElementById('new-project-modal');
        
        if (newProjectBtn && modal) {
            // Simulate click
            newProjectBtn.click();
            
            // Check if modal becomes visible
            setTimeout(() => {
                if (modal.classList.contains('visible')) {
                    console.log('✅ Modal opens correctly');
                    
                    // Close modal
                    const closeBtn = document.getElementById('close-new-project-modal');
                    if (closeBtn) {
                        closeBtn.click();
                        console.log('✅ Modal closes correctly');
                    }
                } else {
                    console.log('❌ Modal does not open');
                }
            }, 100);
            
            return true;
        } else {
            console.log('❌ Modal elements not found');
            return false;
        }
    } catch (error) {
        console.log('❌ Modal test failed:', error);
        return false;
    }
}

// Run all tests
function runAllTests() {
    console.log('🚀 Starting Portfolio Command Center Tests...\n');
    
    const results = {
        appLoad: testAppLoad(),
        firebase: testFirebase(),
        globalFunctions: testGlobalFunctions(),
        uiElements: testUIElements()
    };
    
    // Run modal test after a delay to ensure DOM is ready
    setTimeout(() => {
        results.modalFunctionality = testModalFunctionality();
        
        // Summary
        console.log('\n📊 Test Results Summary:');
        const passed = Object.values(results).filter(Boolean).length;
        const total = Object.keys(results).length;
        
        console.log(`✅ Passed: ${passed}/${total} tests`);
        
        if (passed === total) {
            console.log('🎉 All tests passed! Application is working correctly.');
        } else {
            console.log('⚠️ Some tests failed. Check the logs above for details.');
        }
        
        return results;
    }, 500);
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runAllTests, testAppLoad, testFirebase, testGlobalFunctions, testUIElements, testModalFunctionality };
} else {
    // Make available globally for browser console
    window.testPortfolioApp = runAllTests;
}

console.log('🔧 Test script loaded. Run testPortfolioApp() in the console to test the application.');
