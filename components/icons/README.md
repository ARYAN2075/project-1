# DigiPratibha Icon Set

A comprehensive icon set designed specifically for the DigiPratibha application, featuring modern line-style icons with rounded edges, optimized for dark themes.

## Features

- **Consistent Design**: All icons follow the same design principles with minimal shapes and consistent stroke width
- **Dark Theme Optimized**: Default white/light gray colors with perfect contrast on dark backgrounds
- **Gradient Support**: Optional pink-purple gradient highlighting for accent states
- **High Readability**: Clean, simple shapes ensure excellent readability at all sizes
- **Responsive**: Works perfectly at different sizes (16px, 20px, 24px, 32px+)
- **Hover States**: Built-in transition animations for interactive elements

## Usage

### Basic Import

```tsx
import { IconSet } from './components/icons/IconSet';
// or import individual icons
import { HomeIcon, DashboardIcon } from './components/icons/IconSet';
```

### Basic Usage

```tsx
// Default icon (white/light gray)
<IconSet.Home size={20} />

// With gradient accent
<IconSet.AIAssistant size={24} gradient />

// Custom styling
<IconSet.Settings size={20} className="text-blue-400" strokeWidth={2} />
```

### Props

All icons accept the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number` | `20` | Icon size in pixels |
| `className` | `string` | `''` | Additional CSS classes |
| `gradient` | `boolean` | `false` | Apply pink-purple gradient |
| `strokeWidth` | `number` | `1.5` | Stroke width for the icon |

## Icon Categories

### Navigation & Core
- `Home` - Homepage navigation
- `Dashboard` - Dashboard/overview page
- `Portfolio` - Portfolio/projects section
- `Templates` - Template library
- `Certificates` - Achievements/certificates
- `Analytics` - Analytics/metrics page
- `Settings` - Settings/preferences

### Actions
- `AddProject` - Add new project/content
- `Upload` - File upload functionality
- `Preview` - Preview content
- `ExportPDF` - Export to PDF
- `Download` - Download files
- `Share` - Share functionality
- `Edit` - Edit/modify content
- `Delete` - Delete/remove items

### Institution Features
- `Students` - Student management
- `Reports` - Reports/documentation
- `Departments` - Department/organization
- `Charts` - Data visualization
- `Filter` - Filter/search options

### AI & Insights
- `AIAssistant` - AI assistant/chatbot
- `SkillGap` - Skill gap analysis
- `Trends` - Trending data/insights
- `Employability` - Employment metrics
- `Brain` - Intelligence/learning
- `Ideas` - Suggestions/recommendations

### User & Utilities
- `Notifications` - Alerts/notifications
- `Profile` - User profile
- `Education` - Educational content
- `Search` - Search functionality
- `Calendar` - Date/scheduling
- `Time` - Time-based features
- `Star` - Favorites/ratings

### Status & Navigation
- `Success` - Success states
- `Warning` - Warning states
- `Info` - Information states
- `Arrow` - Navigation arrows
- `Menu` - Menu/navigation
- `Close` - Close/dismiss actions
- `ChevronDown` - Dropdown indicators
- `ChevronRight` - Forward navigation
- `Refresh` - Refresh/reload actions

## Design Guidelines

### When to Use Gradients
- Primary action buttons
- AI-related features
- Active/selected states
- Hero elements and highlights
- Key metrics that need emphasis

### Sizing Recommendations
- **16px**: Small UI elements, table icons, inline text icons
- **20px**: Standard UI icons, navigation, form elements
- **24px**: Section headers, primary actions
- **32px+**: Hero elements, empty states, large call-to-actions

### Color Usage
```tsx
// Default (recommended for most use cases)
<IconSet.Home />

// Gradient accent (for primary/important elements)
<IconSet.AIAssistant gradient />

// Custom colors (use sparingly)
<IconSet.Warning className="text-orange-400" />
<IconSet.Success className="text-green-400" />
```

## Integration Examples

### In Buttons
```tsx
<Button className="gradient-primary">
  <IconSet.AddProject size={16} className="mr-2" />
  Create Project
</Button>
```

### In Navigation
```tsx
<nav className="flex space-x-4">
  <IconSet.Home size={20} />
  <IconSet.Dashboard size={20} />
  <IconSet.Portfolio size={20} />
  <IconSet.Settings size={20} />
</nav>
```

### In Cards/Metrics
```tsx
<Card className="glass">
  <div className="flex items-center">
    <IconSet.Students size={24} gradient />
    <div className="ml-3">
      <h3>Active Students</h3>
      <p>1,234</p>
    </div>
  </div>
</Card>
```

### With Hover States
```tsx
<button className="flex items-center p-2 rounded-lg hover:bg-white/10 transition-colors">
  <IconSet.Notifications size={20} />
  <span className="ml-2">Notifications</span>
</button>
```

## Accessibility

All icons are designed with accessibility in mind:
- High contrast ratios for readability
- Consistent sizing for predictable layouts
- Semantic naming for screen readers
- Support for reduced motion preferences

## Customization

The icon set integrates with your existing design system:
- Uses CSS variables from your theme
- Supports all Tailwind utility classes
- Maintains consistent hover states
- Works with your gradient utilities

## Performance

- Tree-shakeable imports
- Minimal bundle impact
- SVG-based for crisp rendering
- Cached icon instances for repeated usage