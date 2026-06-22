


import { Provider } from "react-redux";
import ErrorBoundary from "./components/ErrorBoundary";
import store from "./redux/store";
import { ToastContainer } from "react-toastify";
import { Toaster } from 'react-hot-toast';
import RoutesManager from "./routes/RouterManager";
function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <RoutesManager />
        <Toaster />
        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar={false}
        />
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
