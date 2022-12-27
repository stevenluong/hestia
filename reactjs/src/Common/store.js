import { configureStore } from '@reduxjs/toolkit'
import rootReducer from '../Redux/rootReducer';

const store = configureStore({ reducer: rootReducer })
export default store;
