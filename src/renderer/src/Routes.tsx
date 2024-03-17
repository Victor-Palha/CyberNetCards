import { Router, Route } from 'electron-router-dom'
import {App} from './App'
import { Home } from './Screens/Home'
import { Login } from './Screens/Login'
import { SignUp } from './Screens/SignUp'

export function AppRoutes() {
  return (
    <Router
      main={
        <>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<SignUp/>} />
        </>
      }
    //   about={<Route path="/" element={<AboutScreen />} />}
    />
  )
}