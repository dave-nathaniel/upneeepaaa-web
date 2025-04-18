import React, { useState, useRef } from 'react';
import {
    Typography,
    Button,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Paper,
    Box,
    CircularProgress
} from '@mui/material';
import Swal from 'sweetalert2';

import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBTypography, MDBCardHeader, MDBCardFooter } from 'mdb-react-ui-kit';

import StepOne from '../components/StepOne';
import StepTwo from '../components/StepTwo';
import StepThree from '../components/StepThree';
import { billAPI, paymentAPI } from '../services/api';

const steps = [
    {
        "label": "Biller Details",
        "description": "Select bill category, biller, and service package",
        "optional": false,
    },
    {
        "label": "Customer Verification",
        "description": "Enter meter/account details and verify customer",
        "optional": false,
    },
    {
        "label": "Payment",
        "description": "Complete payment process",
        "optional": false,
    },
];

function BillPayment() {
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [paymentData, setPaymentData] = useState({
        // Step 1 data
        category: '',
        categoryId: '',
        biller: '',
        billerId: '',
        package: '',
        packageId: '',

        // Step 2 data
        details: '',
        amount: '',
        customerName: '',
        customerAddress: '',

        // Step 3 data
        paymentMethod: '',
        reference: '',
        status: ''
    });

    const stepOneFormRef = useRef(null);
    const stepTwoFormRef = useRef(null);
    const stepThreeFormRef = useRef(null);

    // Handle step one completion
    const handleStepOneSuccess = (data) => {
        setPaymentData(prev => ({
            ...prev,
            ...data
        }));
        setActiveStep(1);
    };

    // Handle step two completion
    const handleStepTwoSuccess = (data) => {
        console.log(data);
		setPaymentData(prev => ({
            ...prev,
            ...data
        }));
        setActiveStep(2);
    };

    // Handle step three completion (payment)
    const handleStepThreeSuccess = async (data) => {
        try {
            setLoading(true);

            // Combine all data for payment processing
            const finalPaymentData = {
                ...paymentData,
                ...data,
                // Add payment gateway ID if provided in the payment method data
                paymentGatewayId: data.paymentGatewayId || 1 // Default to first gateway if not specified
            };

            // Process payment using the new payment API
            const response = await paymentAPI.createPayment(finalPaymentData);

            setPaymentData(prev => ({
                ...prev,
                ...data,
                reference: response.reference,
                status: response.status || 'pending'
            }));

            Swal.fire({
                icon: 'success',
                title: 'Payment Successful',
                text: `Your payment has been initiated. Reference: ${response.reference}`,
                footer: response.payment_url ? 
                    `<a href="${response.payment_url}" target="_blank">Complete payment on gateway</a>` : 
                    ''
            });

            if (response.payment_url) {
                // If there's a payment URL, open it in a new tab
                window.open(response.payment_url, '_blank');
            }

            setActiveStep(3); // Move to completion step
        } catch (error) {
            console.error('Payment error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Payment Failed',
                text: error.message || 'An error occurred during payment processing. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (activeStep === 0) {
            // Trigger StepOne form submission
            if (stepOneFormRef.current) {
                stepOneFormRef.current.dispatchEvent(new Event('submit', { 
                    cancelable: true, 
                    bubbles: true 
                }));
            }
        } else if (activeStep === 1) {
            // Trigger StepTwo form submission
            if (stepTwoFormRef.current) {
                stepTwoFormRef.current.dispatchEvent(new Event('submit', { 
                    cancelable: true, 
                    bubbles: true 
                }));
            }
        } else if (activeStep === 2) {
            // Trigger StepThree form submission
            if (stepThreeFormRef.current) {
                stepThreeFormRef.current.dispatchEvent(new Event('submit', { 
                    cancelable: true, 
                    bubbles: true 
                }));
            }
        } else {
            // Proceed to the next step
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setPaymentData({
            category: '',
            categoryId: '',
            biller: '',
            billerId: '',
            package: '',
            packageId: '',
            details: '',
            amount: '',
            customerName: '',
            customerAddress: '',
            paymentMethod: '',
            reference: '',
            status: ''
        });
        setActiveStep(0);
    };

    return (
        <MDBContainer className="mt-5 pt-5">
            <MDBRow className="d-flex justify-content-center">

                <MDBCol size="12" md={8} lg={8} className="pb-3">
                    <Stepper activeStep={activeStep} orientation="vertical">
                        {steps.map((step, index) => (
                            <Step key={step.label}>
                                <StepLabel>
                                    <MDBTypography className="card-title" tag='h5'>
                                        {step.label}
                                    </MDBTypography>
                                </StepLabel>
                                <StepContent>

                                    <MDBCard className="shadow-0">
                                        <MDBCardHeader>
                                            <Typography variant="caption">{step.description}</Typography>
                                        </MDBCardHeader>
                                        <MDBCardBody>
                                            {index === 0 && (
                                                <StepOne 
                                                    ref={stepOneFormRef} 
                                                    onSuccess={handleStepOneSuccess} 
                                                />
                                            )}
                                            {index === 1 && (
                                                <StepTwo 
                                                    ref={stepTwoFormRef} 
                                                    onSuccess={handleStepTwoSuccess}
                                                    billerData={{
                                                        categoryId: paymentData.categoryId,
                                                        billerId: paymentData.billerId,
                                                        packageId: paymentData.packageId
                                                    }}
                                                />
                                            )}
                                            {index === 2 && (
                                                <StepThree 
                                                    ref={stepThreeFormRef} 
                                                    onSuccess={handleStepThreeSuccess}
                                                    paymentData={paymentData}
                                                />
                                            )}
                                        </MDBCardBody>
                                        <MDBCardFooter>
                                           <Button
                                                variant="contained"
                                                onClick={handleNext}
                                                sx={{ mt: 1, mr: 1 }}
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <CircularProgress size={24} />
                                                ) : (
                                                    index === steps.length - 1 ? "Complete Payment" : "Continue"
                                                )}
                                            </Button>
                                            <Button
                                                disabled={index === 0 || loading}
                                                onClick={handleBack}
                                                sx={{ mt: 1, mr: 1 }}
                                            >
                                                Back
                                            </Button>
                                        </MDBCardFooter>
                                    </MDBCard>
                                </StepContent>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length && (
                        <Paper square elevation={0} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Payment Completed Successfully
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body1">
                                    <strong>Reference:</strong> {paymentData.reference}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Amount:</strong> ₦{paymentData.amount}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Biller:</strong> {paymentData.biller}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Customer:</strong> {paymentData.customerName}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Status:</strong> {paymentData.status}
                                </Typography>
                            </Box>
                            <Button 
                                variant="contained" 
                                onClick={handleReset} 
                                sx={{ mt: 1, mr: 1 }}
                            >
                                Make Another Payment
                            </Button>
                        </Paper>
                    )}
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}

export default BillPayment;
