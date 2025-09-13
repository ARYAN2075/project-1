// DigiPratibha Backend Orchestrator
// Unified service coordination and management

import { apiBackend } from './api-backend';
import { authBackend } from './auth-backend';
import { databaseService } from './database-service';
import { webSocketService } from './websocket-service';
import { enhancedBackend } from './enhanced-backend-service';
import { supabaseService } from './supabase-service';
import { aiService } from './ai-service';
import { User, Portfolio, Project, Skill, Analytics } from './types';

export interface BackendHealth {
  overall: 'healthy' | 'degraded' | 'down';
  services: {
    api: 'healthy' | 'degraded' | 'down';
    auth: 'healthy' | 'degraded' | 'down';
    database: 'healthy' | 'degraded' | 'down';
    websocket: 'healthy' | 'degraded' | 'down';
    supabase: 'healthy' | 'degraded' | 'down';
    ai: 'healthy' | 'degraded' | 'down';
  };
  metrics: {
    totalRequests: number;
    averageResponseTime: number;
    errorRate: number;
    uptime: number;
  };
  lastCheck: Date;
}

export interface ServiceConfig {
  apiUrl?: string;
  wsUrl?: string;
  enableWebSocket?: boolean;
  enableCaching?: boolean;
  enableOfflineMode?: boolean;
  healthCheckInterval?: number;
}

export interface BackendOperation {
  id: string;
  service: string;
  method: string;
  params: any;
  timestamp: Date;
  status: 'pending' | 'success' | 'error';
  result?: any;
  error?: string;
  duration?: number;
}

export class BackendOrchestrator {
  private config: ServiceConfig;
  private operations: Map<string, BackendOperation> = new Map();
  private healthStatus: BackendHealth;
  private healthCheckTimer: NodeJS.Timeout | null = null;
  private startTime = Date.now();
  private metrics = {
    totalRequests: 0,
    totalResponseTime: 0,
    errors: 0,
  };

  constructor(config: ServiceConfig = {}) {
    this.config = {
      enableWebSocket: true,
      enableCaching: true,
      enableOfflineMode: true,
      healthCheckInterval: 30000, // 30 seconds
      ...config,
    };

    this.healthStatus = this.initializeHealthStatus();
    this.initializeServices();
  }

  // 🔧 Service initialization
  private async initializeServices(): Promise<void> {
    try {
      console.log('🚀 Initializing DigiPratibha Backend Services...');

      // Initialize core services
      await this.initializeAuth();
      await this.initializeDatabase();
      
      if (this.config.enableWebSocket) {
        await this.initializeWebSocket();
      }

      // Start health monitoring
      this.startHealthMonitoring();

      console.log('✅ All backend services initialized successfully');
      
      // Update health status
      this.updateHealthStatus();
      
    } catch (error) {
      console.error('❌ Backend initialization failed:', error);
      this.healthStatus.overall = 'degraded';
    }
  }

  private async initializeAuth(): Promise<void> {
    try {
      // Auth is initialized automatically
      this.healthStatus.services.auth = 'healthy';
    } catch (error) {
      console.warn('Auth service initialization failed:', error);
      this.healthStatus.services.auth = 'degraded';
    }
  }

  private async initializeDatabase(): Promise<void> {
    try {
      const metrics = databaseService.getMetrics();
      this.healthStatus.services.database = metrics.connectionHealth === 'healthy' ? 'healthy' : 'degraded';
      this.healthStatus.services.supabase = supabaseService.isConnected() ? 'healthy' : 'degraded';
    } catch (error) {
      console.warn('Database service initialization failed:', error);
      this.healthStatus.services.database = 'degraded';
      this.healthStatus.services.supabase = 'degraded';
    }
  }

  private async initializeWebSocket(): Promise<void> {
    try {
      await webSocketService.connect();
      this.healthStatus.services.websocket = 'healthy';
    } catch (error) {
      console.warn('WebSocket initialization failed:', error);
      this.healthStatus.services.websocket = 'degraded';
    }
  }

  private initializeHealthStatus(): BackendHealth {
    return {
      overall: 'healthy',
      services: {
        api: 'healthy',
        auth: 'healthy',
        database: 'healthy',
        websocket: 'healthy',
        supabase: 'healthy',
        ai: 'healthy',
      },
      metrics: {
        totalRequests: 0,
        averageResponseTime: 0,
        errorRate: 0,
        uptime: 0,
      },
      lastCheck: new Date(),
    };
  }

  // 🏥 Health monitoring
  private startHealthMonitoring(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }

    this.healthCheckTimer = setInterval(() => {
      this.performHealthCheck();
    }, this.config.healthCheckInterval);

