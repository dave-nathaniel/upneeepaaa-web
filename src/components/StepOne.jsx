import React, { useState, useEffect, forwardRef } from 'react';
import {
	Grid,
	TextField,
	Button,
	Autocomplete,
	CircularProgress
} from '@mui/material';
import { billAPI } from '../services/api';
import Swal from 'sweetalert2';

const StepOne = forwardRef((props, ref) => {
	const [billCategories, setBillCategories] = useState([]);
	const [billers, setBillers] = useState([]);
	const [billerPackages, setBillerPackages] = useState([]);
	const [loading, setLoading] = useState({
		categories: false,
		billers: false,
		packages: false
	});

	const [formData, setFormData] = useState({
		category: '',
		categoryId: '',
		biller: '',
		billerId: '',
		package: '',
		packageId: '',
	});

	const [formErrors, setFormErrors] = useState([]);

	// Fetch bill categories on component mount
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				setLoading(prev => ({ ...prev, categories: true }));
				const data = await billAPI.getCategories();
				const formattedCategories = data.map(category => ({
					label: category.name,
					id: category.id,
					slug: category.slug
				}));
				setBillCategories(formattedCategories);
			} catch (error) {
				console.error('Error fetching bill categories:', error);
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: 'Failed to load bill categories. Please try again.',
				});
			} finally {
				setLoading(prev => ({ ...prev, categories: false }));
			}
		};

		fetchCategories();
	}, []);

	// Fetch billers when category changes
	useEffect(() => {
		if (formData.categoryId) {
			const fetchBillers = async () => {
				try {
					setLoading(prev => ({ ...prev, billers: true }));
					setBillers([]); // Clear previous billers
					setBillerPackages([]); // Clear previous packages
					setFormData(prev => ({ 
						...prev, 
						biller: '', 
						billerId: '',
						package: '',
						packageId: ''
					}));

					// Get the category slug from the selected category
					const selectedCategory = billCategories.find(cat => cat.id === formData.categoryId);
					if (!selectedCategory) {
						throw new Error('Selected category not found');
					}

					const data = await billAPI.getBillers(selectedCategory.slug);
					const formattedBillers = data.map(biller => ({
						label: biller.name,
						id: biller.id,
						code: biller.biller_code,
						shortName: biller.short_name
					}));
					setBillers(formattedBillers);
				} catch (error) {
					console.error('Error fetching billers:', error);
					Swal.fire({
						icon: 'error',
						title: 'Error',
						text: 'Failed to load billers. Please try again.',
					});
				} finally {
					setLoading(prev => ({ ...prev, billers: false }));
				}
			};

			fetchBillers();
		}
	}, [formData.categoryId, billCategories]);

	// Fetch packages when biller changes
	useEffect(() => {
		if (formData.billerId) {
			const fetchPackages = async () => {
				try {
					setLoading(prev => ({ ...prev, packages: true }));
					setBillerPackages([]); // Clear previous packages
					setFormData(prev => ({ 
						...prev, 
						package: '',
						packageId: ''
					}));

					// Get the biller short name or code to use as the slug
					const selectedBiller = billers.find(b => b.id === formData.billerId);
					if (!selectedBiller) {
						throw new Error('Selected biller not found');
					}

					// Use the biller's short name or code as the slug
					const billerSlug = selectedBiller.shortName || selectedBiller.code;

					const data = await billAPI.getPackages(billerSlug);
					const formattedPackages = data.map(pkg => ({
						label: pkg.name,
						id: pkg.id,
						itemCode: pkg.item_code,
						description: pkg.description,
						fee: pkg.fee
					}));
					setBillerPackages(formattedPackages);
				} catch (error) {
					console.error('Error fetching packages:', error);
					Swal.fire({
						icon: 'error',
						title: 'Error',
						text: 'Failed to load service packages. Please try again.',
					});
				} finally {
					setLoading(prev => ({ ...prev, packages: false }));
				}
			};

			fetchPackages();
		}
	}, [formData.billerId, billers]);

	const handleValidation = () => {
		// Check required fields: category, biller, package
		const requiredFields = ['category', 'biller', 'package'];
		const errors = requiredFields.filter(field => 
			!formData[field] || formData[field].trim() === ''
		);

		setFormErrors(errors);
		return errors.length === 0;
	};

	const handleChange = (name, value, id = '') => {
		const updates = { [name]: value };

		// Add ID field if provided
		if (id !== '') {
			updates[`${name}Id`] = id;
		}

		setFormData({
			...formData,
			...updates
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log('Form submitted:', formData);

		// Validate form
		if (handleValidation()) {
			// Pass the form data to parent component
			props.onSuccess && props.onSuccess(formData);
		} else {
			Swal.fire({
				icon: 'error',
				title: 'Form Validation Failed',
				text: 'Please fill in all required fields.',
			});
		}
	};

	return (
		<form ref={ref} onSubmit={handleSubmit}>
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<Autocomplete
						disablePortal
						loading={loading.categories}
						value={formData.category ? { label: formData.category } : null}
						onChange={(e, option) => {
							if (option) {
								handleChange('category', option.label, option.id);
							} else {
								handleChange('category', '', '');
							}
						}}
						options={billCategories}
						renderInput={(params) => (
							<TextField 
								{...params}
								error={formErrors.includes('category')} 
								variant="standard" 
								label="Bill Category" 
								helperText="Select bill category." 
								fullWidth
								InputProps={{
									...params.InputProps,
									endAdornment: (
										<>
											{loading.categories ? <CircularProgress color="inherit" size={20} /> : null}
											{params.InputProps.endAdornment}
										</>
									),
								}}
							/>
						)}
					/>
				</Grid>
				<Grid item xs={12}>
					<Autocomplete
						disablePortal
						disabled={!formData.categoryId || loading.billers}
						loading={loading.billers}
						value={formData.biller ? { label: formData.biller } : null}
						onChange={(e, option) => {
							if (option) {
								handleChange('biller', option.label, option.id);
							} else {
								handleChange('biller', '', '');
							}
						}}
						options={billers}
						renderInput={(params) => (
							<TextField 
								{...params}
								error={formErrors.includes('biller')} 
								variant="standard" 
								label="Biller" 
								helperText="Select Biller" 
								fullWidth
								InputProps={{
									...params.InputProps,
									endAdornment: (
										<>
											{loading.billers ? <CircularProgress color="inherit" size={20} /> : null}
											{params.InputProps.endAdornment}
										</>
									),
								}}
							/>
						)}
					/>
				</Grid>
				<Grid item xs={12}>
					<Autocomplete
						disablePortal
						disabled={!formData.billerId || loading.packages}
						loading={loading.packages}
						value={formData.package ? { label: formData.package } : null}
						onChange={(e, option) => {
							if (option) {
								handleChange('package', option.label, option.id);
							} else {
								handleChange('package', '', '');
							}
						}}
						options={billerPackages}
						renderInput={(params) => (
							<TextField 
								{...params}
								error={formErrors.includes('package')} 
								variant="standard" 
								label="Service Option" 
								helperText="Select service." 
								fullWidth
								InputProps={{
									...params.InputProps,
									endAdornment: (
										<>
											{loading.packages ? <CircularProgress color="inherit" size={20} /> : null}
											{params.InputProps.endAdornment}
										</>
									),
								}}
							/>
						)}
					/>
				</Grid>
			</Grid>
		</form>
	)
});

export default StepOne;
