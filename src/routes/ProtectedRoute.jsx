import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {

    const { user } = useAuth();

    if (!user) {

        return <Navigate to="/login" replace />;

    }

    return children;

}

export function AdminRoute({ children }) {

    const { user } = useAuth();

    if (!user) {

        return <Navigate to="/login" replace />;

    }

    if (user?.ROLE_ID !== "ADMIN") {

        return <Navigate to="/dashboard" replace />;

    }

    return children;

}

export default ProtectedRoute;