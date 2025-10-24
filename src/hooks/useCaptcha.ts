import { useState, useCallback } from 'react';
import { generateCaptcha, verifyCaptcha, CaptchaChallenge } from '@/utils/captcha';

export function useCaptcha() {
  const [challenge, setChallenge] = useState<CaptchaChallenge>(generateCaptcha());
  const [userInput, setUserInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(() => {
    setChallenge(generateCaptcha());
    setUserInput('');
    setIsVerified(false);
    setError('');
  }, []);

  const verify = useCallback(() => {
    if (!userInput.trim()) {
      setError('Please provide an answer.');
      return false;
    }
    const isCorrect = verifyCaptcha(userInput, challenge.answer);
    setIsVerified(isCorrect);
    if (!isCorrect) {
      setError('Incorrect answer. Please try again.');
    } else {
      setError('');
    }
    return isCorrect;
  }, [userInput, challenge.answer]);

  const reset = useCallback(() => {
    setUserInput('');
    setIsVerified(false);
    setError('');
  }, []);

  return {
    challenge,
    userInput,
    setUserInput,
    isVerified,
    error,
    verify,
    refresh,
    reset
  };
}
