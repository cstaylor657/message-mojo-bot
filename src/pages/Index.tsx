import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { PostScheduler } from "@/components/PostScheduler";
import { AutomationRules } from "@/components/AutomationRules";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-primary text-primary-foreground">
              <Zap className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">FlowCrest</h1>
          </div>
          <h2 className="text-xl font-semibold">Welcome to FlowCrest</h2>
          <p className="text-muted-foreground">Please sign in to access your automation platform.</p>
          <Button onClick={() => navigate('/auth')} className="w-full">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "scheduler":
        return <PostScheduler />;
      case "automation":
        return <AutomationRules />;
      case "messages":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Messages</h1>
            <p className="text-muted-foreground">Manage your direct messages and conversations.</p>
            <div className="bg-accent/20 border border-border rounded-lg p-8 text-center">
              <p className="text-muted-foreground">Messages feature coming soon...</p>
            </div>
          </div>
        );
      case "analytics":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Track your automation performance and engagement.</p>
            <div className="bg-accent/20 border border-border rounded-lg p-8 text-center">
              <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Configure your automation platform settings.</p>
            <div className="bg-accent/20 border border-border rounded-lg p-8 text-center">
              <p className="text-muted-foreground">Settings panel coming soon...</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-6 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
