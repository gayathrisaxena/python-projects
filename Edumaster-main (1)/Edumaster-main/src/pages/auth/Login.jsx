import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { GraduationCap, User, Shield, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      // Navigate based on role
      const role = result.user.role.toLowerCase();
      toast.success('🎉 Welcome back! Login successful.');
      navigate(`/${role}`);
    } else {
      setError(result.error);
      toast.error('❌ ' + (result.error || 'Invalid email or password. Please try again.'));
    }

    setLoading(false);
  };

  const quickLogin = async (role) => {
    let demoEmail = '';
    const demoPassword = 'password123';

    switch (role) {
      case 'student':
        demoEmail = 'student0@edumaster.com';
        break;
      case 'instructor':
        demoEmail = 'john@edumaster.com';
        break;
      case 'admin':
        demoEmail = 'admin@edumaster.com';
        break;
      default:
        return;
    }

    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setLoading(true);

    const result = await login(demoEmail, demoPassword);

    if (result.success) {
      toast.success(`🎉 Welcome! Logged in as ${role}.`);
      navigate(`/${role}`);
    } else {
      setError(result.error);
      toast.error('❌ ' + (result.error || 'Login failed. Please check your credentials.'));
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-bold text-gradient mb-2">EduMaster</h1>
          </Link>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full gradient-primary text-white border-0"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Quick Login Section */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Quick Demo Login
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex flex-col h-auto py-4 hover:border-primary hover:bg-primary/5"
                  onClick={() => quickLogin('student')}
                  disabled={loading}
                >
                  <GraduationCap className="h-6 w-6 mb-2 text-primary" />
                  <span className="text-xs font-semibold">Student</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="flex flex-col h-auto py-4 hover:border-primary hover:bg-primary/5"
                  onClick={() => quickLogin('instructor')}
                  disabled={loading}
                >
                  <User className="h-6 w-6 mb-2 text-primary" />
                  <span className="text-xs font-semibold">Instructor</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="flex flex-col h-auto py-4 hover:border-primary hover:bg-primary/5"
                  onClick={() => quickLogin('admin')}
                  disabled={loading}
                >
                  <Shield className="h-6 w-6 mb-2 text-primary" />
                  <span className="text-xs font-semibold">Admin</span>
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground mt-3">
                Click any role above to auto-login with demo credentials
              </p>
            </div>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link to="/register" className="text-primary hover:underline font-semibold">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials Info */}
        <Card className="mt-4 bg-muted/50">
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground text-center mb-2 font-semibold">
              Demo Credentials:
            </p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>📚 Student: student0@edumaster.com</p>
              <p>👨‍🏫 Instructor: john@edumaster.com</p>
              <p>🛡️ Admin: admin@edumaster.com</p>
              <p className="text-center mt-2">Password: <code className="bg-background px-2 py-0.5 rounded">password123</code></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
