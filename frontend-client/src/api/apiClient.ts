// API Client for communicating with the backend
const API_BASE_URL = 'http://localhost:3001/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
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
      console.error('API request failed:', error); // TODO: Replace with proper logging service in production
      return { success: false, message: 'Network error' };
    }
  }

  // Auth API
  async register(username: string, email: string, password: string, phoneNumber: string) {
    return this.request('/accounts/register', 'POST', { username, email, password, phoneNumber });
  }

  async getAccount(userId: string) {
    return this.request(`/accounts/${userId}`, 'GET');
  }

  // Budget API
  async createBudget(userId: string, totalAmount: number, startDate: string, endDate: string, categories: string[]) {
    return this.request('/budgets/create', 'POST', { userId, totalAmount, startDate, endDate, categories });
  }

  async recordExpense(userId: string, amount: number, category: string, date: string, paymentMethod: string) {
    return this.request('/budgets/expense', 'POST', { userId, amount, category, date, paymentMethod });
  }

  // Goals API
  async createGoal(userId: string, goalType: string, targetAmount: number, deadline: string, priorityLevel: string) {
    return this.request('/goals/create', 'POST', { userId, goalType, targetAmount, deadline, priorityLevel });
  }

  async trackProgress(userId: string, goalId: string) {
    return this.request(`/goals/${goalId}/progress?userId=${userId}`, 'GET');
  }

  // Reports API
  async generateMonthlySummary(userId: string) {
    return this.request(`/reports/monthly/${userId}`, 'GET');
  }

  async generateIncomeStatement(userId: string) {
    return this.request(`/reports/income/${userId}`, 'GET');
  }

  // Payments API
  async processPayment(userId: string, methodId: string, amount: number, merchantId: string) {
    return this.request('/payments/process', 'POST', { userId, methodId, amount, merchantId });
  }

  // Notifications API
  async getNotifications(userId: string) {
    return this.request(`/notifications/${userId}`, 'GET');
  }
}

const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
