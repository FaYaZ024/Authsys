import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../assets/context/appContex'
import { toast } from 'react-toastify'
import axios from 'axios'


const Navbar = () => {

  const navigate = useNavigate()
  const { userData, backendUrl, setUserData, setLoggedIn } = useContext(AppContext)

  const sentOtp = async () => {
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp')
      if (data.success) {
        toast.success(data.message)
        navigate('/email-verify')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong")
    }
  }

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(backendUrl + '/api/auth/logout')
      data.success && setLoggedIn(false)
      data.success && setUserData(false)
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong")
    }
  }

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6'>
      <img src="/public/logo2.png" alt="LOGO" className='size-13' onClick={( )=> navigate('/')} />
      {userData ?
        <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group'>
          {userData.name[0].toUpperCase()}
          <div className='absolute top-0 right-0 z-10 text-black rounded pt-10 hidden group-hover:block'>
            <ul className='list-none m-0 p-2 bg-gray-100 text-sm rounded-3xl'>
              {!userData.accVerified && <li onClick={() => { sentOtp(); navigate('/email-verify'); }}
                className='py-1 px-2 hover:bg-gray-200 cursor-pointer rounded-3xl' >Verify Email</li>}
              <li onClick={logout} className='py-1 px-2 cursor-pointer rounded-3xl hover:bg-gray-200'>Logout</li>
            </ul>
          </div>
        </div> :
        <button onClick={() => navigate('/login')} className=' cursor-pointerflex items-center gap-2 border border-white rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'>Login </button>
      }

    </div>
  )
}

export default Navbar