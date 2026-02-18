import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute, PublicRoute, RoleBasedRoute } from "./components/layout";
import { Register, VerifyOTP, Login, Profile } from "./features/auth";
import { AuthProvider } from "./context/AuthContext";
import { 
  AboutUs, 
  Calculator as CarbonEmissionCalculator, 
  ContactUs, 
  Blog, 
  BlogDetail, 
  ComingSoon,
  ReceiptViewer,
  TransactionPage
} from "./features/shared";
import UserDashboard from "./features/shared/UserDashboard";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import { LandingPage } from "./features/landing";
import { 
  AllListings as ListingsPage,
  CreateListingPage,
} from "./features/seller";
import { 
  Marketplace,
  TransactionListing,
} from "./features/buyer";
import { AdminDashboard } from "./features/admin";
import BuyerAnalytics from "./features/buyer/pages/BuyerAnalytics";
import SellerAnalytics from "./features/seller/pages/SellerAnalytics";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        {/* Full-height container with column layout */}
        <div className="flex flex-col min-h-screen">
          {/* Navbar always at the top */}
          <Navbar />

          {/* Main content with flex-1 to push footer to bottom */}
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicRoute />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/calculator" element={<CarbonEmissionCalculator />} />
                <Route path="/coming" element={<ComingSoon />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
              </Route>

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                {/* User Dashboard - accessible by all users except admin */}
                <Route path="/dashboard" element={
                  <RoleBasedRoute allowedRoles={["user"]}>
                    <UserDashboard />
                  </RoleBasedRoute>
                } />
                
                {/* User Routes - for buying and selling */}
                <Route path="/marketplace" element={
                  <RoleBasedRoute allowedRoles={["user"]}>
                    <Marketplace />
                  </RoleBasedRoute>
                } />
                <Route path="/market" element={
                  <RoleBasedRoute allowedRoles={["user"]}>
                    <Marketplace />
                  </RoleBasedRoute>
                } />
                <Route path="/listings" element={
                  <RoleBasedRoute allowedRoles={["user"]}>
                    <ListingsPage />
                  </RoleBasedRoute>
                } />
                <Route path="/form" element={
                  <RoleBasedRoute allowedRoles={["user"]}>
                    <CreateListingPage />
                  </RoleBasedRoute>
                } />
                <Route path="/payment" element={
                  <RoleBasedRoute allowedRoles={["user"]}>
                    <TransactionPage />
                  </RoleBasedRoute>
                } />
                <Route path="/transaction-listing" element={
                  <RoleBasedRoute allowedRoles={["user"]}>
                    <TransactionListing />
                  </RoleBasedRoute>
                } />
                <Route path="/buyer-analytics" element={
                  <RoleBasedRoute allowedRoles={["user"]}>
                    <BuyerAnalytics />
                  </RoleBasedRoute>
                } />
                <Route path="/seller-analytics" element={
                  <RoleBasedRoute allowedRoles={["user"]}>
                    <SellerAnalytics />
                  </RoleBasedRoute>
                } />
                
                {/* Admin Routes - accessible by admin only */}
                <Route path="/admin" element={
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </RoleBasedRoute>
                } />
                
                {/* Common Protected Routes */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/receipt/:transactionId" element={<ReceiptViewer />} />
              </Route>

              {/* Default Route */}
              <Route path="*" element={<Login />} />
            </Routes>
          </main>

          {/* Footer always at the bottom */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
