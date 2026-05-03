// Hybrid API Client - Uses Supabase when available, falls back to REST API
import { isSupabaseConfigured } from '../utils/supabaseClient';
import supabaseService from './supabaseService';

const API_BASE_URL = 'http://localhost:3001/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

class ApiClient {
  private baseUrl: string;
  private useSupabase: boolean;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.useSupabase = isSupabaseConfigured();
  }

  private async request<T>(
    endpoint: string,
    method: string = 'GET',
    body?: any
  ): Promise<ApiResponse<T>> {
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, options);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return { success: false, message: 'Network error' };
    }
  }

  // ============================================
  // BUDGET API
  // ============================================

  async createBudget(userId: string, totalAmount: number, startDate: string, endDate: string, categories: string[]) {
    if (this.useSupabase) {
      try {
        const budget = await supabaseService.createBudget(userId, totalAmount, startDate, endDate, categories);
        return { success: true, budget, budgetId: budget.id };
      } catch (error: any) {
        return { success: false, message: error.message };
      }
    }
    return this.request('/budgets/create', 'POST', { userId, totalAmount, startDate, endDate, categories });
  }

  async getBudgets(userId: string, status?: string) {
    if (this.useSupabase) {
      try {
        const budgets = await supabaseService.getBudgets(userId, status);
        return { success: true, budgets };
      } catch (error: any) {
        return { success: false, message: error.message };
      }
    }
    return this.request(`/budgets/${userId}`, 'GET');
  }

  async recordExpense(userId: string, amount: number, category: string, date: string, paymentMethod: string, budgetId?: string) {
    if (this.useSupabase) {
      try {
        const expense = await supabaseService.recordExpense(userId, amount, category, date, paymentMethod, budgetId);
        return { success: true, expense };
      } catch (error: any) {
        return { success: false, message: error.message };
      }
    }
    return this.request('/budgets/expense', 'POST', { userId, amount, category, date, paymentMethod });
  }

  async getExpenses(userId: string, budgetId?: string) {
    if (this.useSupabase) {
      try {
        const expenses = await supabaseService.getExpenses(userId, budgetId);
        return { success: true, expenses };
      } catch (error: any) {
        return { success: false, message: error.message };
      }
    }
    return this.request(`/expenses/${userId}`, 'GET');
  }

  // ============================================
  // GOALS API
  // ============================================

  async createGoal(userId: string, goalType: string, targetAmount: number, deadline: string, priorityLevel: string, title?: string) {
    if (this.useSupabase) {
      try {
        const goal = await supabaseService.createGoal(userId, goalType, title || goalType, targetAmount, deadline, priorityLevel);
        return { success: true, goal, goalId: goal.id };
      } catch (error: any) {
        return { success: false, message: error.message };
      }
    }
    return this.request('/goals/create', 'POST', { userId, goalType, targetAmount, deadline, priorityLevel });
  }

  async getGoals(userId: string, status?: string) {
    if (this.useSupabase) {
      try {
        const goals = await supabaseService.getGoals(userId, status);
        return { success: true, goals };
      } catch (error: any) {
        return { success: false, message: error.message };
      }
    }
    return this.request(`/goals/${userId}`, 'GET');
  }

  async trackProgress(userId: string, goalId: string) {
    if (this.useSupabase) {
      try {
        const goal = await supabaseService.getGoal(goalId);
        const progress = {
          goalId: goal.id,
          targetAmount: goal.target_amount,
          currentAmount: goal.current_amount,
          percentage: (goal.current_amount / goal.target_amount) * 100,
          status: goal.status
        };
        return { success: true, progress };
      } catch (error: any) {
        return { success: false, message: error.message };
      }
    }
    return this.request(`/goals/${goalId}/progress?userId=${userId}`, 'GET');
  }

  async updateGoalProgress(goalId: string, currentAmount: number) {
    if (this.useSupabase) {
      try {
        const goal = await supabaseService.updateGoalProgress(goalId, currentAmount);
        return { success: true, goal };
      } catch (error: any) {
        return { success: false, message: error.message };
      }
    }
    return this.request(`/goals/${goalId}/progress`, 'PUT', { currentAmount });
  }

  // ============================================
  // PAYMENTS/TRANSACTIONS API
  // ============================================

  async processPayment(userId: string, methodId: string, amount: number, merchantId: string) {
    if (this.useSupabase) {
      try {
        const transaction = await supabaseService.createTransaction(
          userId,
          'payment',
          amount,
          undefined,
          merchantId,
          methodId,
          'Payment processed'
        );
        return { success: true, transaction };
      } catch (error: any) {
        return { success: false, message: error.message };
      }
    }
    return this.request('/payments/process', 'POST', { userId, methodId, amount, merchantId });
  }

  async getTransactions(userId: string, limit?: number) {
    if (this.useSupabase) {
      try {
        const transactions = await supabaseService.getTransactions(userId, limit);
        return { success: true, transactions };
      } catch (error: any) {
        return { success: false, message: error.message };
      }
    }
    return this.request(`/transactions/${userId}`, 'GET');
  }

  async requestRefund(userId: string, transactionId: string, amount: number, reason: string) {
    if (this.useSupabase) {
      try {
        const transaction = await supabaseService.updateTransactionStatus(transactionId, 'refunded');
        return { success: true, transaction };
      } catch (error: any) {
        return { success: false, message: error.message };
      }
    }
    return this.request('/payments/refund', 'POST', { userId, transactionId, amount, reason });
  }

  async verifyPaymentMethod(userId: string, methodId: string, CVV: string) {
    // This remains a REST call as it doesn't store data
    return this.request('/payments/verify', 'POST', { userId, methodId, CVV });
  }

  // ============================================
  // GROUP SAVINGS API
  // ============================================

  async createGroup(groupName: string, members: string[], userId?: string) {
    if (this.useSupabase && userId) {
      try {
        const group = await supabaseService.createGroup(userId, groupName);
        // Add members
        for (const memberId of members) {
          await supabaseService.addGroupMember(group.id, memberId);
        }
        return { success: true, group, groupId: group.id };
      } catch (error: any) {
        return { success: false, message: error.message };
      }
    }
    return this.request('/groups/create', 'POST', { groupName, members });
  }

  async getGroups(userId: string) {
    if (this.useSupabase) {
      try {
        const groups = await supabaseService.getGroups(userId);
        return { success: true, groups };
      } catch (error: any) {
        return { success: false, message: error.message };
      }
    }
    return this.request(`/groups/${userId}`, 'GET');
  }

  async addMemberToGroup(groupId: string, memberId: string) {
    if (this.useSupabase) {
      try {
        const member = await supabaseService.addGroupMember(groupId, memberId);
        return { success: true, member };
      } catch (error: any) {
        return { success: false, message: error.message };
      }
    }
    return this.request(`/groups/${groupId}/member`, 'POST', { memberId });
  }

  async processGroupDeposit(groupId: string, memberId: string, amount: number) {
    if (this.useSupabase) {
      try {
        const result = await supabaseService.updateGroupContribution(groupId, memberId, amount);
        return { success: true, ...result };
      } catch (error: any) {
        return { success: false, message: error.message };
      }
    }
    return this.request(`/groups/${groupId}/deposit`, 'POST', { memberId, amount });
  }

  async getGroupReport(groupId: string) {
    if (this.useSupabase) {
      try {
        const group = await supabaseService.getGroup(groupId);
        const members = await supabaseService.getGroupMembers(groupId);
        return { success: true, group, members, report: { group, members } };
      } catch (error: any) {
        return { success: false, message: error.message };
      }
    }
    return this.request(`/groups/${groupId}/report`, 'GET');
  }

  // ============================================
  // NOTIFICATIONS API
  // ============================================

  async getNotifications(userId: string) {
    if (this.useSupabase) {
      try {
        const notifications = await supabaseService.getNotifications(userId);
        return { success: true, notifications };
      } catch (error: any) {
        return { success: false, message: error.message };
      }
    }
    return this.request(`/notifications/${userId}`, 'GET');
  }

  async sendAlert(userId: string, message: string) {
    if (this.useSupabase) {
      try {
        const notification = await supabaseService.createNotification(userId, 'Alert', message, 'warning');
        return { success: true, notification };
      } catch (error: any) {
        return { success: false, message: error.message };
      }
    }
    return this.request('/notifications/alert', 'POST', { userId, message });
  }

  async setNotificationPreference(userId: string, preferenceType: string, isEnabled: boolean) {
    // This would be stored in user preferences - future enhancement
    return this.request('/notifications/preferences', 'POST', { userId, preferenceType, isEnabled });
  }

  async markNotificationAsRead(notificationId: string) {
    if (this.useSupabase) {
      try {
        const notification = await supabaseService.markNotificationAsRead(notificationId);
        return { success: true, notification };
      } catch (error: any) {
        return { success: false, message: error.message };
      }
    }
    return { success: false, message: 'Not implemented' };
  }

  // ============================================
  // REPORTS API
  // ============================================

  async generateMonthlySummary(userId: string) {
    if (this.useSupabase) {
      try {
        const now = new Date();
        const summary = await supabaseService.getMonthlySummary(userId, now.getFullYear(), now.getMonth() + 1);
        return { success: true, report: JSON.stringify(summary, null, 2) };
      } catch (error: any) {
        return { success: false, message: error.message };
      }
    }
    return this.request(`/reports/monthly/${userId}`, 'GET');
  }

  async generateIncomeStatement(userId: string) {
    if (this.useSupabase) {
      try {
        const transactions = await supabaseService.getTransactions(userId);
        const income = transactions.filter(t => t.transaction_type === 'deposit').reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions.filter(t => t.transaction_type === 'payment').reduce((sum, t) => sum + t.amount, 0);
        const statement = { income, expenses, net: income - expenses };
        return { success: true, statement: JSON.stringify(statement, null, 2) };
      } catch (error: any) {
        return { success: false, message: error.message };
      }
    }
    return this.request(`/reports/income/${userId}`, 'GET');
  }

  // ============================================
  // ACCOUNT/AUTH API (Kept for compatibility)
  // ============================================

  async register(username: string, email: string, password: string, phoneNumber: string) {
    return this.request('/accounts/register', 'POST', { username, email, password, phoneNumber });
  }

  async getAccount(userId: string) {
    return this.request(`/accounts/${userId}`, 'GET');
  }

  async updateAccount(userId: string, email: string, phoneNumber: string, address: string) {
    return this.request(`/accounts/${userId}`, 'PUT', { email, phoneNumber, address });
  }

  async deleteAccount(userId: string) {
    return this.request(`/accounts/${userId}`, 'DELETE');
  }

  async changeUsername(userId: string, newUsername: string) {
    return this.request(`/accounts/${userId}/username`, 'PUT', { newUsername });
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    return this.request(`/accounts/${userId}/password`, 'PUT', { oldPassword, newPassword });
  }

  async verifyIdentity(userId: string, verificationCode: string, method: string) {
    return this.request(`/accounts/${userId}/verify`, 'POST', { verificationCode, method });
  }
}

const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
