import { useToast as useToastPrimitive } from '@/components/ui/use-toast';

export const useToast = () => {
  const { toast } = useToastPrimitive();

  return {
    success: (message: string) => {
      toast({
        title: 'Success',
        description: message,
        variant: 'default',
      });
    },
    error: (message: string) => {
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    },
    info: (message: string) => {
      toast({
        title: 'Info',
        description: message,
      });
    },
    warning: (message: string) => {
      toast({
        title: 'Warning',
        description: message,
      });
    },
  };
};
