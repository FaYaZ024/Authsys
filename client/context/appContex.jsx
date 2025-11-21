import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext()

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials= true;


    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [loggedIn,setLoggedIn] = useState(false)
    const [userData,setUserData] = useState(false)

    const getAuth = async ()=>{
        try{
            const {data} = await axios.get(backendUrl + '/api/auth/is-authed')

            if(data.success){
                setLoggedIn(true)
                getUserData()
            }
        }catch (error){
            console.log(error);
    toast.error(error.response?.data?.message || "Something went wrong");
        }
    }

    const getUserData = async () => {
  try {
    const { data } = await axios.get(backendUrl + '/api/user/data', {withCredentials:true});

    if (data.success) {
      setUserData(data.user);   
    } else {
      toast.error(data.message);
    }

  } catch (error) {
    console.log(error);
    toast.error(error.response?.data?.message || "Something went wrong");
  }
};

    useEffect(()=>{
        getAuth();
    },[])

    const value ={
        backendUrl,
        loggedIn,setLoggedIn,
        userData,setUserData,
        getUserData
    }
    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}