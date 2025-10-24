import { ContactFormData } from '@/types';

export const sanitizeFormData = (data: ContactFormData): ContactFormData => {
  return {
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim().replace(/\s+/g, ''),
    message: data.message.trim(),
  };
};

export const getErrorMessage = (error: string | null): string => {
  if (!error) return '';
  return error;
};

export const hasErrors = (errors: Record<string, string | null>): boolean => {
  return Object.values(errors).some(error => error !== null);
};

export const clearEmptyFields = <T extends Record<string, any>>(data: T): T => {
  const cleaned = { ...data };
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === '' || cleaned[key] === null || cleaned[key] === undefined) {
      delete cleaned[key];
    }
  });
  return cleaned;
};
