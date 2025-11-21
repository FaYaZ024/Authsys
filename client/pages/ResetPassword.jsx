import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/appContex'
import axios from 'axios'
import { toast } from 'react-toastify'

const ResetPassword = () => {

  const {backendUrl} =useContext(AppContext)

  axios.defaults.withCredentials = true;

  const navigate =useNavigate()
  const [email,setEmail] = useState('')
  const [newPassword,setNewPassword] = useState('')

const [emailSend,setEmailSend] = useState('')
const [otp,setOtp] = useState('')
const [otpSubmit,setOtpSubmit] = useState(false)

  const inputRefs =React.useRef([])
  
    const handleInput = (e,index)=>{
      if(e.target.value.length > 0 && index < inputRefs.current.length - 1){
        inputRefs.current[index + 1]. focus();
      }
    }
  
    const handleKeyDown =(e,index) =>{
      if(e.key === 'Backspace' && e. target.value === "" && index > 0){
        inputRefs.current[index - 1]. focus();
      }
    }
  
    const handlePaste =(e) =>{
      const paste=e.clipboardData.getData('text')
      const pasteArray = paste.split('');
      pasteArray.forEach((char, index) =>{
        if(inputRefs.current[index]){
          inputRefs.current[index].value = char;
        }
      })
    }
  
    const onSubmitEmail =async(e)=>{
      e.preventDefault();
      try{
        const {data} = await axios.post(backendUrl + '/api/auth/send-reset-otp',{email})
        data.success ? toast.success(data.message) : toast.error(data.message)
        data.success && setEmailSend(true) 
      }catch (error){
        toast.error(error.message)
      }
    }

const onSubmitOtp =async(e)=>{
      e.preventDefault();
    
        const otpArray = inputRefs.current.map(e =>e.value)
      setOtp (otpArray.join(''))
      setOtpSubmit(true)
      
    }

const onSubmitNewPassword =async(e)=>{
  e.preventDefault();
try{
        const {data} = await axios.post(backendUrl + '/api/auth/reset-password',{email,otp,newPassword})
        data.success ? toast.success(data.message) : toast.error(data.message)
        data.success && navigate('/login')
      }catch (error){
        toast.error(error.message)
      }
}

  return (
    <div  className='flex flex-col items-center justify-center min-h-screen'>
    {!emailSend && 
    <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' > 
      <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter Your register email address.</p>
        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder='Email' className='bg-transparent outline-none text-white' required/>
        </div>

        <button  className='w-full py-3 bg-gray-600 text-white rounded-full mt-3'>Submit</button>
    </form>
}


{!otpSubmit && emailSend && 
    <form onSubmit={onSubmitOtp} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password OTP</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email id.</p>

        <div className='flex justify-between mb-8' onPaste={handlePaste}>
          {Array(6).fill(0).map((_, index)=>(
            <input ref={e => inputRefs.current[index] = e} type="text" maxLength='1' key={index} required 
            className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded=md'
            onInput={(e) => handleInput(e,index)}
            onKeyDown={(e) => handleKeyDown(e,index)}/>
            
          ))}
          </div>
          <button className='w-full py-3 bg-gray-600 text-white'>Submit</button>
      </form>
}


{otpSubmit && emailSend &&

      <form onSubmit={onSubmitNewPassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' > 
      <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter the new Password.</p>
        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
          <input value={newPassword} onChange={e => setNewPassword(e.target.value)} type="password" placeholder='New Password' className='bg-transparent outline-none text-white' required/>
        </div>

        <button  className='w-full py-3 bg-gray-600 text-white rounded-full mt-3'>Submit</button>
    </form>
    }
    </div>
  )
}

export default ResetPassword