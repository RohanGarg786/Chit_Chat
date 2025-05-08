import React, { useContext } from 'react'
import {  Route,BrowserRouter as Router , Routes } from 'react-router-dom'
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'
import './App.css'
import 'regenerator-runtime/runtime'
// import {io} from 'socket.io-client'
import { GlobalStateContext } from './components/ContextApi/GlobalStateProvide'
// import AddNewContact from './pages/AddNewContact/AddNewContact'
import Home from './pages/Home/Home'
import ProtectedRoute from './components/Routes/ProtectedRoute'

const App : React.FC = () => {

  // const socket = io("http://localhost:8000");
  
  const context = useContext(GlobalStateContext)
  if (!context) {
      throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }

  // const {isAuthenticated, loading} = context;

  // if (loading) {
  //   return <LoadingSpinner />; // or a blank screen, loader, etc.
  // }
  
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" />;
  // }
  return (
    <>    
    
     
     <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* 🔐 Protect this route */}
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />

        {/* Add more protected routes here */}
      </Routes>
    </Router>
     
    </>
  )
}

export default App