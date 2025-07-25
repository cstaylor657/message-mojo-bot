import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Bot,
  MessageSquare,
  Users,
  Zap,
  Plus,
  Settings,
  Play,
  Pause,
  ArrowRight,
  Heart,
  MessageCircle,
  UserPlus
} from "lucide-react";

const automationRules = [
  {
    id: 1,
    name: "Welcome DM for New Followers",
    trigger: "New follower",
    action: "Send welcome message",
    platforms: ["Instagram"],
    status: "active",
    triggered: 45,
    description: "Automatically send a personalized welcome message to new followers"
  },
  {
    id: 2,
    name: "Comment Reply Bot",
    trigger: "Comment with keyword",
    action: "Auto reply with template",
    platforms: ["Facebook", "Instagram"],
    status: "active",
    triggered: 128,
    description: "Respond to comments containing specific keywords"
  },
  {
    id: 3,
    name: "Lead Generation DM",
    trigger: "Story interaction",
    action: "Send product info DM",
    platforms: ["Instagram"],
    status: "paused",
    triggered: 67,
    description: "Send product information to users who interact with stories"
  }
];

const triggerTypes = [
  { id: "new_follower", label: "New Follower", icon: UserPlus },
  { id: "comment", label: "Comment with Keyword", icon: MessageCircle },
  { id: "story_view", label: "Story View", icon: Heart },
  { id: "dm_received", label: "DM Received", icon: MessageSquare }
];

const actionTypes = [
  { id: "send_dm", label: "Send DM" },
  { id: "reply_comment", label: "Reply to Comment" },
  { id: "add_to_list", label: "Add to Contact List" },
  { id: "tag_user", label: "Tag User" }
];

export function AutomationRules() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRule, setNewRule] = useState({
    name: "",
    trigger: "",
    action: "",
    message: "",
    keywords: ""
  });

  const toggleRuleStatus = (ruleId: number) => {
    console.log(`Toggling rule ${ruleId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Automation Rules</h1>
          <p className="text-muted-foreground">Create and manage automated responses and actions.</p>
        </div>
        <Button 
          variant="gradient" 
          className="gap-2"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <Plus className="h-4 w-4" />
          Create Rule
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Create New Automation Rule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Rule Name</label>
              <Input 
                placeholder="Enter a descriptive name for your rule"
                value={newRule.name}
                onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Trigger</label>
                <div className="space-y-2">
                  {triggerTypes.map((trigger) => {
                    const Icon = trigger.icon;
                    return (
                      <button
                        key={trigger.id}
                        onClick={() => setNewRule(prev => ({ ...prev, trigger: trigger.id }))}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                          newRule.trigger === trigger.id
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border hover:bg-accent"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {trigger.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Action</label>
                <div className="space-y-2">
                  {actionTypes.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => setNewRule(prev => ({ ...prev, action: action.id }))}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                        newRule.action === action.id
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:bg-accent"
                      }`}
                    >
                      <ArrowRight className="h-4 w-4" />
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {newRule.trigger === "comment" && (
              <div>
                <label className="text-sm font-medium mb-2 block">Keywords (comma separated)</label>
                <Input 
                  placeholder="help, support, question"
                  value={newRule.keywords}
                  onChange={(e) => setNewRule(prev => ({ ...prev, keywords: e.target.value }))}
                />
              </div>
            )}

            {(newRule.action === "send_dm" || newRule.action === "reply_comment") && (
              <div>
                <label className="text-sm font-medium mb-2 block">Message Template</label>
                <textarea
                  className="w-full p-3 rounded-lg border border-border bg-background min-h-[100px]"
                  placeholder="Hi {{user}}, thanks for following! Welcome to our community..."
                  value={newRule.message}
                  onChange={(e) => setNewRule(prev => ({ ...prev, message: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use {`{user}`} for username, {`{first_name}`} for first name
                </p>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
              <Button variant="gradient">
                Create Rule
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {automationRules.map((rule) => (
          <Card key={rule.id} className="hover:shadow-[var(--shadow-card)] transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{rule.name}</h3>
                    <Badge variant={rule.status === "active" ? "default" : "secondary"}>
                      {rule.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{rule.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-warning" />
                      <span>Trigger: {rule.trigger}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-info" />
                      <span>Action: {rule.action}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-success" />
                      <span>{rule.triggered} triggered</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch 
                    checked={rule.status === "active"}
                    onCheckedChange={() => toggleRuleStatus(rule.id)}
                  />
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {rule.platforms.map((platform) => (
                  <Badge key={platform} variant="outline">
                    {platform}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}