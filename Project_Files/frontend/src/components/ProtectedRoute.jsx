import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Ensure you import jwtDecode
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initially null
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const hasShownToast = useRef(false); // Ref to track if toast has been shown

  const notify_toast = () => {
    if (!hasShownToast.current) {
      toast.error("Make sure you are logged in first.");
      hasShownToast.current = true; // Mark that the toast has been shown
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token"); // Get token from localStorage

    if (!token) {
      setRedirecting(true);

      const timer = setTimeout(() => {
        navigate("/Login", { replace: true });
      }, 1000);
      notify_toast(); // Show the toast message
      return () => clearTimeout(timer);
    }

    try {
      const decodedToken = jwtDecode(token);
      // You can add additional checks for token expiration or other validation here.
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false); // Token is invalid or expired
      navigate("/Login", { replace: true });
    }
  }, [navigate]);


  if (isAuthenticated === null || redirecting) {
    return (
      <div>
        <h1 style={{ color: "red" }}>Please log in first.</h1>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
