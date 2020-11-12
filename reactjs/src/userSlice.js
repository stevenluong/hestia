const initialState = {}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case 'user/retrieved': {
      return action.payload
    }
    default:
      return state
  }
}
