import axios from 'axios';

export const addCustomer = customer => {
    const existingCustomers = JSON.parse(localStorage.getItem('customers')) || [];
    const updatedCustomers = [...existingCustomers, customer];
    localStorage.setItem('customers', JSON.stringify(updatedCustomers));
  
    return {
      type: 'ADD_CUSTOMER',
      payload: customer,
    };
  };

export const verifyPAN = panNumber => async dispatch => {
  try {
    const response = await axios.post('https://lab.pixel6.co/api/verify-pan.php', { panNumber });
    if (response.data.status === 'Success') {
      dispatch({
        type: 'VERIFY_PAN',
        payload: { isValid: response.data.isValid, fullName: response.data.fullName },
      });
    } else {
      dispatch({
        type: 'VERIFY_PAN',
        payload: { isValid: false },
      });
    }
  } catch (error) {
    dispatch({
      type: 'VERIFY_PAN',
      payload: { isValid: false },
    });
  }
};

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