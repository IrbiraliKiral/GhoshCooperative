import { useState, useCallback } from 'react';
import { ContactFormData } from '@/types';
import { saveMessage, StoredMessage } from '@/services/messageService';

interface UseMessageReturn {
  isSubmitting: boolean;
  error: string | null;
  lastMessage: StoredMessage | null;
  submitMessage: (data: ContactFormData) => Promise<{ success: boolean; message?: StoredMessage; error?: string }>;
  clearError: () => void;
  clearLastMessage: () => void;
}

export const useMessage = (): UseMessageReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<StoredMessage | null>(null);

  const submitMessage = useCallback(
    async (data: ContactFormData) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const result = await saveMessage(data);

        if (result.success && result.message) {
          setLastMessage(result.message);
          return {
            success: true,
            message: result.message,
          };
        } else {
          const errorMessage = result.error || 'Failed to submit message';
          setError(errorMessage);
          return {
            success: false,
            error: errorMessage,
          };
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearLastMessage = useCallback(() => {
    setLastMessage(null);
  }, []);

  return {
    isSubmitting,
    error,
    lastMessage,
    submitMessage,
    clearError,
    clearLastMessage,
  };
};
