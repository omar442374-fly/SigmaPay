// Local storage keys
const CONTACTS_KEY = 'sigmapay_contacts';
const TRANSACTIONS_KEY = 'sigmapay_transactions';
const GROUPS_KEY = 'sigmapay_groups';

// Contacts Management
export const getContacts = () => {
  return JSON.parse(localStorage.getItem(CONTACTS_KEY) || '[]');
};

export const saveContact = (contact) => {
  const contacts = getContacts();
  const newContact = {
    ...contact,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  contacts.push(newContact);
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
  return newContact;
};

export const updateContact = (id, updatedContact) => {
  const contacts = getContacts();
  const index = contacts.findIndex(c => c.id === id);
  if (index !== -1) {
    contacts[index] = { ...contacts[index], ...updatedContact };
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
    return contacts[index];
  }
  return null;
};

export const deleteContact = (id) => {
  const contacts = getContacts();
  const filtered = contacts.filter(c => c.id !== id);
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(filtered));
};

// Transactions Management
export const getTransactions = () => {
  return JSON.parse(localStorage.getItem(TRANSACTIONS_KEY) || '[]');
};

export const saveTransaction = (transaction) => {
  const transactions = getTransactions();
  const newTransaction = {
    ...transaction,
    id: `TX-${Date.now()}`,
    date: new Date().toISOString(),
    status: 'completed'
  };
  transactions.unshift(newTransaction);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  return newTransaction;
};

export const getTransaction = (id) => {
  const transactions = getTransactions();
  return transactions.find(t => t.id === id);
};

// Groups Management
export const getGroups = () => {
  return JSON.parse(localStorage.getItem(GROUPS_KEY) || '[]');
};

export const saveGroup = (group) => {
  const groups = getGroups();
  const newGroup = {
    ...group,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    members: [],
    contributions: []
  };
  groups.push(newGroup);
  localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
  return newGroup;
};

export const updateGroup = (id, updatedGroup) => {
  const groups = getGroups();
  const index = groups.findIndex(g => g.id === id);
  if (index !== -1) {
    groups[index] = { ...groups[index], ...updatedGroup };
    localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
    return groups[index];
  }
  return null;
};

export const joinGroup = (groupId, userId) => {
  const groups = getGroups();
  const group = groups.find(g => g.id === groupId);
  if (group && !group.members.includes(userId)) {
    group.members.push(userId);
    localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
    return group;
  }
  return null;
};

export const addContribution = (groupId, contribution) => {
  const groups = getGroups();
  const group = groups.find(g => g.id === groupId);
  if (group) {
    group.contributions.push({
      ...contribution,
      id: Date.now().toString(),
      date: new Date().toISOString()
    });
    localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
    return group;
  }
  return null;
};