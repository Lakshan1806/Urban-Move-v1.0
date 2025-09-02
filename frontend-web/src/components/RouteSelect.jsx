import Signupinitialpage from "../pages/Signupinitialpage.jsx";
import Home from "../pages/Home";
import Rent from "../pages/Rent";
import Drive from "../pages/Drive";
import Ride from "../pages/Ride";
import Help from "../pages/Help";
import Feedback from "./Feedback/RateUsModal.jsx";
import Register from "../pages/Register";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Signininitialpage from "../pages/SigninInitialPage.jsx";
import PaymentPage from "../pages/PaymentPage.jsx";
import TripHistory from "../pages/TripHistory.jsx";
import EmailForm from "../pages/EmailForm";
import ForgotPasswordPage from "../pages/ForgotPasswordPage.jsx";
import ResetpasswordPage from "../pages/ResetPasswordPage.jsx";
import Profile from "../pages/profile.jsx";
import ProtectedRoute from "./ProtectedRoute";
import GooglePhoneVerification from "../pages/GooglePhoneVerification.jsx";
import DriverRegister from "../pages/driverRegister.jsx";
import DriverLogin from "../pages/DriverLogin.jsx";
import GooglePhoneVerificationDriver from "../pages/GooglePhoneVerificationDriver.jsx";
import ChatAndCall from "../pages/ChatAndCall.jsx";
function RouteSelect() {
  const userId = localStorage.getItem("userId");

  return (
    <main className="h-full min-h-0">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rent" element={<Rent />} />
        <Route path="/drive" element={<Drive />} />
        <Route path="/ride" element={<Ride />} />
        <Route path="/help" element={<Help />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/signup" element={<Signupinitialpage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dRegister" element={<DriverRegister />} />
        <Route path="/dLogin" element={<DriverLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Signininitialpage />} />
        <Route path="/email" element={<EmailForm />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/trip-history" element={<TripHistory userId={userId} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetpasswordPage />} />
        <Route path="/chat" element={<ChatAndCall />} />
        <Route path="/history" element={<TripHistory />} />
        <Route path="/payment" element={<PaymentPage />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/verify-phone" element={<GooglePhoneVerification />} />
        <Route
          path="/verify-phone-driver"
          element={<GooglePhoneVerificationDriver />}
        />
      </Routes>
    </main>
  );
}

export default RouteSelect;
