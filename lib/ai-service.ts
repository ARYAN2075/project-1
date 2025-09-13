// AI Service for Portfolio Analysis and Recommendations

import { Portfolio, Project, Skill, AIRecommendation, User } from './types';
import { MOCK_SKILLS_DATABASE } from './database';

export interface AIAnalysisResult {
  overallScore: number;
  strengths: string[];
  improvements: string[];
  industryReadiness: number;
  skillGaps: string[];
  recommendations: AIRecommendation[];
  competitiveAnalysis: {
    percentile: number;
    comparison: string;
    marketPosition: 'below_average' | 'average' | 'above_average' | 'excellent';
  };
}

export interface SkillRecommendation {
  skill: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  marketDemand: number;
  learningResources: {
    type: 'course' | 'tutorial' | 'documentation' | 'practice';
    title: string;
    url: string;
    provider: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedHours: number;
  }[];
}

export class AIService {
  private openaiApiKey: string;
  private model: string = 'gpt-4-turbo-preview';

  constructor(apiKey?: string) {
    // In browser environment, API keys should be handled by the backend
    // This is just for mock/development purposes
    this.openaiApiKey = apiKey || '';
  }

  // Analyze portfolio comprehensively
  async analyzePortfolio(portfolio: Portfolio, user: User): Promise<AIAnalysisResult> {
    const analysis = {
      overallScore: this.calculateOverallScore(portfolio),
      strengths: this.identifyStrengths(portfolio),
      improvements: this.identifyImprovements(portfolio),
      industryReadiness: this.calculateIndustryReadiness(portfolio, user),
      skillGaps: this.identifySkillGaps(portfolio.skills, user.department),
      recommendations: await this.generateRecommendations(portfolio, user),
      competitiveAnalysis: this.performCompetitiveAnalysis(portfolio, user)
    };

    return analysis;
  }

  // Generate AI-powered recommendations
  async generateRecommendations(portfolio: Portfolio, user: User): Promise<AIRecommendation[]> {
    const recommendations: AIRecommendation[] = [];

    // Skill recommendations
    const skillRecs = await this.getSkillRecommendations(portfolio.skills, user.department);
    recommendations.push(...this.convertSkillToAIRecommendations(skillRecs));

    // Project recommendations
    const projectRecs = this.getProjectRecommendations(portfolio.projects, portfolio.skills);
    recommendations.push(...projectRecs);

    // Portfolio improvement recommendations
    const improvementRecs = this.getImprovementRecommendations(portfolio);
    recommendations.push(...improvementRecs);

    // Career opportunity recommendations
    const careerRecs = await this.getCareerRecommendations(portfolio, user);
    recommendations.push(...careerRecs);

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // Get skill recommendations based on market trends
  async getSkillRecommendations(currentSkills: Skill[], department?: string): Promise<SkillRecommendation[]> {
    const currentSkillNames = currentSkills.map(s => s.name.toLowerCase());
    const trendingSkills = MOCK_SKILLS_DATABASE.filter(skill => 
      skill.trending && 
      !currentSkillNames.includes(skill.name.toLowerCase()) &&
      skill.demand > 80
    );

    const recommendations: SkillRecommendation[] = trendingSkills.map(skill => ({
      skill: skill.name,
      reason: this.generateSkillReason(skill, department),
      priority: skill.demand > 90 ? 'high' : skill.demand > 85 ? 'medium' : 'low',
      marketDemand: skill.demand,
      learningResources: this.getLearningResources(skill.name)
    }));

    return recommendations.slice(0, 5); // Top 5 recommendations
  }

  // Generate project recommendations
  getProjectRecommendations(projects: Project[], skills: Skill[]): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];
    const skillNames = skills.map(s => s.name.toLowerCase());

    // If user has React but no full-stack project
    if (skillNames.includes('react') && !projects.some(p => p.technologies.some(t => t.toLowerCase().includes('backend')))) {
      recommendations.push({
        id: `proj-rec-${Date.now()}`,
        type: 'project',
        title: 'Build a Full-Stack Application',
        description: 'Create a complete web application with both frontend and backend to showcase your full-stack capabilities.',
        priority: 'high',
        category: 'Technical Projects',
        actionItems: [
          'Choose a backend technology (Node.js, Python, or Java)',
          'Design a database schema',
          'Implement REST APIs',
          'Deploy to cloud platform',
          'Add authentication and authorization'
        ],
        estimatedImpact: 85,
        timeToComplete: '3-4 weeks',
        resources: [
          {
            type: 'tutorial',
            title: 'Full-Stack Development Bootcamp',
            url: 'https://example.com/fullstack-course',
            provider: 'Tech Academy'
          }
        ],
        createdAt: new Date().toISOString()
      });
    }

