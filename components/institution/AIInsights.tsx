import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import { 
  Brain, 
  X, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Target,
  Users,
  Award,
  FileText,
  Download,
  Zap,
  Lightbulb,
  BarChart3,
  Eye
} from 'lucide-react';

export function AIInsights() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('insights');

  const insights = [
    {
      id: 1,
      type: 'trend',
      priority: 'high',
      title: 'Skills Gap Alert',
      description: 'Machine Learning adoption is 65% below industry demand. Consider organizing ML workshops.',
      impact: '312 students affected',
      recommendation: 'Launch "ML for Everyone" workshop series',
      confidence: 92
    },
    {
      id: 2,
      type: 'performance',
      priority: 'medium',
      title: 'Portfolio Quality Improvement',
      description: 'CS students have 15% higher portfolio scores than average. Best practices could be shared.',
      impact: '456 students could benefit',
      recommendation: 'Create cross-department mentorship program',
      confidence: 87
    },
    {
      id: 3,
      type: 'readiness',
      priority: 'high',
      title: 'Industry Readiness Concern',
      description: 'Only 25% of Mechanical students have industry-relevant digital skills.',
      impact: '256 students at risk',
      recommendation: 'Integrate digital tools training in curriculum',
      confidence: 94
    }
  ];

  const recommendations = [
    {
      category: 'Curriculum',
      title: 'Add Cloud Computing Module',
      description: 'Based on industry trends, 78% skill gap exists',
      priority: 'high',
      effort: 'medium',
      impact: 'high'
    },
    {
      category: 'Training',
      title: 'Portfolio Writing Workshop',
      description: 'Students struggle with compelling project descriptions',
      priority: 'medium',
      effort: 'low',
      impact: 'medium'
    },
    {
      category: 'Resources',
      title: 'AI Tools Training',
      description: 'Help students leverage AI for portfolio enhancement',
      priority: 'medium',
      effort: 'low',
      impact: 'high'
    }
  ];

  const reports = [
    {
      title: 'Q3 Employability Report',
      description: 'Comprehensive analysis of student readiness',
      generated: '2 hours ago',
      pages: 24,
      insights: 15
    },
    {
      title: 'Skills Trend Analysis',
      description: 'Industry demand vs student skills mapping',
      generated: '1 day ago',
      pages: 18,
      insights: 12
    },
    {
      title: 'Department Performance',
      description: 'Cross-department portfolio quality comparison',
      generated: '3 days ago',
      pages: 32,
      insights: 20
    }
  ];

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 w-14 h-14 rounded-full gradient-secondary text-white shadow-lg z-50"
      >
        <Brain className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 left-6 w-96 h-[600px] glass border-0 shadow-2xl z-50 flex flex-col">
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full gradient-secondary flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm">AI Insights</CardTitle>
              <p className="text-xs text-muted-foreground">Intelligent Analytics</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-1 mt-3">
          <Button
            variant={activeTab === 'insights' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('insights')}
            className={activeTab === 'insights' ? 'gradient-secondary text-white' : ''}
          >
            <Brain className="w-3 h-3 mr-1" />
            Insights
          </Button>
          <Button
            variant={activeTab === 'recommendations' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('recommendations')}
            className={activeTab === 'recommendations' ? 'gradient-secondary text-white' : ''}
          >
            <Lightbulb className="w-3 h-3 mr-1" />
            Actions
          </Button>
          <Button
            variant={activeTab === 'reports' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('reports')}
            className={activeTab === 'reports' ? 'gradient-secondary text-white' : ''}
          >
            <FileText className="w-3 h-3 mr-1" />
            Reports
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 flex flex-col">
        {activeTab === 'insights' && (
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {insights.map((insight) => (
                <Card key={insight.id} className="glass border-0">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {insight.type === 'trend' && <TrendingUp className="w-4 h-4 text-purple-400" />}
                        {insight.type === 'performance' && <BarChart3 className="w-4 h-4 text-blue-400" />}
                        {insight.type === 'readiness' && <Target className="w-4 h-4 text-orange-400" />}
                        <h4 className="text-sm font-medium">{insight.title}</h4>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={
                          insight.priority === 'high' 
                            ? 'bg-red-500/20 text-red-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }
                      >
                        {insight.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-2">{insight.description}</p>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Impact:</span>
                        <span>{insight.impact}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Confidence:</span>
                        <span>{insight.confidence}%</span>
                      </div>
                      <Progress value={insight.confidence} className="h-1" />
                    </div>
                    
                    <div className="p-2 rounded bg-purple-500/10 border border-purple-500/20">
                      <p className="text-xs"><strong>AI Recommendation:</strong> {insight.recommendation}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* AI Analysis Summary */}
              <Card className="glass border border-purple-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-4 h-4 text-purple-400" />
                    <h4 className="text-sm font-medium">AI Analysis Summary</h4>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Students Analyzed:</span>
                      <span>1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Data Points:</span>
                      <span>15,486</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Insights Generated:</span>
                      <span>23</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span>2 hours ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        )}

        {activeTab === 'recommendations' && (
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <Card key={index} className="glass border-0">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Badge variant="secondary" className="text-xs mb-2">{rec.category}</Badge>
                        <h4 className="text-sm font-medium">{rec.title}</h4>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={
                          rec.priority === 'high' 
                            ? 'bg-red-500/20 text-red-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }
                      >
                        {rec.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-3">{rec.description}</p>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Effort</p>
                        <Badge variant="outline" className={`text-xs ${
                          rec.effort === 'low' ? 'text-green-400' :
                          rec.effort === 'medium' ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {rec.effort}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Impact</p>
                        <Badge variant="outline" className={`text-xs ${
                          rec.impact === 'high' ? 'text-green-400' :
                          rec.impact === 'medium' ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {rec.impact}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" className="gradient-secondary text-white text-xs">
                        Implement
                      </Button>
                      <Button variant="outline" size="sm" className="glass border-0 text-xs">
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}

        {activeTab === 'reports' && (
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              <Button className="w-full gradient-primary text-white">
                <Zap className="w-4 h-4 mr-2" />
                Generate New Report
              </Button>
              
              {reports.map((report, index) => (
                <Card key={index} className="glass border-0">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium">{report.title}</h4>
                      <Button variant="ghost" size="sm">
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-3">{report.description}</p>
                    
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Pages</p>
                        <p className="font-medium">{report.pages}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Insights</p>
                        <p className="font-medium">{report.insights}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Generated</p>
                        <p className="font-medium">{report.generated}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="glass border-0 text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline" className="glass border-0 text-xs">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Quick Stats */}
              <Card className="glass border border-purple-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="w-4 h-4 text-purple-400" />
                    <h4 className="text-sm font-medium">Report Analytics</h4>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reports Generated:</span>
                      <span>47 this month</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Downloads:</span>
                      <span>156 total</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg Accuracy:</span>
                      <span>94.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}