import { RouterProvider } from "react-router-dom";
import "./App.css";
import router from "./routes/ClientRouter/routing";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Provider store={store}>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
      />
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
