import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPostcodeDetails } from '../../actions/customerActions';
import style from "./index.module.css";

const CustomersList = () => {
  const dispatch = useDispatch();
  const { postcodeDetails } = useSelector((state) => state.customer);

  const [customers, setCustomers] = useState([]);
  const [expandedCustomerIndex, setExpandedCustomerIndex] = useState(null);
  const [editCustomerIndex, setEditCustomerIndex] = useState(null);
  const [editAddressIndex, setEditAddressIndex] = useState(null);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [showEditCustomerModal, setShowEditCustomerModal] = useState(false);
  const [showEditAddressModal, setShowEditAddressModal] = useState(false);
  const [editCustomerData, setEditCustomerData] = useState({});
  const [editAddressData, setEditAddressData] = useState({});
  const [newAddressData, setNewAddressData] = useState({ line1: '', line2: '', postcode: '', state: '', city: '' });

  useEffect(() => {
    const storedCustomers = JSON.parse(localStorage.getItem('customers')) || [];
    setCustomers(storedCustomers);
  }, []);

  const handleDeleteCustomer = index => {
    const updatedCustomers = [...customers];
    updatedCustomers.splice(index, 1);
    setCustomers(updatedCustomers);
    localStorage.setItem('customers', JSON.stringify(updatedCustomers));
  };

  const handleEditCustomer = index => {
    setEditCustomerIndex(index);
    setEditCustomerData(customers[index]);
    setShowEditCustomerModal(true);
  };

  const handleEditAddress = (customerIndex, addressIndex) => {
    setEditCustomerIndex(customerIndex);
    setEditAddressIndex(addressIndex);
    setEditAddressData(customers[customerIndex].addresses[addressIndex]);
    setShowEditAddressModal(true);
  };

  const handleAddAddress = index => {
    setEditCustomerIndex(index);
    setShowAddAddressModal(true);
  };

  const handleSaveCustomer = () => {
    const updatedCustomers = [...customers];
    updatedCustomers[editCustomerIndex] = editCustomerData;
    setCustomers(updatedCustomers);
    localStorage.setItem('customers', JSON.stringify(updatedCustomers));
    setShowEditCustomerModal(false);
    setEditCustomerIndex(null);
  };

  const handleSaveAddress = () => {
    const updatedCustomers = [...customers];
    updatedCustomers[editCustomerIndex].addresses[editAddressIndex] = editAddressData;
    setCustomers(updatedCustomers);
    localStorage.setItem('customers', JSON.stringify(updatedCustomers));
    setShowEditAddressModal(false);
    setEditAddressIndex(null);
  };

  const handleAddNewAddress = () => {
    const updatedCustomers = [...customers];
    if (updatedCustomers[editCustomerIndex].addresses.length < 10) {
      updatedCustomers[editCustomerIndex].addresses.push(newAddressData);
      setCustomers(updatedCustomers);
      localStorage.setItem('customers', JSON.stringify(updatedCustomers));
      setShowAddAddressModal(false);
      setNewAddressData({ line1: '', line2: '', postcode: '', state: '', city: '' });
    } else {
      alert('You can only add up to 10 addresses.');
    }
  };

  const handleGetPostcodeDetails = async (postcode, isEdit = false) => {
    const isValidPostcode = /^[0-9]{6}$/.test(postcode);

    if (isValidPostcode) {
      await dispatch(getPostcodeDetails(postcode));

      if (postcodeDetails?.status === 'Success') {
        const state = postcodeDetails.state[0].name;
        const city = postcodeDetails.city[0].name;

        if (isEdit) {
          setEditAddressData((prevData) => ({ ...prevData, state, city }));
        } else {
          setNewAddressData((prevData) => ({ ...prevData, state, city }));
        }
      }
    }
  };

  const handleEditAddressChange = (e) => {
    const { name, value } = e.target;
    setEditAddressData((prevData) => ({ ...prevData, [name]: value }));

    if (name === 'postcode') {
      handleGetPostcodeDetails(value, true);
    }
  };

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddressData((prevData) => ({ ...prevData, [name]: value }));

    if (name === 'postcode') {
      handleGetPostcodeDetails(value);
    }
  };

  const toggleCustomerDetails = index => {
    setExpandedCustomerIndex(expandedCustomerIndex === index ? null : index);
  };

  return (
    <div className={style.listContainer}>
      <h2>Customer List</h2>
      {customers.map((customer, customerIndex) => (
        <div key={customerIndex} className={style.listdiv}>
          <h3 onClick={() => toggleCustomerDetails(customerIndex)} style={{ cursor: 'pointer' }}>
            {customer.fullName}
          </h3>
          <div className={`${style.dropdown} ${expandedCustomerIndex === customerIndex ? style.open : ''}`}>
            <p><strong>Email:</strong> {customer.email}</p>
            <p><strong>Mobile:</strong> {customer.mobile}</p>
            <h4>Addresses</h4>
            {customer.addresses.map((address, addressIndex) => (
              <div key={addressIndex} className={style.addDiv}>
                <span><strong>{addressIndex + 1}.</strong></span>
                <p>{address.line1}, {address.line2}, {address.city}, {address.state}, {address.postcode}</p>
                <button onClick={() => handleEditAddress(customerIndex, addressIndex)}>Edit Address</button>
              </div>
            ))}
            <button className={style.dbtns} onClick={() => handleAddAddress(customerIndex)}>Add Address</button>
            <button className={style.dbtns} onClick={() => handleEditCustomer(customerIndex)}>Edit Customer</button>
            <button className={style.dbtns} id={style.delbtn} onClick={() => handleDeleteCustomer(customerIndex)}>Delete Customer</button>
          </div>
        </div>
      ))}

      {showEditCustomerModal && (
        <>
          <div className={`${style.modal} ${style.open}`}>
            <h2>Edit Customer</h2>
            <label>Full Name:</label>
            <input
              type="text"
              value={editCustomerData.fullName}
              onChange={e => setEditCustomerData({ ...editCustomerData, fullName: e.target.value })}
            />
            <label>Email:</label>
            <input
              type="email"
              value={editCustomerData.email}
              onChange={e => setEditCustomerData({ ...editCustomerData, email: e.target.value })}
            />
            <label>Mobile:</label>
            <input
              type="text"
              value={editCustomerData.mobile}
              onChange={e => setEditCustomerData({ ...editCustomerData, mobile: e.target.value })}
            />
            <button onClick={handleSaveCustomer}>Save</button>
            <button onClick={() => setShowEditCustomerModal(false)}>Cancel</button>
          </div>
          <div className={`${style.modalBackdrop} ${style.open}`} onClick={() => setShowEditCustomerModal(false)}></div>
        </>
      )}

      {showEditAddressModal && (
        <>
          <div className={`${style.modal} ${style.open}`}>
            <h2>Edit Address</h2>
            <label>Line 1:</label>
            <input
              type="text"
              name="line1"
              value={editAddressData.line1}
              onChange={handleEditAddressChange}
            />
            <label>Line 2:</label>
            <input
              type="text"
              name="line2"
              value={editAddressData.line2}
              onChange={handleEditAddressChange}
            />
            <label>Postcode:</label>
            <input
              type="text"
              name="postcode"
              value={editAddressData.postcode}
              onChange={handleEditAddressChange}
            />
            <label>State:</label>
            <input
              type="text"
              name="state"
              value={editAddressData.state}
              readOnly
            />
            <label>City:</label>
            <input
              type="text"
              name="city"
              value={editAddressData.city}
              readOnly
            />
            <button onClick={handleSaveAddress}>Save</button>
            <button onClick={() => setShowEditAddressModal(false)}>Cancel</button>
          </div>
          <div className={`${style.modalBackdrop} ${style.open}`} onClick={() => setShowEditAddressModal(false)}></div>
        </>
      )}

      {showAddAddressModal && (
        <>
          <div className={`${style.modal} ${style.open}`}>
            <h2>Add Address</h2>
            <label>Line 1:</label>
            <input
              type="text"
              name="line1"
              value={newAddressData.line1}
              onChange={handleNewAddressChange}
            />
            <label>Line 2:</label>
            <input
              type="text"
              name="line2"
              value={newAddressData.line2}
              onChange={handleNewAddressChange}
            />
            <label>Postcode:</label>
            <input
              type="text"
              name="postcode"
              value={newAddressData.postcode}
              onChange={handleNewAddressChange}
            />
            <label>State:</label>
            <input
              type="text"
              name="state"
              value={newAddressData.state}
              readOnly
            />
            <label>City:</label>
            <input
              type="text"
              name="city"
              value={newAddressData.city}
              readOnly
            />
            <button onClick={handleAddNewAddress}>Add</button>
            <button onClick={() => setShowAddAddressModal(false)}>Cancel</button>
          </div>
          <div className={`${style.modalBackdrop} ${style.open}`} onClick={() => setShowAddAddressModal(false)}></div>
        </>
      )}
    </div>
  );
};

export default CustomersList;