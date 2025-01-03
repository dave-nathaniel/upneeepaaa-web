import React, { useContext } from 'react';
import { SwitchTransition, Transition } from 'react-transition-group';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

import TransitionContext from '../context/TransitionContext';

const PageTransition = ({ children }) => {
	const location = useLocation();
	const { toggleCompleted } = useContext(TransitionContext);
	return (
		<SwitchTransition>
			<Transition
				key={location.pathname}
				timeout={500}
				onEnter={(node) => {
				    toggleCompleted(false);
				    // Set initial opacity to 0
				    gsap.set(node, { autoAlpha: 0 });
				    // Create a fade-in effect
				    gsap
				        .timeline({
				            paused: true,
				            onComplete: () => toggleCompleted(true), // Mark the animation as completed
				        })
				        .to(node, { autoAlpha: 1, duration: 0.5 }) // Fade in over 0.5 seconds
				        .play();
				}}

				onExit={(node) => {
				    // Create a fade-out effect
				    gsap
				        .timeline({ paused: true })
				        .to(node, { autoAlpha: 0, duration: 0.5 }) // Fade out over 0.5 seconds
				        .play();
				}}
			>
				{children}
			</Transition>
		</SwitchTransition>
	);
};

export default PageTransition;
