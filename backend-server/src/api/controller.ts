import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  IAccountService,
  IBudgetService,
  IGoalService,
  IGroupSavingsService,
  IPaymentsServiceBL,
  IReportingService,
  INotificationServiceBL,
} from '../domain/serviceInterfaces';
import {
  IUserAccount,
  IAccount,
  IBudgetPlan,
  IFinancialGoal,
  IGroupSavings,
  IPayment,
  IMoney,
} from '../domain/entities';

// Controller class implementing all controller interfaces from UML
export class Controller {
  constructor(
    private accountService: IAccountService,
    private budgetService: IBudgetService,
    private goalService: IGoalService,
    private groupSavingsService: IGroupSavingsService,
    private paymentsService: IPaymentsServiceBL,
    private reportingService: IReportingService,
    private notificationService: INotificationServiceBL
  ) {}

  // IControllerAuth methods
  ctlCreateAccount(username: string, email: string, password: string, phoneNumber: string): boolean {
    try {
      const userId = uuidv4();
      const userAccount: IUserAccount = {
        userId,
        credentials: {
          username,
          passwordHash: password, // In production, hash this!
        },
        profile: {
          email,
          phone: phoneNumber,
        },
        securitySettings: {
          twoFactorEnabled: false,
          accountStatus: 'Active',
        },
      };

      const account: IAccount = {
        accountId: uuidv4(),
        userId,
        balance: { amount: 0, currency: { code: 'USD', symbol: '$', exchangeRate: 1 } },
      };

      this.accountService.createAccount(account);
      // Note: In a real implementation, we'd save the user via a user service
      return true;
    } catch (error) {
      console.error('Error creating account:', error);
      return false;
    }
  }

  ctlGetAccountDetails(userId: string): IUserAccount | null {
    return this.accountService.getUserAccount(userId);
  }

  // IControllerBudget methods
  ctlCreateBudget(
    userId: string,
    totalAmount: number,
    startDate: string,
    endDate: string,
    categories: string[]
  ): IBudgetPlan | null {
    try {
      const budget: IBudgetPlan = {
        budgetId: uuidv4(),
        userId,
        totalAmount: { amount: totalAmount, currency: { code: 'USD', symbol: '$', exchangeRate: 1 } },
        startDate,
        endDate,
        categories,
        spent: 0,
      };
      const budgetId = this.budgetService.createBudget(budget);
      return this.budgetService.getBudget(budgetId);
    } catch (error) {
      console.error('Error creating budget:', error);
      return null;
    }
  }

  ctlRecordExpense(
    userId: string,
    amount: number,
    category: string,
    date: string,
    paymentMethod: string
  ): boolean {
    return this.budgetService.recordExpense(userId, amount, category);
  }

  ctlSendBudgetAlert(userId: string, alertType: string, message: string): boolean {
    return this.notificationService.sendAlert(userId, `[${alertType}] ${message}`);
  }

  // IControllerGoals methods
  ctlSetGoal(
    userId: string,
    goalType: string,
    targetAmount: number,
    deadline: string,
    priorityLevel: string
  ): IFinancialGoal | null {
    try {
      const goal: IFinancialGoal = {
        goalId: uuidv4(),
        userId,
        goalType,
        targetAmount: { amount: targetAmount, currency: { code: 'USD', symbol: '$', exchangeRate: 1 } },
        currentAmount: { amount: 0, currency: { code: 'USD', symbol: '$', exchangeRate: 1 } },
        deadline,
        priorityLevel,
        state: 'Active',
      };
      const goalId = this.goalService.createGoal(goal);
      return goal;
    } catch (error) {
      console.error('Error setting goal:', error);
      return null;
    }
  }

  ctlTrackProgress(userId: string, goalId: string, detailed: boolean) {
    return this.goalService.trackProgress(goalId);
  }

