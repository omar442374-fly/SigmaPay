// Local storage keys
const GOALS_KEY = 'sigmapay_goals';
const GOAL_CONTRIBUTIONS_KEY = 'sigmapay_goal_contributions';

// Default goal types
export const GOAL_TYPES = [
  { id: 'savings', name: 'Savings', icon: '💰', color: '#4F46E5' },
  { id: 'emergency', name: 'Emergency Fund', icon: '🚨', color: '#EF4444' },
  { id: 'retirement', name: 'Retirement', icon: '🏖️', color: '#F59E0B' },
  { id: 'house', name: 'House', icon: '🏠', color: '#10B981' },
  { id: 'car', name: 'Car', icon: '🚗', color: '#0EA5E9' },
  { id: 'education', name: 'Education', icon: '📚', color: '#8B5CF6' },
  { id: 'vacation', name: 'Vacation', icon: '✈️', color: '#EC4899' },
  { id: 'wedding', name: 'Wedding', icon: '💍', color: '#F97316' },
  { id: 'debt', name: 'Debt Payoff', icon: '💳', color: '#7C3AED' },
  { id: 'other', name: 'Other', icon: '🎯', color: '#6B7280' }
];

// Get all goals for a user
export const getGoals = (userId) => {
  const allGoals = JSON.parse(localStorage.getItem(GOALS_KEY) || '{}');
  return allGoals[userId] || [];
};

// Create a new financial goal
export const createGoal = (userId, goal) => {
  const allGoals = JSON.parse(localStorage.getItem(GOALS_KEY) || '{}');
  const userGoals = allGoals[userId] || [];
  
  const newGoal = {
    id: Date.now().toString(),
    ...goal,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentAmount: goal.currentAmount || 0,
    status: 'active'
  };
  
  userGoals.push(newGoal);
  allGoals[userId] = userGoals;
  localStorage.setItem(GOALS_KEY, JSON.stringify(allGoals));
  return newGoal;
};

// Update an existing goal
export const updateGoal = (userId, goalId, updatedGoal) => {
  const allGoals = JSON.parse(localStorage.getItem(GOALS_KEY) || '{}');
  const userGoals = allGoals[userId] || [];
  
  const index = userGoals.findIndex(g => g.id === goalId);
  
  if (index === -1) {
    throw new Error('Goal not found');
  }
  
  userGoals[index] = {
    ...userGoals[index],
    ...updatedGoal,
    updatedAt: new Date().toISOString()
  };
  
  // Check if goal is completed
  if (userGoals[index].currentAmount >= userGoals[index].targetAmount) {
    userGoals[index].status = 'completed';
    userGoals[index].completedAt = new Date().toISOString();
  }
  
  allGoals[userId] = userGoals;
  localStorage.setItem(GOALS_KEY, JSON.stringify(allGoals));
  return userGoals[index];
};

// Delete a goal
export const deleteGoal = (userId, goalId) => {
  const allGoals = JSON.parse(localStorage.getItem(GOALS_KEY) || '{}');
  const userGoals = allGoals[userId] || [];
  
  const filteredGoals = userGoals.filter(g => g.id !== goalId);
  
  if (filteredGoals.length === userGoals.length) {
    throw new Error('Goal not found');
  }
  
  allGoals[userId] = filteredGoals;
  localStorage.setItem(GOALS_KEY, JSON.stringify(allGoals));
  return filteredGoals;
};

// Add a contribution to a goal
export const addContribution = (userId, goalId, contribution) => {
  const allContributions = JSON.parse(localStorage.getItem(GOAL_CONTRIBUTIONS_KEY) || '{}');
  const userContributions = allContributions[userId] || {};
  const goalContributions = userContributions[goalId] || [];
  
  const newContribution = {
    id: Date.now().toString(),
    ...contribution,
    date: contribution.date || new Date().toISOString(),
    createdAt: new Date().toISOString()
  };
  
  goalContributions.push(newContribution);
  userContributions[goalId] = goalContributions;
  allContributions[userId] = userContributions;
  localStorage.setItem(GOAL_CONTRIBUTIONS_KEY, JSON.stringify(allContributions));
  
  // Update goal current amount
  const allGoals = JSON.parse(localStorage.getItem(GOALS_KEY) || '{}');
  const userGoals = allGoals[userId] || [];
  const goalIndex = userGoals.findIndex(g => g.id === goalId);
  
  if (goalIndex !== -1) {
    userGoals[goalIndex].currentAmount = (userGoals[goalIndex].currentAmount || 0) + contribution.amount;
    
    // Check if goal is completed
    if (userGoals[goalIndex].currentAmount >= userGoals[goalIndex].targetAmount) {
      userGoals[goalIndex].status = 'completed';
      userGoals[goalIndex].completedAt = new Date().toISOString();
    }
    
    userGoals[goalIndex].updatedAt = new Date().toISOString();
    allGoals[userId] = userGoals;
    localStorage.setItem(GOALS_KEY, JSON.stringify(allGoals));
    
    return {
      contribution: newContribution,
      goal: userGoals[goalIndex],
      isCompleted: userGoals[goalIndex].status === 'completed'
    };
  }
  
  return { contribution: newContribution };
};

