import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ActivityItem } from './ActivityItem.jsx';

export const ActivityCard = () => {
  return (
    <Card className="bg-black/50 backdrop-blur-xl border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Recent Activity</CardTitle>
        <CardDescription className="text-gray-400">Latest updates and notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
         
        </div>
      </CardContent>
    </Card>
  );
};