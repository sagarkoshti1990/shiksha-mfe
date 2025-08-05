# Zoho Ticketing MFE

A reusable, configurable micro-frontend for Zoho Desk integration that provides ticket creation and management capabilities across multiple applications.

## Features

- 🎫 **User Ticket Creation** - Easy ticket submission with pre-filled user data
- 📊 **Admin CSV Export** - Export ticket data with filtering options
- 🔐 **Role-Based Access Control** - Granular permissions for different user roles
- 🎨 **Multi-App Support** - Configurable for different applications
- 📱 **Responsive Design** - Works across desktop and mobile devices
- 🌈 **Customizable UI** - Flexible theming and placement options

## Quick Start

### 1. Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### 2. Basic Integration

```tsx
import { TicketingProvider, TicketRaiseButton } from "zoho-ticketing";

const MyApp = () => (
  <TicketingProvider appName="learner-web-app" userRole="learner">
    <TicketRaiseButton placement="header" />
  </TicketingProvider>
);
```

## Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Base Configuration
NEXT_PUBLIC_API_BASE_URL=https://api.yourapp.com
NEXT_PUBLIC_ZOHO_PORTAL_URL=https://yourorg.zohodesk.com

# App-Specific Configuration
NEXT_PUBLIC_LEARNER_ZOHO_ORG_ID=learner_org_id
NEXT_PUBLIC_LEARNER_DEPT_ID=learner_support_dept
NEXT_PUBLIC_TEACHER_ZOHO_ORG_ID=teacher_org_id
NEXT_PUBLIC_TEACHER_DEPT_ID=teacher_support_dept
NEXT_PUBLIC_ADMIN_ZOHO_ORG_ID=admin_org_id
NEXT_PUBLIC_ADMIN_DEPT_ID=admin_support_dept
```

### App Configuration

```tsx
const appConfig = {
  appName: "learner-web-app",
  features: {
    ticketCreation: true,
    csvExport: false,
    ticketManagement: false,
  },
  roles: {
    canCreateTicket: ["learner", "student"],
    canExportData: ["admin"],
    canManageTickets: ["admin"],
  },
  ui: {
    theme: "light",
    placement: "header",
    buttonStyle: "primary",
  },
  zoho: {
    orgId: "your_org_id",
    departmentId: "support_dept_id",
    portalUrl: "https://yourorg.zohodesk.com",
    customFields: {
      cf_app_source: "learner-web-app",
    },
  },
  categories: [
    { id: "technical", label: "Technical Issues" },
    { id: "content", label: "Content Related" },
  ],
};
```

## Components

### TicketingProvider

The main provider component that wraps your application:

```tsx
<TicketingProvider
  config={appConfig}
  appName="learner-web-app"
  userRole="learner"
>
  {children}
</TicketingProvider>
```

### TicketRaiseButton

Configurable button for raising tickets:

```tsx
<TicketRaiseButton
  placement="header"
  variant="primary"
  label="Get Support"
  size="medium"
/>
```

**Props:**

- `placement`: "header" | "sidebar" | "floating" | "footer" | "dashboard"
- `variant`: "primary" | "secondary" | "fab" | "icon"
- `label`: Custom button text
- `size`: "small" | "medium" | "large"

### Pre-built Variants

```tsx
import {
  HeaderTicketButton,
  SidebarTicketButton,
  FloatingTicketButton,
  DashboardTicketButton
} from 'zoho-ticketing';

// Use in navigation
<HeaderTicketButton />

// Use in sidebar
<SidebarTicketButton />

// Floating action button
<FloatingTicketButton />

// Dashboard integration
<DashboardTicketButton />
```

## Integration Examples

### Learner Web App

```tsx
import { TicketingProvider, HeaderTicketButton } from "zoho-ticketing";

const LearnerApp = () => {
  const config = {
    appName: "learner-web-app",
    features: { ticketCreation: true, csvExport: false },
    categories: [
      { id: "course", label: "Course Issues" },
      { id: "technical", label: "Technical Support" },
    ],
  };

  return (
    <TicketingProvider config={config}>
      <header>
        <HeaderTicketButton />
      </header>
    </TicketingProvider>
  );
};
```

### Teachers App

```tsx
import { TicketingProvider, DashboardTicketButton } from "zoho-ticketing";

const TeachersApp = () => {
  const config = {
    appName: "teachers",
    features: { ticketCreation: true },
    categories: [
      { id: "course-mgmt", label: "Course Management" },
      { id: "student-issues", label: "Student Issues" },
    ],
  };

  return (
    <TicketingProvider config={config}>
      <DashboardTicketButton />
    </TicketingProvider>
  );
};
```

### Admin App

```tsx
import {
  TicketingProvider,
  TicketExportButton,
  TicketManagementDashboard,
} from "zoho-ticketing";

const AdminApp = () => {
  const config = {
    appName: "admin-app-repo",
    features: {
      ticketCreation: true,
      csvExport: true,
      ticketManagement: true,
    },
  };

  return (
    <TicketingProvider config={config}>
      <TicketExportButton />
      <TicketManagementDashboard />
    </TicketingProvider>
  );
};
```

## Custom Hooks

### useTicketing

Main hook for accessing ticketing functionality:

```tsx
import { useTicketing } from "zoho-ticketing";

const MyComponent = () => {
  const {
    canCreateTicket,
    canExportData,
    openTicketForm,
    createTicket,
    isLoading,
    error,
  } = useTicketing();

  if (!canCreateTicket) return null;

  return <button onClick={openTicketForm}>Raise Ticket</button>;
};
```

## API Integration

The MFE expects these backend API endpoints:

- `POST /api/tickets/log` - Log ticket submission
- `GET /api/tickets/list` - Get user tickets
- `POST /api/tickets/webhook` - Zoho webhook handler
- `GET /api/tickets/export` - Export tickets to CSV

## Zoho Desk Setup

1. **Create Departments** for each app (learner, teacher, admin)
2. **Configure Webhooks** to send ticket events to your backend
3. **Set up Email Templates** for agent notifications
4. **Configure Custom Fields** for app identification

### Webhook Configuration

Set up webhooks in Zoho Desk to notify your backend:

```
URL: https://your-api.com/api/tickets/webhook
Events: Ticket Created, Ticket Updated, Reply Added
```

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
```

## Module Federation

This MFE uses Module Federation to expose components:

```javascript
// Host app configuration
const ModuleFederationPlugin = require("@module-federation/nextjs-mf");

module.exports = {
  webpack: (config) => {
    config.plugins.push(
      new ModuleFederationPlugin({
        name: "hostApp",
        remotes: {
          zohoTicketing:
            "zohoTicketing@http://localhost:3005/_next/static/chunks/remoteEntry.js",
        },
      })
    );
    return config;
  },
};
```

## Troubleshooting

### Common Issues

1. **User data not found**: Ensure user info is stored in localStorage as `adminInfo` or `userInfo`
2. **Zoho redirect fails**: Check environment variables and Zoho portal URL
3. **Permissions denied**: Verify user role and app configuration
4. **Module Federation errors**: Ensure both host and remote apps are running

### Debug Mode

Enable debug logging:

```tsx
<TicketingProvider config={config} debug={true}>
  {children}
</TicketingProvider>
```

## License

MIT License
