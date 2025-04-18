import React, { useState, useContext } from 'react';
import {
	Box,
	TextField,
	InputAdornment,
	Typography,
	Link as MuiLink,
	FormHelperText
} from '@mui/material';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardHeader, MDBCardTitle, MDBCardFooter, MDBBtn} from 'mdb-react-ui-kit'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser, faPhone, faUserTag } from '@fortawesome/free-solid-svg-icons';

import AuthContext from '../context/AuthContext';

function Signup() {
	const [formData, setFormData] = useState({
		firstname: '',
		lastname: '',
		username: '',
		email: '',
		phone: '',
		password: ''
	});

	const { doSignup } = useContext(AuthContext);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		doSignup(formData);
		console.log('Form submitted:', formData);
	};

	return (
		<MDBContainer fluid className="position-absolute h-100 w-100">
			<MDBRow className="d-flex align-items-center justify-content-center h-100">
				<MDBCol size="10" xs='8' sm='8' md='6' lg='5' xl='4'>
					<MDBCard alignment='center' className="shadow-5-strong">
						<MDBCardHeader>
							<MDBCardTitle>Sign Up</MDBCardTitle>
						</MDBCardHeader>
						<MDBCardBody>
							<Box component="form" onSubmit={handleSubmit}>
								<Box mb={3}>
									<TextField
										type="text"
										name="firstname"
										label="First Name"
										id="outlined-required-1"
										margin="dense"
										required
										fullWidth
										value={formData.firstname}
										autoComplete={true}
										onChange={handleChange}
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<FontAwesomeIcon icon={faUser} />
												</InputAdornment>
											),
										}}
									/>
								</Box>
								<Box mb={3}>
									<TextField
										type="text"
										name="lastname"
										label="Last Name"
										id="outlined-required-2"
										margin="dense"
										required
										fullWidth
										value={formData.lastname}
										autoComplete={true}
										onChange={handleChange}
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<FontAwesomeIcon icon={faUser} />
												</InputAdornment>
											),
										}}
									/>
								</Box>
								<Box mb={3}>
									<TextField
										type="text"
										name="username"
										label="Username"
										id="outlined-required-3"
										margin="dense"
										required
										fullWidth
										value={formData.username}
										autoComplete={true}
										onChange={handleChange}
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<FontAwesomeIcon icon={faUserTag} />
												</InputAdornment>
											),
										}}
									/>
								</Box>
								<Box mb={3}>
									<TextField
										type="email"
										name="email"
										label="Email Address"
										id="outlined-required-4"
										margin="dense"
										required
										fullWidth
										value={formData.email}
										autoComplete={true}
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
										type="tel"
										name="phone"
										label="Phone Number"
										id="outlined-required-5"
										margin="dense"
										required
										fullWidth
										value={formData.phone}
										autoComplete={true}
										onChange={handleChange}
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<FontAwesomeIcon icon={faPhone} />
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
										id="outlined-required-6"
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
								</Box>
								<MDBBtn type="submit" color='warning' size="lg" className="form-control mb-2" outline>
									Sign Up
								</MDBBtn>
							</Box>
						</MDBCardBody>
						<MDBCardFooter className="py-3">
							<Typography>
								Already have an account?{' '}
								<MuiLink
									component={Link}
									to="/login"
									underline="hover"
									color="info"
								>
									Login
								</MuiLink>
							</Typography>
						</MDBCardFooter>
					</MDBCard>
				</MDBCol>
			</MDBRow>
		</MDBContainer>
	);
}

export default Signup
