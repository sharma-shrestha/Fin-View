import React from 'react'
import AuthLayout from './layouts/AuthLayout'
import SignIn from './pages/SignIn'
import { Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'

const App = () => {
  return (
    <Routes>
       <Route element={<AuthLayout />}>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
      </Route>
    </Routes>
  )
}

export default App
