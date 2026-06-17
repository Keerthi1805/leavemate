import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import ActivityItem from '@/components/dashboard/ActivityItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Users, Clock, CheckCircle, Eye, Check, X } from 'lucide-react';
import { getAdminStats, getLeaveRequests, updateLeaveStatus, LeaveRequest } from '@/lib/auth';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingRequests: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0,
    recentActivity: [] as LeaveRequest[],
  });
  const [pendingRequests, setPendingRequests] = useState<LeaveRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const { toast } = useToast();

  const loadData = () => {
    const adminStats = getAdminStats();
    setStats(adminStats);
    const allRequests = getLeaveRequests();
    setPendingRequests(allRequests.filter((r) => r.status === 'pending'));
  };

  useEffect(() => {
    loadData();
  }, []);

  const leaveTypeLabels: Record<string, string> = {
    sick: 'Sick Leave',
    casual: 'Casual Leave',
    annual: 'Annual Leave',
    personal: 'Personal Leave',
  };

  const handleApprove = (request: LeaveRequest) => {
    updateLeaveStatus(request.id, 'approved');
    toast({
      title: 'Leave Approved',
      description: `${request.employeeName}'s leave request has been approved.`,
    });
    loadData();
  };

  const handleReject = (request: LeaveRequest) => {
    if (!rejectionReason.trim()) {
      toast({
        title: 'Rejection Reason Required',
        description: 'Please provide a reason for rejection.',
        variant: 'destructive',
      });
      return;
    }
    updateLeaveStatus(request.id, 'rejected', rejectionReason);
    toast({
      title: 'Leave Rejected',
      description: `${request.employeeName}'s leave request has been rejected.`,
    });
    setRejectionReason('');
    setShowDetails(false);
    loadData();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="Total Employees"
            value={stats.totalEmployees}
            icon={Users}
            variant="blue"
          />
          <StatsCard
            title="Pending Requests"
            value={stats.pendingRequests}
            icon={Clock}
            variant="orange"
          />
          <StatsCard
            title="Approved Leaves"
            value={stats.approvedLeaves}
            icon={CheckCircle}
            variant="green"
          />
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentActivity.length > 0 ? (
              <div className="divide-y divide-border">
                {stats.recentActivity.map((activity) => (
                  <ActivityItem key={activity.id} request={activity} />
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-muted-foreground">No recent activities</p>
            )}
          </CardContent>
        </Card>

        {/* Leave Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingRequests.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.employeeName}</TableCell>
                      <TableCell>{leaveTypeLabels[request.type]}</TableCell>
                      <TableCell>
                        {format(new Date(request.startDate), 'MMM d, yyyy')} -{' '}
                        {format(new Date(request.endDate), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="status-pending capitalize">
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowDetails(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-stats-green hover:text-stats-green"
                            onClick={() => handleApprove(request)}
                          >
                            <Check className="h-4 w-4 mr-1" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowDetails(true);
                            }}
                          >
                            <X className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="py-8 text-center text-muted-foreground">No pending leave requests</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* View/Reject Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Request Details</DialogTitle>
            <DialogDescription>
              Review the leave request from {selectedRequest?.employeeName}
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Employee</p>
                  <p className="font-medium">{selectedRequest.employeeName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Department</p>
                  <p className="font-medium">{selectedRequest.department}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Leave Type</p>
                  <p className="font-medium">{leaveTypeLabels[selectedRequest.type]}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Applied On</p>
                  <p className="font-medium">
                    {format(new Date(selectedRequest.appliedOn), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium">
                    {format(new Date(selectedRequest.startDate), 'MMM d, yyyy')} -{' '}
                    {format(new Date(selectedRequest.endDate), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Reason</p>
                  <p className="font-medium">{selectedRequest.reason || 'Not specified'}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Rejection Reason (required to reject)</p>
                <Textarea
                  placeholder="Enter reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDetails(false);
                    setRejectionReason('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-stats-green hover:bg-stats-green/90"
                  onClick={() => {
                    handleApprove(selectedRequest);
                    setShowDetails(false);
                  }}
                >
                  <Check className="h-4 w-4 mr-1" /> Approve
                </Button>
                <Button variant="destructive" onClick={() => handleReject(selectedRequest)}>
                  <X className="h-4 w-4 mr-1" /> Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminDashboard;
