import { useState } from 'react'
import { Routes , Route } from 'react-router-dom'
import Home from './assets/pages/Home'
import Login from './assets/pages/Login'
import ResetPassword from './assets/pages/ResetPassword'
import EmailVerify from './assets/pages/EmailVerify'
import { ToastContainer, toast } from 'react-toastify';

function App() {
  const [count, setCount] = useState(0)

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
