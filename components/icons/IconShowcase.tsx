import React from 'react';
import { IconSet } from './IconSet';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface IconDemoProps {
  name: string;
  icon: React.FC<any>;
}

const IconDemo: React.FC<IconDemoProps> = ({ name, icon: Icon }) => {
  return (
    <div className="glass p-4 rounded-lg text-center">
      <div className="flex flex-col items-center space-y-2">
        <div className="p-3 rounded-lg bg-white/5">
          <Icon size={24} strokeWidth={1.5} />
        </div>
        <p className="text-xs text-white/80">{name}</p>
      </div>
    </div>
  );
};

export const IconShowcase: React.FC = () => {
  const allIcons = [
    { name: 'Home', icon: IconSet.Home },
    { name: 'Dashboard', icon: IconSet.Dashboard },
    { name: 'Portfolio', icon: IconSet.Portfolio },
    { name: 'Templates', icon: IconSet.Templates },
    { name: 'Certificates', icon: IconSet.Certificates },
    { name: 'Analytics', icon: IconSet.Analytics },
    { name: 'Settings', icon: IconSet.Settings },
    { name: 'Add Project', icon: IconSet.AddProject },
    { name: 'Upload', icon: IconSet.Upload },
    { name: 'Preview', icon: IconSet.Preview },
    { name: 'Export PDF', icon: IconSet.ExportPDF },
    { name: 'Students', icon: IconSet.Students },
    { name: 'Reports', icon: IconSet.Reports },
    { name: 'Departments', icon: IconSet.Departments },
    { name: 'AI Assistant', icon: IconSet.AIAssistant },
    { name: 'Skill Gap', icon: IconSet.SkillGap },
    { name: 'Trends', icon: IconSet.Trends },
    { name: 'Employability', icon: IconSet.Employability },
    { name: 'Notifications', icon: IconSet.Notifications },
    { name: 'Profile', icon: IconSet.Profile }
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="gradient-text mb-4">DigiPratibha Icon Set</h1>
          <p className="text-white/70">Modern line-style icons for dark themes</p>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 mb-8">
          {allIcons.map((iconData) => (
            <IconDemo
              key={iconData.name}
              name={iconData.name}
              icon={iconData.icon}
            />
          ))}
        </div>

        <div className="glass p-6 rounded-xl">
          <h2 className="text-white mb-4">Usage Examples</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg">
              <IconSet.Home size={20} />
              <IconSet.Dashboard size={20} />
              <IconSet.Portfolio size={20} gradient />
              <IconSet.Settings size={20} />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button className="gradient-primary">
                <IconSet.AddProject size={16} className="mr-2" />
                Add Project
              </Button>
              <Button variant="outline">
                <IconSet.Upload size={16} className="mr-2" />
                Upload
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconShowcase;