import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [authToken, setAuthToken] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	// Persist token on page refresh
	useEffect(() => {
		const token = localStorage.getItem('authToken');
		if (token) {
			setAuthToken(token);
		}
		setLoading(false);
	}, []);

	const doLogin = async (username, password) => {
		try {
			const login_endpoint = `${process.env.VITE_API_URL}/user/authenticate`;
			const response = await fetch(login_endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, password }),
			});

			if (response.ok) {
				const data = await response.json();
				localStorage.setItem('authToken', data.token);
				setAuthToken(data.token);
				navigate('/dashboard');
			} else {
				throw new Error('Login failed');
			}
		} catch (error) {
			console.error('Login error:', error);
		}
	};

	const doLogout = () => {
		setAuthToken(null);
		localStorage.removeItem('authToken');
		navigate('/login');
	};

	return (
		<AuthContext.Provider value={{ authToken, doLogin, doLogout, loading }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
