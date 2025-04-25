import React, { useState, useContext } from 'react';
import {
	Box,
	Container,
	Grid,
	TextField,
	Button,
	InputAdornment,
	Typography,
	Link as MuiLink,
	FormHelperText,
	Divider
} from '@mui/material';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardHeader, MDBCardTitle, MDBCardFooter, MDBBtn} from 'mdb-react-ui-kit'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

import { GoogleLogin } from '@react-oauth/google';
import AuthContext from '../context/AuthContext';

function Login() {
	const [formData, setFormData] = useState({
		username: '',
		password: '',
	});

	const { doLogin, doGoogleLogin } = useContext(AuthContext);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		doLogin(formData);
		console.log('Form submitted:', formData);
	};

	return (
		<MDBContainer fluid className="position-absolute h-100 w-100">
				<MDBRow className="d-flex align-items-center justify-content-center h-100">
					<MDBCol size="10" xs='8' sm='8' md='6' lg='5' xl='4'>
						<MDBCard alignment='center' className="shadow-5-strong">
							<MDBCardHeader>
								<MDBCardTitle>Login</MDBCardTitle>
							</MDBCardHeader>
							<MDBCardBody>
								<Box component="form" onSubmit={handleSubmit}>
									<Box mb={3}>
										<TextField
											type="text"
											name="username"
											label="Enter or Phone"
											id="outlined-required-1"
											margin="dense"
											required
											fullWidth
											value={formData.username}
											autoComplete='true'
											onChange={handleChange}
											InputProps={{
												startAdornment: (
													<InputAdornment position="start">
														<FontAwesomeIcon icon={faEnvelope} />
													</InputAdornment>
												),
											}}
										/>
									</Box>
									<Box mb={3}>
										<TextField
											type="password"
											name="password"
											label="Password"
											id="outlined-required-2"
											autoComplete='true'
											margin="dense"
											required
											fullWidth
											value={formData.password}
											onChange={handleChange}
											InputProps={{
												startAdornment: (
													<InputAdornment position="start">
														<FontAwesomeIcon icon={faLock} />
													</InputAdornment>
												),
											}}
										/>
										<FormHelperText sx={{ textAlign: 'right' }}>
											<MuiLink component={Link} to="/password-reset" underline="hover">
												Forgot Password?
											</MuiLink>
										</FormHelperText>
									</Box>
									<MDBBtn type="submit" color='warning' size="lg" className="form-control mb-2" outline>
										Login
									</MDBBtn>
								</Box>

								<Box my={3}>
									<Divider>
										<Typography variant="body2" color="textSecondary">
											OR
										</Typography>
									</Divider>
								</Box>

								<Box display="flex" justifyContent="center" mb={2}>
									<GoogleLogin
										onSuccess={doGoogleLogin}
										onError={() => {
											console.log('Login Failed');
										}}
										useOneTap
										theme="filled_blue"
										text="signin_with"
										shape="pill"
									/>
								</Box>
							</MDBCardBody>
							<MDBCardFooter className="py-3">
								<Typography>
									Don't have an account?{' '}
									<MuiLink
										component={Link}
										to="/signup"
										underline="hover"
										color="info"
									>
										Sign Up
									</MuiLink>
								</Typography>
							</MDBCardFooter>
						</MDBCard>
					</MDBCol>
				</MDBRow>
			</MDBContainer>
	);
}

export default Login;
