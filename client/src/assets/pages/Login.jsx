import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/appContex'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {

    const {backendUrl,loggedIn, setLoggedIn,getUserData} = useContext(AppContext)
    

    const [state,setState] = useState('Sign up')
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [pass,setPass] = useState('')

    const navigate = useNavigate()

    const onSubmitHandler =async (e)=>{
        try{
            e.preventDefault();

            axios.defaults.withCredentials=true
            if(state === "Sign up"){
             const {data} = await axios.post(backendUrl + '/api/auth/register', {name,email,password:pass})

             if(data.success){
                setLoggedIn(true)
                getUserData()
                navigate('/')
                
             }else{
                 toast.error(data.message)
             }
            }else{
              const {data} = await axios.post(backendUrl + '/api/auth/login', {email,password:pass})

             if(data.success){
                setLoggedIn(true)
                getUserData()
                navigate('/')
             }else{
                 toast.error(data.message)
             }
            }
        }catch (error){
            console.log(error)
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    }
  return (

    <div>
        <img  onClick={() => navigate('/')} src="/public/logo2.png" alt="LOGO" className='size-13 absolute top-6 left-6 cursor-pointer' />
    <div className='flex flex-col items-center justify-center min-h-screen px-6 sm:px-0'>
        <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-500 text-sm'> 
        
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'Sign up' ? 'Create  Account': 'Login'}</h2>
        <p className='text-center text-sm mb-6'>{state === 'Sign up' ? 'Create Your Account': 'Login to Your Account'}</p>
            
        
        <form onSubmit={onSubmitHandler}>

            {state === 'Sign up' && (<div className='mb-4 items-center flex gap-3 w-full px-5 py-2.5 rounded-full bg-gray-800'>
                <input onChange={e => setName(e.target.value)} value={name} className='bg-transparent outline-none text-white' type="text" placeholder='FULL NAME' required />
            </div>)}
            
            <div className='mb-4 items-center flex gap-3 w-full px-5 py-2.5 rounded-full bg-gray-800'>
                <input onChange={e => setEmail(e.target.value)} value={email} className='bg-transparent outline-none text-white' type="text" placeholder='EMAIL' required />
            </div>
            <div className='mb-4 items-center flex gap-3 w-full px-5 py-2.5 rounded-full bg-gray-800'>
                <input onChange={e => setPass(e.target.value)} value={pass} className='bg-transparent outline-none text-white' type="text" placeholder='PASSWORD' required />
            </div>

            <p onClick={()=>navigate('/reset-pass')} className='mb-4 text-indigo-500 cursor-pointer'>Forgot Password?</p>

            <button className='w-full py-2.5 rounded-full bg-gray-800 text-white font-semibold'>{state}</button>
        </form>

        {state === 'Sign up'? (<p className='text-center text-xs mt-3'>Already have an Account? {" "}
            <span className='text-blue-600 cursor-pointer underline'onClick={()=> setState('Login')}>Login here</span>
        </p>) : (<p className='text-center text-xs mt-3'>Don't have an Account? {" "}
            <span onClick={()=> setState('Sign up')} className='text-blue-600 underline cursor-pointer'>Sign up</span>
        </p>)}
        
        
        </div>
    </div>
    </div>
  )
}

export default Login