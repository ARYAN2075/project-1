import React from 'react';
import { Home, BarChart3, Briefcase, Settings } from 'lucide-react';

export const IconTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="gradient-text mb-8 text-center">Icon Test</h1>
        
        <div className="glass p-6 rounded-xl">
          <h2 className="text-white mb-4">Basic Lucide Icons</h2>
          <div className="flex items-center space-x-4">
            <Home size={24} className="text-white/80" />
            <BarChart3 size={24} className="text-white/80" />
            <Briefcase size={24} className="text-white/80" />
            <Settings size={24} className="text-white/80" />
          </div>
        </div>

        <div className="glass p-6 rounded-xl mt-6">
          <h2 className="text-white mb-4">Gradient Icons</h2>
          <div className="flex items-center space-x-4">
            <Home size={24} className="text-purple-400" />
            <BarChart3 size={24} className="text-pink-400" />
            <Briefcase size={24} className="text-purple-400" />
            <Settings size={24} className="text-pink-400" />
          </div>
        </div>
      </div>
    </div>
  );
};