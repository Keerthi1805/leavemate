import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant: 'blue' | 'orange' | 'green' | 'red';
}

const StatsCard = ({ title, value, icon: Icon, variant }: StatsCardProps) => {
  const iconColors = {
    blue: 'bg-stats-blue',
    orange: 'bg-stats-orange',
    green: 'bg-stats-green',
    red: 'bg-stats-red',
  };

  return (
    <div className="stats-card">
      <div className={cn('stats-icon', iconColors[variant])}>
        <Icon className="h-6 w-6 text-primary-foreground" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
