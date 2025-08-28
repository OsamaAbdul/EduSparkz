import { Badge } from "@/components/ui/badge";

export const ActivityItem = ({ action, time, type }) => {
  const badgeStyles = {
    user: 'border-blue-500 text-blue-400',
    payment: 'border-green-500 text-green-400',
    system: 'border-purple-500 text-purple-400',
    upgrade: 'border-yellow-500 text-yellow-400',
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
      <div>
        <p className="text-white text-sm">{action}</p>
        <p className="text-gray-400 text-xs">{time}</p>
      </div>
      <Badge variant="outline" className={badgeStyles[type] || ''}>
        {type}
      </Badge>
    </div>
  );
};