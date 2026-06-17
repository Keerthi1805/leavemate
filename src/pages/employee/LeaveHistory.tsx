import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { getEmployeeLeaveRequests, LeaveRequest } from '@/lib/auth';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const LeaveHistory = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (user) {
      const employeeRequests = getEmployeeLeaveRequests(user.id);
      setRequests(employeeRequests);
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

  const filteredRequests = requests.filter((r) => {
    if (statusFilter === 'all') return true;
    return r.status === statusFilter;
  });

  const calculateDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Leave History</h1>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>My Leave Requests</CardTitle>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="hidden sm:table-cell">Days</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Applied On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      {leaveTypeLabels[request.type]}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{format(new Date(request.startDate), 'MMM d, yyyy')}</p>
                        <p className="text-muted-foreground">
                          to {format(new Date(request.endDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {calculateDays(request.startDate, request.endDate)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(request.status)}
                      {request.rejectionReason && (
                        <p className="mt-1 text-xs text-destructive">{request.rejectionReason}</p>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {format(new Date(request.appliedOn), 'MMM d, yyyy')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredRequests.length === 0 && (
              <p className="py-8 text-center text-muted-foreground">
                No leave requests found
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default LeaveHistory;
