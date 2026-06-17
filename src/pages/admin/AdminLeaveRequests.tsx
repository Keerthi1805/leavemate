import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Eye, Check, X } from 'lucide-react';
import { getLeaveRequests, updateLeaveStatus, LeaveRequest } from '@/lib/auth';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const AdminLeaveRequests = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const { toast } = useToast();

  const loadRequests = () => {
    const allRequests = getLeaveRequests();
    setRequests(allRequests);
  };

  useEffect(() => {
    loadRequests();
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
    loadRequests();
    setShowDetails(false);
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
    loadRequests();
  };

  const filteredRequests = requests.filter((r) => {
    if (statusFilter === 'all') return true;
    return r.status === statusFilter;
  });

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
        <h1 className="text-2xl font-bold text-foreground">Leave Requests</h1>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Requests</CardTitle>
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
                  <TableHead>Employee</TableHead>
                  <TableHead>Leave Type</TableHead>
                  <TableHead className="hidden md:table-cell">Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.employeeName}</TableCell>
                    <TableCell>{leaveTypeLabels[request.type]}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(new Date(request.startDate), 'MMM d, yyyy')} -{' '}
                      {format(new Date(request.endDate), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
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
                        {request.status === 'pending' && (
                          <>
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
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredRequests.length === 0 && (
              <p className="py-8 text-center text-muted-foreground">No leave requests found</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Details Dialog */}
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
                  <p className="text-muted-foreground">Status</p>
                  {getStatusBadge(selectedRequest.status)}
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
                {selectedRequest.rejectionReason && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Rejection Reason</p>
                    <p className="font-medium text-destructive">{selectedRequest.rejectionReason}</p>
                  </div>
                )}
              </div>

              {selectedRequest.status === 'pending' && (
                <>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Rejection Reason (required to reject)</p>
                    <Textarea
                      placeholder="Enter reason for rejection..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowDetails(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-stats-green hover:bg-stats-green/90"
                      onClick={() => handleApprove(selectedRequest)}
                    >
                      <Check className="h-4 w-4 mr-1" /> Approve
                    </Button>
                    <Button variant="destructive" onClick={() => handleReject(selectedRequest)}>
                      <X className="h-4 w-4 mr-1" /> Reject
                    </Button>
                  </div>
                </>
              )}

              {selectedRequest.status !== 'pending' && (
                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => setShowDetails(false)}>
                    Close
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminLeaveRequests;
