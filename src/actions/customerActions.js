import axios from 'axios';

// Action to add a new customer and save to local storage
export const addCustomer = customer => {
    // Retrieve existing customers from local storage or initialize an empty array if none exist
    const existingCustomers = JSON.parse(localStorage.getItem('customers')) || [];
    // Add the new customer to the existing list
    const updatedCustomers = [...existingCustomers, customer];
     // Save the updated list back to local storage
    localStorage.setItem('customers', JSON.stringify(updatedCustomers));
     // Return the action to add a customer
    return {
      type: 'ADD_CUSTOMER',
      payload: customer,
    };
  };

  // Action to verify PAN number by making an API call
export const verifyPAN = panNumber => async dispatch => {
  try {
    const response = await axios.post('https://lab.pixel6.co/api/verify-pan.php', { panNumber });
    if (response.data.status === 'Success') {
       // Dispatch success action with PAN verification data
      dispatch({
        type: 'VERIFY_PAN',
        payload: { isValid: response.data.isValid, fullName: response.data.fullName },
      });
    } else {
       // Dispatch failure action if PAN verification fails
      dispatch({
        type: 'VERIFY_PAN',
        payload: { isValid: false },
      });
    }
  } catch (error) {
    // Dispatch failure action if an error occurs during the API call
    dispatch({
      type: 'VERIFY_PAN',
      payload: { isValid: false },
    });
  }
};

// Action to get postcode details by making an API call
export const getPostcodeDetails = postcode => async dispatch => {
  try {
    const response = await axios.post('https://lab.pixel6.co/api/get-postcode-details.php', { postcode });
    if (response.data.status === 'Success') {
      dispatch({
        type: 'GET_POSTCODE_DETAILS',
        payload: {
          status: response.data.status,
          state: response.data.state,
          city: response.data.city,
        },
      });
    } else {
      dispatch({
        type: 'GET_POSTCODE_DETAILS',
        payload: { status: 'Failure' },
      });
    }
  } catch (error) {
    dispatch({
      type: 'GET_POSTCODE_DETAILS',
      payload: { status: 'Failure' },
    });
  }
};