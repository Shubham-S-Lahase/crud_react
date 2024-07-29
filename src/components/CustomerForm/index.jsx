import style from "./index.module.css";
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
    <form onSubmit={handleSubmit} className={style.formContainer}>
      <div className={style.fieldBox}>
        <input
          type="text"
          name="pan"
          value={customer.pan}
          required
          maxLength={10}
        />
        <label>PAN:</label>
      </div>
      <div className={style.fieldBox}>
        <input
          type="text"
          name="fullName"
          value={customer.fullName}
          onChange={handleChange}
          required
          maxLength={140}
        />
        <label>Full Name:</label>
      </div>
      <div className={style.fieldBox}>
        <input
          type="email"
          name="email"
          value={customer.email}
          onChange={handleChange}
          required
          maxLength={255}
        />
        <label>Email:</label>
      </div>
      <div className={style.fieldBox}>
        <input
          type="text"
          name="mobile"
          value={customer.mobile}
          onChange={handleChange}
          required
          maxLength={10}
        />
        <label>Mobile Number:</label>
      </div>
      {customer.addresses.map((address, index) => (
        <div key={index} style={{position: "relative"}}>
          <div className={style.fieldBox}>
            <input
              type="text"
              name="line1"
              value={address.line1}
              onChange={(e) => handleAddressChange(index, e)}
              required
            />
            <label>Address Line 1:</label>
          </div>
          <div className={style.fieldBox}>
            <input
              type="text"
              name="line2"
              value={address.line2}
              onChange={(e) => handleAddressChange(index, e)}
            />
            <label>Address Line 2:</label>
          </div>
          <div className={style.fieldBox}>
            <input
              type="text"
              name="postcode"
              value={address.postcode}
              required
              maxLength={6}
            />
            <label>Postcode:</label>
          </div>
          <div className={style.fieldBox}>
            <label>State:</label>
            <input type="text" name="state" value={address.state} readOnly />
          </div>
          <div className={style.fieldBox}>
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
