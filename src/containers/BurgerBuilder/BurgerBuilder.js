import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';

const INGREDIENT_PRICES = {
	salad: 5,
	cheese: 5,
	meat: 10,
	sauce: 5
}	

class BurgerBuilder extends Component {

	state = {
		ingredients: null,
		totalPrice: 10,
		purchaseable: false,
		purchasing: false,
		loading: false,
		error: false
	}

	componentDidMount() {
		axios.get('https://react-my-burger-07870.firebaseio.com/ingredients.json')
			 .then(response => {
				this.setState({ingredients: response.data})
			 })
			 .catch(error => {
			 	this.setState({error: true})
			 });
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
		//alert('You continue !');
		const queryParams = [];
		for(let i in this.state.ingredients) {
			queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
		}
		queryParams.push('price=' + this.state.totalPrice);
		const queryString = queryParams.join('&');
		this.props.history.push({
			pathname: '/checkout',
			search: '?' + queryString
		});
	}

	render() {

		const disabledInfo = {
			...this.state.ingredients
		};

		for(let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0;
		}

		let orderSummary = null;

		let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;
		
		if(this.state.ingredients)
			{
			 burger = (
							<Aux>
					            <Burger ingredients={this.state.ingredients} />
								<BuildControls
									ingredientAdded={this.addIngredientHandler}
									ingredientRemoved={this.removeIngredientHandler}
									disabled={disabledInfo}
									price={this.state.totalPrice}
									ordered={this.purchaseHandler}
									purchaseable={this.state.purchaseable} />
							</Aux> 
						  )
			 orderSummary = <OrderSummary ingredients={this.state.ingredients}
								  price={this.state.totalPrice}
								  purchaseCancelled={this.purchaseCancelHandler}
								  purchaseContinued={this.purchaseContinueHandler} />

			if(this.state.loading) {
				orderSummary = <Spinner />;
			}

		}

		return (
			<Aux>
				<Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler} >
					{orderSummary}
				</Modal>
				{burger}
			</Aux>
		);
	}
}

export default withErrorHandler(BurgerBuilder, axios);