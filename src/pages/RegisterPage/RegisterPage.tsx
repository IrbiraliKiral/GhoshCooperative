import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import Stepper, { Step } from '@/components/common/Stepper/Stepper';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Captcha } from '@/components/common/Captcha/Captcha';
import { useCaptcha } from '@/hooks/useCaptcha';
import { Check, X } from 'lucide-react';
import { registerUser } from '@/services/userService';
import agreementEn from '../../../data/agreement-en.json';
import agreementBn from '../../../data/agreement-bn.json';

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Step 1: Full Name
  const [fullName, setFullName] = useState('');
  
  // Step 2: Birthday
  const [birthday, setBirthday] = useState('');
  const [ageError, setAgeError] = useState('');
  
  // Step 3: Password
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({ score: 0, label: '', color: '' });
  const [passwordMatch, setPasswordMatch] = useState(true);
  
  // Step 4: Agreement & Captcha
  const [agreementLanguage, setAgreementLanguage] = useState<'en' | 'bn'>('en');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const captcha = useCaptcha();
  
  // Current step state
  const [currentStep, setCurrentStep] = useState(1);
  const [canProceed, setCanProceed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationError, setRegistrationError] = useState('');

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength({ score: 0, label: '', color: '' });
      return;
    }

    let score = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };

    if (checks.length) score++;
    if (checks.uppercase) score++;
    if (checks.lowercase) score++;
    if (checks.number) score++;
    if (checks.special) score++;

    let label = '';
    let color = '';

    if (score <= 2) {
      label = t.register.passwordWeak;
      color = 'bg-red-500';
    } else if (score === 3) {
      label = t.register.passwordFair;
      color = 'bg-orange-500';
    } else if (score === 4) {
      label = t.register.passwordGood;
      color = 'bg-yellow-500';
    } else {
      label = t.register.passwordStrong;
      color = 'bg-green-500';
    }

    setPasswordStrength({ score, label, color });
  }, [password, t]);

  // Check password match
  useEffect(() => {
    if (confirmPassword) {
      setPasswordMatch(password === confirmPassword);
    } else {
      setPasswordMatch(true);
    }
  }, [password, confirmPassword]);

  // Validate age (must be at least 11 years old)
  const validateAge = (date: string) => {
    if (!date) {
      setAgeError('');
      return false;
    }

    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 11) {
      setAgeError(t.register.ageError);
      return false;
    }

    setAgeError('');
    return true;
  };

  // Check if current step is valid
  useEffect(() => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = fullName.trim().length >= 3;
        break;
      case 2:
        isValid = birthday !== '' && validateAge(birthday) && !ageError;
        break;
      case 3:
        isValid = password.length >= 8 && 
                  passwordStrength.score >= 3 && 
                  confirmPassword !== '' && 
                  passwordMatch;
        break;
      case 4:
        isValid = agreedToTerms && captcha.isVerified;
        break;
    }

    setCanProceed(isValid);
  }, [currentStep, fullName, birthday, ageError, password, confirmPassword, passwordStrength, passwordMatch, agreedToTerms, captcha.isVerified]);

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    setRegistrationError('');

    try {
      const result = await registerUser({
        fullName,
        dateOfBirth: birthday,
        password
      });

      if (result.success) {
        // Registration successful
        console.log('User registered:', result.user);
        alert('Registration successful! Welcome to Ghosh Cooperative Bankings.');
        navigate('/');
      } else {
        // Registration failed
        setRegistrationError(result.message);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setRegistrationError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const agreement = agreementLanguage === 'en' ? agreementEn : agreementBn;

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">{t.register.title}</h1>
          <p className="text-muted-foreground">{t.register.subtitle}</p>
        </div>

        {registrationError && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg">
            <p className="text-red-500 text-center">{registrationError}</p>
          </div>
        )}

        <Stepper
          initialStep={1}
          onStepChange={handleStepChange}
          onFinalStepCompleted={handleComplete}
          backButtonText={t.register.previous}
          nextButtonText={t.register.next}
          nextButtonProps={{ disabled: !canProceed || isSubmitting }}
        >
          {/* Step 1: Full Name */}
          <Step>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">{t.register.step1Title}</h2>
              <p className="text-muted-foreground">{t.register.step1Description}</p>
              <div className="space-y-2">
                <Label htmlFor="fullName">{t.register.fullName}</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t.register.fullNamePlaceholder}
                />
                {fullName && fullName.length < 3 && (
                  <p className="text-sm text-red-500">{t.register.fullNameError}</p>
                )}
              </div>
            </div>
          </Step>

          {/* Step 2: Birthday */}
          <Step>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">{t.register.step2Title}</h2>
              <p className="text-muted-foreground">{t.register.step2Description}</p>
              <div className="space-y-2">
                <Label htmlFor="birthday">{t.register.birthday}</Label>
                <Input
                  id="birthday"
                  type="date"
                  value={birthday}
                  onChange={(e) => {
                    setBirthday(e.target.value);
                    validateAge(e.target.value);
                  }}
                />
                {ageError && <p className="text-sm text-red-500">{ageError}</p>}
              </div>
            </div>
          </Step>

          {/* Step 3: Password */}
          <Step>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">{t.register.step3Title}</h2>
              <p className="text-muted-foreground">{t.register.step3Description}</p>
              
              <div className="space-y-2">
                <Label htmlFor="password">{t.register.password}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.register.passwordPlaceholder}
                />
                
                {password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{t.register.passwordStrength}:</span>
                      <span className="font-medium">{passwordStrength.label}</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                    
                    <div className="space-y-1 text-xs">
                      <PasswordRequirement met={password.length >= 8} text={t.register.req8Chars} />
                      <PasswordRequirement met={/[A-Z]/.test(password)} text={t.register.reqUppercase} />
                      <PasswordRequirement met={/[a-z]/.test(password)} text={t.register.reqLowercase} />
                      <PasswordRequirement met={/[0-9]/.test(password)} text={t.register.reqNumber} />
                      <PasswordRequirement met={/[^A-Za-z0-9]/.test(password)} text={t.register.reqSpecial} />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t.register.confirmPassword}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t.register.confirmPasswordPlaceholder}
                  className={!passwordMatch ? 'border-red-500' : ''}
                />
                {!passwordMatch && confirmPassword && (
                  <p className="text-sm text-red-500">{t.register.passwordMismatch}</p>
                )}
              </div>
            </div>
          </Step>

          {/* Step 4: Agreement & Captcha */}
          <Step>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">{t.register.step4Title}</h2>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Label>{t.register.agreementLanguage}:</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={agreementLanguage === 'en' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAgreementLanguage('en')}
                    >
                      English
                    </Button>
                    <Button
                      type="button"
                      variant={agreementLanguage === 'bn' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAgreementLanguage('bn')}
                    >
                      বাংলা
                    </Button>
                  </div>
                </div>

                <div className="bg-neutral-800 border border-neutral-600 rounded-lg p-4 max-h-60 overflow-y-auto">
                  <h3 className="text-lg font-semibold mb-3">{agreement.title}</h3>
                  <div className="space-y-2 text-sm text-neutral-200">
                    {agreement.content.map((paragraph, index) => (
                      <p key={index} className={paragraph === '' ? 'h-2' : ''}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="agree"
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="h-4 w-4 rounded border-neutral-700"
                  />
                  <Label htmlFor="agree" className="cursor-pointer">
                    {t.register.agreeToTerms}
                  </Label>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-700">
                <Captcha
                  question={captcha.challenge.question}
                  value={captcha.userInput}
                  onChange={captcha.setUserInput}
                  onRefresh={captcha.refresh}
                  error={captcha.error}
                  isVerified={captcha.isVerified}
                  label={t.register.captchaLabel}
                  placeholder={t.register.captchaPlaceholder}
                  description={captcha.challenge.description}
                  type={captcha.challenge.type}
                />
                {!captcha.isVerified && captcha.userInput && (
                  <Button
                    type="button"
                    onClick={captcha.verify}
                    className="mt-3 w-full"
                    size="lg"
                  >
                    {t.register.verifyCaptcha}
                  </Button>
                )}
              </div>
            </div>
          </Step>
        </Stepper>
      </div>
    </div>
  );
}

function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      {met ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <X className="h-3 w-3 text-neutral-500" />
      )}
      <span className={met ? 'text-green-500' : 'text-neutral-500'}>{text}</span>
    </div>
  );
}
