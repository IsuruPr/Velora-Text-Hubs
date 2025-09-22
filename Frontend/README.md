
# Clothing Store MERN Application

A full-stack e-commerce clothing store built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript.

## Project Structure

This project consists of two main parts:

- **Frontend**: React/TypeScript application in the root directory
- **Backend**: Express/Node.js application in the `/server` directory

## Features

- Responsive design with Tailwind CSS
- Product browsing and filtering
- Shopping cart functionality
- User authentication
- Order management
- Animation with Framer Motion
- Toast notifications
- Form validation

## Technologies Used

### Frontend
- React with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Framer Motion for animations
- Tanstack React Query for data fetching
- Shadcn UI components
- Lucide React for icons

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- RESTful API design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. Clone the repository
   ```
   git clone <your-repo-url>
   ```

2. Install frontend dependencies
   ```
   npm install
   ```

3. Install backend dependencies
   ```
   cd server
   npm install
   ```

4. Create a `.env` file in the server directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/clothing-store
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_here
   ```

### Running the Application

1. Start the backend server (from the server directory):
   ```
   npm run dev
   ```

2. In a new terminal, start the frontend development server (from the root directory):
   ```
   npm run dev
   ```

3. The frontend will be running at http://localhost:8080
   The backend API will be running at http://localhost:5000

### Seeding the Database

To populate the database with initial product data:
```
cd server
npm run seed
```

## API Endpoints

See the backend README.md for detailed API documentation.

## Folder Structure

```
clothing-store/
├── public/              # Static files
├── server/              # Backend application
│   ├── models/          # Mongoose models
│   ├── routes/          # Express routes
│   ├── middleware/      # Express middleware
│   ├── seeds/           # Database seed scripts
│   └── index.js         # Server entry point
├── src/                 # Frontend application
│   ├── components/      # Reusable React components
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── pages/           # Page components
│   ├── services/        # API service functions
│   └── App.tsx          # Main application component
└── README.md            # Project documentation
```
