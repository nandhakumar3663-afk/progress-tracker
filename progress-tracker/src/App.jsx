import { BrowserRouter, Routes, Route } from "react-router-dom"
import  Loginpage  from './pages/loginpage'
import  Members  from './pages/members'

import './App.css'




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Loginpage />} />
        <Route path="/members" element={<Members />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App