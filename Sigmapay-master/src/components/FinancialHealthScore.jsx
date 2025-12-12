import { useFinance } from '../contexts/FinanceContext';

function FinancialHealthScore() {
  const { financialHealthScore, loading } = useFinance();

  // Determine score color and label
  const getScoreDetails = (score) => {
    if (score >= 90) {
      return {
        label: 'Excellent',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        description: 'Your financial health is excellent! Keep up the great work and continue building wealth.'
      };
    } else if (score >= 75) {
      return {
        label: 'Very Good',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        description: 'Your financial health is very good. You\'re on the right track to achieving your financial goals.'
      };
    } else if (score >= 60) {
      return {
        label: 'Good',
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-100',
        description: 'Your financial health is good. There are a few areas where you could improve to strengthen your finances.'
      };
    } else if (score >= 40) {
      return {
        label: 'Fair',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        description: 'Your financial health is fair. Consider adjusting your budget and savings to improve your score.'
      };
    } else if (score >= 20) {
      return {
        label: 'Needs Improvement',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        description: 'Your financial health needs improvement. Focus on building emergency savings and reducing expenses.'
      };
    } else {
      return {
        label: 'Poor',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        description: 'Your financial health is at risk. Consider seeking financial advice to improve your situation.'
      };
    }
  };

  // Get improvement tips based on score
  const getImprovementTips = (score) => {
    const tips = [];

    if (score < 90) {
      tips.push('Set up automatic transfers to your savings account');
    }

    if (score < 80) {
      tips.push('Track your expenses to identify areas where you can cut back');
    }

    if (score < 70) {
      tips.push('Create a budget and stick to it');
    }

    if (score < 60) {
      tips.push('Build an emergency fund of 3-6 months of expenses');
    }

    if (score < 50) {
      tips.push('Pay down high-interest debt');
    }

    if (score < 40) {
      tips.push('Increase your income through side hustles or career advancement');
    }

    if (score < 30) {
      tips.push('Reduce unnecessary expenses and focus on essential needs');
    }

    return tips.length > 0 ? tips : ['Continue your good financial habits and consider increasing your investments'];
  };

  const scoreDetails = getScoreDetails(financialHealthScore);
  const improvementTips = getImprovementTips(financialHealthScore);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Financial Health Score</h2>
        <div className="flex justify-center py-3">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-3">Financial Health Score</h2>

      <div className="flex flex-col md:flex-row items-center mb-6">
        <div className="w-full md:w-1/3 flex justify-center mb-4 md:mb-0">
          <div className={`relative w-40 h-40 rounded-full flex items-center justify-center ${scoreDetails.bgColor} border-4 ${scoreDetails.color.replace('text', 'border')}`}>
            <div className="text-center">
              <div className={`text-4xl font-bold ${scoreDetails.color}`}>{financialHealthScore}</div>
              <div className={`text-sm font-medium ${scoreDetails.color}`}>{scoreDetails.label}</div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-2/3 md:pl-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Your Financial Health</h3>
          <p className="text-gray-600 mb-4">{scoreDetails.description}</p>

          <h4 className="font-medium text-gray-800 mb-2">Improvement Tips:</h4>
          <ul className="list-disc pl-5 text-gray-600 space-y-1">
            {improvementTips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-2">How Your Score is Calculated</h3>
        <p className="text-gray-600 mb-3">
          Your financial health score is based on several factors:
        </p>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Income Level</span>
            <span className="text-gray-500">20%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Savings Ratio</span>
            <span className="text-gray-500">30%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Budget Adherence</span>
            <span className="text-gray-500">30%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Financial Goals</span>
            <span className="text-gray-500">20%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinancialHealthScore;
