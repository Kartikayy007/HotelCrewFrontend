import { Contact } from 'lucide-react'
import './App.css'
import Login from './components/Login/Login'
// import Home from './components/Home'
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignUp from './components/SignUp'
import MultiStepForm from './components/Registration/MultiStepForm'
import Verify from './components/Login/Verify'

function App() {

  return (
    <>
    {/* <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup/hoteldetails" element={<Hoteldetails />} />
        </Routes>
    </Router> */}
    {/* <Hoteldetails /> */}
    {/* <ContactInfo /> */}
    <Login />
    </>
  )
}

export default App
