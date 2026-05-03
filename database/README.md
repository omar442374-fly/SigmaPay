# SigmaPay — MongoDB Atlas Database Layer

This directory contains the complete **MongoDB Atlas** data layer for the SigmaPay personal-finance application, implemented with **Mongoose ODM** on Node.js.

It maps directly to the architecture defined in the project's design documents:
- **Data Layer.pdf** — Repository interfaces (`IAuth`, `IUserAccount`, `IBudgetPlan`, etc.)
- **Bisnuss_Domain Layer.pdf** — Domain model (collections / schemas)
- **Arch layer.pdf** — Business services that consume the repositories

---

## Collections

| Collection | Description |
|---|---|
| `useraccounts` | Core account identity (username, email, 2FA settings) |
| `customers` | KYC / personal details linked to a user account |
| `credentials` | Hashed passwords (separate from account for security) |
| `sessions` | Active auth tokens with Atlas TTL auto-expiry |
| `authevents` | Audit log: login, logout, password reset, 2FA events |
| `loginactivities` | Per-login device and IP records shown to the user |
| `budgetplans` | Monthly/periodic budget plans per user |
| `transactions` | Individual expense records |
| `spendingtrendss` | Aggregated spending by category per period |
| `financialgoals` | User-defined savings / purchase goals |
| `goalprogresss` | Time-series progress snapshots per goal |
| `savingsgroups` | Shared group savings pools |
| `groupmembers` | Membership records (group ↔ user) |
| `groupcontributions` | Individual deposits into a group |
| `reports` | Metadata for generated financial reports |
| `paymentmethods` | Tokenised cards, wallets, bank accounts |
| `paymenttransactions` | Payment execution records |
| `bills` | Recurring / one-off bills |
| `notifications` | Notification delivery history + scheduled messages |
| `notificationpreferences` | Per-user push / SMS / email channel settings |

---

## Repository Classes

| Repository | Interfaces implemented |
|---|---|
| `AuthRepository` | `IAuth` — credentials, sessions, auth events, login activity |
| `AccountsRepository` | `IUserAccount` — account CRUD, customer profile, 2FA |
| `BudgetRepository` | `IBudgetPlan`, `ITransaction`, `ISpendingTrends` |
| `GoalsRepository` | `IFinancialGoal`, `IGoalProgress` |
| `GroupSavingsRepository` | `ISavingsGroup`, `IGroupMember`, `IGroupContribution`, `IGroupReport` |
| `ReportsRepository` | `IReport` — fetch data, save/list exports |
| `PaymentsRepository` | `IBill`, `IPaymentMethod`, `IPaymentTransaction` |
| `NotificationsRepository` | `INotification`, `INotificationPreferences` |

---

## Setup

### 1. Prerequisites
- Node.js 18+
- A [MongoDB Atlas](https://www.mongodb.com/atlas) free-tier (M0) cluster

### 2. Create the Atlas Cluster
1. Sign in to [Atlas](https://cloud.mongodb.com).
2. Create a new **free M0** cluster (any cloud provider / region).
3. Under **Database Access** → add a database user with read/write permissions.
4. Under **Network Access** → add your IP address (or `0.0.0.0/0` for development).
5. Click **Connect** → **Drivers** → copy the connection string.

### 3. Configure environment variables
```bash
cp .env.example .env
# Then edit .env and fill in your Atlas URI:
# MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/sigmapay?retryWrites=true&w=majority
```

### 4. Install dependencies
```bash
npm install
```

### 5. Run the seed script
```bash
npm run seed
```
This creates two sample users, budget plans, goals, a group savings pool, payment methods, bills, and notifications.

---

## Usage in Application Code

```js
const {
  connectToAtlas,
  repositories: { AccountsRepository, BudgetRepository },
} = require('./database');

async function main() {
  await connectToAtlas();

  const userId = await AccountsRepository.createAccount(
    'john_doe', 'john@example.com', '+201234567890', '<hashed_pw>'
  );

  await BudgetRepository.createBudget(
    userId, 3000, '2025-05-01', '2025-05-31', ['food', 'transport']
  );
}
```

---

## Directory Structure

```
database/
├── config/
│   └── database.js          # Atlas connection helper
├── models/                  # Mongoose schemas (one per collection)
│   ├── UserAccount.js
│   ├── Customer.js
│   ├── Credential.js
│   ├── Session.js
│   ├── AuthEvent.js
│   ├── LoginActivity.js
│   ├── BudgetPlan.js
│   ├── Transaction.js
│   ├── SpendingTrends.js
│   ├── FinancialGoal.js
│   ├── GoalProgress.js
│   ├── SavingsGroup.js
│   ├── GroupMember.js
│   ├── GroupContribution.js
│   ├── Report.js
│   ├── PaymentMethod.js
│   ├── PaymentTransaction.js
│   ├── Bill.js
│   ├── Notification.js
│   └── NotificationPreferences.js
├── repositories/            # Data-access classes (implement Data Layer interfaces)
│   ├── AuthRepository.js
│   ├── AccountsRepository.js
│   ├── BudgetRepository.js
│   ├── GoalsRepository.js
│   ├── GroupSavingsRepository.js
│   ├── ReportsRepository.js
│   ├── PaymentsRepository.js
│   └── NotificationsRepository.js
├── seed/
│   └── seed.js              # Sample data population script
├── index.js                 # Main export (models + repositories + connection)
├── package.json
├── .env.example             # Environment template
└── README.md
```
