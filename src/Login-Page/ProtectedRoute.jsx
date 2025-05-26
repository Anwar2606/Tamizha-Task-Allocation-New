// src/components/ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { auth } from "../firebase.js";

const ProtectedRoute = ({ children }) => {
  return auth.currentUser ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
