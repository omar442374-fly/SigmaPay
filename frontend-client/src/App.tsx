import React, { useState } from 'react';
import Header from './components/Header';
import AuthPage from './pages/AuthPage';
import BudgetPage from './pages/BudgetPage';
import GoalsPage from './pages/GoalsPage';
import ReportsPage from './pages/ReportsPage';

type Page = 'auth' | 'budgets' | 'goals' | 'reports';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('auth');
  const [userId, setUserId] = useState<string | null>(null);

  const handleLoginSuccess = (id: string) => {
    setUserId(id);
    setCurrentPage('budgets');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  return (
    <div style={styles.app}>
      <Header currentPage={currentPage} onNavigate={handleNavigate} userId={userId} />
      
      <main style={styles.main}>
        {currentPage === 'auth' && <AuthPage onLoginSuccess={handleLoginSuccess} />}
        {currentPage === 'budgets' && userId && <BudgetPage userId={userId} />}
        {currentPage === 'goals' && userId && <GoalsPage userId={userId} />}
        {currentPage === 'reports' && userId && <ReportsPage userId={userId} />}
      </main>

      <footer style={styles.footer}>
        <p style={styles.footerText}>
          SigmaPay © 2024 - Personal Finance Management System
        </p>
        <p style={styles.footerSubtext}>
          Built with React & TypeScript | Backend: Node.js & Express
        </p>
      </footer>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fafafa',
  },
  main: {
    flex: 1,
    paddingBottom: '60px',
  },
  footer: {
    backgroundColor: '#333',
    color: 'white',
    padding: '20px',
    textAlign: 'center',
    marginTop: 'auto',
  },
  footerText: {
    margin: '5px 0',
    fontSize: '14px',
  },
  footerSubtext: {
    margin: '5px 0',
    fontSize: '12px',
    opacity: 0.7,
  },
};

export default App;
