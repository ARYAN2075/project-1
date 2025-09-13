// 🚀 DigiPratibha Database Initialization Service
// Simplified approach for creating tables through Supabase

import { createClient } from "npm:@supabase/supabase-js@2";

export class DatabaseInitService {
  private supabase: any;

  constructor(supabaseUrl: string, supabaseServiceKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
  }

  // Test database connection and basic setup
  async testAndSetupDatabase(): Promise<{success: boolean, message: string, details: any}> {
    try {
      console.log('🚀 Testing DigiPratibha database connection...');
      
      const results = {
        connection: false,
        existingTables: [] as string[],
        testQueries: [] as string[],
        errors: [] as string[],
        suggestions: [] as string[]
      };

      // Test 1: Basic connection
      try {
        const { data, error } = await this.supabase
          .from('users')
          .select('count')
          .limit(1);
        
        if (!error) {
          results.connection = true;
          results.existingTables.push('users');
          results.testQueries.push('✅ Users table accessible');
        }
      } catch (error) {
        results.errors.push(`Users table: ${error.message}`);
        results.suggestions.push('Create users table through Supabase dashboard');
      }

      // Test 2: Check for portfolios table
      try {
        const { data, error } = await this.supabase
          .from('portfolios')
          .select('count')
          .limit(1);
        
        if (!error) {
          results.existingTables.push('portfolios');
          results.testQueries.push('✅ Portfolios table accessible');
        }
      } catch (error) {
        results.errors.push(`Portfolios table: ${error.message}`);
        results.suggestions.push('Create portfolios table through Supabase dashboard');
      }

      // Test 3: Check for projects table
      try {
        const { data, error } = await this.supabase
          .from('projects')
          .select('count')
          .limit(1);
        
        if (!error) {
          results.existingTables.push('projects');
          results.testQueries.push('✅ Projects table accessible');
        }
      } catch (error) {
        results.errors.push(`Projects table: ${error.message}`);
        results.suggestions.push('Create projects table through Supabase dashboard');
      }

      // Test 4: Check for skills table
      try {
        const { data, error } = await this.supabase
          .from('skills')
          .select('count')
          .limit(1);
        
        if (!error) {
          results.existingTables.push('skills');
          results.testQueries.push('✅ Skills table accessible');
        }
      } catch (error) {
        results.errors.push(`Skills table: ${error.message}`);
        results.suggestions.push('Create skills table through Supabase dashboard');
      }

      // Test 5: Storage buckets
      try {
        const { data: buckets, error } = await this.supabase.storage.listBuckets();
        if (!error && buckets) {
          results.testQueries.push(`✅ Storage accessible: ${buckets.length} buckets found`);
        }
      } catch (error) {
        results.errors.push(`Storage: ${error.message}`);
      }

      // If we have basic tables, try to create sample data
      if (results.existingTables.length >= 2) {
        await this.createSampleData();
        results.testQueries.push('✅ Sample data creation attempted');
      }

      const isSuccessful = results.connection || results.existingTables.length > 0;

      return {
        success: isSuccessful,
        message: isSuccessful 
          ? `Database connection successful! Found ${results.existingTables.length} tables.`
          : 'Database setup needed. Please create tables through Supabase dashboard.',
        details: results
      };

    } catch (error) {
      console.error('❌ Database test failed:', error);
      return {
        success: false,
        message: `Database test failed: ${error.message}`,
        details: { error: error.message }
      };
    }
  }

