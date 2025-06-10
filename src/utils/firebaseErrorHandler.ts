export const getAuthErrorMessage = (error: any): string => {
  // Extract error code from Firebase error
  console.log('Firebase error object:', JSON.stringify(error));
  
  // Firebase errors can come in different formats
  let errorCode = '';
  
  if (error.code) {
    // Standard Firebase error object
    errorCode = error.code;
  } else if (error.message && typeof error.message === 'string') {
    // Sometimes the error code is in the message string like "Firebase: Error (auth/invalid-credential)"
    const match = error.message.match(/\(([^)]+)\)/);
    if (match && match[1]) {
      errorCode = match[1];
    }
  }
  
  console.log('Extracted error code:', errorCode);
  
  // Map of Firebase error codes to user-friendly messages
  const errorMessages: Record<string, string> = {
    'auth/invalid-credential': 'Invalid email or password. Please try again.',
    'auth/user-not-found': 'No account found with this email. Please check your email or sign up.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'This email is already in use. Please try another email or login instead.',
    'auth/weak-password': 'Password is too weak. Please use a stronger password.',
    'auth/invalid-email': 'Invalid email format. Please enter a valid email.',
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
    'auth/too-many-requests': 'Too many failed login attempts. Please try again later or reset your password.',
    'auth/network-request-failed': 'Network error. Please check your internet connection and try again.',
    'auth/requires-recent-login': 'This action requires recent authentication. Please log in again.',
    'auth/account-exists-with-different-credential': 'An account already exists with the same email but different sign-in credentials.',
    'auth/operation-not-allowed': 'This operation is not allowed. Please contact support.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed before completing the sign-in process.',
    'auth/unauthorized-domain': 'This domain is not authorized for OAuth operations.',
    'auth/invalid-action-code': 'The action code is invalid. This can happen if the code is malformed or has already been used.',
  };

  // Get the user-friendly message or use a default if not found
  const userFriendlyMessage = errorMessages[errorCode] || 
    (error.message && !error.message.includes('Firebase: Error') ? error.message : 
    'An unexpected error occurred. Please try again later.');

  console.log('User friendly message:', userFriendlyMessage);
  return userFriendlyMessage;
}; 