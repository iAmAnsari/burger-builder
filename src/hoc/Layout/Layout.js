import React, { Component } from 'react';
import Aux from '../Auxiliary/Auxiliary';
import classes from './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

class Layout extends Component {

	state = {
		showSideDrawer: false
	}

	sideDrawerOpenAndCloseHandler = () => {
		let show = this.state.showSideDrawer;
		this.setState({showSideDrawer: !show})
	}

	render() {
		return (
			<Aux>
				<Toolbar sideDrawerHandler={this.sideDrawerOpenAndCloseHandler}  />
				<SideDrawer open={this.state.showSideDrawer} closed={this.sideDrawerOpenAndCloseHandler} />
				<main className={classes.Content} >
					{this.props.children}
				</main>
			</Aux>
		);
	}
}

export default Layout;