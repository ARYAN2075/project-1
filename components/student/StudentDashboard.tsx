import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { 
  Home, 
  Palette, 
  FileText, 
  Award, 
  BarChart3, 
  Settings, 
  Plus, 
  Eye, 
  Download,
  Sparkles,
  Brain,
  Target,
  Upload,
  ExternalLink,
  FileDown,
  Check,
  X,
  TrendingUp,
  Zap,
  Bell
} from 'lucide-react';
import { PortfolioBuilder } from './PortfolioBuilder';
import { AIAssistant } from './AIAssistant';
import { UserAvatar } from '../shared/UserAvatar';
import { CircularProgress } from '../shared/CircularProgress';

interface StudentDashboardProps {
  user: any;
  onLogout: () => void;
}

export function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState('home');

  const sidebarItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'builder', label: 'Portfolio Builder', icon: Palette },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <StudentHome user={user} />;
      case 'builder':
        return <PortfolioBuilder user={user} />;
      case 'templates':
        return <TemplatesPage />;
      case 'certificates':
        return <CertificatesPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'settings':
        return <SettingsPage user={user} onLogout={onLogout} />;
      default:
        return <StudentHome user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-background dark">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 glass border-r-0 border-border min-h-screen p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="gradient-text">DigiPratibha</h2>
              <p className="text-xs text-muted-foreground">Student Portal</p>
            </div>
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`w-full justify-start gap-3 text-white/90 hover:text-white hover:bg-white/10 hover:scale-105 transition-all duration-200 ${
                    activeTab === item.id ? 'bg-white/20 text-white border-l-2 border-purple-400' : ''
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* AI Assistant Quick Access */}
          <div className="mt-8 p-4 glass rounded-xl border border-purple-500/20 hover-glow">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm">AI Assistant</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Help me build my portfolio
            </p>
            <Button size="sm" className="w-full gradient-secondary text-white hover-scale">
              <Brain className="w-3 h-3 mr-2" />
              Open AI Chat
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header with notifications */}
          <div className="h-16 glass border-b border-border flex items-center justify-between px-8">
            <div className="flex items-center gap-4">
              <h1 className="text-xl">Portfolio Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="relative hover-scale">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full"></span>
              </Button>
              <UserAvatar user={user} size="sm" />
            </div>
          </div>
          {renderContent()}
        </div>

        {/* AI Assistant */}
        <AIAssistant />
      </div>
    </div>
  );
}

function StudentHome({ user }: { user: any }) {
  const portfolioProgress = 75;
  const skillsCount = 12;
  const projectsCount = 5;
  const certificatesCount = 8;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center gap-4">
        <UserAvatar user={user} size="lg" />
        <div>
          <h1 className="text-3xl mb-2">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">Let's continue building your amazing portfolio</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="glass border-0 hover-scale hover-glow rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <CircularProgress value={portfolioProgress} size={60}>
                <span className="text-lg font-medium">{portfolioProgress}%</span>
              </CircularProgress>
            </div>
            <h3 className="mb-2">Portfolio Progress</h3>
            <p className="text-xs text-muted-foreground">Almost there! Add 2 more projects</p>
          </CardContent>
        </Card>

        <Card className="glass border-0 hover-scale hover-glow rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl gradient-info flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl">{skillsCount}</span>
            </div>
            <h3 className="mb-2">Skills Added</h3>
            <p className="text-xs text-muted-foreground">React, Python, UI/UX +9 more</p>
          </CardContent>
        </Card>

        <Card className="glass border-0 hover-scale hover-glow rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl gradient-warning flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl">{projectsCount}</span>
            </div>
            <h3 className="mb-2">Projects</h3>
            <p className="text-xs text-muted-foreground">Showcase your best work</p>
          </CardContent>
        </Card>

        <Card className="glass border-0 hover-scale hover-glow rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl gradient-success flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl">{certificatesCount}</span>
            </div>
            <h3 className="mb-2">Certificates</h3>
            <p className="text-xs text-muted-foreground">Verified achievements</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="glass border-0 rounded-xl hover-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              Quick Actions
            </CardTitle>
            <CardDescription>Get started with these common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start gradient-primary text-white hover-scale">
              <Plus className="w-4 h-4 mr-2" />
              Add New Project
            </Button>
            <Button variant="outline" className="w-full justify-start glass border-0 hover-scale">
              <Upload className="w-4 h-4 mr-2" />
              Upload Certificate
            </Button>
            <Button variant="outline" className="w-full justify-start glass border-0 hover-scale">
              <ExternalLink className="w-4 h-4 mr-2" />
              Preview Portfolio
            </Button>
            <Button variant="outline" className="w-full justify-start glass border-0 hover-scale">
              <FileDown className="w-4 h-4 mr-2" />
              Export as PDF
            </Button>
          </CardContent>
        </Card>

        <Card className="glass border-0 rounded-xl hover-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              AI Recommendations
            </CardTitle>
            <CardDescription>Personalized suggestions to improve your portfolio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium">Skill Gap Analysis</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-6 px-2 text-xs hover-scale">
                    <Check className="w-3 h-3 mr-1" />
                    Apply
                  </Button>
                  <Button size="sm" variant="ghost" className="h-6 px-2 text-xs hover-scale">
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Consider adding Machine Learning skills - they're in high demand for your field!</p>
            </div>
            <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/20">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  <span className="text-sm font-medium">Portfolio Enhancement</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-6 px-2 text-xs hover-scale">
                    <Check className="w-3 h-3 mr-1" />
                    Apply
                  </Button>
                  <Button size="sm" variant="ghost" className="h-6 px-2 text-xs hover-scale">
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Your "About Me" section could use more personality. Let AI help you rewrite it!</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium">Industry Trends</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-6 px-2 text-xs hover-scale">
                    <Check className="w-3 h-3 mr-1" />
                    Apply
                  </Button>
                  <Button size="sm" variant="ghost" className="h-6 px-2 text-xs hover-scale">
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Full-stack developers with cloud skills are trending. Consider showcasing AWS projects.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="glass border-0 rounded-xl hover-glow">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest portfolio updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Plus className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm">Added new project: "E-commerce React App"</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              <Badge variant="secondary" className="rounded-full">Project</Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl gradient-success flex items-center justify-center">
                <Award className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm">Uploaded AWS Cloud Certification</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
              <Badge variant="secondary" className="rounded-full">Certificate</Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl gradient-info flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm">AI improved your skills section</p>
                <p className="text-xs text-muted-foreground">3 days ago</p>
              </div>
              <Badge variant="secondary" className="rounded-full">AI</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TemplatesPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl mb-6">Portfolio Templates</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {['Modern Tech', 'Creative Designer', 'Business Professional', 'Academic Scholar', 'Startup Founder', 'Data Scientist'].map((template, index) => (
          <Card key={template} className="glass border-0 overflow-hidden group cursor-pointer hover-scale hover-glow rounded-xl">
            <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm text-muted-foreground">{template} Preview</span>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="mb-2">{template}</h3>
              <p className="text-sm text-muted-foreground mb-4">Perfect for showcasing your {template.toLowerCase()} projects</p>
              <Button className="w-full gradient-primary text-white hover-scale">Use Template</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CertificatesPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl">Certificates</h1>
        <Button className="gradient-primary text-white">
          <Plus className="w-4 h-4 mr-2" />
          Upload Certificate
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', date: '2024-03-15', verified: true },
          { name: 'React Developer Certification', issuer: 'Meta', date: '2024-02-20', verified: true },
          { name: 'Google Analytics Certified', issuer: 'Google', date: '2024-01-10', verified: false },
          { name: 'Python Programming', issuer: 'IBM', date: '2023-12-05', verified: true },
        ].map((cert, index) => (
          <Card key={index} className="glass border-0">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <Award className="w-8 h-8 text-yellow-500" />
                <Badge variant={cert.verified ? 'default' : 'secondary'} className={cert.verified ? 'gradient-primary text-white' : ''}>
                  {cert.verified ? 'Verified' : 'Pending'}
                </Badge>
              </div>
              <h3 className="mb-2">{cert.name}</h3>
              <p className="text-sm text-muted-foreground mb-1">{cert.issuer}</p>
              <p className="text-xs text-muted-foreground">{cert.date}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AnalyticsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl mb-6">Portfolio Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="glass border-0">
          <CardContent className="p-6">
            <h3 className="text-2xl mb-2">1,247</h3>
            <p className="text-sm text-muted-foreground">Total Views</p>
            <p className="text-xs text-green-400 mt-1">+12% this week</p>
          </CardContent>
        </Card>
        <Card className="glass border-0">
          <CardContent className="p-6">
            <h3 className="text-2xl mb-2">45</h3>
            <p className="text-sm text-muted-foreground">Profile Downloads</p>
            <p className="text-xs text-green-400 mt-1">+8% this week</p>
          </CardContent>
        </Card>
        <Card className="glass border-0">
          <CardContent className="p-6">
            <h3 className="text-2xl mb-2">23</h3>
            <p className="text-sm text-muted-foreground">Contact Inquiries</p>
            <p className="text-xs text-green-400 mt-1">+15% this week</p>
          </CardContent>
        </Card>
        <Card className="glass border-0">
          <CardContent className="p-6">
            <h3 className="text-2xl mb-2">89%</h3>
            <p className="text-sm text-muted-foreground">Profile Completion</p>
            <p className="text-xs text-yellow-400 mt-1">Add 2 more sections</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle>Skill Popularity</CardTitle>
          <CardDescription>How your skills compare to industry demand</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { skill: 'React', popularity: 95, trend: 'up' },
              { skill: 'Python', popularity: 88, trend: 'up' },
              { skill: 'Node.js', popularity: 82, trend: 'stable' },
              { skill: 'TypeScript', popularity: 78, trend: 'up' },
              { skill: 'AWS', popularity: 85, trend: 'up' },
            ].map((item) => (
              <div key={item.skill} className="flex items-center gap-4">
                <span className="w-20 text-sm">{item.skill}</span>
                <Progress value={item.popularity} className="flex-1" />
                <span className="text-sm text-muted-foreground">{item.popularity}%</span>
                <Badge variant="secondary" className={item.trend === 'up' ? 'text-green-400' : ''}>
                  {item.trend === 'up' ? '↗' : '→'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsPage({ user, onLogout }: { user: any; onLogout: () => void }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl mb-6">Settings</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass border-0">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your basic information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input defaultValue={user.name} className="glass border-0" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input defaultValue={user.email} className="glass border-0" />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Input placeholder="Tell us about yourself" className="glass border-0" />
            </div>
            <Button className="gradient-primary text-white">Save Changes</Button>
          </CardContent>
        </Card>

        <Card className="glass border-0">
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
            <CardDescription>Manage your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full glass border-0">Export Portfolio Data</Button>
            <Button variant="outline" className="w-full glass border-0">Download PDF Portfolio</Button>
            <Button variant="destructive" onClick={onLogout} className="w-full">
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}