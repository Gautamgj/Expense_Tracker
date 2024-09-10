const Expense = require('../models/expenseModel');

// Get all expenses with optional filters
exports.getExpenses = async (req, res) => {
    const { category, startDate, endDate } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = startDate;
        if (endDate) filter.date.$lte = endDate;
    }

    try {
        const expenses = await Expense.find(filter);
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching expenses', error });
    }
};

// Get a single expense by ID
exports.getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching expense', error });
    }
};

// Create a new expense
exports.createExpense = async (req, res) => {
    const { description, amount, category, date } = req.body;
    const newExpense = new Expense({ description, amount, category, date });

    try {
        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (error) {
        res.status(500).json({ message: 'Error creating expense', error });
    }
};

// Update an expense by ID
exports.updateExpense = async (req, res) => {
    try {
        const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedExpense);
    } catch (error) {
        res.status(500).json({ message: 'Error updating expense', error });
    }
};

// Delete an expense by ID
exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting expense', error });
    }
};
