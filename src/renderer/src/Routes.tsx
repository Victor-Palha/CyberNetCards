import { Router, Route } from 'electron-router-dom'
import { Home } from './Screens/Home'
import { Login } from './Screens/Login'
import { SignUp } from './Screens/SignUp'
import { Deck } from './Screens/Deck'
import { Rules } from './Screens/Rules'

export function AppRoutes() {
  return (
    <Router
      main={
        <>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<SignUp/>} />
          <Route path="/deck" element={<Deck/>} />
          <Route path="/rules" element={<Rules/>}/>

        </>
      }
    //   about={<Route path="/" element={<AboutScreen />} />}
    />
  )
}