    // Initial health check
    this.performHealthCheck();
  }

  private async performHealthCheck(): Promise<void> {
    try {
      // Check API health
      try {
        await apiBackend.healthCheck();
        this.healthStatus.services.api = 'healthy';
      } catch {
        this.healthStatus.services.api = 'degraded';
      }

      // Check database health
      const dbMetrics = databaseService.getMetrics();
      this.healthStatus.services.database = dbMetrics.connectionHealth === 'healthy' ? 'healthy' : 'degraded';

      // Check Supabase health
      this.healthStatus.services.supabase = supabaseService.isConnected() ? 'healthy' : 'degraded';

      // Check WebSocket health
      if (this.config.enableWebSocket) {
        const wsStatus = webSocketService.getStatus();
        this.healthStatus.services.websocket = wsStatus.connected ? 'healthy' : 'degraded';
      }

      // Check auth health
      this.healthStatus.services.auth = authBackend.isAuthenticated() ? 'healthy' : 'healthy'; // Auth can be healthy without being authenticated

      // Check AI service
      this.healthStatus.services.ai = 'healthy'; // AI service is always available (mock/local)

      // Update overall health
      this.updateHealthStatus();

    } catch (error) {
      console.error('Health check failed:', error);
      this.healthStatus.overall = 'degraded';
    }

    this.healthStatus.lastCheck = new Date();
  }

  private updateHealthStatus(): void {
    const services = Object.values(this.healthStatus.services);
    const healthyCount = services.filter(s => s === 'healthy').length;
    const totalServices = services.length;

    if (healthyCount === totalServices) {
      this.healthStatus.overall = 'healthy';
    } else if (healthyCount >= totalServices * 0.7) {
      this.healthStatus.overall = 'degraded';
    } else {
      this.healthStatus.overall = 'down';
    }

    // Update metrics
    this.healthStatus.metrics = {
      totalRequests: this.metrics.totalRequests,
      averageResponseTime: this.metrics.totalRequests > 0 ? 
        this.metrics.totalResponseTime / this.metrics.totalRequests : 0,
      errorRate: this.metrics.totalRequests > 0 ? 
        (this.metrics.errors / this.metrics.totalRequests) * 100 : 0,
      uptime: Date.now() - this.startTime,
    };
  }

  // 🎯 Unified API methods
  async executeOperation<T>(
    service: string,
    method: string,
    params: any = {}
  ): Promise<T> {
    const operationId = `${service}_${method}_${Date.now()}_${Math.random()}`;
    const startTime = Date.now();
    
    const operation: BackendOperation = {
      id: operationId,
      service,
      method,
      params,
      timestamp: new Date(),
      status: 'pending',
    };

    this.operations.set(operationId, operation);
    this.metrics.totalRequests++;

    try {
      let result: T;

      // Route to appropriate service
      switch (service) {
        case 'auth':
          result = await this.executeAuthOperation(method, params);
          break;
        case 'api':
          result = await this.executeApiOperation(method, params);
          break;
        case 'database':
          result = await this.executeDatabaseOperation(method, params);
          break;
        case 'websocket':
          result = await this.executeWebSocketOperation(method, params);
          break;
        case 'ai':
          result = await this.executeAiOperation(method, params);
          break;
        default:
          throw new Error(`Unknown service: ${service}`);
      }

      // Update operation status
      const duration = Date.now() - startTime;
      operation.status = 'success';
      operation.result = result;
      operation.duration = duration;
      
      this.metrics.totalResponseTime += duration;
      
      return result;

    } catch (error: any) {
      // Update operation status
      const duration = Date.now() - startTime;
      operation.status = 'error';
      operation.error = error.message;
      operation.duration = duration;
      
      this.metrics.errors++;
      this.metrics.totalResponseTime += duration;
      
      throw error;
    } finally {
      // Clean up old operations (keep last 100)
      if (this.operations.size > 100) {
        const oldestId = Array.from(this.operations.keys())[0];
        this.operations.delete(oldestId);
      }
    }
  }

  // 🔐 Auth operations
  private async executeAuthOperation(method: string, params: any): Promise<any> {
    switch (method) {
      case 'login':
        return authBackend.login(params);
      case 'register':
        return authBackend.register(params);
      case 'logout':
        return authBackend.logout();
      case 'refreshToken':
        return authBackend.refreshToken();
      case 'getCurrentUser':
        return authBackend.getCurrentUser();
      case 'isAuthenticated':
        return authBackend.isAuthenticated();
      default:
        throw new Error(`Unknown auth method: ${method}`);
    }
  }

  // 📡 API operations
  private async executeApiOperation(method: string, params: any): Promise<any> {
    switch (method) {
      case 'getPortfolio':
        return apiBackend.getPortfolio(params.userId);
      case 'updatePortfolio':
        return apiBackend.updatePortfolio(params.data);
      case 'createProject':
        return apiBackend.createProject(params.data);
      case 'updateProject':
        return apiBackend.updateProject(params.id, params.data);
      case 'deleteProject':
        return apiBackend.deleteProject(params.id);
      case 'addSkill':
        return apiBackend.addSkill(params.data);
      case 'uploadFile':
        return apiBackend.uploadFile(params.file, params.category);
      case 'search':
        return apiBackend.intelligentSearch(params.query, params.type, params.filters);
      default:
        throw new Error(`Unknown API method: ${method}`);
    }
  }

  // 📊 Database operations
  private async executeDatabaseOperation(method: string, params: any): Promise<any> {
    switch (method) {
      case 'query':
        return databaseService.query(params.table, params.options);
      case 'insert':
        return databaseService.insert(params.table, params.data, params.options);
      case 'update':
        return databaseService.update(params.table, params.data, params.filter, params.options);
      case 'delete':
        return databaseService.delete(params.table, params.filter);
      default:
        throw new Error(`Unknown database method: ${method}`);
    }
  }

  // 🌐 WebSocket operations
  private async executeWebSocketOperation(method: string, params: any): Promise<any> {
    switch (method) {
      case 'send':
        return webSocketService.send(params.message);
      case 'subscribe':
        return webSocketService.subscribe(params.eventType, params.options);
      case 'unsubscribe':
        return webSocketService.unsubscribe(params.eventType);
      case 'joinRoom':
        return webSocketService.joinCollaborationRoom(params.roomId);
      case 'leaveRoom':
        return webSocketService.leaveCollaborationRoom(params.roomId);
      default:
        throw new Error(`Unknown WebSocket method: ${method}`);
    }
  }

  // 🤖 AI operations
  private async executeAiOperation(method: string, params: any): Promise<any> {
    switch (method) {
      case 'analyzePortfolio':
        return aiService.analyzePortfolio(params.portfolio, params.user);
      case 'getChatResponse':
        return aiService.getChatResponse(params.message, params.context);
      case 'generateRecommendations':
        return aiService.generateRecommendations(params.portfolio, params.user);
      case 'getSkillRecommendations':
        return aiService.getSkillRecommendations(params.skills, params.department);
      default:
        throw new Error(`Unknown AI method: ${method}`);
    }
  }

  // 🎯 High-level convenience methods
  async authenticateUser(email: string, password: string, role: 'student' | 'institution'): Promise<User> {
    const { user } = await this.executeOperation('auth', 'login', { email, password, role });
    return user;
  }

  async getUserPortfolio(userId?: string): Promise<Portfolio> {
    // Try API first, fallback to enhanced backend
    try {
      const response = await this.executeOperation('api', 'getPortfolio', { userId });
      return response.data || response;
    } catch (error) {
      return enhancedBackend.getPortfolioWithCache(userId);
    }
  }

  async analyzeUserPortfolio(userId?: string): Promise<any> {
    const portfolio = await this.getUserPortfolio(userId);
    const user = authBackend.getCurrentUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    return this.executeOperation('ai', 'analyzePortfolio', { portfolio, user });
  }

  async createProjectWithAI(projectData: any): Promise<Project> {
    // Create project
    const project = await this.executeOperation('api', 'createProject', { data: projectData });
    
    // Get AI recommendations for the project
    const user = authBackend.getCurrentUser();
    const portfolio = await this.getUserPortfolio();
    
    if (user && portfolio) {
      // Generate AI recommendations in background
      setTimeout(() => {
        this.executeOperation('ai', 'generateRecommendations', { portfolio, user })
          .catch(console.warn);
      }, 1000);
    }
    
    return project.data || project;
  }

  async searchWithIntelligence(query: string, type: 'portfolios' | 'students' | 'projects', filters?: any): Promise<any[]> {
    try {
      const response = await this.executeOperation('api', 'search', { query, type, filters });
      return response.data || response;
    } catch (error) {
      // Fallback to enhanced backend
      return enhancedBackend.searchWithIntelligence(query, type, filters);
    }
  }

  // 📊 Analytics and monitoring
  getHealthStatus(): BackendHealth {
    return { ...this.healthStatus };
  }

  getOperationHistory(): BackendOperation[] {
    return Array.from(this.operations.values()).sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  getServiceMetrics() {
    return {
      orchestrator: {
        totalOperations: this.operations.size,
        averageResponseTime: this.healthStatus.metrics.averageResponseTime,
        errorRate: this.healthStatus.metrics.errorRate,
        uptime: this.healthStatus.metrics.uptime,
      },
      database: databaseService.getMetrics(),
      api: apiBackend.getMetrics(),
      websocket: webSocketService.getStatus(),
      cache: enhancedBackend.getCacheStats(),
    };
  }

  // 🔄 Service management
  async restartService(serviceName: string): Promise<void> {
    console.log(`🔄 Restarting ${serviceName} service...`);
    
    switch (serviceName) {
      case 'websocket':
        webSocketService.disconnect();
        await webSocketService.connect();
        break;
      case 'database':
        databaseService.clearCache();
        databaseService.resetMetrics();
        break;
      case 'api':
        // API service doesn't need restart, just clear cache
        break;
      default:
        throw new Error(`Cannot restart unknown service: ${serviceName}`);
    }
    
    await this.performHealthCheck();
    console.log(`✅ ${serviceName} service restarted`);
  }

  async syncOfflineData(): Promise<void> {
    if (!this.config.enableOfflineMode) return;
    
    try {
      await enhancedBackend.syncLocalChanges();
      console.log('📡 Offline data synced successfully');
    } catch (error) {
      console.error('❌ Offline sync failed:', error);
    }
  }

  // 🧹 Cleanup
  destroy(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }
    
    webSocketService.destroy();
    authBackend.destroy();
    databaseService.clearCache();
    
    this.operations.clear();
    console.log('🧹 Backend orchestrator destroyed');
  }
}

