
import SignUp from './components/SignUp'
import Home from './components/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
function App() {

  return (
    <>
      
      <Router>
        <Routes>
          <Route path = '/' element ={<SignUp />}  />
          {/* <Route path = '/' element ={<Home />}  /> */}
        </Routes>
      </Router>
    </>
  )
}

export default App
