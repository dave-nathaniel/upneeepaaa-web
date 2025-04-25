import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate, NavLink, useLocation} from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Menu, MenuItem, Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { MDBCard, MDBCardBody, MDBTabs, MDBTabsItem, MDBTabsLink, MDBIcon, MDBBtn } from 'mdb-react-ui-kit';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import AuthContext from '../context/AuthContext';

import MenuIcon from '@mui/icons-material/Menu';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClockRotateLeft, faCalendarCheck, faMoneyBillWave, faHouse, faUser, faPowerOff } from '@fortawesome/free-solid-svg-icons';

import logodark from '../assets/images/logo-dark.png';
import logowhite from '../assets/images/logo-white.png';

gsap.registerPlugin(ScrollTrigger);

const pages = [
	{
		title: "Home",
		link: ""
	},
	{
		title: "Features",
		link: "/features"
	},
	{
		title: "Contact",
		link: "support"
	},
];
const auth_pages = [
	{
		title: 'Dashboard',
		description: 'Dashboard',
		icon: faHouse,
		link: '/dashboard',
		color: "#33658a"
	},
	{
		title: 'Pay Bills',
		description: 'Quick and secure bill payments',
		icon: faMoneyBillWave,
		link: '/bill-payment',
		color: "#33658a"
	},
	{
		title: 'History',
		description: 'Detailed power consumption insights',
		icon: faClockRotateLeft,
		link: '/transaction-history',
		color: "#33658a",
	},
	{
		title: 'Schedule',
		description: 'Automate your recurring payments',
		icon: faCalendarCheck,
		link: '/schedule',
		color: "#33658a"
	},
	{
		title: 'Profile',
		description: 'User profile.',
		icon: faUser,
		link: '/profile',
		color: "#33658a"
	},
];

function Header({ toggleDarkMode }) {
	const [value, setValue] = useState(0);
	const [scrolling, setScrolling] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const isMenuOpen = Boolean(anchorEl);
	const [iconsActive, setIconsActive] = useState('Dashboard');
	const navigate = useNavigate();

	const location = useLocation();

	const isActive = (path) => {
		console.log(location.pathname);
		return location.pathname === path;
	}

	const handleMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const { authToken, doLogout } = useContext(AuthContext);

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
		<>
		<AppBar 
			position="fixed" 
			className={`header ${scrolling ? 'bg-white' : ''}`} 
			color="default"
			elevation={0}
		>
			<Toolbar className={`${scrolling ? 'shadow' : ''}`} 
			elevation={scrolling ? 4 : 0}>
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
				<Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1 }} justifyContent="end" alignItems="center">
					{pages.map((page, index) => (
						<NavLink key={"mainnav-" + index} to={page.link} className={`${isActive(page.link) ? "active" : "border-0"} nav-link px-2`}>
							{page.title}
						</NavLink>
				  	))}
				  	{!authToken && (
						<MDBBtn tag={Link} to='/login' rounded outline className={`${isActive('/login') ? "active" : ""} nav-link mx-2 d-none d-md-block`}>
					        Login <FontAwesomeIcon className="ml-1" icon={faUser} />
					    </MDBBtn>
					)}
				</Box>

				{/* Mobile Menu */}
				<Box sx={{ 
					display: { xs: 'flex', md: 'none' }
				}}>
					{!authToken && (
						<MDBBtn tag={Link} to='/login' rounded outline className="mx-3">
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
								<MenuItem sx={{justifyContent: "center"}} key={"a-" + index} component={Link} to="/" onClick={handleMenuClose}>
									{page.title}
								</MenuItem>
						  	))}
						</Paper>
					</Menu>
				</Box>
			</Toolbar>

			<Box className="desktop-auth-menu" sx={{ 
					display: { xs: 'none', md: 'block' }
				}}>
				<MDBCard>
					<MDBCardBody className="p-0" >
						<MDBTabs className="d-flex justify-content-center">
							{authToken && auth_pages.map((page, index) => (
								<MDBTabsItem key={"h-" + index} className={`${isActive(page.link) ? 'active' : ''}`}>
									<MDBTabsLink className='border-0 h-100'
										onClick={() => navigate(page.link)}
									>
										<FontAwesomeIcon className="me-2" icon={page.icon} /> {page.title}
									</MDBTabsLink>
								</MDBTabsItem>
							))} 
							{authToken && (
								<MDBTabsItem style={{
									borderLeft: "1px solid #d5d5d5",
									fontSize: "20px"
								}}>
									<MDBTabsLink
										className="text-danger" 
										title="Logout"
										onClick={ () => doLogout() }
										style={{
											fontSize: "16px",
											fontWeight: "bold"
										}}
									>
										<FontAwesomeIcon icon={faPowerOff} />
									</MDBTabsLink>
								</MDBTabsItem>
							)}
						</MDBTabs>
					</MDBCardBody>
				</MDBCard>
			</Box>
		</AppBar>
		<Paper sx={{ 
				position: 'fixed', 
				bottom: 0, 
				left: 0, 
				right: 0, 
				zIndex: 99999,
				display: { xs: 'block', md: 'none' } 
			}} elevation={3}
		>
			<BottomNavigation showLabels
				sx={{
					backgroundColor: "#FFF",
					padding: "15px 0px",
					height: "auto"
				}}
			>
			  	{authToken && auth_pages.filter(page => page.title.toLowerCase() !== 'profile').map((page, index) => (
					<BottomNavigationAction component={NavLink} to={page.link} key={"bnav-" + index} sx={{ color: page.color}} label={page.title} icon={<FontAwesomeIcon icon={page.icon} size={'2x'} />} />
			  	))}
			</BottomNavigation>
		</Paper>
		</>
	);
}

export default Header;
