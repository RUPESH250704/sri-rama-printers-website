# Sri Rama Prints - Local Setup

## Prerequisites
- Node.js (v14+)
- MongoDB installed locally

## Setup Steps

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   
   cd ../frontend
   npm install
   ```

2. **Start MongoDB**
   ```bash
   mongod
   ```

3. **Start Backend** (new terminal)
   ```bash
   cd backend
   npm run dev
   ```

4. **Start Frontend** (new terminal)
   ```bash
   cd frontend
   npm start
   ```

5. **Create Admin User**
   ```bash
   cd backend
   node createAdmin.js
   ```

## Access
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Default Admin Login
Check console output after running createAdmin.js