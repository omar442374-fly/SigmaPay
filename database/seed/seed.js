'use strict';

/**
 * seed.js — Populates a fresh SigmaPay Atlas database with sample data.
 *
 * Usage:
 *   node seed/seed.js
 *
 * Requires a valid MONGODB_URI in .env (copy .env.example → .env first).
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const { connectToAtlas, disconnectFromAtlas } = require('../config/database');

const AuthRepo          = require('../repositories/AuthRepository');
const AccountsRepo      = require('../repositories/AccountsRepository');
const BudgetRepo        = require('../repositories/BudgetRepository');
const GoalsRepo         = require('../repositories/GoalsRepository');
const GroupSavingsRepo  = require('../repositories/GroupSavingsRepository');
const ReportsRepo       = require('../repositories/ReportsRepository');
const PaymentsRepo      = require('../repositories/PaymentsRepository');
const NotifRepo         = require('../repositories/NotificationsRepository');

const mongoose = require('mongoose');

async function clearCollections() {
  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  for (const col of collections) {
    await db.collection(col.name).deleteMany({});
  }
  console.log('🗑  Cleared all collections.');
}

async function seed() {
  await connectToAtlas();
  await clearCollections();

  // ── 1. Users ──────────────────────────────────────────────────────────────
  const user1Id = await AccountsRepo.createAccount(
    'ammar_ahmed',
    'ammar.ahmed@example.com',
    '+201001234567',
    '$2b$10$hashedpassword1',
    { fullName: 'Ammar Mahmoud', nationalId: '29901010123456' }
  );

  const user2Id = await AccountsRepo.createAccount(
    'omar_morsi',
    'omar.morsi@example.com',
    '+201007654321',
    '$2b$10$hashedpassword2',
    { fullName: 'Omar Ali Morsi', nationalId: '29905050654321' }
  );

  console.log(`✅ Created users: ${user1Id}, ${user2Id}`);

  // ── 2. Auth events & login activity ───────────────────────────────────────
  await AuthRepo.logAuthEvent(user1Id, 'login', 'Initial login from web', new Date());
  await AuthRepo.recordLoginActivity(user1Id, 'success', 'Chrome/Windows', '197.60.1.1');
  await AuthRepo.logAuthEvent(user2Id, 'login', 'Mobile app login', new Date());

  console.log('✅ Auth events logged.');

  // ── 3. Budget plans ────────────────────────────────────────────────────────
  const budget1Id = await BudgetRepo.createBudget(
    user1Id, 5000, '2025-04-01', '2025-04-30',
    ['food', 'transport', 'entertainment', 'utilities', 'health']
  );

  await BudgetRepo.addExpense(user1Id, 250, 'food',          '2025-04-02', 'card');
  await BudgetRepo.addExpense(user1Id, 120, 'transport',     '2025-04-03', 'wallet');
  await BudgetRepo.addExpense(user1Id, 600, 'utilities',     '2025-04-05', 'bank');
  await BudgetRepo.addExpense(user1Id, 180, 'entertainment', '2025-04-10', 'card');

  console.log(`✅ Budget plan created: ${budget1Id}, expenses recorded.`);

  // ── 4. Financial goals ─────────────────────────────────────────────────────
  const goal1Id = await GoalsRepo.createGoal(
    user1Id, 'savings', 20000, '2025-12-31', 'high'
  );
  await GoalsRepo.writeProgress(user1Id, goal1Id, {
    currentAmount: 5000,
    percentage: 25,
    status: 'on_track',
  });

  const goal2Id = await GoalsRepo.createGoal(
    user2Id, 'purchase', 8000, '2025-08-01', 'medium'
  );

  console.log(`✅ Goals created: ${goal1Id}, ${goal2Id}`);

  // ── 5. Group savings ───────────────────────────────────────────────────────
  const groupId = await GroupSavingsRepo.createGroup(
    'Family Vacation Fund',
    [user2Id],
    user1Id,
    30000
  );
  await GroupSavingsRepo.recordDeposit(groupId, user1Id, 2000, '2025-04-01');
  await GroupSavingsRepo.recordDeposit(groupId, user2Id, 1500, '2025-04-05');

  const groupReport = await GroupSavingsRepo.getGroupReportData(groupId);
  console.log(`✅ Group created: ${groupId} — ${groupReport.progressPercent}% funded.`);

  // ── 6. Payment methods & transactions ──────────────────────────────────────
  const methodId = await PaymentsRepo.storeTokenizedCard(
    user1Id, 'tok_test_visa_4242', 'visa', '4242', 'card'
  );
  await PaymentsRepo.verifyPaymentMethod(user1Id, methodId);

  const txnId = await PaymentsRepo.createTransaction(
    user1Id, methodId, 499.99, 'merchant_amazon_eg', 'auth_abc123'
  );
  await PaymentsRepo.updateTransactionStatus(txnId, 'completed', 'prov_ref_xyz');

  console.log(`✅ Payment method: ${methodId}, transaction: ${txnId}`);

  // ── 7. Bills ───────────────────────────────────────────────────────────────
  const billId = await PaymentsRepo.addBill(
    user1Id, 'Cairo Electricity',
    'METER-0012345',
    { amount: 350, currency: 'EGP' },
    '2025-05-15'
  );
  await PaymentsRepo.scheduleBill(user1Id, billId, '2025-05-14', false);

  console.log(`✅ Bill added and scheduled: ${billId}`);

  // ── 8. Reports ─────────────────────────────────────────────────────────────
  const reportId = await ReportsRepo.saveExport(
    user1Id, 'monthly_summary', 'reports/user1/2025-04.pdf',
    { period: '2025-04', generatedAt: new Date().toISOString() }
  );

  console.log(`✅ Report saved: ${reportId}`);

  // ── 9. Notifications ───────────────────────────────────────────────────────
  await NotifRepo.setPreference(user1Id, 'push',  true);
  await NotifRepo.setPreference(user1Id, 'email', true);
  await NotifRepo.setPreference(user1Id, 'sms',   false);

  const notifId = await NotifRepo.scheduleMessage(
    user1Id,
    'Your bill from Cairo Electricity is due on 15 May 2025. Amount: EGP 350.',
    'push',
    '2025-05-13T09:00:00Z'
  );

  console.log(`✅ Notification scheduled: ${notifId}`);

  // ── Done ───────────────────────────────────────────────────────────────────
  console.log('\n🎉 Seed completed successfully!');
  await disconnectFromAtlas();
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
