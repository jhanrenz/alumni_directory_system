import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/auth/useAuth";

interface ProtectedRouteProps {
    adminOnly?: boolean;
}

const ProtectedRoute = ({ adminOnly = false }: ProtectedRouteProps) => {
    const { user, loading, isAdmin } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user) return <Navigate to="/login" replace />;

    if (adminOnly && !isAdmin) return <Navigate to="/" replace />;

    return <Outlet />;
};

export default ProtectedRoute;