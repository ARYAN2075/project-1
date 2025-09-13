// AI Service for DigiPratibha Backend
import { createClient } from "npm:@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export interface PortfolioAnalysis {
  score: number;
  strengths: string[];
  improvements: string[];
  industryReadiness: number;
  recommendations: any[];
}

export class AIService {
  // Analyze portfolio and generate comprehensive insights
  async analyzePortfolio(portfolioId: string, userId: string): Promise<PortfolioAnalysis> {
    try {
      // Get portfolio data
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
        .eq('id', portfolioId)
        .single();

      if (error || !portfolio) {
        throw new Error('Portfolio not found');
      }

      // Calculate portfolio score
      let score = 0;
      const strengths: string[] = [];
      const improvements: string[] = [];
      const recommendations: any[] = [];

      // Project evaluation (40% of score)
      const projectScore = this.evaluateProjects(portfolio.projects || []);
      score += projectScore.score;
      strengths.push(...projectScore.strengths);
      improvements.push(...projectScore.improvements);
      recommendations.push(...projectScore.recommendations);

      // Skills evaluation (25% of score)
      const skillsScore = this.evaluateSkills(portfolio.skills || []);
      score += skillsScore.score;
      strengths.push(...skillsScore.strengths);
      improvements.push(...skillsScore.improvements);
      recommendations.push(...skillsScore.recommendations);

      // Experience evaluation (20% of score)
      const experienceScore = this.evaluateExperience(portfolio.experience || []);
      score += experienceScore.score;
      strengths.push(...experienceScore.strengths);
      improvements.push(...experienceScore.improvements);

      // Portfolio completeness (15% of score)
      const completenessScore = this.evaluateCompleteness(portfolio);
      score += completenessScore.score;
      strengths.push(...completenessScore.strengths);
      improvements.push(...completenessScore.improvements);

      // Store AI recommendations in database
      for (const rec of recommendations) {
        await supabase.from('ai_recommendations').insert({
          user_id: userId,
          type: rec.type,
          title: rec.title,
          description: rec.description,
          priority: rec.priority,
          category: 'Portfolio Analysis',
          action_items: rec.action_items || [],
          estimated_impact: rec.estimated_impact || 0,
          applied: false,
          dismissed: false
        });
      }

      const industryReadiness = Math.min(100, score * 0.85);

      return {
        score: Math.min(100, score),
        strengths: [...new Set(strengths)], // Remove duplicates
        improvements: [...new Set(improvements)],
        industryReadiness,
        recommendations
      };

    } catch (error) {
      console.error('Portfolio analysis error:', error);
      throw error;
    }
  }

  private evaluateProjects(projects: any[]) {
    let score = 0;
    const strengths: string[] = [];
    const improvements: string[] = [];
    const recommendations: any[] = [];

    const projectCount = projects.length;

    if (projectCount >= 5) {
      score += 40;
      strengths.push('Excellent project portfolio with diverse range');
    } else if (projectCount >= 3) {
      score += 30;
      strengths.push('Good project portfolio');
    } else if (projectCount >= 1) {
      score += 15;
      improvements.push('Add more projects to showcase your skills');
      recommendations.push({
        type: 'project',
        title: 'Expand Project Portfolio',
        description: 'Add more projects to demonstrate your capabilities across different technologies',
        priority: 'high',
        estimated_impact: 25,
        action_items: [
          'Create a full-stack web application',
          'Build a mobile app or responsive web app',
          'Develop a project using a different programming language'
        ]
      });
    } else {
      improvements.push('No projects found - this is critical for showcasing your abilities');
      recommendations.push({
        type: 'project',
        title: 'Create Your First Projects',
        description: 'Start building projects to demonstrate your programming skills',
        priority: 'high',
        estimated_impact: 40,
        action_items: [
          'Build a personal website or portfolio',
          'Create a simple web application',
          'Contribute to an open-source project'
        ]
      });
    }

    // Evaluate project quality
    const featuredProjects = projects.filter(p => p.featured);
    if (featuredProjects.length === 0 && projectCount > 0) {
      improvements.push('Mark your best projects as featured');
      recommendations.push({
        type: 'improvement',
        title: 'Feature Your Best Work',
        description: 'Highlight your most impressive projects to make a strong first impression',
        priority: 'medium',
        estimated_impact: 15
      });
    }

    // Check for live demos and GitHub links
    const projectsWithDemo = projects.filter(p => p.live_url || p.demo_url);
    const projectsWithGithub = projects.filter(p => p.github_url);

    if (projectsWithDemo.length < projectCount * 0.5) {
      improvements.push('Add live demo links to more projects');
    }

    if (projectsWithGithub.length < projectCount * 0.7) {
      improvements.push('Include GitHub repository links');
    }

    return { score, strengths, improvements, recommendations };
  }

