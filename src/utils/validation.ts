export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string) => {
  return {
    hasLetter: /[a-zA-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    hasMinLength: password.length >= 8
  };
};


export const isValidPassword = (password: string): boolean => {
  const validations = validatePassword(password);
  return Object.values(validations).every(Boolean);
};

export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  // This is a simple validation for demonstration
  // In a production app, you'd want to use a more robust solution
  // or a library like libphonenumber-js
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phoneNumber);
};

export const isValidName = (name: string): boolean => {
  return name.trim().length >= 2;
};


export const getFieldErrorMessage = (fieldName: string, value: string): string => {
  switch (fieldName) {
    case 'email':
      return !value ? 'Email is required' : 
             !isValidEmail(value) ? 'Please enter a valid email address' : '';
    
    case 'password':
      if (!value) return 'Password is required';
      const validations = validatePassword(value);
      if (!validations.hasLetter) return 'Password must contain at least one letter';
      if (!validations.hasNumber) return 'Password must contain at least one number';
      if (!validations.hasSpecialChar) return 'Password must contain at least one special character';
      if (!validations.hasMinLength) return 'Password must be at least 8 characters long';
      return '';
    
    case 'phoneNumber':
      return !value ? 'Phone number is required' : 
             !isValidPhoneNumber(value) ? 'Please enter a valid phone number' : '';
    
    case 'firstName':
    case 'lastName':
      return !value ? `${fieldName === 'firstName' ? 'First' : 'Last'} name is required` : 
             !isValidName(value) ? `${fieldName === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters` : '';
    
    default:
      return !value ? `${fieldName} is required` : '';
  }
}; 