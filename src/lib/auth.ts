export type UserRole = 'admin' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  department: string;
  status: 'active' | 'inactive';
  leaveBalance: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  type: 'sick' | 'casual' | 'annual' | 'personal';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedOn: string;
  rejectionReason?: string;
}

// Default admin user
const DEFAULT_ADMIN: User = {
  id: 'admin-1',
  name: 'Administrator',
  email: 'admin@esyleave.com',
  username: 'admin',
  role: 'admin',
  department: 'Administration',
  status: 'active',
  leaveBalance: 0,
};

// Default employees
const DEFAULT_EMPLOYEES: User[] = [
  {
    id: 'emp-1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    username: 'john',
    role: 'employee',
    department: 'Engineering',
    status: 'active',
    leaveBalance: 20,
  },
  {
    id: 'emp-2',
    name: 'Neha Sharma',
    email: 'neha@example.com',
    username: 'neha',
    role: 'employee',
    department: 'Marketing',
    status: 'active',
    leaveBalance: 18,
  },
  {
    id: 'emp-3',
    name: 'Khushi Patel',
    email: 'khushi@example.com',
    username: 'khushi',
    role: 'employee',
    department: 'HR',
    status: 'active',
    leaveBalance: 20,
  },
];

// Default leave requests
const DEFAULT_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'leave-1',
    employeeId: 'emp-3',
    employeeName: 'Khushi Patel',
    department: 'HR',
    type: 'sick',
    startDate: '2025-04-16',
    endDate: '2025-04-19',
    reason: 'Not feeling well',
    status: 'pending',
    appliedOn: '2025-04-15',
  },
  {
    id: 'leave-2',
    employeeId: 'emp-2',
    employeeName: 'Neha Sharma',
    department: 'Marketing',
    type: 'personal',
    startDate: '2025-04-16',
    endDate: '2025-04-21',
    reason: 'Family function',
    status: 'pending',
    appliedOn: '2025-04-14',
  },
  {
    id: 'leave-3',
    employeeId: 'emp-2',
    employeeName: 'Neha Sharma',
    department: 'Marketing',
    type: 'sick',
    startDate: '2025-04-10',
    endDate: '2025-04-12',
    reason: 'Medical checkup',
    status: 'approved',
    appliedOn: '2025-04-08',
  },
];

// Initialize data in localStorage
export const initializeData = () => {
  if (!localStorage.getItem('esy_users')) {
    localStorage.setItem('esy_users', JSON.stringify([DEFAULT_ADMIN, ...DEFAULT_EMPLOYEES]));
  }
  if (!localStorage.getItem('esy_leave_requests')) {
    localStorage.setItem('esy_leave_requests', JSON.stringify(DEFAULT_LEAVE_REQUESTS));
  }
  if (!localStorage.getItem('esy_passwords')) {
    localStorage.setItem('esy_passwords', JSON.stringify({
      'admin': '1234',
      'john': '545454',
      'neha': 'password',
      'khushi': 'password',
    }));
  }
};

// Auth functions
export const login = (username: string, password: string): User | null => {
  initializeData();
  const users: User[] = JSON.parse(localStorage.getItem('esy_users') || '[]');
  const passwords: Record<string, string> = JSON.parse(localStorage.getItem('esy_passwords') || '{}');
  
  const user = users.find(u => u.username === username);
  if (user && passwords[username] === password) {
    localStorage.setItem('esy_current_user', JSON.stringify(user));
    return user;
  }
  return null;
};

export interface SignupInput {
  name: string;
  email: string;
  username: string;
  password: string;
  department: string;
}

export const signup = (input: SignupInput): { user: User | null; error?: string } => {
  initializeData();
  const users: User[] = JSON.parse(localStorage.getItem('esy_users') || '[]');
  const passwords: Record<string, string> = JSON.parse(localStorage.getItem('esy_passwords') || '{}');

  const uname = input.username.trim().toLowerCase();
  if (!uname || !input.password || !input.name.trim() || !input.email.trim() || !input.department) {
    return { user: null, error: 'All fields are required.' };
  }
  if (users.some(u => u.username.toLowerCase() === uname)) {
    return { user: null, error: 'Username already exists.' };
  }
  if (users.some(u => u.email.toLowerCase() === input.email.trim().toLowerCase())) {
    return { user: null, error: 'Email already registered.' };
  }

  const newUser: User = {
    id: `emp-${Date.now()}`,
    name: input.name.trim(),
    email: input.email.trim(),
    username: uname,
    role: 'employee',
    department: input.department,
    status: 'active',
    leaveBalance: 20,
  };

  users.push(newUser);
  passwords[uname] = input.password;
  localStorage.setItem('esy_users', JSON.stringify(users));
  localStorage.setItem('esy_passwords', JSON.stringify(passwords));
  localStorage.setItem('esy_current_user', JSON.stringify(newUser));

  return { user: newUser };
};

