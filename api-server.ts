// DigiPratibha Express.js API Server
// Production-Ready Backend with Authentication, Validation, and Error Handling

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import { body, param, query, validationResult } from 'express-validator';

// Types
interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'institution';
  department?: string;
  institution_name?: string;
  institution_type?: 'university' | 'college' | 'school';
}

interface AuthenticatedRequest extends Request {
  user?: User;
}

interface APIResponse<T = any> {
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

// Configuration
const config = {
  port: process.env.PORT || 3001,
  jwtSecret: process.env.JWT_SECRET || 'digipratibha-secret-key-change-in-production',
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseKey: process.env.SUPABASE_ANON_KEY || '',
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
};

// Initialize Supabase client
const supabase = createClient(config.supabaseUrl, config.supabaseKey);

// Initialize Express app
const app = express();

// 🛡️ Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// 🌐 CORS configuration
app.use(cors({
  origin: config.corsOrigin.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// 📊 Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// 🗜️ Compression and parsing
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 📝 Logging
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));

// 📁 File upload configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

// 🔐 Authentication middleware
const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required',
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as any;
    
    // Get user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }
};

// 🎭 Role-based access control
const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
      });
    }
    next();
  };
};

// 🔧 Validation error handler
const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array(),
    });
  }
  next();
};

// 🏥 Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      version: '1.0.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

// 🔐 Authentication routes
app.post('/api/auth/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').isLength({ min: 2 }),
  body('role').isIn(['student', 'institution']),
  handleValidationErrors,
], async (req: Request, res: Response) => {
  try {
    const { email, password, name, role, department, institutionName, institutionType } = req.body;

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User already exists with this email',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create auth user in Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
          department,
          institutionName,
          institutionType,
        },
      },
    });

    if (authError) {
      return res.status(400).json({
        success: false,
        error: authError.message,
      });
    }

    // Create user profile
    const { data: user, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user!.id,
        email,
        name,
        role,
        department,
        institution_name: institutionName,
        institution_type: institutionType,
        onboarding_completed: false,
        email_verified: false,
        preferences: {},
      })
      .select()
      .single();

    if (profileError) {
      return res.status(500).json({
        success: false,
        error: 'Failed to create user profile',
      });
    }

    // Create default portfolio for students
    if (role === 'student') {
      const slug = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      
      await supabase
        .from('portfolios')
        .insert({
          user_id: user.id,
          title: `${name}'s Portfolio`,
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
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      data: {
        user,
        token,
      },
      message: 'Registration successful',
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

app.post('/api/auth/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  body('role').isIn(['student', 'institution']),
  handleValidationErrors,
], async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Get user profile
    const { data: user, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !user) {
      return res.status(401).json({
        success: false,
        error: 'User profile not found',
      });
    }

    // Check role
    if (user.role !== role) {
      return res.status(403).json({
        success: false,
        error: `Access denied. This account is registered as ${user.role}, not ${role}.`,
      });
    }

    // Update last login
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        user,
        token,
      },
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

app.post('/api/auth/logout', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Sign out from Supabase
    await supabase.auth.signOut();

    res.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

app.post('/api/auth/refresh', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Generate new JWT token
    const token = jwt.sign(
      { userId: req.user!.id, email: req.user!.email, role: req.user!.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: { token },
      message: 'Token refreshed successfully',
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// 📂 Portfolio routes
app.get('/api/portfolios/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { data: portfolio, error } = await supabase
      .from('portfolios')
      .select(`
        *,
        projects (*),
        skills (*),
        experience (*),
        education (*),
        achievements (*)
      `)
      .eq('user_id', req.user!.id)
      .single();

    if (error) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio not found',
      });
    }

    res.json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

app.get('/api/portfolios/user/:userId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const { data: portfolio, error } = await supabase
      .from('portfolios')
      .select(`
        *,
        projects (*),
        skills (*),
        experience (*),
        education (*),
        achievements (*)
      `)
      .eq('user_id', userId)
      .single();

    if (error) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio not found',
      });
    }

    // Check if portfolio is public or user has permission
    if (!portfolio.is_public && portfolio.user_id !== req.user!.id && req.user!.role !== 'institution') {
      return res.status(403).json({
        success: false,
        error: 'Portfolio is private',
      });
    }

    res.json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    console.error('Get user portfolio error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

app.put('/api/portfolios/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updates = req.body;

    // Get current portfolio
    const { data: currentPortfolio } = await supabase
      .from('portfolios')
      .select('id')
      .eq('user_id', req.user!.id)
      .single();

    if (!currentPortfolio) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio not found',
      });
    }

    const { data: portfolio, error } = await supabase
      .from('portfolios')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', currentPortfolio.id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to update portfolio',
      });
    }

    res.json({
      success: true,
      data: portfolio,
      message: 'Portfolio updated successfully',
    });
  } catch (error) {
    console.error('Update portfolio error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// 🚀 Project routes
app.post('/api/projects', authenticateToken, requireRole(['student']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const projectData = req.body;

    // Get user's portfolio
    const { data: portfolio } = await supabase
      .from('portfolios')
      .select('id')
      .eq('user_id', req.user!.id)
      .single();

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio not found',
      });
    }

    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        portfolio_id: portfolio.id,
        ...projectData,
        order_index: 0,
        images: projectData.images || [],
        technologies: projectData.technologies || [],
        skills_demonstrated: projectData.skills_demonstrated || [],
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to create project',
      });
    }

    res.status(201).json({
      success: true,
      data: project,
      message: 'Project created successfully',
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

app.put('/api/projects/:projectId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const updates = req.body;

    // Verify project ownership
    const { data: project } = await supabase
      .from('projects')
      .select('portfolio_id, portfolios!inner(user_id)')
      .eq('id', projectId)
      .single();

    if (!project || (project as any).portfolios.user_id !== req.user!.id) {
      return res.status(403).json({
        success: false,
        error: 'Project not found or access denied',
      });
    }

    const { data: updatedProject, error } = await supabase
      .from('projects')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to update project',
      });
    }

    res.json({
      success: true,
      data: updatedProject,
      message: 'Project updated successfully',
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

app.delete('/api/projects/:projectId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId } = req.params;

    // Verify project ownership
    const { data: project } = await supabase
      .from('projects')
      .select('portfolio_id, portfolios!inner(user_id)')
      .eq('id', projectId)
      .single();

    if (!project || (project as any).portfolios.user_id !== req.user!.id) {
      return res.status(403).json({
        success: false,
        error: 'Project not found or access denied',
      });
    }

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to delete project',
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// 📁 File upload route
app.post('/api/upload', authenticateToken, upload.single('file'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
    }

    const { category } = req.body;
    const file = req.file;
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${req.user!.id}/${category}/${Date.now()}.${fileExt}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('portfolios')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to upload file',
      });
    }

    const { data: urlData } = supabase.storage
      .from('portfolios')
      .getPublicUrl(fileName);

    res.json({
      success: true,
      data: {
        url: urlData.publicUrl,
        filename: fileName,
      },
      message: 'File uploaded successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// 🔍 Search route
app.post('/api/search', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { query, type, filters } = req.body;

    let data = [];
    let error = null;

    switch (type) {
      case 'portfolios':
        ({ data, error } = await supabase
          .from('portfolios')
          .select(`
            *,
            users!inner (name, department)
          `)
          .eq('is_public', true)
          .ilike('title', `%${query}%`));
        break;

      case 'students':
        if (req.user!.role !== 'institution') {
          return res.status(403).json({
            success: false,
            error: 'Insufficient permissions',
          });
        }
        ({ data, error } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'student')
          .or(`name.ilike.%${query}%,email.ilike.%${query}%,department.ilike.%${query}%`));
        break;

      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid search type',
        });
    }

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Search failed',
      });
    }

    res.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// 🤖 AI Assistant routes
