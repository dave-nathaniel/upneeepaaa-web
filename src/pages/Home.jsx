import React, { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBInput, MDBInputGroup, MDBTypography} from 'mdb-react-ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faBolt, faCalendarCheck, faArrowRight, faEnvelope, faLock, faUser, faPhone } from '@fortawesome/free-solid-svg-icons';
import { TextField, InputAdornment, Box, Divider, Typography  } from '@mui/material';
import headerImage from '../assets/images/header.png';

import AuthContext from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

function Home() {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		password: ''
	})

	const [showModal, setShowModal] = useState(false)

	const { doSignup, doGoogleLogin  } = useContext(AuthContext);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		})
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		// Check if all required fields are filled
		if (formData.name && formData.email && formData.phone && formData.password) {
			setShowModal(true)
			doSignup(formData);
			console.log('Form submitted:', formData);
		}
	}

	const handleConfirm = () => {
		setShowModal(false)
		console.log('Registration form submitted:', formData)
		// Here you would typically call an API to register the user
		// Similar to doSignup(formData) in Signup.jsx
	}

	const handleClose = () => {
		setShowModal(false)
	}

	return (
		<MDBContainer fluid={true} className="mt-5 px-0">
			<div className="bg-welcome">
				<MDBRow className="d-flex align-items-center justify-content-center h-100">
					<MDBCol lg={4} md={12} className="d-none d-lg-block">
						<div style={{
							height: "100%",
						}}>
							<img
								src={headerImage}
								className=''
								alt='...'
								style={{
									width: "90%",
								}}
							/>
						</div>

					</MDBCol>
					<MDBCol lg={6} md={10} className="overlay-div ps-lg-5 px-md-5 px-sm-5 px-4 pb-3">
						<div style={{
							"position": "relative",

						}}>
							<MDBTypography tag='div' className='title fw-normal display-2 pb-1 mb-3 pt-0' style={{
								color: "#2f4858"
							}}>
					      UpNeeePaaa
					    </MDBTypography>
					      <MDBTypography tag='div' className='caption display-6 pb-3 mb-3'>
					        Bill payments made easy.
					      </MDBTypography>
						</div>

						<MDBCard alignment='left' style={{
							opacity: "0.8"
						}}>
							<MDBCardBody>
								<Form onSubmit={handleSubmit}>
									<MDBRow>
										<MDBCol size={12} className="mb-3">
											<TextField
												margin="dense"
												type="text"
												name="name"
												id="outlined-required-name" 
												label="Name"
												required
												fullWidth
												autoComplete='true'
												value={formData.name}
												onChange={handleChange}
												InputProps={{
													startAdornment: (
														<InputAdornment position="start">
															<FontAwesomeIcon icon={faUser} />
														</InputAdornment>
													),
												}}
											/>
										</MDBCol>
										<MDBCol size={12} className="mb-3">
											<TextField
												margin="dense"
												type="email"
												name="email"
												id="outlined-required-email" 
												label="Email"
												required
												fullWidth
												autoComplete='true'
												value={formData.email}
												onChange={handleChange}
												InputProps={{
													startAdornment: (
														<InputAdornment position="start">
															<FontAwesomeIcon icon={faEnvelope} />
														</InputAdornment>
													),
												}}
											/>
										</MDBCol>
										<MDBCol size={12} className="mb-3">
											<TextField
												margin="dense"
												type="tel"
												name="phone"
												id="outlined-required-phone" 
												label="Phone"
												required
												fullWidth
												autoComplete='true'
												value={formData.phone}
												onChange={handleChange}
												InputProps={{
													startAdornment: (
														<InputAdornment position="start">
															<FontAwesomeIcon icon={faPhone} />
														</InputAdornment>
													),
												}}
											/>
										</MDBCol>
										<MDBCol size={12} className="mb-3">
											<TextField
												margin="dense"
												type="password"
												name="password"
												id="outlined-required-password" 
												label="Password"
												required
												fullWidth
												autoComplete='true'
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
										</MDBCol>
										<MDBCol className="text-center">
											<Button 
												size="lg" 
												variant="primary" 
												className="rounded-pill px-4 mx-0"
												type="submit" 
												disabled={!formData.name || !formData.email || !formData.phone || !formData.password}
											>
												Get Started <FontAwesomeIcon icon={faArrowRight} />
											</Button>
										</MDBCol>
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
												text="continue_with"
												shape="pill"
											/>
										</Box>

									</MDBRow>
								</Form>



							</MDBCardBody>
						</MDBCard>

					</MDBCol>
				</MDBRow>
			</div>

			<MDBContainer fluid={true} className="px-0" style={{
					background: "#33658a",
				}}>
				<MDBContainer className="py-5 px-0">
					<MDBCard className='text-center p-3'  style={{
						background: "#507891",
					}}>
						<MDBCardBody>
							<MDBRow className="g-4">
								{[
									{ 
										title: "Power Usage Analytics", 
										description: "Detailed insights into your energy consumption.",
										icon: faChartLine 
									},
									{ 
										title: "Easy Bill Payments", 
										description: "Pay bills quickly and securely from anywhere.",
										icon: faBolt 
									},
									{ 
										title: "Payment Scheduling", 
										description: "Automate your recurring bill payments.",
										icon: faCalendarCheck 
									}
								].map((feature, index) => (
									<MDBCol md={4} key={index}>
										<MDBCard className="h-100 shadow-sm border-0 text-white" style={{background:"#14232d"}}>
											<MDBCardBody className="text-center ">
												<div className="mb-3">
													<FontAwesomeIcon 
														icon={feature.icon} 
														size="3x" 
														className="text-primary" 
													/>
												</div>
												<h4>{feature.title}</h4>
												<p>{feature.description}</p>
											</MDBCardBody>
										</MDBCard>
									</MDBCol>
								))}
							</MDBRow>
						</MDBCardBody>
					</MDBCard>
				</MDBContainer>
			</MDBContainer>
		</MDBContainer>
	)
}

export default Home
