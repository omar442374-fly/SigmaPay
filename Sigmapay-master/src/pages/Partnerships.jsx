import { useState } from 'react';
import {
  ShoppingBagIcon,
  StarIcon,
  ShareIcon,
  TagIcon,
  FunnelIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline';
import { getAssetPath } from '../utils/assets';

function Partnerships() {
  const [activeTab, setActiveTab] = useState('offers');
  const [selectedCategories, setSelectedCategories] = useState(['all']);
  const [searchQuery, setSearchQuery] = useState('');

  const [offers] = useState([
    {
      id: 1,
      title: '20% Off at Amazon',
      description: 'Get 20% off on your next purchase at Amazon when you use your SigmaPay card.',
      merchant: 'Amazon',
      category: 'shopping',
      discount: '20%',
      expiryDate: '2024-06-30',
      code: 'SIGMAPAY20',
      image: getAssetPath('offer.jpg'),
      featured: true,
      rating: 4.5,
      reviews: 128,
      saved: false
    },
    {
      id: 2,
      title: '$15 Off Uber Rides',
      description: 'Enjoy $15 off your next 3 Uber rides when you pay with your SigmaPay card.',
      merchant: 'Uber',
      category: 'transportation',
      discount: '$15',
      expiryDate: '2024-06-15',
      code: 'SIGMARIDE15',
      image: getAssetPath('offer.jpg'),
      featured: true,
      rating: 4.2,
      reviews: 95,
      saved: true
    },
    {
      id: 3,
      title: '10% Cashback on Groceries',
      description: 'Earn 10% cashback on all grocery purchases at participating stores.',
      merchant: 'Various Grocery Stores',
      category: 'groceries',
      discount: '10% Cashback',
      expiryDate: '2024-07-31',
      code: 'AUTOMATIC',
      image: getAssetPath('offer.jpg'),
      featured: false,
      rating: 4.8,
      reviews: 210,
      saved: false
    },
    {
      id: 4,
      title: 'Free Delivery on DoorDash',
      description: 'Get free delivery on your next 5 DoorDash orders over $15.',
      merchant: 'DoorDash',
      category: 'food',
      discount: 'Free Delivery',
      expiryDate: '2024-06-20',
      code: 'SIGMADASH',
      image: getAssetPath('offer.jpg'),
      featured: false,
      rating: 4.0,
      reviews: 75,
      saved: true
    },
    {
      id: 5,
      title: '15% Off at Nike',
      description: 'Enjoy 15% off on all Nike products online and in-store.',
      merchant: 'Nike',
      category: 'shopping',
      discount: '15%',
      expiryDate: '2024-07-15',
      code: 'SIGMANIKE15',
      image: getAssetPath('offer.jpg'),
      featured: false,
      rating: 4.3,
      reviews: 112,
      saved: false
    },
    {
      id: 6,
      title: '5% Extra Cashback on Travel',
      description: 'Earn an additional 5% cashback on all travel bookings made with your SigmaPay card.',
      merchant: 'Various Travel Partners',
      category: 'travel',
      discount: '5% Extra Cashback',
      expiryDate: '2024-08-31',
      code: 'AUTOMATIC',
      image: getAssetPath('offer.jpg'),
      featured: true,
      rating: 4.7,
      reviews: 189,
      saved: false
    }
  ]);

  const [savedOffers] = useState([
    {
      id: 2,
      title: '$15 Off Uber Rides',
      description: 'Enjoy $15 off your next 3 Uber rides when you pay with your SigmaPay card.',
      merchant: 'Uber',
      category: 'transportation',
      discount: '$15',
      expiryDate: '2024-06-15',
      code: 'SIGMARIDE15',
      image: getAssetPath('offer.jpg'),
      featured: true,
      rating: 4.2,
      reviews: 95,
      saved: true,
      usedCount: 1,
      remainingUses: 2
    },
    {
      id: 4,
      title: 'Free Delivery on DoorDash',
      description: 'Get free delivery on your next 5 DoorDash orders over $15.',
      merchant: 'DoorDash',
      category: 'food',
      discount: 'Free Delivery',
      expiryDate: '2024-06-20',
      code: 'SIGMADASH',
      image: getAssetPath('offer.jpg'),
      featured: false,
      rating: 4.0,
      reviews: 75,
      saved: true,
      usedCount: 2,
      remainingUses: 3
    }
  ]);

  const [redeemHistory] = useState([
    {
      id: 101,
      offerTitle: '20% Off at Amazon',
      merchant: 'Amazon',
      redeemDate: '2024-04-25',
      savings: 15.99,
      transactionAmount: 79.95
    },
    {
      id: 102,
      offerTitle: '$15 Off Uber Rides',
      merchant: 'Uber',
      redeemDate: '2024-04-20',
      savings: 15.00,
      transactionAmount: 22.50
    },
    {
      id: 103,
      offerTitle: 'Free Delivery on DoorDash',
      merchant: 'DoorDash',
      redeemDate: '2024-04-18',
      savings: 4.99,
      transactionAmount: 35.75
    },
    {
      id: 104,
      offerTitle: 'Free Delivery on DoorDash',
      merchant: 'DoorDash',
      redeemDate: '2024-04-10',
      savings: 4.99,
      transactionAmount: 28.50
    },
    {
      id: 105,
      offerTitle: '10% Cashback on Groceries',
      merchant: 'Whole Foods',
      redeemDate: '2024-04-05',
      savings: 12.35,
      transactionAmount: 123.50
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'shopping', name: 'Shopping' },
    { id: 'food', name: 'Food & Dining' },
    { id: 'travel', name: 'Travel' },
    { id: 'transportation', name: 'Transportation' },
    { id: 'groceries', name: 'Groceries' },
    { id: 'entertainment', name: 'Entertainment' }
  ];

  const toggleCategory = (categoryId) => {
    if (categoryId === 'all') {
      setSelectedCategories(['all']);
      return;
    }

    const newSelectedCategories = selectedCategories.filter(id => id !== 'all');

    if (newSelectedCategories.includes(categoryId)) {
      const filtered = newSelectedCategories.filter(id => id !== categoryId);
      setSelectedCategories(filtered.length === 0 ? ['all'] : filtered);
    } else {
      setSelectedCategories([...newSelectedCategories, categoryId]);
    }
  };

  const filteredOffers = offers.filter(offer => {
    // Filter by search query
    if (searchQuery && !offer.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !offer.merchant.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Filter by category
    if (selectedCategories.includes('all')) {
      return true;
    }

    return selectedCategories.includes(offer.category);
  });

  const totalSavings = redeemHistory.reduce((sum, item) => sum + item.savings, 0);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'offers':
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search offers..."
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <div className="flex items-center space-x-2 overflow-x-auto pb-2 w-full md:w-auto">
                <FunnelIcon className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-500">Filter:</span>
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`px-3 py-1 text-xs rounded-full ${selectedCategories.includes(category.id)
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                      }`}
                    onClick={() => toggleCategory(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {filteredOffers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOffers.map((offer) => (
                  <div key={offer.id} className="card hover:shadow-md transition-shadow">
                    <div className="relative">
                      <img
                        src={offer.image}
                        alt={offer.merchant}
                        className="w-full h-40 object-cover rounded-t-lg"
                      />
                      {offer.featured && (
                        <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                          Featured
                        </span>
                      )}
                      <span className="absolute top-2 right-2 bg-white/90 text-gray-800 text-xs px-2 py-1 rounded-full">
                        Expires: {new Date(offer.expiryDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-lg">{offer.title}</h4>
                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                          {offer.discount}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mt-1">{offer.merchant}</p>
                      <p className="mt-2 text-gray-700 text-sm">{offer.description}</p>

                      <div className="mt-3 flex items-center">
                        <div className="flex text-yellow-400">
                          {'★'.repeat(Math.floor(offer.rating))}
                          {'☆'.repeat(5 - Math.floor(offer.rating))}
                        </div>
                        <span className="ml-1 text-xs text-gray-500">({offer.reviews})</span>
                      </div>

                      <div className="mt-4 flex justify-between items-center">
                        <div>
                          <p className="text-xs text-gray-500">Promo Code:</p>
                          <div className="flex items-center mt-1">
                            <span className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                              {offer.code}
                            </span>
                            <button className="ml-2 text-indigo-600 hover:text-indigo-800">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <button className="btn-primary text-sm">
                          {offer.saved ? 'Saved' : 'Save Offer'}
                        </button>
                      </div>

                      <div className="mt-3 pt-3 border-t flex justify-between text-xs text-gray-500">
                        <button className="flex items-center hover:text-indigo-600">
                          <ShareIcon className="h-4 w-4 mr-1" />
                          Share
                        </button>
                        <button className="flex items-center hover:text-indigo-600">
                          <StarIcon className="h-4 w-4 mr-1" />
                          Rate
                        </button>
                        <button className="flex items-center hover:text-indigo-600">
                          <BellAlertIcon className="h-4 w-4 mr-1" />
                          Notify
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card flex flex-col items-center justify-center py-12">
                <ShoppingBagIcon className="h-16 w-16 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No offers found</h3>
                <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        );

      case 'saved':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Saved Offers</h3>

            {savedOffers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedOffers.map((offer) => (
                  <div key={offer.id} className="card hover:shadow-md transition-shadow">
                    <div className="relative">
                      <img
                        src={offer.image}
                        alt={offer.merchant}
                        className="w-full h-40 object-cover rounded-t-lg"
                      />
                      <span className="absolute top-2 right-2 bg-white/90 text-gray-800 text-xs px-2 py-1 rounded-full">
                        Expires: {new Date(offer.expiryDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-lg">{offer.title}</h4>
                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                          {offer.discount}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mt-1">{offer.merchant}</p>

                      <div className="mt-3 bg-indigo-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-xs text-gray-500">Usage</p>
                            <p className="text-sm font-medium">
                              Used {offer.usedCount} of {offer.usedCount + offer.remainingUses} times
                            </p>
                          </div>
                          <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-600 rounded-full"
                              style={{ width: `${(offer.usedCount / (offer.usedCount + offer.remainingUses)) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-between items-center">
                        <div>
                          <p className="text-xs text-gray-500">Promo Code:</p>
                          <div className="flex items-center mt-1">
                            <span className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                              {offer.code}
                            </span>
                            <button className="ml-2 text-indigo-600 hover:text-indigo-800">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <button className="btn-primary text-sm">
                          Use Now
                        </button>
                      </div>

                      <div className="mt-3 pt-3 border-t flex justify-between text-xs text-gray-500">
                        <button className="flex items-center hover:text-indigo-600">
                          <ShareIcon className="h-4 w-4 mr-1" />
                          Share
                        </button>
                        <button className="flex items-center hover:text-red-600">
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card flex flex-col items-center justify-center py-12">
                <TagIcon className="h-16 w-16 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No saved offers</h3>
                <p className="mt-1 text-gray-500">Browse available offers and save them for later use.</p>
                <button
                  className="mt-4 btn-primary"
                  onClick={() => setActiveTab('offers')}
                >
                  Browse Offers
                </button>
              </div>
            )}
          </div>
        );

      case 'history':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">Redemption History</h3>
                <p className="text-gray-600">Total savings: ${totalSavings.toFixed(2)}</p>
              </div>
              <select className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm">
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>Last 6 Months</option>
                <option>This Year</option>
              </select>
            </div>

            <div className="card">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merchant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Savings</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {redeemHistory.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.offerTitle}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.merchant}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(item.redeemDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${item.transactionAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                          ${item.savings.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900">Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-gray-500">Showing 5 of 12 redemptions</p>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border rounded text-sm">Previous</button>
                  <button className="px-3 py-1 border rounded bg-indigo-50 text-indigo-600 text-sm">1</button>
                  <button className="px-3 py-1 border rounded text-sm">2</button>
                  <button className="px-3 py-1 border rounded text-sm">3</button>
                  <button className="px-3 py-1 border rounded text-sm">Next</button>
                </div>
              </div>
            </div>

            <div className="card">
              <h4 className="font-semibold mb-4">Savings Overview</h4>
              <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                <ChartBarIcon className="h-16 w-16 text-gray-400" />
                <p className="ml-4 text-gray-500">Savings chart by category will be displayed here</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Partnerships & Offers</h1>
        <p className="mt-2 text-gray-600">Discover exclusive deals and discounts from our partners.</p>
      </div>

      <div className="mb-6">
        <nav className="flex space-x-4 overflow-x-auto pb-2">
          <button
            className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'offers' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('offers')}
          >
            Available Offers
          </button>
          <button
            className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'saved' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('saved')}
          >
            Saved Offers
          </button>
          <button
            className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'history' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('history')}
          >
            Redemption History
          </button>
        </nav>
      </div>

      {renderTabContent()}
    </div>
  );
}

export default Partnerships;