  private evaluateSkills(skills: any[]) {
    let score = 0;
    const strengths: string[] = [];
    const improvements: string[] = [];
    const recommendations: any[] = [];

    const skillCount = skills.length;
    const technicalSkills = skills.filter(s => s.category === 'technical');
    const frameworkSkills = skills.filter(s => s.category === 'framework');
    const advancedSkills = skills.filter(s => s.level === 'advanced' || s.level === 'expert');

    if (skillCount >= 10) {
      score += 25;
      strengths.push('Comprehensive skill set');
    } else if (skillCount >= 6) {
      score += 20;
      strengths.push('Good range of skills');
    } else if (skillCount >= 3) {
      score += 12;
      improvements.push('Expand your skill set');
    } else {
      score += 5;
      improvements.push('Add more skills to your portfolio');
      recommendations.push({
        type: 'skill',
        title: 'Build Core Technical Skills',
        description: 'Develop essential programming and technology skills',
        priority: 'high',
        estimated_impact: 20,
        action_items: [
          'Learn a popular programming language (Python, JavaScript, Java)',
          'Master a web framework (React, Vue, Angular)',
          'Understand database concepts (SQL, NoSQL)'
        ]
      });
    }

    if (advancedSkills.length >= 3) {
      strengths.push('Strong expertise in multiple areas');
    }

    if (technicalSkills.length === 0) {
      improvements.push('Add technical programming skills');
    }

    if (frameworkSkills.length === 0) {
      improvements.push('Learn modern frameworks and tools');
    }

    return { score, strengths, improvements, recommendations };
  }

  private evaluateExperience(experience: any[]) {
    let score = 0;
    const strengths: string[] = [];
    const improvements: string[] = [];

    const experienceCount = experience.length;
    const professionalExp = experience.filter(e => e.type === 'full-time' || e.type === 'part-time');
    const internships = experience.filter(e => e.type === 'internship');

    if (professionalExp.length > 0) {
      score += 20;
      strengths.push('Professional work experience');
    } else if (internships.length > 0) {
      score += 15;
      strengths.push('Internship experience');
    } else if (experienceCount > 0) {
      score += 8;
      strengths.push('Some practical experience');
    } else {
      score += 2;
      improvements.push('Gain practical experience through internships or projects');
    }

    return { score, strengths, improvements };
  }

  private evaluateCompleteness(portfolio: any) {
    let score = 0;
    const strengths: string[] = [];
    const improvements: string[] = [];

    // Check basic completeness
    if (portfolio.description && portfolio.description.length > 100) {
      score += 5;
      strengths.push('Comprehensive portfolio description');
    } else {
      improvements.push('Add a detailed portfolio description');
    }

    if (portfolio.contact_info && Object.keys(portfolio.contact_info).length > 2) {
      score += 3;
    } else {
      improvements.push('Complete your contact information');
    }

    if (portfolio.is_public) {
      score += 4;
      strengths.push('Portfolio is publicly accessible');
    } else {
      improvements.push('Make your portfolio public to increase visibility');
    }

    if (portfolio.seo_settings && Object.keys(portfolio.seo_settings).length > 0) {
      score += 3;
      strengths.push('SEO optimized');
    }

    return { score, strengths, improvements };
  }

  // Generate skill recommendations based on market trends
  async generateSkillRecommendations(userId: string, userSkills: string[]): Promise<any[]> {
    // Trending skills in 2024
    const trendingSkills = [
      { name: 'React', demand: 95, growth: 12, category: 'Frontend Framework' },
      { name: 'TypeScript', demand: 88, growth: 25, category: 'Programming Language' },
      { name: 'Python', demand: 92, growth: 8, category: 'Programming Language' },
      { name: 'Node.js', demand: 85, growth: 15, category: 'Backend Technology' },
      { name: 'AWS', demand: 90, growth: 20, category: 'Cloud Platform' },
      { name: 'Docker', demand: 82, growth: 18, category: 'DevOps Tool' },
      { name: 'Kubernetes', demand: 78, growth: 22, category: 'DevOps Tool' },
      { name: 'GraphQL', demand: 75, growth: 30, category: 'API Technology' },
      { name: 'Next.js', demand: 80, growth: 35, category: 'Frontend Framework' },
      { name: 'TensorFlow', demand: 72, growth: 28, category: 'Machine Learning' },
      { name: 'MongoDB', demand: 76, growth: 12, category: 'Database' },
      { name: 'Vue.js', demand: 70, growth: 15, category: 'Frontend Framework' }
    ];

    // Filter out skills user already has
    const userSkillsLower = userSkills.map(s => s.toLowerCase());
    const recommendedSkills = trendingSkills
      .filter(skill => !userSkillsLower.includes(skill.name.toLowerCase()))
      .slice(0, 5)
      .map(skill => ({
        skill: skill.name,
        reason: `${skill.name} has ${skill.demand}% market demand and is growing by ${skill.growth}% annually`,
        priority: skill.demand > 85 ? 'high' : 'medium',
        marketDemand: skill.demand,
        category: skill.category,
        learningResources: this.getLearningResources(skill.name)
      }));

    return recommendedSkills;
  }

