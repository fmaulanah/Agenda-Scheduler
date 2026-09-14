import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {

    const { user } = useAuth();
    const location = useLocation();

    if (!user) {

        return <Navigate to="/login" replace state={{ from: location }} />;

    }

    return children;

}

export function AdminRoute({ children }) {

    const { user } = useAuth();
    const location = useLocation();

    if (!user) {

        return <Navigate to="/login" replace state={{ from: location }} />;

    }

    if (user?.ROLE_ID !== "ADMIN") {

        return <Navigate to="/dashboard" replace />;

    }

    return children;

}

export default ProtectedRoute;