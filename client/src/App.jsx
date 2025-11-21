import { useState } from 'react'
import { Routes , Route } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import Home from './pages/Home'
import EmailVerify from './pages/EmailVerify';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword'

function App() {

  return (
    <div> 
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/reset-pass' element={<ResetPassword/>}/>
        <Route path='/email-verify' element={<EmailVerify/>}/>
      </Routes>
    </div>
  )
}

export default App