// Get all contributions for a goal
export const getContributions = (userId, goalId) => {
  const allContributions = JSON.parse(localStorage.getItem(GOAL_CONTRIBUTIONS_KEY) || '{}');
  const userContributions = allContributions[userId] || {};
  return userContributions[goalId] || [];
};

// Get goal progress
export const getGoalProgress = (userId, goalId) => {
  const goals = getGoals(userId);
  const goal = goals.find(g => g.id === goalId);
  
  if (!goal) {
    throw new Error('Goal not found');
  }
  
  const contributions = getContributions(userId, goalId);
  const totalContributed = contributions.reduce((sum, c) => sum + c.amount, 0);
  const percentage = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
  
  // Calculate time-based metrics
  const now = new Date();
  const startDate = new Date(goal.createdAt);
  const targetDate = goal.targetDate ? new Date(goal.targetDate) : null;
  
  let timeProgress = 0;
  let isOnTrack = true;
  let estimatedCompletionDate = null;
  
  if (targetDate) {
    const totalDuration = targetDate - startDate;
    const elapsedDuration = now - startDate;
    timeProgress = Math.min(100, (elapsedDuration / totalDuration) * 100);
    
    // Check if on track (percentage of goal should be >= percentage of time elapsed)
    isOnTrack = percentage >= timeProgress;
    
    // Estimate completion date based on current rate
    if (goal.currentAmount > 0 && goal.currentAmount < goal.targetAmount) {
      const dailyRate = goal.currentAmount / (elapsedDuration / (1000 * 60 * 60 * 24));
      const daysRemaining = (goal.targetAmount - goal.currentAmount) / dailyRate;
      estimatedCompletionDate = new Date(now.getTime() + (daysRemaining * 24 * 60 * 60 * 1000));
    }
  }
  
  return {
    ...goal,
    totalContributed,
    percentage,
    timeProgress,
    isOnTrack,
    estimatedCompletionDate,
    daysRemaining: targetDate ? Math.max(0, Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24))) : null,
    contributions
  };
};

// Get all goal progress for a user
export const getAllGoalProgress = (userId) => {
  const goals = getGoals(userId);
  return goals.map(goal => getGoalProgress(userId, goal.id));
};

// Generate AI recommendations for goals
export const generateGoalRecommendations = (userId) => {
  const goals = getAllGoalProgress(userId);
  const recommendations = [];
  
  // Check for goals that are behind schedule
  const behindGoals = goals.filter(goal => goal.targetDate && !goal.isOnTrack && goal.status === 'active');
  
  behindGoals.forEach(goal => {
    const targetDate = new Date(goal.targetDate);
    const now = new Date();
    const monthsRemaining = (targetDate.getFullYear() - now.getFullYear()) * 12 + (targetDate.getMonth() - now.getMonth());
    
    if (monthsRemaining > 0) {
      const requiredMonthlyContribution = (goal.targetAmount - goal.currentAmount) / monthsRemaining;
      
      recommendations.push({
        type: 'increase_contributions',
        goalId: goal.id,
        goalName: goal.name,
        message: `You're behind on your "${goal.name}" goal. Consider increasing your monthly contribution to $${requiredMonthlyContribution.toFixed(2)} to reach your target by ${targetDate.toLocaleDateString()}.`
      });
    } else {
      recommendations.push({
        type: 'extend_deadline',
        goalId: goal.id,
        goalName: goal.name,
        message: `Your "${goal.name}" goal deadline is approaching, but you're only ${goal.percentage.toFixed(0)}% there. Consider extending your deadline or adjusting your target amount.`
      });
    }
  });
  
  // Check for completed goals
  const completedGoals = goals.filter(goal => goal.status === 'completed');
  
  if (completedGoals.length > 0) {
    recommendations.push({
      type: 'new_goal',
      message: `You've completed ${completedGoals.length} goal(s)! Consider setting a new financial goal to continue building your wealth.`
    });
  }
  
  // Check for goals with no recent contributions
  const now = new Date();
  goals.forEach(goal => {
    if (goal.status === 'active' && goal.contributions.length > 0) {
      const lastContribution = new Date(goal.contributions[goal.contributions.length - 1].date);
      const daysSinceLastContribution = Math.floor((now - lastContribution) / (1000 * 60 * 60 * 24));
      
      if (daysSinceLastContribution > 30) {
        recommendations.push({
          type: 'reminder',
          goalId: goal.id,
          goalName: goal.name,
          message: `It's been ${daysSinceLastContribution} days since your last contribution to "${goal.name}". Consider making a contribution to stay on track.`
        });
      }
    }
  });
  
  return recommendations;
};
