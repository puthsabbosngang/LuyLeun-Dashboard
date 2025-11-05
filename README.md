# Luyleun Staff Management Dashboard

A modern, full-stack staff management system built with Next.js and Node.js, featuring comprehensive user management, role-based permissions, and a responsive dashboard interface.

## 🚀 Features

- **Staff Management**: Complete CRUD operations for staff members
- **Role-Based Access Control**: Hierarchical permission system with multiple user roles
- **Authentication**: Secure JWT-based authentication
- **Responsive Design**: Modern UI with Tailwind CSS and Radix UI components
- **Real-time Validation**: Form validation with React Hook Form and Zod
- **Department Management**: Organized staff by departments (IT, Finance, HR, etc.)
- **Advanced Filtering**: Search, sort, and filter staff members
- **Permission Management**: Fine-grained permission control for different user roles

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Notifications**: Sonner

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL with TypeORM
- **Authentication**: JWT with bcrypt
- **API**: RESTful API architecture

## 📁 Project Structure

```
luyleun-dashboard/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App router pages
│   │   ├── dashboard/       # Dashboard pages
│   │   ├── login/          # Authentication pages
│   │   └── layout.tsx      # Root layout
│   ├── components/         # Reusable React components
│   │   ├── ui/            # Base UI components
│   │   ├── dashboard-layout.tsx
│   │   ├── sidebar.tsx
│   │   ├── staff-form-dialog.tsx
│   │   └── staff-table.tsx
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and API functions
│   │   ├── api/          # API client functions
│   │   ├── permissions.ts # Permission management
│   │   └── utils.ts      # Helper utilities
│   └── public/           # Static assets
├── backend/              # Node.js backend application
│   ├── src/
│   │   ├── config/       # Database and app configuration
│   │   ├── entities/     # TypeORM entities
│   │   ├── middleware/   # Express middleware
│   │   ├── routes/       # API route handlers
│   │   ├── scripts/      # Utility scripts
│   │   └── server.ts     # Express server setup
│   └── package.json
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MySQL database
- npm or yarn

### 1. Clone the repository
```bash
git clone <repository-url>
cd luyleun-dashboard
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create environment file
cp .env.example .env

# Configure your database settings in .env
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASS=your_password
DB_NAME=los_system
JWT_SECRET=your_jwt_secret
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create environment file
cp .env.example .env.local

# Configure API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Database Setup
- Create a MySQL database named `los_system`
- Run the backend application to auto-create tables (TypeORM synchronize is enabled for development)

### 5. Start the Applications

**Backend** (Terminal 1):
```bash
cd backend
npm start
```

**Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
```

The applications will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 👥 User Roles & Permissions

### Role Hierarchy
1. **Super Admin** - Full system access
2. **Admin** - Manage staff (except Super Admin)
3. **Business Supervisor** - Department oversight
4. **Department Supervisors** - CS, CD, CO, AC, HR, Marketing
5. **Officers & Staff** - Department-specific roles

### Permission Matrix
- **Create Staff**: Super Admin, Admin
- **Edit Staff**: Super Admin, Admin (role-based restrictions)
- **Delete Staff**: Super Admin, Admin (role-based restrictions)
- **View Staff**: Role-based visibility rules
- **Manage Permissions**: Super Admin, authorized Admins

## 📊 Departments

- **Customer Support (CS)**: CS Officers, CS Supervisors
- **Credit (CD)**: CD Officers, CD Supervisors, CD Committee
- **Collection (CO)**: CO Officers, CO Supervisors
- **Finance (AC)**: AC Officers, AC Supervisors
- **IT**: CTO, Fullstack Developers, UX/UI Designers, Data Scientists
- **Digital Marketing**: Marketing Supervisors, Graphic Designers
- **Human Resources**: HR Supervisors
- **General**: Operations Managers, Business Supervisors, Admins

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Staff Management
- `GET /api/staff` - Get all staff
- `GET /api/staff/:id` - Get staff by ID
- `POST /api/staff` - Create new staff
- `PUT /api/staff/:id` - Update staff
- `DELETE /api/staff/:id` - Delete staff

## 🧪 Development Scripts

### Backend
```bash
npm start          # Start development server
npm run build      # Build for production
npm run dev        # Start with nodemon
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_password
DB_NAME=los_system
JWT_SECRET=your_jwt_secret_key
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🚀 Deployment

### Backend Deployment
1. Build the TypeScript code: `npm run build`
2. Set production environment variables
3. Deploy to your preferred hosting platform
4. Ensure database is accessible

### Frontend Deployment
1. Build the Next.js application: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred platform
3. Set production environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or need help with setup, please:
1. Check the documentation above
2. Review the existing issues
3. Create a new issue with detailed information

## 🔄 Changelog

### Version 1.0.0
- Initial release with core staff management features
- Role-based permission system
- Responsive dashboard interface
- Complete CRUD operations for staff
- Authentication and authorization system