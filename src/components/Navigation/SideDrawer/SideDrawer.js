import React from 'react';
import Logo from '../../Logo/Logo';
import classes from './SideDrawer.css';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import Backdrop from '../../UI/Backdrop/Backdrop';
import NavigationItems from '../NavigationItems/NavigationItems';

const sideDrawer = (props) => {

	let attachClasses = [classes.SideDrawer, classes.Close];

	if(props.open) {
		attachClasses = [classes.SideDrawer, classes.Open];
	}

	return (
		<Aux>
			<Backdrop show={props.open} clicked={props.closed} />
			<div className={attachClasses.join(' ')} >
				<Logo height="11%" marginBottom="32px" />
				<nav>
					<NavigationItems />
				</nav>
			</div>
		</Aux>
	);
}

export default sideDrawer;