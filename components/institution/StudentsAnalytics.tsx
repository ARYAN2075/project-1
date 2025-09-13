import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Award, 
  Target, 
  Brain,
  BarChart3,
  PieChart,
  Download,
  Filter,
  Calendar
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  AreaChart,
  Area,
  LineChart,
  Line,
  Legend
} from 'recharts';

export function StudentsAnalytics() {
  const [timeRange, setTimeRange] = useState('semester');

  const skillsData = [
    { skill: 'React', students: 234, trend: 'up', growth: 45, demand: 95 },
    { skill: 'Python', students: 198, trend: 'up', growth: 38, demand: 88 },
    { skill: 'Node.js', students: 156, trend: 'stable', growth: 5, demand: 82 },
    { skill: 'AWS', students: 89, trend: 'up', growth: 52, demand: 90 },
    { skill: 'Machine Learning', students: 67, trend: 'up', growth: 65, demand: 93 },
    { skill: 'Docker', students: 45, trend: 'up', growth: 28, demand: 78 },
    { skill: 'MongoDB', students: 123, trend: 'down', growth: -12, demand: 75 },
    { skill: 'GraphQL', students: 34, trend: 'up', growth: 89, demand: 72 }
  ];

  const departmentStats = [
    { dept: 'Computer Science', students: 342, avgScore: 82, topSkills: ['React', 'Python', 'AWS'] },
    { dept: 'Information Technology', students: 164, avgScore: 85, topSkills: ['JavaScript', 'Cloud', 'DevOps'] },
    { dept: 'Electronics', students: 287, avgScore: 78, topSkills: ['IoT', 'Python', 'Embedded'] },
    { dept: 'Mechanical', students: 256, avgScore: 74, topSkills: ['CAD', 'Python', 'Automation'] },
    { dept: 'Civil', students: 198, avgScore: 71, topSkills: ['AutoCAD', 'GIS', 'Project Management'] }
  ];

  const employabilityMetrics = {
    highReadiness: 312,
    mediumReadiness: 445,
    lowReadiness: 156,
    averageScore: 78,
    topPerformers: 45,
    improvementNeeded: 89
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl mb-2 gradient-text">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive insights into student portfolio development</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 rounded-lg glass border-0"
          >
            <option value="month">This Month</option>
            <option value="semester">This Semester</option>
            <option value="year">This Year</option>
          </select>
          <Button variant="outline" className="glass border-0">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="glass">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="employability">Employability</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-green-400">+12%</Badge>
                </div>
                <h3 className="text-2xl mb-1">1,247</h3>
                <p className="text-sm text-muted-foreground">Total Students</p>
              </CardContent>
            </Card>

            <Card className="glass border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg gradient-secondary flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-green-400">+8%</Badge>
                </div>
                <h3 className="text-2xl mb-1">71.5%</h3>
                <p className="text-sm text-muted-foreground">Avg Completion</p>
              </CardContent>
            </Card>

            <Card className="glass border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg gradient-tertiary flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-green-400">+15%</Badge>
                </div>
                <h3 className="text-2xl mb-1">892</h3>
                <p className="text-sm text-muted-foreground">Published Portfolios</p>
              </CardContent>
            </Card>

            <Card className="glass border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-green-400">+5%</Badge>
                </div>
                <h3 className="text-2xl mb-1">78</h3>
                <p className="text-sm text-muted-foreground">Avg AI Score</p>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Area Chart for Portfolio Completion Trends */}
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle>Portfolio Completion Trends</CardTitle>
                <CardDescription>Monthly progress with trend analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={[
                    { month: 'Jan', completion: 45, target: 50 },
                    { month: 'Feb', completion: 52, target: 55 },
                    { month: 'Mar', completion: 61, target: 60 },
                    { month: 'Apr', completion: 68, target: 65 },
                    { month: 'May', completion: 75, target: 70 },
                    { month: 'Jun', completion: 78, target: 75 }
                  ]}>
                    <defs>
                      <linearGradient id="completionGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
                    <XAxis dataKey="month" stroke="#a1a1aa" />
                    <YAxis stroke="#a1a1aa" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(20, 15, 35, 0.8)', 
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="completion" 
                      stroke="#8b5cf6" 
                      fillOpacity={1} 
                      fill="url(#completionGradient)" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      stroke="#ec4899" 
                      strokeDasharray="5 5"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Department Performance Bar Chart */}
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
                <CardDescription>Score comparison across top departments</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { dept: 'Computer Science', score: 85, students: 245 },
                    { dept: 'Information Technology', score: 78, students: 189 },
                    { dept: 'Electronics & Comm', score: 72, students: 156 },
                    { dept: 'Mechanical Engg', score: 68, students: 134 },
                    { dept: 'Civil Engineering', score: 65, students: 112 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
                    <XAxis dataKey="dept" stroke="#a1a1aa" angle={-45} textAnchor="end" height={100} />
                    <YAxis stroke="#a1a1aa" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(20, 15, 35, 0.8)', 
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="score" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Donut Chart for Portfolio Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle>Portfolio Status Distribution</CardTitle>
                <CardDescription>Current status of all student portfolios</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: 'Published', value: 892, fill: '#10b981' },
                        { name: 'In Review', value: 156, fill: '#f59e0b' },
                        { name: 'Draft', value: 199, fill: '#ef4444' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {[
                        { name: 'Published', value: 892, fill: '#10b981' },
                        { name: 'In Review', value: 156, fill: '#f59e0b' },
                        { name: 'Draft', value: 199, fill: '#ef4444' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(20, 15, 35, 0.8)', 
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass border-0">
              <CardHeader>
                <CardTitle>Monthly Activity</CardTitle>
                <CardDescription>Student engagement and portfolio updates</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { month: 'Jan', logins: 2400, updates: 1800 },
                    { month: 'Feb', logins: 1398, updates: 2200 },
                    { month: 'Mar', logins: 9800, updates: 2400 },
                    { month: 'Apr', logins: 3908, updates: 2600 },
                    { month: 'May', logins: 4800, updates: 2800 },
                    { month: 'Jun', logins: 3800, updates: 3200 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
                    <XAxis dataKey="month" stroke="#a1a1aa" />
                    <YAxis stroke="#a1a1aa" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(20, 15, 35, 0.8)', 
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="logins" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="updates" fill="#ec4899" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Additional Overview Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle>Skill Proficiency Levels</CardTitle>
                <CardDescription>Distribution of student skill levels</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { level: 'Beginner', count: 445 },
                    { level: 'Intermediate', count: 521 },
                    { level: 'Advanced', count: 281 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
                    <XAxis dataKey="level" stroke="#a1a1aa" />
                    <YAxis stroke="#a1a1aa" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(20, 15, 35, 0.8)', 
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass border-0">
              <CardHeader>
                <CardTitle>Project Types</CardTitle>
                <CardDescription>Most common project categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { type: 'Web Apps', count: 342, fill: '#8b5cf6' },
                        { type: 'Mobile Apps', count: 198, fill: '#ec4899' },
                        { type: 'Data Analysis', count: 156, fill: '#06b6d4' },
                        { type: 'ML Models', count: 98, fill: '#10b981' },
                        { type: 'APIs', count: 98, fill: '#f59e0b' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="count"
                    >
                      {[
                        { type: 'Web Apps', count: 342, fill: '#8b5cf6' },
                        { type: 'Mobile Apps', count: 198, fill: '#ec4899' },
                        { type: 'Data Analysis', count: 156, fill: '#06b6d4' },
                        { type: 'ML Models', count: 98, fill: '#10b981' },
                        { type: 'APIs', count: 98, fill: '#f59e0b' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(20, 15, 35, 0.8)', 
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass border-0">
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>Student engagement by day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={[
                    { day: 'Mon', activity: 75 },
                    { day: 'Tue', activity: 82 },
                    { day: 'Wed', activity: 78 },
                    { day: 'Thu', activity: 85 },
                    { day: 'Fri', activity: 68 },
                    { day: 'Sat', activity: 45 },
                    { day: 'Sun', activity: 38 }
                  ]}>
                    <defs>
                      <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
                    <XAxis dataKey="day" stroke="#a1a1aa" />
                    <YAxis stroke="#a1a1aa" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(20, 15, 35, 0.8)', 
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="activity" 
                      stroke="#ec4899" 
                      fill="url(#activityGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skills Popularity Radar Chart */}
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle>Skills Distribution</CardTitle>
                <CardDescription>Most popular skills among students</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart 
                    data={skillsData.slice(0, 8).map(skill => ({
                      skill: skill.skill.split(' ')[0], // Shorten for display
                      students: skill.students,
                      demand: skill.demand
                    }))}
                    layout="horizontal"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
                    <XAxis type="number" stroke="#a1a1aa" />
                    <YAxis dataKey="skill" type="category" stroke="#a1a1aa" width={80} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(20, 15, 35, 0.8)', 
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="students" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="demand" fill="#ec4899" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Skills Gap Analysis Chart */}
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle>Skills Gap Analysis</CardTitle>
                <CardDescription>Industry demand vs student adoption</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart 
                    data={[
                      { skill: 'Cloud Architecture', demand: 92, adoption: 15, gap: 77 },
                      { skill: 'Machine Learning', demand: 89, adoption: 25, gap: 64 },
                      { skill: 'Blockchain', demand: 78, adoption: 12, gap: 66 },
                      { skill: 'Cybersecurity', demand: 88, adoption: 22, gap: 66 },
                      { skill: 'Data Science', demand: 91, adoption: 35, gap: 56 },
                      { skill: 'DevOps', demand: 85, adoption: 30, gap: 55 }
                    ]}
                    layout="horizontal"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
                    <XAxis type="number" stroke="#a1a1aa" />
                    <YAxis dataKey="skill" type="category" stroke="#a1a1aa" width={120} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(20, 15, 35, 0.8)', 
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="demand" fill="#ef4444" radius={[0, 4, 4, 0]} name="Industry Demand %" />
                    <Bar dataKey="adoption" fill="#10b981" radius={[0, 4, 4, 0]} name="Student Adoption %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Skills Trend Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle>Skills Growth Trends</CardTitle>
                <CardDescription>6-month trend analysis of top skills</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { month: 'Jan', React: 320, Python: 280, JavaScript: 450, AI: 120 },
                    { month: 'Feb', React: 342, Python: 295, JavaScript: 465, AI: 145 },
                    { month: 'Mar', React: 365, Python: 312, JavaScript: 480, AI: 178 },
                    { month: 'Apr', React: 385, Python: 328, JavaScript: 495, AI: 210 },
                    { month: 'May', React: 398, Python: 345, JavaScript: 508, AI: 245 },
                    { month: 'Jun', React: 412, Python: 362, JavaScript: 522, AI: 278 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
                    <XAxis dataKey="month" stroke="#a1a1aa" />
                    <YAxis stroke="#a1a1aa" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(20, 15, 35, 0.8)', 
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Line type="monotone" dataKey="React" stroke="#8b5cf6" strokeWidth={3} />
                    <Line type="monotone" dataKey="Python" stroke="#ec4899" strokeWidth={3} />
                    <Line type="monotone" dataKey="JavaScript" stroke="#06b6d4" strokeWidth={3} />
                    <Line type="monotone" dataKey="AI" stroke="#10b981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass border-0">
              <CardHeader>
                <CardTitle>Skill Categories Distribution</CardTitle>
                <CardDescription>Popular skill categories among students</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { category: 'Frontend Development', count: 523, fill: '#8b5cf6' },
                        { category: 'Backend Development', count: 412, fill: '#ec4899' },
                        { category: 'Data Science', count: 298, fill: '#06b6d4' },
                        { category: 'Mobile Development', count: 256, fill: '#10b981' },
                        { category: 'DevOps', count: 189, fill: '#f59e0b' },
                        { category: 'AI/ML', count: 167, fill: '#ef4444' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {[
                        { category: 'Frontend Development', count: 523, fill: '#8b5cf6' },
                        { category: 'Backend Development', count: 412, fill: '#ec4899' },
                        { category: 'Data Science', count: 298, fill: '#06b6d4' },
                        { category: 'Mobile Development', count: 256, fill: '#10b981' },
                        { category: 'DevOps', count: 189, fill: '#f59e0b' },
                        { category: 'AI/ML', count: 167, fill: '#ef4444' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(20, 15, 35, 0.8)', 
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          {/* Department Comparison Chart */}
          <Card className="glass border-0">
            <CardHeader>
              <CardTitle>Department Performance Comparison</CardTitle>
              <CardDescription>Multi-metric analysis across all departments</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={departmentStats.map(dept => ({
                  dept: dept.dept,
                  students: dept.students,
                  avgScore: dept.avgScore,
                  completion: Math.floor(Math.random() * 30) + 60
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
                  <XAxis dataKey="dept" stroke="#a1a1aa" />
                  <YAxis stroke="#a1a1aa" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(20, 15, 35, 0.8)', 
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="avgScore" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completion" fill="#ec4899" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Individual Department Cards with Mini Charts */}
          <div className="grid grid-cols-1 gap-6">
            {departmentStats.map((dept) => (
              <Card key={dept.dept} className="glass border-0">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="gradient-text">{dept.dept}</CardTitle>
                      <CardDescription>{dept.students} students • Avg Score: {dept.avgScore}</CardDescription>
                    </div>
                    <Button variant="outline" className="glass border-0">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Detailed Report
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Portfolio Completion Donut */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Portfolio Status</h4>
                      <ResponsiveContainer width="100%" height={180}>
                        <RechartsPieChart>
                          <Pie
                            data={[
                              { name: 'Complete', value: Math.floor(dept.students * 0.6), fill: '#10b981' },
                              { name: 'Progress', value: Math.floor(dept.students * 0.25), fill: '#f59e0b' },
                              { name: 'Started', value: Math.floor(dept.students * 0.15), fill: '#ef4444' }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={25}
                            outerRadius={60}
                            dataKey="value"
                          >
                            {[
                              { name: 'Complete', value: Math.floor(dept.students * 0.6), fill: '#10b981' },
                              { name: 'Progress', value: Math.floor(dept.students * 0.25), fill: '#f59e0b' },
                              { name: 'Started', value: Math.floor(dept.students * 0.15), fill: '#ef4444' }
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(20, 15, 35, 0.8)', 
                              border: '1px solid rgba(139, 92, 246, 0.2)',
                              borderRadius: '8px'
                            }} 
                          />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    {/* Top Skills */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Top Skills</h4>
                      <div className="space-y-2">
                        {dept.topSkills.map((skill, index) => (
                          <div key={skill} className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded gradient-primary flex items-center justify-center text-white text-xs">
                              {index + 1}
                            </div>
                            <span className="text-sm">{skill}</span>
                            <Badge variant="secondary" className="text-xs ml-auto">
                              {Math.floor(Math.random() * 50) + 30}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Performance Radar */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Performance Metrics</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Quality</span>
                            <span>{dept.avgScore}%</span>
                          </div>
                          <Progress value={dept.avgScore} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Readiness</span>
                            <span>{dept.avgScore - 5}%</span>
                          </div>
                          <Progress value={dept.avgScore - 5} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Diversity</span>
                            <span>{Math.min(95, dept.avgScore + 10)}%</span>
                          </div>
                          <Progress value={Math.min(95, dept.avgScore + 10)} className="h-2" />
                        </div>
                      </div>
                    </div>

                    {/* Mini Trend Chart */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">6-Month Trend</h4>
                      <ResponsiveContainer width="100%" height={120}>
                        <AreaChart data={[
                          { month: 1, score: dept.avgScore - 15 },
                          { month: 2, score: dept.avgScore - 10 },
                          { month: 3, score: dept.avgScore - 8 },
                          { month: 4, score: dept.avgScore - 3 },
                          { month: 5, score: dept.avgScore - 1 },
                          { month: 6, score: dept.avgScore }
                        ]}>
                          <defs>
                            <linearGradient id={`trendGradient-${dept.dept}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <Area 
                            type="monotone" 
                            dataKey="score" 
                            stroke="#8b5cf6" 
                            fill={`url(#trendGradient-${dept.dept})`}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="employability" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="glass border-0">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl mb-2">{employabilityMetrics.highReadiness}</h3>
                <p className="text-sm text-muted-foreground">High Readiness (80%+)</p>
              </CardContent>
            </Card>

            <Card className="glass border-0">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl mb-2">{employabilityMetrics.mediumReadiness}</h3>
                <p className="text-sm text-muted-foreground">Medium Readiness (60-80%)</p>
              </CardContent>
            </Card>

            <Card className="glass border-0">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center mb-4">
                  <TrendingDown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl mb-2">{employabilityMetrics.lowReadiness}</h3>
                <p className="text-sm text-muted-foreground">Needs Improvement (&lt;60%)</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Employability Score Distribution */}
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle>Employability Score Distribution</CardTitle>
                <CardDescription>Student readiness across score ranges</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={[
                    { range: '90-100', count: 45, percentage: 3.6 },
                    { range: '80-89', count: 156, percentage: 12.5 },
                    { range: '70-79', count: 298, percentage: 23.9 },
                    { range: '60-69', count: 445, percentage: 35.7 },
                    { range: '50-59', count: 203, percentage: 16.3 },
                    { range: '< 50', count: 100, percentage: 8.0 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
                    <XAxis dataKey="range" stroke="#a1a1aa" />
                    <YAxis stroke="#a1a1aa" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(20, 15, 35, 0.8)', 
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Industry Readiness Factors */}
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle>Employability Factors Impact</CardTitle>
                <CardDescription>Key factors contributing to employability scores</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { factor: 'Technical Skills', impact: 35, fill: '#8b5cf6' },
                        { factor: 'Project Portfolio', impact: 25, fill: '#ec4899' },
                        { factor: 'Soft Skills', impact: 20, fill: '#06b6d4' },
                        { factor: 'Certifications', impact: 10, fill: '#10b981' },
                        { factor: 'Experience', impact: 10, fill: '#f59e0b' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      dataKey="impact"
                      label={({ factor, impact }) => `${factor}: ${impact}%`}
                    >
                      {[
                        { factor: 'Technical Skills', impact: 35, fill: '#8b5cf6' },
                        { factor: 'Project Portfolio', impact: 25, fill: '#ec4899' },
                        { factor: 'Soft Skills', impact: 20, fill: '#06b6d4' },
                        { factor: 'Certifications', impact: 10, fill: '#10b981' },
                        { factor: 'Experience', impact: 10, fill: '#f59e0b' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(20, 15, 35, 0.8)', 
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Employability Trends */}
          <Card className="glass border-0">
            <CardHeader>
              <CardTitle>Employability Trends Over Time</CardTitle>
              <CardDescription>6-month progression of student readiness scores</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={[
                  { month: 'Jan', high: 180, medium: 320, low: 350 },
                  { month: 'Feb', high: 195, medium: 335, low: 340 },
                  { month: 'Mar', high: 210, medium: 350, low: 325 },
                  { month: 'Apr', high: 225, medium: 365, low: 310 },
                  { month: 'May', high: 240, medium: 380, low: 295 },
                  { month: 'Jun', high: 258, medium: 395, low: 280 }
                ]}>
                  <defs>
                    <linearGradient id="highReadiness" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="mediumReadiness" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="lowReadiness" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
                  <XAxis dataKey="month" stroke="#a1a1aa" />
                  <YAxis stroke="#a1a1aa" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(20, 15, 35, 0.8)', 
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="high" 
                    stackId="1" 
                    stroke="#10b981" 
                    fill="url(#highReadiness)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="medium" 
                    stackId="1" 
                    stroke="#f59e0b" 
                    fill="url(#mediumReadiness)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="low" 
                    stackId="1" 
                    stroke="#ef4444" 
                    fill="url(#lowReadiness)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}