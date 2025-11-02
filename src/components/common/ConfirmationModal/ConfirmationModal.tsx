import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  subtitle?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  isDangerous?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  icon?: 'warning' | 'info' | 'success';
}

export const ConfirmationModal = ({
  isOpen,
  title,
  message,
  subtitle,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  isDangerous = false,
  onConfirm,
  onCancel,
  icon = 'info',
}: ConfirmationModalProps) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  const getIconColor = () => {
    if (icon === 'warning') return 'text-yellow-500';
    if (icon === 'success') return 'text-green-500';
    return 'text-banking-blue-600';
  };

  const getIconComponent = () => {
    if (icon === 'warning') return AlertCircle;
    if (icon === 'success') return CheckCircle;
    return AlertCircle;
  };

  const IconComponent = getIconComponent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 animate-in fade-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="absolute top-4 right-4 p-1 text-banking-gray-400 hover:text-banking-gray-600 transition-colors disabled:opacity-50"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-full bg-opacity-10 ${getIconColor()}`}>
              <IconComponent className={`w-8 h-8 ${getIconColor()}`} />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-banking-gray-900 text-center mb-2">
            {title}
          </h2>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-sm text-banking-gray-500 text-center mb-4">
              {subtitle}
            </p>
          )}

          {/* Message */}
          <p className="text-banking-gray-600 text-center mb-6 leading-relaxed">
            {message}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={onCancel}
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            <Button
              size="lg"
              className={`flex-1 ${
                isDangerous
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-banking-blue-600 hover:bg-banking-blue-700'
              } text-white font-semibold`}
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </span>
              ) : (
                confirmText
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
