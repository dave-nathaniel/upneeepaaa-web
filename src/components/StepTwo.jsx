import React, { useState, useEffect, forwardRef } from 'react';
import {
    Grid,
    TextField,
    Button,
    CircularProgress,
    Box,
    Typography,
    Alert
} from '@mui/material';
import { billAPI } from '../services/api';
import Swal from 'sweetalert2';

const StepTwo = forwardRef((props, ref) => {
    const { billerData } = props;

    const [formData, setFormData] = useState({
        details: '',
        amount: '',
    });

    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        address: '',
        verified: false
    });

    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState([]);

    // Reset form when biller data changes
    useEffect(() => {
        setFormData({
            details: '',
            amount: '',
        });
        setCustomerInfo({
            name: '',
            address: '',
            verified: false
        });
        setError(null);
    }, [billerData]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        // Clear verification when details change
        if (e.target.name === 'details' && customerInfo.verified) {
            setCustomerInfo({
                name: '',
                address: '',
                verified: false
            });
        }
    };

    const verifyCustomer = async () => {
        if (!formData.details) {
            setError('Please enter meter/account details');
            return;
        }

        try {
            setVerifying(true);
            setError(null);

            const verificationData = {
                billerId: billerData?.billerId,
                packageId: billerData?.packageId,
                accountNumber: formData.details
            };

            const response = await billAPI.verifyCustomer(verificationData);

            console.log(response)

            // Handle the new response format
            const customerName = response.customerName || response.customer || '';
            const customerAddress = response.customerAddress || 'Not available';

            setCustomerInfo({
                name: customerName,
                address: customerAddress,
                verified: true
            });

            Swal.fire({
                icon: 'success',
                title: 'Verification Successful',
                text: `Customer verified: ${customerName}`,
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Customer verification error:', error);
            setError(error.message || 'Verification failed. Please check the details and try again.');
            setCustomerInfo({
                name: '',
                address: '',
                verified: false
            });
        } finally {
            setVerifying(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form
        const errors = [];
        if (!formData.details) errors.push('details');
        if (!formData.amount) errors.push('amount');
        if (!customerInfo.verified) errors.push('verification');

        setFormErrors(errors);

        if (errors.length === 0) {
            // Pass data to parent component
            props.onSuccess && props.onSuccess({
                ...formData,
                customerName: customerInfo.name,
                customerAddress: customerInfo.address
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Form Validation Failed',
                text: 'Please fill in all required fields and verify customer details.',
            });
        }
    };

    return (
        <form ref={ref} onSubmit={handleSubmit}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box display="flex" alignItems="flex-end">
                        <TextField
                            fullWidth
                            name="details"
                            value={formData.details}
                            onChange={handleChange}
                            label="Meter/Account Details"
                            variant="standard"
                            size="normal"
                            required
                            error={formErrors.includes('details')}
                            helperText={formErrors.includes('details') ? "This field is required" : ""}
                            disabled={verifying}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={verifyCustomer}
                            disabled={!formData.details || verifying}
                            sx={{ ml: 1, mb: 1 }}
                        >
                            {verifying ? <CircularProgress size={24} /> : "Verify"}
                        </Button>
                    </Box>
                </Grid>

                {error && (
                    <Grid item xs={12}>
                        <Alert severity="error">{error}</Alert>
                    </Grid>
                )}

                {customerInfo.verified && (
                    <Grid item xs={12}>
                        <Alert severity="success">
                            <Typography variant="subtitle1">
                                <strong>Customer Name:</strong> {customerInfo.name}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Address:</strong> {customerInfo.address}
                            </Typography>
                        </Alert>
                    </Grid>
                )}

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        label="Amount"
                        variant="standard"
                        size="normal"
                        required
                        error={formErrors.includes('amount')}
                        helperText={formErrors.includes('amount') ? "This field is required" : ""}
                        disabled={!customerInfo.verified || verifying}
                        InputProps={{
                            startAdornment: <Typography variant="body1" sx={{ mr: 1 }}>₦</Typography>,
                        }}
                    />
                </Grid>

                {formErrors.includes('verification') && (
                    <Grid item xs={12}>
                        <Alert severity="warning">
                            Please verify the customer details before proceeding.
                        </Alert>
                    </Grid>
                )}
            </Grid>
        </form>
    );
});

export default StepTwo;