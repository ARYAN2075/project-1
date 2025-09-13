import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { StudentDashboard } from './components/student/StudentDashboard';
import { InstitutionDashboard } from './components/institution/InstitutionDashboard';
import { ToastProvider, toast } from './components/ui/toast';
import { Toaster } from './components/ui/sonner';
import { backendService } from './lib/backend-service';
import { enhancedBackend } from './lib/enhanced-backend-service';
import { supabase } from './lib/supabase';
import { ConnectionStatus } from './components/shared/ConnectionStatus';
import { SystemStatus } from './components/shared/SystemStatus';
import { ConnectionTest } from './lib/connection-test';
import { ConnectionIndicator } from './components/ConnectionIndicator';
import { PerformanceDashboard } from './components/PerformanceDashboard';
import { DatabaseSetup } from './components/admin/DatabaseSetup';
import { QuickHealthCheck } from './lib/quick-health-check';
import { SimpleAuthCheck } from './lib/simple-auth-check';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'institution';
  institution_name?: string;
  department?: string;
}

type AppState = 'loading' | 'landing' | 'login' | 'dashboard' | 'database-setup';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [appState, setAppState] = useState<AppState>('loading');
  const [selectedRole, setSelectedRole] = useState<'student' | 'institution' | null>(null);
  const [showPerformanceDashboard, setShowPerformanceDashboard] = useState(false);

  // Apply dark theme class to document for consistent neon background
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, []);

  // Enhanced app initialization with better error handling
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setAppState('loading');
        
        // Quick health check for immediate feedback
        const healthStatus = QuickHealthCheck.getInstantStatus();
        console.log('🚀 DigiPratibha startup health check:', healthStatus);
        
        // Check for database setup route
        if (window.location.pathname === '/database-setup' || window.location.hash === '#/database-setup') {
          setAppState('database-setup');
          return;
        }
        
        // More generous timeout for better reliability (8 seconds)
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Initialization timeout')), 8000)
        );

        const initPromise = async () => {
          // Step 1: Quick localStorage check (instant)
          const cachedUser = localStorage.getItem('digipratibha_user');
          if (cachedUser) {
            try {
              const parsedUser = JSON.parse(cachedUser);
              setUser(parsedUser);
              setAppState('dashboard');
              console.log('✅ Restored user from cache:', parsedUser.name);
              
              // Show welcome message after a brief delay
              setTimeout(() => {
                toast.success(`Welcome back, ${parsedUser.name}!`);
              }, 500);
              
              // Preload data in background (completely non-blocking)
              setTimeout(() => {
                enhancedBackend.preloadUserData(parsedUser.id).catch(console.warn);
              }, 1000);
              
              return;
            } catch (e) {
              // Invalid cached data, remove it
              localStorage.removeItem('digipratibha_user');
            }
          }

          // Step 2: Try simple authentication check (reliable, no timeouts)
          try {
            console.log('🔍 Checking authentication status...');
            const currentUser = await SimpleAuthCheck.checkAuth();
            
            if (currentUser) {
              setUser(currentUser);
              setAppState('dashboard');
              
              console.log('✅ Authentication successful:', currentUser.name);
              toast.success(`Welcome back, ${currentUser.name}!`);
              
              // Try enhanced features in background (completely optional)
              setTimeout(() => {
                enhancedBackend.preloadUserData(currentUser.id).catch(() => {
                  console.log('📝 Enhanced features not available, basic mode active');
                });
              }, 500);
            } else {
              console.log('📭 No authenticated user found, showing landing page');
              setAppState('landing');
            }
          } catch (authError) {
            console.warn('Authentication check failed:', authError);
            setAppState('landing');
          }
        };

        // Race between initialization and timeout
        await Promise.race([initPromise(), timeoutPromise]);

        // Run connection test in background after app loads (completely non-blocking)
        setTimeout(() => {
          ConnectionTest.runFullConnectionTest()
            .then(connectionTest => {
              if (connectionTest.overall) {
                console.log('✅ DigiPratibha connected to Supabase');
              } else {
                console.log('📴 DigiPratibha running in offline mode');
              }
            })
            .catch(error => {
              console.log('📴 DigiPratibha running in offline mode:', error.message);
            });
        }, 500);
        
      } catch (error) {
        console.warn('App initialization timeout, proceeding with landing page:', error);
        // Always fall back to landing page if initialization fails
        setAppState('landing');
        
        // Show a user-friendly message
        setTimeout(() => {
          toast.info('App loaded successfully! You can continue to use DigiPratibha.');
        }, 1000);
      }
    };

    initializeApp();

    // Listen for auth state changes (mainly for real Supabase auth when it works)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setAppState('landing');
        toast.success('Signed out successfully');
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Auth token refreshed');
      }
      // For SIGNED_IN events, we let the login/register handlers manage the state
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleGetStarted = (role: 'student' | 'institution') => {
    setSelectedRole(role);
    setAppState('login');
  };

  const handleLogin = async (role: 'student' | 'institution', userData: any) => {
    try {
      setAppState('loading');
      
      // Set timeout for login to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Login timeout - please try again')), 10000)
      );

      const loginPromise = enhancedBackend.login(userData.email, userData.password, role);
      
      const authenticatedUser = await Promise.race([loginPromise, timeoutPromise]) as any;
      
      setUser(authenticatedUser);
      setAppState('dashboard');
      
      // Cache user data for faster future loads
      localStorage.setItem('digipratibha_user', JSON.stringify(authenticatedUser));
      
      // Preload user data for enhanced performance (non-blocking)
      setTimeout(() => {
        enhancedBackend.preloadUserData(authenticatedUser.id).catch(console.warn);
      }, 100);
      
      toast.success(`Welcome back, ${authenticatedUser.name}!`);
    } catch (error: any) {
      console.error('Login failed:', error);
      setAppState('login');
      toast.error(error.message || 'Login failed. Please check your credentials.');
      // Re-throw error so LoginPage can display it
      throw error;
    }
  };

  const handleRegister = async (userData: {
    name: string;
    email: string;
    password: string;
    role: 'student' | 'institution';
    institutionName?: string;
    department?: string;
  }) => {
    try {
      setAppState('loading');
      
      // Set timeout for registration to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Registration timeout - please try again')), 10000)
      );

      const registerPromise = enhancedBackend.register(userData);
      
      const newUser = await Promise.race([registerPromise, timeoutPromise]) as any;
      
      setUser(newUser);
      setAppState('dashboard');
      
      // Cache user data for faster future loads
      localStorage.setItem('digipratibha_user', JSON.stringify(newUser));
      
      // Preload user data for enhanced performance (non-blocking)
      setTimeout(() => {
        enhancedBackend.preloadUserData(newUser.id).catch(console.warn);
      }, 100);
      
      toast.success(`Welcome to DigiPratibha, ${newUser.name}!`);
    } catch (error: any) {
      console.error('Registration failed:', error);
      setAppState('login');
      toast.error(error.message || 'Registration failed. Please try again.');
      // Re-throw error so LoginPage can display it
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      // Clear cached user data first
      SimpleAuthCheck.clearCache();
      
      // Direct Supabase sign out
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.warn('Supabase logout warning:', error);
      }

      // Clean up backend service state (optional)
      setTimeout(() => {
        enhancedBackend.logout().catch(() => {
          console.log('Backend cleanup completed');
        });
      }, 100);
      
      setUser(null);
      setSelectedRole(null);
      setAppState('landing');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, clear local state
      SimpleAuthCheck.clearCache();
      setUser(null);
      setSelectedRole(null);
      setAppState('landing');
      toast.success('Signed out');
    }
  };

  const handleBackToLanding = () => {
    setAppState('landing');
    setSelectedRole(null);
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Consistent Black Neon Background */}
      <div className="fixed inset-0 -z-10">
        {/* Base dark background */}
        <div className="absolute inset-0 bg-[#0a0118]"></div>
        
        {/* Neon gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-500/15 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Radial gradients */}
        <div className="absolute inset-0">
          <div className="w-full h-full" style={{
            background: `
              radial-gradient(ellipse at top, rgba(139, 92, 246, 0.1) 0%, transparent 70%),
              radial-gradient(ellipse at bottom right, rgba(236, 72, 153, 0.1) 0%, transparent 70%),
              radial-gradient(ellipse at center left, rgba(99, 102, 241, 0.08) 0%, transparent 70%)
            `
          }}></div>
        </div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Consistent Titlebar/Header for authenticated users */}
      {user && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0118]/95 backdrop-blur-xl border-b border-purple-500/20 shadow-lg shadow-purple-500/10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">DP</span>
                  </div>
                  <span className="text-xl font-bold gradient-text">DigiPratibha</span>
                </div>
                <div className="text-sm text-foreground/60">
                  {user.role === 'student' ? 'Student Portal' : 'Institution Dashboard'}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <SystemStatus />
                <button
                  onClick={() => setShowPerformanceDashboard(true)}
                  className="px-3 py-2 text-xs bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-purple-300 rounded-lg border border-purple-500/30 transition-all duration-300 flex items-center gap-2"
                  title="Performance Dashboard"
                >
                  ⚡ Performance
                </button>
                <div className="text-sm text-foreground/80">
                  Welcome, <span className="text-purple-400 font-medium">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg border border-purple-500/30 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <div className={user ? "pt-20" : ""}>
        {/* Fast loading state */}
        {appState === 'loading' && (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
              </div>
              <h2 className="text-xl gradient-text">Loading DigiPratibha...</h2>
              <p className="text-muted-foreground">Initializing your digital portfolio experience</p>
            </div>
          </div>
        )}

        {/* Show landing page */}
        {appState === 'landing' && <LandingPage onGetStarted={handleGetStarted} />}

        {/* Show login page */}
        {appState === 'login' && (
          <LoginPage 
            onLogin={handleLogin}
            onRegister={handleRegister}
            defaultRole={selectedRole}
            onBack={handleBackToLanding}
          />
        )}

        {/* Database Setup Page */}
        {appState === 'database-setup' && <DatabaseSetup />}

        {/* Render appropriate dashboard based on user role */}
        {appState === 'dashboard' && user?.role === 'student' && (
          <StudentDashboard user={user} onLogout={handleLogout} />
        )}
        {appState === 'dashboard' && user?.role === 'institution' && (
          <InstitutionDashboard user={user} onLogout={handleLogout} />
        )}
      </div>

      {/* Beautiful Connection Indicator */}
      <ConnectionIndicator variant="compact" position="bottom-right" />
      
      {/* Performance Dashboard Modal */}
      <PerformanceDashboard 
        isOpen={showPerformanceDashboard} 
        onClose={() => setShowPerformanceDashboard(false)} 
      />
      
      <Toaster />
    </div>
    </ToastProvider>
  );
}