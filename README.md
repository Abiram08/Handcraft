# Handcraft

Handcraft is a full-stack e-commerce platform designed to connect artisans with buyers. It provides a marketplace for unique, handcrafted items, featuring distinct roles for customers, sellers, and administrators.

## 🚀 Features

### 👥 User Roles
-   **Customer**: Browse products, search by category or name, view product details, and manage profile.
-   **Seller**: Register as a vendor, add/edit/delete products, manage inventory, and view sales status.
-   **Admin**: Oversee the platform, approve or reject product listings, and manage users.

### 🛒 Product Management
-   **Listings**: Detailed product pages with images, descriptions, prices, and stock levels.
-   **Approval Workflow**: New products submitted by sellers require admin approval before going live.
-   **Search & Filter**: Find products easily by category, status, or keywords.

### 🔒 Security
-   **Authentication**: Secure user registration and login using JWT (JSON Web Tokens).
-   **Password Hashing**: Passwords are encrypted using bcryptjs.
-   **Role-Based Access Control**: Protected routes ensure users only access features authorized for their role.

## 🛠️ Tech Stack

### Frontend
-   **React.js**: Component-based UI library.
-   **React Router**: Client-side routing.
-   **Axios**: HTTP client for API requests.
-   **CSS**: Custom styling for a responsive design.

### Backend
-   **Node.js**: JavaScript runtime environment.
-   **Express.js**: Web framework for Node.js.
-   **MongoDB**: NoSQL database for storing users, products, and orders.
-   **Mongoose**: ODM (Object Data Modeling) library for MongoDB.
-   **Multer**: Middleware for handling `multipart/form-data` (image uploads).

## 📂 Project Structure

```
handcraft/
├── backend/                # Node.js/Express Backend
│   ├── controllers/        # Route logic
│   ├── models/             # Mongoose schemas (User, Product)
│   ├── routes/             # API endpoints
│   ├── uploads/            # Stored product images
│   └── server.js           # Entry point
├── public/                 # Static assets
├── src/                    # React Frontend
│   ├── components/         # Reusable UI components
│   ├── pages/              # Application pages
│   └── App.js              # Main component
└── package.json            # Frontend dependencies
```

## ⚙️ Installation & Setup

### Prerequisites
-   [Node.js](https://nodejs.org/) (v14+ recommended)
-   [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/Abiram08/Handcraft.git
cd Handcraft
```

### 2. Backend Setup
Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory (optional, or configure directly in `server.js`):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/handcraft
JWT_SECRET=your_super_secret_key
```

Start the backend server:
```bash
npm start
# Server runs on http://localhost:5000
```

### 3. Frontend Setup
Open a new terminal, navigate to the root directory (or `handcraft` folder if separate), and install dependencies:
```bash
npm install
```

Start the React development server:
```bash
npm start
# App runs on http://localhost:3000
```

## 📡 API Endpoints

### Authentication
-   `POST /api/auth/signup` - Register a new user (Customer/Seller).
-   `POST /api/auth/login` - Login and receive JWT.

### Products
-   `GET /api/products` - Get all approved products (public).
-   `GET /api/products/all` - Get all products (Admin only).
-   `POST /api/seller/products` - Add a new product (Seller only).
-   `PUT /api/seller/products/:id` - Update a product (Seller only).
-   `DELETE /api/seller/products/:id` - Delete a product (Seller only).
-   `PUT /api/products/:id/approve` - Approve a product (Admin only).
-   `PUT /api/products/:id/reject` - Reject a product (Admin only).

### Users
-   `GET /api/users` - Get all users (Admin only).

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
