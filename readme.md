

A simple expense tracker web application built for college assignments. No complex setup required!

## **Features** 
1. **User Authentication** - Login & Signup
2. **Expense Management** - Add, View, Edit, Delete expenses
3. **Data Visualization** - Pie chart showing category-wise expenses
4. **Simple Design** - Clean and user-friendly interface

## **Project Structure** 
```
expensetracker_project/
├── backend/           (Node.js server)
│   ├── server.js
│   └── package.json
└── frontend/          (HTML/CSS/JS)
    ├── index.html
    ├── style.css
    └── app.js
```

## **How to Run** 

### **Step 1: Backend Setup**
1. Open Command Prompt in the project folder
2. Navigate to backend folder:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   node server.js
   ```
   
**You should see:**
```
 Backend running at http://localhost:5000
Test login: student@college.com / password123
```

### **Step 2: Frontend Setup**
1. Open a new Command Prompt window
2. Navigate to frontend folder:
   ```bash
   cd frontend
   ```
3. Run a simple HTTP server (choose one):

   **Option A - Using Python:**
   ```bash
   python -m http.server 8000
   ```

   **Option B - Using Node.js:**
   ```bash
   npx serve
   ```

   **Option C - Just open `index.html` file directly in browser!**

4. Open browser and go to:
   ```
   http://localhost:8000
   ```

## **Test Credentials** 
- **Email:** `student@college.com`
- **Password:** `password123`

## **API Endpoints** 🔌
```
POST   /api/login      - Login user
POST   /api/signup     - Create account
GET    /api/expenses   - Get all expenses (add ?userId=1)
POST   /api/expenses   - Add new expense
PUT    /api/expenses/:id - Update expense
DELETE /api/expenses/:id - Delete expense
```

## **Technologies Used** 
- **Frontend:** HTML, CSS, JavaScript, Chart.js
- **Backend:** Node.js, Express.js
- **Authentication:** Simple session-based
- **Database:** In-memory (no installation needed)

## **Screenshots** 
1. **Login Page** - Simple login form with test credentials
2. **Dashboard** - Add expenses and view table
3. **Expense Table** - View all expenses with edit/delete options
4. **Pie Chart** - Visual representation of expenses by category

## **For College Submission** 

### **Files to Submit:**
1. `backend/` folder with `server.js` and `package.json`
2. `frontend/` folder with 3 files (`index.html`, `style.css`, `app.js`)
3. This README file

### **To Demonstrate in Class:**
1. Start backend server (Terminal 1)
2. Open frontend in browser (Terminal 2)
3. Login with test credentials
4. Show all features (Add, View, Edit, Delete expenses, Pie chart)

## **Common Issues & Solutions** ❗

### **Issue 1: Port 5000 already in use**
```bash
# Change port in server.js from 5000 to 5001
const PORT = 5001;
```

### **Issue 2: CORS error in browser**
- Make sure backend is running at `http://localhost:5000`
- Check browser console for errors

### **Issue 3: Can't install npm packages**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall
npm install
```

## **Project Requirements Checklist** 
- [x] User authentication (Login/Signup)
- [x] Add expenses (Category, Amount, Comments)
- [x] View expenses in table (sorted by latest)
- [x] Edit existing expenses
- [x] Delete expenses
- [x] Pie chart visualization
- [x] User-friendly interface
- [x] No complex setup needed

## **Created By** 
[Your Name] - [Your College Name]
[Your Roll Number] - [Your Class]

**Date:** [Current Date]

---

**Note:** This is a college project for educational purposes. Data is stored in memory and will be lost when server restarts.