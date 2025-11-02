import { useState } from 'react';
import { ContactFormData, FormErrors } from '@/types';
import { useForm } from '@/hooks/form/useForm';
import { useToast } from '@/hooks/ui/useToast';
import { useMessage } from '@/hooks/useMessage';
import { validateEmail, validatePhone, validateMessage } from '@/utils/validation/formValidation';
import { sanitizeFormData } from '@/helpers/forms/formHelpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ConfirmationModal } from '@/components/common/ConfirmationModal/ConfirmationModal';
import { FaPaperPlane } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';

export const ContactForm = () => {
  const { success, error: showError } = useToast();
  const { t } = useLanguage();
  const { submitMessage, isSubmitting: isSavingMessage } = useMessage();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<ContactFormData | null>(null);

  const initialValues: ContactFormData = {
    email: '',
    phone: '',
    message: '',
  };

  const validate = (values: ContactFormData): FormErrors => {
    return {
      email: validateEmail(values.email) || undefined,
      phone: validatePhone(values.phone) || undefined,
      message: validateMessage(values.message) || undefined,
    };
  };

  const handleSubmit = async (values: ContactFormData) => {
    // Sanitize form data
    const sanitizedData = sanitizeFormData(values);
    
    // Store the data and show confirmation modal
    setPendingFormData(sanitizedData);
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    if (!pendingFormData) return;

    try {
      // Save the message
      const result = await submitMessage(pendingFormData);

      if (result.success) {
        // Show success toast
        success(t.getHelp.form.success);

        // Close modal and reset form
        setShowConfirmation(false);
        setPendingFormData(null);
        reset();

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        showError(result.error || 'Failed to send message');
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  const handleCancelConfirm = () => {
    setShowConfirmation(false);
    setPendingFormData(null);
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit: onSubmit,
    reset,
  } = useForm({
    initialValues,
    validate,
    onSubmit: handleSubmit,
  });

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-banking-gray-700 font-medium">
            {t.getHelp.form.email} *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={t.getHelp.form.emailPlaceholder}
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className="banking-input"
            disabled={isSubmitting || isSavingMessage}
          />
          {touched.email && errors.email && (
            <Alert variant="destructive" className="py-2">
              <AlertDescription className="text-sm">{errors.email}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-banking-gray-700 font-medium">
            {t.getHelp.form.phone} *
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder={t.getHelp.form.phonePlaceholder}
            value={values.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            className="banking-input"
            disabled={isSubmitting || isSavingMessage}
          />
          {touched.phone && errors.phone && (
            <Alert variant="destructive" className="py-2">
              <AlertDescription className="text-sm">{errors.phone}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Message Field */}
        <div className="space-y-2">
          <Label htmlFor="message" className="text-banking-gray-700 font-medium">
            {t.getHelp.form.message} *
          </Label>
          <Textarea
            id="message"
            name="message"
            placeholder={t.getHelp.form.messagePlaceholder}
            rows={5}
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            className="banking-input resize-none"
            disabled={isSubmitting || isSavingMessage}
          />
          {touched.message && errors.message && (
            <Alert variant="destructive" className="py-2">
              <AlertDescription className="text-sm">{errors.message}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full bg-banking-blue-600 hover:bg-banking-blue-700 text-white shadow-banking-md font-semibold rounded-xl"
          disabled={isSubmitting || isSavingMessage}
        >
          {isSubmitting || isSavingMessage ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {t.getHelp.form.submitting}
            </span>
          ) : (
            <>
              <FaPaperPlane className="mr-2" />
              {t.getHelp.form.submit}
            </>
          )}
        </Button>
      </form>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        title="Confirm Message"
        subtitle="Review your message details"
        message={`Email: ${pendingFormData?.email}\nPhone: ${pendingFormData?.phone}\n\nWe'll send your message and keep it in our records.`}
        confirmText="Send Message"
        cancelText="Cancel"
        isLoading={isSavingMessage}
        onConfirm={handleConfirmSubmit}
        onCancel={handleCancelConfirm}
        icon="info"
      />
    </>
  );
};
