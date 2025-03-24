/**
 * Firebase Authentication Fixes
 * 
 * Add this script tag just before the closing </body> tag in division_apps_v004.html
 * <script src="auth-fix.js"></script>
 */

// Make sure necessary functions exist globally
(function() {
    console.log("Loading auth-fix.js - defining missing functions");
    
    // Make Firebase variables globally accessible
    if (typeof firebase !== 'undefined') {
        // Ensure global access to Firebase instances
        if (typeof window.db === 'undefined') {
            try {
                window.db = firebase.firestore();
                console.log("Made Firestore globally accessible");
            } catch (e) {
                console.error("Error making Firestore global:", e);
            }
        }
        
        if (typeof window.auth === 'undefined') {
            try {
                window.auth = firebase.auth();
                console.log("Made Auth globally accessible");
            } catch (e) {
                console.error("Error making Auth global:", e);
            }
        }
        
        // Ensure currentUser is globally accessible too
        if (typeof window.currentUser === 'undefined') {
            Object.defineProperty(window, 'currentUser', {
                get: function() {
                    return firebase.auth().currentUser;
                }
            });
            console.log("Made currentUser globally accessible");
        }
    }
    
    // Define updateAuthUI globally if it doesn't exist
    if (typeof window.updateAuthUI !== 'function') {
        window.updateAuthUI = function() {
            console.log("Using patched updateAuthUI function");
            const authSection = document.getElementById('authSection');
            const userDisplay = document.getElementById('userDisplay');
            
            if (!authSection || !userDisplay) {
                console.error("Auth UI elements not found");
                return;
            }
            
            if (window.currentUser) {
                console.log("User is signed in, updating UI");
                authSection.classList.add('hidden');
                userDisplay.classList.remove('hidden');
                
                const nameElement = userDisplay.querySelector('.user-name');
                if (nameElement) {
                    nameElement.textContent = window.currentUser.displayName || 
                                             window.currentUser.email || 
                                             "Anonymous User";
                }
                
                // Pre-fill student name if logged in
                const studentNameInput = document.getElementById('student-name');
                if (studentNameInput) {
                    if (window.currentUser.displayName || window.currentUser.email) {
                        studentNameInput.value = window.currentUser.displayName || 
                                               window.currentUser.email.split('@')[0];
                    } else {
                        studentNameInput.value = "Anonymous User";
                    }
                }
                
                // Load assignments and practice data if those functions exist
                if (typeof window.loadUserData === 'function') window.loadUserData();
            } else {
                console.log("No user signed in, updating UI");
                authSection.classList.remove('hidden');
                userDisplay.classList.add('hidden');
            }
        };
    }
    
    // Define updateAssignmentSelectOptions if it doesn't exist
    if (typeof window.updateAssignmentSelectOptions !== 'function') {
        window.updateAssignmentSelectOptions = function(assignments) {
            console.log("Using patched updateAssignmentSelectOptions function");
            const assignmentSelect = document.getElementById('assignment-select');
            if (assignmentSelect) {
                assignmentSelect.innerHTML = '<option value="" selected>No assignment</option>';
                
                if (assignments && assignments.length > 0) {
                    assignments.forEach(assignment => {
                        const option = document.createElement('option');
                        option.value = assignment.id;
                        option.textContent = assignment.name;
                        assignmentSelect.appendChild(option);
                    });
                }
            }
        };
    }
    
    // Define loadUserData if it doesn't exist
    if (typeof window.loadUserData !== 'function') {
        window.loadUserData = function() {
            console.log("Using patched loadUserData function");
            // Simple implementation that just loads assignments and practice sessions
            if (typeof window.loadAssignments === 'function') window.loadAssignments();
            if (typeof window.loadPracticeSessions === 'function') window.loadPracticeSessions();
        };
    }
    
    // Define loadAssignments if it doesn't exist
    if (typeof window.loadAssignments !== 'function') {
        window.loadAssignments = function() {
            console.log("Using patched loadAssignments function");
            try {
                if (!window.db) {
                    console.error("Firestore database not initialized");
                    
                    // Try to get it directly from firebase
                    if (typeof firebase !== 'undefined') {
                        try {
                            window.db = firebase.firestore();
                            console.log("Retrieved Firestore from firebase");
                        } catch (e) {
                            console.error("Couldn't get Firestore from firebase:", e);
                            return;
                        }
                    } else {
                        return;
                    }
                }
                
                console.log("Loading assignments...");
                
                // Simple stub implementation - you can expand this later
                window.updateAssignmentSelectOptions([]);
                
            } catch (error) {
                console.error("Error loading assignments:", error);
            }
        };
    }
    
    // Define loadPracticeSessions if it doesn't exist
    if (typeof window.loadPracticeSessions !== 'function') {
        window.loadPracticeSessions = function() {
            console.log("Using patched loadPracticeSessions function");
            // Simple stub implementation
        };
    }
    
    console.log("Auth-fix.js loaded successfully");
})(); 