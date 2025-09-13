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
}

const SimpleIcon: React.FC<{ 
  Icon: React.ComponentType<any>;
  size?: number;
  className?: string;
  gradient?: boolean;
}> = ({ Icon, size = 20, className = '', gradient = false }) => {
  const colorClass = gradient ? 'text-purple-400' : 'text-white/80 hover:text-white';
  
  return (
    <Icon
      size={size}
      strokeWidth={1.5}
      className={`transition-colors duration-200 ${colorClass} ${className}`}
    />
  );
};

// Simple icon exports
export const SimpleHomeIcon = (props: IconProps) => <SimpleIcon Icon={Home} {...props} />;
export const SimpleDashboardIcon = (props: IconProps) => <SimpleIcon Icon={BarChart3} {...props} />;
export const SimplePortfolioIcon = (props: IconProps) => <SimpleIcon Icon={Briefcase} {...props} />;
export const SimpleTemplatesIcon = (props: IconProps) => <SimpleIcon Icon={FileText} {...props} />;
export const SimpleCertificatesIcon = (props: IconProps) => <SimpleIcon Icon={Award} {...props} />;
export const SimpleAnalyticsIcon = (props: IconProps) => <SimpleIcon Icon={TrendingUp} {...props} />;
export const SimpleSettingsIcon = (props: IconProps) => <SimpleIcon Icon={Settings} {...props} />;
export const SimpleAddProjectIcon = (props: IconProps) => <SimpleIcon Icon={Plus} {...props} />;
export const SimpleUploadIcon = (props: IconProps) => <SimpleIcon Icon={Upload} {...props} />;
export const SimplePreviewIcon = (props: IconProps) => <SimpleIcon Icon={Eye} {...props} />;
export const SimpleExportPDFIcon = (props: IconProps) => <SimpleIcon Icon={FileDown} {...props} />;
export const SimpleStudentsIcon = (props: IconProps) => <SimpleIcon Icon={Users} {...props} />;
export const SimpleReportsIcon = (props: IconProps) => <SimpleIcon Icon={FileBarChart} {...props} />;
export const SimpleDepartmentsIcon = (props: IconProps) => <SimpleIcon Icon={Building2} {...props} />;
export const SimpleAIAssistantIcon = (props: IconProps) => <SimpleIcon Icon={Bot} {...props} />;
export const SimpleSkillGapIcon = (props: IconProps) => <SimpleIcon Icon={Target} {...props} />;
export const SimpleTrendsIcon = (props: IconProps) => <SimpleIcon Icon={Activity} {...props} />;
export const SimpleEmployabilityIcon = (props: IconProps) => <SimpleIcon Icon={TrendingUp} {...props} />;
export const SimpleNotificationsIcon = (props: IconProps) => <SimpleIcon Icon={Bell} {...props} />;
export const SimpleProfileIcon = (props: IconProps) => <SimpleIcon Icon={User} {...props} />;

// Main IconSet export for backward compatibility
export const SimpleIconSet = {
  Home: SimpleHomeIcon,
  Dashboard: SimpleDashboardIcon,
  Portfolio: SimplePortfolioIcon,
  Templates: SimpleTemplatesIcon,
  Certificates: SimpleCertificatesIcon,
  Analytics: SimpleAnalyticsIcon,
  Settings: SimpleSettingsIcon,
  AddProject: SimpleAddProjectIcon,
  Upload: SimpleUploadIcon,
  Preview: SimplePreviewIcon,
  ExportPDF: SimpleExportPDFIcon,
  Students: SimpleStudentsIcon,
  Reports: SimpleReportsIcon,
  Departments: SimpleDepartmentsIcon,
  AIAssistant: SimpleAIAssistantIcon,
  SkillGap: SimpleSkillGapIcon,
  Trends: SimpleTrendsIcon,
  Employability: SimpleEmployabilityIcon,
  Notifications: SimpleNotificationsIcon,
  Profile: SimpleProfileIcon
};

export default SimpleIconSet;