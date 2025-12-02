import { memo } from 'react';
import { Card, CardContent } from "./ui/card";
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  iconColor?: string;
}

export const StatsCard = memo(function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  iconColor = "#A00000" 
}: StatsCardProps) {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-[#1a1a1a]">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-[#404040] dark:text-gray-400 mb-1 truncate">{title}</p>
            <p className="text-[#262930] dark:text-white mb-2 truncate">{value}</p>
            {trend && (
              <div className="flex items-center gap-1 flex-wrap">
                <span 
                  className={`text-xs ${trend.value >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {trend.value >= 0 ? '+' : ''}{trend.value}%
                </span>
                <span className="text-xs text-[#404040] dark:text-gray-400">{trend.label}</span>
              </div>
            )}
          </div>
          <div 
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${iconColor}15` }}
          >
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: iconColor }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
