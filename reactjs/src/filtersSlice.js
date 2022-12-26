const initialState = {
  cities:[],
  sources:[],
  sortField:"price"
}

export default function filtersReducer(state = initialState, action) {
  switch (action.type) {
    case 'filters/citiesAdded': {
      return {
        ...state,
        cities:action.payload
      }
    }
    case 'filters/sourcesAdded': {
      return {
        ...state,
        sources:action.payload
      }
    }
    case 'filters/filtersReset': {
      return {
        ...state,
        cities: state.cities.map(city=>{
          return {
            ...city,
            selected:true
          }
        }),
        sources: state.sources.map(source=>{
          return {
            ...source,
            selected:true
          }
        }),
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
    case 'filters/cityChosen': {
      return {
        ...state,
        cities: state.cities.map(city=>{
          return {
            ...city,
            selected:city.name===action.payload
          }
        })
      }
    }
    case 'filters/sourceToggled': {
      return {
        ...state,
        sources: state.sources.map(source=>{
          if(source.name===action.payload)
            return {
              ...source,
              selected:!source.selected
            }
          else
            return source
        })
      }
    }
    case 'filters/sourceChosen': {
      return {
        ...state,
        sources: state.sources.map(source=>{
          return {
            ...source,
            selected:source.name===action.payload
          }
        })
      }
    }
    case 'filters/sortFieldChanged': {
      return {
        ...state,
        sortField:action.payload
      }
    }
    default:
      return state
  }
}
