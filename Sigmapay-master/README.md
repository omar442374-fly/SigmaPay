# Sigmapay

A modern financial management application built with React and a suite of supporting technologies. The application provides users with tools to manage their finances, track expenses, set budgets, and receive AI-powered financial advice.

## Live Demo

Visit the live application: [Sigmapay](https://ammar-ma-eid.github.io/Sigmapay/)

## Features

- User authentication and profile management
- Dashboard with financial overview
- Budget planning and tracking
- Payment processing
- Transaction history
- Bill management
- AI-powered financial advice
- Mobile-responsive design

## Technologies Used

- **Frontend**: React, React Router (HashRouter), Tailwind CSS, Recharts
- **Build Tools**: Vite, ESLint
- **Deployment**: GitHub Pages

## Development Setup

1. Clone the repository:
   ```
   git clone https://github.com/Ammar-Ma-Eid/Sigmapay.git
   cd Sigmapay
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173/Sigmapay/`

## Deployment

The application is deployed to GitHub Pages using the following process:

1. The `base` path in `vite.config.js` is set to `/Sigmapay/` to match the repository name
2. The application uses HashRouter for client-side routing to work with GitHub Pages
3. A GitHub Actions workflow automatically builds and deploys the application when changes are pushed to the master branch

To manually deploy the application:

```
npm run build
npm run deploy
```

## Project Structure

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
├── .github/workflows/   # GitHub Actions workflows
├── package.json         # Project dependencies
├── vite.config.js       # Vite configuration
└── tailwind.config.js   # Tailwind CSS configuration
```

## License

MIT
