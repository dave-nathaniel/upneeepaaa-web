import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBInput, MDBInputGroup, MDBTypography } from 'mdb-react-ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine, faBolt, faCalendarCheck, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import {TextField} from '@mui/material';
import headerImage from '../assets/images/header.png';

function Home() {
	const [formData, setFormData] = useState({
		identifier: ''
	})

	const [showModal, setShowModal] = useState(false)

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		})
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		setShowModal(true)
	}

	const handleConfirm = () => {
		setShowModal(false)
		console.log('Form submitted:', formData)
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
									<MDBRow className="justify-content-end">
										<MDBCol size={12} className="mb-3">
												<TextField
													variant="standard"
													size="normal"
													type="text"
													name="identifier"
													id="outlined-required" 
													label="Your Email or Phone Number"
													required
													fullWidth
													autoComplete={true}
													value={formData.identifier}
													onChange={handleChange}
												/>
										</MDBCol>
										<MDBCol>
											<Button size="lg" variant="primary" className="rounded-pill px-4 float-end" type="submit" disabled={!formData.identifier}>
												Get Started <FontAwesomeIcon icon={faArrowRight} />
											</Button>
										</MDBCol>
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
