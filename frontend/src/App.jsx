import { useState } from "react";
import { Route, Routes } from "react-router-dom";

import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";
import BackendConnection from "./BackendConnection";
import CheckoutPage from "./pages/CheckoutPage";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ShopPage from "./pages/ShopPage.jsx";
import CartPage from "./pages/CartPage.jsx";

import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  const [cart, setCart] = useState([]);
  // Clear cart after successful order
  const clearCart = () => {
    setCart([]);
  };
  // Add product to cart
  const addToBag = (product) => {
    setCart((previousCart) => {
      const existingProduct = previousCart.find(
        (item) => item.id === product.id,
      );

      if (existingProduct) {
        return previousCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...previousCart, { ...product, quantity: 1 }];
    });
  };

  // Update product quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setCart((previousCart) =>
      previousCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  // Remove product from cart
  const removeFromCart = (productId) => {
    setCart((previousCart) =>
      previousCart.filter((item) => item.id !== productId),
    );
  };

  // Total number of items
  const bagCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <AuthProvider>
      <div className="min-h-screen overflow-hidden bg-[#faf9f6] text-[#24251f]">
        <BackendConnection />

        <Navbar bagCount={bagCount} />

        <main>
          <Routes>
            <Route path="/" element={<HomePage onAddToBag={addToBag} />} />

            <Route path="/shop" element={<ShopPage onAddToBag={addToBag} />} />

            <Route
              path="/cart"
              element={
                <CartPage
                  cart={cart}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              }
            />
            {/* Checkout Page */}

            <Route
              path="/checkout"
              element={<CheckoutPage cart={cart} onOrderSuccess={clearCart} />}
            />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route
              path="/account"
              element={
                <ProtectedRoute role="user">
                  <UserDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<HomePage onAddToBag={addToBag} />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
