import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { GraduationCap, Building2, Github, Mail, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { TestCredentials } from './TestCredentials';

interface LoginPageProps {
  onLogin: (role: 'student' | 'institution', userData: any) => void;
  onRegister?: (userData: {
    name: string;
    email: string;
    password: string;
    role: 'student' | 'institution';
    institutionName?: string;
    department?: string;
  }) => void;
  defaultRole?: 'student' | 'institution' | null;
  onBack?: () => void;
}

export function LoginPage({ onLogin, onRegister, defaultRole, onBack }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<'student' | 'institution'>(defaultRole || 'student');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    institutionName: '',
    department: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isSignUp && onRegister) {
        // Registration
        await onRegister({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: selectedRole,
          institutionName: selectedRole === 'institution' ? formData.institutionName : undefined,
          department: selectedRole === 'student' ? formData.department : undefined
        });
      } else {
        // Login
        await onLogin(selectedRole, {
          email: formData.email,
          password: formData.password
        });
      }
    } catch (error: any) {
      setError(error.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Mock social login
    const userData = {
      id: Date.now().toString(),
      email: `user@${provider}.com`,
      name: `${provider} User`,
      role: selectedRole,
      institution: selectedRole === 'institution' ? 'Sample University' : ''
    };
    onLogin(selectedRole, userData);
  };

  const handleTestCredentialsFill = (email: string, password: string, role: 'student' | 'institution') => {
    setFormData(prev => ({
      ...prev,
      email,
      password
    }));
    setSelectedRole(role);
    setIsSignUp(false); // Switch to login tab
  };

  useEffect(() => {
    if (defaultRole) {
      setSelectedRole(defaultRole);
    }
  }, [defaultRole]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 dark">
      <div className="w-full max-w-md space-y-8">
        {/* Back Button */}
        {onBack && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        )}

        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">DigiPratibha</h1>
            <p className="text-muted-foreground mt-2">No-code Digital Portfolio for Students</p>
          </div>
        </div>

        {/* Role Selection */}
        <Card className="glass border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Choose Your Role</CardTitle>
            <CardDescription>Select how you want to use DigiPratibha</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Button
                variant={selectedRole === 'student' ? 'default' : 'outline'}
                className={`h-20 flex flex-col gap-2 ${
                  selectedRole === 'student' ? 'gradient-primary text-white' : ''
                }`}
                onClick={() => setSelectedRole('student')}
              >
                <GraduationCap className="w-6 h-6" />
                <span>Student</span>
              </Button>
              <Button
                variant={selectedRole === 'institution' ? 'default' : 'outline'}
                className={`h-20 flex flex-col gap-2 ${
                  selectedRole === 'institution' ? 'gradient-primary text-white' : ''
                }`}
                onClick={() => setSelectedRole('institution')}
              >
                <Building2 className="w-6 h-6" />
                <span>Institution</span>
              </Button>
            </div>

            {/* Auth Tabs */}
            <Tabs value={isSignUp ? 'signup' : 'login'} onValueChange={(v) => setIsSignUp(v === 'signup')}>
              <TabsList className="grid w-full grid-cols-2 glass">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="glass border-0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        className="glass border-0 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full gradient-primary text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing In...' : `Sign In as ${selectedRole === 'student' ? 'Student' : 'Institution'}`}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="glass border-0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="glass border-0"
                      required
                    />
                  </div>
                  {selectedRole === 'institution' && (
                    <div className="space-y-2">
                      <Label htmlFor="institution">Institution Name</Label>
                      <Input
                        id="institution"
                        type="text"
                        placeholder="Enter institution name"
                        value={formData.institutionName}
                        onChange={(e) => setFormData(prev => ({ ...prev, institutionName: e.target.value }))}
                        className="glass border-0"
                        required
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        className="glass border-0 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full gradient-primary text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : `Create ${selectedRole === 'student' ? 'Student' : 'Institution'} Account`}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Test Credentials Component */}
            <TestCredentials onFillCredentials={handleTestCredentialsFill} />

            {/* Social Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-muted" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin('google')}
                  className="glass border-0"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Google
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin('github')}
                  className="glass border-0"
                >
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
              </div>
            </div>

            {/* Forgot Password */}
            {!isSignUp && (
              <div className="text-center mt-4">
                <Button variant="link" className="text-sm text-muted-foreground">
                  Forgot your password?
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}