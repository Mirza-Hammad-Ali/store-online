// import BackendConnection from "./BackendConnection";
// import { useState } from "react";
// import { Route, Routes } from "react-router-dom";
// import Footer from "./components/Footer.jsx";
// import Navbar from "./components/Navbar.jsx";
// import AboutPage from "./pages/AboutPage.jsx";
// import ContactPage from "./pages/ContactPage.jsx";
// import HomePage from "./pages/HomePage.jsx";
// import ShopPage from "./pages/ShopPage.jsx";

// function App() {
//   const [bagCount, setBagCount] = useState(0);
//   const addToBag = () => setBagCount((count) => count + 1);

//   return (
//     <div className="min-h-screen overflow-hidden bg-[#faf9f6] text-[#24251f]">
//        <BackendConnection />
//       <Navbar bagCount={bagCount} />
//       <main>
//         <Routes>
//           <Route path="/" element={<HomePage onAddToBag={addToBag} />} />
//           <Route path="/shop" element={<ShopPage onAddToBag={addToBag} />} />
//           <Route path="/about" element={<AboutPage />} />
//           <Route path="/contact" element={<ContactPage />} />
//           <Route path="*" element={<HomePage />} />
//         </Routes>
//       </main>
//       <Footer />
//     </div>
//   );
// }

// export default App;

import { useState } from "react";
import { Route, Routes } from "react-router-dom";

import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";
import BackendConnection from "./BackendConnection";

import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ShopPage from "./pages/ShopPage.jsx";

import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  const [bagCount, setBagCount] = useState(0);

  const addToBag = () => {
    setBagCount((count) => count + 1);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen overflow-hidden bg-[#faf9f6] text-[#24251f]">
        <BackendConnection />

        <Navbar bagCount={bagCount} />

        <main>
          <Routes>
            <Route path="/" element={<HomePage onAddToBag={addToBag} />} />

            <Route path="/shop" element={<ShopPage onAddToBag={addToBag} />} />

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
