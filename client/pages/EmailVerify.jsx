import axios from 'axios';
import React, { useContext, useEffect } from 'react'
import { AppContext } from '../context/appContex';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EmailVerify = () => {

  axios.defaults.withCredentials= true;

  const {backendUrl,loggedIn,setLoggedIn,userData,getUserData} = useContext(AppContext)

  const navigate = useNavigate()

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

const onSubmitHandler =async (e) =>{
  try{
    e.preventDefault();
    const otpArray = inputRefs.current.map(e => e.value);
    const newOtp=otpArray.join('')

    const {data} = await axios.post(backendUrl + '/api/auth/verify-account',{newOtp})

    if(data.success){
      toast.success(data.message)
      getUserData()
      navigate('/')
    }else{
      toast.error(data.message)
    }
  }catch (error){
    toast.error(error.message)
  }
}

useEffect(()=>{
loggedIn && userData && userData.accVerified && navigate('/')
},[loggedIn,userData])

  return (
    <div>
      <img  onClick={() => navigate('/')} src="/logo2.png" alt="LOGO" className='size-13 absolute top-6 left-6 cursor-pointer' />
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <form onSubmit={onSubmitHandler} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email id.</p>

        <div className='flex justify-between mb-8' onPaste={handlePaste}>
          {Array(6).fill(0).map((_, index)=>(
            <input ref={e => inputRefs.current[index] = e} type="text" maxLength='1' key={index} required 
            className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded=md'
            onInput={(e) => handleInput(e,index)}
            onKeyDown={(e) => handleKeyDown(e,index)}/>
            
          ))}
          </div>
          <button className='w-full py-3 bg-gray-600 text-white'>Verify</button>
      </form>
        
    </div>
    </div>
  )
}

export default EmailVerify