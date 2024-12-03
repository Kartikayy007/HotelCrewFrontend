import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './redux/Store.js'
import './index.css'
import App from './App.jsx'
import MainLayout from '../src/components/Manager/MainLayout.jsx'
import Admin from './components/admin/Admin.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      {/* <MainLayout /> */}
      {/* <Admin /> */}
    </Provider>
  </StrictMode>,
)