  // Create sample data for testing
  private async createSampleData() {
    try {
      // Check if we have any users
      const { data: users, error: usersError } = await this.supabase
        .from('users')
        .select('id')
        .limit(1);

      if (!usersError && users && users.length === 0) {
        // Create a sample student user
        const { data: sampleUser, error: insertError } = await this.supabase
          .from('users')
          .insert({
            email: 'demo.student@digipratibha.com',
            name: 'Demo Student',
            role: 'student',
            department: 'Computer Science',
            institution_name: 'DigiPratibha University',
            institution_type: 'university',
            onboarding_completed: true,
            email_verified: true
          })
          .select()
          .single();

        if (!insertError && sampleUser) {
          console.log('✅ Sample student user created');
          
          // Create a sample portfolio
          const { data: portfolio, error: portfolioError } = await this.supabase
            .from('portfolios')
            .insert({
              user_id: sampleUser.id,
              title: 'Demo Portfolio',
              description: 'A sample portfolio created by DigiPratibha setup',
              theme: 'modern',
              visibility: 'public'
            })
            .select()
            .single();

          if (!portfolioError && portfolio) {
            console.log('✅ Sample portfolio created');

            // Add sample skills
            await this.supabase
              .from('skills')
              .insert([
                {
                  portfolio_id: portfolio.id,
                  name: 'React',
                  level: 'advanced',
                  category: 'Frontend',
                  proficiency_score: 85
                },
                {
                  portfolio_id: portfolio.id,
                  name: 'Node.js',
                  level: 'intermediate',
                  category: 'Backend',
                  proficiency_score: 75
                }
              ]);

            console.log('✅ Sample skills created');
          }
        }

        // Create a sample institution user
        await this.supabase
          .from('users')
          .insert({
            email: 'demo.institution@digipratibha.com',
            name: 'Demo Institution',
            role: 'institution',
            institution_name: 'DigiPratibha Institute',
            institution_type: 'university',
            onboarding_completed: true,
            email_verified: true
          });

        console.log('✅ Sample institution user created');
      }
    } catch (error) {
      console.log('Sample data creation warning:', error.message);
    }
  }

  // Get database schema information
  async getDatabaseInfo(): Promise<any> {
    try {
      const info = {
        tables: [],
        storage: [],
        functions: [],
        policies: []
      };

      // Check tables by trying to access them
      const tableNames = [
        'users', 'portfolios', 'projects', 'skills', 'education', 
        'experience', 'achievements', 'ai_recommendations', 
        'notifications', 'analytics_events', 'portfolio_views'
      ];

      for (const tableName of tableNames) {
        try {
          const { error } = await this.supabase
            .from(tableName)
            .select('count')
            .limit(1);
          
          if (!error) {
            info.tables.push(tableName);
          }
        } catch (e) {
          // Table doesn't exist or not accessible
        }
      }

      // Check storage buckets
      try {
        const { data: buckets, error } = await this.supabase.storage.listBuckets();
        if (!error && buckets) {
          info.storage = buckets.map((b: any) => b.name);
        }
      } catch (error) {
        console.log('Storage check warning:', error.message);
      }

      return info;

    } catch (error) {
      return {
        error: error.message,
        tables: [],
        storage: [],
        functions: [],
        policies: []
      };
    }
  }

