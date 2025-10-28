import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/ui/useToast';
import { getCurrentMachineSession } from '@/services/sessionService';
import { useLanguage } from '@/contexts/LanguageContext';

export const useRegistration = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useLanguage();

  const handleRegister = () => {
    const session = getCurrentMachineSession();
    
    if (session) {
      // User is already logged in/registered
      toast.info(t.alreadyRegistered.message);
      return false;
    } else {
      // User is not registered, navigate to registration page
      navigate('/register');
      return true;
    }
  };

  const isLoggedIn = () => {
    return getCurrentMachineSession() !== null;
  };

  return {
    handleRegister,
    isLoggedIn,
  };
};
