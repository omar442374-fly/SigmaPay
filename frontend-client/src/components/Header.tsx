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
              style={currentPage === 'groups' ? styles.navButtonActive : styles.navButton}
              onClick={() => onNavigate('groups')}
            >
              Groups
            </button>
            <button
              style={currentPage === 'payments' ? styles.navButtonActive : styles.navButton}
              onClick={() => onNavigate('payments')}
            >
              Payments
            </button>
            <button
              style={currentPage === 'reports' ? styles.navButtonActive : styles.navButton}
              onClick={() => onNavigate('reports')}
            >
              Reports
            </button>
            <button
              style={currentPage === 'notifications' ? styles.navButtonActive : styles.navButton}
              onClick={() => onNavigate('notifications')}
            >
              Notifications
            </button>
            <button
              style={currentPage === 'profile' ? styles.navButtonActive : styles.navButton}
              onClick={() => onNavigate('profile')}
            >
              Profile
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
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '20px 0',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backdropFilter: 'blur(10px)',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '20px',
  },
  logo: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 'bold',
    letterSpacing: '-0.5px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
  },
  nav: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  navButton: {
    padding: '10px 18px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  },
  navButtonActive: {
    padding: '10px 18px',
    background: 'white',
    color: '#667eea',
    border: '1px solid white',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  userInfo: {
    fontSize: '13px',
    opacity: 0.95,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: '8px 16px',
    borderRadius: '20px',
    fontWeight: '500',
    backdropFilter: 'blur(10px)',
  },
};

export default Header;
