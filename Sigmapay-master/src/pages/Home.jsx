import { Link, useNavigate } from 'react-router-dom';
import { FaTwitter, FaInstagram, FaLinkedin, FaChartLine, FaMoneyBillWave, FaCreditCard, FaUserShield, FaUsers, FaLightbulb, FaMobileAlt } from 'react-icons/fa';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import { getAssetPath } from '../utils/assets';
import { useAuth } from '../contexts/AuthContext';

function Home() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Function to handle navigation based on authentication status
  const handleAuthNavigation = (e, defaultPath) => {
    e.preventDefault();
    if (isAuthenticated()) {
      navigate('/dashboard');
    } else {
      navigate(defaultPath);
    }
  };

  return (
    <div className="font-sans bg-gradient-to-b from-white to-indigo-50 min-h-screen flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-4 py-12 flex-grow">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-indigo-100 via-white to-purple-100 rounded-3xl shadow-xl p-8 md:p-16 mb-20 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
              <h1 className="text-5xl md:text-6xl font-extrabold text-indigo-800 mb-4 drop-shadow-sm leading-tight animate-slide-down">
                Smart Banking for a <span className="text-indigo-600">Brighter</span> Future
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-xl animate-slide-down" style={{ animationDelay: '100ms' }}>
                Manage your money, achieve your goals, and build wealth with our all-in-one financial platform.
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
                <a
                  href="#"
                  onClick={(e) => handleAuthNavigation(e, '/signup')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition-transform duration-300 hover:scale-105 flex items-center justify-center"
                >
                  {isAuthenticated() ? 'Go to Dashboard' : 'Get Started Free'}
                  <HiOutlineArrowNarrowRight className="ml-2" />
                </a>
                <a
                  href="#"
                  onClick={(e) => handleAuthNavigation(e, '/login')}
                  className="bg-white border-2 border-indigo-600 text-indigo-700 hover:bg-indigo-50 px-8 py-3 rounded-full text-lg font-semibold shadow-md transition-transform duration-300 hover:scale-105"
                >
                  {isAuthenticated() ? 'Dashboard' : 'Login'}
                </a>
              </div>
              <div className="mt-6 text-gray-600 text-sm animate-fade-in" style={{ animationDelay: '400ms' }}>
                <p>No credit card required • Free plan available</p>
              </div>
            </div>

            {/* Dashboard Preview Image */}
            <div className="md:w-1/2 relative animate-slide-in-left" style={{ animationDelay: '300ms' }}>
              <div className="bg-white p-2 rounded-xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <img
                  src={getAssetPath('Dashboard.png')}
                  alt="SigmaPay Dashboard Preview"
                  className="rounded-lg w-full h-auto"
                />
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce-slow">
                100% Secure
              </div>
              <div className="absolute -bottom-4 -left-4 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse-slow">
                Easy to Use
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-slide-up">Powerful Features for Your Financial Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
              Everything you need to manage your money, set goals, and build wealth - all in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Smart Budget Planner',
                desc: 'Take control of your finances with AI-powered budgeting tools that adapt to your spending habits.',
                icon: <FaChartLine className="w-8 h-8" />,
                color: 'bg-blue-100 text-blue-600',
                link: '/budget'
              },
              {
                title: 'Group Savings',
                desc: 'Join saving groups with friends and family to achieve your financial goals faster together.',
                icon: <FaUsers className="w-8 h-8" />,
                color: 'bg-purple-100 text-purple-600',
                link: '/groups'
              },
              {
                title: 'Instant Payments',
                desc: 'Send money to anyone, anywhere with just a few clicks - fast, secure, and fee-free.',
                icon: <FaMoneyBillWave className="w-8 h-8" />,
                color: 'bg-green-100 text-green-600',
                link: '/payments'
              },
              {
                title: 'Investment Portfolio',
                desc: 'Grow your wealth with personalized investment recommendations based on your goals.',
                icon: <FaChartLine className="w-8 h-8" />,
                color: 'bg-yellow-100 text-yellow-600',
                link: '/investments'
              },
              {
                title: 'Virtual & Physical Cards',
                desc: 'Manage all your cards in one place with advanced security features and instant notifications.',
                icon: <FaCreditCard className="w-8 h-8" />,
                color: 'bg-red-100 text-red-600',
                link: '/cards'
              },
              {
                title: 'Financial Education',
                desc: 'Access courses, articles, and personalized advice to improve your financial literacy.',
                icon: <FaLightbulb className="w-8 h-8" />,
                color: 'bg-indigo-100 text-indigo-600',
                link: '/tutoring'
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition duration-300 border border-gray-100 group animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`${feature.color} w-16 h-16 rounded-lg flex items-center justify-center mb-6 transform transition-transform group-hover:scale-110 duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {feature.desc}
                </p>
                <Link to={feature.link} className="text-indigo-600 font-medium flex items-center hover:text-indigo-800 group-hover:translate-x-1 transform transition-all">
                  Learn more <HiOutlineArrowNarrowRight className="ml-1 group-hover:ml-2 transition-all" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-slide-up">Why Choose SigmaPay?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
              We're not just another banking app. Here's what sets us apart.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Bank-Level Security',
                desc: 'Your data and money are protected with the highest security standards.',
                icon: <FaUserShield className="w-6 h-6" />,
              },
              {
                title: 'No Hidden Fees',
                desc: 'Transparent pricing with no surprise charges or hidden costs.',
                icon: <FaMoneyBillWave className="w-6 h-6" />,
              },
              {
                title: 'Smart Automation',
                desc: 'Automate savings, payments, and investments to build wealth effortlessly.',
                icon: <FaLightbulb className="w-6 h-6" />,
              },
              {
                title: 'Mobile-First Design',
                desc: 'Manage your finances on the go with our intuitive mobile experience.',
                icon: <FaMobileAlt className="w-6 h-6" />,
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="text-center animate-fade-in hover:transform hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${index * 150 + 200}ms` }}
              >
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600 shadow-md">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-slide-up">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
              Join thousands of satisfied users who have transformed their financial lives with SigmaPay.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Ammar Eid",
                role: "Small Business Owner",
                image: getAssetPath('photo placeholder.png'),
                quote: "SigmaPay has completely transformed how I manage my business finances. The budgeting tools and expense tracking have saved me hours every month.",
                rating: 5
              },
              {
                name: "Mohamed Ibrahim",
                role: "Software Engineer",
                image: getAssetPath('photo placeholder.png'),
                quote: "I've tried many financial apps, but SigmaPay stands out with its intuitive interface and powerful features. The investment recommendations have been spot on!",
                rating: 5
              },
              {
                name: "Andrew Gamal",
                role: "Medical Student",
                image: getAssetPath('photo placeholder.png'),
                quote: "As a student with limited income, SigmaPay has helped me stay on budget and even start saving. The group savings feature is a game-changer for shared expenses.",
                rating: 4
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 flex flex-col hover:shadow-2xl transition-shadow duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 200 + 200}ms` }}
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full mr-4 object-cover border-2 border-indigo-100 shadow-md"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill={i < testimonial.rating ? "currentColor" : "none"}
                      stroke={i < testimonial.rating ? "none" : "currentColor"}
                      strokeWidth="1"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 italic flex-grow">{testimonial.quote}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 animate-fade-in" style={{ animationDelay: '800ms' }}>
            <a
              href="#"
              onClick={(e) => handleAuthNavigation(e, '/signup')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition-transform duration-300 hover:scale-105 inline-flex items-center"
            >
              {isAuthenticated() ? 'Go to Dashboard' : 'Join Them Today'}
              <HiOutlineArrowNarrowRight className="ml-2" />
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-slide-up">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
              Got questions? We've got answers.
            </p>
          </div>

          <div className="max-w-4xl mx-auto divide-y divide-gray-200">
            {[
              {
                question: "How secure is SigmaPay?",
                answer: "SigmaPay uses bank-level 256-bit encryption and advanced security protocols to protect your data and financial information. We also offer two-factor authentication and biometric login options for added security."
              },
              {
                question: "Is there a fee to use SigmaPay?",
                answer: "SigmaPay offers a free basic plan with essential features. Premium plans with advanced features start at $4.99/month. We're transparent about our pricing with no hidden fees or charges."
              },
              {
                question: "How do I get started with SigmaPay?",
                answer: "Simply sign up for a free account, connect your bank accounts (optional), and start using our tools to manage your finances. Our setup wizard will guide you through the process in just a few minutes."
              },
              {
                question: "Can I use SigmaPay for my business?",
                answer: "Yes! SigmaPay offers business accounts with features specifically designed for small businesses and freelancers, including invoice management, expense tracking, and tax preparation tools."
              },
              {
                question: "How does the group savings feature work?",
                answer: "You can create or join savings groups with friends, family, or colleagues. Each member contributes to the group goal, and you can track progress together. Perfect for trips, gifts, or shared expenses."
              }
            ].map((faq, index) => (
              <div
                key={index}
                className="py-6 animate-fade-in"
                style={{ animationDelay: `${index * 150 + 300}ms` }}
              >
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <p className="text-gray-600 mt-3 group-open:animate-fade-in">{faq.answer}</p>
                </details>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 animate-fade-in" style={{ animationDelay: '1000ms' }}>
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <a href="#" className="text-indigo-600 font-medium hover:text-indigo-800 transition-all hover:underline">
              Contact our support team
            </a>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl shadow-xl p-8 md:p-12 mb-20 text-white text-center animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-slide-up">Ready to Take Control of Your Finances?</h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
            Join thousands of users who have transformed their financial lives with SigmaPay.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <a
              href="#"
              onClick={(e) => handleAuthNavigation(e, '/signup')}
              className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              {isAuthenticated() ? 'Go to Dashboard' : 'Get Started Free'}
            </a>
            <a
              href="#"
              onClick={(e) => handleAuthNavigation(e, isAuthenticated() ? '/dashboard' : '/login')}
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              {isAuthenticated() ? 'View Dashboard' : 'Login'}
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-t from-indigo-100 via-white to-white border-t border-indigo-200 pt-12 pb-8 shadow-inner">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-indigo-800 mb-4">SIGMAPAY</h2>
              <p className="text-gray-600 mb-4">
                Empowering your financial journey with innovation and trust.
              </p>
              <div className="flex space-x-4 text-indigo-700 text-xl">
                <a href="#" className="hover:text-indigo-500 transition" aria-label="Twitter">
                  <FaTwitter />
                </a>
                <a href="#" className="hover:text-indigo-500 transition" aria-label="Instagram">
                  <FaInstagram />
                </a>
                <a href="#" className="hover:text-indigo-500 transition" aria-label="LinkedIn">
                  <FaLinkedin />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-indigo-700 mb-4">Features</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link to="/budget" className="hover:text-indigo-500 transition">Budget Planner</Link></li>
                <li><Link to="/payments" className="hover:text-indigo-500 transition">Payments</Link></li>
                <li><Link to="/investments" className="hover:text-indigo-500 transition">Investments</Link></li>
                <li><Link to="/cards" className="hover:text-indigo-500 transition">Cards</Link></li>
                <li><Link to="/groups" className="hover:text-indigo-500 transition">Group Savings</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-indigo-700 mb-4">Company</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link to="/about" className="hover:text-indigo-500 transition">About Us</Link></li>
                <li><a href="#" className="hover:text-indigo-500 transition">Careers</a></li>
                <li><a href="#" className="hover:text-indigo-500 transition">Press</a></li>
                <li><a href="#" className="hover:text-indigo-500 transition">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-indigo-700 mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-indigo-500 transition">Help Center</a></li>
                <li><a href="#" className="hover:text-indigo-500 transition">Blog</a></li>
                <li><a href="#" className="hover:text-indigo-500 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-indigo-500 transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} SIGMAPAY. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-indigo-500 transition">Privacy Policy</a>
              <a href="#" className="hover:text-indigo-500 transition">Terms of Service</a>
              <a href="#" className="hover:text-indigo-500 transition">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
