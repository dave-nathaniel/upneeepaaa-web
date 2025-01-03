import React, { useState } from 'react'
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faLock, faBell } from '@fortawesome/free-solid-svg-icons'

function ProfileManagement() {
	const [formData, setFormData] = useState({
		name: 'John Doe',
		email: 'john.doe@example.com',
		phone: '123-456-7890'
	})

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		})
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		// Handle form submission
		console.log('Form submitted:', formData)
	}

	return (
		<Container className="py-5">
			<Row className="g-4">
				<Col md="8" className="mx-auto">
					<h1 className="display-5 mb-4">Profile Management</h1>
					
					<Card className="mb-4 shadow-sm">
						<Card.Body>
							<Card.Title className="d-flex align-items-center">
								<FontAwesomeIcon icon={faUser} className="me-3 text-primary" />
								Personal Information
							</Card.Title>
							<Form onSubmit={handleSubmit}>
								<Row className="g-3">
									<Col md="6">
										<Form.Group controlId="formName">
											<Form.Label>Name</Form.Label>
											<Form.Control 
												type="text" 
												name="name" 
												value={formData.name} 
												onChange={handleChange} 
												required 
											/>
										</Form.Group>
									</Col>
									<Col md="6">
										<Form.Group controlId="formEmail">
											<Form.Label>Email address</Form.Label>
											<Form.Control 
												type="email" 
												name="email" 
												value={formData.email} 
												onChange={handleChange} 
												required 
											/>
										</Form.Group>
									</Col>
								</Row>
								<Form.Group controlId="formPhone" className="mt-3">
									<Form.Label>Phone Number</Form.Label>
									<Form.Control 
										type="tel" 
										name="phone" 
										value={formData.phone} 
										onChange={handleChange} 
										required 
									/>
								</Form.Group>
								<Button 
									variant="primary" 
									type="submit" 
									className="mt-3 rounded-pill px-4"
								>
									Update Profile
								</Button>
							</Form>
						</Card.Body>
					</Card>

					<Card className="mb-4 shadow-sm">
						<Card.Body>
							<Card.Title className="d-flex align-items-center">
								<FontAwesomeIcon icon={faLock} className="me-3 text-primary" />
								Change Password
							</Card.Title>
							<Form>
								<Row className="g-3">
									<Col md="12">
										<Form.Group controlId="formCurrentPassword">
											<Form.Label>Current Password</Form.Label>
											<Form.Control type="password" required />
										</Form.Group>
									</Col>
									<Col md="6">
										<Form.Group controlId="formNewPassword">
											<Form.Label>New Password</Form.Label>
											<Form.Control type="password" required />
										</Form.Group>
									</Col>
									<Col md="6">
										<Form.Group controlId="formConfirmPassword">
											<Form.Label>Confirm New Password</Form.Label>
											<Form.Control type="password" required />
										</Form.Group>
									</Col>
								</Row>
								<Button 
									variant="primary" 
									type="submit" 
									className="mt-3 rounded-pill px-4"
								>
									Change Password
								</Button>
							</Form>
						</Card.Body>
					</Card>

					<Card className="shadow-sm">
						<Card.Body>
							<Card.Title className="d-flex align-items-center">
								<FontAwesomeIcon icon={faBell} className="me-3 text-primary" />
								Notification Preferences
							</Card.Title>
							<Form>
								<Form.Group controlId="formEmailNotifications" className="mb-3">
									<Form.Check 
										type="switch" 
										id="email-notifications" 
										label="Email Notifications" 
									/>
								</Form.Group>
								<Form.Group controlId="formSMSNotifications">
									<Form.Check 
										type="switch" 
										id="sms-notifications" 
										label="SMS Notifications" 
									/>
								</Form.Group>
								<Button 
									variant="primary" 
									type="submit" 
									className="mt-3 rounded-pill px-4"
								>
									Update Preferences
								</Button>
							</Form>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	)
}

export default ProfileManagement