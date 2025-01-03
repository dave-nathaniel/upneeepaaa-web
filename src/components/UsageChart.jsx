import React, { useState } from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const UsageChart = () => {
	const [timeRange, setTimeRange] = useState('month');

	const data = {
		month: [
			{ date: '2024-01', usage: 400 },
			{ date: '2024-02', usage: 380 },
			{ date: '2024-03', usage: 420 },
			{ date: '2024-04', usage: 350 },
			{ date: '2024-05', usage: 390 },
			{ date: '2024-06', usage: 410 }
		],
		week: [
			{ date: 'Mon', usage: 58 },
			{ date: 'Tue', usage: 62 },
			{ date: 'Wed', usage: 55 },
			{ date: 'Thu', usage: 59 },
			{ date: 'Fri', usage: 65 },
			{ date: 'Sat', usage: 52 },
			{ date: 'Sun', usage: 48 }
		],
		day: [
			{ date: '00:00', usage: 15 },
			{ date: '04:00', usage: 12 },
			{ date: '08:00', usage: 25 },
			{ date: '12:00', usage: 30 },
			{ date: '16:00', usage: 35 },
			{ date: '20:00', usage: 28 }
		]
	};

	return (
		<>
			<div className="d-flex justify-content-around mb-3">
				<ButtonGroup size="sm" style={{ width: '90%'}}>
					<Button
						variant={timeRange === 'day' ? 'primary' : 'outline-primary'}
						onClick={() => setTimeRange('day')}
					>
						Day
					</Button>
					<Button
						variant={timeRange === 'week' ? 'primary' : 'outline-primary'}
						onClick={() => setTimeRange('week')}
					>
						Week
					</Button>
					<Button
						variant={timeRange === 'month' ? 'primary' : 'outline-primary'}
						onClick={() => setTimeRange('month')}
					>
						Month
					</Button>
				</ButtonGroup>
			</div>

			<div style={{ width: '100%', height: 300 }}>
				<ResponsiveContainer>
					<LineChart data={data[timeRange]} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
		</>
	);
};

export default UsageChart;