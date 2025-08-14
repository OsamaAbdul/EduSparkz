import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp } from 'lucide-react';

export const StatCard = ({ title, value, change, icon: Icon }) => {
  return (
    <Card className="bg-black/50 backdrop-blur-xl border-white/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
        <Icon className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        <p className="text-xs text-green-400 flex items-center">
          <TrendingUp className="w-3 h-3 mr-1" />
          {change} from last month
        </p>
      </CardContent>
    </Card>
  );
};