import React from 'react'
import AuthLayout from './layouts/AuthLayout'
import SignIn from './pages/SignIn'
import { Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import Success from './components/LogoutSuccess'
import BudgetOnboardingPage from './components/AccountSetup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPasswordSuccess from './components/ResetPasswordSuccess'

const App = () => {
  return (
    <Routes>
       <Route element={<AuthLayout />}>
       <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password-success" element={<ResetPasswordSuccess />} />
        <Route path="/Success" element={<Success />} />
        <Route path="/AccountSetup" element={<BudgetOnboardingPage />} />
      </Route>
    </Routes>
  )
}

export default App
