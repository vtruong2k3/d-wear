
import RoutesManager from './routes/routerManager'
import { store } from './store/store'
import { Provider } from 'react-redux';
function App() {
  return (

    <Provider store={store} >
      <RoutesManager />
    </Provider>

  )

}

export default App
