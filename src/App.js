// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import Layout from './components/Layout';
import AddProduct from './pages/AddProduct';
// Pages
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import CeramicsPage from './pages/CeramicsPage';
import JewelleryPage from './pages/JewelleryPage';
import TextilesPage from './pages/TextilesPage';
import WoodworkPage from './pages/WoodworkPage';
import AdminPage from './pages/AdminPage';
import CustomerDashboard from './pages/CustomerDashboard';
import SellerDashboard from './pages/SellerDashboard';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SearchPage from './pages/SearchPage';
import CheckoutPage from './pages/CheckoutPage'; // Add CheckoutPage
import PaymentPage from './pages/PaymentPage'; // Add PaymentPage

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/ceramics" element={<CeramicsPage />} />
            <Route path="/jewellery" element={<JewelleryPage />} />
            <Route path="/textile" element={<TextilesPage />} />
            <Route path="/woodwork" element={<WoodworkPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/customer-dashboard" element={<CustomerDashboard />} />
            <Route path="/seller-dashboard" element={<SellerDashboard />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/checkout" element={<CheckoutPage />} /> {/* Add checkout route */}
            <Route path="/payment" element={<PaymentPage />} /> {/* Add payment route */}
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
