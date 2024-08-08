import React from 'react'
import ReactDOM from 'react-dom/client'
import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import './index.css'
import './COMPONENTS/AUTH/Auth.css'
import Login from './COMPONENTS/AUTH/Login.jsx'
import Register from './COMPONENTS/AUTH/Register.jsx'
import Home from './COMPONENTS/HOME/Home.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element:<Login></Login>
  },
  {
    path: "/register",
    element:<Register></Register>
  },
  {
    path: "/home",
    element:<Home></Home>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>

  </React.StrictMode>,
)