    // If user has ML skills but no ML projects
    if (skillNames.includes('machine learning') && !projects.some(p => p.category?.toLowerCase().includes('ml') || p.category?.toLowerCase().includes('ai'))) {
      recommendations.push({
        id: `proj-rec-${Date.now() + 1}`,
        type: 'project',
        title: 'Develop an ML/AI Project',
        description: 'Create a machine learning project to demonstrate your AI capabilities to potential employers.',
        priority: 'high',
        category: 'AI/ML Projects',
        actionItems: [
          'Choose a real-world problem to solve',
          'Collect and preprocess data',
          'Train and evaluate models',
          'Create a web interface for your model',
          'Deploy the model to cloud'
        ],
        estimatedImpact: 90,
        timeToComplete: '4-6 weeks',
        resources: [
          {
            type: 'course',
            title: 'Applied Machine Learning Projects',
            url: 'https://example.com/ml-projects',
            provider: 'AI Institute'
          }
        ],
        createdAt: new Date().toISOString()
      });
    }

    return recommendations;
  }

  // Generate improvement recommendations
  getImprovementRecommendations(portfolio: Portfolio): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];

    // If portfolio lacks description
    if (!portfolio.description || portfolio.description.length < 100) {
      recommendations.push({
        id: `imp-rec-${Date.now()}`,
        type: 'improvement',
        title: 'Enhance Portfolio Description',
        description: 'Add a compelling personal statement that highlights your unique value proposition and career goals.',
        priority: 'medium',
        category: 'Portfolio Optimization',
        actionItems: [
          'Write a 2-3 paragraph personal statement',
          'Highlight your unique strengths',
          'Mention your career aspirations',
          'Use action-oriented language'
        ],
        estimatedImpact: 65,
        timeToComplete: '2-3 hours',
        resources: [
          {
            type: 'tutorial',
            title: 'Writing Effective Portfolio Descriptions',
            url: 'https://example.com/portfolio-writing',
            provider: 'Career Services'
          }
        ],
        createdAt: new Date().toISOString()
      });
    }

    // If no featured projects
    if (!portfolio.projects.some(p => p.featured)) {
      recommendations.push({
        id: `imp-rec-${Date.now() + 1}`,
        type: 'improvement',
        title: 'Feature Your Best Projects',
        description: 'Select and feature your most impressive projects to capture employer attention immediately.',
        priority: 'medium',
        category: 'Portfolio Optimization',
        actionItems: [
          'Review all your projects',
          'Select 2-3 most impressive ones',
          'Mark them as featured',
          'Add detailed descriptions and screenshots'
        ],
        estimatedImpact: 70,
        timeToComplete: '1-2 hours',
        resources: [],
        createdAt: new Date().toISOString()
      });
    }

    return recommendations;
  }

  // Generate career opportunity recommendations
  async getCareerRecommendations(portfolio: Portfolio, user: User): Promise<AIRecommendation[]> {
    const recommendations: AIRecommendation[] = [];
    const skills = portfolio.skills.map(s => s.name);
    
    // Based on skills, suggest career paths
    if (skills.some(s => ['React', 'JavaScript', 'TypeScript'].includes(s))) {
      recommendations.push({
        id: `career-rec-${Date.now()}`,
        type: 'opportunity',
        title: 'Frontend Developer Opportunities',
        description: 'Your frontend skills align well with current market demands. Consider applying for frontend developer positions.',
        priority: 'high',
        category: 'Career Opportunities',
        actionItems: [
          'Update your resume with React projects',
          'Practice coding interviews focusing on JavaScript',
          'Build a portfolio website showcasing your frontend skills',
          'Apply to frontend developer positions'
        ],
        estimatedImpact: 80,
        timeToComplete: '2-3 weeks',
        resources: [
          {
            type: 'practice',
            title: 'Frontend Interview Preparation',
            url: 'https://example.com/frontend-prep',
            provider: 'Tech Interview Pro'
          }
        ],
        createdAt: new Date().toISOString()
      });
    }

    return recommendations;
  }

  // Calculate overall portfolio score
  private calculateOverallScore(portfolio: Portfolio): number {
    let score = 0;
    let maxScore = 100;

    // Project quality (40 points)
    const projectScore = Math.min(40, portfolio.projects.length * 8);
    score += projectScore;

    // Skills diversity (30 points)
    const skillScore = Math.min(30, portfolio.skills.length * 3);
    score += skillScore;

    // Portfolio completeness (20 points)
    let completenessScore = 0;
    if (portfolio.description && portfolio.description.length > 50) completenessScore += 5;
    if (portfolio.contact) completenessScore += 5;
    if (portfolio.experience && portfolio.experience.length > 0) completenessScore += 5;
    if (portfolio.education && portfolio.education.length > 0) completenessScore += 5;
    score += completenessScore;

    // Featured projects bonus (10 points)
    const featuredProjects = portfolio.projects.filter(p => p.featured).length;
    score += Math.min(10, featuredProjects * 5);

    return Math.min(100, score);
  }

  // Identify portfolio strengths
  private identifyStrengths(portfolio: Portfolio): string[] {
    const strengths: string[] = [];

    if (portfolio.projects.length >= 3) {
      strengths.push('Strong project portfolio with multiple completed projects');
    }

    if (portfolio.skills.filter(s => s.level === 'advanced' || s.level === 'expert').length >= 3) {
      strengths.push('Advanced proficiency in multiple technical skills');
    }

    if (portfolio.projects.some(p => p.githubUrl && p.liveUrl)) {
      strengths.push('Projects include both source code and live demonstrations');
    }

    if (portfolio.experience && portfolio.experience.length > 0) {
      strengths.push('Relevant work experience documented');
    }

    return strengths;
  }

  // Identify improvement areas
  private identifyImprovements(portfolio: Portfolio): string[] {
    const improvements: string[] = [];

    if (portfolio.projects.length < 3) {
      improvements.push('Add more projects to demonstrate breadth of skills');
    }

    if (!portfolio.projects.some(p => p.featured)) {
      improvements.push('Feature your best projects to highlight key achievements');
    }

    if (portfolio.skills.filter(s => s.verified).length < 3) {
      improvements.push('Get skill endorsements or certifications to validate expertise');
    }

    if (!portfolio.description || portfolio.description.length < 100) {
      improvements.push('Add a compelling personal statement and career objective');
    }

    return improvements;
  }

  // Calculate industry readiness score
  private calculateIndustryReadiness(portfolio: Portfolio, user: User): number {
    let readiness = 0;

    // Technical skills weight: 40%
    const technicalSkills = portfolio.skills.filter(s => s.category === 'technical').length;
    readiness += Math.min(40, technicalSkills * 8);

    // Project portfolio weight: 30%
    const projectQuality = portfolio.projects.length * 6;
    readiness += Math.min(30, projectQuality);

    // Experience weight: 20%
    const experienceScore = portfolio.experience ? portfolio.experience.length * 10 : 0;
    readiness += Math.min(20, experienceScore);

    // Soft skills weight: 10%
    const softSkills = portfolio.skills.filter(s => s.category === 'soft').length;
    readiness += Math.min(10, softSkills * 5);

    return Math.min(100, readiness);
  }

  // Identify skill gaps based on industry trends
  private identifySkillGaps(currentSkills: Skill[], department?: string): string[] {
    const currentSkillNames = currentSkills.map(s => s.name.toLowerCase());
    const highDemandSkills = MOCK_SKILLS_DATABASE.filter(s => s.demand > 85);
    
    return highDemandSkills
      .filter(skill => !currentSkillNames.includes(skill.name.toLowerCase()))
      .map(skill => skill.name)
      .slice(0, 5);
  }

  // Perform competitive analysis
  private performCompetitiveAnalysis(portfolio: Portfolio, user: User): {
    percentile: number;
    comparison: string;
    marketPosition: 'below_average' | 'average' | 'above_average' | 'excellent';
  } {
    const score = this.calculateOverallScore(portfolio);
    
    let percentile = 50;
    let marketPosition: 'below_average' | 'average' | 'above_average' | 'excellent' = 'average';
    
    if (score >= 85) {
      percentile = 90;
      marketPosition = 'excellent';
    } else if (score >= 75) {
      percentile = 75;
      marketPosition = 'above_average';
    } else if (score >= 60) {
      percentile = 60;
      marketPosition = 'average';
    } else {
      percentile = 30;
      marketPosition = 'below_average';
    }

    const comparison = this.generateComparisonText(percentile, marketPosition);

    return { percentile, comparison, marketPosition };
  }

  // Helper methods
  private generateSkillReason(skill: any, department?: string): string {
    const reasons = [
      `${skill.name} has ${skill.demand}% market demand and is growing by ${skill.growth}% annually`,
      `Companies are actively seeking professionals with ${skill.name} expertise`,
      `Adding ${skill.name} to your skillset could increase your employability significantly`
    ];
    
    return reasons[Math.floor(Math.random() * reasons.length)];
  }

  private getLearningResources(skillName: string): any[] {
    // Mock learning resources - integrate with real learning platforms
    const resources = [
      {
        type: 'course',
        title: `Complete ${skillName} Course`,
        url: `https://example.com/${skillName.toLowerCase()}-course`,
        provider: 'Tech Academy',
        difficulty: 'intermediate',
        estimatedHours: 40
      },
      {
        type: 'tutorial',
        title: `${skillName} for Beginners`,
        url: `https://example.com/${skillName.toLowerCase()}-tutorial`,
        provider: 'Code School',
        difficulty: 'beginner',
        estimatedHours: 20
      }
    ];

    return resources;
  }

  private convertSkillToAIRecommendations(skillRecs: SkillRecommendation[]): AIRecommendation[] {
    return skillRecs.map(skill => ({
      id: `skill-rec-${Date.now()}-${Math.random()}`,
      type: 'skill' as const,
      title: `Learn ${skill.skill}`,
      description: skill.reason,
      priority: skill.priority,
      category: 'Skill Development',
      actionItems: [
        `Enroll in a ${skill.skill} course`,
        'Practice with hands-on projects',
        'Build a project showcasing this skill',
        'Add to your portfolio'
      ],
      estimatedImpact: skill.marketDemand,
      timeToComplete: '4-6 weeks',
      resources: skill.learningResources,
      createdAt: new Date().toISOString()
    }));
  }

  private generateComparisonText(percentile: number, position: string): string {
    const comparisons = {
      excellent: `Your portfolio is in the top ${100 - percentile}% of student portfolios, placing you among the most competitive candidates.`,
      above_average: `Your portfolio performs better than ${percentile}% of student portfolios, giving you a strong competitive advantage.`,
      average: `Your portfolio is comparable to ${percentile}% of student portfolios. With some improvements, you can stand out significantly.`,
      below_average: `Your portfolio has room for improvement. Focus on the recommended enhancements to increase your competitiveness.`
    };

    return comparisons[position as keyof typeof comparisons];
  }

  // Chat-based AI assistant
  async getChatResponse(message: string, context: {
    user: User;
    portfolio: Portfolio;
    conversationHistory?: { role: 'user' | 'assistant'; content: string }[];
  }): Promise<string> {
    // Enhanced mock implementation with more intelligent responses
    const lowerMessage = message.toLowerCase();
    
    // Project-related responses
    if (lowerMessage.includes('project')) {
      const projectCount = context.portfolio.projects?.length || 0;
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
      const skillCount = context.portfolio.skills?.length || 0;
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
    
    // Department-specific advice
    if (context.user.department) {
      const dept = context.user.department.toLowerCase();
      if (dept.includes('computer') || dept.includes('software')) {
        return "As a Computer Science student, focus on building projects that demonstrate both theoretical knowledge and practical skills. Consider projects involving algorithms, data structures, system design, and modern frameworks.";
      } else if (dept.includes('information') || dept.includes('it')) {
        return "For IT professionals, showcase projects that demonstrate your ability to solve business problems with technology. Include projects involving databases, web development, system administration, or cybersecurity.";
      }
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

// Export singleton instance
export const aiService = new AIService();