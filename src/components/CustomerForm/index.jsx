import style from "./index.module.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addCustomer,
  verifyPAN,
  getPostcodeDetails,
} from "../../actions/customerActions";
import { useNavigate } from "react-router-dom";

const CustomerForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

    // Get state data from Redux store
  const { panVerification, postcodeDetails } = useSelector(
    (state) => state.customer
  );

// State for customer details
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

    // Additional state for loading indicators and errors
  const [loadingPAN, setLoadingPAN] = useState(false);
  const [loadingPostcode, setLoadingPostcode] = useState(false);
  const [isPanValid, setIsPanValid] = useState(null);
  const [panInput, setPanInput] = useState("");
  const [panError, setPanError] = useState("");

  // Effect to handle changes in PAN verification state
  useEffect(() => {
    if (panVerification) {
      setLoadingPAN(false);
      if (panVerification.isValid) {
        setCustomer((prevCustomer) => ({
          ...prevCustomer,
          fullName: panVerification.fullName,
        }));
        setIsPanValid(true);
      } else {
        setIsPanValid(false);
      }
    }
  }, [panVerification]);

   // Effect to handle changes in postcode details state
  useEffect(() => {
    if (postcodeDetails?.status === "Success") {
      const newAddresses = [...customer.addresses];
      newAddresses[0] = {
        ...newAddresses[0],
        state: postcodeDetails.state[0].name,
        city: postcodeDetails.city[0].name,
      };
      setCustomer({ ...customer, addresses: newAddresses });
    }
  }, [postcodeDetails]);

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (index, e) => {
    const newAddresses = [...customer.addresses];
    newAddresses[index][e.target.name] = e.target.value;
    setCustomer({ ...customer, addresses: newAddresses });
  };

  const handleVerifyPAN = async (e) => {
    const pan = e.target.value;
    setPanInput(pan);
    setCustomer({ ...customer, pan });

    // PAN pattern validation
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

    if (panPattern.test(pan)) {
      setLoadingPAN(true);
      setPanError("");
      await dispatch(verifyPAN(pan));
    } else {
      setIsPanValid(null);
      setPanError("Invalid PAN format. Please enter a valid PAN.");
    }
  };

  const handleGetPostcodeDetails = async (e, index) => {
    const postcode = e.target.value;
    const isValidPostcode = /^[0-9]{6}$/.test(postcode);
    handleAddressChange(index, e);

    if (isValidPostcode) {
      setLoadingPostcode(true);
      await dispatch(getPostcodeDetails(postcode));
      setLoadingPostcode(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addCustomer(customer));
    navigate("/customers");
  };

  return (
    <form onSubmit={handleSubmit} className={style.formContainer}>
      <div className={style.fieldBox}>
        <input
          type="text"
          name="pan"
          value={panInput}
          onChange={handleVerifyPAN}
          required
          maxLength={10}
        />
        <label>PAN</label>
        {loadingPAN && <span id={style.ext} className={style.spinner}></span>}
        {!loadingPAN && isPanValid === true && <span id={style.ext}>✔️</span>}
        {!loadingPAN && isPanValid === false && <span id={style.ext}>❌</span>}
        {panError && <div className={style.error}>{panError}</div>}
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
        <label>Full Name</label>
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
        <label>Email</label>
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
        <label>Mobile Number</label>
      </div>
      {customer.addresses.map((address, index) => (
        <div key={index} style={{ position: "relative" }}>
          <div className={style.fieldBox}>
            <input
              type="text"
              name="line1"
              value={address.line1}
              onChange={(e) => handleAddressChange(index, e)}
              required
            />
            <label>Address Line 1</label>
          </div>
          <div className={style.fieldBox}>
            <input
              type="text"
              name="line2"
              value={address.line2}
              onChange={(e) => handleAddressChange(index, e)}
              required
            />
            <label>Address Line 2</label>
          </div>
          <div className={style.fieldBox}>
            <input
              type="number"
              name="postcode"
              value={address.postcode}
              onChange={(e) => handleGetPostcodeDetails(e, index)}
              required
              maxLength={6}
            />
            <label>Postcode</label>
            {loadingPostcode && (
              <span id={style.ext} className={style.spinner}></span>
            )}
          </div>
          <div className={style.fieldBox}>
            <input type="text" name="state" value={address.state} required />
            <label>State</label>
          </div>
          <div className={style.fieldBox}>
            <input type="text" name="city" value={address.city} required />
            <label>City</label>
          </div>
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

export default CustomerForm;
