import React from 'react';
import {
  Home,
  BarChart3,
  Briefcase,
  FileText,
  Award,
  TrendingUp,
  Settings,
  Plus,
  Upload,
  Eye,
  FileDown,
  Users,
  FileBarChart,
  Building2,
  Bot,
  Target,
  Activity,
  Bell,
  User
} from 'lucide-react';

interface IconProps {
  size?: number;
  className?: string;
  gradient?: boolean;
  strokeWidth?: number;
}

interface IconSetType {
  // Navigation & Core
  Home: React.FC<IconProps>;
  Dashboard: React.FC<IconProps>;
  Portfolio: React.FC<IconProps>;
  Templates: React.FC<IconProps>;
  Certificates: React.FC<IconProps>;
  Analytics: React.FC<IconProps>;
  Settings: React.FC<IconProps>;
  
  // Actions
  AddProject: React.FC<IconProps>;
  Upload: React.FC<IconProps>;
  Preview: React.FC<IconProps>;
  ExportPDF: React.FC<IconProps>;
  
  // Institution specific
  Students: React.FC<IconProps>;
  Reports: React.FC<IconProps>;
  Departments: React.FC<IconProps>;
  
  // AI & Insights
  AIAssistant: React.FC<IconProps>;
  SkillGap: React.FC<IconProps>;
  Trends: React.FC<IconProps>;
  Employability: React.FC<IconProps>;
  
  // User
  Notifications: React.FC<IconProps>;
  Profile: React.FC<IconProps>;
  
  // Additional utility icons
  Education: React.FC<IconProps>;
  Brain: React.FC<IconProps>;
  Search: React.FC<IconProps>;
  Ideas: React.FC<IconProps>;
  Charts: React.FC<IconProps>;
  Calendar: React.FC<IconProps>;
  Time: React.FC<IconProps>;
  Star: React.FC<IconProps>;
  Success: React.FC<IconProps>;
  Warning: React.FC<IconProps>;
  Info: React.FC<IconProps>;
  Arrow: React.FC<IconProps>;
  Download: React.FC<IconProps>;
  Share: React.FC<IconProps>;
  Edit: React.FC<IconProps>;
  Delete: React.FC<IconProps>;
  Filter: React.FC<IconProps>;
  Menu: React.FC<IconProps>;
  Close: React.FC<IconProps>;
  ChevronDown: React.FC<IconProps>;
  ChevronRight: React.FC<IconProps>;
  Refresh: React.FC<IconProps>;
}

const createIcon = (LucideIcon: React.ComponentType<any>) => {
  return ({ size = 20, className = '', gradient = false, strokeWidth = 1.5 }: IconProps) => {
    const baseClasses = 'transition-colors duration-200';
    const colorClasses = gradient 
      ? 'text-purple-400 hover:text-pink-400' 
      : 'text-white/80 hover:text-white';
    
    return (
      <LucideIcon
        size={size}
        strokeWidth={strokeWidth}
        className={`${baseClasses} ${colorClasses} ${className}`}
      />
    );
  };
};

export const IconSet: IconSetType = {
  // Navigation & Core
  Home: createIcon(Home),
  Dashboard: createIcon(BarChart3),
  Portfolio: createIcon(Briefcase),
  Templates: createIcon(FileText),
  Certificates: createIcon(Award),
  Analytics: createIcon(TrendingUp),
  Settings: createIcon(Settings),
  
  // Actions
  AddProject: createIcon(Plus),
  Upload: createIcon(Upload),
  Preview: createIcon(Eye),
  ExportPDF: createIcon(FileDown),
  
  // Institution specific
  Students: createIcon(Users),
  Reports: createIcon(FileBarChart),
  Departments: createIcon(Building2),
  
  // AI & Insights
  AIAssistant: createIcon(Bot),
  SkillGap: createIcon(Target),
  Trends: createIcon(Activity),
  Employability: createIcon(Target), // Using Target as fallback
  
  // User
  Notifications: createIcon(Bell),
  Profile: createIcon(User),
  
  // Additional utility icons (using available icons as fallbacks)
  Education: createIcon(Award),
  Brain: createIcon(Bot),
  Search: createIcon(Eye),
  Ideas: createIcon(Target),
  Charts: createIcon(BarChart3),
  Calendar: createIcon(FileText),
  Time: createIcon(Settings),
  Star: createIcon(Award),
  Success: createIcon(Award),
  Warning: createIcon(Bell),
  Info: createIcon(FileText),
  Arrow: createIcon(Plus),
  Download: createIcon(FileDown),
  Share: createIcon(Upload),
  Edit: createIcon(Settings),
  Delete: createIcon(Settings),
  Filter: createIcon(Eye),
  Menu: createIcon(BarChart3),
  Close: createIcon(Settings),
  ChevronDown: createIcon(Plus),
  ChevronRight: createIcon(Plus),
  Refresh: createIcon(TrendingUp)
};

// Export individual icons for convenience
export const {
  Home: HomeIcon,
  Dashboard: DashboardIcon,
  Portfolio: PortfolioIcon,
  Templates: TemplatesIcon,
  Certificates: CertificatesIcon,
  Analytics: AnalyticsIcon,
  Settings: SettingsIcon,
  AddProject: AddProjectIcon,
  Upload: UploadIcon,
  Preview: PreviewIcon,
  ExportPDF: ExportPDFIcon,
  Students: StudentsIcon,
  Reports: ReportsIcon,
  Departments: DepartmentsIcon,
  AIAssistant: AIAssistantIcon,
  SkillGap: SkillGapIcon,
  Trends: TrendsIcon,
  Employability: EmployabilityIcon,
  Notifications: NotificationsIcon,
  Profile: ProfileIcon
} = IconSet;

export default IconSet;