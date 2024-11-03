import { Contact } from 'lucide-react'
import './App.css'
import Login from './components/Login/Login'
// import Home from './components/Home'
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MultiStepForm from './components/Registration/MultiStepForm'
import SignUp from './components/signup/SignUp'
import Onboarding from './components/Onboarding'

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
