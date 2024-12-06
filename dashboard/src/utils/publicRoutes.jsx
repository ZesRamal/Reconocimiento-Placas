import { Navigate } from "react-router-dom";
import { useAuth } from './authProvider';

const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    return !isAuthenticated ? children : <Navigate to="/" replace />;
};


export default PublicRoute;