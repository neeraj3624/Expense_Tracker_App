
const API_URL = 'http://localhost:5000/api';
let currentUser = null;
let expenses = [];


function showPage(page) {
    const app = document.getElementById('app');
    
    if(page === 'login') {
        app.innerHTML = `
            <div class="auth-container">
                <h1>Expense Tracker Login</h1>
                <div id="message"></div>
                <form id="loginForm">
                    <div class="form-group">
                        <label>Email:</label>
                        <input type="email" id="email" value="student@college.com" required>
                    </div>
                    <div class="form-group">
                        <label>Password:</label>
                        <input type="password" id="password" value="password123" required>
                    </div>
                    <button type="submit">Login</button>
                </form>
                <div class="link">
                    Don't have account? <a href="#" onclick="showPage('signup')">Sign Up</a>
                </div>
            </div>
        `;
        
        document.getElementById('loginForm').onsubmit = async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({email, password})
                });
                const data = await response.json();
                
                if(data.success) {
                    currentUser = data.user;
                    showMessage('Login successful!', 'success');
                    setTimeout(() => showDashboard(), 1000);
                } else {
                    showMessage(data.message, 'error');
                }
            } catch(error) {
                showMessage('Network error. Make sure backend is running!', 'error');
            }
        };
    }
    
    else if(page === 'signup') {
        app.innerHTML = `
            <div class="auth-container">
                <h1>Create Account</h1>
                <div id="message"></div>
                <form id="signupForm">
                    <div class="form-group">
                        <label>Name:</label>
                        <input type="text" id="name" required>
                    </div>
                    <div class="form-group">
                        <label>Email:</label>
                        <input type="email" id="email" required>
                    </div>
                    <div class="form-group">
                        <label>Password:</label>
                        <input type="password" id="password" required>
                    </div>
                    <button type="submit">Sign Up</button>
                </form>
                <div class="link">
                    Already have account? <a href="#" onclick="showPage('login')">Login</a>
                </div>
            </div>
        `;
        
        document.getElementById('signupForm').onsubmit = async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                const response = await fetch(`${API_URL}/signup`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({name, email, password})
                });
                const data = await response.json();
                
                if(data.success) {
                    showMessage('Account created! Please login.', 'success');
                    setTimeout(() => showPage('login'), 2000);
                } else {
                    showMessage(data.message, 'error');
                }
            } catch(error) {
                showMessage('Network error', 'error');
            }
        };
    }
}


async function showDashboard() {

    await loadExpenses();
    
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container">
            <div class="header">
                <h1>📊 Expense Tracker</h1>
                <div>
                    <span>Welcome, ${currentUser.name}</span>
                    <button class="logout-btn" onclick="logout()">Logout</button>
                </div>
            </div>
            
            <div class="content">
                <div id="message"></div>
                
                <h2>➕ Add New Expense</h2>
                <div class="expense-form">
                    <form id="expenseForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Category:</label>
                                <select id="category">
                                    <option>Food</option>
                                    <option>Transport</option>
                                    <option>Shopping</option>
                                    <option>Bills</option>
                                    <option>Entertainment</option>
                                    <option>Books</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Amount ($):</label>
                                <input type="number" id="amount" step="0.01" min="0" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Comments (Optional):</label>
                            <textarea id="comments" rows="2"></textarea>
                        </div>
                        <button type="submit">Add Expense</button>
                    </form>
                </div>
                
                <h2>📋 All Expenses</h2>
                <div id="expenseTable"></div>
                
                <div class="chart-container">
                    <h2>📊 Expense Distribution</h2>
                    <canvas id="chart"></canvas>
                </div>
            </div>
        </div>
    `;
    
    
    document.getElementById('expenseForm').onsubmit = async (e) => {
        e.preventDefault();
        const category = document.getElementById('category').value;
        const amount = document.getElementById('amount').value;
        const comments = document.getElementById('comments').value;
        
        try {
            const response = await fetch(`${API_URL}/expenses`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    userId: currentUser.id,
                    category,
                    amount,
                    comments
                })
            });
            
            const newExpense = await response.json();
            expenses.push(newExpense);
            showMessage('Expense added successfully!', 'success');
            renderExpenseTable();
            renderChart();
            document.getElementById('expenseForm').reset();
        } catch(error) {
            showMessage('Error adding expense', 'error');
        }
    };
    
    renderExpenseTable();
    renderChart();
}

async function loadExpenses() {
    try {
        const response = await fetch(`${API_URL}/expenses?userId=${currentUser.id}`);
        expenses = await response.json();
    } catch(error) {
        console.error('Error loading expenses:', error);
        expenses = [];
    }
}

function renderExpenseTable() {
    const container = document.getElementById('expenseTable');
    if(!container) return;
    
    if(expenses.length === 0) {
        container.innerHTML = '<p>No expenses yet. Add your first expense above!</p>';
        return;
    }
    
    let html = `
        <table class="expense-table">
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Comments</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    expenses.forEach(expense => {
        html += `
            <tr>
                <td>${expense.category}</td>
                <td>$${expense.amount.toFixed(2)}</td>
                <td>${expense.createdAt}</td>
                <td>${expense.comments || '-'}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editExpense(${expense.id})">Edit</button>
                    <button class="action-btn delete-btn" onclick="deleteExpense(${expense.id})">Delete</button>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}


async function editExpense(id) {
    const expense = expenses.find(e => e.id === id);
    if(!expense) return;
    
    const newAmount = prompt('Enter new amount:', expense.amount);
    if(newAmount && !isNaN(newAmount)) {
        try {
            const response = await fetch(`${API_URL}/expenses/${id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({amount: parseFloat(newAmount)})
            });
            
            const updated = await response.json();
            const index = expenses.findIndex(e => e.id === id);
            expenses[index] = updated;
            showMessage('Expense updated!', 'success');
            renderExpenseTable();
            renderChart();
        } catch(error) {
            showMessage('Error updating expense', 'error');
        }
    }
}

// Delete expense
async function deleteExpense(id) {
    if(confirm('Are you sure you want to delete this expense?')) {
        try {
            await fetch(`${API_URL}/expenses/${id}`, {method: 'DELETE'});
            expenses = expenses.filter(e => e.id !== id);
            showMessage('Expense deleted!', 'success');
            renderExpenseTable();
            renderChart();
        } catch(error) {
            showMessage('Error deleting expense', 'error');
        }
    }
}

// Render pie chart
function renderChart() {
    const canvas = document.getElementById('chart');
    if(!canvas) return;
    
    // Calculate category totals
    const categories = {};
    expenses.forEach(expense => {
        categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
    });
    
    const ctx = canvas.getContext('2d');
    
    
    if(window.expenseChart) {
        window.expenseChart.destroy();
    }
    
    // Create new chart
    window.expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
                    '#9966FF', '#FF9F40', '#FF6384'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Show message
function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    if(messageDiv) {
        messageDiv.innerHTML = `<div class="message ${type}">${text}</div>`;
        setTimeout(() => {
            messageDiv.innerHTML = '';
        }, 3000);
    }
}

// Logout
function logout() {
    currentUser = null;
    expenses = [];
    showPage('login');
}

// Start the app
showPage('login');