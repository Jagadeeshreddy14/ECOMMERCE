import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAOf07w4ZFJMh4NoLNNyhIVpZNiR0kb7EQ",
    authDomain: "apex-store-97796.firebaseapp.com",
    projectId: "apex-store-97796",
    storageBucket: "apex-store-97796.firebasestorage.app",
    messagingSenderId: "503398709068",
    appId: "1:503398709068:web:58f5ae6a486a22a85b41e9",
    measurementId: "G-XX7EMBN6PJ"
  };

// Validate Firebase configuration
const validateConfig = () => {
    const requiredFields = [
        'apiKey',
        'authDomain',
        'projectId',
        'storageBucket',
        'messagingSenderId',
        'appId'
    ];

    const missingFields = requiredFields.filter(field => !firebaseConfig[field]);
    
    if (missingFields.length > 0) {
        throw new Error(
            `Missing required Firebase configuration fields: ${missingFields.join(', ')}. ` +
            'Please check your .env file and make sure all required fields are set.'
        );
    }
};

try {
    validateConfig();
} catch (error) {
    console.error('Firebase configuration error:', error);
    throw error;
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
    prompt: 'select_account'
});

export { auth, googleProvider };
