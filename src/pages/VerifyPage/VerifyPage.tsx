import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { verifyMemberCredentials } from '@/services/memberVerificationService';
import { createSession } from '@/services/sessionService';
import { ShieldCheck } from 'lucide-react';

export function VerifyPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [fullName, setFullName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Auto-focus on full name input when component mounts
  useEffect(() => {
    const input = document.getElementById('verify-fullName');
    if (input) {
      input.focus();
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);

    try {
      // Step 1: Verify member credentials
      const verificationResult = verifyMemberCredentials(fullName, code);
      
      if (!verificationResult.success) {
        setError(verificationResult.message);
        setIsVerifying(false);
        return;
      }

      // Step 2: Create machine-specific session
      if (verificationResult.member) {
        const sessionResult = await createSession(verificationResult.member);
        
        if (sessionResult.success) {
          // Redirect to home page on successful verification
          navigate('/');
        } else {
          setError('Failed to create session. Please try again.');
          setIsVerifying(false);
        }
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <ShieldCheck className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2">
            {t.verify?.title || 'Verify Your Identity'}
          </h1>
          <p className="text-muted-foreground">
            {t.verify?.subtitle || 'Please enter your credentials to access the website'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg">
            <p className="text-red-500 text-center text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="verify-fullName">
              {t.verify?.fullName || 'Full Name'}
            </Label>
            <Input
              id="verify-fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t.verify?.fullNamePlaceholder || 'Enter your full name'}
              required
              disabled={isVerifying}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="verify-code">
              {t.verify?.code || 'Verification Code'}
            </Label>
            <Input
              id="verify-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t.verify?.codePlaceholder || 'Enter your code'}
              required
              disabled={isVerifying}
              className="w-full"
              inputMode="numeric"
              pattern="[0-9]*"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isVerifying || !fullName.trim() || !code.trim()}
          >
            {isVerifying 
              ? (t.verify?.verifying || 'Verifying...') 
              : (t.verify?.submit || 'Verify & Continue')
            }
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            {t.verify?.helpText || 'Please contact the administrator if you need assistance'}
          </p>
        </div>
      </div>
    </div>
  );
}
