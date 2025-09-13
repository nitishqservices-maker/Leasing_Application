export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBiwA5IeHhVfPlTM3LT99jV30Xfi167dik",
    authDomain: "leasingapplication-c79b4.firebaseapp.com",
    projectId: "leasingapplication-c79b4",
    storageBucket: "leasingapplication-c79b4.firebasestorage.app",
    messagingSenderId: "814346287981",
    appId: "1:814346287981:web:6986d933b43d7de23fb864",
    measurementId: "G-3F7N2879VE"
  },
  // Additional Firebase settings for better connection handling
  firebaseConfig: {
    experimentalForceLongPolling: true,
    ignoreUndefinedProperties: true,
    cacheSizeBytes: 40 * 1024 * 1024, // 40MB cache
    maxConcurrentConnections: 10,
    maxRetryAttempts: 3
  }
};
