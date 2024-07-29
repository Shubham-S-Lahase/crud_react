import { useState } from "react";

const CustomerForm = () => {

  const [customer, setCustomer] = useState({
    pan: "",
    fullName: "",
    email: "",
    mobile: "",
    addresses: [
      {
        line1: "",
        line2: "",
        postcode: "",
        state: "",
        city: "",
      },
    ],
  });

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (index, e) => {
    const newAddresses = [...customer.addresses];
    newAddresses[index][e.target.name] = e.target.value;
    setCustomer({ ...customer, addresses: newAddresses });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>PAN:</label>
        <input
          type="text"
          name="pan"
          value={customer.pan}
          required
          maxLength={10}
        />
      </div>
      <div>
        <label>Full Name:</label>
        <input
          type="text"
          name="fullName"
          value={customer.fullName}
          onChange={handleChange}
          required
          maxLength={140}
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={customer.email}
          onChange={handleChange}
          required
          maxLength={255}
        />
      </div>
      <div>
        <label>Mobile Number:</label>
        <span>+91</span>
        <input
          type="text"
          name="mobile"
          value={customer.mobile}
          onChange={handleChange}
          required
          maxLength={10}
        />
      </div>
      {customer.addresses.map((address, index) => (
        <div key={index}>
          <div>
            <label>Address Line 1:</label>
            <input
              type="text"
              name="line1"
              value={address.line1}
              onChange={(e) => handleAddressChange(index, e)}
              required
            />
          </div>
          <div>
            <label>Address Line 2:</label>
            <input
              type="text"
              name="line2"
              value={address.line2}
              onChange={(e) => handleAddressChange(index, e)}
            />
          </div>
          <div>
            <label>Postcode:</label>
            <input
              type="text"
              name="postcode"
              value={address.postcode}
              required
              maxLength={6}
            />
          </div>
          <div>
            <label>State:</label>
            <input type="text" name="state" value={address.state} readOnly />
          </div>
          <div>
            <label>City:</label>
            <input type="text" name="city" value={address.city} readOnly />
          </div>
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

export default CustomerForm;