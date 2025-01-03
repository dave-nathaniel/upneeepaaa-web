import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

function NotFound() {
	return (
		<Container className="py-5">
			<Row className="justify-content-center align-items-center text-center">
				<Col md="8">
					<div className="mb-4">
						<FontAwesomeIcon 
							icon={faExclamationTriangle} 
							size="5x" 
							className="text-warning mb-4" 
						/>
					</div>
					<h1 className="display-1 mb-3">404</h1>
					<h2 className="mb-4">Page Not Found</h2>
					<p className="lead text-muted mb-4">
						The page you are looking for might have been removed, 
						had its name changed, or is temporarily unavailable.
					</p>
					<div>
						<Button 
							variant="primary" 
							href="/" 
							size="lg" 
							className="rounded-pill px-4 me-3"
						>
							Return Home
						</Button>
						<Button 
							variant="outline-secondary" 
							href="/support" 
							size="lg" 
							className="rounded-pill px-4"
						>
							Contact Support
						</Button>
					</div>
				</Col>
			</Row>
		</Container>
	)
}

export default NotFound