  ctlGetOptimizedGoalPlan(userId: string, financialData: string, timeFrame: number, riskSensitive: boolean) {
    // Mock AI recommendation
    return {
      recommendationId: uuidv4(),
      userId,
      goalId: 'mock-goal-id',
      suggestions: ['Increase monthly savings by 10%', 'Reduce discretionary spending'],
      estimatedCompletion: new Date(Date.now() + timeFrame * 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  // IControllerGroupSavings methods
  ctlCreateGroup(groupName: string, members: string[]): IGroupSavings | null {
    try {
      const group: IGroupSavings = {
        groupId: uuidv4(),
        groupName,
        targetAmount: { amount: 0, currency: { code: 'USD', symbol: '$', exchangeRate: 1 } },
        currentAmount: { amount: 0, currency: { code: 'USD', symbol: '$', exchangeRate: 1 } },
        members,
      };
      const groupId = this.groupSavingsService.createGroup(group);
      return group;
    } catch (error) {
      console.error('Error creating group:', error);
      return null;
    }
  }

  ctlAddMember(groupId: string, memberId: string): boolean {
    try {
      this.groupSavingsService.joinGroup(groupId, memberId);
      return true;
    } catch (error) {
      return false;
    }
  }

  ctlProcessDeposit(groupId: string, memberId: string, amount: number): boolean {
    try {
      this.groupSavingsService.contribute(groupId, memberId, amount);
      return true;
    } catch (error) {
      return false;
    }
  }

  ctlGenerateGroupReport(groupId: string): string {
    return this.groupSavingsService.generateGroupReport(groupId);
  }

  // IControllerReports methods
  ctlGenerateIncomeStatement(userId: string): string {
    return this.reportingService.generateIncomeStatement(userId);
  }

  ctlGenerateMonthlySummary(userId: string): string {
    return this.reportingService.generateMonthlySummary(userId);
  }

  ctlExportToPDF(reportType: string): boolean {
    // Mock implementation
    return true;
  }

  // IControllerPayments methods
  ctlProcessPayment(userId: string, methodId: string, amount: number, merchantId: string): boolean {
    try {
      const payment: IPayment = {
        paymentId: uuidv4(),
        userId,
        amount: { amount, currency: { code: 'USD', symbol: '$', exchangeRate: 1 } },
        methodId,
        merchantId,
        state: 'Pending',
        timestamp: new Date().toISOString(),
      };
      const result = this.paymentsService.processPayment(payment);
      return result.success;
    } catch (error) {
      return false;
    }
  }

  ctlRequestRefund(userId: string, transactionId: string, amount: number, reason: string): boolean {
    try {
      const result = this.paymentsService.refundPayment(transactionId);
      return result.success;
    } catch (error) {
      return false;
    }
  }

  ctlVerifyPaymentMethod(userId: string, methodId: string, CVV: string): boolean {
    // Mock verification
    return CVV.length === 3;
  }

  // IControllerNotifications methods
  ctlSendAlert(userId: string, message: string): boolean {
    return this.notificationService.sendAlert(userId, message);
  }

  ctlSetNotificationPreference(userId: string, preferenceType: string, isEnabled: boolean): boolean {
    // Mock implementation
    return true;
  }

  ctlGetNotificationHistory(userId: string) {
    return this.notificationService.getNotifications(userId);
  }
}

// Create Express router with all endpoints
export function createApiRouter(controller: Controller): Router {
  const router = Router();

  // Auth endpoints
  router.post('/accounts/register', (req: Request, res: Response) => {
    const { username, email, password, phoneNumber } = req.body;
    const result = controller.ctlCreateAccount(username, email, password, phoneNumber);
    res.json({ success: result, message: result ? 'Account created successfully' : 'Failed to create account' });
  });

  router.get('/accounts/:userId', (req: Request, res: Response) => {
    const { userId } = req.params;
    const account = controller.ctlGetAccountDetails(userId);
    if (account) {
      res.json({ success: true, account });
    } else {
      res.status(404).json({ success: false, message: 'Account not found' });
    }
  });

  // Budget endpoints
  router.post('/budgets/create', (req: Request, res: Response) => {
    const { userId, totalAmount, startDate, endDate, categories } = req.body;
    const budget = controller.ctlCreateBudget(userId, totalAmount, startDate, endDate, categories);
    res.json({ success: !!budget, budget });
  });

  router.post('/budgets/expense', (req: Request, res: Response) => {
    const { userId, amount, category, date, paymentMethod } = req.body;
    const result = controller.ctlRecordExpense(userId, amount, category, date, paymentMethod);
    res.json({ success: result });
  });

  // Goals endpoints
  router.post('/goals/create', (req: Request, res: Response) => {
    const { userId, goalType, targetAmount, deadline, priorityLevel } = req.body;
    const goal = controller.ctlSetGoal(userId, goalType, targetAmount, deadline, priorityLevel);
    res.json({ success: !!goal, goal });
  });

  router.get('/goals/:goalId/progress', (req: Request, res: Response) => {
    const { goalId } = req.params;
    const { userId } = req.query;
    const progress = controller.ctlTrackProgress(userId as string, goalId, true);
    res.json({ success: !!progress, progress });
  });

  // Group Savings endpoints
  router.post('/groups/create', (req: Request, res: Response) => {
    const { groupName, members } = req.body;
    const group = controller.ctlCreateGroup(groupName, members);
    res.json({ success: !!group, group });
  });

  router.post('/groups/:groupId/deposit', (req: Request, res: Response) => {
    const { groupId } = req.params;
    const { memberId, amount } = req.body;
    const result = controller.ctlProcessDeposit(groupId, memberId, amount);
    res.json({ success: result });
  });

  // Reports endpoints
  router.get('/reports/income/:userId', (req: Request, res: Response) => {
    const { userId } = req.params;
    const report = controller.ctlGenerateIncomeStatement(userId);
    res.json({ success: true, report });
  });

  router.get('/reports/monthly/:userId', (req: Request, res: Response) => {
    const { userId } = req.params;
    const report = controller.ctlGenerateMonthlySummary(userId);
    res.json({ success: true, report });
  });

  // Payment endpoints
  router.post('/payments/process', (req: Request, res: Response) => {
    const { userId, methodId, amount, merchantId } = req.body;
    const result = controller.ctlProcessPayment(userId, methodId, amount, merchantId);
    res.json({ success: result });
  });

  router.post('/payments/refund', (req: Request, res: Response) => {
    const { userId, transactionId, amount, reason } = req.body;
    const result = controller.ctlRequestRefund(userId, transactionId, amount, reason);
    res.json({ success: result });
  });

  // Notifications endpoints
  router.post('/notifications/alert', (req: Request, res: Response) => {
    const { userId, message } = req.body;
    const result = controller.ctlSendAlert(userId, message);
    res.json({ success: result });
  });

  router.get('/notifications/:userId', (req: Request, res: Response) => {
    const { userId } = req.params;
    const notifications = controller.ctlGetNotificationHistory(userId);
    res.json({ success: true, notifications });
  });

  return router;
}
