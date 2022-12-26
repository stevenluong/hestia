const initialState = {
  cities:[]
}

export default function statsReducer(state = initialState, action) {
  switch (action.type) {
    case 'stats/citiesProcessed': {
      return {
        ...state,
        cities:action.payload
      }
    }
    default:
      return state
  }
}
