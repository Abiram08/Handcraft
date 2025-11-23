// src/components/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // Ensure this path is correct
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="app-wrapper">
      <Navbar />
      <main className="main-content">
        <Outlet /> {/* Renders the child routes (e.g., HomePage, AdminPage, etc.) */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;