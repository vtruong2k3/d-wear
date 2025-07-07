


import { Provider } from "react-redux";
import store from "./redux/store";
import { ToastContainer } from "react-toastify";
import { Toaster } from 'react-hot-toast';
import RoutesManager from "./routes/RouterManager";
function App() {
  return (
    <Provider store={store}>
      <RoutesManager />
      <Toaster />
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
      />

    </Provider>
  );
}

export default App;
