import React from 'react'
import { Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
	faTachometerAlt, 
	faMoneyBillWave, 
	faUser, 
	faLifeRing 
} from '@fortawesome/free-solid-svg-icons'

function Sidebar() {
	return (
		<Nav className="flex-column bg-light rounded shadow-sm p-3">
			<div className="mb-3">
				<h5 className="px-3">Dashboard Menu</h5>
			</div>
			<Nav.Link 
				as={Link} 
				to="/dashboard" 
				className="d-flex align-items-center py-2 px-3 rounded hover-bg-primary"
			>
				<FontAwesomeIcon icon={faTachometerAlt} className="me-2" /> Dashboard
			</Nav.Link>
			<Nav.Link 
				as={Link} 
				to="/bill-payment" 
				className="d-flex align-items-center py-2 px-3 rounded hover-bg-primary"
			>
				<FontAwesomeIcon icon={faMoneyBillWave} className="me-2" /> Pay Bills
			</Nav.Link>
			<Nav.Link 
				as={Link} 
				to="/profile" 
				className="d-flex align-items-center py-2 px-3 rounded hover-bg-primary"
			>
				<FontAwesomeIcon icon={faUser} className="me-2" /> Profile
			</Nav.Link>
			<Nav.Link 
				as={Link} 
				to="/support" 
				className="d-flex align-items-center py-2 px-3 rounded hover-bg-primary"
			>
				<FontAwesomeIcon icon={faLifeRing} className="me-2" /> Support
			</Nav.Link>
		</Nav>
	)
}

export default Sidebar