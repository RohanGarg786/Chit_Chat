import React, { useContext } from 'react'
import { Route,BrowserRouter as Router , Routes } from 'react-router-dom'
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'
import './App.css'
import 'regenerator-runtime/runtime'
// import {io} from 'socket.io-client'
import { GlobalStateContext } from './components/ContextApi/GlobalStateProvide'
// import AddNewContact from './pages/AddNewContact/AddNewContact'
import Home from './pages/Home/Home'

const App : React.FC = () => {

  // const socket = io("http://localhost:8000");
  
  const context = useContext(GlobalStateContext)
  if (!context) {
      throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }

  const {isAuthenticated} = context;

  return (
    <>    
     <Router>
     <Routes>
      <Route path='/api/v1/user' element={isAuthenticated ? <Home/> : <Login/>}></Route>
      <Route path="/api/v1/user/register" element={<Register/>} ></Route>
      <Route path="/api/v1/user/login" element={<Login/>} ></Route>
      {/* <Route path='/api/v1/user/AddNewContact' element={<AddNewContact/>}></Route> */}
      </Routes>
     </Router>
    

    </>
  )
}

export default App