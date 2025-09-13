import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { User, Building2, Copy } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface TestCredentialsProps {
  onFillCredentials: (email: string, password: string, role: 'student' | 'institution') => void;
}

export const TestCredentials: React.FC<TestCredentialsProps> = ({ onFillCredentials }) => {
  const testAccounts = [
    {
      role: 'student' as const,
      email: 'student@test.com',
      password: 'password123',
      name: 'Test Student',
      description: 'Student account - works online & offline'
    },
    {
      role: 'institution' as const,
      email: 'institution@test.com',
      password: 'password123',
      name: 'Test University',
      description: 'Institution account - works online & offline'
    }
  ];

  const handleFillCredentials = (account: typeof testAccounts[0]) => {
    onFillCredentials(account.email, account.password, account.role);
    toast.success(`Filled ${account.role} test credentials`);
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Copied ${label} to clipboard`);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-medium text-foreground/80 mb-2">Test Credentials</h3>
        <p className="text-sm text-muted-foreground">
          Use these test accounts to explore DigiPratibha's features
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {testAccounts.map((account) => (
          <Card key={account.role} className="glass border-purple-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base">
                {account.role === 'student' ? (
                  <User className="w-4 h-4 text-purple-400" />
                ) : (
                  <Building2 className="w-4 h-4 text-pink-400" />
                )}
                <span className="capitalize">{account.role} Account</span>
              </CardTitle>
              <CardDescription className="text-xs">
                {account.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Email:</span>
                  <button
                    onClick={() => copyToClipboard(account.email, 'email')}
                    className="flex items-center space-x-1 text-xs hover:text-purple-400 transition-colors"
                  >
                    <span className="font-mono">{account.email}</span>
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Password:</span>
                  <button
                    onClick={() => copyToClipboard(account.password, 'password')}
                    className="flex items-center space-x-1 text-xs hover:text-purple-400 transition-colors"
                  >
                    <span className="font-mono">{account.password}</span>
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
              
              <Button
                onClick={() => handleFillCredentials(account)}
                className="w-full text-xs py-2 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30"
                variant="outline"
              >
                Use Test {account.role === 'student' ? 'Student' : 'Institution'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center">
        <p className="text-xs text-muted-foreground/60">
          Demo accounts - work both online and offline
        </p>
        <p className="text-xs text-green-400/60 mt-1">
          ✓ All features available in offline mode
        </p>
      </div>
    </div>
  );
};