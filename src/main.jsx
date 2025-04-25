import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { TransitionProvider } from './context/TransitionContext';
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<AuthProvider>
			<GoogleOAuthProvider clientId="214914596358-2k31u1eto3mo2khqh1vmvsr3jnmhsmll.apps.googleusercontent.com">
				<TransitionProvider>
					<App />
				</TransitionProvider>
			</GoogleOAuthProvider>
		</AuthProvider>
	</BrowserRouter>
);