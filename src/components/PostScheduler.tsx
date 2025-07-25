import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Clock,
  Image,
  Send,
  Instagram,
  Facebook,
  Twitter,
  Plus,
  Edit,
  Trash2
} from "lucide-react";

const scheduledPosts = [
  {
    id: 1,
    content: "Exciting news! Our new feature is launching next week. Stay tuned! 🚀",
    platforms: ["Instagram", "Facebook"],
    scheduledTime: "2024-01-15 14:30",
    status: "scheduled",
    image: true
  },
  {
    id: 2,
    content: "Behind the scenes: Team collaboration at its finest. #teamwork #productivity",
    platforms: ["Twitter", "Instagram"],
    scheduledTime: "2024-01-16 09:00",
    status: "scheduled",
    image: false
  },
  {
    id: 3,
    content: "Customer success story: How @company increased their ROI by 300%",
    platforms: ["Facebook"],
    scheduledTime: "2024-01-14 18:00",
    status: "published",
    image: true
  }
];

const platformIcons = {
  Instagram: Instagram,
  Facebook: Facebook,
  Twitter: Twitter
};

export function PostScheduler() {
  const [newPost, setNewPost] = useState({
    content: "",
    scheduledTime: "",
    platforms: [] as string[]
  });

  const handlePlatformToggle = (platform: string) => {
    setNewPost(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Post Scheduler</h1>
          <p className="text-muted-foreground">Schedule and manage your social media posts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Post
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Content</label>
              <Textarea
                placeholder="What's happening?"
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Platforms</label>
              <div className="flex gap-2">
                {Object.entries(platformIcons).map(([platform, Icon]) => (
                  <button
                    key={platform}
                    onClick={() => handlePlatformToggle(platform)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                      newPost.platforms.includes(platform)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {platform}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Date</label>
                <Input type="date" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Time</label>
                <Input type="time" />
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 gap-2">
                <Image className="h-4 w-4" />
                Add Media
              </Button>
              <Button variant="gradient" className="flex-1 gap-2">
                <Calendar className="h-4 w-4" />
                Schedule Post
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scheduled Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scheduledPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex gap-2">
                      {post.platforms.map((platform) => {
                        const Icon = platformIcons[platform as keyof typeof platformIcons];
                        return (
                          <div key={platform} className="p-1.5 bg-primary/10 rounded">
                            <Icon className="h-3 w-3 text-primary" />
                          </div>
                        );
                      })}
                    </div>
                    <Badge variant={post.status === "published" ? "default" : "secondary"}>
                      {post.status}
                    </Badge>
                  </div>

                  <p className="text-sm mb-3 line-clamp-2">{post.content}</p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {post.scheduledTime}
                      {post.image && (
                        <>
                          <span>•</span>
                          <Image className="h-3 w-3" />
                          Media
                        </>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}