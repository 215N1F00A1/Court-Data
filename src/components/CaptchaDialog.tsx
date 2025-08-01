import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RefreshCw, Shield } from 'lucide-react';

interface CaptchaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  captchaImageUrl: string;
  onSubmit: (solution: string) => void;
  onRefresh?: () => void;
  loading?: boolean;
}

export const CaptchaDialog = ({ 
  open, 
  onOpenChange, 
  captchaImageUrl, 
  onSubmit, 
  onRefresh,
  loading = false 
}: CaptchaDialogProps) => {
  const [solution, setSolution] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (solution.trim()) {
      onSubmit(solution.trim().toUpperCase());
      setSolution('');
    }
  };

  const handleRefresh = () => {
    setSolution('');
    onRefresh?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-warning" />
            CAPTCHA Verification Required
          </DialogTitle>
          <DialogDescription>
            The court website requires CAPTCHA verification to prevent automated access. 
            Please enter the characters shown in the image below.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            {/* CAPTCHA Image */}
            <div className="border-2 border-dashed border-muted rounded-lg p-4 bg-muted/20">
              <img 
                src={captchaImageUrl} 
                alt="CAPTCHA Challenge" 
                className="max-w-full h-auto rounded"
                style={{ minHeight: '60px', minWidth: '150px' }}
              />
            </div>
            
            {/* Refresh Button */}
            {onRefresh && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh CAPTCHA
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="captcha-solution">
              Enter the characters shown above
            </Label>
            <Input
              id="captcha-solution"
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="Enter CAPTCHA"
              className="text-center text-lg font-mono tracking-widest uppercase"
              maxLength={10}
              required
              autoFocus
            />
            <p className="text-sm text-muted-foreground">
              Enter the characters exactly as shown (case-insensitive)
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="legal"
              className="flex-1"
              disabled={loading || !solution.trim()}
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </Button>
          </div>
        </form>

        <div className="text-xs text-muted-foreground bg-muted/50 rounded p-3">
          <strong>Note:</strong> This CAPTCHA verification is required by the court website 
          to ensure legitimate access. Your privacy is protected and no personal data is stored 
          during this verification process.
        </div>
      </DialogContent>
    </Dialog>
  );
};