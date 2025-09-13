import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  ArrowRight,
  Sparkles,
  Brain,
  Target,
  Award,
  BarChart3,
  FileText,
  Download,
  Users,
  TrendingUp,
  Star,
  CheckCircle,
  Zap,
  Shield,
  Palette,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: (role: 'student' | 'institution') => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: Brain,
      title: 'AI Recommendations',
      description: 'Smart suggestions for portfolio improvement and skill development.'
    },
    {
      icon: Award,
      title: 'Certificate Management',
      description: 'Organize and showcase your certifications with verification.'
    },
    {
      icon: BarChart3,
      title: 'Institution Analytics',
      description: 'Comprehensive dashboard with student progress insights.'
    },
    {
      icon: Palette,
      title: 'Portfolio Templates',
      description: 'Professional templates designed for different career paths.'
    },
    {
      icon: Download,
      title: 'One-Click PDF Export',
      description: 'Generate professional PDF portfolios instantly.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Enterprise-grade security for your portfolios.'
    }
  ];

  const steps = [
    {
      icon: Palette,
      title: 'Build Portfolio',
      description: 'Create stunning portfolios with drag-and-drop builder.'
    },
    {
      icon: Brain,
      title: 'Get AI Insights',
      description: 'Receive personalized recommendations for improvement.'
    },
    {
      icon: Target,
      title: 'Share & Grow',
      description: 'Share with employers and track engagement.'
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Dark Neon Background - Consistent with Design System */}
      <div className="fixed inset-0 -z-10">
        {/* Base dark background matching globals.css */}
        <div className="absolute inset-0 bg-[#0a0118]"></div>
        
        {/* Neon gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Radial gradients matching body background */}
        <div className="absolute inset-0">
          <div className="w-full h-full" style={{
            background: `
              radial-gradient(ellipse at top, rgba(139, 92, 246, 0.15) 0%, transparent 70%),
              radial-gradient(ellipse at bottom right, rgba(236, 72, 153, 0.15) 0%, transparent 70%),
              radial-gradient(ellipse at center left, rgba(99, 102, 241, 0.1) 0%, transparent 70%)
            `
          }}></div>
        </div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0118]/95 backdrop-blur-xl border-b border-purple-500/20 shadow-lg shadow-purple-500/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center hover-scale">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold gradient-text">DigiPratibha</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-foreground/80 hover:text-foreground transition-colors font-medium">Features</a>
              <a href="#how-it-works" className="text-foreground/80 hover:text-foreground transition-colors font-medium">How it Works</a>
              <Button 
                variant="outline" 
                onClick={() => onGetStarted('student')}
                className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:border-purple-400 transition-all"
              >
                Sign In
              </Button>
            </nav>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onGetStarted('student')}
                className="text-foreground/80 hover:text-foreground"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge className="gradient-primary text-white border-0 px-4 py-2">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI-Powered Portfolio Platform
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
                  <span className="gradient-text">Showcase Your Skills.</span>
                  <br />
                  <span className="text-white">Unlock Opportunities.</span>
                </h1>
                <p className="text-xl text-foreground/80 leading-relaxed">
                  Build stunning student portfolios with AI assistance and provide institutions 
                  with powerful analytics to track student progress and employability insights.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="gradient-primary text-white border-0 hover-scale group"
                  onClick={() => onGetStarted('student')}
                >
                  For Students: Build Portfolio
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-purple-500 text-purple-400 hover:bg-purple-500/10 hover-scale"
                  onClick={() => onGetStarted('institution')}
                >
                  For Institutions: Get Insights
                  <BarChart3 className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Free to start
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  AI-powered
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="glass p-4 text-center hover-glow">
                <div className="w-full h-80 rounded-lg overflow-hidden border border-purple-500/30 relative group bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1702479744062-1880502275b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwb3J0Zm9saW8lMjB3ZWJzaXRlJTIwZGVzaWduJTIwZGFya3xlbnwxfHx8fDE3NTc1ODM0NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Modern Portfolio Example"
                    className="w-full h-full object-cover rounded-lg transition-all duration-500 group-hover:scale-110"
                  />
                  
                  {/* Neon glow overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 via-purple-900/20 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-pink-500/20"></div>
                  
                  {/* Animated border glow */}
                  <div className="absolute inset-0 rounded-lg border-2 border-transparent bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-purple-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                    mask: 'linear-gradient(white 0 0) content-box, linear-gradient(white 0 0)',
                    maskComposite: 'xor'
                  }}></div>
                  
                  {/* Content overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <p className="text-base text-white font-semibold gradient-text">Portfolio Showcase</p>
                        <p className="text-sm text-white/90">Professional Student Portfolio</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50 text-xs">
                            Responsive
                          </Badge>
                          <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/50 text-xs">
                            AI-Enhanced
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-400 font-medium">Live</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-white/70 group-hover:text-purple-400 transition-colors" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Corner accent */}
                  <div className="absolute top-4 right-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 gradient-primary rounded-full blur-xl opacity-40"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 gradient-secondary rounded-full blur-xl opacity-40"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 relative">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text">How It Works</h2>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
              Simple steps to create your professional portfolio and unlock career opportunities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center space-y-4">
                  <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto hover-scale">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="py-20 px-6 relative">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text">Powerful Features</h2>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
              Everything you need to build professional portfolios and gain valuable insights
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="glass border-0 hover-scale group">
                  <CardHeader className="space-y-4">
                    <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Split Section - Students vs Institutions */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Students Section */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="gradient-primary text-white border-0">
                  <Users className="w-3 h-3 mr-1" />
                  For Students
                </Badge>
                <h3 className="text-3xl font-bold">Build Your Future</h3>
                <p className="text-foreground/80 text-lg">
                  Create job-ready portfolios that showcase your skills and stand out to employers
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4>Progress Tracker</h4>
                    <p className="text-foreground/70">Monitor your skill development and portfolio completion</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4>Job-Ready Portfolio</h4>
                    <p className="text-foreground/70">Professional templates designed for maximum impact</p>
                  </div>
                </div>
              </div>

              <Button 
                size="lg" 
                className="gradient-primary text-white border-0 hover-scale"
                onClick={() => onGetStarted('student')}
              >
                Start Building Your Portfolio
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Institutions Section */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="gradient-secondary text-white border-0">
                  <BarChart3 className="w-3 h-3 mr-1" />
                  For Institutions
                </Badge>
                <h3 className="text-3xl font-bold">Empower Your Students</h3>
                <p className="text-foreground/80 text-lg">
                  Get comprehensive analytics and insights to improve student outcomes and employability
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 gradient-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4>Analytics Dashboard</h4>
                    <p className="text-foreground/70">Track student progress and identify areas for improvement</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 gradient-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4>Employability Score</h4>
                    <p className="text-foreground/70">AI-generated scores to measure student job readiness</p>
                  </div>
                </div>
              </div>

              <Button 
                size="lg" 
                variant="outline"
                className="border-purple-500 text-purple-400 hover:bg-purple-500/10 hover-scale"
                onClick={() => onGetStarted('institution')}
              >
                Explore Institution Features
                <BarChart3 className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <Card className="glass border-0 text-center overflow-hidden relative">
            <div className="absolute inset-0 gradient-primary opacity-10"></div>
            <CardContent className="relative py-16 px-8 space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Join thousands of students and institutions building future-ready portfolios
                </h2>
                <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
                  Start your journey with DigiPratibha today and unlock opportunities for better career outcomes
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="gradient-primary text-white border-0 hover-scale"
                  onClick={() => onGetStarted('student')}
                >
                  Get Started as Student
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-purple-500 text-purple-400 hover:bg-purple-500/10 hover-scale"
                  onClick={() => onGetStarted('institution')}
                >
                  Explore for Institutions
                  <BarChart3 className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-16 px-6 border-t border-border">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl gradient-text">DigiPratibha</span>
              </div>
              <p className="text-foreground/70 leading-relaxed">
                Empowering students and institutions with AI-powered portfolio building and analytics platform.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-muted-foreground hover:text-purple-400 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-purple-400 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-purple-400 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h4>Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#features" className="text-foreground/60 hover:text-foreground/90 transition-colors">Features</a></li>
                <li><a href="#" className="text-foreground/60 hover:text-foreground/90 transition-colors">Pricing</a></li>
                <li><a href="#" className="text-foreground/60 hover:text-foreground/90 transition-colors">Templates</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4>Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="text-foreground/60 hover:text-foreground/90 transition-colors">Help Center</a></li>
                <li><a href="#" className="text-foreground/60 hover:text-foreground/90 transition-colors">FAQ</a></li>
                <li><a href="#" className="text-foreground/60 hover:text-foreground/90 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center text-foreground/60">
            <p>© 2024 DigiPratibha. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}