import React, { useState, useEffect } from 'react';
import { 
    Container, 
    Grid, 
    TextField, 
    Button, 
    Box, 
    Typography, 
    Paper, 
    TableContainer, 
    Table, 
    TableHead, 
    TableBody, 
    TableRow, 
    TableCell, 
    TablePagination,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    InputAdornment,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { 
    MDBContainer, 
    MDBRow, 
    MDBCol, 
    MDBCard, 
    MDBCardBody, 
    MDBCardHeader, 
    MDBCardTitle, 
    MDBSpinner,
    MDBBtn
} from 'mdb-react-ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSearch, 
    faFileDownload, 
    faFilter, 
    faCalendarAlt, 
    faExclamationTriangle,
    faTimes
} from '@fortawesome/free-solid-svg-icons';
import { paymentAPI } from '../services/api';
// import { format } from 'date-fns';

function TransactionHistory() {
    // State for transactions data
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // State for pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    
    // State for filters
    const [filters, setFilters] = useState({
        status: '',
        startDate: '',
        endDate: '',
        search: ''
    });
    
    // State for selected transaction (for PDF download)
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    // Fetch transactions when component mounts or filters/pagination change
    useEffect(() => {
        fetchTransactions();
    }, [page, rowsPerPage, filters.status]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Prepare filter parameters
            const filterParams = {
                page: page + 1, // API uses 1-based indexing
                pageSize: rowsPerPage,
                status: filters.status || undefined,
                // Add date range and search filters when API supports them
            };
            
            const data = await paymentAPI.getTransactionHistory(filterParams);
            console.log(data)
            // Assuming the API returns { data: [...transactions], total_count: number }
            setTransactions(Array.isArray(data.transactions) ? data.transactions : []);
            setTotalCount(data.pagination.total_count || (Array.isArray(data.transactions) ? data.transactions.length : 0));
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setError('Failed to load transaction history. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearch = () => {
        setPage(0); // Reset to first page when searching
        fetchTransactions();
    };

    const handleClearFilters = () => {
        setFilters({
            status: '',
            startDate: '',
            endDate: '',
            search: ''
        });
        setPage(0);
        fetchTransactions();
    };

    const handleViewDetails = (transaction) => {
        setSelectedTransaction(transaction);
        setDetailsOpen(true);
    };

    const handleCloseDetails = () => {
        setDetailsOpen(false);
    };

    const handleDownloadPDF = (transaction) => {
        // In a real implementation, this would generate and download a PDF
        console.log('Downloading PDF for transaction:', transaction);
        alert(`PDF download for transaction ${transaction.reference} would start here.`);
    };

    // Helper function to get status color
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
            case 'success':
                return 'success';
            case 'pending':
                return 'warning';
            case 'failed':
                return 'danger';
            default:
                return 'info';
        }
    };

    return (
        <MDBContainer className="mt-5 pt-5">
            <MDBRow className="d-flex justify-content-center">
                <MDBCol size="12">
                    <Typography variant="h4" component="h1" gutterBottom className="mb-4">
                        Transaction History
                    </Typography>

                    {/* Filters and Search */}
                    <MDBCard className="mb-4 shadow-sm">
                        <MDBCardHeader>
                            <MDBCardTitle className="d-flex justify-content-between align-items-center">
                                <span>Filters</span>
                                <MDBBtn color="light" size="sm" onClick={handleClearFilters}>
                                    Clear Filters
                                </MDBBtn>
                            </MDBCardTitle>
                        </MDBCardHeader>
                        <MDBCardBody>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={3}>
                                    <FormControl fullWidth variant="outlined" size="small">
                                        <InputLabel id="status-filter-label">Status</InputLabel>
                                        <Select
                                            labelId="status-filter-label"
                                            id="status-filter"
                                            name="status"
                                            value={filters.status}
                                            onChange={handleFilterChange}
                                            label="Status"
                                        >
                                            <MenuItem value="">All</MenuItem>
                                            <MenuItem value="pending">Pending</MenuItem>
                                            <MenuItem value="completed">Completed</MenuItem>
                                            <MenuItem value="failed">Failed</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth
                                        id="start-date"
                                        label="Start Date"
                                        type="date"
                                        name="startDate"
                                        value={filters.startDate}
                                        onChange={handleFilterChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        size="small"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <FontAwesomeIcon icon={faCalendarAlt} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth
                                        id="end-date"
                                        label="End Date"
                                        type="date"
                                        name="endDate"
                                        value={filters.endDate}
                                        onChange={handleFilterChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        size="small"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <FontAwesomeIcon icon={faCalendarAlt} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth
                                        id="search"
                                        label="Search"
                                        type="text"
                                        name="search"
                                        value={filters.search}
                                        onChange={handleFilterChange}
                                        size="small"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <FontAwesomeIcon icon={faSearch} />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton 
                                                        edge="end" 
                                                        onClick={handleSearch}
                                                        disabled={loading}
                                                    >
                                                        <FontAwesomeIcon icon={faFilter} />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </MDBCardBody>
                    </MDBCard>

                    {/* Transactions Table */}
                    <MDBCard className="shadow-sm">
                        <MDBCardHeader>
                            <MDBCardTitle className="d-flex justify-content-between align-items-center">
                                <span>Transactions</span>
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
                                    No transaction history available. Your payments will appear here.
                                </Alert>
                            ) : (
                                <>
                                    <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 650 }} aria-label="transaction history table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>ID</TableCell>
                                                    <TableCell>Reference</TableCell>
                                                    <TableCell>Biller</TableCell>
                                                    <TableCell>Service</TableCell>
                                                    <TableCell>Amount</TableCell>
                                                    <TableCell>Date</TableCell>
                                                    <TableCell>Status</TableCell>
                                                    <TableCell>Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {transactions.map((transaction) => (
                                                    <TableRow key={transaction.id}>
                                                        <TableCell>{transaction.id}</TableCell>
                                                        <TableCell>{transaction.reference}</TableCell>
                                                        <TableCell>{transaction.biller}</TableCell>
                                                        <TableCell>{transaction.bill_item}</TableCell>
                                                        <TableCell>₦{transaction.amount?.toLocaleString()}</TableCell>
                                                        <TableCell>
                                                            {transaction.created_at ? 
                                                                new Date(transaction.created_at).toLocaleDateString() : 
                                                                'N/A'}
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className={`badge bg-${getStatusColor(transaction.status)}`}>
                                                                {transaction.status}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <IconButton 
                                                                size="small" 
                                                                onClick={() => handleViewDetails(transaction)}
                                                                title="View Details"
                                                            >
                                                                <FontAwesomeIcon icon={faSearch} />
                                                            </IconButton>
                                                            <IconButton 
                                                                size="small" 
                                                                onClick={() => handleDownloadPDF(transaction)}
                                                                title="Download PDF"
                                                            >
                                                                <FontAwesomeIcon icon={faFileDownload} />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25]}
                                        component="div"
                                        count={totalCount}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </>
                            )}
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>

            {/* Transaction Details Dialog */}
            <Dialog open={detailsOpen} onClose={handleCloseDetails} maxWidth="md" fullWidth>
                <DialogTitle>
                    <div className="d-flex justify-content-between align-items-center">
                        <span>Transaction Details</span>
                        <IconButton onClick={handleCloseDetails} size="small">
                            <FontAwesomeIcon icon={faTimes} />
                        </IconButton>
                    </div>
                </DialogTitle>
                <DialogContent>
                    {selectedTransaction && (
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Reference:</Typography>
                                <Typography variant="body1" gutterBottom>{selectedTransaction.reference}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Date:</Typography>
                                <Typography variant="body1" gutterBottom>
                                    {selectedTransaction.created_at ? 
                                        new Date(selectedTransaction.created_at).toLocaleString() : 
                                        'N/A'}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Biller:</Typography>
                                <Typography variant="body1" gutterBottom>{selectedTransaction.biller}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Service:</Typography>
                                <Typography variant="body1" gutterBottom>{selectedTransaction.bill_item}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Customer ID:</Typography>
                                <Typography variant="body1" gutterBottom>{selectedTransaction.identifier}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Amount:</Typography>
                                <Typography variant="body1" gutterBottom>₦{selectedTransaction.amount?.toLocaleString()}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Status:</Typography>
                                <Typography variant="body1" gutterBottom>
                                    <span className={`badge bg-${getStatusColor(selectedTransaction.status)}`}>
                                        {selectedTransaction.status}
                                    </span>
                                </Typography>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDetails}>Close</Button>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        startIcon={<FontAwesomeIcon icon={faFileDownload} />}
                        onClick={() => handleDownloadPDF(selectedTransaction)}
                    >
                        Download PDF
                    </Button>
                </DialogActions>
            </Dialog>
        </MDBContainer>
    );
}

export default TransactionHistory;