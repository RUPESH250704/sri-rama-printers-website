# Wedding Card Ordering System - MERN Stack

A full-stack web application for ordering wedding invitation cards with separate admin and user interfaces.

## Features

### User Features
- User registration and authentication
- Browse wedding cards catalog
- Place orders with custom text
- Track order status
- View order history

### Admin Features
- Admin dashboard
- Add/manage wedding cards
- View and manage all orders
- Update order status
- Upload card images

## Tech Stack
- **Frontend**: React with TypeScript
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: JWT
- **File Upload**: Multer

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with your configuration:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/wedding-cards
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

### Database Setup
1. Make sure MongoDB is running
2. The application will automatically create the required collections

### Creating Admin User
To create an admin user, you can either:
1. Register a normal user and manually update the `isAdmin` field in MongoDB
2. Or modify the registration endpoint temporarily to create admin users

## API Endpoints

### Authentication
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login
- GET `/api/auth/me` - Get current user

### Cards
- GET `/api/cards` - Get all active cards
- GET `/api/cards/:id` - Get card by ID
- POST `/api/cards` - Create card (Admin only)
- PUT `/api/cards/:id` - Update card (Admin only)
- DELETE `/api/cards/:id` - Delete card (Admin only)

### Orders
- POST `/api/orders` - Create order
- GET `/api/orders/my-orders` - Get user orders
- GET `/api/orders` - Get all orders (Admin only)
- PUT `/api/orders/:id/status` - Update order status (Admin only)

## Project Structure

```
wedding-cards/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Card.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── cards.js
│   │   └── orders.js
│   ├── middleware/
│   │   └── auth.js
│   ├── uploads/
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Navbar.tsx
    │   ├── pages/
    │   │   ├── Home.tsx
    │   │   ├── Login.tsx
    │   │   ├── Register.tsx
    │   │   ├── Cards.tsx
    │   │   ├── OrderCard.tsx
    │   │   ├── MyOrders.tsx
    │   │   └── AdminDashboard.tsx
    │   ├── context/
    │   │   └── AuthContext.tsx
    │   ├── services/
    │   │   └── api.ts
    │   ├── types/
    │   │   └── index.ts
    │   └── App.tsx
    └── package.json
```

## Usage

1. Start both backend and frontend servers
2. Visit `http://localhost:3000` in your browser
3. Register as a new user or login
4. Browse cards and place orders
5. For admin access, create an admin user and access `/admin` route

## Default Ports
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request