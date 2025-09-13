-- 🚀 DigiPratibha Database Schema
-- Beautiful, Production-Ready Supabase Database Setup
-- Execute these commands in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom types
CREATE TYPE user_role AS ENUM ('student', 'institution');
CREATE TYPE institution_type AS ENUM ('university', 'college', 'school', 'training_center', 'bootcamp');
CREATE TYPE project_status AS ENUM ('draft', 'in_progress', 'completed', 'published');
CREATE TYPE skill_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
CREATE TYPE portfolio_visibility AS ENUM ('private', 'public', 'institutional');
CREATE TYPE notification_type AS ENUM ('system', 'achievement', 'recommendation', 'reminder');
CREATE TYPE ai_recommendation_type AS ENUM ('skill', 'opportunity', 'improvement', 'project');

-- 👥 Users table - Core user management
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role user_role NOT NULL,
    department TEXT,
    institution_name TEXT,
    institution_type institution_type,
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

-- 📂 Portfolios table - Digital portfolio management
CREATE TABLE portfolios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'My Digital Portfolio',
    description TEXT,
    theme TEXT DEFAULT 'modern',
    visibility portfolio_visibility DEFAULT 'private',
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

-- 🛠️ Projects table - Portfolio projects
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    detailed_description TEXT,
    category TEXT,
    status project_status DEFAULT 'draft',
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

-- 🎯 Skills table - User skills tracking
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    level skill_level NOT NULL,
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

-- 🎓 Education table - Educational background
CREATE TABLE education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- 💼 Experience table - Work experience
CREATE TABLE experience (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    position TEXT NOT NULL,
    employment_type TEXT, -- full-time, part-time, contract, internship
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

-- 🏆 Achievements table - Certifications, awards, accomplishments
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    issuer TEXT,
    issue_date DATE,
    expiry_date DATE,
    credential_id TEXT,
    credential_url TEXT,
    badge_image_url TEXT,
    category TEXT, -- certification, award, achievement, publication
    skills_demonstrated TEXT[],
    verification_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 🤖 AI Recommendations table - AI-powered suggestions
CREATE TABLE ai_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type ai_recommendation_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    priority INTEGER DEFAULT 1, -- 1-5 priority levels
    confidence_score NUMERIC(3,2), -- 0.00-1.00
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

-- 🔔 Notifications table - User notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
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

-- 📊 Analytics Events table - Detailed analytics tracking
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- 📝 Portfolio Views table - Track portfolio views
CREATE TABLE portfolio_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- 💾 File Uploads table - Track uploaded files
CREATE TABLE file_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_size BIGINT,
    mime_type TEXT,
    file_path TEXT NOT NULL,
    bucket_name TEXT NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 🔍 Search Logs table - Track search behavior
CREATE TABLE search_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    search_query TEXT NOT NULL,
    search_type TEXT, -- portfolios, users, projects, skills
    results_count INTEGER,
    filters_applied JSONB DEFAULT '{}',
    result_clicked BOOLEAN DEFAULT FALSE,
    clicked_result_id UUID,
    search_duration_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_institution ON users(institution_name);
CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX idx_portfolios_visibility ON portfolios(visibility);
CREATE INDEX idx_portfolios_featured ON portfolios(is_featured);
CREATE INDEX idx_projects_portfolio_id ON projects(portfolio_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_skills_portfolio_id ON skills(portfolio_id);
CREATE INDEX idx_skills_name ON skills(name);
CREATE INDEX idx_skills_level ON skills(level);
CREATE INDEX idx_education_portfolio_id ON education(portfolio_id);
CREATE INDEX idx_experience_portfolio_id ON experience(portfolio_id);
CREATE INDEX idx_achievements_portfolio_id ON achievements(portfolio_id);
CREATE INDEX idx_ai_recommendations_user_id ON ai_recommendations(user_id);
CREATE INDEX idx_ai_recommendations_type ON ai_recommendations(type);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX idx_portfolio_views_portfolio_id ON portfolio_views(portfolio_id);
CREATE INDEX idx_portfolio_views_created_at ON portfolio_views(created_at);
CREATE INDEX idx_file_uploads_user_id ON file_uploads(user_id);
CREATE INDEX idx_search_logs_user_id ON search_logs(user_id);
CREATE INDEX idx_search_logs_created_at ON search_logs(created_at);

-- Full-text search indexes
CREATE INDEX idx_portfolios_title_search ON portfolios USING gin(to_tsvector('english', title));
CREATE INDEX idx_portfolios_description_search ON portfolios USING gin(to_tsvector('english', description));
CREATE INDEX idx_projects_title_search ON projects USING gin(to_tsvector('english', title));
CREATE INDEX idx_projects_description_search ON projects USING gin(to_tsvector('english', description));
CREATE INDEX idx_users_name_search ON users USING gin(to_tsvector('english', name));

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON portfolios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON education
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experience_updated_at BEFORE UPDATE ON experience
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON achievements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_recommendations_updated_at BEFORE UPDATE ON ai_recommendations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) Policies
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
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own data
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

-- Portfolio policies
CREATE POLICY "Users can CRUD own portfolios" ON portfolios FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public portfolios are viewable by all" ON portfolios FOR SELECT USING (visibility = 'public');

-- Project policies (inherit from portfolio)
CREATE POLICY "Users can CRUD own projects" ON projects FOR ALL USING (
    portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid())
);

