import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import store from "./redux/store";
import CustomerForm from "./components/CustomerForm";
import CustomersList from "./components/CustomerList";

function App() {
  return (
    <>
      <Provider store={store}>
      <Router>
        <div style={{width: "95vw", padding: "0 2.5vw" }}>
          <Routes>
            <Route path="/" element={<Navigate to="/form" />} />
            <Route path="/form" element={<CustomerForm />} />
            <Route path="/customers" element={<CustomersList />} />
          </Routes>
        </div>
      </Router>
      </Provider>
    </>
  );
}

export default App;
