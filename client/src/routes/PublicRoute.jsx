import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { user, loadingAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loadingAuth) return;

    if (user!=null) {
      navigate("/", { replace: true }); // Already logged in, redirect to home
    }
  }, [user, loadingAuth, navigate]);

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  return children;
};

export default PublicRoute;
