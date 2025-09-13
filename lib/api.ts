// API Layer for DigiPratibha Backend
import { User, Portfolio, Skill, Project, Analytics } from './types';

// API configuration - using environment variables safe for browser
const API_BASE_URL = typeof window !== 'undefined' 
  ? (window as any).ENV?.API_URL || 'http://localhost:3001/api'
  : 'http://localhost:3001/api';

class DigiPratibhaAPI {
  private token: string | null = null;

  constructor() {
    // We don't need to manage tokens manually since Supabase handles authentication
    this.token = null;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Authentication
  async login(email: string, password: string, role: 'student' | 'institution'): Promise<{ user: User; token: string }> {
    const response = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
    
    // Supabase handles token management, we just store user data
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    role: 'student' | 'institution';
    institutionName?: string;
    department?: string;
  }): Promise<{ user: User; token: string }> {
    const response = await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // Supabase handles token management, we just store user data
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', { method: 'POST' });
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  }

  // Portfolio Management
  async getPortfolio(userId: string): Promise<Portfolio> {
    return this.request<Portfolio>(`/portfolios/${userId}`);
  }

  async updatePortfolio(userId: string, portfolioData: Partial<Portfolio>): Promise<Portfolio> {
    return this.request<Portfolio>(`/portfolios/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(portfolioData),
    });
  }

  async createProject(userId: string, projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    return this.request<Project>(`/portfolios/${userId}/projects`, {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(userId: string, projectId: string, projectData: Partial<Project>): Promise<Project> {
    return this.request<Project>(`/portfolios/${userId}/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  }

  async deleteProject(userId: string, projectId: string): Promise<void> {
    await this.request(`/portfolios/${userId}/projects/${projectId}`, {
      method: 'DELETE',
    });
  }

  // Skills Management
  async addSkill(userId: string, skillData: { name: string; level: 'beginner' | 'intermediate' | 'advanced' }): Promise<Skill> {
    return this.request<Skill>(`/portfolios/${userId}/skills`, {
      method: 'POST',
      body: JSON.stringify(skillData),
    });
  }

  async updateSkillLevel(userId: string, skillId: string, level: 'beginner' | 'intermediate' | 'advanced'): Promise<Skill> {
    return this.request<Skill>(`/portfolios/${userId}/skills/${skillId}`, {
      method: 'PUT',
      body: JSON.stringify({ level }),
    });
  }

  async removeSkill(userId: string, skillId: string): Promise<void> {
    await this.request(`/portfolios/${userId}/skills/${skillId}`, {
      method: 'DELETE',
    });
  }

  // AI Assistant
  async getAIRecommendations(userId: string, context: string): Promise<{ suggestions: string[]; improvements: string[] }> {
    return this.request<{ suggestions: string[]; improvements: string[] }>('/ai/recommendations', {
      method: 'POST',
      body: JSON.stringify({ userId, context }),
    });
  }

  async analyzePortfolio(userId: string): Promise<{
    score: number;
    strengths: string[];
    improvements: string[];
    industryReadiness: number;
  }> {
    return this.request<{
      score: number;
      strengths: string[];
      improvements: string[];
      industryReadiness: number;
    }>(`/ai/analyze/${userId}`);
  }

  // Institution Analytics
  async getInstitutionAnalytics(institutionId: string, timeRange: string = 'month'): Promise<Analytics> {
    return this.request<Analytics>(`/analytics/institution/${institutionId}?timeRange=${timeRange}`);
  }

  async getStudentsList(institutionId: string, filters?: {
    department?: string;
    completionStatus?: string;
    skillLevel?: string;
  }): Promise<User[]> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
    }
    
    return this.request<User[]>(`/analytics/institution/${institutionId}/students?${queryParams}`);
  }

  async getDepartmentStats(institutionId: string): Promise<{
    department: string;
    studentCount: number;
    avgScore: number;
    topSkills: string[];
    completionRate: number;
  }[]> {
    return this.request<{
      department: string;
      studentCount: number;
      avgScore: number;
      topSkills: string[];
      completionRate: number;
    }[]>(`/analytics/institution/${institutionId}/departments`);
  }

  // File Upload
  async uploadFile(file: File, category: 'profile' | 'project' | 'document'): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Real-time subscriptions (WebSocket)
  subscribeToUpdates(userId: string, callback: (data: any) => void): () => void {
    const ws = new WebSocket(`${API_BASE_URL.replace('http', 'ws')}/ws/${userId}`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };

    return () => ws.close();
  }
}

export const api = new DigiPratibhaAPI();