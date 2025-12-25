import { Route, Routes, Navigate } from "react-router-dom"
import HomePage from './Pages/HomePage.jsx'
import LoginPage from './Pages/loginPage.jsx'
import OnBoardingPage from './Pages/onBoardingPage.jsx'
import SignupPage from './Pages/signUpPage.jsx'
import CallPage from './Pages/callPage.jsx'
import ChatPage from './Pages/chatPage.jsx'
import NotificationPage from './Pages/notificationPage.jsx'
import { Toaster } from 'react-hot-toast'
import Loader from './components/loader.jsx'
import useAuthuser from './hooks/useAuthuser.js'
import Layout from './components/Layout.jsx'

const App = () => {
  const { isLoading, authUser } = useAuthuser();
  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnBoarded; // Fixed: Capital 'B'

  // Show loading spinner while checking authentication
  if (isLoading) return <Loader />

  return (
    <div>
      <Routes>
        <Route
          path='/'
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSideBar={true}>
                <HomePage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route path='/call' element={isAuthenticated ? <CallPage /> : <Navigate to="/login" />} />
        <Route path='/chat' element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path='/notification' element={isAuthenticated && isOnboarded ? (
          <Layout showSideBar={true}>
            <NotificationPage />
          </Layout>) : (<Navigate to={!isAuthenticated ? '/login' : ' /onboarding'} />
        )} />

        <Route
          path='/onboarding'
          element={isAuthenticated ? (
            !isOnboarded ? // Fixed: using isOnboarded variable
              <OnBoardingPage />
              : <Navigate to="/" />
          ) : (
            <Navigate to="/login" />
          )}
        />

        <Route path='/login' element={!isAuthenticated ? <LoginPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />} />
        <Route path='/signup' element={!isAuthenticated ? <SignupPage /> : <Navigate to="/" />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App