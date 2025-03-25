// Firebase Debug Helper

// Add keyboard shortcut to show debug panel
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        const debugPanel = document.getElementById('debugPanel');
        if (debugPanel) {
            debugPanel.style.display = debugPanel.style.display === 'none' ? 'block' : 'none';
        }
    }
});

// Initialize debug panel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create debug panel if it doesn't exist
    if (!document.getElementById('debugPanel')) {
        const debugPanel = document.createElement('div');
        debugPanel.id = 'debugPanel';
        debugPanel.style = 'position: fixed; bottom: 0; right: 0; background: rgba(0, 0, 0, 0.7); color: white; padding: 10px; font-family: monospace; font-size: 12px; z-index: 9999; max-width: 400px; max-height: 300px; overflow: auto; display: none;';
        
        debugPanel.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <strong>Firebase Debug Panel</strong>
                <button onclick="this.parentNode.parentNode.style.display = 'none';" style="background: none; border: none; color: white; cursor: pointer;">&times;</button>
            </div>
            <div>
                <button id="testFirebaseBtn" style="background: #4285F4; color: white; border: none; padding: 5px 10px; margin: 5px 0; border-radius: 3px; cursor: pointer;">Test Firebase</button>
                <button id="saveTestDataBtn" style="background: #0F9D58; color: white; border: none; padding: 5px 10px; margin: 5px 0; border-radius: 3px; cursor: pointer;">Save Test Practice</button>
                <div id="firebaseStatus"></div>
            </div>
        `;
        
        document.body.appendChild(debugPanel);
    }
    
    // Add event listeners to the debug buttons
    const testFirebaseBtn = document.getElementById('testFirebaseBtn');
    const saveTestDataBtn = document.getElementById('saveTestDataBtn');
    const firebaseStatus = document.getElementById('firebaseStatus');
    
    if (testFirebaseBtn) {
        testFirebaseBtn.addEventListener('click', function() {
            firebaseStatus.innerHTML = '<div style="color: yellow;">Testing Firebase connection...</div>';
            
            // Make sure Firebase is initialized
            if (typeof db === 'undefined') {
                firebaseStatus.innerHTML += '<div style="color: #F28B82;">✗ Firebase not initialized. No db object found.</div>';
                return;
            }
            
            const testDoc = {
                type: 'manual_test',
                timestamp: new Date().toString(),
                browser: navigator.userAgent
            };
            
            db.collection('app_logs').add(testDoc)
                .then(ref => {
                    firebaseStatus.innerHTML += `<div style="color: #81C995;">✓ Write to app_logs successful: ${ref.id}</div>`;
                    
                    // Test read operation
                    return db.collection('app_logs').doc(ref.id).get();
                })
                .then(doc => {
                    if (doc.exists) {
                        firebaseStatus.innerHTML += `<div style="color: #81C995;">✓ Read operation successful</div>`;
                    } else {
                        firebaseStatus.innerHTML += `<div style="color: #F28B82;">✗ Document not found after write</div>`;
                    }
                })
                .catch(error => {
                    firebaseStatus.innerHTML += `<div style="color: #F28B82;">✗ Firebase test failed: ${error.message}</div>`;
                });
        });
    }
    
    if (saveTestDataBtn) {
        saveTestDataBtn.addEventListener('click', function() {
            firebaseStatus.innerHTML = '<div style="color: yellow;">Saving test practice data...</div>';
            
            // Make sure Firebase functions are available
            if (typeof savePracticeSessionToFirebase === 'undefined') {
                firebaseStatus.innerHTML += '<div style="color: #F28B82;">✗ savePracticeSessionToFirebase function not found</div>';
                
                // Try to find the function in window scope
                let fnNames = [];
                for (let key in window) {
                    if (typeof window[key] === 'function' && key.toLowerCase().includes('practice') && key.toLowerCase().includes('save')) {
                        fnNames.push(key);
                    }
                }
                
                if (fnNames.length > 0) {
                    firebaseStatus.innerHTML += `<div style="color: yellow;">Found similar functions: ${fnNames.join(', ')}</div>`;
                }
                
                return;
            }
            
            const testSession = {
                studentName: "Test Student",
                dividend: 8462,
                divisor: 13,
                studentAnswer: "651r3",
                isCorrect: true,
                timeSeconds: 45,
                testField: "Manual test from debug panel",
                timestamp: new Date().toString()
            };
            
            window.savePracticeSessionToFirebase(testSession)
                .then(result => {
                    firebaseStatus.innerHTML += `<div style="color: #81C995;">✓ Test practice data saved successfully</div>`;
                })
                .catch(error => {
                    firebaseStatus.innerHTML += `<div style="color: #F28B82;">✗ Error saving test data: ${error.message}</div>`;
                });
        });
    }
}); 