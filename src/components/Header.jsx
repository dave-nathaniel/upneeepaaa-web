import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Menu, MenuItem, Paper  } from '@mui/material';
import { MDBBtn } from 'mdb-react-ui-kit'
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import AuthContext from '../context/AuthContext';

import logodark from '../assets/images/logo-dark.png';
import logowhite from '../assets/images/logo-white.png';
import MenuIcon from '@mui/icons-material/Menu';

gsap.registerPlugin(ScrollTrigger);

const pages = [
	{
		name: "Home",
		link: ""
	},
	{
		name: "Features",
		link: "/features"
	},
	{
		name: "Contact",
		link: "support"
	},
];
const auth_pages = [
	{
		name: "Dashboard",
		link: "/dashboard"
	},
	{
		name: "Pay Bill",
		link: "/bill-payment"
	},
];

function Header({ toggleDarkMode }) {
	const [scrolling, setScrolling] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const isMenuOpen = Boolean(anchorEl);

	const handleMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const { authToken } = useContext(AuthContext);

	useEffect(() => {
		// Initial header load animation
		gsap.from('.header', { y: -100, opacity: 0, duration: 1, ease: "power3.out" });
		gsap.from('.nav-link', {
			opacity: 0,
			y: 50,
			stagger: 0.2,
			duration: 0.5,
			ease: "power3.out",
		});

		// GSAP Scroll Animation for Navbar
		ScrollTrigger.create({
			start: "top -50",
			onUpdate: (self) => {
				setScrolling(self.direction === 1); // Direction 1 = scrolling down
			},
		});
	}, []);

	return (
		<AppBar 
			position="fixed" 
			className={`header ${scrolling ? 'bg-white shadow' : ''}`} 
			color="default"
			elevation={scrolling ? 4 : 0}
		>
			<Toolbar>
			 	{/* Logo */}
				<Box display="flex" alignItems="center" flexGrow={1}>
					<IconButton component={Link} to="/">
						<img
							src={`${scrolling ? logodark : logodark}`}
							alt="UpNeeePaaa Logo"
							width="120"
							className="d-inline-block align-top"
						/>
					</IconButton>
				</Box>

				{/* Desktop Menu */}
				<Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1 }} justifyContent="end">
					{pages.map((page, index) => (
						<Button key={index} component={Link} to={page.link} className="nav-link" color="inherit">
							{page.name}
						</Button>
				  	))}
				  	{authToken && auth_pages.map((page, index) => (
						<Button key={index} component={Link} to={page.link} className="nav-link" color="inherit">
							{page.name}
						</Button>
				  	))}
				  	{!authToken && (
						<MDBBtn tag={Link} to='/login' color='info' rounded outline className="mx-2 d-none d-md-block">
					        Login
					    </MDBBtn>
					)}
				</Box>

				{/* Mobile Menu */}
				<Box sx={{ 
					display: { xs: 'flex', md: 'none' }
				}}>
					{!authToken && (
						<MDBBtn tag={Link} to='/login' color='info' rounded outline className="mx-3">
					        Login
					    </MDBBtn>
					)}
				</Box>
				<Box sx={{ 
					display: { xs: 'flex', md: 'none' }
				}}>
					<IconButton
						edge="start"
						color="inherit"
						aria-label="menu"
						onClick={handleMenuOpen}
					>
						<MenuIcon />
					</IconButton>
					<Menu
						anchorEl={anchorEl}
						open={isMenuOpen}
						onClose={handleMenuClose}
						anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
						transformOrigin={{ vertical: 'top', horizontal: 'right' }}
					>
					<Paper elevation={0} sx={{ width: 220, maxWidth: '100%' }}>
						{pages.map((page, index) => (
							<MenuItem sx={{justifyContent: "center"}} key={index} component={Link} to="/" onClick={handleMenuClose}>
								{page.name}
							</MenuItem>
					  	))}
					  	{authToken && auth_pages.map((page, index) => (
							<MenuItem sx={{justifyContent: "center"}} key={index} component={Link} to="/" onClick={handleMenuClose}>
								{page.name}
							</MenuItem>
					  	))}
					</Paper>
					</Menu>
				</Box>
			</Toolbar>
		</AppBar>
	);
}

export default Header;
