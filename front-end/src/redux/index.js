import authReducer from './reducers/auth';
import chatReducer from './reducers/chat';
import { combineReducers } from 'redux';
import recipeReducer from './reducers/recipe';
import socketReducer from './reducers/socket';

export default combineReducers({
    authReducer,
    recipeReducer,
    socketReducer,
    chatReducer,
});
