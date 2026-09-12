import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PublicRoute({ children }) {

    const { user } = useAuth();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard";

    if (user) {

        return <Navigate to={from} replace />;

    }

    return children;

}

export default PublicRoute;