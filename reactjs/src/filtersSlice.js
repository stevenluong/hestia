const initialState = {
  cities:[]
}

export default function filtersReducer(state = initialState, action) {
  switch (action.type) {
    case 'filters/citiesAdded': {
      return {
        ...state,
        cities:action.payload
      }
    }
    case 'filters/citiesReset': {
      return {
        ...state,
        cities: state.cities.map(city=>{
          return {
            ...city,
            selected:true
          }
        })
      }
    }
    case 'filters/cityToggled': {
      return {
        ...state,
        cities: state.cities.map(city=>{
          if(city.name===action.payload)
            return {
              ...city,
              selected:!city.selected
            }
          else
            return city
        })
      }
    }
    default:
      return state
  }
}
