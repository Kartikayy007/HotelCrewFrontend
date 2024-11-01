import { Contact } from 'lucide-react'
import './App.css'
import Login from './components/Login'
// import Home from './components/Home'
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignUp from './components/SignUp'
import Hoteldetails from './components/Registration/HotelDetails'
// import HotelRegistration from './components/HotelRegistration'
// import Hoteldetails from './components/Registration/Hoteldetails'
import ContactInfo from './components/Registration/ContactInfo'
// import StaffManagment from './components/Registration/StaffManagment'
import Property from './components/Registration/Property'
import OperationalInfo from './components/Registration/OperationalInfo'
// import UploadDoc from './components/Registration/UploadDoc'
// import HotelRegistration from './components/HotelRegistration'
import MultiStepForm from './components/Registration/MultiStepForm'

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
    <MultiStepForm />
    </>
  )
}

export default App
