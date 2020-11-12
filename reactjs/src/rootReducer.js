import { combineReducers } from 'redux'

import offersReducer from './offersSlice'
import filtersReducer from './filtersSlice'
import userReducer from './userSlice'

const rootReducer = combineReducers({
  // always return a new object for the root state
    // the value of `state.todos` is whatever the todos reducer returns
    offers: offersReducer,
    // For both reducers, we only pass in their slice of the state
    filters: filtersReducer,
    user: userReducer
  })
export default rootReducer
