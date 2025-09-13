# DigiPratibha Backend System

A comprehensive, production-ready backend infrastructure for the DigiPratibha digital student portfolio platform.

## 🏗️ Architecture Overview

The DigiPratibha backend consists of multiple interconnected services designed for scalability, reliability, and performance:

### Core Services

1. **API Backend Service** (`/lib/api-backend.ts`)
   - RESTful API integration with caching and retry mechanisms
   - Intelligent fallback to local services
   - Request/response interceptors and middleware

2. **Authentication Backend** (`/lib/auth-backend.ts`)
   - Comprehensive authentication with JWT tokens
   - Session management and security monitoring
   - Role-based access control (RBAC)
   - Account lockout and security event logging

3. **Database Service** (`/lib/database-service.ts`)
   - Advanced data operations with caching and optimization
   - Transaction support and connection pooling
   - Real-time subscriptions and search capabilities
   - Health monitoring and metrics collection

4. **WebSocket Service** (`/lib/websocket-service.ts`)
   - Real-time bidirectional communication
   - Collaboration features and live updates
   - Automatic reconnection and offline queue
   - Room-based communication for portfolios and institutions

5. **Backend Orchestrator** (`/lib/backend-orchestrator.ts`)
   - Unified service coordination and management
   - Operation tracking and performance monitoring
   - Health checks and service restart capabilities
   - High-level convenience methods

6. **Express API Server** (`/server/api-server.ts`)
   - Production-ready REST API server
   - Authentication, validation, and security middleware
   - File upload, search, and analytics endpoints
   - Comprehensive error handling and logging

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 8+
- Supabase account (for database)
- Redis (optional, for caching)

### Installation

1. **Frontend Integration** (Already integrated in your app):
```typescript
import { backend } from './lib/backend-orchestrator';

// Authentication
const user = await backend.auth.login(email, password, role);

// Portfolio operations
const portfolio = await backend.portfolio.get();
const analysis = await backend.portfolio.analyze();

// AI assistance
const response = await backend.ai.chat('Help me improve my portfolio');
```

2. **Server Setup** (Optional - for dedicated API server):
```bash
cd server
npm install  # or use package-updated.json
npm run dev  # Development mode
npm run build && npm start  # Production mode
```

### Environment Variables

Create `.env` file:
```bash
# API Configuration
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_WS_URL=ws://localhost:3001

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Authentication
JWT_SECRET=your_jwt_secret_key

# Server Configuration
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Optional: Redis for caching
REDIS_URL=redis://localhost:6379

# Optional: OpenAI for enhanced AI features
OPENAI_API_KEY=your_openai_api_key
```

## 📊 Features

### Authentication & Security

- **JWT-based Authentication**: Secure token-based auth with automatic refresh
- **Role-based Access Control**: Student and Institution role separation
- **Security Monitoring**: Failed login tracking, account lockout, audit logs
- **Session Management**: Automatic session cleanup and activity tracking

### Data Management

- **Intelligent Caching**: Multi-level caching with TTL and invalidation
- **Offline Support**: Queue operations when offline, sync when online
- **Real-time Updates**: WebSocket-based live data synchronization
- **Transaction Support**: Atomic operations for data consistency

### AI Integration

- **Portfolio Analysis**: Automated scoring and improvement suggestions
- **Smart Recommendations**: AI-powered skill and project suggestions
- **Intelligent Chat**: Context-aware AI assistant for portfolio guidance
- **Market Intelligence**: Industry trend analysis and skill demand insights

### Performance & Monitoring

- **Health Monitoring**: Comprehensive service health checks
- **Performance Metrics**: Response times, error rates, cache hit rates
- **Operation Tracking**: Detailed logging of all backend operations
- **Auto-scaling**: Intelligent service management and restart capabilities

## 🔧 API Endpoints

### Authentication
```
POST /api/auth/register    - User registration
POST /api/auth/login       - User login
POST /api/auth/logout      - User logout
POST /api/auth/refresh     - Token refresh
```

### Portfolio Management
```
GET  /api/portfolios/me           - Get current user's portfolio
GET  /api/portfolios/user/:id     - Get user's portfolio (public/institution)
PUT  /api/portfolios/me           - Update portfolio
POST /api/portfolios/search       - Search portfolios
```

### Project Management
```
POST   /api/projects              - Create project
PUT    /api/projects/:id          - Update project
DELETE /api/projects/:id          - Delete project
PUT    /api/projects/batch        - Batch update projects
```

### Skills Management
```
POST   /api/skills                - Add skill
PUT    /api/skills/:id            - Update skill
DELETE /api/skills/:id            - Delete skill
```

### AI Services
```
GET  /api/ai/recommendations      - Get AI recommendations
POST /api/ai/analyze              - Analyze portfolio
POST /api/ai/chat                 - AI chat interaction
```

### Analytics (Institution)
```
GET  /api/analytics/institution   - Institution analytics
POST /api/analytics/students      - Student list with filters
GET  /api/analytics/departments   - Department statistics
```

### File Management
```
POST /api/upload                  - File upload
```

### Search
```
POST /api/search                  - Intelligent search
```

