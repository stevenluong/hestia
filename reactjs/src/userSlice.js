import helpers from './User/helpers'

const initialState = {
  public:false,
  seenOffers:[]
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case 'user/retrieved': {
      return {
        ...state,
        ...action.payload
      }
    }
    case 'user/public': {
      return {
        ...state,
        //sources:["SBS","ABC","TechCrunch"],
        //latestNews:{},
        public:true
      }
    }
    case 'user/offerClicked': {
      //console.log(state);
      //var news = action.payload;
      //var title = news.title;
      //var split = title.split(" ");
      var yesterday = new Date();
      yesterday.setDate(yesterday.getDate()-1)
      //console.log(yesterday)
      var u = {
        ...state,
        seenOffers:[...state.seenOffers.filter(o=>new Date(o.lastDisplayed)>yesterday),action.payload]
        };
      if(!u.public)
        helpers.updateUser(u);
      return u;
    }
    default:
      return state
  }
}
