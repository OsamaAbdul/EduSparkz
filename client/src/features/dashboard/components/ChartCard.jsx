import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart3 } from 'lucide-react';

export const ChartCard = ({ title, description }) => {
  return (
    <Card className="bg-black/50 backdrop-blur-xl border-white/10">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
        <CardDescription className="text-gray-400">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Chart visualization would go here</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};