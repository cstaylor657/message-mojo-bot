import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useConnectedAccounts } from "@/hooks/useConnectedAccounts";

const platformConfig = {
  facebook: {
    name: "Facebook",
    icon: Facebook,
    color: "bg-blue-600",
    description: "Connect your Facebook page to schedule posts"
  },
  instagram: {
    name: "Instagram",
    icon: Instagram,
    color: "bg-gradient-to-br from-purple-600 to-pink-600",
    description: "Connect your Instagram business account"
  },
  twitter: {
    name: "Twitter",
    icon: Twitter,
    color: "bg-sky-500",
    description: "Connect your Twitter account (coming soon)"
  }
};

interface ConnectedAccountsManagerProps {
  compact?: boolean;
}

export function ConnectedAccountsManager({ compact = false }: ConnectedAccountsManagerProps) {
  const { 
    accounts, 
    loading, 
    connectFacebook, 
    disconnectAccount, 
    isConnected 
  } = useConnectedAccounts();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading connected accounts...</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="space-y-2">
        {Object.entries(platformConfig).map(([platform, config]) => {
          const Icon = config.icon;
          const connected = isConnected(platform);
          const platformAccounts = accounts.filter(acc => acc.platform === platform);
          
          return (
            <div key={platform} className="flex items-center gap-2 text-sm">
              <Icon className="h-4 w-4" />
              <span className="flex-1">{config.name}</span>
              {connected ? (
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-success" />
                  <span className="text-xs text-muted-foreground">
                    {platformAccounts.length} connected
                  </span>
                </div>
              ) : (
                <XCircle className="h-3 w-3 text-muted" />
              )}
            </div>
          );
        })}
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-3"
          onClick={connectFacebook}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Connected Accounts</h2>
        <p className="text-muted-foreground">
          Connect your social media accounts to start scheduling posts and managing your content.
        </p>
      </div>

      {accounts.length === 0 && (
        <Alert>
          <AlertDescription>
            No social media accounts connected yet. Connect your first account to get started!
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(platformConfig).map(([platform, config]) => {
          const Icon = config.icon;
          const connected = isConnected(platform);
          const platformAccounts = accounts.filter(acc => acc.platform === platform);
          
          return (
            <Card key={platform} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${config.color} text-white`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{config.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {config.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {connected ? (
                  <div className="space-y-2">
                    {platformAccounts.map((account) => (
                      <div key={account.id} className="flex items-center justify-between p-2 bg-accent/50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">
                            {account.platform_username || `${config.name} Account`}
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            Connected
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => disconnectAccount(platform, account.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <XCircle className="h-8 w-8 text-muted mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-3">
                      Not connected
                    </p>
                    {platform === 'twitter' ? (
                      <Badge variant="outline">Coming Soon</Badge>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={connectFacebook}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Connect {config.name}
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}