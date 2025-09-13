// Comprehensive Authentication Backend for DigiPratibha
// Advanced auth with security, session management, and role-based access

import { supabase } from './supabase';
import { databaseService } from './database-service';
import { webSocketService } from './websocket-service';
import { User } from './types';

export interface AuthSession {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  lastActivity: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: 'student' | 'institution';
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'institution';
  department?: string;
  institutionName?: string;
  institutionType?: 'university' | 'college' | 'school';
}

export interface AuthOptions {
  autoRefresh?: boolean;
  sessionTimeout?: number;
  maxLoginAttempts?: number;
  lockoutDuration?: number;
}

export interface SecurityEvent {
  type: 'login' | 'logout' | 'failed_login' | 'token_refresh' | 'password_change' | 'suspicious_activity';
  userId?: string;
  ip?: string;
  userAgent?: string;
  timestamp: Date;
  details?: any;
}

export class AuthBackendService {
  private currentSession: AuthSession | null = null;
  private refreshTimer: NodeJS.Timeout | null = null;
  private securityEvents: SecurityEvent[] = [];
  private loginAttempts = new Map<string, { count: number; lastAttempt: Date; lockedUntil?: Date }>();
  
  private options: AuthOptions = {
    autoRefresh: true,
    sessionTimeout: 7 * 24 * 60 * 60 * 1000, // 7 days
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
  };

  constructor(options: Partial<AuthOptions> = {}) {
    this.options = { ...this.options, ...options };
    this.initializeAuth();
  }

  // 🔧 Initialize authentication service
  private async initializeAuth(): Promise<void> {
    try {
      // Check for existing session
      await this.restoreSession();
      
      // Set up auth state listener
      supabase.auth.onAuthStateChange(async (event, session) => {
        await this.handleAuthStateChange(event, session);
      });

      // Start session monitoring
      this.startSessionMonitoring();
      
      console.log('🔐 Auth backend service initialized');
    } catch (error) {
      console.warn('Auth initialization warning:', error);
    }
  }

