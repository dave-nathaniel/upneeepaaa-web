import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UsageChart from '../components/UsageChart';
import { Container, Grid, Card, CardContent, Typography, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, CircularProgress, Alert } from '@mui/material';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBInput, MDBInputGroup, MDBTypography, MDBTable, MDBTableHead, MDBTableBody, MDBCardHeader, MDBIcon, MDBSpinner } from 'mdb-react-ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClockRotateLeft, faCalendarCheck, faMoneyBillWave, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { dashboardAPI } from '../services/api';

function Dashboard() {
	const themeColors = ["#33658A", "#86BBD8", "#2F4858", "#F6AE2D", "#F26419", "#f79321"];

	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Fetch transaction history when component mounts
	useEffect(() => {
		const fetchTransactions = async () => {
			try {
				setLoading(true);
				setError(null);
				const data = await dashboardAPI.getTransactions();
				console.log(data);
				setTransactions(data.transactions);
			} catch (error) {
				console.error('Error fetching transactions:', error);
				setError('Failed to load transaction history. Please try again later.');
			} finally {
				setLoading(false);
			}
		};

		fetchTransactions();
	}, []);

	const quickActions = [
		{
			title: 'Pay Bills',
			description: 'Quick and secure bill payments',
			icon: faMoneyBillWave,
			link: '/bill-payment',
			color: "#86BBD8"
		},
		{
			title: 'History',
			description: 'View your transaction history',
			icon: faClockRotateLeft,
			link: '/transaction-history',
			color: "#86BBD8",
		},
		{
			title: 'Schedule',
			description: 'Manage your recurring payments',
			icon: faCalendarCheck,
			link: '/schedule',
			color: "#86BBD8"
		},
	];

	return (
		<MDBContainer className="mt-5 pt-5 p-4">
			<MDBRow className="d-flex justify-content-center">
				<MDBCol size="12" className="pb-3">
					<MDBTypography className="card-title" tag='h5'>Quick Actions:</MDBTypography>
				</MDBCol>
				{quickActions.map((action, index) => (
					<MDBCol key={"dbaction-" + index} size="4" sm="4" md="4" lg="2">
						<MDBCard className="shadow rounded text-center h-100 d-flex flex-column justify-content-center align-items-center py-1 pt-4 px-1" style={{
							border: "1px solid #FFF",
							color: "#33658A",
						}}>
							<MDBBtn size='lg' className='mx-2 rounded-circle'  style={{ 
								backgroundColor: "#33658A",
								display: 'inherit',
								border: "1px solid #86BBD8",
								padding: "10px",
								fontSize: "20px",
								boxShadow: "none",
								color: "#FFF"
							}} tag={Link} to={action.link}>
								<FontAwesomeIcon 
									icon={action.icon}
								/>
							</MDBBtn>
							<MDBTypography tag="p" className="mt-3">
								{action.title.toUpperCase()}
							</MDBTypography>
						</MDBCard>
					</MDBCol>
				))}
			</MDBRow>

			<MDBCard className="mb-4 shadow-sm mt-5 px-0">
				<MDBCardHeader>
					<MDBCardTitle className="">
						Power Usage Monitoring
					</MDBCardTitle>
				</MDBCardHeader>
				<MDBCardBody className="px-1">
					<UsageChart />
				</MDBCardBody>
			</MDBCard>

			<MDBCard className="shadow-sm">
				<MDBCardHeader>
					<MDBCardTitle className="d-flex justify-content-between align-items-center">
						<span>Recent Transactions</span>
						{loading && <MDBSpinner size='sm' />}
					</MDBCardTitle>
				</MDBCardHeader>
				<MDBCardBody>
					{error ? (
						<Alert severity="error" className="mb-0">
							<div className="d-flex align-items-center">
								<FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
								{error}
							</div>
						</Alert>
					) : transactions.length === 0 && !loading ? (
						<Alert severity="info" className="mb-0">
							No transaction history available. Your recent payments will appear here.
						</Alert>
					) : (
						<div className="table-responsive">
							<MDBTable bordered hover>
								<MDBTableHead light>
									<tr>
										<th>Date</th>
										<th>Description</th>
										<th>Amount</th>
										<th>Status</th>
									</tr>
								</MDBTableHead>
								<MDBTableBody>
									{transactions.map((transaction) => (
										<tr key={transaction.id}>
											<td>{new Date(transaction.created_at).toLocaleDateString()}</td>
											<td>{transaction.bill_item}</td>
											<td>₦{transaction.amount.toLocaleString()}</td>
											<td>
												<span className={`badge bg-${transaction.status === 'completed' ? 'success' : 
													transaction.status === 'pending' ? 'warning' : 
													transaction.status === 'failed' ? 'danger' : 'info'}`}>
													{transaction.status}
												</span>
											</td>
										</tr>
									))}
								</MDBTableBody>
							</MDBTable>
						</div>
					)}

					{transactions.length > 0 && (
						<div className="d-flex justify-content-end mt-3">
							<MDBBtn color="primary" size="sm" outline tag={Link} to="/transaction-history">
								View All Transactions
							</MDBBtn>
						</div>
					)}
				</MDBCardBody>
			</MDBCard>
		</MDBContainer>

	);
}

export default Dashboard;
