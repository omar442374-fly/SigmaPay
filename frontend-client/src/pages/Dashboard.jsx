import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaChartLine, FaMoneyBillWave, FaUsers, FaUserCircle } from 'react-icons/fa';
import { IconType } from 'react-icons';

function Dashboard() {
  const { user } = useAuth();

  const Icon = ({ icon: IconComponent, className }: { icon: IconType; className: string }) => (
    <IconComponent className={className} />
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.username}!</h1>
        <p className="text-gray-600">Here's an overview of your financial activities</p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link
          to="/budgets"
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100"
        >
          <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Icon icon={FaChartLine} className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Budget</h3>
          <p className="text-gray-600 text-sm">Manage your budgets and track spending</p>
        </Link>

        <Link
          to="/payments"
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100"
        >
          <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Icon icon={FaMoneyBillWave} className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Payments</h3>
          <p className="text-gray-600 text-sm">Send and receive payments</p>
        </Link>

        <Link
          to="/groups"
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100"
        >
          <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Icon icon={FaUsers} className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Groups</h3>
          <p className="text-gray-600 text-sm">Manage your savings groups</p>
        </Link>

        <Link
          to="/profile"
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100"
        >
          <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Icon icon={FaUserCircle} className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile</h3>
          <p className="text-gray-600 text-sm">Update your account settings</p>
        </Link>
      </div>

      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Get Started with SigmaPay</h2>
        <p className="mb-6 opacity-90">
          Explore all the features and start managing your finances more effectively.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/budgets"
            className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Create Budget
          </Link>
          <Link
            to="/payments"
            className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white/10 transition"
          >
            Make Payment
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
