import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { 
  Home, 
  Users, 
  BarChart3, 
  Settings, 
  Search,
  Filter,
  Download,
  Eye,
  UserCheck,
  TrendingUp,
  Brain,
  FileText,
  Building2,
  GraduationCap,
  Target,
  Sparkles,
  ChevronDown,
  Bell,
  BarChart,
  LineChart
} from 'lucide-react';
import { StudentsAnalytics } from './StudentsAnalytics';
import { AIInsights } from './AIInsights';
import { UserAvatar } from '../shared/UserAvatar';

interface InstitutionDashboardProps {
  user: any;
  onLogout: () => void;
}

export function InstitutionDashboard({ user, onLogout }: InstitutionDashboardProps) {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  const sidebarItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'students', label: 'Student Portfolios', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <InstitutionHome user={user} />;
      case 'students':
        return <StudentsPage searchQuery={searchQuery} />;
      case 'analytics':
        return <StudentsAnalytics />;
      case 'settings':
        return <InstitutionSettings user={user} onLogout={onLogout} />;
      default:
        return <InstitutionHome user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-background dark">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 glass border-r-0 border-border min-h-screen p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="gradient-text">DigiPratibha</h2>
              <p className="text-xs text-muted-foreground">Institution Portal</p>
            </div>
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`w-full justify-start gap-3 text-white/90 hover:text-white hover:bg-white/10 hover:scale-105 transform transition-all duration-200 ${
                    activeTab === item.id ? 'bg-white/20 text-white border-l-2 border-pink-400' : ''
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* AI Insights Quick Access */}
          <div className="mt-8 p-4 glass rounded-xl border border-purple-500/20 hover-glow">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-sm">AI Insights</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Analyze student performance
            </p>
            <Button size="sm" className="w-full gradient-secondary text-white hover-scale">
              <Sparkles className="w-3 h-3 mr-2" />
              View Reports
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="h-16 glass border-b border-border flex items-center justify-between px-8">
            <div className="flex items-center gap-4">
              <h1 className="text-xl">{user.institution || 'Institution Dashboard'}</h1>
              {activeTab === 'students' && (
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64 glass border-0"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="glass border-0">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="relative hover-scale text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full"></span>
              </Button>
              <UserAvatar user={user} size="sm" />
            </div>
          </div>

          {/* Content */}
          {renderContent()}
        </div>

        {/* AI Insights Panel */}
        <AIInsights />
      </div>
    </div>
  );
}

function InstitutionHome({ user }: { user: any }) {
  const stats = {
    totalStudents: 1247,
    activePortfolios: 892,
    completionRate: 71.5,
    avgEmployabilityScore: 78
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center gap-4">
        <UserAvatar user={user} size="lg" />
        <div>
          <h1 className="text-3xl mb-2">Welcome to {user.institution || 'Your Institution'}</h1>
          <p className="text-muted-foreground">Monitor and analyze your students' portfolio development</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="glass border-0 hover-scale hover-glow rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl gradient-info flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl">{stats.totalStudents.toLocaleString()}</span>
            </div>
            <h3 className="mb-2">Total Students</h3>
            <p className="text-xs text-muted-foreground">Registered in the system</p>
          </CardContent>
        </Card>

        <Card className="glass border-0 hover-scale hover-glow rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl">{stats.activePortfolios}</span>
            </div>
            <h3 className="mb-2">Active Portfolios</h3>
            <p className="text-xs text-muted-foreground">Students with published portfolios</p>
          </CardContent>
        </Card>

        <Card className="glass border-0 hover-scale hover-glow rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl gradient-success flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl">{stats.completionRate}%</span>
            </div>
            <h3 className="mb-2">Completion Rate</h3>
            <Progress value={stats.completionRate} className="mb-2" />
            <p className="text-xs text-muted-foreground">Average portfolio completion</p>
          </CardContent>
        </Card>

        <Card className="glass border-0 hover-scale hover-glow rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl gradient-warning flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl">{stats.avgEmployabilityScore}</span>
            </div>
            <h3 className="mb-2">Employability Score</h3>
            <p className="text-xs text-muted-foreground">AI-calculated average</p>
          </CardContent>
        </Card>
      </div>

      {/* Department Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="glass border-0 rounded-xl hover-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5 text-blue-400" />
              Department Performance
            </CardTitle>
            <CardDescription>Portfolio completion by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { dept: 'Computer Science', students: 342, completion: 85, score: 82, color: 'gradient-success' },
                { dept: 'Electronics', students: 287, completion: 72, score: 78, color: 'gradient-info' },
                { dept: 'Mechanical', students: 256, completion: 68, score: 74, color: 'gradient-warning' },
                { dept: 'Civil', students: 198, completion: 65, score: 71, color: 'gradient-secondary' },
                { dept: 'Information Technology', students: 164, completion: 88, score: 85, color: 'gradient-primary' }
              ].map((dept) => (
                <div key={dept.dept} className="space-y-2 p-3 rounded-lg glass hover-scale cursor-pointer">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{dept.dept}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{dept.students} students</span>
                      <Badge variant="secondary" className={`text-xs ${dept.color} text-white border-0`}>
                        Score: {dept.score}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={dept.completion} className="h-3 flex-1" />
                    <span className="text-xs text-muted-foreground min-w-max">{dept.completion}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${dept.color}`}></div>
                    <p className="text-xs text-muted-foreground">Completion rate</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-0 rounded-xl hover-glow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                AI Insights Summary
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline" className="glass border-0 hover-scale">
                    <Download className="w-3 h-3 mr-2" />
                    Export
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glass border-0">
                  <DropdownMenuItem className="hover:bg-purple-500/10">
                    <FileText className="w-4 h-4 mr-2" />
                    PDF Report
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-purple-500/10">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    CSV Data
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-purple-500/10">
                    <LineChart className="w-4 h-4 mr-2" />
                    Excel Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardTitle>
            <CardDescription>Intelligent analysis of student portfolios</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 hover-scale cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-purple-400" />
                <h4 className="text-sm font-medium">Top Skill Gaps</h4>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Most students lack Cloud Computing (78%) and Machine Learning (65%) skills
              </p>
              <Button size="sm" className="gradient-secondary text-white hover-scale">
                <Eye className="w-3 h-3 mr-2" />
                View Students
              </Button>
            </div>
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 hover-scale cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <h4 className="text-sm font-medium">Trending Skills</h4>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                React (+45%), Python (+38%), and AWS (+52%) are most popular this semester
              </p>
              <Button size="sm" variant="outline" className="glass border-0 hover-scale">
                <BarChart className="w-3 h-3 mr-2" />
                View Details
              </Button>
            </div>
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 hover-scale cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <h4 className="text-sm font-medium">Readiness Score</h4>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                78% of students show high employability potential based on portfolio analysis
              </p>
              <Button size="sm" variant="outline" className="glass border-0 hover-scale">
                <LineChart className="w-3 h-3 mr-2" />
                Detailed Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="glass border-0 rounded-xl hover-glow">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest portfolio updates and activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'New portfolio published', student: 'Rahul Sharma (CS)', time: '2 hours ago', type: 'publish' },
              { action: 'Bulk import completed', detail: '45 students from ECE batch', time: '4 hours ago', type: 'import' },
              { action: 'AI analysis completed', detail: 'Q3 employability report generated', time: '6 hours ago', type: 'ai' },
              { action: 'Certificate verified', student: 'Priya Patel (IT)', time: '1 day ago', type: 'certificate' },
              { action: 'Skills trending report', detail: 'Monthly skills analysis completed', time: '2 days ago', type: 'report' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  activity.type === 'publish' ? 'gradient-primary' :
                  activity.type === 'import' ? 'gradient-info' :
                  activity.type === 'ai' ? 'gradient-secondary' :
                  activity.type === 'certificate' ? 'gradient-success' :
                  'gradient-warning'
                }`}>
                  {activity.type === 'publish' && <Eye className="w-4 h-4 text-white" />}
                  {activity.type === 'import' && <Users className="w-4 h-4 text-white" />}
                  {activity.type === 'ai' && <Brain className="w-4 h-4 text-white" />}
                  {activity.type === 'certificate' && <UserCheck className="w-4 h-4 text-white" />}
                  {activity.type === 'report' && <FileText className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{activity.action}</p>
                  {activity.student && <p className="text-xs text-muted-foreground">{activity.student}</p>}
                  {activity.detail && <p className="text-xs text-muted-foreground">{activity.detail}</p>}
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <Badge variant="secondary" className="text-xs rounded-full">
                  {activity.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StudentsPage({ searchQuery }: { searchQuery: string }) {
  const [filterDept, setFilterDept] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const students = [
    { id: 1, name: 'Rahul Sharma', dept: 'Computer Science', email: 'rahul@example.com', status: 'active', completion: 95, score: 88, lastActive: '2 hours ago' },
    { id: 2, name: 'Priya Patel', dept: 'Information Technology', email: 'priya@example.com', status: 'active', completion: 87, score: 82, lastActive: '1 day ago' },
    { id: 3, name: 'Amit Kumar', dept: 'Electronics', email: 'amit@example.com', status: 'inactive', completion: 72, score: 75, lastActive: '1 week ago' },
    { id: 4, name: 'Sneha Reddy', dept: 'Computer Science', email: 'sneha@example.com', status: 'active', completion: 91, score: 85, lastActive: '3 hours ago' },
    { id: 5, name: 'Vikram Singh', dept: 'Mechanical', email: 'vikram@example.com', status: 'active', completion: 68, score: 71, lastActive: '5 hours ago' },
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = filterDept === 'all' || student.dept === filterDept;
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="p-8">
      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select 
          value={filterDept} 
          onChange={(e) => setFilterDept(e.target.value)}
          className="px-3 py-2 rounded-lg glass border-0"
        >
          <option value="all">All Departments</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Information Technology">Information Technology</option>
          <option value="Electronics">Electronics</option>
          <option value="Mechanical">Mechanical</option>
        </select>
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-lg glass border-0"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Students Table */}
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle>Student Portfolios ({filteredStudents.length})</CardTitle>
          <CardDescription>Monitor and manage student portfolio progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="glass border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                        <span className="text-white font-medium">{student.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{student.name}</h4>
                        <p className="text-sm text-muted-foreground">{student.dept}</p>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm font-medium">{student.completion}%</p>
                        <p className="text-xs text-muted-foreground">Completion</p>
                        <Progress value={student.completion} className="w-16 h-2 mt-1" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">{student.score}</p>
                        <p className="text-xs text-muted-foreground">AI Score</p>
                      </div>
                      <div className="text-center">
                        <Badge variant={student.status === 'active' ? 'default' : 'secondary'} 
                               className={student.status === 'active' ? 'gradient-primary text-white' : ''}>
                          {student.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{student.lastActive}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="glass border-0">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="glass border-0">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InstitutionSettings({ user, onLogout }: { user: any; onLogout: () => void }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl mb-6">Institution Settings</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass border-0">
          <CardHeader>
            <CardTitle>Institution Information</CardTitle>
            <CardDescription>Update your institution details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Institution Name</label>
              <Input defaultValue={user.institution} className="glass border-0" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Contact Email</label>
              <Input defaultValue={user.email} className="glass border-0" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Address</label>
              <Input placeholder="Institution address" className="glass border-0" />
            </div>
            <Button className="gradient-primary text-white">Save Changes</Button>
          </CardContent>
        </Card>

        <Card className="glass border-0">
          <CardHeader>
            <CardTitle>Student Management</CardTitle>
            <CardDescription>Manage student access and permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full glass border-0">
              <Users className="w-4 h-4 mr-2" />
              Bulk Import Students
            </Button>
            <Button variant="outline" className="w-full glass border-0">
              <Download className="w-4 h-4 mr-2" />
              Export Student Data
            </Button>
            <Button variant="outline" className="w-full glass border-0">
              <FileText className="w-4 h-4 mr-2" />
              Generate Reports
            </Button>
            <Button variant="destructive" onClick={onLogout} className="w-full">
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}