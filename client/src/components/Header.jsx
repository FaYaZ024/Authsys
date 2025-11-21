import React, { useContext,useState } from 'react'
import { AppContext } from '../assets/context/appContex'

const Header = () => {

const {userData} =useContext(AppContext)


  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center'>
      <img src="/you.png" alt="You" className='size-38  ' />
        <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hey {userData? userData.name.toUpperCase() : 'Developer'}!</h1>
        <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>{userData? 'Thanks for Your support': 'Welcome to My APP' }</h2>
        <p className='mb-8 max-w-md'>{userData ? 'Make sure to verify Your email And Your support means a lot - Hope it serves you well.' : "Let's start with a quick product tour and we will have you up and running in no time!"}</p>
        {/* <button className='border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all'>Get Started</button> */}
    </div>
  )
}

export default Header  