## 🛠️ Development

### Service Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Server     │    │   Supabase      │
│   React App     │◄──►│   Express.js     │◄──►│   Database      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌──────────────────┐             │
         └──────────────►│   WebSocket      │◄────────────┘
                        │   Real-time      │
                        └──────────────────┘
```

### Backend Services Flow

```
┌─────────────────┐
│ Backend         │
│ Orchestrator    │
└─────┬───────────┘
      │
      ├─── API Backend Service
      ├─── Auth Backend Service  
      ├─── Database Service
      ├─── WebSocket Service
      └─── Enhanced Backend Service
```

### Adding New Services

1. Create service class with standard interface:
```typescript
export class MyService {
  async initialize(): Promise<void> { }
  async operation(params: any): Promise<any> { }
  getHealth(): ServiceHealth { }
  destroy(): void { }
}
```

2. Register with orchestrator:
```typescript
// In backend-orchestrator.ts
private async executeMyServiceOperation(method: string, params: any): Promise<any> {
  switch (method) {
    case 'myOperation':
      return myService.operation(params);
    default:
      throw new Error(`Unknown method: ${method}`);
  }
}
```

### Testing

```bash
npm run test           # Run all tests
npm run test:unit      # Unit tests only
npm run test:integration # Integration tests
npm run test:e2e       # End-to-end tests
npm run test:coverage  # Coverage report
```

### Monitoring

Access health and metrics:
```typescript
// In browser console
const health = await backend.health();
const metrics = await backend.metrics();
const operations = await backend.operations();

// Service-specific metrics
console.log('Database metrics:', databaseService.getMetrics());
console.log('WebSocket status:', webSocketService.getStatus());
```

## 🔒 Security Features

### Authentication Security
- Password hashing with bcrypt
- JWT tokens with expiration
- Refresh token rotation
- Account lockout after failed attempts
- Session timeout and cleanup

### API Security
- CORS protection
- Rate limiting
- Helmet security headers
- Input validation and sanitization
- SQL injection prevention

### Data Security
- Encrypted sensitive data
- Secure file upload validation
- Role-based data access
- Audit logging

## 📈 Performance Optimizations

### Caching Strategy
- **L1 Cache**: In-memory service caches
- **L2 Cache**: Redis (optional)
- **L3 Cache**: Browser localStorage
- Smart cache invalidation

### Connection Management
- Connection pooling for database
- WebSocket connection reuse
- HTTP keep-alive
- Graceful degradation

### Query Optimization
- Indexed database queries
- Pagination for large datasets
- Selective field loading
- Batch operations

## 🚀 Deployment

### Environment Setup

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```

**Docker:**
```bash
npm run docker:build
npm run docker:run
```

### Configuration

The backend automatically adapts to:
- **Online Mode**: Full Supabase integration
- **Offline Mode**: Local storage fallback
- **Hybrid Mode**: Smart fallback between services

### Scaling Considerations

- **Horizontal Scaling**: Multiple API server instances
- **Database Scaling**: Supabase handles this automatically
- **Caching**: Redis cluster for distributed caching
- **Load Balancing**: Standard HTTP load balancer
- **CDN**: Static asset distribution

## 🤝 Integration Guide

### Using the Unified Backend API

```typescript
import { backend } from './lib/backend-orchestrator';

// Authentication
const handleLogin = async () => {
  try {
    const user = await backend.auth.login(email, password, role);
    console.log('Logged in:', user.name);
  } catch (error) {
    console.error('Login failed:', error.message);
  }
};

// Portfolio Management
const updatePortfolio = async (data) => {
  const result = await backend.portfolio.update(data);
  return result;
};

// AI Features
const getChatResponse = async (message) => {
  const response = await backend.ai.chat(message);
  return response;
};

// Real-time Features
webSocketService.subscribeToPortfolioUpdates(portfolioId, (update) => {
  console.log('Portfolio updated:', update);
});
```

### Error Handling

The backend provides consistent error handling:

```typescript
try {
  const result = await backend.portfolio.get();
} catch (error) {
  if (error.code === 'NETWORK_ERROR') {
    // Handle network issues
  } else if (error.code === 'AUTH_REQUIRED') {
    // Redirect to login
  } else {
    // Handle other errors
  }
}
```

## 📚 Advanced Features

### Batch Operations
```typescript
// Batch update multiple projects
const updates = [
  { id: 'proj1', data: { title: 'New Title 1' } },
  { id: 'proj2', data: { title: 'New Title 2' } }
];
await backend.projects.batchUpdate(updates);
```

### Real-time Collaboration
```typescript
// Join collaboration room
const collaboration = usePortfolioCollaboration(portfolioId);
collaboration.join();
collaboration.sendUpdate({ type: 'cursor', position: { x: 100, y: 200 } });
```

### Advanced Search
```typescript
// Intelligent search with filters
const results = await backend.search('react developer', 'portfolios', {
  department: 'Computer Science',
  minScore: 75,
  skills: ['React', 'TypeScript']
});
```

This backend system provides a robust, scalable foundation for DigiPratibha with enterprise-grade features including security, monitoring, caching, real-time updates, and AI integration.