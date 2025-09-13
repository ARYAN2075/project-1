// Comprehensive Backend API Service for DigiPratibha
// Production-Ready REST API Integration

import { User, Portfolio, Project, Skill, Analytics, AIRecommendation } from './types';
import { supabase } from './supabase';
import { enhancedBackend } from './enhanced-backend-service';

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface RequestConfig {
  timeout?: number;
  retries?: number;
  cache?: boolean;
  cacheTTL?: number;
}

export class APIBackendService {
  private baseURL: string;
  private defaultTimeout: number = 10000;
  private requestInterceptors: Array<(config: any) => any> = [];
  private responseInterceptors: Array<(response: any) => any> = [];
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  constructor(baseURL?: string) {
    this.baseURL = baseURL || process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
    this.setupInterceptors();
  }

  // 🔧 Setup request/response interceptors
  private setupInterceptors() {
    // Add auth token to requests
    this.addRequestInterceptor((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${token}`,
        };
      }
      return config;
    });

    // Handle common response patterns
    this.addResponseInterceptor((response) => {
      if (response.status === 401) {
        // Clear auth and redirect to login
        localStorage.removeItem('auth_token');
        localStorage.removeItem('digipratibha_user');
        window.location.href = '/login';
      }
      return response;
    });
  }

  // 🚀 Core HTTP methods with enhanced error handling
  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<APIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = `${method}:${url}:${JSON.stringify(data)}`;
    
    // Check cache for GET requests
    if (method === 'GET' && config.cache !== false) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        console.log('📦 API Cache hit:', endpoint);
        return { success: true, data: cached };
      }
    }

    const requestConfig = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      ...(data && { body: JSON.stringify(data) }),
    };

    // Apply request interceptors
    let finalConfig = requestConfig;
    for (const interceptor of this.requestInterceptors) {
      finalConfig = interceptor(finalConfig);
    }

    const timeout = config.timeout || this.defaultTimeout;
    const retries = config.retries || 3;

    return this.executeWithRetry(
      () => this.performRequest<T>(url, finalConfig, timeout, cacheKey, config.cacheTTL),
      retries
    );
  }

  private async performRequest<T>(
    url: string,
    config: any,
    timeout: number,
    cacheKey: string,
    cacheTTL?: number
  ): Promise<APIResponse<T>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Apply response interceptors
      let finalResponse = response;
      for (const interceptor of this.responseInterceptors) {
        finalResponse = interceptor(finalResponse);
      }

      const responseData = await finalResponse.json();

      if (!finalResponse.ok) {
        return {
          success: false,
          error: responseData.error || `HTTP ${finalResponse.status}: ${finalResponse.statusText}`,
          data: responseData,
        };
      }

      // Cache successful GET responses
      if (config.method === 'GET') {
        this.setCache(cacheKey, responseData, cacheTTL || 300000); // 5 min default
      }

      return {
        success: true,
        data: responseData,
        message: responseData.message,
        pagination: responseData.pagination,
      };
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timeout - please check your connection',
        };
      }

      console.error('API Request failed:', error);
      return {
        success: false,
        error: error.message || 'Network error occurred',
      };
    }
  }

  private async executeWithRetry<T>(
    operation: () => Promise<APIResponse<T>>,
    maxRetries: number
  ): Promise<APIResponse<T>> {
    let lastError: APIResponse<T>;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await operation();
        if (result.success) {
          return result;
        }
        lastError = result;
      } catch (error: any) {
        lastError = {
          success: false,
          error: error.message,
        };
      }

      if (attempt < maxRetries) {
        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    return lastError!;
  }

  // 📱 Authentication API
  async login(email: string, password: string, role: 'student' | 'institution'): Promise<APIResponse<User>> {
    try {
      const response = await this.request<{user: User, token: string}>('POST', '/auth/login', {
        email,
        password,
        role,
      });

      if (response.success && response.data) {
        // Store auth token
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('digipratibha_user', JSON.stringify(response.data.user));
        return { success: true, data: response.data.user };
      }

      return response;
    } catch (error) {
      console.warn('API login failed, falling back to enhanced backend');
      // Fallback to existing enhanced backend
      try {
        const user = await enhancedBackend.login(email, password, role);
        return { success: true, data: user };
      } catch (fallbackError: any) {
        return { success: false, error: fallbackError.message };
      }
    }
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    role: 'student' | 'institution';
    institutionName?: string;
    department?: string;
  }): Promise<APIResponse<User>> {
    try {
      const response = await this.request<{user: User, token: string}>('POST', '/auth/register', userData);

      if (response.success && response.data) {
        // Store auth token
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('digipratibha_user', JSON.stringify(response.data.user));
        return { success: true, data: response.data.user };
      }

      return response;
    } catch (error) {
      console.warn('API registration failed, falling back to enhanced backend');
      // Fallback to existing enhanced backend
      try {
        const user = await enhancedBackend.register(userData);
        return { success: true, data: user };
      } catch (fallbackError: any) {
        return { success: false, error: fallbackError.message };
      }
    }
  }

  async logout(): Promise<APIResponse<void>> {
    try {
      const response = await this.request<void>('POST', '/auth/logout');
      
      // Clear local storage regardless of API response
      localStorage.removeItem('auth_token');
      localStorage.removeItem('digipratibha_user');
      this.clearCache();

      return response;
    } catch (error) {
      // Even if API fails, clear local data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('digipratibha_user');
      this.clearCache();
      return { success: true };
    }
  }

  async refreshToken(): Promise<APIResponse<{token: string}>> {
    return this.request<{token: string}>('POST', '/auth/refresh');
  }

  // 📂 Portfolio API
  async getPortfolio(userId?: string): Promise<APIResponse<Portfolio>> {
    const endpoint = userId ? `/portfolios/user/${userId}` : '/portfolios/me';
    try {
      const response = await this.request<Portfolio>('GET', endpoint, undefined, { cache: true });
      
      if (!response.success) {
        // Fallback to enhanced backend
        const portfolio = await enhancedBackend.getPortfolioWithCache(userId);
        return { success: true, data: portfolio };
      }

      return response;
    } catch (error) {
      console.warn('API portfolio fetch failed, using fallback');
      const portfolio = await enhancedBackend.getPortfolioWithCache(userId);
      return { success: true, data: portfolio };
    }
  }

  async updatePortfolio(portfolioData: Partial<Portfolio>): Promise<APIResponse<Portfolio>> {
    try {
      const response = await this.request<Portfolio>('PUT', '/portfolios/me', portfolioData);
      
      if (response.success) {
        // Clear related cache
        this.clearCache('portfolios');
        return response;
      }

      // Fallback to enhanced backend
      const portfolio = await enhancedBackend.updatePortfolio(portfolioData);
      return { success: true, data: portfolio };
    } catch (error) {
      const portfolio = await enhancedBackend.updatePortfolio(portfolioData);
      return { success: true, data: portfolio };
    }
  }

  async searchPortfolios(query: string, filters?: any): Promise<APIResponse<Portfolio[]>> {
    const endpoint = `/portfolios/search?q=${encodeURIComponent(query)}`;
    return this.request<Portfolio[]>('POST', endpoint, filters, { cache: true, cacheTTL: 60000 });
  }

  // 🚀 Projects API
  async createProject(projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<APIResponse<Project>> {
    try {
      const response = await this.request<Project>('POST', '/projects', projectData);
      
      if (response.success) {
        this.clearCache('portfolios');
        return response;
      }

      const project = await enhancedBackend.createProject(projectData);
      return { success: true, data: project };
    } catch (error) {
      const project = await enhancedBackend.createProject(projectData);
      return { success: true, data: project };
    }
  }

  async updateProject(projectId: string, projectData: Partial<Project>): Promise<APIResponse<Project>> {
    try {
      const response = await this.request<Project>('PUT', `/projects/${projectId}`, projectData);
      
      if (response.success) {
        this.clearCache('portfolios');
        return response;
      }

      const project = await enhancedBackend.updateProject(projectId, projectData);
      return { success: true, data: project };
    } catch (error) {
      const project = await enhancedBackend.updateProject(projectId, projectData);
      return { success: true, data: project };
    }
  }

  async deleteProject(projectId: string): Promise<APIResponse<void>> {
    try {
      const response = await this.request<void>('DELETE', `/projects/${projectId}`);
      
      if (response.success) {
        this.clearCache('portfolios');
        return response;
      }

      await enhancedBackend.deleteProject(projectId);
      return { success: true };
    } catch (error) {
      await enhancedBackend.deleteProject(projectId);
      return { success: true };
    }
  }

  async batchUpdateProjects(updates: Array<{ id: string; data: Partial<Project> }>): Promise<APIResponse<Project[]>> {
    try {
      const response = await this.request<Project[]>('PUT', '/projects/batch', { updates });
      
      if (response.success) {
        this.clearCache('portfolios');
        return response;
      }

      const projects = await enhancedBackend.batchUpdateProjects(updates);
      return { success: true, data: projects };
    } catch (error) {
      const projects = await enhancedBackend.batchUpdateProjects(updates);
      return { success: true, data: projects };
    }
  }

  // 🎯 Skills API
  async addSkill(skillData: { name: string; level: 'beginner' | 'intermediate' | 'advanced'; category?: string }): Promise<APIResponse<Skill>> {
    try {
      const response = await this.request<Skill>('POST', '/skills', skillData);
      
      if (response.success) {
        this.clearCache('portfolios');
        return response;
      }

      const skill = await enhancedBackend.addSkill(skillData);
      return { success: true, data: skill };
    } catch (error) {
      const skill = await enhancedBackend.addSkill(skillData);
      return { success: true, data: skill };
    }
  }

  async updateSkill(skillId: string, level: 'beginner' | 'intermediate' | 'advanced'): Promise<APIResponse<Skill>> {
    try {
      const response = await this.request<Skill>('PUT', `/skills/${skillId}`, { level });
      
      if (response.success) {
        this.clearCache('portfolios');
        return response;
      }

      const skill = await enhancedBackend.updateSkillLevel(skillId, level);
      return { success: true, data: skill };
    } catch (error) {
      const skill = await enhancedBackend.updateSkillLevel(skillId, level);
      return { success: true, data: skill };
    }
  }

  async deleteSkill(skillId: string): Promise<APIResponse<void>> {
    try {
      const response = await this.request<void>('DELETE', `/skills/${skillId}`);
      
      if (response.success) {
        this.clearCache('portfolios');
        return response;
      }

      await enhancedBackend.removeSkill(skillId);
      return { success: true };
    } catch (error) {
      await enhancedBackend.removeSkill(skillId);
      return { success: true };
    }
  }

  // 🤖 AI Assistant API
  async getAIRecommendations(context?: string): Promise<APIResponse<{ suggestions: string[]; improvements: string[] }>> {
    try {
      const response = await this.request<{ suggestions: string[]; improvements: string[] }>(
        'GET', 
        `/ai/recommendations${context ? `?context=${context}` : ''}`,
        undefined,
        { cache: true, cacheTTL: 180000 }
      );
      
      if (response.success) {
        return response;
      }

      const recommendations = await enhancedBackend.getAIRecommendations(context);
      return { success: true, data: recommendations };
    } catch (error) {
      const recommendations = await enhancedBackend.getAIRecommendations(context);
      return { success: true, data: recommendations };
    }
  }

  async analyzePortfolio(): Promise<APIResponse<{
    score: number;
    strengths: string[];
    improvements: string[];
    industryReadiness: number;
  }>> {
    try {
      const response = await this.request<{
        score: number;
        strengths: string[];
        improvements: string[];
        industryReadiness: number;
      }>('POST', '/ai/analyze');
      
      if (response.success) {
        return response;
      }

      const analysis = await enhancedBackend.analyzePortfolio();
      return { success: true, data: analysis };
    } catch (error) {
      const analysis = await enhancedBackend.analyzePortfolio();
      return { success: true, data: analysis };
    }
  }

  async getChatResponse(message: string): Promise<APIResponse<{response: string}>> {
    try {
      const response = await this.request<{response: string}>('POST', '/ai/chat', { message });
      
      if (response.success) {
        return response;
      }

      const chatResponse = await enhancedBackend.getChatResponse(message);
      return { success: true, data: { response: chatResponse } };
    } catch (error) {
      const chatResponse = await enhancedBackend.getChatResponse(message);
      return { success: true, data: { response: chatResponse } };
    }
  }

  // 📊 Analytics API (Institution)
  async getInstitutionAnalytics(timeRange: string = 'month'): Promise<APIResponse<Analytics>> {
    try {
      const response = await this.request<Analytics>(
        'GET', 
        `/analytics/institution?timeRange=${timeRange}`,
        undefined,
        { cache: true, cacheTTL: 300000 }
      );
      
      if (response.success) {
        return response;
      }

      const analytics = await enhancedBackend.getAnalyticsWithCache(timeRange);
      return { success: true, data: analytics };
    } catch (error) {
      const analytics = await enhancedBackend.getAnalyticsWithCache(timeRange);
      return { success: true, data: analytics };
    }
  }

  async getStudentsList(filters?: any): Promise<APIResponse<User[]>> {
    try {
      const response = await this.request<User[]>('POST', '/analytics/students', filters, { cache: true });
      
      if (response.success) {
        return response;
      }

      const students = await enhancedBackend.getStudentsList(filters);
      return { success: true, data: students };
    } catch (error) {
      const students = await enhancedBackend.getStudentsList(filters);
      return { success: true, data: students };
    }
  }

  async getDepartmentStats(): Promise<APIResponse<any[]>> {
    try {
      const response = await this.request<any[]>('GET', '/analytics/departments', undefined, { cache: true });
      
      if (response.success) {
        return response;
      }

      const stats = await enhancedBackend.getDepartmentStats();
      return { success: true, data: stats };
    } catch (error) {
      const stats = await enhancedBackend.getDepartmentStats();
      return { success: true, data: stats };
    }
  }

  // 📁 File Upload API
  async uploadFile(file: File, category: 'profile' | 'project' | 'document'): Promise<APIResponse<{ url: string; filename: string }>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);

      const response = await fetch(`${this.baseURL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      return { success: true, data };
    } catch (error) {
      console.warn('API upload failed, using fallback');
      const result = await enhancedBackend.uploadFile(file, category);
      return { success: true, data: result };
    }
  }

  // 🔍 Search API
  async intelligentSearch(query: string, type: 'portfolios' | 'students' | 'projects', filters?: any): Promise<APIResponse<any[]>> {
    try {
      const response = await this.request<any[]>('POST', '/search', {
        query,
        type,
        filters,
      }, { cache: true, cacheTTL: 60000 });
      
      if (response.success) {
        return response;
      }

      const results = await enhancedBackend.searchWithIntelligence(query, type, filters);
      return { success: true, data: results };
    } catch (error) {
      const results = await enhancedBackend.searchWithIntelligence(query, type, filters);
      return { success: true, data: results };
    }
  }

  // 🔔 Notifications API
  async getNotifications(limit: number = 20): Promise<APIResponse<any[]>> {
    return this.request<any[]>('GET', `/notifications?limit=${limit}`, undefined, { cache: true });
  }

  async markNotificationAsRead(notificationId: string): Promise<APIResponse<void>> {
    return this.request<void>('PUT', `/notifications/${notificationId}/read`);
  }

  // 🛠 Utility methods
  addRequestInterceptor(interceptor: (config: any) => any) {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: (response: any) => any) {
    this.responseInterceptors.push(interceptor);
  }

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCache(key: string, data: any, ttl: number) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  private clearCache(pattern?: string) {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  // 📊 Health check
  async healthCheck(): Promise<APIResponse<{status: string; version: string; uptime: number}>> {
    return this.request<{status: string; version: string; uptime: number}>('GET', '/health');
  }

  // 📈 Performance metrics
  getMetrics() {
    return {
      cacheSize: this.cache.size,
      interceptors: {
        request: this.requestInterceptors.length,
        response: this.responseInterceptors.length,
      },
      baseURL: this.baseURL,
    };
  }
}

// Export singleton instance
export const apiBackend = new APIBackendService();

// Convenient API methods for direct use
export const api = {
  auth: {
    login: (email: string, password: string, role: 'student' | 'institution') => 
      apiBackend.login(email, password, role),
    register: (userData: any) => apiBackend.register(userData),
    logout: () => apiBackend.logout(),
    refreshToken: () => apiBackend.refreshToken(),
  },
  portfolio: {
    get: (userId?: string) => apiBackend.getPortfolio(userId),
    update: (data: Partial<Portfolio>) => apiBackend.updatePortfolio(data),
    search: (query: string, filters?: any) => apiBackend.searchPortfolios(query, filters),
  },
  projects: {
    create: (data: any) => apiBackend.createProject(data),
    update: (id: string, data: Partial<Project>) => apiBackend.updateProject(id, data),
    delete: (id: string) => apiBackend.deleteProject(id),
    batchUpdate: (updates: any[]) => apiBackend.batchUpdateProjects(updates),
  },
  skills: {
    add: (data: any) => apiBackend.addSkill(data),
    update: (id: string, level: any) => apiBackend.updateSkill(id, level),
    delete: (id: string) => apiBackend.deleteSkill(id),
  },
  ai: {
    recommendations: (context?: string) => apiBackend.getAIRecommendations(context),
    analyze: () => apiBackend.analyzePortfolio(),
    chat: (message: string) => apiBackend.getChatResponse(message),
  },
  analytics: {
    institution: (timeRange?: string) => apiBackend.getInstitutionAnalytics(timeRange),
    students: (filters?: any) => apiBackend.getStudentsList(filters),
    departments: () => apiBackend.getDepartmentStats(),
  },
  upload: (file: File, category: any) => apiBackend.uploadFile(file, category),
  search: (query: string, type: any, filters?: any) => 
    apiBackend.intelligentSearch(query, type, filters),
  notifications: {
    get: (limit?: number) => apiBackend.getNotifications(limit),
    markRead: (id: string) => apiBackend.markNotificationAsRead(id),
  },
  health: () => apiBackend.healthCheck(),
};

// Beautiful console logging for development
if (typeof window !== 'undefined') {
  console.log('%c🚀 DigiPratibha API Backend Service Initialized', 
    'background: linear-gradient(90deg, #06b6d4, #8b5cf6); color: white; padding: 10px; border-radius: 8px; font-weight: bold;');
}