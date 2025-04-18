import React, { useState, useEffect } from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MDBBtn, MDBBtnGroup, MDBSpinner } from 'mdb-react-ui-kit';
import { dashboardAPI } from '../services/api';
import { Alert, Box, Typography } from '@mui/material';

const UsageChart = () => {
	const [timeRange, setTimeRange] = useState('month');
	const [usageData, setUsageData] = useState({
		month: [],
		week: [],
		day: []
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Fetch usage data when component mounts or timeRange changes
	useEffect(() => {
		const fetchUsageData = async () => {
			try {
				setLoading(true);
				setError(null);
				const data = await dashboardAPI.getUsageData(timeRange);

				// Update only the requested time range data
				setUsageData(prev => ({
					...prev,
					[timeRange]: data
				}));
			} catch (error) {
				console.error(`Error fetching ${timeRange} usage data:`, error);
				setError(`Failed to load usage data. ${error.message}`);
			} finally {
				setLoading(false);
			}
		};

		// Only fetch if we don't already have data for this time range
		if (usageData[timeRange].length === 0) {
			fetchUsageData();
		}
	}, [timeRange]);

	const handleTimeRangeChange = (range) => {
		setTimeRange(range);
	};

	return (
		<>
			<div className="d-flex justify-content-between align-items-center mb-3">
				<Typography variant="subtitle2" color="textSecondary">
					{timeRange === 'day' ? 'Today\'s Usage' : 
					 timeRange === 'week' ? 'This Week\'s Usage' : 
					 'Monthly Usage'}
				</Typography>

				<MDBBtnGroup shadow="0" aria-label="Time range selection">
					{Object.keys(usageData).map((period, index) => (
						<MDBBtn
							color={timeRange === period ? 'primary' : 'secondary'} 
							onClick={() => handleTimeRangeChange(period)}
							key={"pum-" + index}
							outline={timeRange !== period}
							disabled={loading}
						>
							{period.charAt(0).toUpperCase() + period.slice(1)}
						</MDBBtn>
					))}
				</MDBBtnGroup>
			</div>

			{loading ? (
				<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
					<MDBSpinner role='status'>
						<span className='visually-hidden'>Loading...</span>
					</MDBSpinner>
				</Box>
			) : error ? (
				<Alert severity="error" sx={{ height: 300, display: 'flex', alignItems: 'center' }}>
					{error}
				</Alert>
			) : usageData[timeRange].length === 0 ? (
				<Alert severity="info" sx={{ height: 300, display: 'flex', alignItems: 'center' }}>
					No usage data available for this time period.
				</Alert>
			) : (
				<div style={{ width: '100%', height: 300 }}>
					<ResponsiveContainer>
						<LineChart data={usageData[timeRange]} margin={{ top: 5, right: 0, bottom: 5, left: 0 }}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="date" />
							<YAxis />
							<Tooltip />
							<Line 
								type="monotone" 
								dataKey="usage" 
								stroke="#ff6b35" 
								strokeWidth={2}
								dot={{ stroke: '#ff6b35', strokeWidth: 2, r: 4 }}
								activeDot={{ r: 6 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			)}
		</>
	);
};

export default UsageChart;