  // 🔄 Session management
  private async restoreSession(): Promise<boolean> {
    try {
      // Try to get session from Supabase
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        // Try to restore from localStorage
        return this.restoreFromLocalStorage();
      }

      // Validate and restore session
      const user = await this.getUserProfile(session.user.id);
      if (user) {
        this.currentSession = {
          user,
          token: session.access_token,
          refreshToken: session.refresh_token,
          expiresAt: new Date(session.expires_at! * 1000),
          lastActivity: new Date(),
        };
        
        this.scheduleTokenRefresh();
        this.logSecurityEvent('login', { userId: user.id, restored: true });
        return true;
      }
      
      return false;
    } catch (error) {
      console.warn('Session restore failed:', error);
      return false;
    }
  }

  private restoreFromLocalStorage(): boolean {
    try {
      const storedUser = localStorage.getItem('digipratibha_user');
      const storedToken = localStorage.getItem('auth_token');
      
      if (storedUser && storedToken) {
        const user = JSON.parse(storedUser);
        this.currentSession = {
          user,
          token: storedToken,
          refreshToken: '',
          expiresAt: new Date(Date.now() + this.options.sessionTimeout!),
          lastActivity: new Date(),
        };
        
        console.log('📦 Session restored from localStorage');
        return true;
      }
      
      return false;
    } catch (error) {
      console.warn('localStorage restore failed:', error);
      return false;
    }
  }

  private async handleAuthStateChange(event: string, session: any): Promise<void> {
    switch (event) {
      case 'SIGNED_IN':
        if (session?.user) {
          const user = await this.getUserProfile(session.user.id);
          if (user) {
            this.currentSession = {
              user,
              token: session.access_token,
              refreshToken: session.refresh_token,
              expiresAt: new Date(session.expires_at * 1000),
              lastActivity: new Date(),
            };
            this.scheduleTokenRefresh();
          }
        }
        break;
        
      case 'SIGNED_OUT':
        await this.clearSession();
        break;
        
      case 'TOKEN_REFRESHED':
        if (this.currentSession && session) {
          this.currentSession.token = session.access_token;
          this.currentSession.refreshToken = session.refresh_token;
          this.currentSession.expiresAt = new Date(session.expires_at * 1000);
          this.scheduleTokenRefresh();
        }
        break;
    }
  }

  // 🔐 Authentication methods
  async login(credentials: LoginCredentials): Promise<{ user: User; session: AuthSession }> {
    const { email, password, role, rememberMe } = credentials;
    
    // Check for account lockout
    this.checkAccountLockout(email);
    
    try {
      // Validate credentials format
      this.validateCredentials(credentials);
      
      // Attempt authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        this.recordFailedLogin(email);
        this.logSecurityEvent('failed_login', { email, error: error.message });
        throw new Error(`Authentication failed: ${error.message}`);
      }

      if (!data.user) {
        this.recordFailedLogin(email);
        throw new Error('No user data returned');
      }

      // Get user profile
      const user = await this.getUserProfile(data.user.id);
      if (!user) {
        throw new Error('User profile not found');
      }

      // Verify role
      if (user.role !== role) {
        await supabase.auth.signOut();
        throw new Error(`Access denied. This account is registered as ${user.role}, not ${role}.`);
      }

      // Create session
      const session: AuthSession = {
        user,
        token: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: new Date(data.session.expires_at! * 1000),
        lastActivity: new Date(),
      };

      this.currentSession = session;
      
      // Store session
      if (rememberMe) {
        this.storeSession(session);
      }
      
      // Clear failed login attempts
      this.loginAttempts.delete(email);
      
      // Schedule token refresh
      this.scheduleTokenRefresh();
      
      // Log security event
      this.logSecurityEvent('login', { userId: user.id, rememberMe });
      
      // Update last login
      await this.updateLastLogin(user.id);
      
      return { user, session };
      
    } catch (error: any) {
      this.recordFailedLogin(email);
      throw error;
    }
  }

  async register(userData: RegisterData): Promise<{ user: User; session: AuthSession }> {
    try {
      // Validate registration data
      this.validateRegistrationData(userData);
      
      // Check if user already exists
      const { data: existingUser } = await databaseService.query('users', {
        filter: { email: userData.email },
        limit: 1
      });
      
      if (existingUser && existingUser.length > 0) {
        throw new Error('User already exists with this email');
      }

      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: userData.role,
            department: userData.department,
            institutionName: userData.institutionName,
            institutionType: userData.institutionType,
          }
        }
      });

      if (error) {
        throw new Error(`Registration failed: ${error.message}`);
      }

      if (!data.user) {
        throw new Error('Registration failed: No user data returned');
      }

      // Create user profile
      const { data: userProfile, error: profileError } = await databaseService.insert<User>('users', {
        id: data.user.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        department: userData.department,
        institution_name: userData.institutionName,
        institution_type: userData.institutionType,
        onboarding_completed: false,
        email_verified: false,
        preferences: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (profileError || !userProfile || userProfile.length === 0) {
        throw new Error('Failed to create user profile');
      }

      const user = userProfile[0];

      // Create default portfolio for students
      if (userData.role === 'student') {
        await this.createDefaultPortfolio(user.id, userData.name);
      }

      // Create session
      const session: AuthSession = {
        user,
        token: data.session?.access_token || '',
        refreshToken: data.session?.refresh_token || '',
        expiresAt: new Date(Date.now() + this.options.sessionTimeout!),
        lastActivity: new Date(),
      };

      this.currentSession = session;
      this.storeSession(session);
      this.scheduleTokenRefresh();
      
      // Log security event
      this.logSecurityEvent('login', { userId: user.id, newUser: true });
      
      return { user, session };
      
    } catch (error: any) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.currentSession) {
        this.logSecurityEvent('logout', { userId: this.currentSession.user.id });
      }
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear session
      await this.clearSession();
      
      // Disconnect WebSocket
      webSocketService.disconnect();
      
    } catch (error) {
      console.warn('Logout error:', error);
      // Clear session even if logout fails
      await this.clearSession();
    }
  }

  async refreshToken(): Promise<string> {
    try {
      if (!this.currentSession) {
        throw new Error('No active session');
      }

      const { data, error } = await supabase.auth.refreshSession();
      
      if (error || !data.session) {
        throw new Error('Token refresh failed');
      }

      // Update session
      this.currentSession.token = data.session.access_token;
      this.currentSession.refreshToken = data.session.refresh_token;
      this.currentSession.expiresAt = new Date(data.session.expires_at! * 1000);
      this.currentSession.lastActivity = new Date();
      
      // Store updated session
      this.storeSession(this.currentSession);
      
      // Schedule next refresh
      this.scheduleTokenRefresh();
      
      // Log security event
      this.logSecurityEvent('token_refresh', { userId: this.currentSession.user.id });
      
      return this.currentSession.token;
      
    } catch (error: any) {
      console.error('Token refresh failed:', error);
      await this.clearSession();
      throw error;
    }
  }

  // 👤 User management
  private async getUserProfile(userId: string): Promise<User | null> {
    try {
      const { data, error } = await databaseService.query<User>('users', {
        filter: { id: userId },
        limit: 1,
        cache: true,
      });
      
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      return null;
    }
  }

  private async updateLastLogin(userId: string): Promise<void> {
    try {
      await databaseService.update('users', 
        { last_login: new Date().toISOString() },
        { id: userId }
      );
    } catch (error) {
      console.warn('Failed to update last login:', error);
    }
  }

  private async createDefaultPortfolio(userId: string, userName: string): Promise<void> {
    try {
      const slug = `${userName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      
      await databaseService.insert('portfolios', {
        user_id: userId,
        title: `${userName}'s Portfolio`,
        slug,
        description: 'Welcome to my digital portfolio',
        template: 'modern',
        theme: 'neon',
        is_public: false,
        customization: {
          primaryColor: '#8b5cf6',
          secondaryColor: '#ec4899',
          font: 'Inter',
          layout: 'grid',
        },
        sections: [],
        contact_info: {},
        seo_settings: {},
        analytics: {
          views: 0,
          uniqueVisitors: 0,
        },
        view_count: 0,
      });
    } catch (error) {
      console.warn('Failed to create default portfolio:', error);
    }
  }

  // 🔒 Security and validation
  private validateCredentials(credentials: LoginCredentials): void {
    const { email, password } = credentials;
    
    if (!email || !email.includes('@')) {
      throw new Error('Valid email is required');
    }
    
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
  }

  private validateRegistrationData(userData: RegisterData): void {
    const { name, email, password, role } = userData;
    
    if (!name || name.length < 2) {
      throw new Error('Name must be at least 2 characters');
    }
    
    if (!email || !email.includes('@')) {
      throw new Error('Valid email is required');
    }
    
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    
    if (!['student', 'institution'].includes(role)) {
      throw new Error('Valid role is required');
    }
  }

  private checkAccountLockout(email: string): void {
    const attempts = this.loginAttempts.get(email);
    if (attempts?.lockedUntil && attempts.lockedUntil > new Date()) {
      const remainingTime = Math.ceil((attempts.lockedUntil.getTime() - Date.now()) / 60000);
      throw new Error(`Account locked. Try again in ${remainingTime} minutes.`);
    }
  }

  private recordFailedLogin(email: string): void {
    const now = new Date();
    const attempts = this.loginAttempts.get(email) || { count: 0, lastAttempt: now };
    
    attempts.count++;
    attempts.lastAttempt = now;
    
    if (attempts.count >= this.options.maxLoginAttempts!) {
      attempts.lockedUntil = new Date(now.getTime() + this.options.lockoutDuration!);
      this.logSecurityEvent('suspicious_activity', { 
        email, 
        reason: 'Multiple failed login attempts',
        lockoutUntil: attempts.lockedUntil
      });
    }
    
    this.loginAttempts.set(email, attempts);
  }

  // 📊 Session monitoring
  private startSessionMonitoring(): void {
    setInterval(() => {
      this.checkSessionValidity();
    }, 60000); // Check every minute
  }

  private checkSessionValidity(): void {
    if (!this.currentSession) return;
    
    const now = new Date();
    const timeSinceActivity = now.getTime() - this.currentSession.lastActivity.getTime();
    
    // Check for session timeout
    if (timeSinceActivity > this.options.sessionTimeout!) {
      console.log('Session expired due to inactivity');
      this.clearSession();
      return;
    }
    
    // Check token expiration
    if (this.currentSession.expiresAt < now) {
      console.log('Token expired');
      this.refreshToken().catch(() => {
        this.clearSession();
      });
    }
  }

  private scheduleTokenRefresh(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
    
    if (!this.currentSession || !this.options.autoRefresh) return;
    
    // Refresh 5 minutes before expiration
    const refreshTime = this.currentSession.expiresAt.getTime() - Date.now() - 300000;
    
    if (refreshTime > 0) {
      this.refreshTimer = setTimeout(() => {
        this.refreshToken().catch(console.error);
      }, refreshTime);
    }
  }

  // 💾 Session storage
  private storeSession(session: AuthSession): void {
    try {
      localStorage.setItem('digipratibha_user', JSON.stringify(session.user));
      localStorage.setItem('auth_token', session.token);
      
      // Store encrypted refresh token (in production, use proper encryption)
      localStorage.setItem('refresh_token', session.refreshToken);
    } catch (error) {
      console.warn('Failed to store session:', error);
    }
  }

  private async clearSession(): Promise<void> {
    this.currentSession = null;
    
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
    
    // Clear localStorage
    localStorage.removeItem('digipratibha_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    
    // Clear database cache
    databaseService.clearCache();
  }

  // 🔍 Security logging
  private logSecurityEvent(type: SecurityEvent['type'], details: any = {}): void {
    const event: SecurityEvent = {
      type,
      userId: details.userId,
      ip: this.getClientIP(),
      userAgent: navigator.userAgent,
      timestamp: new Date(),
      details,
    };
    
    this.securityEvents.push(event);
    
    // Keep only last 100 events
    if (this.securityEvents.length > 100) {
      this.securityEvents.shift();
    }
    
    // In production, send to security monitoring service
    console.log('🔒 Security event:', event);
  }

  private getClientIP(): string {
    // In a real application, this would get the actual client IP
    return 'unknown';
  }

  // 🌐 Public API
  getCurrentUser(): User | null {
    return this.currentSession?.user || null;
  }

  getCurrentSession(): AuthSession | null {
    return this.currentSession;
  }

  isAuthenticated(): boolean {
    return this.currentSession !== null;
  }

  hasRole(role: string): boolean {
    return this.currentSession?.user.role === role;
  }

  updateActivity(): void {
    if (this.currentSession) {
      this.currentSession.lastActivity = new Date();
    }
  }

  getSecurityEvents(): SecurityEvent[] {
    return [...this.securityEvents];
  }

  // 🧹 Cleanup
  destroy(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
    this.clearSession();
    this.securityEvents.length = 0;
    this.loginAttempts.clear();
  }
}

// Export singleton instance
export const authBackend = new AuthBackendService();

// Convenient auth hooks for React components
export const useAuth = () => ({
  user: authBackend.getCurrentUser(),
  session: authBackend.getCurrentSession(),
  isAuthenticated: authBackend.isAuthenticated(),
  hasRole: (role: string) => authBackend.hasRole(role),
  login: (credentials: LoginCredentials) => authBackend.login(credentials),
  register: (userData: RegisterData) => authBackend.register(userData),
  logout: () => authBackend.logout(),
  refreshToken: () => authBackend.refreshToken(),
  updateActivity: () => authBackend.updateActivity(),
});

// Beautiful console logging
if (typeof window !== 'undefined') {
  console.log('%c🔐 DigiPratibha Auth Backend Service Initialized', 
    'background: linear-gradient(90deg, #ef4444, #dc2626); color: white; padding: 10px; border-radius: 8px; font-weight: bold;');
}