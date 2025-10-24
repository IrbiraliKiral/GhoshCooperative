import { RefreshCw, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface CaptchaProps {
  question: string;
  value: string;
  onChange: (value: string) => void;
  onRefresh: () => void;
  error?: string;
  isVerified?: boolean;
  label?: string;
  placeholder?: string;
  description?: string;
  type?: 'math' | 'pattern' | 'sequence' | 'logic';
}

export function Captcha({
  question,
  value,
  onChange,
  onRefresh,
  error,
  isVerified,
  label = 'Solve this problem',
  placeholder = 'Your answer',
  description,
  type = 'math'
}: CaptchaProps) {
  const getChallengeIcon = () => {
    switch (type) {
      case 'pattern':
        return '🧩';
      case 'sequence':
        return '🔢';
      case 'logic':
        return '🧠';
      default:
        return '🔢';
    }
  };

  const getChallengeColor = () => {
    switch (type) {
      case 'pattern':
        return 'from-purple-900/50 to-purple-800/50 border-purple-600/50';
      case 'sequence':
        return 'from-blue-900/50 to-blue-800/50 border-blue-600/50';
      case 'logic':
        return 'from-green-900/50 to-green-800/50 border-green-600/50';
      default:
        return 'from-orange-900/50 to-orange-800/50 border-orange-600/50';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-blue-400" />
        <Label className="text-base font-semibold">{label}</Label>
      </div>
      
      {description && (
        <p className="text-sm text-neutral-400 italic">{description}</p>
      )}

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className={`bg-gradient-to-br ${getChallengeColor()} px-6 py-4 rounded-xl border-2 shadow-lg backdrop-blur-sm`}>
            <div className="flex items-center gap-3 justify-center">
              <span className="text-2xl">{getChallengeIcon()}</span>
              <span className="font-mono text-xl font-bold text-white tracking-wide">
                {question}
              </span>
            </div>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onRefresh}
          className="shrink-0 h-12 w-12 border-2 hover:rotate-180 transition-transform duration-500"
          title="Generate new challenge"
        >
          <RefreshCw className="h-5 w-5" />
        </Button>
      </div>

      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`h-12 text-base ${error ? 'border-red-500 focus-visible:ring-red-500' : ''} ${isVerified ? 'border-green-500 focus-visible:ring-green-500' : ''}`}
      />
      
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <span className="font-semibold">✗</span>
          <span>{error}</span>
        </div>
      )}
      
      {isVerified && (
        <div className="flex items-center gap-2 text-sm text-green-500 font-semibold">
          <span className="text-base">✓</span>
          <span>Verified! You're human 🎉</span>
        </div>
      )}
    </div>
  );
}
