# Task Management Host Application

## Overview

This is the main container application for the Task Management system. It provides the core infrastructure, user authentication, and layout framework for the task management micro-frontend.

## Features

- User authentication system with OTP verification
- Role-based access control (Admin and User roles)
- Responsive layout with navigation and sidebar
- Integration framework for micro-frontends
- Centralized state management

## Project Structure

```
host-app/
├── public/
│   ├── index.html
│  
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── MainLayout.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── OTPVerification.tsx
│   │   │   └── PasswordSetupForm.tsx
│   │   └── MapPicker.tsx
|   |   |___UserForm.tes
|   
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── OTPVerificationPage.tsx
│   │   ├── PasswordSetupPage.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── UserDashboard.tsx
|   |   └── UsersMnagementPage.tsx
│   ├── services/
│   │   ├── api.ts
│   │   └── authService.ts
│   ├── types/
│   │   ├── auth.types.ts
│   │   └── user.types.ts
│   ├── utils/
│   │   ├── axiosConfig.ts
│   ├── App.tsx
│   ├── index.js
│   ├── react-app-env.d.ts
│   └── remoteTypes.d.ts
├── package.json
├── tsconfig.json
└── webpack.config.js
```

## Installation

1. Clone the repository
2. Navigate to the host-app directory:
   ```bash
   cd task-management-frontend/host-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file with the following variables:
   ```
   REACT_APP_API_URL=http://your-api-url
   ```

## Running the Application

Start the development server:
```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:5000/api)

## Building for Production

```bash
npm run build
```

This will create a production-ready build in the `build` directory.

## Testing

Run tests:
```bash
npm test
```

Generate test coverage report:
```bash
npm run test:coverage
```

## Authentication Flow

1. User enters email on the login page
2. System sends an OTP to the user's email
3. User enters the OTP on the verification page
4. If the user is new, they're directed to set up a password
5. User is redirected to their dashboard (Admin or User based on role)

## Role-Based Features

### Admin Features
- Create, edit, and delete tasks
- Assign tasks to users
- View all tasks in the system
- Manage user accounts

### User Features
- View assigned tasks
- Mark tasks as complete
- Filter and search tasks
- Update task status

## Micro-Frontend Integration

This host application uses Module Federation to integrate with the Task Management micro-frontend. Communication between the host app and micro-frontend is handled through a defined contract.

The host app provides the following to the micro-frontend:
- User authentication status and tokens
- User role information
- UI context and theme settings
- Navigation events

