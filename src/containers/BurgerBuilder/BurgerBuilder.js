import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';


const INGREDIENT_PRICES = {
	salad: 5,
	cheese: 5,
	meat: 10,
	sauce: 5
}	

class BurgerBuilder extends Component {

	state = {
		ingredients: {
			salad: 0,
			sauce: 0,
			cheese: 0,
			meat: 0
		},
		totalPrice: 10,
		purchaseable: false,
		purchasing: false
	}

	updatePurchaseState = (ingredients) => {
		
		const sum = Object.keys(ingredients)
						  .map(igKey => {
						  	return ingredients[igKey];
						  })
						  .reduce((sum, el) => {
						  	return sum + el;
						  }, 0);
		this.setState({purchaseable: sum > 0});
	}
    
	addIngredientHandler = (type) => {
		const oldCount = this.state.ingredients[type];
		const updateCount = oldCount + 1;
		const updatedIngredients = {
			...this.state.ingredients
		};
		updatedIngredients[type] = updateCount;
		const priceAddition = INGREDIENT_PRICES[type];
		const oldPrice = this.state.totalPrice;
		const newPrice = oldPrice + priceAddition;
		this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
		this.updatePurchaseState(updatedIngredients);
	}

	removeIngredientHandler = (type) => {
		const oldCount = this.state.ingredients[type];
		const updateCount = oldCount - 1;
		const updatedIngredients = {
			...this.state.ingredients
		};
		updatedIngredients[type] = updateCount;
		const priceDeduction = INGREDIENT_PRICES[type];
		const oldPrice = this.state.totalPrice;
		const newPrice = oldPrice - priceDeduction;
		this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
		this.updatePurchaseState(updatedIngredients);
	}

	purchaseHandler = () => {
		this.setState({purchasing: true});
	}

	purchaseCancelHandler = () => {
		this.setState({purchasing: false});
	}

	purchaseContinueHandler = () => {
		alert('You continue !');
	}

	render() {

		const disabledInfo = {
			...this.state.ingredients
		};

		for(let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0;
		}

		return (
			<Aux>
				<Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler} >
					<OrderSummary ingredients={this.state.ingredients}
								  price={this.state.totalPrice}
								  purchaseCancelled={this.purchaseCancelHandler}
								  purchaseContinued={this.purchaseContinueHandler} />
				</Modal>
				<Burger ingredients={this.state.ingredients} />
				<BuildControls
					ingredientAdded={this.addIngredientHandler}
					ingredientRemoved={this.removeIngredientHandler}
					disabled={disabledInfo}
					price={this.state.totalPrice}
					ordered={this.purchaseHandler}
					purchaseable={this.state.purchaseable} />
			</Aux>
		);
	}
}

export default BurgerBuilder;