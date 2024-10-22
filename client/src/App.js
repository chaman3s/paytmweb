import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css"
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Dashboard } from "./pages/Dashboard";
import { SendMoney } from "./pages/Sendmoney";

// Protected Route Component
const ProtectedRoute = ({ element: Element }) => {
  const isAuthenticated = !!localStorage.getItem("token"); // Check if the user is logged in
  return isAuthenticated ? <Element /> : <Navigate to="/signin" />; // If not logged in, redirect to signin
};

function App() {
  return (
    <>
       <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          {/* Protecting the routes below */}
          <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} />} />
          <Route path="/send" element={<ProtectedRoute element={SendMoney} />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;