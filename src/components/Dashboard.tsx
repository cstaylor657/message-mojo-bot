import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Calendar,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const stats = [
  {
    title: "Total Posts Scheduled",
    value: "142",
    change: "+12%",
    icon: Calendar,
    color: "text-info"
  },
  {
    title: "Active Automations",
    value: "8",
    change: "+2",
    icon: Activity,
    color: "text-success"
  },
  {
    title: "Messages Sent",
    value: "1,284",
    change: "+24%",
    icon: MessageCircle,
    color: "text-primary"
  },
  {
    title: "Engagement Rate",
    value: "4.8%",
    change: "+0.4%",
    icon: TrendingUp,
    color: "text-warning"
  }
];

const recentActivity = [
  {
    type: "scheduled",
    message: "Post scheduled for Instagram",
    time: "2 minutes ago",
    icon: Calendar,
    status: "pending"
  },
  {
    type: "automation",
    message: "DM automation triggered for 15 users",
    time: "15 minutes ago",
    icon: MessageCircle,
    status: "success"
  },
  {
    type: "post",
    message: "Facebook post published successfully",
    time: "1 hour ago",
    icon: CheckCircle,
    status: "success"
  },
  {
    type: "error",
    message: "Twitter API rate limit reached",
    time: "2 hours ago",
    icon: AlertCircle,
    status: "error"
  }
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your automation overview.</p>
        </div>
        <Button variant="gradient" className="gap-2">
          <Calendar className="h-4 w-4" />
          Schedule Post
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-[var(--shadow-card)] transition-all duration-300 hover:scale-[1.02]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-success">
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent transition-colors">
                    <div className={`p-2 rounded-full bg-${activity.status === 'success' ? 'success' : activity.status === 'error' ? 'destructive' : 'muted'}/10`}>
                      <Icon className={`h-4 w-4 ${
                        activity.status === 'success' ? 'text-success' : 
                        activity.status === 'error' ? 'text-destructive' : 
                        'text-muted-foreground'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Calendar className="h-4 w-4" />
              Create New Post
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Activity className="h-4 w-4" />
              Setup Automation
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <MessageCircle className="h-4 w-4" />
              View Messages
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Users className="h-4 w-4" />
              Audience Insights
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}