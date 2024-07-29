const initialState = {
    customers: [],
  };
  
  const customerReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'ADD_CUSTOMER':
        return {
          ...state,
          customers: [...state.customers, action.payload],
        };
      case 'VERIFY_PAN':
        return {
          ...state,
          panVerification: action.payload,
        };
      case 'GET_POSTCODE_DETAILS':
        return {
          ...state,
          postcodeDetails: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default customerReducer;  