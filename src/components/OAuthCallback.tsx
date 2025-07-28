import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useConnectedAccounts } from '@/hooks/useConnectedAccounts';
import { Loader2 } from 'lucide-react';

export function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleOAuthCallback } = useConnectedAccounts();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      if (error) {
        console.error('OAuth error:', error);
        navigate('/?error=oauth_failed');
        return;
      }

      if (code && state) {
        const success = await handleOAuthCallback(code, state);
        if (success) {
          navigate('/?connected=true');
        } else {
          navigate('/?error=connection_failed');
        }
      } else {
        navigate('/?error=invalid_callback');
      }
    };

    handleCallback();
  }, [searchParams, navigate, handleOAuthCallback]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <h2 className="text-lg font-semibold mb-2">Connecting your account...</h2>
        <p className="text-muted-foreground">Please wait while we complete the connection.</p>
      </div>
    </div>
  );
}