import ReactDOM from 'react-dom/client'
import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import './index.css'
import './COMPONENTS/AUTH/Auth.css'
import Login from './COMPONENTS/AUTH/Login.jsx'
import Register from './COMPONENTS/AUTH/Register.jsx'
import Home from './COMPONENTS/HOME/Home.jsx'
import Inbox from './COMPONENTS/HOME/Inbox.jsx'
import ViewFlat from './COMPONENTS/HOME/ViewFlat.jsx'
import ForgotPassword from './COMPONENTS/AUTH/ForgotPassword.jsx'
import FirstView from './COMPONENTS/FIRST_VIEW/FirstView.jsx'
import Profile from './COMPONENTS/PROFILE/Profile.jsx'
import { AuthProvider } from './CONTEXT/authContext.jsx'
<<<<<<< HEAD
import DeleteAccount from './COMPONENTS/HOME/DeleteAccount.jsx'
import AllUsers from './COMPONENTS/HOME/AllUsers.jsx'
=======
import DeleteAccount from './COMPONENTS/PROFILE/DeleteAccount.jsx'
>>>>>>> 0b55d7ae1b853d3cebe3d044a6c98af86d1775bf


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
  },
  {
    path: "/ForgotPassword",
    element:<ForgotPassword></ForgotPassword>
  },
  {
    path: "/FirstView",
    element:<FirstView></FirstView>
  },
  {
    path: "/delete-account",
    element:<DeleteAccount></DeleteAccount>
  },
  {
    path: "/profile-update",
    element: <Profile></Profile>
  },
  {
    path: "/all-users",
    element: <AllUsers></AllUsers>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
 
   

  <AuthProvider>
    <RouterProvider router={router}>

    </RouterProvider>
  </AuthProvider>
)
  

 

