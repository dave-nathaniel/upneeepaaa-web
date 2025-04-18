import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Typography, Button } from '@mui/material';

function Footer() {
    return (
        <footer>
            <Container maxWidth="lg" sx={{ 
                py: 3, 
                mt: 5, 
                borderTop: '1px solid #ddd', 
                display: { xs: 'none', md: 'block' } 
            }}>
                <Grid container spacing={3} justifyContent="center">
                    <Grid item>
                        <Button component={Link} to="#" color="inherit" size="small">
                            Privacy Policy
                        </Button>
                    </Grid>
                    <Grid item>
                        <Typography variant="body2" color="text.secondary" align="center">
                            |
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button component={Link} to="#" color="inherit" size="small">
                            Terms of Service
                        </Button>
                    </Grid>
                </Grid>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                    © {new Date().getFullYear()} UpNeeePaaa. All rights reserved.
                </Typography>
            </Container>
        </footer>
    );
}

export default Footer;
