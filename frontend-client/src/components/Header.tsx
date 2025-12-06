import React from 'react';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userId: string | null;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, userId }) => {
  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <h1 style={styles.logo}>💰 SigmaPay</h1>
        {userId && (
          <nav style={styles.nav}>
            <button
              style={currentPage === 'budgets' ? styles.navButtonActive : styles.navButton}
              onClick={() => onNavigate('budgets')}
            >
              Budgets
            </button>
            <button
              style={currentPage === 'goals' ? styles.navButtonActive : styles.navButton}
              onClick={() => onNavigate('goals')}
            >
              Goals
            </button>
            <button
              style={currentPage === 'reports' ? styles.navButtonActive : styles.navButton}
              onClick={() => onNavigate('reports')}
            >
              Reports
            </button>
          </nav>
        )}
        {userId && (
          <div style={styles.userInfo}>
            User ID: {userId.substring(0, 12)}...
          </div>
        )}
      </div>
    </header>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    backgroundColor: '#1976D2',
    color: 'white',
    padding: '15px 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    margin: 0,
    fontSize: '24px',
  },
  nav: {
    display: 'flex',
    gap: '10px',
  },
  navButton: {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  navButtonActive: {
    padding: '10px 20px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '1px solid white',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  userInfo: {
    fontSize: '14px',
    opacity: 0.9,
  },
};

export default Header;