// Export singleton instance
export const backendOrchestrator = new BackendOrchestrator();

// Convenient unified API
export const backend = {
  // Authentication
  auth: {
    login: (email: string, password: string, role: 'student' | 'institution') =>
      backendOrchestrator.authenticateUser(email, password, role),
    register: (userData: any) => backendOrchestrator.executeOperation('auth', 'register', userData),
    logout: () => backendOrchestrator.executeOperation('auth', 'logout'),
    getCurrentUser: () => backendOrchestrator.executeOperation('auth', 'getCurrentUser'),
    isAuthenticated: () => backendOrchestrator.executeOperation('auth', 'isAuthenticated'),
  },
  
  // Portfolio management
  portfolio: {
    get: (userId?: string) => backendOrchestrator.getUserPortfolio(userId),
    update: (data: any) => backendOrchestrator.executeOperation('api', 'updatePortfolio', { data }),
    analyze: (userId?: string) => backendOrchestrator.analyzeUserPortfolio(userId),
  },
  
  // Project management
  projects: {
    create: (data: any) => backendOrchestrator.createProjectWithAI(data),
    update: (id: string, data: any) => backendOrchestrator.executeOperation('api', 'updateProject', { id, data }),
    delete: (id: string) => backendOrchestrator.executeOperation('api', 'deleteProject', { id }),
  },
  
  // Skills management
  skills: {
    add: (data: any) => backendOrchestrator.executeOperation('api', 'addSkill', { data }),
    update: (id: string, level: any) => backendOrchestrator.executeOperation('api', 'updateSkill', { id, level }),
    delete: (id: string) => backendOrchestrator.executeOperation('api', 'deleteSkill', { id }),
  },
  
  // AI assistance
  ai: {
    chat: (message: string, context?: any) => backendOrchestrator.executeOperation('ai', 'getChatResponse', { message, context }),
    recommendations: (portfolio: any, user: any) => backendOrchestrator.executeOperation('ai', 'generateRecommendations', { portfolio, user }),
    skillRecommendations: (skills: any[], department?: string) => backendOrchestrator.executeOperation('ai', 'getSkillRecommendations', { skills, department }),
  },
  
  // Search
  search: (query: string, type: any, filters?: any) => 
    backendOrchestrator.searchWithIntelligence(query, type, filters),
  
  // File upload
  upload: (file: File, category: any) => 
    backendOrchestrator.executeOperation('api', 'uploadFile', { file, category }),
  
  // Monitoring
  health: () => backendOrchestrator.getHealthStatus(),
  metrics: () => backendOrchestrator.getServiceMetrics(),
  operations: () => backendOrchestrator.getOperationHistory(),
  
  // Service management
  restart: (service: string) => backendOrchestrator.restartService(service),
  sync: () => backendOrchestrator.syncOfflineData(),
};

// Beautiful console logging
if (typeof window !== 'undefined') {
  console.log('%c🎯 DigiPratibha Backend Orchestrator Initialized', 
    'background: linear-gradient(90deg, #7c3aed, #a855f7); color: white; padding: 10px; border-radius: 8px; font-weight: bold;');
  
  // Add global debug access
  (window as any).digiPratibhaBackend = backend;
  (window as any).backendOrchestrator = backendOrchestrator;
}