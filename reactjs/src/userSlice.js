const initialState = {
  public:false
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case 'user/retrieved': {
      return action.payload
    }
    case 'user/public': {
      return {
        ...state,
        //sources:["SBS","ABC","TechCrunch"],
        //latestNews:{},
        public:true
      }
    }
    default:
      return state
  }
}
