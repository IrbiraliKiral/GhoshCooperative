export const validateEmail = (email: string): string | null => {
  if (!email) {
    return 'Email is required';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone) {
    return 'Phone number is required';
  }
  
  // Indian phone number format: 10 digits, optionally starting with +91
  const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
  const cleanPhone = phone.replace(/[\s-]/g, '');
  
  if (!phoneRegex.test(cleanPhone)) {
    return 'Please enter a valid Indian phone number';
  }
  
  return null;
};

export const validateMessage = (message: string, minLength: number = 10): string | null => {
  if (!message) {
    return 'Message is required';
  }
  
  if (message.trim().length < minLength) {
    return `Message must be at least ${minLength} characters long`;
  }
  
  return null;
};

export const validateField = (
  value: string,
  validator: (value: string) => string | null
): string | null => {
  return validator(value);
};
