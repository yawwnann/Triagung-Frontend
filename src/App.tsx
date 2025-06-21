// App.tsx
import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import ApiConfig from "./lib/ApiConfig";

// Common Components
import { Navbar } from "./common/components/Navbar";
import FooterSection from "./common/components/FooterSection";

// Views
import HomeView from "./home/HomeView";
import AboutView from "./about/AboutView";
import ProductView from "./produk/pages/ProductView";
import Login from "./login/Login";
import Register from "./register/Register";
import ProfilePage from "./profile/Profile";
import AddressPage from "./profile/AddressPage";
import ProductDetailPage from "./produk/pages/ProductDetailPage";
import CartPage from "./cart/CartPage";
import CheckoutPage from "./checkout/CheckoutPage";
import MyOrdersPage from "./profile/MyOrdersPage";
import OrderDetailPage from "./profile/OrderDetailPage";

interface User {
  name: string;
  email: string;
}

const App: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

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
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/address" element={<AddressPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile/orders" element={<MyOrdersPage />} />
          <Route path="/order/:id" element={<OrderDetailPage />} />
        </Routes>
      </main>
      <FooterSection />
    </>
  );
};

export default App;
