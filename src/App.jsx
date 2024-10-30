import './App.css'
// import Login from './components/Login'
// import Home from './components/Home'
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import SignUp from './components/SignUp'
import Hoteldetails from './components/Signup/Hoteldetails'
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
    <Hoteldetails />
      </>
  )
}

export default App
