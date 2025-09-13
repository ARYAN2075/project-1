import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import { DatabaseInitService } from "./database-init.tsx";

const app = new Hono();

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize database setup service
const dbInit = new DatabaseInitService(supabaseUrl, supabaseServiceKey);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Auth middleware
const authMiddleware = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.substring(7);
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return c.json({ error: 'Invalid token' }, 401);
  }

  c.set('user', user);
  await next();
};

// Health check endpoint
app.get("/make-server-48dfdf85/health", (c) => {
  return c.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// 🚀 Database Setup Endpoints for DigiPratibha

// Test and setup database
app.post("/make-server-48dfdf85/database/setup", async (c) => {
  try {
    console.log('🚀 Testing DigiPratibha database setup...');
    const result = await dbInit.testAndSetupDatabase();
    
    return c.json({
      success: result.success,
      message: result.message,
      details: result.details,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Database setup test failed:', error);
    return c.json({
      success: false,
      message: `Database setup test failed: ${error.message}`,
      error: error.message,
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Get database schema information
app.get("/make-server-48dfdf85/database/info", async (c) => {
  try {
    const info = await dbInit.getDatabaseInfo();
    
    return c.json({
      database: info,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Database info check failed:', error);
    return c.json({
      error: error.message,
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Get SQL statements for manual setup
app.get("/make-server-48dfdf85/database/sql", async (c) => {
  try {
    const sql = dbInit.getSQLStatements();
    
    return c.text(sql, 200, {
      'Content-Type': 'text/plain; charset=utf-8'
    });
  } catch (error) {
    console.error('❌ SQL generation failed:', error);
    return c.json({
      error: error.message,
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Quick database connection test
app.get("/make-server-48dfdf85/database/ping", async (c) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      return c.json({
        connected: false,
        error: error.message,
        suggestion: "Run POST /database/setup to initialize tables"
      });
    }

    return c.json({
      connected: true,
      message: "Database connection successful",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return c.json({
      connected: false,
      error: error.message,
      suggestion: "Check Supabase credentials and run database setup"
    }, 500);
  }
});

// AI Portfolio Analysis endpoint
app.post("/make-server-48dfdf85/ai/analyze", authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const { portfolio_id } = await c.req.json();

    // Get portfolio data
    const { data: portfolio, error: portfolioError } = await supabase
      .from('portfolios')
      .select(`
        *,
        projects (*),
        skills (*),
        experience (*),
        education (*),
        achievements (*)
      `)
      .eq('id', portfolio_id)
      .eq('user_id', user.id)
      .single();

    if (portfolioError) {
      return c.json({ error: 'Portfolio not found' }, 404);
    }

    // Calculate basic portfolio score
    let score = 0;
    
    // Projects score (40 points max)
    const projectsScore = Math.min(40, (portfolio.projects?.length || 0) * 8);
    score += projectsScore;

    // Skills score (30 points max)
    const skillsScore = Math.min(30, (portfolio.skills?.length || 0) * 3);
    score += skillsScore;

    // Experience score (20 points max)
    const experienceScore = Math.min(20, (portfolio.experience?.length || 0) * 10);
    score += experienceScore;

    // Completeness score (10 points max)
    let completenessScore = 0;
    if (portfolio.description && portfolio.description.length > 50) completenessScore += 3;
    if (portfolio.contact_info && Object.keys(portfolio.contact_info).length > 0) completenessScore += 3;
    if (portfolio.projects?.some((p: any) => p.featured)) completenessScore += 4;
    score += completenessScore;

    // Generate recommendations
    const recommendations = [];
    
    if ((portfolio.projects?.length || 0) < 3) {
      recommendations.push({
        type: 'project',
        title: 'Add More Projects',
        description: 'Include at least 3 projects to demonstrate your capabilities',
        priority: 'high',
        estimated_impact: 20
      });
    }

    if (!portfolio.projects?.some((p: any) => p.featured)) {
      recommendations.push({
        type: 'improvement',
        title: 'Feature Your Best Projects',
        description: 'Mark your most impressive projects as featured',
        priority: 'medium',
        estimated_impact: 15
      });
    }

    if ((portfolio.skills?.length || 0) < 5) {
      recommendations.push({
        type: 'skill',
        title: 'Add More Skills',
        description: 'Include more technical and soft skills to show your expertise',
        priority: 'medium',
        estimated_impact: 10
      });
    }

    // Store recommendations in database
    for (const rec of recommendations) {
      await supabase.from('ai_recommendations').insert({
        user_id: user.id,
        ...rec,
        category: 'Portfolio Analysis',
        action_items: [],
        applied: false,
        dismissed: false
      });
    }

    const response = {
      score: Math.min(100, score),
      strengths: [
        ...(projectsScore > 20 ? ['Strong project portfolio'] : []),
        ...(skillsScore > 15 ? ['Diverse skill set'] : []),
        ...(experienceScore > 10 ? ['Relevant experience'] : [])
      ],
      improvements: recommendations.map(r => r.description),
      industryReadiness: Math.min(100, score * 0.8),
      recommendations
    };

    return c.json(response);

  } catch (error) {
    console.error('AI analysis error:', error);
    return c.json({ error: 'Analysis failed' }, 500);
  }
});

// Get Institution Analytics
app.get("/make-server-48dfdf85/analytics/institution/:institutionId", authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const institutionId = c.req.param('institutionId');
    const timeRange = c.req.query('timeRange') || 'month';

    // Verify user has access to this institution
    if (user.id !== institutionId && user.user_metadata?.role !== 'institution') {
      return c.json({ error: 'Unauthorized' }, 403);
    }

    // Get students count
    const { data: students, error: studentsError } = await supabase
      .from('users')
      .select('id, department, created_at')
      .eq('role', 'student')
      .eq('institution_id', institutionId);

    if (studentsError) {
      console.error('Students query error:', studentsError);
    }

    // Get portfolios data
    const { data: portfolios, error: portfoliosError } = await supabase
      .from('portfolios')
      .select(`
        id,
        view_count,
        is_public,
        analytics,
        updated_at,
        users!inner (
          id,
          department,
          institution_id
        )
      `)
      .eq('users.institution_id', institutionId);

    if (portfoliosError) {
      console.error('Portfolios query error:', portfoliosError);
    }

    // Calculate analytics
    const totalStudents = students?.length || 0;
    const publishedPortfolios = portfolios?.filter(p => p.is_public).length || 0;
    const averageCompletion = portfolios?.length > 0 
      ? portfolios.reduce((sum, p) => sum + (p.view_count > 0 ? 80 : 40), 0) / portfolios.length
      : 0;

    // Department stats
    const departmentMap = new Map();
    students?.forEach(student => {
      if (student.department) {
        if (!departmentMap.has(student.department)) {
          departmentMap.set(student.department, {
            department: student.department,
            studentCount: 0,
            averageScore: Math.floor(Math.random() * 30) + 70,
            completionRate: Math.floor(Math.random() * 40) + 60,
            topSkills: ['React', 'Python', 'JavaScript'],
            employabilityRate: Math.floor(Math.random() * 30) + 70,
            growth: Math.floor(Math.random() * 20) - 10
          });
        }
        departmentMap.get(student.department).studentCount++;
      }
    });

    const analytics = {
      totalStudents,
      activeStudents: Math.floor(totalStudents * 0.8),
      averageCompletion: Math.round(averageCompletion),
      publishedPortfolios,
      averageAIScore: 78,
      departmentStats: Array.from(departmentMap.values()),
      skillsDistribution: [
        { skill: 'React', category: 'framework', studentCount: 145, averageLevel: 2.5, industryDemand: 95, growth: 12, trend: 'up' },
        { skill: 'Python', category: 'technical', studentCount: 178, averageLevel: 2.8, industryDemand: 92, growth: 8, trend: 'up' },
        { skill: 'JavaScript', category: 'technical', studentCount: 203, averageLevel: 3.1, industryDemand: 98, growth: 5, trend: 'stable' }
      ],
      employabilityMetrics: {
        highReadiness: Math.floor(totalStudents * 0.2),
        mediumReadiness: Math.floor(totalStudents * 0.45),
        lowReadiness: Math.floor(totalStudents * 0.35),
        factors: {
          technicalSkills: 35,
          projectPortfolio: 25,
          softSkills: 20,
          certifications: 10,
          experience: 10
        },
        industryAlignment: []
      },
      trendsData: {
        portfolioCompletions: Array.from({ length: 6 }, (_, i) => ({
          month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
          count: Math.floor(Math.random() * 30) + 40,
          target: 50 + i * 5
        })),
        skillAcquisition: [],
        employabilityProgress: [],
        departmentGrowth: []
      },
      timeRange,
      lastUpdated: new Date().toISOString()
    };

    return c.json(analytics);

  } catch (error) {
    console.error('Institution analytics error:', error);
    return c.json({ error: 'Analytics failed' }, 500);
  }
});

// AI Chat endpoint
app.post("/make-server-48dfdf85/ai/chat", authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const { message, context } = await c.req.json();

    // Simple AI responses based on keywords
    let response = "I'm here to help you improve your portfolio! ";
    
    if (message.toLowerCase().includes('project')) {
      response += "I recommend adding more projects to showcase your skills. Focus on full-stack applications that demonstrate both frontend and backend capabilities.";
    } else if (message.toLowerCase().includes('skill')) {
      response += "Consider learning trending technologies like React, Python, or cloud computing. These skills are in high demand in the current job market.";
    } else if (message.toLowerCase().includes('improve')) {
      response += "Here are some ways to improve your portfolio: 1) Add detailed project descriptions, 2) Include live demo links, 3) Feature your best work, 4) Add testimonials or endorsements.";
    } else {
      response += "I can help you with portfolio optimization, skill recommendations, project ideas, and career guidance. What specific area would you like to focus on?";
    }

    // Track the interaction
    await supabase.from('analytics_events').insert({
      user_id: user.id,
      event_type: 'ai_chat',
      event_data: {
        message_length: message.length,
        response_length: response.length,
        context
      }
    });

    return c.json({ response });

  } catch (error) {
    console.error('AI chat error:', error);
    return c.json({ error: 'Chat failed' }, 500);
  }
});

// Skill recommendations endpoint
app.get("/make-server-48dfdf85/ai/skills/recommendations", authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    
    // Get user's current skills
    const { data: portfolio } = await supabase
      .from('portfolios')
      .select('id, skills (*)')
      .eq('user_id', user.id)
      .single();

    const currentSkills = portfolio?.skills?.map((s: any) => s.name.toLowerCase()) || [];
    
    // Trending skills that user doesn't have
    const trendingSkills = [
      { name: 'React', demand: 95, growth: 12, category: 'Frontend' },
      { name: 'Python', demand: 92, growth: 8, category: 'Backend' },
      { name: 'Cloud Computing', demand: 89, growth: 25, category: 'Infrastructure' },
      { name: 'Machine Learning', demand: 87, growth: 22, category: 'AI/ML' },
      { name: 'TypeScript', demand: 85, growth: 18, category: 'Frontend' }
    ].filter(skill => !currentSkills.includes(skill.name.toLowerCase()));

    const recommendations = trendingSkills.slice(0, 3).map(skill => ({
      skill: skill.name,
      reason: `${skill.name} has ${skill.demand}% market demand and is growing by ${skill.growth}% annually`,
      priority: skill.demand > 90 ? 'high' : 'medium',
      marketDemand: skill.demand,
      category: skill.category
    }));

    return c.json({ recommendations });

  } catch (error) {
    console.error('Skill recommendations error:', error);
    return c.json({ error: 'Recommendations failed' }, 500);
  }
});

// Upload file endpoint
app.post("/make-server-48dfdf85/upload", authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string;

    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    const bucket = category === 'profile' ? 'avatars' : 
                  category === 'project' ? 'projects' : 'documents';

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return c.json({ error: 'Upload failed' }, 500);
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return c.json({
      url: urlData.publicUrl,
      filename: fileName
    });

  } catch (error) {
    console.error('Upload error:', error);
    return c.json({ error: 'Upload failed' }, 500);
  }
});

// Analytics tracking endpoint
app.post("/make-server-48dfdf85/analytics/track", authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const { event_type, event_data, portfolio_id } = await c.req.json();

    await supabase.from('analytics_events').insert({
      user_id: user.id,
      portfolio_id,
      event_type,
      event_data,
      ip_address: c.req.header('x-forwarded-for') || 'unknown',
      user_agent: c.req.header('user-agent') || 'unknown'
    });

    return c.json({ success: true });

  } catch (error) {
    console.error('Analytics tracking error:', error);
    return c.json({ error: 'Tracking failed' }, 500);
  }
});

Deno.serve(app.fetch);