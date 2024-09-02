import ReactDOM from 'react-dom/client'
import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import './index.css'
import './COMPONENTS/AUTH/Auth.css'
import Login from './COMPONENTS/AUTH/Login.jsx'
import Register from './COMPONENTS/AUTH/Register.jsx'
import Home from './COMPONENTS/HOME/Home.jsx'
import Inbox from './COMPONENTS/INBOX/Inbox.jsx'
import ViewFlat from './COMPONENTS/HOME/ViewFlat.jsx'
import ForgotPassword from './COMPONENTS/AUTH/ForgotPassword.jsx'
import FirstView from './COMPONENTS/FIRST_VIEW/FirstView.jsx'
import Profile from './COMPONENTS/PROFILE/Profile.jsx'
import { AuthProvider } from './CONTEXT/authContext.jsx'
// import DeleteAccount from './COMPONENTS/PROFILE/DeleteAccount.jsx'
import AllUsers from './COMPONENTS/HOME/AllUsers.jsx'
import UsersProfile from './COMPONENTS/PROFILE/UsersProfile.jsx'


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
  // {
  //   path: "/delete-account",
  //   element:<DeleteAccount></DeleteAccount>
  // },
  {
    path: "/profile-update",
    element: <Profile></Profile>
  },
  {
    path: "/all-users",
    element: <AllUsers></AllUsers>
  },
  {
    path: "/users-profile/:userUId",
    element: <UsersProfile></UsersProfile>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
 
   

  <AuthProvider>
    <RouterProvider router={router}>

    </RouterProvider>
  </AuthProvider>
)
  

 

