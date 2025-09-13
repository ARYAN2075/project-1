# DigiPratibha Backend Server

This directory contains the Node.js/Express backend server for DigiPratibha.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Initialize database
npm run db:init

# Start development server
npm run dev

# Start production server
npm start
```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/digipratibha
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# AI Services
OPENAI_API_KEY=your-openai-api-key
AI_MODEL=gpt-4-turbo-preview

# File Storage
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_BUCKET_NAME=digipratibha-uploads
AWS_REGION=us-east-1

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# External APIs
GITHUB_CLIENT_ID=your-github-oauth-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-client-secret
LINKEDIN_CLIENT_ID=your-linkedin-oauth-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-oauth-client-secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Analytics
GOOGLE_ANALYTICS_ID=your-ga-tracking-id
MIXPANEL_TOKEN=your-mixpanel-token
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Portfolio Management
- `GET /api/portfolios/:userId` - Get user portfolio
- `PUT /api/portfolios/:userId` - Update portfolio
- `POST /api/portfolios/:userId/projects` - Create project
- `PUT /api/portfolios/:userId/projects/:projectId` - Update project
- `DELETE /api/portfolios/:userId/projects/:projectId` - Delete project
- `POST /api/portfolios/:userId/skills` - Add skill
- `PUT /api/portfolios/:userId/skills/:skillId` - Update skill
- `DELETE /api/portfolios/:userId/skills/:skillId` - Remove skill

### AI Assistant
- `POST /api/ai/recommendations` - Get AI recommendations
- `POST /api/ai/analyze/:userId` - Analyze portfolio
- `POST /api/ai/chat` - Chat with AI assistant
- `POST /api/ai/skills/suggest` - Get skill suggestions

### Institution Analytics
- `GET /api/analytics/institution/:institutionId` - Get institution analytics
- `GET /api/analytics/institution/:institutionId/students` - Get students list
- `GET /api/analytics/institution/:institutionId/departments` - Get department stats
- `GET /api/analytics/trends` - Get industry trends

### File Management
- `POST /api/upload` - Upload files
- `DELETE /api/upload/:fileId` - Delete file
- `GET /api/upload/:fileId` - Get file info

### Real-time Updates
- `WS /api/ws/:userId` - WebSocket connection for real-time updates

## Database Schema

The application uses PostgreSQL with the following main tables:

- `users` - User accounts (students and institutions)
- `portfolios` - Student portfolios
- `projects` - Portfolio projects
- `skills` - User skills
- `experience` - Work experience
- `education` - Educational background
- `achievements` - Awards and certifications
- `ai_recommendations` - AI-generated recommendations
- `notifications` - User notifications
- `analytics_events` - Analytics tracking
- `skill_trends` - Industry skill trends
- `institution_settings` - Institution configurations

## Development Commands

```bash
# Database operations
npm run db:migrate        # Run database migrations
npm run db:seed           # Seed database with sample data
npm run db:reset          # Reset database (WARNING: destroys data)

# Testing
npm test                  # Run all tests
npm run test:unit         # Run unit tests
npm run test:integration  # Run integration tests
npm run test:e2e          # Run end-to-end tests

# Code quality
npm run lint              # Run ESLint
npm run format            # Format code with Prettier
npm run type-check        # TypeScript type checking

# Production
npm run build             # Build for production
npm run start:prod        # Start production server
```

## Deployment

### Using Docker

```bash
# Build Docker image
docker build -t digipratibha-backend .

# Run with Docker Compose
docker-compose up -d
```

### Using PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start ecosystem.config.js

# Monitor
pm2 monit

# View logs
pm2 logs
```

### Environment-specific Configurations

- **Development**: Uses local PostgreSQL and Redis
- **Staging**: Uses cloud databases with staging configurations
- **Production**: Uses production databases with SSL, monitoring, and backups

## Security Features

- JWT-based authentication with refresh tokens
- Rate limiting on all endpoints
- Input validation and sanitization
- SQL injection protection
- XSS protection
- CORS configuration
- Helmet.js security headers
- Password hashing with bcrypt
- API key management for external services

## Monitoring and Logging

- Winston logger with multiple transports
- Request/response logging
- Error tracking with Sentry
- Performance monitoring with New Relic
- Health check endpoints
- Metrics collection for Prometheus

## AI Integration

The backend integrates with multiple AI services:

- **OpenAI GPT-4**: For portfolio analysis and recommendations
- **Custom ML Models**: For skill trend analysis
- **Natural Language Processing**: For resume parsing
- **Computer Vision**: For project image analysis

## Data Privacy

- GDPR compliance for EU users
- Data anonymization for analytics
- Secure file storage with encryption
- User data export functionality
- Right to be forgotten implementation

## Support

For technical support or questions:
- Create an issue in the GitHub repository
- Email: support@digipratibha.com
- Documentation: https://docs.digipratibha.com