import { ContactFormData, FormErrors } from '@/types';
import { useForm } from '@/hooks/form/useForm';
import { useToast } from '@/hooks/ui/useToast';
import { validateEmail, validatePhone, validateMessage } from '@/utils/validation/formValidation';
import { sanitizeFormData } from '@/helpers/forms/formHelpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FaPaperPlane } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';

export const ContactForm = () => {
  const { success } = useToast();
  const { t } = useLanguage();

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
    // Sanitize form data before submission
    sanitizeFormData(values);
    
    // Simulate form submission (no backend yet)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success toast
    success(t.getHelp.form.success);
    
    // Reset form
    reset();
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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
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
        className="w-full bg-banking-blue-600 hover:bg-banking-blue-700 text-white shadow-banking-md"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          t.getHelp.form.submitting
        ) : (
          <>
            <FaPaperPlane className="mr-2" />
            {t.getHelp.form.submit}
          </>
        )}
      </Button>
    </form>
  );
};
