import React from 'react'
import ReactDOM from 'react-dom/client'
import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import './index.css'
import './COMPONENTS/AUTH/Auth.css'
import Login from './COMPONENTS/AUTH/Login.jsx'
import Register from './COMPONENTS/AUTH/Register.jsx'
import { ThemeProvider,createTheme } from '@mui/material/styles'
import { AuthProvider } from './CONTEXT/authContext.jsx'
import Home from './COMPONENTS/HOME/Home.jsx'

const theme =createTheme();

const router = createBrowserRouter([
  {
    path: "/login",
    element:<Login></Login>
  },
  {
    path: "/register",
    element:<Register></Register>
  },
  {
    path: "/",
    element:<Home></Home>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
 
   

  <AuthProvider>
    <RouterProvider router={router}>

    </RouterProvider>
  </AuthProvider>
)
  

 

