# Sigmapay Project Overview

## Introduction

Sigmapay is a modern financial management application built with React and a suite of supporting technologies. The application provides users with tools to manage their finances, track expenses, set budgets, and receive AI-powered financial advice.

## Project Structure

The project follows a standard React application structure with some additional organization for clarity:

```
Sigmapay/
├── public/              # Static assets
├── src/                 # Source code
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React context providers
│   ├── layouts/         # Page layout components
│   ├── pages/           # Page components
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles
├── models/              # MongoDB schema models
├── server.js            # Express server
├── package.json         # Project dependencies
├── vite.config.js       # Vite configuration
└── tailwind.config.js   # Tailwind CSS configuration
```

## Key Features

1. **User Authentication**: Complete authentication flow with signup, login, and profile management.
2. **Dashboard**: Interactive dashboard with financial overview and quick actions.
3. **Budget Management**: Tools to set, track, and customize budgets.
4. **Expense Tracking**: Record and categorize expenses.
5. **Financial Goals**: Set and track progress towards financial goals.
6. **Data Visualization**: Charts and graphs to visualize financial data.
7. **AI-Powered Advice**: Integration with Google Gemini API for personalized financial advice.
8. **Reports**: Generate and download financial reports.
9. **Mobile Responsive**: Fully responsive design for all device sizes.

## Architecture

### Frontend

The frontend is built with React and follows a component-based architecture. State management is handled through React's Context API with custom providers for authentication and financial data.

Key architectural decisions:
- Component-based UI with reusable components
- Context API for state management
- Lazy loading for improved performance
- Tailwind CSS for styling

### Backend

The backend is built with Express and MongoDB, providing API endpoints for the frontend to consume.

Key architectural decisions:
- RESTful API design
- MongoDB for data storage
- JWT for authentication
- Environment-based configuration

## Development Workflow

The project uses Vite for development and building, with ESLint for code quality and GitHub Actions for CI/CD.

1. Development: `npm run dev`
2. Building: `npm run build`
3. Linting: `npm run lint`
4. Deployment: Automated through GitHub Actions

## Deployment

The application is deployed to GitHub Pages using the gh-pages package and GitHub Actions for automation.

## Next Steps

This document provides an overview of the Sigmapay project. For more detailed explanations of specific parts of the codebase, refer to the other markdown files in this directory:

- [Frontend Components](01-FrontendComponents.md)
- [State Management](02-StateManagement.md)
- [Authentication System](03-AuthenticationSystem.md)
- [Financial Features](04-FinancialFeatures.md)
- [Backend API](05-BackendAPI.md)
- [Data Visualization](06-DataVisualization.md)
- [AI Integration](07-AIIntegration.md)
