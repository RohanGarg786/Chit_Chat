import { Button, Typography } from '@mui/material'
import axios from 'axios';
import React, { FormEvent, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'
import { GlobalStateContext } from '../../components/ContextApi/GlobalStateProvide';
import toast from 'react-hot-toast';

const Login = () => {
    const [phone,setPhone] =React.useState<string>("");
    const [password,setPassword] =React.useState<string>("")

    const navigate = useNavigate()

    const context = useContext(GlobalStateContext)
    if (!context) {
        throw new Error("useGlobalState must be used within a GlobalStateProvider");
    }

    const {setIsAuthenticated , isAuthenticated} =context;

    const loginHandler = async (e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try {
            const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/login`,
            { phone, password },
            {
                headers: {
                'Content-Type': 'application/json'
                },
                withCredentials: true
            }
            );

            if (response?.status === 200) {
            await setIsAuthenticated(true);
            toast.success("Login Successful", {
                duration: 2000,
            });
            navigate('/');
            }
        } catch (error: any) {
           if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Invalid Credentials";
                toast.error(message, { duration: 2000 });
            } else {
                toast.error("An unexpected error occurred");
            }
        }
    }
    useEffect(() => {
        console.log("Authentication status changed:", isAuthenticated);
      }, [isAuthenticated]);

  return (
    <div className='login'>
    <form className='loginForm' onSubmit={loginHandler}>

        <Typography variant='h3' style={{padding:"2vmax" , fontWeight: '600',}}>
            Login 
            <span style={{marginLeft:'5px', color: 'skyBlue', fontWeight:'500'}}>ChitChat</span>
        </Typography>

        <input type='phone' placeholder='Phone' required value={phone} onChange={(e)=>setPhone(e.target.value)}/>

        <input type="password" placeholder='Password' required value={password} onChange={(e)=>setPassword(e.target.value)}/>

        <Link to="/forgot/password">
            <Typography style={{color: 'black'}}>Forgot Password?</Typography>
        </Link>

        <Button type='submit' style={{color: 'skyBlue'}} >Login</Button>

        <Link to="/register">
            <Typography style={{color: 'black'}}>New User?</Typography>
        </Link>

    </form>
  
</div>
  )
}

export default Login