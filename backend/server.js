const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Simple storage
let users = [
    {id: 1, email: "student@college.com", password: "password123", name: "Test Student"}
];
let expenses = [
    {id: 1, userId: 1, category: "Food", amount: 25.50, comments: "Lunch at cafe", createdAt: "2024-01-10", updatedAt: "2024-01-10"},
    {id: 2, userId: 1, category: "Transport", amount: 50, comments: "Bus pass", createdAt: "2024-01-09", updatedAt: "2024-01-09"},
    {id: 3, userId: 1, category: "Books", amount: 150, comments: "College books", createdAt: "2024-01-08", updatedAt: "2024-01-08"}
];

// Login
app.post('/api/login', (req, res) => {
    const {email, password} = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if(user) {
        res.json({success: true, user: {id: user.id, email: user.email, name: user.name}});
    } else {
        res.json({success: false, message: "Wrong email or password"});
    }
});

// Signup
app.post('/api/signup', (req, res) => {
    const {name, email, password} = req.body;
    const userExists = users.find(u => u.email === email);
    if(userExists) {
        res.json({success: false, message: "User already exists"});
    } else {
        const newUser = {id: users.length + 1, name, email, password};
        users.push(newUser);
        res.json({success: true, user: {id: newUser.id, email: newUser.email, name: newUser.name}});
    }
});

// Get expenses
app.get('/api/expenses', (req, res) => {
    const userId = parseInt(req.query.userId);
    const userExpenses = expenses
        .filter(e => e.userId === userId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(userExpenses);
});

// Add expense
app.post('/api/expenses', (req, res) => {
    const expense = {
        id: expenses.length + 1,
        userId: req.body.userId,
        category: req.body.category,
        amount: parseFloat(req.body.amount),
        comments: req.body.comments || "",
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
    };
    expenses.push(expense);
    res.json(expense);
});

// Update expense
app.put('/api/expenses/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = expenses.findIndex(e => e.id === id);
    if(index !== -1) {
        expenses[index] = {
            ...expenses[index],
            ...req.body,
            updatedAt: new Date().toISOString().split('T')[0]
        };
        res.json(expenses[index]);
    } else {
        res.status(404).json({message: "Expense not found"});
    }
});

// Delete expense
app.delete('/api/expenses/:id', (req, res) => {
    const id = parseInt(req.params.id);
    expenses = expenses.filter(e => e.id !== id);
    res.json({success: true});
});

// Start server
app.listen(PORT, () => {
    console.log(` Backend running at http://localhost:${PORT}`);
    console.log(' Test login: student@college.com / password123');
});