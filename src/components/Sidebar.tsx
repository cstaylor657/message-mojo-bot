import { 
  LayoutDashboard, 
  Calendar, 
  Bot, 
  MessageSquare, 
  BarChart3, 
  Settings,
  Plus,
  Instagram,
  Facebook,
  Twitter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navigation = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "scheduler", label: "Post Scheduler", icon: Calendar },
  { id: "automation", label: "Automation", icon: Bot },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

const connectedAccounts = [
  { platform: "Instagram", icon: Instagram, connected: true },
  { platform: "Facebook", icon: Facebook, connected: true },
  { platform: "Twitter", icon: Twitter, connected: false },
];

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          FlowCrest
        </h1>
        <p className="text-muted-foreground text-sm">Automation Platform</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200",
                activeTab === item.id
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="mb-3">
          <h3 className="text-sm font-medium mb-2">Connected Accounts</h3>
          <div className="space-y-2">
            {connectedAccounts.map((account) => {
              const Icon = account.icon;
              return (
                <div
                  key={account.platform}
                  className="flex items-center gap-2 text-sm"
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1">{account.platform}</span>
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      account.connected ? "bg-success" : "bg-muted"
                    )}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <Button variant="outline" size="sm" className="w-full">
          <Plus className="h-4 w-4" />
          Add Account
        </Button>
      </div>
    </div>
  );
}