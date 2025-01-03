import React, { useState } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'

function PasswordReset() {
	const [email, setEmail] = useState('')

	const handleSubmit = (e) => {
		e.preventDefault()
		// Handle form submission
		console.log('Password reset requested for:', email)
	}

	return (
		<Container>
			<Row className="mt-5">
				<Col md="6" className="mx-auto">
					<h2>Password Reset</h2>
					<Form onSubmit={handleSubmit}>
						<Form.Group controlId="formEmail">
							<Form.Label>Email address</Form.Label>
							<Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
						</Form.Group>
						<Button variant="primary" type="submit">
							Reset Password
						</Button>
					</Form>
				</Col>
			</Row>
		</Container>
	)
}

export default PasswordReset
