import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import PasswordReset from './pages/PasswordReset';
import Dashboard from './pages/Dashboard';
import BillPayment from './pages/BillPayment';
import ProfileManagement from './pages/ProfileManagement';
import Support from './pages/Support';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import Footer from './components/Footer';
import PreLoader from './components/PreLoader';
import PageTransition from './components/PageTransition';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';
import ProtectedRoute from './components/ProtectedRoute';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);

function App() {
	const [darkMode, setDarkMode] = useState(false);

	const [screenLoading, setScreenLoading] = useState(false);

	useEffect(() => {
		setScreenLoading(true);
		setTimeout(() => {
			setScreenLoading(false);
		}, 2500);
	}, []);

	return (screenLoading ? ( <PreLoader /> ) : (
		<Box display="flex" flexDirection="column" minHeight="100vh">
			<Header />
			<Box component="main" flexGrow={1}>

				<Routes>
					{/* Public Routes */}
					<Route path="/" element={<PageTransition><Home /></PageTransition>} />
					<Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
					<Route path="/login" element={<PageTransition><Login /></PageTransition>} />
					<Route path="/support" element={<PageTransition><Support /></PageTransition>} />
					<Route path="/password-reset" element={<PageTransition><PasswordReset /></PageTransition>} />
					<Route path="*" element={<PageTransition><NotFound /></PageTransition>} />

					{/* Protected Routes */}
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute>
								<PageTransition>
									<Dashboard />
								</PageTransition>
							</ProtectedRoute>
						}
					/>
					<Route
						path="/bill-payment"
						element={
							<ProtectedRoute>
								<PageTransition>
									<BillPayment />
								</PageTransition>
							</ProtectedRoute>
						}
					/>
					<Route
						path="/profile"
						element={
							<ProtectedRoute>
								<PageTransition>
									<ProfileManagement />
								</PageTransition>
							</ProtectedRoute>
						}
					/>
				</Routes>

			</Box>
			<Footer />
		</Box>
		)
	);
}

export default App;