app.get('/api/ai/recommendations', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Mock AI recommendations - integrate with real AI service
    const suggestions = [
      'Add more interactive projects to showcase your skills',
      'Include live demo links for your web applications',
      'Add technical blog posts to demonstrate your knowledge',
      'Consider learning trending technologies like React or Node.js',
      'Contribute to open source projects to build your reputation',
    ];

    const improvements = [
      'Enhance project descriptions with technical details',
      'Add screenshots and visual documentation',
      'Include performance metrics and optimizations',
      'Document your problem-solving approach',
      'Add testimonials or peer reviews',
    ];

    res.json({
      success: true,
      data: {
        suggestions: suggestions.slice(0, 3),
        improvements: improvements.slice(0, 3),
      },
    });
  } catch (error) {
    console.error('AI recommendations error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// 📊 Analytics routes (Institution only)
app.get('/api/analytics/institution', authenticateToken, requireRole(['institution']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { timeRange = 'month' } = req.query;

    // Mock analytics data - integrate with real analytics
    const analytics = {
      timeRange,
      totalStudents: 156,
      activePortfolios: 142,
      completedProfiles: 128,
      averageScore: 78.5,
      topSkills: ['JavaScript', 'React', 'Python', 'Node.js', 'SQL'],
      departmentBreakdown: [
        { name: 'Computer Science', students: 89, avgScore: 82 },
        { name: 'Information Technology', students: 67, avgScore: 75 },
      ],
      monthlyGrowth: 12.5,
      employabilityRate: 86.3,
    };

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// 🔔 Notifications routes
app.get('/api/notifications', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { limit = 20 } = req.query;

    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', req.user!.id)
      .order('created_at', { ascending: false })
      .limit(Number(limit));

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch notifications',
      });
    }

    res.json({
      success: true,
      data: notifications || [],
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// 🚫 Error handling middleware
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', error);
  
  res.status(500).json({
    success: false,
    error: config.nodeEnv === 'production' ? 'Internal server error' : error.message,
  });
});

// 🚫 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// 🚀 Start server
const server = app.listen(config.port, () => {
  console.log(`
🚀 DigiPratibha API Server running on port ${config.port}
🌐 Environment: ${config.nodeEnv}
🛡️  Security: Enabled
📊 Rate limiting: Enabled
🔐 Authentication: JWT
🗃️  Database: Supabase
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

export default app;