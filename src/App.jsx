import { Provider } from "react-redux";
import store from "./redux/store";
import CustomerForm from "./components/CustomerForm";

function App() {
  return (
    <>
      <Provider store={store}>
        <div>
          <CustomerForm />
        </div>
      </Provider>
    </>
  );
}

export default App;
