


import { Provider } from "react-redux";
import store from "./redux/store";
import { ToastContainer } from "react-toastify";

import RoutesManager from "./routes/RouterManager";
function App() {
  return (
    <Provider store={store}>
      <RoutesManager />
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
      />

    </Provider>
  );
}

export default App;
