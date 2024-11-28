import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './redux/Store.js'
import './index.css'
import App from './App.jsx'
import MSideBar from './components/Manager/MSideBar.jsx'
import MainLayout from './components/Manager/MainLayout.jsx'
import SLayout from './components/Staff/SLayout.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      {/* <App /> */}
      {/* <MSideBar /> */}
      {/* <MainLayout /> */}
      <SLayout />
    </ Provider>
  </StrictMode>,
)