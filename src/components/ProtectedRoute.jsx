import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
	const { authToken, loading } = useContext(AuthContext);

	if (loading) return <p>Loading...</p>;

	return authToken ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
