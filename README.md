# Backend API Project

A simple backend API built with Express.js, Prisma ORM, JWT authentication, and Socket.IO for real-time notifications.

## Features

- **User Authentication**: Register, login, JWT tokens with refresh mechanism
- **Product Management**: CRUD operations for products with filtering
- **Order System**: Create orders with stock management
- **Real-time Notifications**: Socket.IO for admin notifications on new orders
- **Database**: SQLite with Prisma ORM

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env` file and update JWT secrets for production
   - Database URL is already configured for SQLite

4. Generate Prisma client and push database schema:
   ```bash
   npm run db:generate
   npm run db:push
   ```

## Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user info

### Products
- `GET /products` - Get all products (with optional filters)
- `GET /products/:id` - Get single product
- `POST /products` - Create product (auth required)
- `PUT /products/:id` - Update product (auth required)
- `DELETE /products/:id` - Delete product (auth required)

### Orders
- `GET /orders` - Get user's orders (auth required)
- `GET /orders/all` - Get all orders (auth required)
- `GET /orders/:id` - Get single order (auth required)
- `POST /orders` - Create new order (auth required)
- `PUT /orders/:id/status` - Update order status (auth required)

## API Usage Examples

### Register User
```bash
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Product
```bash
POST /products
Content-Type: application/json
Cookie: accessToken=...

{
  "name": "Laptop",
  "price": 999.99,
  "stock": 10
}
```

### Get Products with Filters
```bash
GET /products?search=laptop&minPrice=500&maxPrice=1500&inStock=true
```

### Create Order
```bash
POST /orders
Content-Type: application/json
Cookie: accessToken=...

{
  "productId": 1,
  "quantity": 2
}
```

## Socket.IO Events

### Admin Notifications
- `new_order` - Emitted when a new order is created
- `order_status_updated` - Emitted when order status changes

### Example Client Connection
```javascript
const socket = io('http://localhost:3000');

socket.on('new_order', (data) => {
  console.log('New order received:', data);
});

socket.on('order_status_updated', (data) => {
  console.log('Order status updated:', data);
});
```

## Database Schema

### Users
- id (Primary Key)
- name
- email (Unique)
- password (Hashed)
- createdAt, updatedAt

### Products
- id (Primary Key)
- name
- price
- stock
- createdAt, updatedAt

### Orders
- id (Primary Key)
- userId (Foreign Key)
- productId (Foreign Key)
- quantity
- totalPrice
- status
- createdAt, updatedAt

## Security Features

- Password hashing with bcryptjs
- JWT tokens stored in HTTP-only cookies
- Token refresh mechanism
- Input validation
- Protected routes middleware

## Environment Variables

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"
NODE_ENV="development"
PORT=3000
```

## Database Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes to database
npm run db:push

# Reset database (Warning: This will delete all data)
npm run db:reset
```

## Technology Stack

- **Backend**: Express.js
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT with refresh tokens
- **Real-time**: Socket.IO
- **Security**: bcryptjs for password hashing
- **Development**: Nodemon for auto-restart