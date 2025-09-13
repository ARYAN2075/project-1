# 🚀 DigiPratibha - AI-Powered Digital Student Portfolio Platform

[![Deploy Status](https://github.com/your-username/digipratibha/workflows/Deploy%20DigiPratibha%20to%20GitHub%20Pages/badge.svg)](https://github.com/your-username/digipratibha/actions)
[![CI Status](https://github.com/your-username/digipratibha/workflows/CI%20-%20DigiPratibha/badge.svg)](https://github.com/your-username/digipratibha/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

DigiPratibha is a cutting-edge dual-role web application that empowers students to create stunning digital portfolios with AI assistance while providing institutions with comprehensive analytics dashboards and AI-powered insights about student skills and employability.

## 🌟 Features

### For Students
- **AI-Powered Portfolio Builder**: Drag-and-drop interface with intelligent suggestions
- **Dynamic Skills Tracking**: Real-time skill assessment and recommendations
- **Project Showcase**: Beautiful project galleries with impact metrics
- **Career Guidance**: AI-driven career recommendations and industry insights
- **Responsive Design**: Works seamlessly across all devices

### For Institutions
- **Comprehensive Analytics**: Deep insights into student performance and skills
- **AI-Powered Insights**: Machine learning-driven analysis of student employability
- **Department Management**: Track progress across different departments
- **Industry Alignment**: Monitor how student skills align with market demands
- **Real-time Dashboards**: Beautiful, interactive data visualizations

## 🎨 Design System

DigiPratibha features a modern, futuristic dark theme with:
- **Neon Purple & Pink Gradients**: Eye-catching color scheme
- **Glassmorphism Effects**: Modern UI with backdrop blur effects
- **Responsive Design**: Mobile-first approach with seamless desktop experience
- **Dark Theme**: Optimized for extended usage with reduced eye strain

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS v4
- **Backend**: Supabase (Database, Auth, Storage, Edge Functions)
- **UI Components**: Radix UI, Shadcn/ui
- **Charts**: Recharts for beautiful data visualizations
- **Icons**: Lucide React
- **Animations**: Motion (Framer Motion successor)
- **Deployment**: GitHub Pages, Vercel, Netlify

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm 8+
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/digipratibha.git
   cd digipratibha
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   
   Visit the database setup page in your local app:
   ```
   http://localhost:3000/database-setup
   ```
   
   Or manually run the SQL schema in your Supabase dashboard.

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🗄️ Database Setup

DigiPratibha uses Supabase as its backend. To set up the database:

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key to your environment variables
3. Run the database setup using one of these methods:

### Option 1: Automated Setup (Recommended)
- Navigate to `/database-setup` in your running application
- Click "Test Connection" to verify your Supabase connection
- Copy the provided SQL and run it in your Supabase SQL Editor

### Option 2: Manual Setup
- Open the Supabase SQL Editor
- Copy the contents of `/database/supabase-schema.sql`
- Execute the SQL commands to create all necessary tables

## 🎯 Deployment

DigiPratibha supports multiple deployment platforms:

### GitHub Pages (Included)
1. Fork this repository
2. Update the repository URL in `package.json`
3. Add Supabase environment variables to GitHub Secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Push to main branch - deployment is automatic!

### Vercel
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push

### Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify settings

## 🏗️ Project Structure

```
digipratibha/
├── components/           # React components
│   ├── admin/           # Admin and setup components
│   ├── auth/            # Authentication components
│   ├── institution/     # Institution dashboard
│   ├── student/         # Student dashboard
│   ├── shared/          # Shared components
│   └── ui/              # UI component library
├── lib/                 # Core libraries and services
├── supabase/            # Supabase edge functions
├── styles/              # Global styles and Tailwind config
├── utils/               # Utility functions
└── database/            # Database schema and migrations
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking

### Development Guidelines

1. **Code Style**: We use ESLint and Prettier for consistent code formatting
2. **TypeScript**: Strict type checking is enforced
3. **Components**: Use functional components with hooks
4. **Styling**: Use Tailwind CSS with our custom design system
5. **State Management**: React hooks and context for state management

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** for the amazing backend-as-a-service platform
- **Tailwind CSS** for the utility-first CSS framework
- **Radix UI** for accessible, unstyled UI components
- **Recharts** for beautiful and responsive charts
- **Motion** for smooth animations

## 📞 Support

- 📧 Email: support@digipratibha.com
- 💬 Discord: [Join our community](https://discord.gg/digipratibha)
- 📖 Documentation: [docs.digipratibha.com](https://docs.digipratibha.com)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/digipratibha/issues)

---

<div align="center">
  <p>Built with ❤️ by the DigiPratibha Team</p>
  <p>Empowering the next generation of digital professionals</p>
</div>