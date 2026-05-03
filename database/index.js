'use strict';

/**
 * index.js — central export point for the SigmaPay database layer.
 *
 * Import this module in your application to get:
 *   - connectToAtlas / disconnectFromAtlas
 *   - All Mongoose models
 *   - All Repository singletons
 */

require('dotenv').config();

const { connectToAtlas, disconnectFromAtlas } = require('./config/database');

// Models
const UserAccount             = require('./models/UserAccount');
const Customer                = require('./models/Customer');
const Credential              = require('./models/Credential');
const Session                 = require('./models/Session');
const AuthEvent               = require('./models/AuthEvent');
const LoginActivity           = require('./models/LoginActivity');
const BudgetPlan              = require('./models/BudgetPlan');
const Transaction             = require('./models/Transaction');
const SpendingTrends          = require('./models/SpendingTrends');
const FinancialGoal           = require('./models/FinancialGoal');
const GoalProgress            = require('./models/GoalProgress');
const SavingsGroup            = require('./models/SavingsGroup');
const GroupMember             = require('./models/GroupMember');
const GroupContribution       = require('./models/GroupContribution');
const Report                  = require('./models/Report');
const PaymentMethod           = require('./models/PaymentMethod');
const PaymentTransaction      = require('./models/PaymentTransaction');
const Bill                    = require('./models/Bill');
const Notification            = require('./models/Notification');
const NotificationPreferences = require('./models/NotificationPreferences');

// Repositories
const AuthRepository          = require('./repositories/AuthRepository');
const AccountsRepository      = require('./repositories/AccountsRepository');
const BudgetRepository        = require('./repositories/BudgetRepository');
const GoalsRepository         = require('./repositories/GoalsRepository');
const GroupSavingsRepository  = require('./repositories/GroupSavingsRepository');
const ReportsRepository       = require('./repositories/ReportsRepository');
const PaymentsRepository      = require('./repositories/PaymentsRepository');
const NotificationsRepository = require('./repositories/NotificationsRepository');

module.exports = {
  // Connection helpers
  connectToAtlas,
  disconnectFromAtlas,

  // Models
  models: {
    UserAccount,
    Customer,
    Credential,
    Session,
    AuthEvent,
    LoginActivity,
    BudgetPlan,
    Transaction,
    SpendingTrends,
    FinancialGoal,
    GoalProgress,
    SavingsGroup,
    GroupMember,
    GroupContribution,
    Report,
    PaymentMethod,
    PaymentTransaction,
    Bill,
    Notification,
    NotificationPreferences,
  },

  // Repositories (singletons)
  repositories: {
    AuthRepository,
    AccountsRepository,
    BudgetRepository,
    GoalsRepository,
    GroupSavingsRepository,
    ReportsRepository,
    PaymentsRepository,
    NotificationsRepository,
  },
};
