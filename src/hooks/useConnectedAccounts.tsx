import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

interface ConnectedAccount {
  id: string;
  platform: string;
  platform_user_id: string;
  platform_username: string | null;
  account_data: any;
  is_active: boolean;
  created_at: string;
}

export const useConnectedAccounts = () => {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchAccounts();
    }
  }, [user]);

  const fetchAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('connected_accounts')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      console.error('Error fetching connected accounts:', error);
      toast({
        title: "Error",
        description: "Failed to load connected accounts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const connectFacebook = async () => {
    try {
      if (!session?.access_token) {
        throw new Error('No valid session');
      }

      const response = await supabase.functions.invoke('oauth-facebook', {
        body: {},
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.error) throw response.error;

      const { oauthUrl } = response.data;
      window.location.href = oauthUrl;
    } catch (error) {
      console.error('Error connecting Facebook:', error);
      toast({
        title: "Error",
        description: "Failed to connect Facebook account",
        variant: "destructive",
      });
    }
  };

  const handleOAuthCallback = async (code: string, state: string) => {
    try {
      if (!session?.access_token) {
        throw new Error('No valid session');
      }

      const response = await supabase.functions.invoke('oauth-facebook', {
        body: { code, state },
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.error) throw response.error;

      toast({
        title: "Success",
        description: "Social media accounts connected successfully!",
      });

      // Refresh accounts list
      await fetchAccounts();
      
      return true;
    } catch (error) {
      console.error('Error handling OAuth callback:', error);
      toast({
        title: "Error",
        description: "Failed to connect accounts",
        variant: "destructive",
      });
      return false;
    }
  };

  const disconnectAccount = async (platform: string, accountId: string) => {
    try {
      if (!session?.access_token) {
        throw new Error('No valid session');
      }

      const response = await supabase.functions.invoke('oauth-facebook', {
        body: { platform, accountId },
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.error) throw response.error;

      toast({
        title: "Success",
        description: "Account disconnected successfully",
      });

      // Refresh accounts list
      await fetchAccounts();
    } catch (error) {
      console.error('Error disconnecting account:', error);
      toast({
        title: "Error",
        description: "Failed to disconnect account",
        variant: "destructive",
      });
    }
  };

  const getAccountsByPlatform = (platform: string) => {
    return accounts.filter(account => account.platform === platform);
  };

  const isConnected = (platform: string) => {
    return accounts.some(account => account.platform === platform);
  };

  return {
    accounts,
    loading,
    connectFacebook,
    handleOAuthCallback,
    disconnectAccount,
    getAccountsByPlatform,
    isConnected,
    refreshAccounts: fetchAccounts,
  };
};