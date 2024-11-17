import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './redux/Store.js'
import './index.css'
import App from './App.jsx'
import Admin from './components/admin/Admin.jsx'
import MainLayout from './components/Manager/MainLayout.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      {/* <App /> */}
      {/* <MainLayout /> */}
      <Admin />
    </ Provider>
  </StrictMode>,
)