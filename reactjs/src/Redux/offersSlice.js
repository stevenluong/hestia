const initialState = []

export default function offersReducer(state = initialState, action) {
  switch (action.type) {
    case 'offers/offersRetrieved': {
      //var offers = [];
      //action.payload.forEach(o=>{   //expected : list of offers
      //  offers.push(o);
      //})
      //return offers
      return [...action.payload]
    }
    default:
      return state
  }
}
