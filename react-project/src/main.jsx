import ReactDOM from 'react-dom/client'
import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import './index.css'
import './COMPONENTS/AUTH/Auth.css'
import Login from './COMPONENTS/AUTH/Login.jsx'
import Register from './COMPONENTS/AUTH/Register.jsx'
import Home from './COMPONENTS/HOME/Home.jsx'
import Inbox from './COMPONENTS/HOME/Inbox.jsx'
import ViewFlat from './COMPONENTS/HOME/ViewFlat.jsx'
import { AuthProvider } from './CONTEXT/authContext.jsx'


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
    path: "/inbox",
    element: <Inbox></Inbox>
  },
  {
    path: "/flats/:flatId",
    element: <ViewFlat></ViewFlat>
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
  

 

