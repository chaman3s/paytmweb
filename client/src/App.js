import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Signin from "./pages/Signin.js";
import Signup from "./pages/Signup.js";
import Dashboard from "./pages/Dashboard";
import SuccessPage from "./pages/SuccessPage.jsx";
import P2p from "./pages/userapp/P2p.js";
import Transactions from "./pages/userapp/Transaction.jsx";
import Transfer from "./pages/userapp/Transfer.jsx";
import Layout from "./pages/userapp/Layout.js";
import AuthLayout from "./AuthLayout.js";
import Refferal from "./pages/userapp/Refferal.jsx";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = true;
  console.log("isAuthenticated", localStorage.getItem("token"))
  return isAuthenticated ? children : <Navigate to="auth/signin" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="signin" element={<Signin />} />
          <Route path="signup" element={<Signup />} />
        </Route>

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="transfer" element={<Transfer />} />
          <Route path="success" element={<SuccessPage />} />
          <Route path="p2p" element={<P2p />} />
          <Route path="transactions" element={<Transactions />} />
        </Route>
        <Route path="/friends" element={<AuthLayout />}>
          <Route path="invite" element={<Refferal/>} />
        </Route>
        
        

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