  // Create SQL statements for manual table creation
  getSQLStatements(): string {
    return `
-- 🚀 DigiPratibha Database Schema
-- Copy and paste these commands into your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'institution')),
  department TEXT,
  institution_name TEXT,
  institution_type TEXT CHECK (institution_type IN ('university', 'college', 'school', 'training_center', 'bootcamp')),
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  location TEXT,
  website TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  twitter_url TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  preferences JSONB DEFAULT '{}',
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolios table
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'My Digital Portfolio',
  description TEXT,
  theme TEXT DEFAULT 'modern',
  visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'public', 'institutional')),
  custom_domain TEXT UNIQUE,
  template_id TEXT,
  header_image_url TEXT,
  logo_url TEXT,
  color_scheme JSONB DEFAULT '{}',
  layout_config JSONB DEFAULT '{}',
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  detailed_description TEXT,
  category TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed', 'published')),
  start_date DATE,
  end_date DATE,
  technologies TEXT[],
  skills_used TEXT[],
  live_url TEXT,
  github_url TEXT,
  demo_url TEXT,
  featured_image_url TEXT,
  gallery_images TEXT[],
  video_url TEXT,
  challenges_faced TEXT,
  lessons_learned TEXT,
  team_size INTEGER,
  my_role TEXT,
  impact_metrics JSONB DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  category TEXT,
  years_of_experience NUMERIC(3,1),
  certifications TEXT[],
  projects_used_in INTEGER DEFAULT 0,
  last_used_date DATE,
  proficiency_score INTEGER CHECK (proficiency_score >= 0 AND proficiency_score <= 100),
  is_core_skill BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Education table  
CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  institution_name TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT,
  start_date DATE,
  end_date DATE,
  grade TEXT,
  activities TEXT[],
  description TEXT,
  logo_url TEXT,
  is_current BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Experience table
CREATE TABLE IF NOT EXISTS experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  position TEXT NOT NULL,
  employment_type TEXT,
  location TEXT,
  start_date DATE,
  end_date DATE,
  description TEXT,
  responsibilities TEXT[],
  achievements TEXT[],
  technologies_used TEXT[],
  company_logo_url TEXT,
  company_website TEXT,
  is_current BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  issuer TEXT,
  issue_date DATE,
  expiry_date DATE,
  credential_id TEXT,
  credential_url TEXT,
  badge_image_url TEXT,
  category TEXT,
  skills_demonstrated TEXT[],
  verification_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Recommendations table
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('skill', 'opportunity', 'improvement', 'project')),
  title TEXT NOT NULL,
  description TEXT,
  priority INTEGER DEFAULT 1,
  confidence_score NUMERIC(3,2),
  reasoning TEXT,
  action_items TEXT[],
  resources JSONB DEFAULT '[]',
  is_read BOOLEAN DEFAULT FALSE,
  is_dismissed BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('system', 'achievement', 'recommendation', 'reminder')),
  title TEXT NOT NULL,
  message TEXT,
  action_url TEXT,
  action_text TEXT,
  icon TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  is_important BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics Events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_category TEXT,
  event_action TEXT,
  event_label TEXT,
  event_value NUMERIC,
  event_data JSONB DEFAULT '{}',
  session_id TEXT,
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  country TEXT,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolio Views table
CREATE TABLE IF NOT EXISTS portfolio_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  viewer_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  viewer_ip INET,
  viewer_country TEXT,
  viewer_city TEXT,
  referrer TEXT,
  user_agent TEXT,
  duration_seconds INTEGER,
  pages_viewed INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_visibility ON portfolios(visibility);
CREATE INDEX IF NOT EXISTS idx_projects_portfolio_id ON projects(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_skills_portfolio_id ON skills(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_education_portfolio_id ON education(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_experience_portfolio_id ON experience(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_achievements_portfolio_id ON achievements(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user_id ON ai_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_views_portfolio_id ON portfolio_views(portfolio_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_views ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (adjust based on your auth setup)
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (true);
CREATE POLICY "Users can insert own data" ON users FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can CRUD own portfolios" ON portfolios FOR ALL USING (true);
CREATE POLICY "Public portfolios viewable" ON portfolios FOR SELECT USING (visibility = 'public');

CREATE POLICY "Users can CRUD own projects" ON projects FOR ALL USING (true);
CREATE POLICY "Users can CRUD own skills" ON skills FOR ALL USING (true);
CREATE POLICY "Users can CRUD own education" ON education FOR ALL USING (true);
CREATE POLICY "Users can CRUD own experience" ON experience FOR ALL USING (true);
CREATE POLICY "Users can CRUD own achievements" ON achievements FOR ALL USING (true);

CREATE POLICY "Users can read own recommendations" ON ai_recommendations FOR SELECT USING (true);
CREATE POLICY "Users can update own recommendations" ON ai_recommendations FOR UPDATE USING (true);
CREATE POLICY "Users can insert recommendations" ON ai_recommendations FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can read own notifications" ON notifications FOR SELECT USING (true);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (true);
CREATE POLICY "Users can insert notifications" ON notifications FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can insert analytics" ON analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can read own analytics" ON analytics_events FOR SELECT USING (true);

CREATE POLICY "Anyone can insert portfolio views" ON portfolio_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can read portfolio views" ON portfolio_views FOR SELECT USING (true);

-- 🎉 Database setup complete!
`;
  }
}