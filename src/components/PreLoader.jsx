import React, { useState, useEffect } from 'react';
import '../Preloader.css';
import loader from '../assets/images/logo-dark-animated.gif';

const Preloader = () => {
	const [isFading, setIsFading] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
		  setIsFading(true);
		}, 2000);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div className={`preloader ${isFading ? 'fade-out' : ''}`}>
			<img
				src={loader}
				alt="UpNeeePaaa Logo"
				width="100"
				className="d-inline-block align-top"
			/>
		</div>
	);
};

export default Preloader;
