import { Button, Typography } from '@mui/material'
import axios from 'axios';
import React, { FormEvent, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'
import { GlobalStateContext } from '../../components/ContextApi/GlobalStateProvide';

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
       const response =  await axios.post('http://localhost:8000/api/v1/user/login',{phone,password},{
            headers:{
                'Content-Type':'application/json'
            },
            withCredentials: true // Allows cookies to be sent and received
        })
        // const { token } = response.data;

        const {token} = response.data
        
        if (token) {
            // Set the token in cookies for future requests
           await setIsAuthenticated(true); // Update your authentication state
            // Redirect the user to the home page
            navigate('/api/v1/user') // Adjust according to your routing library
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

        <Link to="/api/v1/user/register">
            <Typography style={{color: 'black'}}>New User?</Typography>
        </Link>

    </form>
  
</div>
  )
}

export default Login