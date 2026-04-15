import { BrowserRouter, Routes, Route } from "react-router-dom"
import { SpeedInsights } from '@vercel/speed-insights/react'
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
      <SpeedInsights />
    </BrowserRouter>
  )
}

export default App