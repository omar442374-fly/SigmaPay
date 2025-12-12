import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useFinance } from '../contexts/FinanceContext';
import { useAuth } from '../contexts/AuthContext';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
    LineChart, Line, AreaChart, Area
} from 'recharts';
import {
    ArrowDownIcon, ArrowUpIcon, ExclamationCircleIcon,
    ChartBarIcon, ChartPieIcon, ArrowPathIcon, FunnelIcon,
    CalendarIcon, CurrencyDollarIcon, DocumentTextIcon
} from '@heroicons/react/24/outline';

function Budget() {
    const { user } = useAuth();
    const {
        income,
        budgetCategories,
        expenses,
        addUserExpense,
        updateBudgetSettings,
        loading
    } = useFinance();

    // State for UI controls
    const [activeTab, setActiveTab] = useState('overview');
    const [chartType, setChartType] = useState('pie');
    const [timeFilter, setTimeFilter] = useState('month');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortBy, setSortBy] = useState('amount');
    const [newExpense, setNewExpense] = useState({
        description: '',
        amount: '',
        categoryId: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Colors for charts
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

    // Calculate budget overview
    const budgetOverview = useMemo(() => {
        if (!budgetCategories || Object.keys(budgetCategories).length === 0) {
            return { total: 0, spent: 0, remaining: 0, percentUsed: 0 };
        }

        const total = Object.values(budgetCategories).reduce((sum, cat) => sum + cat.amount, 0);
        const spent = Object.values(budgetCategories).reduce((sum, cat) => sum + (cat.spent || 0), 0);
        const remaining = total - spent;
        const percentUsed = total > 0 ? (spent / total) * 100 : 0;

        return { total, spent, remaining, percentUsed };
    }, [budgetCategories]);

    // Format categories for charts
    const formattedCategories = useMemo(() => {
        if (!budgetCategories) return [];

        return Object.entries(budgetCategories).map(([key, category]) => ({
            id: key,
            name: category.name || key,
            budget: category.amount || 0,
            spent: category.spent || 0,
            remaining: (category.amount || 0) - (category.spent || 0),
            percentage: category.amount > 0 ? ((category.spent || 0) / category.amount) * 100 : 0
        }));
    }, [budgetCategories]);

    // Get alerts for categories over budget
    const alerts = useMemo(() => {
        return formattedCategories.filter(cat => cat.spent > cat.budget);
    }, [formattedCategories]);

    // Group expenses by month for trend analysis
    const expensesByMonth = useMemo(() => {
        if (!expenses || expenses.length === 0) return [];

        const grouped = {};

        expenses.forEach(expense => {
            const date = new Date(expense.date);
            const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            if (!grouped[monthYear]) {
                grouped[monthYear] = { month: monthYear, total: 0 };
            }

            grouped[monthYear].total += expense.amount;
        });

        return Object.values(grouped).sort((a, b) => a.month.localeCompare(b.month));
    }, [expenses]);

    // Handle adding a new expense
    const handleAddExpense = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (!newExpense.description) {
                throw new Error('Please enter a description');
            }

            if (!newExpense.amount || parseFloat(newExpense.amount) <= 0) {
                throw new Error('Please enter a valid amount');
            }

            if (!newExpense.categoryId) {
                throw new Error('Please select a category');
            }

            await addUserExpense({
                ...newExpense,
                amount: parseFloat(newExpense.amount)
            });

            setSuccess('Expense added successfully!');

            // Reset form
            setNewExpense({
                description: '',
                amount: '',
                categoryId: '',
                date: new Date().toISOString().split('T')[0]
            });
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-8">
                <h1 className="text-2xl font-semibold text-gray-900">Budget Management</h1>

                {/* Budget Overview */}
                <div className="mt-4 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold">Budget Overview</h2>
                    <p>Total Budget: ${overview.total}</p>
                    <p>Spent: ${overview.spent}</p>
                    <p>Remaining: ${overview.remaining}</p>
                </div>

                {/* Category Budgets */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold">Category Budgets</h2>
                    <ul>
                        {categories.map((category) => (
                            <li key={category.name} className="flex justify-between">
                                <span>{category.name}</span>
                                <span>${category.budget}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Add Expense */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold">Add Expense</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleAddExpense();
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Category"
                            value={newExpense.category}
                            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Amount"
                            value={newExpense.amount}
                            onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) })}
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={newExpense.description}
                            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                        />
                        <button type="submit">Add Expense</button>
                    </form>
                </div>

                {/* Recent Transactions */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold">Recent Transactions</h2>
                    <ul>
                        {expenses.map((expense, index) => (
                            <li key={index}>
                                {expense.description} - ${expense.amount} ({expense.category})
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Budget Alerts */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold">Budget Alerts</h2>
                    {alerts.length > 0 ? (
                        <ul>
                            {alerts.map((alert, index) => (
                                <li key={index} className="text-red-500">
                                    {alert.name} has exceeded its budget!
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No alerts at the moment.</p>
                    )}
                </div>

                {/* Spending Analysis */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold">Spending Analysis</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categories}
                                dataKey="spent"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                            >
                                {categories.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default Budget;