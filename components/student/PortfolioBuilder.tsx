import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { 
  Plus, 
  Trash2, 
  Eye, 
  Save, 
  Upload, 
  Github, 
  Link, 
  Image as ImageIcon, 
  Type, 
  Palette,
  Sparkles,
  FileText,
  Award,
  User,
  Briefcase,
  Mail,
  Download
} from 'lucide-react';

interface PortfolioBuilderProps {
  user: any;
}

export function PortfolioBuilder({ user }: PortfolioBuilderProps) {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [portfolioData, setPortfolioData] = useState({
    about: {
      name: user.name,
      title: '',
      bio: '',
      image: ''
    },
    skills: [],
    projects: [],
    certificates: [],
    contact: {
      email: user.email,
      phone: '',
      linkedin: '',
      github: ''
    }
  });

  const componentLibrary = [
    { id: 'text', name: 'Text Block', icon: Type, description: 'Add headings and paragraphs' },
    { id: 'image', name: 'Image Block', icon: ImageIcon, description: 'Upload images and photos' },
    { id: 'github', name: 'GitHub Integration', icon: Github, description: 'Connect your repositories' },
    { id: 'certificate', name: 'Certificate Upload', icon: Award, description: 'Upload from DigiLocker' },
    { id: 'contact', name: 'Contact Form', icon: Mail, description: 'Let people reach out' },
    { id: 'skills', name: 'Skills Grid', icon: Sparkles, description: 'Showcase your abilities' },
  ];

  const templates = [
    { id: 'modern', name: 'Modern Tech', preview: 'Clean and minimal design' },
    { id: 'creative', name: 'Creative', preview: 'Bold and colorful layout' },
    { id: 'professional', name: 'Professional', preview: 'Business-focused design' },
  ];

  return (
    <div className="h-screen flex">
      {/* Component Library Sidebar */}
      <div className="w-80 glass border-r border-border p-6 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-xl mb-2">Portfolio Builder</h2>
          <p className="text-sm text-muted-foreground">Drag and drop components to build your portfolio</p>
        </div>

        <Tabs defaultValue="components" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 glass">
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="components" className="space-y-4">
            <div className="space-y-3">
              {componentLibrary.map((component) => {
                const Icon = component.icon;
                return (
                  <Card
                    key={component.id}
                    className="glass border-0 cursor-pointer hover:border-purple-500/50 transition-colors"
                    onClick={() => setSelectedComponent(component.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm">{component.name}</h4>
                          <p className="text-xs text-muted-foreground">{component.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="space-y-3">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className="glass border-0 cursor-pointer hover:border-purple-500/50 transition-colors"
                >
                  <CardContent className="p-4">
                    <h4 className="text-sm mb-1">{template.name}</h4>
                    <p className="text-xs text-muted-foreground mb-3">{template.preview}</p>
                    <Button size="sm" className="w-full gradient-secondary text-white">
                      Apply Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* AI Suggestions */}
        <Card className="glass border border-purple-500/20 mt-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              AI Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <p className="text-xs mb-2">💡 <strong>Content Tip</strong></p>
              <p className="text-xs text-muted-foreground">Your About section could be more engaging. Try adding your passion for technology!</p>
              <Button size="sm" variant="ghost" className="text-xs h-6 p-2 mt-2">
                Apply Suggestion
              </Button>
            </div>
            <div className="p-3 rounded-lg bg-pink-500/10 border border-pink-500/20">
              <p className="text-xs mb-2">🚀 <strong>Skill Enhancement</strong></p>
              <p className="text-xs text-muted-foreground">Consider adding "Machine Learning" to your skills - it's trending in your field!</p>
              <Button size="sm" variant="ghost" className="text-xs h-6 p-2 mt-2">
                Add Skill
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-16 glass border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h3 className="font-medium">My Portfolio</h3>
            <Badge variant="secondary" className="gradient-primary text-white">Live</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="glass border-0">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" size="sm" className="glass border-0">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button size="sm" className="gradient-primary text-white">
              <Save className="w-4 h-4 mr-2" />
              Save & Publish
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* About Section */}
            <Card className="glass border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    About Me
                  </CardTitle>
                  <Button variant="ghost" size="sm">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={portfolioData.about.name}
                        onChange={(e) => setPortfolioData(prev => ({
                          ...prev,
                          about: { ...prev.about, name: e.target.value }
                        }))}
                        className="glass border-0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="title">Professional Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Full Stack Developer"
                        value={portfolioData.about.title}
                        onChange={(e) => setPortfolioData(prev => ({
                          ...prev,
                          about: { ...prev.about, title: e.target.value }
                        }))}
                        className="glass border-0"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full glass border-2 border-dashed border-purple-500/50 flex items-center justify-center cursor-pointer hover:border-purple-500 transition-colors">
                      <div className="text-center">
                        <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Upload Photo</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell your story... (AI can help write this!)"
                    value={portfolioData.about.bio}
                    onChange={(e) => setPortfolioData(prev => ({
                      ...prev,
                      about: { ...prev.about, bio: e.target.value }
                    }))}
                    className="glass border-0 min-h-[100px]"
                  />
                  <Button variant="ghost" size="sm" className="mt-2 text-purple-400">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI Write Bio
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Skills Section */}
            <Card className="glass border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Skills
                  </CardTitle>
                  <Button size="sm" className="gradient-secondary text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'MongoDB', 'GraphQL'].map((skill) => (
                    <Badge key={skill} variant="secondary" className="glass px-3 py-1">
                      {skill}
                      <button className="ml-2 text-muted-foreground hover:text-foreground">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Add a skill..." className="glass border-0" />
                  <Button variant="outline" className="glass border-0">
                    <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
                    AI Suggest Skills
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Projects Section */}
            <Card className="glass border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Projects
                  </CardTitle>
                  <Button size="sm" className="gradient-secondary text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'E-commerce React App', description: 'Full-stack e-commerce platform built with React and Node.js', tech: ['React', 'Node.js', 'MongoDB'] },
                    { name: 'AI Task Manager', description: 'Smart task management app with AI-powered suggestions', tech: ['Python', 'TensorFlow', 'Flask'] }
                  ].map((project, index) => (
                    <Card key={index} className="glass border-0">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4>{project.name}</h4>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Github className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Link className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {project.tech.map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Section */}
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={portfolioData.contact.email}
                      onChange={(e) => setPortfolioData(prev => ({
                        ...prev,
                        contact: { ...prev.contact, email: e.target.value }
                      }))}
                      className="glass border-0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="Your phone number"
                      value={portfolioData.contact.phone}
                      onChange={(e) => setPortfolioData(prev => ({
                        ...prev,
                        contact: { ...prev.contact, phone: e.target.value }
                      }))}
                      className="glass border-0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      placeholder="LinkedIn profile URL"
                      value={portfolioData.contact.linkedin}
                      onChange={(e) => setPortfolioData(prev => ({
                        ...prev,
                        contact: { ...prev.contact, linkedin: e.target.value }
                      }))}
                      className="glass border-0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="github">GitHub</Label>
                    <Input
                      id="github"
                      placeholder="GitHub profile URL"
                      value={portfolioData.contact.github}
                      onChange={(e) => setPortfolioData(prev => ({
                        ...prev,
                        contact: { ...prev.contact, github: e.target.value }
                      }))}
                      className="glass border-0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      <div className="w-80 glass border-l border-border p-6 overflow-y-auto">
        <div className="mb-6">
          <h3 className="text-lg mb-2">Design Settings</h3>
          <p className="text-sm text-muted-foreground">Customize your portfolio's appearance</p>
        </div>

        <Tabs defaultValue="style" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 glass">
            <TabsTrigger value="style">Style</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
          </TabsList>

          <TabsContent value="style" className="space-y-4">
            <Card className="glass border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Color Scheme</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { name: 'Purple', colors: ['bg-purple-500', 'bg-purple-600'] },
                    { name: 'Blue', colors: ['bg-blue-500', 'bg-blue-600'] },
                    { name: 'Green', colors: ['bg-green-500', 'bg-green-600'] },
                    { name: 'Pink', colors: ['bg-pink-500', 'bg-pink-600'] },
                    { name: 'Orange', colors: ['bg-orange-500', 'bg-orange-600'] },
                    { name: 'Teal', colors: ['bg-teal-500', 'bg-teal-600'] },
                  ].map((scheme) => (
                    <div
                      key={scheme.name}
                      className="aspect-square rounded-lg cursor-pointer border-2 border-transparent hover:border-purple-500 p-1"
                    >
                      <div className={`w-full h-full rounded gradient-primary`}></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Typography</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs">Font Family</Label>
                  <select className="w-full p-2 rounded-lg glass border-0 text-sm">
                    <option>Inter (Modern)</option>
                    <option>Poppins (Friendly)</option>
                    <option>Roboto (Clean)</option>
                    <option>Playfair Display (Elegant)</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs">Font Size</Label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="glass border-0 text-xs">Small</Button>
                    <Button size="sm" className="gradient-primary text-white text-xs">Medium</Button>
                    <Button variant="outline" size="sm" className="glass border-0 text-xs">Large</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Effects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Glassmorphism</Label>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Animations</Label>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Gradient Backgrounds</Label>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4">
            <Card className="glass border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Page Layout</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs">Section Order</Label>
                  <div className="space-y-2 mt-2">
                    {['About', 'Skills', 'Projects', 'Certificates', 'Contact'].map((section) => (
                      <div key={section} className="p-2 glass rounded border-0 flex items-center justify-between cursor-move">
                        <span className="text-sm">{section}</span>
                        <Button variant="ghost" size="sm">⋮⋮</Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Responsive Design</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="glass border-0 text-xs">📱 Mobile</Button>
                  <Button size="sm" className="gradient-primary text-white text-xs">💻 Desktop</Button>
                  <Button variant="outline" size="sm" className="glass border-0 text-xs">📺 Tablet</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}