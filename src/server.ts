// DigiPratibha Backend Server Entry Point

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth';
import portfolioRoutes from './routes/portfolios';
import aiRoutes from './routes/ai';
import analyticsRoutes from './routes/analytics';
import uploadRoutes from './routes/upload';
import webhookRoutes from './routes/webhooks';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/logger';
import { authMiddleware } from './middleware/auth';

// Import services
import { DatabaseService } from './services/database';
import { RedisService } from './services/redis';
import { SocketService } from './services/socket';
import { CronService } from './services/cron';
import { MetricsService } from './services/metrics';

// Load environment variables
dotenv.config();

class DigiPratibhaServer {
  private app: express.Application;
  private server: any;
  private io: SocketIOServer;
  private port: number;
  private databaseService: DatabaseService;
  private redisService: RedisService;
  private socketService: SocketService;
  private cronService: CronService;
  private metricsService: MetricsService;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3001', 10);
    
    // Initialize services
    this.databaseService = new DatabaseService();
    this.redisService = new RedisService();
    this.metricsService = new MetricsService();
    
    // Create HTTP server
    this.server = createServer(this.app);
    
    // Initialize Socket.IO
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
      }
    });
    
    this.socketService = new SocketService(this.io);
    this.cronService = new CronService();
  }

  private configureMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          imgSrc: ["'self'", 'data:', 'https:'],
          scriptSrc: ["'self'"],
        },
      },
    }));

    // CORS configuration
    this.app.use(cors({
      origin: (origin, callback) => {
        const allowedOrigins = [
          process.env.FRONTEND_URL || 'http://localhost:3000',
          'http://localhost:3000',
          'https://digipratibha.com',
          'https://www.digipratibha.com'
        ];
        
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
      message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: 900
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api/', limiter);

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Compression
    this.app.use(compression());

    // Request logging
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined', { stream: { write: requestLogger.info.bind(requestLogger) } }));
    }

    // Custom request logger middleware
    this.app.use((req, res, next) => {
      requestLogger.info(`${req.method} ${req.originalUrl}`, {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        timestamp: new Date().toISOString()
      });
      next();
    });

    // Metrics collection
    this.app.use((req, res, next) => {
      const start = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - start;
        this.metricsService.recordHttpRequest(req.method, req.route?.path || req.path, res.statusCode, duration);
      });
      next();
    });
  }

  private configureRoutes(): void {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development'
      });
    });

    // Metrics endpoint
    this.app.get('/metrics', this.metricsService.getMetricsHandler());

    // API routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/portfolios', authMiddleware, portfolioRoutes);
    this.app.use('/api/ai', authMiddleware, aiRoutes);
    this.app.use('/api/analytics', authMiddleware, analyticsRoutes);
    this.app.use('/api/upload', authMiddleware, uploadRoutes);
    this.app.use('/api/webhooks', webhookRoutes);

    // Catch-all route for undefined endpoints
    this.app.use('/api/*', (req, res) => {
      res.status(404).json({
        error: 'API endpoint not found',
        message: `The endpoint ${req.originalUrl} does not exist`,
        availableEndpoints: [
          '/api/auth/*',
          '/api/portfolios/*',
          '/api/ai/*',
          '/api/analytics/*',
          '/api/upload/*',
          '/api/webhooks/*'
        ]
      });
    });

    // Serve static files for portfolio templates and assets
    this.app.use('/templates', express.static('src/templates'));
    this.app.use('/public', express.static('src/public'));
  }

  private configureErrorHandling(): void {
    // Global error handler
    this.app.use(errorHandler);

    // Unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      // Optionally exit the process
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
    });

    // Uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      process.exit(1);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => this.gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => this.gracefulShutdown('SIGINT'));
  }

  private async initializeServices(): Promise<void> {
    try {
      // Initialize database
      await this.databaseService.connect();
      console.log('✅ Database connected successfully');

      // Initialize Redis
      await this.redisService.connect();
      console.log('✅ Redis connected successfully');

      // Initialize Socket.IO service
      this.socketService.initialize();
      console.log('✅ Socket.IO service initialized');

      // Start cron jobs
      this.cronService.start();
      console.log('✅ Cron jobs started');

      // Initialize metrics
      this.metricsService.initialize();
      console.log('✅ Metrics service initialized');

    } catch (error) {
      console.error('❌ Failed to initialize services:', error);
      process.exit(1);
    }
  }

  private async gracefulShutdown(signal: string): Promise<void> {
    console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

    try {
      // Stop accepting new connections
      this.server.close(async () => {
        console.log('📦 HTTP server closed');

        // Close database connections
        await this.databaseService.disconnect();
        console.log('🗄️ Database disconnected');

        // Close Redis connections
        await this.redisService.disconnect();
        console.log('🔴 Redis disconnected');

        // Stop cron jobs
        this.cronService.stop();
        console.log('⏰ Cron jobs stopped');

        console.log('✅ Graceful shutdown completed');
        process.exit(0);
      });

      // Force close after 30 seconds
      setTimeout(() => {
        console.error('❌ Forced shutdown due to timeout');
        process.exit(1);
      }, 30000);

    } catch (error) {
      console.error('❌ Error during graceful shutdown:', error);
      process.exit(1);
    }
  }

  public async start(): Promise<void> {
    try {
      // Configure middleware
      this.configureMiddleware();

      // Configure routes
      this.configureRoutes();

      // Configure error handling
      this.configureErrorHandling();

      // Initialize services
      await this.initializeServices();

      // Start the server
      this.server.listen(this.port, () => {
        console.log(`\n🚀 DigiPratibha Backend Server started successfully!`);
        console.log(`📍 Server running on: http://localhost:${this.port}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`📊 Health check: http://localhost:${this.port}/health`);
        console.log(`📈 Metrics: http://localhost:${this.port}/metrics`);
        console.log(`📚 API Base URL: http://localhost:${this.port}/api`);
        console.log(`\n🎯 Ready to serve digital portfolio requests!`);
      });

    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }
}

// Start the server
if (require.main === module) {
  const server = new DigiPratibhaServer();
  server.start().catch((error) => {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  });
}

export default DigiPratibhaServer;