# Backend Project Overview

## Project Description
A simple backend application built with Express.js and Prisma ORM, featuring JWT authentication and real-time socket updates for order notifications.

## Technology Stack
- **Backend Framework**: Express.js
- **Database ORM**: Prisma
- **Database**: SQLite/MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time Communication**: Socket.IO
- **Password Security**: Bcrypt for hashing

## Core Features

### 1. User Authentication System
- **User Registration**
  - Fields: name, email, password
  - Password hashing for security
  - Input validation and error handling

- **User Login**
  - JWT-based authentication
  - Access token and refresh token generation
  - HTTP-only cookies for token storage
  - Secure token management

- **Token Refresh Mechanism**
  - Automatic token renewal
  - Seamless user experience
  - Enhanced security through token rotation

### 2. Product Management API
- **Product Creation** (Protected Route)
  - Fields: name, price, stock quantity
  - Admin/authenticated user access required
  - Input validation and error handling

- **Product Listing**
  - Public endpoint for product browsing
  - Filtering capabilities
  - Pagination support (optional)

### 3. Order Management System
- **Order Creation** (Protected Route)
  - User can place orders for products
  - Automatic stock reduction
  - Authentication required
  - Stock validation before order placement

- **Inventory Management**
  - Real-time stock tracking
  - Prevention of overselling
  - Stock update mechanisms

### 4. Real-time Notifications
- **Socket.IO Integration**
  - Real-time order notifications
  - Admin notification system
  - Event-driven architecture

- **Admin Dashboard Updates**
  - Instant order alerts
  - Real-time inventory updates
  - Live order status tracking

## API Endpoints Structure

### Authentication Routes
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Token refresh
- `POST /auth/logout` - User logout

### Product Routes
- `POST /products` - Create product (Protected)
- `GET /products` - List all products with filters
- `GET /products/:id` - Get single product details

### Order Routes
- `POST /orders` - Create new order (Protected)
- `GET /orders` - Get user orders (Protected)
- `GET /orders/:id` - Get specific order details (Protected)

## Database Schema

### Users Table
- id (Primary Key)
- name
- email (Unique)
- password (Hashed)
- created_at
- updated_at

### Products Table
- id (Primary Key)
- name
- price
- stock
- created_at
- updated_at

### Orders Table
- id (Primary Key)
- user_id (Foreign Key)
- product_id (Foreign Key)
- quantity
- total_price
- status
- created_at
- updated_at

## Security Features
- Password hashing with bcrypt
- JWT token authentication
- HTTP-only cookies for token storage
- Input validation and sanitization
- Protected routes middleware
- CORS configuration
- Rate limiting (recommended)

## Real-time Features
- Socket.IO server setup
- Admin notification system
- Order event broadcasting
- Real-time inventory updates

## Development Considerations
- Environment variable management
- Error handling middleware
- Logging system
- Database connection management
- API documentation
- Testing strategy
- Deployment configuration