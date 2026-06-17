import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getEmployeeStats, getEmployeeLeaveRequests, LeaveRequest } from '@/lib/auth';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    availableLeaveDays: 20,
    pendingRequests: 0,
    usedLeaveDays: 0,
    recentLeaves: [] as LeaveRequest[],
  });

  useEffect(() => {
    if (user) {
      const employeeStats = getEmployeeStats(user.id);
      setStats(employeeStats);
    }
  }, [user]);

  const leaveTypeLabels: Record<string, string> = {
    sick: 'Sick Leave',
    casual: 'Casual Leave',
    annual: 'Annual Leave',
    personal: 'Personal Leave',
  };

  const getStatusBadge = (status: string) => {
    const badgeClass = {
      pending: 'status-pending',
      approved: 'status-approved',
      rejected: 'status-rejected',
    }[status];

    return (
      <Badge variant="outline" className={cn('capitalize', badgeClass)}>
        {status}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">My Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="Available Leave Days"
            value={stats.availableLeaveDays}
            icon={CalendarDays}
            variant="blue"
          />
          <StatsCard
            title="Pending Requests"
            value={stats.pendingRequests}
            icon={Clock}
            variant="orange"
          />
          <StatsCard
            title="Used Leave Days"
            value={stats.usedLeaveDays}
            icon={CheckCircle}
            variant="green"
          />
        </div>

        {/* Recent Leave Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Leave Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentLeaves.length > 0 ? (
              <div className="space-y-4">
                {stats.recentLeaves.map((leave) => (
                  <div
                    key={leave.id}
                    className="flex flex-col gap-2 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                          {leaveTypeLabels[leave.type]}
                        </span>
                        {getStatusBadge(leave.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(leave.startDate), 'MMM d, yyyy')} -{' '}
                        {format(new Date(leave.endDate), 'MMM d, yyyy')}
                      </p>
                      {leave.reason && (
                        <p className="text-sm text-muted-foreground">Reason: {leave.reason}</p>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Applied on {format(new Date(leave.appliedOn), 'MMM d, yyyy')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-muted-foreground">
                No recent leave applications
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
