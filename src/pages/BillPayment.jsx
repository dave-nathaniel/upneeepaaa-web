import React, { useState } from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    MenuItem,
    Modal,
} from '@mui/material';
import Swal from 'sweetalert2';

function BillPayment() {
    const [formData, setFormData] = useState({
        category: '',
        details: '',
        amount: '',
    });
    const [showModal, setShowModal] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowModal(true);
    };

    const handleConfirm = () => {
        setShowModal(false);
        Swal.fire({
            title: 'Payment Successful',
            text: `Your payment of ${formData.amount} for ${formData.category} has been processed successfully!`,
            icon: 'success',
            confirmButtonText: 'Okay',
        });
        console.log('Form submitted:', formData);
    };

    const handleClose = () => {
        setShowModal(false);
    };

    return (
        <Container maxWidth="md" sx={{ py: 15 }}>
            <Typography variant="h4" gutterBottom>
                Bill Payment
            </Typography>
            <Card elevation={3}>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    fullWidth
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    label="Bill Category"
                                    required
                                >
                                    <MenuItem value="">Select Category</MenuItem>
                                    <MenuItem value="electricity">Electricity</MenuItem>
                                    <MenuItem value="water">Water</MenuItem>
                                    <MenuItem value="internet">Internet</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="details"
                                    value={formData.details}
                                    onChange={handleChange}
                                    label="Meter/Account Details"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    label="Amount"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    disabled={
                                        !formData.category ||
                                        !formData.details ||
                                        !formData.amount
                                    }
                                >
                                    Pay Now
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>

            <Modal open={showModal} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        p: 4,
                        borderRadius: 2,
                        boxShadow: 24,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Confirm Payment
                    </Typography>
                    <Typography sx={{ mb: 3 }}>
                        Are you sure you want to pay {formData.amount} for {formData.category}?
                    </Typography>
                    <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Button onClick={handleClose} variant="outlined">
                            Cancel
                        </Button>
                        <Button onClick={handleConfirm} variant="contained" color="primary">
                            Confirm
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Container>
    );
}

export default BillPayment;
