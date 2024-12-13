import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const ProtectedRoute = ({ children, group }) => {
    const { user, loading } = useAppContext();

    useEffect(() => {
        if (loading) return;
        
        if (!user && !loading) {
            window.location.replace("/oauth2/authorization/okta");
        }
    }, [loading, user]);

    // Redirect unauthorized users based on group
    if (group && !user?.groups?.includes(group)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;