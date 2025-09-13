// Browser-safe Authentication utilities for DigiPratibha
// Since we're using Supabase for auth, we only need client-side validation and utilities

import { User } from './types';

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: 'student' | 'institution';
  institutionId?: string;
  iat?: number;
  exp?: number;
}

export class AuthService {
  // Generate a simple token for mock authentication (browser-safe)
  generateToken(user: User): string {
    // For development/mock purposes only - in production, Supabase handles tokens
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      timestamp: Date.now()
    };
    
    // Simple base64 encoding for mock token (not secure, just for development)
    return btoa(JSON.stringify(payload));
  }

  // Verify mock token (browser-safe)
  verifyToken(token: string): AuthTokenPayload {
    try {
      const payload = JSON.parse(atob(token));
      return {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        institutionId: payload.institutionId
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Simple password validation (no hashing in browser for security reasons)
  validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Generate reset token (browser-safe)
  generateResetToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  // Rate limiting for login attempts (browser-safe)
  private loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
  
  checkRateLimit(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.loginAttempts.get(identifier);
    
    if (!attempts) {
      this.loginAttempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }
    
    // Reset attempts after 15 minutes
    if (now - attempts.lastAttempt > 15 * 60 * 1000) {
      this.loginAttempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }
    
    // Allow max 5 attempts in 15 minutes
    if (attempts.count >= 5) {
      return false;
    }
    
    attempts.count++;
    attempts.lastAttempt = now;
    return true;
  }

  // Session management (browser-safe)
  createSession(user: User): { token: string; refreshToken: string; expiresAt: Date } {
    const token = this.generateToken(user);
    const refreshToken = this.generateResetToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    return {
      token,
      refreshToken,
      expiresAt
    };
  }

  // Role-based access control
  hasPermission(userRole: string, requiredRole: string | string[]): boolean {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    return roles.includes(userRole);
  }

  // Check if user can access institution data
  canAccessInstitution(user: User, institutionId: string): boolean {
    if (user.role === 'institution' && user.id === institutionId) {
      return true;
    }
    
    if (user.role === 'student' && user.institution_id === institutionId) {
      return true;
    }
    
    return false;
  }

  // Check if user can modify portfolio
  canModifyPortfolio(user: User, portfolioUserId: string): boolean {
    // Students can only modify their own portfolio
    if (user.role === 'student') {
      return user.id === portfolioUserId;
    }
    
    // Institutions can modify portfolios of their students
    if (user.role === 'institution') {
      // This would require a database lookup to verify the student belongs to this institution
      return true; // Simplified for now
    }
    
    return false;
  }

  // Validate email format
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Check password strength
  getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
    const validation = this.validatePassword(password);
    
    if (validation.errors.length > 3) return 'weak';
    if (validation.errors.length > 1) return 'medium';
    return 'strong';
  }

  // Generate secure random string (browser-safe)
  generateSecureId(length: number = 16): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Check if user session is valid
  isSessionValid(user: User | null): boolean {
    if (!user) return false;
    
    // Basic validation
    return !!(user.id && user.email && user.role);
  }

  // Format user display name
  getUserDisplayName(user: User): string {
    return user.name || user.email.split('@')[0];
  }

  // Get user role display text
  getRoleDisplayText(role: string): string {
    switch (role) {
      case 'student':
        return 'Student';
      case 'institution':
        return 'Institution';
      default:
        return 'User';
    }
  }
}

// Create singleton instance
export const authService = new AuthService();