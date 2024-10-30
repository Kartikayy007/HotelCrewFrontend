
import SignUp from './components/SignUp'
import Home from './components/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Hoteldetails from './components/Signup/Hoteldetails'
function App() {

  return (
    <>
      
      <Router>
        <Routes>
          <Route path = '/' element ={<Hoteldetails />}  />
          {/* <Route path = '/' element ={<Home />}  /> */}
        </Routes>
      </Router>
    </>
  )
}

export default App