  private getLearningResources(skillName: string): string[] {
    const resources: { [key: string]: string[] } = {
      'React': [
        'Official React Documentation',
        'freeCodeCamp React Course',
        'React - The Complete Guide (Udemy)'
      ],
      'TypeScript': [
        'TypeScript Handbook',
        'TypeScript Deep Dive',
        'Understanding TypeScript (Udemy)'
      ],
      'Python': [
        'Python.org Tutorial',
        'Automate the Boring Stuff with Python',
        'Python Crash Course'
      ],
      'AWS': [
        'AWS Free Tier',
        'AWS Cloud Practitioner Certification',
        'A Cloud Guru AWS Courses'
      ]
    };

    return resources[skillName] || [
      'Official Documentation',
      'YouTube Tutorials',
      'Online Courses (Coursera, Udemy, edX)'
    ];
  }

  // Generate intelligent chat responses
  generateChatResponse(message: string, context: any): string {
    const lowerMessage = message.toLowerCase();
    
    // Project-related responses
    if (lowerMessage.includes('project')) {
      const projectCount = context.portfolio?.projects?.length || 0;
      if (projectCount < 2) {
        return "I notice you have fewer than 2 projects in your portfolio. I recommend adding more projects to showcase your skills. Consider building a full-stack web application or a mobile app that demonstrates your technical abilities.";
      } else if (projectCount < 4) {
        return "You have a good start with your projects! To make your portfolio even stronger, consider adding projects that showcase different technologies. For example, if you have web projects, try adding a mobile app or a data science project.";
      } else {
        return "Great! You have several projects in your portfolio. Now focus on making them stand out by adding detailed descriptions, live demo links, and highlighting the technologies you used. Consider featuring your best 2-3 projects.";
      }
    }
    
    // Skill-related responses
    if (lowerMessage.includes('skill')) {
      const skillCount = context.portfolio?.skills?.length || 0;
      if (skillCount < 5) {
        return "I recommend expanding your skill set. Based on current market trends, consider learning popular technologies like React, Python, Node.js, or cloud platforms like AWS. Focus on skills that complement your existing expertise.";
      } else {
        return "You have a good range of skills! Now focus on demonstrating these skills through projects. Consider getting certifications or endorsements to validate your expertise, especially for your strongest skills.";
      }
    }
    
    // Improvement-related responses
    if (lowerMessage.includes('improve') || lowerMessage.includes('better') || lowerMessage.includes('enhance')) {
      return "Here are key areas to improve your portfolio: 1) Add detailed project descriptions with challenges faced and solutions implemented, 2) Include live demo links and GitHub repositories, 3) Feature your best work prominently, 4) Add a compelling personal statement, 5) Include testimonials or recommendations if possible.";
    }
    
    // Career-related responses
    if (lowerMessage.includes('job') || lowerMessage.includes('career') || lowerMessage.includes('interview')) {
      return "To improve your job prospects: 1) Tailor your portfolio to the roles you're targeting, 2) Highlight projects that demonstrate skills relevant to your desired position, 3) Practice explaining your projects clearly, 4) Consider contributing to open source projects, 5) Network with professionals in your field.";
    }
    
    // Default helpful response
    const defaultResponses = [
      "I'm here to help you build an outstanding portfolio! I can provide advice on projects, skills, career guidance, and portfolio optimization. What specific area would you like to focus on?",
      "Great question! I can help you with project ideas, skill recommendations, portfolio structure, and career preparation. What's your main goal right now?",
      "I'd be happy to help you succeed! Whether you need advice on technical skills, project planning, or career preparation, I'm here to guide you. What's your biggest challenge?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }
}