export const logout = () => {
  localStorage.removeItem('esy_current_user');
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('esy_current_user');
  return userStr ? JSON.parse(userStr) : null;
};

// Employee functions
export const getEmployees = (): User[] => {
  initializeData();
  const users: User[] = JSON.parse(localStorage.getItem('esy_users') || '[]');
  return users.filter(u => u.role === 'employee');
};

export const addEmployee = (employee: Omit<User, 'id' | 'role' | 'leaveBalance'>, password: string): User => {
  const users: User[] = JSON.parse(localStorage.getItem('esy_users') || '[]');
  const passwords: Record<string, string> = JSON.parse(localStorage.getItem('esy_passwords') || '{}');
  
  const newEmployee: User = {
    ...employee,
    id: `emp-${Date.now()}`,
    role: 'employee',
    leaveBalance: 20,
  };
  
  users.push(newEmployee);
  passwords[employee.username] = password;
  
  localStorage.setItem('esy_users', JSON.stringify(users));
  localStorage.setItem('esy_passwords', JSON.stringify(passwords));
  
  return newEmployee;
};

export const updateEmployee = (id: string, updates: Partial<User>): User | null => {
  const users: User[] = JSON.parse(localStorage.getItem('esy_users') || '[]');
  const index = users.findIndex(u => u.id === id);
  
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    localStorage.setItem('esy_users', JSON.stringify(users));
    return users[index];
  }
  return null;
};

export const deleteEmployee = (id: string): boolean => {
  const users: User[] = JSON.parse(localStorage.getItem('esy_users') || '[]');
  const filtered = users.filter(u => u.id !== id);
  localStorage.setItem('esy_users', JSON.stringify(filtered));
  return filtered.length < users.length;
};

// Leave request functions
export const getLeaveRequests = (): LeaveRequest[] => {
  initializeData();
  return JSON.parse(localStorage.getItem('esy_leave_requests') || '[]');
};

export const getEmployeeLeaveRequests = (employeeId: string): LeaveRequest[] => {
  const requests = getLeaveRequests();
  return requests.filter(r => r.employeeId === employeeId);
};

export const applyLeave = (request: Omit<LeaveRequest, 'id' | 'appliedOn' | 'status'>): LeaveRequest => {
  const requests = getLeaveRequests();
  
  const newRequest: LeaveRequest = {
    ...request,
    id: `leave-${Date.now()}`,
    status: 'pending',
    appliedOn: new Date().toISOString().split('T')[0],
  };
  
  requests.unshift(newRequest);
  localStorage.setItem('esy_leave_requests', JSON.stringify(requests));
  
  return newRequest;
};

export const updateLeaveStatus = (id: string, status: 'approved' | 'rejected', rejectionReason?: string): LeaveRequest | null => {
  const requests: LeaveRequest[] = getLeaveRequests();
  const index = requests.findIndex(r => r.id === id);
  
  if (index !== -1) {
    requests[index].status = status;
    if (rejectionReason) {
      requests[index].rejectionReason = rejectionReason;
    }
    
    // Update leave balance if approved
    if (status === 'approved') {
      const users: User[] = JSON.parse(localStorage.getItem('esy_users') || '[]');
      const userIndex = users.findIndex(u => u.id === requests[index].employeeId);
      if (userIndex !== -1) {
        const start = new Date(requests[index].startDate);
        const end = new Date(requests[index].endDate);
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        users[userIndex].leaveBalance = Math.max(0, users[userIndex].leaveBalance - days);
        localStorage.setItem('esy_users', JSON.stringify(users));
      }
    }
    
    localStorage.setItem('esy_leave_requests', JSON.stringify(requests));
    return requests[index];
  }
  return null;
};

// Stats functions
export const getAdminStats = () => {
  const employees = getEmployees();
  const requests = getLeaveRequests();
  
  return {
    totalEmployees: employees.length,
    pendingRequests: requests.filter(r => r.status === 'pending').length,
    approvedLeaves: requests.filter(r => r.status === 'approved').length,
    rejectedLeaves: requests.filter(r => r.status === 'rejected').length,
    recentActivity: requests.slice(0, 5),
  };
};

export const getEmployeeStats = (employeeId: string) => {
  const users: User[] = JSON.parse(localStorage.getItem('esy_users') || '[]');
  const user = users.find(u => u.id === employeeId);
  const requests = getEmployeeLeaveRequests(employeeId);
  
  const approvedRequests = requests.filter(r => r.status === 'approved');
  const usedDays = approvedRequests.reduce((total, r) => {
    const start = new Date(r.startDate);
    const end = new Date(r.endDate);
    return total + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }, 0);
  
  return {
    availableLeaveDays: user?.leaveBalance || 20,
    pendingRequests: requests.filter(r => r.status === 'pending').length,
    usedLeaveDays: usedDays,
    recentLeaves: requests.slice(0, 5),
  };
};
