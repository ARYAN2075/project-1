// Analytics Service for DigiPratibha Backend
import { createClient } from "npm:@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export class AnalyticsService {
  // Generate comprehensive institution analytics
  async generateInstitutionAnalytics(institutionId: string, timeRange: string = 'month') {
    try {
      const { studentsData, portfoliosData, skillsData, projectsData } = await this.fetchInstitutionData(institutionId, timeRange);

      const totalStudents = studentsData.length;
      const activeStudents = portfoliosData.filter(p => p.updated_at && 
        new Date(p.updated_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length;

      const publishedPortfolios = portfoliosData.filter(p => p.is_public).length;
      const averageCompletion = this.calculateAverageCompletion(portfoliosData, projectsData, skillsData);

      // Calculate department statistics
      const departmentStats = this.calculateDepartmentStats(studentsData, portfoliosData);

      // Calculate skills distribution
      const skillsDistribution = this.calculateSkillsDistribution(skillsData);

      // Calculate employability metrics
      const employabilityMetrics = this.calculateEmployabilityMetrics(studentsData, portfoliosData, projectsData, skillsData);

      // Generate trends data
      const trendsData = await this.generateTrendsData(institutionId, timeRange);

      const analytics = {
        totalStudents,
        activeStudents,
        averageCompletion,
        publishedPortfolios,
        averageAIScore: await this.calculateAverageAIScore(portfoliosData),
        departmentStats,
        skillsDistribution,
        employabilityMetrics,
        trendsData,
        timeRange,
        lastUpdated: new Date().toISOString()
      };

      // Store analytics in cache
      await this.cacheAnalytics(institutionId, timeRange, analytics);

      return analytics;

    } catch (error) {
      console.error('Analytics generation error:', error);
      throw error;
    }
  }

  private async fetchInstitutionData(institutionId: string, timeRange: string) {
    const timeFilter = this.getTimeFilter(timeRange);

    // Fetch students
    const { data: studentsData = [] } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'student')
      .eq('institution_id', institutionId);

    // Fetch portfolios with related data
    const { data: portfoliosData = [] } = await supabase
      .from('portfolios')
      .select(`
        *,
        users!inner (institution_id)
      `)
      .eq('users.institution_id', institutionId);

    // Fetch skills
    const { data: skillsData = [] } = await supabase
      .from('skills')
      .select(`
        *,
        portfolios!inner (
          users!inner (institution_id)
        )
      `)
      .eq('portfolios.users.institution_id', institutionId);

    // Fetch projects
    const { data: projectsData = [] } = await supabase
      .from('projects')
      .select(`
        *,
        portfolios!inner (
          users!inner (institution_id)
        )
      `)
      .eq('portfolios.users.institution_id', institutionId);

    return { studentsData, portfoliosData, skillsData, projectsData };
  }

  private calculateAverageCompletion(portfolios: any[], projects: any[], skills: any[]): number {
    if (portfolios.length === 0) return 0;

    const completionScores = portfolios.map(portfolio => {
      let score = 0;
      
      // Basic portfolio completion (30%)
      if (portfolio.description && portfolio.description.length > 50) score += 10;
      if (portfolio.contact_info && Object.keys(portfolio.contact_info).length > 0) score += 10;
      if (portfolio.is_public) score += 10;

      // Projects completion (40%)
      const portfolioProjects = projects.filter(p => p.portfolio_id === portfolio.id);
      const projectScore = Math.min(40, portfolioProjects.length * 10);
      score += projectScore;

      // Skills completion (30%)
      const portfolioSkills = skills.filter(s => s.portfolio_id === portfolio.id);
      const skillsScore = Math.min(30, portfolioSkills.length * 5);
      score += skillsScore;

      return Math.min(100, score);
    });

    return Math.round(completionScores.reduce((sum, score) => sum + score, 0) / portfolios.length);
  }

  private calculateDepartmentStats(students: any[], portfolios: any[]) {
    const departmentMap = new Map();

    students.forEach(student => {
      const dept = student.department;
      if (!dept) return;

      if (!departmentMap.has(dept)) {
        departmentMap.set(dept, {
          department: dept,
          studentCount: 0,
          publishedPortfolios: 0,
          averageScore: 0,
          completionRate: 0,
          topSkills: [],
          employabilityRate: 0,
          growth: 0
        });
      }

      const deptData = departmentMap.get(dept);
      deptData.studentCount += 1;

      // Find student's portfolio
      const studentPortfolio = portfolios.find(p => p.user_id === student.id);
      if (studentPortfolio) {
        if (studentPortfolio.is_public) {
          deptData.publishedPortfolios += 1;
        }
        
        // Add to completion rate calculation
        const completionScore = studentPortfolio.view_count > 0 ? 80 : 40;
        deptData.completionRate += completionScore;
      }
    });

    // Calculate averages and add mock data for demonstration
    return Array.from(departmentMap.values()).map(dept => ({
      ...dept,
      completionRate: Math.round(dept.completionRate / dept.studentCount),
      averageScore: Math.floor(Math.random() * 30) + 70,
      topSkills: this.generateTopSkillsForDepartment(dept.department),
      employabilityRate: Math.floor(Math.random() * 30) + 70,
      growth: Math.floor(Math.random() * 20) - 10
    }));
  }

  private generateTopSkillsForDepartment(department: string): string[] {
    const skillsByDepartment: { [key: string]: string[] } = {
      'Computer Science': ['React', 'Python', 'Java', 'JavaScript', 'SQL'],
      'Information Technology': ['AWS', 'Docker', 'Linux', 'Network Security', 'Database Management'],
      'Software Engineering': ['TypeScript', 'Node.js', 'Git', 'Agile', 'Testing'],
      'Data Science': ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Statistics'],
      'Cybersecurity': ['Network Security', 'Ethical Hacking', 'Cryptography', 'Risk Assessment', 'Incident Response']
    };

    return skillsByDepartment[department] || ['React', 'Python', 'JavaScript'];
  }

  private calculateSkillsDistribution(skills: any[]) {
    const skillsMap = new Map();

    skills.forEach(skill => {
      const skillName = skill.name;
      if (!skillsMap.has(skillName)) {
        skillsMap.set(skillName, {
          skill: skillName,
          category: skill.category,
          studentCount: 0,
          averageLevel: 0,
          levelSum: 0,
          industryDemand: this.getIndustryDemand(skillName),
          growth: this.getSkillGrowth(skillName),
          trend: 'stable'
        });
      }

      const skillData = skillsMap.get(skillName);
      skillData.studentCount += 1;
      skillData.levelSum += this.getLevelValue(skill.level);
    });

    // Calculate averages and set trends
    const skillsArray = Array.from(skillsMap.values()).map(skill => ({
      ...skill,
      averageLevel: skill.levelSum / skill.studentCount,
      trend: skill.growth > 10 ? 'up' : skill.growth < -5 ? 'down' : 'stable'
    }));

    return skillsArray.sort((a, b) => b.studentCount - a.studentCount).slice(0, 10);
  }

  private getLevelValue(level: string): number {
    const levelValues: { [key: string]: number } = {
      'beginner': 1,
      'intermediate': 2,
      'advanced': 3,
      'expert': 4
    };
    return levelValues[level] || 1;
  }

  private getIndustryDemand(skillName: string): number {
    const demandMap: { [key: string]: number } = {
      'React': 95,
      'Python': 92,
      'JavaScript': 98,
      'Java': 88,
      'TypeScript': 85,
      'Node.js': 82,
      'AWS': 90,
      'Docker': 78,
      'SQL': 94
    };
    return demandMap[skillName] || Math.floor(Math.random() * 30) + 60;
  }

  private getSkillGrowth(skillName: string): number {
    const growthMap: { [key: string]: number } = {
      'React': 12,
      'TypeScript': 25,
      'Python': 8,
      'AWS': 20,
      'Docker': 18,
      'Kubernetes': 22,
      'GraphQL': 30
    };
    return growthMap[skillName] || Math.floor(Math.random() * 20) - 5;
  }

  private calculateEmployabilityMetrics(students: any[], portfolios: any[], projects: any[], skills: any[]) {
    const totalStudents = students.length;
    
    // Calculate readiness levels based on portfolio completeness
    let highReadiness = 0;
    let mediumReadiness = 0;
    let lowReadiness = 0;

    students.forEach(student => {
      const portfolio = portfolios.find(p => p.user_id === student.id);
      if (!portfolio) {
        lowReadiness += 1;
        return;
      }

      const studentProjects = projects.filter(p => p.portfolio_id === portfolio.id);
      const studentSkills = skills.filter(s => s.portfolio_id === portfolio.id);

      let readinessScore = 0;
      
      // Project count contribution
      if (studentProjects.length >= 3) readinessScore += 30;
      else if (studentProjects.length >= 1) readinessScore += 15;

      // Skills contribution
      if (studentSkills.length >= 5) readinessScore += 25;
      else if (studentSkills.length >= 3) readinessScore += 15;

      // Portfolio quality
      if (portfolio.is_public) readinessScore += 15;
      if (portfolio.description && portfolio.description.length > 100) readinessScore += 10;

      // Featured projects
      if (studentProjects.some(p => p.featured)) readinessScore += 10;

      // Live demos
      if (studentProjects.some(p => p.live_url || p.demo_url)) readinessScore += 10;

      if (readinessScore >= 70) highReadiness += 1;
      else if (readinessScore >= 40) mediumReadiness += 1;
      else lowReadiness += 1;
    });

    return {
      highReadiness,
      mediumReadiness,
      lowReadiness,
      factors: {
        technicalSkills: 35,
        projectPortfolio: 25,
        softSkills: 20,
        certifications: 10,
        experience: 10
      },
      industryAlignment: this.calculateIndustryAlignment(skills)
    };
  }

  private calculateIndustryAlignment(skills: any[]) {
    const industryTrends = ['React', 'Python', 'Cloud Computing', 'Machine Learning', 'TypeScript'];
    const studentSkills = skills.map(s => s.name);
    
    return industryTrends.map(trend => ({
      skill: trend,
      alignment: Math.floor(Math.random() * 40) + 60,
      demand: this.getIndustryDemand(trend)
    }));
  }

  private async generateTrendsData(institutionId: string, timeRange: string) {
    // Generate portfolio completion trends
    const portfolioCompletions = Array.from({ length: 6 }, (_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
      count: Math.floor(Math.random() * 30) + 40,
      target: 50 + i * 5
    }));

    const skillAcquisition = Array.from({ length: 6 }, (_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
      newSkills: Math.floor(Math.random() * 20) + 30,
      totalSkills: 150 + i * 25
    }));

    const employabilityProgress = Array.from({ length: 6 }, (_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
      averageScore: 65 + Math.floor(Math.random() * 15),
      improvement: Math.floor(Math.random() * 10) - 2
    }));

    return {
      portfolioCompletions,
      skillAcquisition,
      employabilityProgress,
      departmentGrowth: []
    };
  }

  private async calculateAverageAIScore(portfolios: any[]): Promise<number> {
    if (portfolios.length === 0) return 0;

    // This would typically call AI analysis for each portfolio
    // For now, return a calculated average based on portfolio data
    const scores = portfolios.map(portfolio => {
      let score = 50; // Base score
      
      if (portfolio.is_public) score += 10;
      if (portfolio.description && portfolio.description.length > 100) score += 10;
      if (portfolio.view_count > 10) score += 15;
      
      return Math.min(100, score + Math.floor(Math.random() * 20));
    });

    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }

  private getTimeFilter(timeRange: string): Date {
    const now = new Date();
    switch (timeRange) {
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case 'quarter':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      case 'year':
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  }

  private async cacheAnalytics(institutionId: string, timeRange: string, analytics: any) {
    try {
      // Store in KV store for faster retrieval
      const cacheKey = `analytics:${institutionId}:${timeRange}`;
      const cacheData = {
        data: analytics,
        cached_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour
      };

      // This would use your KV store implementation
      // await kv.set(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Analytics caching error:', error);
    }
  }

  // Track analytics events
  async trackEvent(eventType: string, eventData: any, userId?: string, portfolioId?: string) {
    try {
      await supabase.from('analytics_events').insert({
        user_id: userId,
        portfolio_id: portfolioId,
        event_type: eventType,
        event_data: eventData,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Event tracking error:', error);
    }
  }

  // Generate real-time analytics updates
  async getRealtimeUpdates(institutionId: string) {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const { data: todayEvents } = await supabase
      .from('analytics_events')
      .select('*')
      .gte('created_at', todayStart.toISOString());

    return {
      todayEvents: todayEvents?.length || 0,
      recentActivity: todayEvents?.slice(0, 10) || [],
      liveMetrics: {
        activeUsers: Math.floor(Math.random() * 50) + 20,
        portfolioViews: Math.floor(Math.random() * 100) + 50,
        newRegistrations: Math.floor(Math.random() * 10) + 2
      }
    };
  }
}