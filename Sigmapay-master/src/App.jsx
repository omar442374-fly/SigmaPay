import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { FinanceProvider } from './contexts/FinanceContext';
import MainLayout from './layouts/MainLayout';
import ProtectedLayout from './layouts/ProtectedLayout';

// Eagerly loaded components
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

// Lazy loaded components
const Contacts = lazy(() => import('./pages/Contacts'));
const Payments = lazy(() => import('./pages/Payments'));
const Transactions = lazy(() => import('./pages/Transactions'));
const Groups = lazy(() => import('./pages/Groups'));
const Receipt = lazy(() => import('./pages/Receipt'));
const Investments = lazy(() => import('./pages/Investments'));
const Advisory = lazy(() => import('./pages/Advisory'));
const Reports = lazy(() => import('./pages/Reports'));
const Cards = lazy(() => import('./pages/Cards'));
const Bills = lazy(() => import('./pages/Bills'));
const AutoPay = lazy(() => import('./pages/AutoPay'));
const Partnerships = lazy(() => import('./pages/Partnerships'));
const Tutoring = lazy(() => import('./pages/Tutoring'));
const Profile = lazy(() => import('./pages/Profile'));
const Verify = lazy(() => import('./pages/Verify'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Budget = lazy(() => import('./pages/Budget'));
const GeminiDemo = lazy(() => import('./pages/GeminiDemo'));

function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <Router>
          <Suspense fallback={<div className="flex justify-center items-center h-64">Loading...</div>}>
            <Routes>
              {/* Main Layout with Navbar for all routes */}
              <Route element={<MainLayout />}>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/about" element={<Home />} /> {/* Placeholder - create About page later */}

                {/* Protected Routes - require authentication */}
                <Route element={<ProtectedLayout />}>
                  {/* Dashboard */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />

                  {/* Money Management */}
                  <Route path="/payments" element={<Payments />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/bills" element={<Bills />} />
                  <Route path="/budget" element={<Budget />} />
                  <Route path="/auto-pay" element={<AutoPay />} />
                  <Route path="/receipt/:id" element={<Receipt />} />

                  {/* Wealth Management */}
                  <Route path="/investments" element={<Investments />} />
                  <Route path="/advisory" element={<Advisory />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/gemini-demo" element={<GeminiDemo />} />

                  {/* Cards */}
                  <Route path="/cards" element={<Cards />} />

                  {/* Community */}
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/groups" element={<Groups />} />
                  <Route path="/partnerships" element={<Partnerships />} />
                  <Route path="/tutoring" element={<Tutoring />} />
                </Route>

                {/* Catch-all route - redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </FinanceProvider>
    </AuthProvider>
  );
}

export default App;