-- Skills policies (inherit from portfolio)
CREATE POLICY "Users can CRUD own skills" ON skills FOR ALL USING (
    portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid())
);

-- Education policies (inherit from portfolio)
CREATE POLICY "Users can CRUD own education" ON education FOR ALL USING (
    portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid())
);

-- Experience policies (inherit from portfolio)
CREATE POLICY "Users can CRUD own experience" ON experience FOR ALL USING (
    portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid())
);

-- Achievement policies (inherit from portfolio)
CREATE POLICY "Users can CRUD own achievements" ON achievements FOR ALL USING (
    portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid())
);

-- AI Recommendations policies
CREATE POLICY "Users can read own recommendations" ON ai_recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own recommendations" ON ai_recommendations FOR UPDATE USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can read own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Analytics policies
CREATE POLICY "Users can insert analytics" ON analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can read own analytics" ON analytics_events FOR SELECT USING (auth.uid() = user_id);

-- Portfolio views policies
CREATE POLICY "Anyone can insert portfolio views" ON portfolio_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Portfolio owners can read views" ON portfolio_views FOR SELECT USING (
    portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid())
);

-- File uploads policies
CREATE POLICY "Users can CRUD own files" ON file_uploads FOR ALL USING (auth.uid() = user_id);

-- Utility functions
CREATE OR REPLACE FUNCTION get_portfolio_score(portfolio_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    score INTEGER := 0;
    project_count INTEGER;
    skill_count INTEGER;
    education_count INTEGER;
    experience_count INTEGER;
    achievement_count INTEGER;
BEGIN
    -- Count elements
    SELECT COUNT(*) INTO project_count FROM projects WHERE portfolio_id = portfolio_uuid;
    SELECT COUNT(*) INTO skill_count FROM skills WHERE portfolio_id = portfolio_uuid;
    SELECT COUNT(*) INTO education_count FROM education WHERE portfolio_id = portfolio_uuid;
    SELECT COUNT(*) INTO experience_count FROM experience WHERE portfolio_id = portfolio_uuid;
    SELECT COUNT(*) INTO achievement_count FROM achievements WHERE portfolio_id = portfolio_uuid;
    
    -- Calculate score
    score := 
        LEAST(project_count * 15, 45) +  -- Max 45 points for projects
        LEAST(skill_count * 5, 25) +     -- Max 25 points for skills
        LEAST(education_count * 10, 20) + -- Max 20 points for education
        LEAST(experience_count * 10, 20) + -- Max 20 points for experience
        LEAST(achievement_count * 5, 15);  -- Max 15 points for achievements
    
    RETURN LEAST(score, 100); -- Cap at 100
END;
$$ LANGUAGE plpgsql;

-- Health check function for connection monitoring
CREATE OR REPLACE FUNCTION ping()
RETURNS JSON AS $$
BEGIN
    RETURN json_build_object(
        'status', 'ok',
        'timestamp', NOW(),
        'region', current_setting('server_version', true),
        'database', current_database()
    );
END;
$$ LANGUAGE plpgsql;

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('avatars', 'avatars', true),
('portfolios', 'portfolios', true),
('projects', 'projects', true),
('documents', 'documents', false);

-- Storage policies
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Portfolio images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'portfolios');
CREATE POLICY "Users can upload portfolio images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolios' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Project images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'projects');
CREATE POLICY "Users can upload project images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'projects' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can access own documents" ON storage.objects FOR ALL USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 🎉 Database setup complete!
-- Your DigiPratibha database is now ready for production use!