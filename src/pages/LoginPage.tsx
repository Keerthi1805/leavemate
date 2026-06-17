import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, Clock, BarChart3 } from 'lucide-react';

const DEPARTMENTS = ['Engineering', 'Marketing', 'HR', 'Finance', 'Operations', 'Sales'];

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'admin' | 'employee'>('admin');
  const [employeeMode, setEmployeeMode] = useState<'login' | 'signup'>('login');
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    department: '',
  });
  const { login, signup } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = login(username, password);
      
      if (user) {
        toast({
          title: 'Login Successful',
          description: `Welcome back, ${user.name}!`,
        });
        
        if (user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/employee/dashboard');
        }
      } else {
        toast({
          title: 'Login Failed',
          description: 'Invalid username or password',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred during login',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { user, error } = signup(signupData);
      if (user) {
        toast({
          title: 'Account Created',
          description: `Welcome, ${user.name}!`,
        });
        navigate('/employee/dashboard');
      } else {
        toast({
          title: 'Signup Failed',
          description: error || 'Unable to create account',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: CheckCircle,
      title: 'Simple Leave Management',
      description: 'Apply for leave and track status effortlessly.',
    },
    {
      icon: Clock,
      title: 'Efficient Workflow',
      description: 'Quick approval process for management decisions.',
    },
    {
      icon: BarChart3,
      title: 'Insightful Analytics',
      description: 'Track team availability and leave trends.',
    },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Left side - Login Form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-card p-8">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-primary">LeaveMate</h1>
            <p className="mt-2 text-muted-foreground">Leave Management System</p>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'admin' | 'employee')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="admin" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Admin Login
              </TabsTrigger>
              <TabsTrigger value="employee" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Employee Login
              </TabsTrigger>
            </TabsList>

            <TabsContent value="admin">
              <Card className="border-0 shadow-none">
                <CardContent className="p-0">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        id="username"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-12"
                      />
                    </div>
                    <Button type="submit" className="w-full h-12 text-base font-medium" disabled={isLoading}>
                      {isLoading ? 'Signing in...' : 'Sign in'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="employee">
              <Card className="border-0 shadow-none">
                <CardContent className="p-0">
                  <div className="mb-4 flex rounded-md border border-border p-1">
                    <button
                      type="button"
                      onClick={() => setEmployeeMode('login')}
                      className={`flex-1 rounded py-2 text-sm font-medium transition-colors ${
                        employeeMode === 'login'
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmployeeMode('signup')}
                      className={`flex-1 rounded py-2 text-sm font-medium transition-colors ${
                        employeeMode === 'signup'
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Sign Up
                    </button>
                  </div>

                  {employeeMode === 'login' ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <Input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="h-12"
                      />
                      <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-12"
                      />
                      <Button type="submit" className="w-full h-12 text-base font-medium" disabled={isLoading}>
                        {isLoading ? 'Signing in...' : 'Sign in'}
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleSignup} className="space-y-3">
                      <Input
                        type="text"
                        placeholder="Full name"
                        value={signupData.name}
                        onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                        required
                        className="h-11"
                      />
                      <Input
                        type="email"
                        placeholder="Email"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        required
                        className="h-11"
                      />
                      <Input
                        type="text"
                        placeholder="Username"
                        value={signupData.username}
                        onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                        required
                        className="h-11"
                      />
                      <Select
                        value={signupData.department}
                        onValueChange={(value) => setSignupData({ ...signupData, department: value })}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {DEPARTMENTS.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="password"
                        placeholder="Password"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        required
                        minLength={4}
                        className="h-11"
                      />
                      <Button type="submit" className="w-full h-12 text-base font-medium" disabled={isLoading}>
                        {isLoading ? 'Creating account...' : 'Create account'}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New employees can sign up from the Employee tab.
          </p>
        </div>
      </div>

      {/* Right side - Features */}
      <div className="hidden flex-1 flex-col items-center justify-center bg-header p-8 lg:flex">
        <div className="max-w-md animate-slide-in">
          <h2 className="mb-10 text-4xl font-bold text-header-foreground">
            Welcome to LeaveMate
          </h2>

          <div className="space-y-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
