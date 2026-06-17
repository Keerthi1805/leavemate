import { LeaveRequest } from '@/lib/auth';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ActivityItemProps {
  request: LeaveRequest;
}

const ActivityItem = ({ request }: ActivityItemProps) => {
  const leaveTypeLabels: Record<string, string> = {
    sick: 'Sick Leave',
    casual: 'Casual Leave',
    annual: 'Annual Leave',
    personal: 'Personal Leave',
  };

  const statusConfig = {
    pending: { icon: Clock, color: 'text-primary', badge: 'status-pending' },
    approved: { icon: CheckCircle, color: 'text-stats-green', badge: 'status-approved' },
    rejected: { icon: XCircle, color: 'text-stats-red', badge: 'status-rejected' },
  };

  const config = statusConfig[request.status];
  const Icon = config.icon;

  return (
    <div className="flex items-center justify-between border-b border-border py-4 last:border-0">
      <div className="flex items-center gap-4">
        <Icon className={cn('h-8 w-8', config.color)} />
        <div>
          <p className="font-medium text-foreground">
            {request.employeeName} submitted a {leaveTypeLabels[request.type]} request
          </p>
          <p className="text-sm text-muted-foreground">
            {format(new Date(request.startDate), 'MMM d, yyyy')} - {format(new Date(request.endDate), 'MMM d, yyyy')}
          </p>
        </div>
      </div>
      <span className={cn('status-badge capitalize', config.badge)}>
        {request.status}
      </span>
    </div>
  );
};

export default ActivityItem;
