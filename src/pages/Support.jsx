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
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function Support() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Handle form submission logic here
    };

    const supportChannels = [
        {
            title: 'Email',
            contact: 'support@upneeepaaa.com',
        },
        {
            title: 'Phone',
            contact: '+123 456 7890',
        },
    ];

    const faqs = [
        {
            question: 'How do I pay my bills?',
            answer:
                'You can pay your bills by navigating to the "Bill Payment" section and following the instructions.',
        },
        {
            question: 'How can I monitor my power usage?',
            answer:
                'You can monitor your power usage by checking the "Power Usage Monitoring" section in your dashboard.',
        },
        {
            question: 'How do I schedule a payment?',
            answer:
                'You can schedule a payment by navigating to the "Bill Payment" section and selecting the "Schedule Payment" option.',
        },
    ];

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            <Container maxWidth="md" sx={{ py: 15, flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                    Contact Us
                </Typography>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {supportChannels.map((channel, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                            <Card elevation={3}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {channel.title}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        {channel.contact}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Card elevation={3} sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Send Us a Message
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        name="name"
                                        label="Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        type="email"
                                        name="email"
                                        label="Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        name="subject"
                                        label="Subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        name="message"
                                        label="Message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                    >
                                        Send Message
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>

                <Typography variant="h5" gutterBottom>
                    FAQ
                </Typography>
                <Accordion>
                    {faqs.map((faq, index) => (
                        <Accordion key={index}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>                              
                                <Typography>{faq.question}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>{faq.answer}</Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Accordion>
            </Container>
        </Box>
    );
}

export default Support;
