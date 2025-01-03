import React, { useState } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'

function Signup() {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		password: ''
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
		<Container>
			<Row className="mt-5">
				<Col md="6" className="mx-auto">
					<h2>Sign Up</h2>
					<Form onSubmit={handleSubmit}>
						<Form.Group controlId="formName">
							<Form.Label>Name</Form.Label>
							<Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
						</Form.Group>
						<Form.Group controlId="formEmail">
							<Form.Label>Email address</Form.Label>
							<Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
						</Form.Group>
						<Form.Group controlId="formPhone">
							<Form.Label>Phone Number</Form.Label>
							<Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
						</Form.Group>
						<Form.Group controlId="formPassword">
							<Form.Label>Password</Form.Label>
							<Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
						</Form.Group>
						<Button variant="primary" type="submit">
							Sign Up
						</Button>
					</Form>
				</Col>
			</Row>
		</Container>
	)
}

export default Signup
