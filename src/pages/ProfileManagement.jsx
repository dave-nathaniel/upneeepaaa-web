import React, { useState, useEffect, useContext } from 'react';
import { 
    Grid, 
    TextField, 
    Button, 
    Card, 
    CardContent, 
    CardHeader, 
    Typography, 
    Box, 
    Switch, 
    FormControlLabel,
    CircularProgress,
    Alert,
    Divider,
    Paper
} from '@mui/material';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardHeader, MDBBtn, MDBSpinner } from 'mdb-react-ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faBell, faCheck, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { userAPI } from '../services/api';
import AuthContext from '../context/AuthContext';
import Swal from 'sweetalert2';

function ProfileManagement() {
    const { authUser } = useContext(AuthContext);

    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [notificationPreferences, setNotificationPreferences] = useState({
        emailNotifications: true,
        smsNotifications: false
    });

    const [loading, setLoading] = useState({
        profile: false,
        password: false,
        notifications: false,
        initial: true
    });

    const [errors, setErrors] = useState({
        profile: null,
        password: null,
        notifications: null
    });

    // Fetch user profile data when component mounts
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(prev => ({ ...prev, initial: true }));
                const data = await userAPI.getProfile();

                // Handle the new response format
                const fullName = data.first_name && data.last_name 
                    ? `${data.first_name} ${data.last_name}`
                    : data.first_name || data.last_name || '';

                setProfileData({
                    name: fullName,
                    email: data.email || '',
                    phone: data.phone || '',
                    address: data.profile?.address || ''
                });

                // Set default notification preferences
                // Note: The API doesn't provide notification preferences yet
                setNotificationPreferences({
                    emailNotifications: true,
                    smsNotifications: false
                });
            } catch (error) {
                console.error('Error fetching profile data:', error);
                setErrors(prev => ({ 
                    ...prev, 
                    profile: 'Failed to load profile data. Please try again.' 
                }));
            } finally {
                setLoading(prev => ({ ...prev, initial: false }));
            }
        };

        fetchProfileData();
    }, []);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNotificationChange = (e) => {
        const { name, checked } = e.target;
        setNotificationPreferences(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(prev => ({ ...prev, profile: true }));
            setErrors(prev => ({ ...prev, profile: null }));

            // The API expects firstname and lastname separately
            // Split the name into firstname and lastname
            const nameParts = profileData.name.split(' ');
            const firstname = nameParts[0] || '';
            const lastname = nameParts.slice(1).join(' ') || '';

            // Create the request data in the format expected by the API
            const requestData = {
                firstname,
                lastname,
                phone: profileData.phone,
                address: profileData.address
            };

            await userAPI.updateProfile(requestData);

            Swal.fire({
                icon: 'success',
                title: 'Profile Updated',
                text: 'Your profile information has been updated successfully.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            setErrors(prev => ({ 
                ...prev, 
                profile: error.message || 'Failed to update profile. Please try again.' 
            }));

            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: error.message || 'Failed to update profile. Please try again.'
            });
        } finally {
            setLoading(prev => ({ ...prev, profile: false }));
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        // Validate passwords
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setErrors(prev => ({ 
                ...prev, 
                password: 'New passwords do not match.' 
            }));
            return;
        }

        try {
            setLoading(prev => ({ ...prev, password: true }));
            setErrors(prev => ({ ...prev, password: null }));

            // The API expects current_password and new_password
            await userAPI.changePassword({
                current_password: passwordData.currentPassword,
                new_password: passwordData.newPassword
            });

            // Reset password fields
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

            Swal.fire({
                icon: 'success',
                title: 'Password Changed',
                text: 'Your password has been changed successfully.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Error changing password:', error);
            setErrors(prev => ({ 
                ...prev, 
                password: error.message || 'Failed to change password. Please try again.' 
            }));

            Swal.fire({
                icon: 'error',
                title: 'Password Change Failed',
                text: error.message || 'Failed to change password. Please try again.'
            });
        } finally {
            setLoading(prev => ({ ...prev, password: false }));
        }
    };

    const handleNotificationSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(prev => ({ ...prev, notifications: true }));
            setErrors(prev => ({ ...prev, notifications: null }));

            // The API doesn't have a specific endpoint for notification preferences yet
            // We'll store them in the user's profile for now
            // Split the name into firstname and lastname
            const nameParts = profileData.name.split(' ');
            const firstname = nameParts[0] || '';
            const lastname = nameParts.slice(1).join(' ') || '';

            // Create the request data in the format expected by the API
            const requestData = {
                firstname,
                lastname,
                phone: profileData.phone,
                address: profileData.address,
                // Include notification preferences in the metadata or custom fields
                // This might need to be adjusted based on the actual API implementation
                email_notifications: notificationPreferences.emailNotifications,
                sms_notifications: notificationPreferences.smsNotifications
            };

            await userAPI.updateProfile(requestData);

            Swal.fire({
                icon: 'success',
                title: 'Preferences Updated',
                text: 'Your notification preferences have been updated successfully.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Error updating notification preferences:', error);
            setErrors(prev => ({ 
                ...prev, 
                notifications: error.message || 'Failed to update preferences. Please try again.' 
            }));

            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: error.message || 'Failed to update preferences. Please try again.'
            });
        } finally {
            setLoading(prev => ({ ...prev, notifications: false }));
        }
    };

    return (
        <MDBContainer className="mt-5 pt-5">
            {loading.initial ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <MDBSpinner role='status'>
                        <span className='visually-hidden'>Loading...</span>
                    </MDBSpinner>
                </Box>
            ) : (
                <MDBRow className="d-flex justify-content-center">
                    <MDBCol size="12" md="10" lg="8">
                        <Typography variant="h4" component="h1" gutterBottom className="mb-4">
                            Profile Management
                        </Typography>

                        {/* Personal Information Card */}
                        <MDBCard className="mb-4 shadow-sm">
                            <MDBCardHeader className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <FontAwesomeIcon icon={faUser} className="me-3 text-primary" />
                                    <Typography variant="h6" component="div">
                                        Personal Information
                                    </Typography>
                                </div>
                                {loading.profile && <MDBSpinner size='sm' />}
                            </MDBCardHeader>
                            <MDBCardBody>
                                {errors.profile && (
                                    <Alert severity="error" className="mb-3">
                                        {errors.profile}
                                    </Alert>
                                )}

                                <Box component="form" onSubmit={handleProfileSubmit}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Full Name"
                                                name="name"
                                                value={profileData.name}
                                                onChange={handleProfileChange}
                                                required
                                                variant="outlined"
                                                disabled={loading.profile}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Email Address"
                                                name="email"
                                                type="email"
                                                value={profileData.email}
                                                onChange={handleProfileChange}
                                                required
                                                variant="outlined"
                                                disabled={loading.profile}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Phone Number"
                                                name="phone"
                                                value={profileData.phone}
                                                onChange={handleProfileChange}
                                                required
                                                variant="outlined"
                                                disabled={loading.profile}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Address"
                                                name="address"
                                                value={profileData.address}
                                                onChange={handleProfileChange}
                                                variant="outlined"
                                                disabled={loading.profile}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                type="submit"
                                                disabled={loading.profile}
                                                startIcon={loading.profile ? <CircularProgress size={20} /> : null}
                                            >
                                                Update Profile
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </MDBCardBody>
                        </MDBCard>

                        {/* Change Password Card */}
                        <MDBCard className="mb-4 shadow-sm">
                            <MDBCardHeader className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <FontAwesomeIcon icon={faLock} className="me-3 text-primary" />
                                    <Typography variant="h6" component="div">
                                        Change Password
                                    </Typography>
                                </div>
                                {loading.password && <MDBSpinner size='sm' />}
                            </MDBCardHeader>
                            <MDBCardBody>
                                {errors.password && (
                                    <Alert severity="error" className="mb-3">
                                        {errors.password}
                                    </Alert>
                                )}

                                <Box component="form" onSubmit={handlePasswordSubmit}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Current Password"
                                                name="currentPassword"
                                                type="password"
                                                value={passwordData.currentPassword}
                                                onChange={handlePasswordChange}
                                                required
                                                variant="outlined"
                                                disabled={loading.password}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="New Password"
                                                name="newPassword"
                                                type="password"
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordChange}
                                                required
                                                variant="outlined"
                                                disabled={loading.password}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Confirm New Password"
                                                name="confirmPassword"
                                                type="password"
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordChange}
                                                required
                                                variant="outlined"
                                                disabled={loading.password}
                                                error={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== ''}
                                                helperText={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== '' ? "Passwords don't match" : ""}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                type="submit"
                                                disabled={loading.password}
                                                startIcon={loading.password ? <CircularProgress size={20} /> : null}
                                            >
                                                Change Password
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </MDBCardBody>
                        </MDBCard>

                        {/* Notification Preferences Card */}
                        <MDBCard className="shadow-sm">
                            <MDBCardHeader className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <FontAwesomeIcon icon={faBell} className="me-3 text-primary" />
                                    <Typography variant="h6" component="div">
                                        Notification Preferences
                                    </Typography>
                                </div>
                                {loading.notifications && <MDBSpinner size='sm' />}
                            </MDBCardHeader>
                            <MDBCardBody>
                                {errors.notifications && (
                                    <Alert severity="error" className="mb-3">
                                        {errors.notifications}
                                    </Alert>
                                )}

                                <Box component="form" onSubmit={handleNotificationSubmit}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={notificationPreferences.emailNotifications}
                                                        onChange={handleNotificationChange}
                                                        name="emailNotifications"
                                                        color="primary"
                                                        disabled={loading.notifications}
                                                    />
                                                }
                                                label="Email Notifications"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={notificationPreferences.smsNotifications}
                                                        onChange={handleNotificationChange}
                                                        name="smsNotifications"
                                                        color="primary"
                                                        disabled={loading.notifications}
                                                    />
                                                }
                                                label="SMS Notifications"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                type="submit"
                                                disabled={loading.notifications}
                                                startIcon={loading.notifications ? <CircularProgress size={20} /> : null}
                                            >
                                                Update Preferences
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            )}
        </MDBContainer>
    )
}

export default ProfileManagement
