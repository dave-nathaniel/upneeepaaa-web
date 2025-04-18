import React, { useState, useEffect } from 'react';
import { 
    Grid, 
    TextField, 
    Button, 
    Typography, 
    Paper, 
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    Card,
    CardContent,
    CardActions,
    Chip
} from '@mui/material';
import { 
    MDBContainer, 
    MDBRow, 
    MDBCol, 
    MDBCard, 
    MDBCardBody, 
    MDBCardHeader, 
    MDBCardTitle, 
    MDBCardFooter,
    MDBSpinner,
    MDBBtn
} from 'mdb-react-ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCalendarAlt, 
    faPlus, 
    faTimes, 
    faCheck, 
    faPause,
    faPlay,
    faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { paymentAPI, billAPI } from '../services/api';
import Swal from 'sweetalert2';

function Schedule() {
    // State for subscriptions
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // State for subscription creation
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [creatingSubscription, setCreatingSubscription] = useState(false);
    
    // State for subscription form
    const [subscriptionForm, setSubscriptionForm] = useState({
        billCategory: '',
        billerId: '',
        packageId: '',
        planId: ''
    });
    
    // State for available data
    const [categories, setCategories] = useState([]);
    const [billers, setBillers] = useState([]);
    const [packages, setPackages] = useState([]);
    const [plans, setPlans] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState({
        categories: false,
        billers: false,
        packages: false,
        plans: false
    });

    // Fetch subscriptions when component mounts
    useEffect(() => {
        fetchSubscriptions();
        fetchCategories();
        fetchPlans();
    }, []);

    // Fetch billers when category changes
    useEffect(() => {
        if (subscriptionForm.billCategory) {
            fetchBillers(subscriptionForm.billCategory);
        }
    }, [subscriptionForm.billCategory]);

    // Fetch packages when biller changes
    useEffect(() => {
        if (subscriptionForm.billerId) {
            fetchPackages(subscriptionForm.billerId);
        }
    }, [subscriptionForm.billerId]);

    const fetchSubscriptions = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await paymentAPI.getUserSubscriptions();
            setSubscriptions(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
            setError('Failed to load subscriptions. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            setLoadingOptions(prev => ({ ...prev, categories: true }));
            const data = await billAPI.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load bill categories. Please try again.',
            });
        } finally {
            setLoadingOptions(prev => ({ ...prev, categories: false }));
        }
    };

    const fetchBillers = async (categorySlug) => {
        try {
            setLoadingOptions(prev => ({ ...prev, billers: true }));
            setBillers([]);
            setPackages([]);
            setSubscriptionForm(prev => ({
                ...prev,
                billerId: '',
                packageId: ''
            }));
            
            const data = await billAPI.getBillers(categorySlug);
            setBillers(data);
        } catch (error) {
            console.error('Error fetching billers:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load billers. Please try again.',
            });
        } finally {
            setLoadingOptions(prev => ({ ...prev, billers: false }));
        }
    };

    const fetchPackages = async (billerId) => {
        try {
            setLoadingOptions(prev => ({ ...prev, packages: true }));
            setPackages([]);
            setSubscriptionForm(prev => ({
                ...prev,
                packageId: ''
            }));
            
            // Find the biller to get its slug
            const biller = billers.find(b => b.id === billerId);
            if (!biller) {
                throw new Error('Selected biller not found');
            }
            
            const billerSlug = biller.short_name || biller.biller_code;
            const data = await billAPI.getPackages(billerSlug);
            setPackages(data);
        } catch (error) {
            console.error('Error fetching packages:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load service packages. Please try again.',
            });
        } finally {
            setLoadingOptions(prev => ({ ...prev, packages: false }));
        }
    };

    const fetchPlans = async () => {
        try {
            setLoadingOptions(prev => ({ ...prev, plans: true }));
            const data = await paymentAPI.getSubscriptionPlans();
            setPlans(data);
        } catch (error) {
            console.error('Error fetching subscription plans:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load subscription plans. Please try again.',
            });
        } finally {
            setLoadingOptions(prev => ({ ...prev, plans: false }));
        }
    };

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setSubscriptionForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateSubscription = async () => {
        try {
            setCreatingSubscription(true);
            
            // Validate form
            if (!subscriptionForm.packageId || !subscriptionForm.planId) {
                Swal.fire({
                    icon: 'error',
                    title: 'Form Validation Failed',
                    text: 'Please select a service package and subscription plan.',
                });
                return;
            }
            
            const response = await paymentAPI.createSubscription({
                billItemId: subscriptionForm.packageId,
                planId: subscriptionForm.planId
            });
            
            // If there's a payment URL, open it in a new tab
            if (response.authorization_url) {
                window.open(response.authorization_url, '_blank');
            }
            
            Swal.fire({
                icon: 'success',
                title: 'Subscription Created',
                text: 'Your subscription has been created successfully.',
            });
            
            // Close dialog and refresh subscriptions
            setCreateDialogOpen(false);
            fetchSubscriptions();
            
            // Reset form
            setSubscriptionForm({
                billCategory: '',
                billerId: '',
                packageId: '',
                planId: ''
            });
        } catch (error) {
            console.error('Error creating subscription:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to create subscription. Please try again.',
            });
        } finally {
            setCreatingSubscription(false);
        }
    };

    const handleCancelSubscription = async (subscriptionId) => {
        try {
            // Confirm cancellation
            const result = await Swal.fire({
                icon: 'warning',
                title: 'Cancel Subscription',
                text: 'Are you sure you want to cancel this subscription?',
                showCancelButton: true,
                confirmButtonText: 'Yes, cancel it',
                cancelButtonText: 'No, keep it'
            });
            
            if (result.isConfirmed) {
                setLoading(true);
                await paymentAPI.cancelSubscription(subscriptionId);
                
                Swal.fire({
                    icon: 'success',
                    title: 'Subscription Cancelled',
                    text: 'Your subscription has been cancelled successfully.',
                });
                
                // Refresh subscriptions
                fetchSubscriptions();
            }
        } catch (error) {
            console.error('Error cancelling subscription:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to cancel subscription. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleReactivateSubscription = async (subscriptionId) => {
        try {
            // Confirm reactivation
            const result = await Swal.fire({
                icon: 'question',
                title: 'Reactivate Subscription',
                text: 'Are you sure you want to reactivate this subscription?',
                showCancelButton: true,
                confirmButtonText: 'Yes, reactivate it',
                cancelButtonText: 'No, keep it inactive'
            });
            
            if (result.isConfirmed) {
                setLoading(true);
                await paymentAPI.reactivateSubscription(subscriptionId);
                
                Swal.fire({
                    icon: 'success',
                    title: 'Subscription Reactivated',
                    text: 'Your subscription has been reactivated successfully.',
                });
                
                // Refresh subscriptions
                fetchSubscriptions();
            }
        } catch (error) {
            console.error('Error reactivating subscription:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to reactivate subscription. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    // Helper function to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    // Helper function to get status color
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'success';
            case 'inactive':
            case 'cancelled':
                return 'danger';
            case 'pending':
                return 'warning';
            default:
                return 'info';
        }
    };

    return (
        <MDBContainer className="mt-5 pt-5">
            <MDBRow className="d-flex justify-content-center">
                <MDBCol size="12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <Typography variant="h4" component="h1">
                            Scheduled Payments
                        </Typography>
                        <MDBBtn 
                            color="primary" 
                            onClick={() => setCreateDialogOpen(true)}
                            disabled={loading}
                        >
                            <FontAwesomeIcon icon={faPlus} className="me-2" />
                            New Subscription
                        </MDBBtn>
                    </div>

                    {/* Subscriptions List */}
                    {error ? (
                        <Alert severity="error" className="mb-4">
                            <div className="d-flex align-items-center">
                                <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                                {error}
                            </div>
                        </Alert>
                    ) : loading ? (
                        <div className="d-flex justify-content-center my-5">
                            <MDBSpinner role='status'>
                                <span className='visually-hidden'>Loading...</span>
                            </MDBSpinner>
                        </div>
                    ) : subscriptions.length === 0 ? (
                        <Alert severity="info" className="mb-4">
                            You don't have any active subscriptions. Create a new subscription to schedule recurring payments.
                        </Alert>
                    ) : (
                        <Grid container spacing={3}>
                            {subscriptions.map((subscription) => (
                                <Grid item xs={12} md={6} lg={4} key={subscription.id}>
                                    <Card className="h-100 shadow-sm">
                                        <CardContent>
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <Typography variant="h6" component="div">
                                                    {subscription.bill_item?.name || 'Subscription'}
                                                </Typography>
                                                <Chip 
                                                    label={subscription.status} 
                                                    color={getStatusColor(subscription.status) === 'success' ? 'success' : 
                                                           getStatusColor(subscription.status) === 'warning' ? 'warning' : 
                                                           getStatusColor(subscription.status) === 'danger' ? 'error' : 'default'} 
                                                    size="small" 
                                                />
                                            </div>
                                            
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                <strong>Biller:</strong> {subscription.bill_item?.biller || 'N/A'}
                                            </Typography>
                                            
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                <strong>Plan:</strong> {subscription.plan?.name || 'N/A'} ({subscription.plan?.interval || 'N/A'})
                                            </Typography>
                                            
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                <strong>Amount:</strong> ₦{subscription.plan?.amount?.toLocaleString() || '0'}
                                            </Typography>
                                            
                                            <Divider sx={{ my: 1.5 }} />
                                            
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                <strong>Start Date:</strong> {formatDate(subscription.start_date)}
                                            </Typography>
                                            
                                            {subscription.next_payment_date && (
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    <strong>Next Payment:</strong> {formatDate(subscription.next_payment_date)}
                                                </Typography>
                                            )}
                                        </CardContent>
                                        <CardActions>
                                            {subscription.status?.toLowerCase() === 'active' ? (
                                                <Button 
                                                    size="small" 
                                                    color="error" 
                                                    startIcon={<FontAwesomeIcon icon={faPause} />}
                                                    onClick={() => handleCancelSubscription(subscription.id)}
                                                >
                                                    Cancel
                                                </Button>
                                            ) : (
                                                <Button 
                                                    size="small" 
                                                    color="success" 
                                                    startIcon={<FontAwesomeIcon icon={faPlay} />}
                                                    onClick={() => handleReactivateSubscription(subscription.id)}
                                                    disabled={subscription.status?.toLowerCase() !== 'inactive' && subscription.status?.toLowerCase() !== 'cancelled'}
                                                >
                                                    Reactivate
                                                </Button>
                                            )}
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </MDBCol>
            </MDBRow>

            {/* Create Subscription Dialog */}
            <Dialog open={createDialogOpen} onClose={() => !creatingSubscription && setCreateDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <div className="d-flex justify-content-between align-items-center">
                        <span>Create New Subscription</span>
                        <IconButton onClick={() => !creatingSubscription && setCreateDialogOpen(false)} size="small" disabled={creatingSubscription}>
                            <FontAwesomeIcon icon={faTimes} />
                        </IconButton>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth disabled={loadingOptions.categories || creatingSubscription}>
                                <InputLabel id="bill-category-label">Bill Category</InputLabel>
                                <Select
                                    labelId="bill-category-label"
                                    id="bill-category"
                                    name="billCategory"
                                    value={subscriptionForm.billCategory}
                                    onChange={handleFormChange}
                                    label="Bill Category"
                                >
                                    <MenuItem value="">
                                        <em>Select a category</em>
                                    </MenuItem>
                                    {categories.map((category) => (
                                        <MenuItem key={category.id} value={category.slug}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth disabled={!subscriptionForm.billCategory || loadingOptions.billers || creatingSubscription}>
                                <InputLabel id="biller-label">Biller</InputLabel>
                                <Select
                                    labelId="biller-label"
                                    id="biller"
                                    name="billerId"
                                    value={subscriptionForm.billerId}
                                    onChange={handleFormChange}
                                    label="Biller"
                                >
                                    <MenuItem value="">
                                        <em>Select a biller</em>
                                    </MenuItem>
                                    {billers.map((biller) => (
                                        <MenuItem key={biller.id} value={biller.id}>
                                            {biller.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth disabled={!subscriptionForm.billerId || loadingOptions.packages || creatingSubscription}>
                                <InputLabel id="package-label">Service Package</InputLabel>
                                <Select
                                    labelId="package-label"
                                    id="package"
                                    name="packageId"
                                    value={subscriptionForm.packageId}
                                    onChange={handleFormChange}
                                    label="Service Package"
                                >
                                    <MenuItem value="">
                                        <em>Select a package</em>
                                    </MenuItem>
                                    {packages.map((pkg) => (
                                        <MenuItem key={pkg.id} value={pkg.id}>
                                            {pkg.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth disabled={loadingOptions.plans || creatingSubscription}>
                                <InputLabel id="plan-label">Subscription Plan</InputLabel>
                                <Select
                                    labelId="plan-label"
                                    id="plan"
                                    name="planId"
                                    value={subscriptionForm.planId}
                                    onChange={handleFormChange}
                                    label="Subscription Plan"
                                >
                                    <MenuItem value="">
                                        <em>Select a plan</em>
                                    </MenuItem>
                                    {plans.map((plan) => (
                                        <MenuItem key={plan.id} value={plan.id}>
                                            {plan.name} - ₦{plan.amount?.toLocaleString() || '0'} ({plan.interval})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => !creatingSubscription && setCreateDialogOpen(false)} disabled={creatingSubscription}>
                        Cancel
                    </Button>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleCreateSubscription}
                        disabled={creatingSubscription || !subscriptionForm.packageId || !subscriptionForm.planId}
                        startIcon={creatingSubscription ? <MDBSpinner size="sm" /> : <FontAwesomeIcon icon={faCheck} />}
                    >
                        {creatingSubscription ? 'Creating...' : 'Create Subscription'}
                    </Button>
                </DialogActions>
            </Dialog>
        </MDBContainer>
    );
}

export default Schedule;