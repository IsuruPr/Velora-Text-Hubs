
# Clothing Store Backend

This is the backend server for the Clothing Store application. It provides APIs for product management, user authentication, cart management, and order processing.

## Technology Stack

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework for Node.js
- **MongoDB**: Database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. Clone the repository
2. Navigate to the server directory:
   ```
   cd server
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the server directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/clothing-store
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_here
   ```

### Running the Server

1. Start the development server:
   ```
   npm run dev
   ```

2. The server will be running at http://localhost:5000

### Seeding the Database

To populate the database with initial product data:
```
npm run seed
```

## API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products?category=men` - Get products by category
- `GET /api/products/:id` - Get a specific product
- `POST /api/products` - Create a new product (admin only)
- `PUT /api/products/:id` - Update a product (admin only)
- `DELETE /api/products/:id` - Delete a product (admin only)

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login a user
- `GET /api/users/profile` - Get user profile (authenticated)

### Cart

- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:productId` - Update cart item quantity
- `DELETE /api/cart/remove/:productId` - Remove item from cart

### Orders

- `POST /api/orders` - Create a new order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders` - Get all orders (admin only)
- `PUT /api/orders/:id` - Update order status (admin only)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Protected routes require a valid token to be included in the request headers:

```
x-auth-token: your_jwt_token
```

## Error Handling

The API returns appropriate HTTP status codes and error messages in the response body:

- `400` - Bad Request (invalid input)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Server Error
