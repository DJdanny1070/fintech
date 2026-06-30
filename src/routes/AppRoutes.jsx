import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import RoleSelect from "../pages/RoleSelect";
import Dashboard from "../pages/Dashboard";
import Marketplace from "../pages/Marketplace";
import Wallet from "../pages/Wallet";
import BlockchainPage from "../pages/Blockchain";
import Analytics from "../pages/Analytics";
import ProductDetails from "../pages/ProductDetails";
import Orders from "../pages/Orders";
import Profile from "../pages/Profile";
import { ToastProvider } from "../components/common/ToastProvider";

function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/choose-role" element={<RoleSelect />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="blockchain" element={<BlockchainPage />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="orders" element={<Orders />} />
            <Route path="profile" element={<Profile />} />
          </Route>
 
          {/* Public product details route */}
          <Route path="/marketplace/:id" element={<ProductDetails />} />
        </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;