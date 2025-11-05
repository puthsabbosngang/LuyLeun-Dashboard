# Luyleun Dashboard - Frontend

This is the frontend application for the Luyleun Staff Management Dashboard, built with Next.js 15 and TypeScript.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
npm install
```

### Environment Setup
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI (shadcn/ui)
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📁 Project Structure

```
frontend/
├── app/                    # App Router pages
│   ├── dashboard/         # Dashboard pages
│   │   ├── layout.tsx    # Dashboard layout
│   │   ├── page.tsx      # Main dashboard
│   │   └── staffmanagement/
│   │       └── page.tsx  # Staff management page
│   ├── login/            # Authentication pages
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── ui/              # Base UI components (shadcn/ui)
│   ├── dashboard-layout.tsx
│   ├── sidebar.tsx
│   ├── staff-form-dialog.tsx
│   └── staff-table.tsx
├── hooks/               # Custom React hooks
│   └── useAuth.tsx
├── lib/                 # Utilities and configurations
│   ├── api/            # API client functions
│   │   ├── authAPI.ts
│   │   └── staffAPI.ts
│   ├── permissions.ts   # Role-based permissions
│   └── utils.ts        # Helper utilities
└── public/             # Static assets
```

## 🔧 Key Features

### Authentication
- JWT-based authentication
- Role-based access control
- Protected routes and components

### Staff Management
- CRUD operations for staff members
- Advanced filtering and search
- Role-based permission enforcement
- Form validation with Zod schemas

### UI Components
- Responsive design with Tailwind CSS
- Accessible components with Radix UI
- Consistent design system
- Toast notifications

### Form Management
- React Hook Form integration
- Real-time validation
- Error handling and display
- Select component integration

## 🎨 UI Components

The project uses shadcn/ui components located in `components/ui/`:

- **Button**: Interactive buttons with variants
- **Card**: Content containers
- **Dialog**: Modal dialogs for forms
- **Form**: Form components with validation
- **Input**: Text input fields
- **Select**: Dropdown select components
- **Table**: Data tables for staff display
- **Badge**: Status and role indicators

## 🔐 Authentication Flow

1. User accesses protected route
2. `useAuth` hook checks authentication status
3. Redirects to login if not authenticated
4. JWT token stored in localStorage
5. API requests include authentication headers

## 📊 API Integration

All API calls are centralized in `lib/api/`:

### Auth API (`authAPI.ts`)
- `login(credentials)`: User authentication
- `getCurrentUser()`: Get current user data
- `logout()`: Clear authentication

### Staff API (`staffAPI.ts`)
- `getAllStaff()`: Fetch all staff members
- `createStaff(data)`: Create new staff
- `updateStaff(id, data)`: Update existing staff
- `deleteStaff(id)`: Delete staff member

## 🎯 Permission System

Role-based permissions are managed in `lib/permissions.ts`:

- `canCreateRole()`: Check if user can create specific roles
- `canEditRole()`: Check edit permissions
- `canDeleteRole()`: Check delete permissions
- `getCreatableRoles()`: Get list of roles user can create

## 🚀 Build & Deployment

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Production Build
```bash
npm run build
npm run start
```

### Environment Variables
```env
NEXT_PUBLIC_API_URL=your_production_api_url
```

## 🔄 State Management

- **Authentication**: Context-based with `useAuth` hook
- **Forms**: React Hook Form with Zod validation
- **API State**: Direct API calls with error handling
- **UI State**: Component-level state management

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Breakpoint-based layout adjustments
- Touch-friendly interface
- Optimized for all screen sizes

## 🐛 Debugging

Common issues and solutions:

1. **Form Validation Issues**: Check Zod schemas in components
2. **API Connection**: Verify `NEXT_PUBLIC_API_URL` in `.env.local`
3. **Authentication**: Clear localStorage and re-login
4. **Build Errors**: Run `npm run lint` and fix TypeScript errors

## 📝 Development Guidelines

1. Use TypeScript for all new components
2. Follow the established component structure
3. Implement proper error handling
4. Add loading states for async operations
5. Maintain consistent styling with Tailwind CSS
6. Use the established API patterns

For more information, see the main project README in the repository root.
