import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://react-my-burger-07870.firebaseio.com/'
});

export default instance;