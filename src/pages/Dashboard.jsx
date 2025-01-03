import React from 'react';
import UsageChart from '../components/UsageChart';
import { Container, Grid, Card, CardContent, Typography, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faBolt, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';

function Dashboard() {
  const transactions = [
    { id: 1, date: '2023-10-01', description: 'Electricity Bill', amount: 150 },
    { id: 2, date: '2023-09-15', description: 'Water Bill', amount: 50 },
    { id: 3, date: '2023-09-01', description: 'Internet Bill', amount: 75 },
  ];

  const quickActions = [
    {
      title: 'Pay Bills',
      description: 'Quick and secure bill payments',
      icon: faBolt,
      link: '/bill-payment',
    },
    {
      title: 'Schedule Payment',
      description: 'Automate your recurring payments',
      icon: faCalendarCheck,
      link: '/bill-payment',
    },
    {
      title: 'Usage Analytics',
      description: 'Detailed power consumption insights',
      icon: faChartLine,
      link: '/analytics',
    },
  ];

  return (
    <Container sx={{ py: 15 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{
          	textAlign: "center",
          }}>
            Power Usage Monitoring
          </Typography>
          <UsageChart />
        </CardContent>
      </Card>

      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{
          	textAlign: "center",
          }}>
            Recent Transactions
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>${transaction.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Grid container spacing={3} mt={4}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', p: 2 }}>
              <FontAwesomeIcon icon={action.icon} size="3x" style={{ color: '#1976d2', marginBottom: '16px' }} />
              <Typography variant="h6">{action.title}</Typography>
              <Typography variant="body2" color="textSecondary" mb={2}>
                {action.description}
              </Typography>
              <Button variant="outlined" href={action.link} sx={{ borderRadius: '50px', px: 4 }}>
               	{action.title}
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>


    </Container>
  );
}

export default Dashboard;
