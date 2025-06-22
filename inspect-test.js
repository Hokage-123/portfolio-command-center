// 🔍 Portfolio Command Center - Inspection Test Script
// Copy and paste this into your browser console to verify everything is working

console.log('🔍 Starting Portfolio Command Center Inspection...\n');

// Test 1: Check if main elements exist
console.log('📋 Test 1: Main Elements');
const elements = {
    'app-container': document.getElementById('app-container'),
    'project-hub-view': document.getElementById('project-hub-view'),
    'new-project-btn': document.getElementById('new-project-btn'),
    'project-list': document.getElementById('project-list'),
    'new-project-modal': document.getElementById('new-project-modal')
};

Object.entries(elements).forEach(([name, element]) => {
    if (element) {
        console.log(`✅ ${name}: Found`);
        console.log(`   Classes: ${element.className}`);
        console.log(`   Display: ${getComputedStyle(element).display}`);
    } else {
        console.log(`❌ ${name}: Missing`);
    }
});

// Test 2: Check global functions
console.log('\n📋 Test 2: Global Functions');
const functions = ['editProject', 'deleteProject', 'selectProject'];
functions.forEach(funcName => {
    if (typeof window[funcName] === 'function') {
        console.log(`✅ ${funcName}: Available`);
    } else {
        console.log(`❌ ${funcName}: Missing`);
    }
});

// Test 3: Check Firebase
console.log('\n📋 Test 3: Firebase');
if (typeof firebase !== 'undefined') {
    console.log('✅ Firebase: Available');
    if (firebase.apps.length > 0) {
        console.log('✅ Firebase: Initialized');
    } else {
        console.log('❌ Firebase: Not initialized');
    }
} else {
    console.log('❌ Firebase: Not available');
}

// Test 4: Check CSS Loading
console.log('\n📋 Test 4: CSS Styles');
const testElement = document.getElementById('app-container');
if (testElement) {
    const styles = getComputedStyle(testElement);
    console.log(`✅ Background color: ${styles.backgroundColor}`);
    console.log(`✅ Font family: ${styles.fontFamily}`);
    console.log(`✅ Container max-width: ${styles.maxWidth}`);
}

// Test 5: Check for errors
console.log('\n📋 Test 5: Error Check');
const errors = [];
if (!document.getElementById('app-container')) errors.push('Missing app-container');
if (!document.getElementById('project-hub-view')) errors.push('Missing project-hub-view');
if (typeof window.editProject !== 'function') errors.push('Missing editProject function');

if (errors.length === 0) {
    console.log('✅ No critical errors found');
} else {
    console.log('❌ Errors found:');
    errors.forEach(error => console.log(`   - ${error}`));
}

// Test 6: Simulate button click test
console.log('\n📋 Test 6: Button Functionality');
const newProjectBtn = document.getElementById('new-project-btn');
if (newProjectBtn) {
    console.log('✅ New Project button found');
    console.log('💡 Try clicking the "New Project" button to test modal functionality');
} else {
    console.log('❌ New Project button not found');
}

console.log('\n🎉 Inspection complete! Check the results above.');
console.log('💡 If you see mostly ✅ marks, your application is working correctly!');

// Return summary for easy checking
return {
    elementsFound: Object.values(elements).filter(Boolean).length,
    totalElements: Object.keys(elements).length,
    functionsFound: functions.filter(name => typeof window[name] === 'function').length,
    totalFunctions: functions.length,
    firebaseAvailable: typeof firebase !== 'undefined',
    errorsFound: errors.length
};
