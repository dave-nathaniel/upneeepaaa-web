
import React, { useState, forwardRef, useEffect } from 'react';
import {
    Grid,
    TextField,
    Button,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Typography,
    Box,
    Divider,
    Paper,
    Alert,
    CircularProgress,
    Card,
    CardContent
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faMoneyBill, faWallet, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const StepThree = forwardRef((props, ref) => {
    const { paymentData, onSuccess } = props;

    const [formData, setFormData] = useState({
        paymentMethod: 'card',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolderName: '',
        saveCard: false
    });

    const [processing, setProcessing] = useState(false);
    const [formErrors, setFormErrors] = useState([]);

    const paymentMethods = [
        { id: 'card', label: 'Credit/Debit Card', icon: faCreditCard },
        { id: 'bank', label: 'Bank Transfer', icon: faMoneyBill },
        { id: 'wallet', label: 'Wallet', icon: faWallet }
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const validateForm = () => {
        const errors = [];

        if (formData.paymentMethod === 'card') {
            if (!formData.cardNumber) errors.push('cardNumber');
            if (!formData.expiryDate) errors.push('expiryDate');
            if (!formData.cvv) errors.push('cvv');
            if (!formData.cardHolderName) errors.push('cardHolderName');
        }

        setFormErrors(errors);
        return errors.length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // if (!validateForm()) {
        //     Swal.fire({
        //         icon: 'error',
        //         title: 'Form Validation Failed',
        //         text: 'Please fill in all required fields.',
        //     });
        //     return;
        // }

        setProcessing(true);

        // Simulate payment processing delay
        setTimeout(() => {
            // Call the onSuccess callback with payment method data
            onSuccess && onSuccess({
                paymentMethod: formData.paymentMethod,
                paymentDetails: formData.paymentMethod === 'card' 
                    ? `Card ending in ${formData.cardNumber.slice(-4)}` 
                    : formData.paymentMethod
            });

            setProcessing(false);
        }, 2000);
    };

    return (
        <form ref={ref} onSubmit={handleSubmit}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper elevation={0} sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
                        <Typography variant="subtitle1" gutterBottom>
                            <strong>Payment Summary</strong>
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Biller:</Typography>
                            <Typography variant="body2"><strong>{paymentData?.biller || 'N/A'}</strong></Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Customer:</Typography>
                            <Typography variant="body2"><strong>{paymentData?.customerName || 'N/A'}</strong></Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Account/Meter:</Typography>
                            <Typography variant="body2"><strong>{paymentData?.details || 'N/A'}</strong></Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle1">Amount:</Typography>
                            <Typography variant="subtitle1"><strong>₦{paymentData?.amount || '0'}</strong></Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </form>
    );
});

export default StepThree;
