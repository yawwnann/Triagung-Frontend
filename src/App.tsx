// App.tsx
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import AOS from "aos";
import "./App.css";
import ApiConfig from "./shared/utils/ApiConfig";

// Common Components
import { Navbar } from "./shared/components/Navbar";
import FooterSection from "./shared/components/FooterSection";
import Notification from "./shared/components/Notification";

// Views
import HomeView from "./features/home/HomeView";
import AboutView from "./features/about/AboutView";
import ProductView from "./features/products/pages/ProductView";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import ProfilePage from "./features/profile/Profile";
import AddressPage from "./features/profile/AddressPage";
import ProductDetailPage from "./features/products/pages/ProductDetailPage";
import CartPage from "./features/cart/CartPage";
import CheckoutPage from "./features/checkout/CheckoutPage";
import MyOrdersPage from "./features/profile/MyOrdersPage";
import OrderDetailPage from "./features/profile/OrderDetailPage";

interface User {
  name: string;
  email: string;
}

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showSessionExpired, setShowSessionExpired] = useState(false);

  const fetchItemCount = async () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const response = await ApiConfig.get("/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && Array.isArray(response.data.items)) {
          setItemCount(response.data.items.length);
        } else {
          setItemCount(0);
        }
      } catch (error) {
        console.error("Failed to fetch cart count:", error);
        setItemCount(0);
      }
    }
  };

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease", once: true, offset: 50 });
  }, []);

  useEffect(() => {
    // Refresh AOS when route changes so new elements animate
    AOS.refresh();
  }, [location]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user_data");
    if (token) {
      setIsAuthenticated(true);
      fetchItemCount();
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      }
    }
  }, []);

  useEffect(() => {
    const checkForceLogout = () => {
      if (window.__forceLogout) {
        setShowSessionExpired(true);
        window.__forceLogout = false;
      }
    };
    const interval = setInterval(checkForceLogout, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_data");
    setIsAuthenticated(false);
    setCurrentUser(null);
    setItemCount(0);
    navigate("/login");
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    fetchItemCount();
    const userData = localStorage.getItem("user_data");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
    navigate("/");
  };

  return (
    <>
      {showSessionExpired && (
        <Notification
          message="Ups, sesi anda sudah habis, silakan login lagi."
          type="error"
          onClose={() => {
            setShowSessionExpired(false);
            localStorage.removeItem("access_token");
            localStorage.removeItem("user_data");
            setIsAuthenticated(false);
            setCurrentUser(null);
            setItemCount(0);
            navigate("/login");
          }}
          duration={0}
        />
      )}
      <Navbar
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        itemCount={itemCount}
        currentUser={currentUser}
      />
      <main>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route
            path="/products"
            element={
              <ProductView
                isAuthenticated={isAuthenticated}
                itemCount={itemCount}
              />
            }
          />
          <Route
            path="/product/:id"
            element={<ProductDetailPage isAuthenticated={isAuthenticated} />}
          />
          <Route path="/about" element={<AboutView />} />
          <Route
            path="/login"
            element={<Login onLoginSuccess={handleLoginSuccess} />}
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={<ProfilePage onLogout={handleLogout} />}
          />
          <Route path="/address" element={<AddressPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile/orders" element={<MyOrdersPage />} />
          <Route path="/profile/orders/:id" element={<OrderDetailPage />} />
          <Route path="/order/:id" element={<OrderDetailPage />} />
        </Routes>
      </main>
      <FooterSection />
    </>
  );
};

export default App;
