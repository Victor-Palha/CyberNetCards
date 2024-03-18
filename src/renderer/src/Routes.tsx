import { Router, Route } from 'electron-router-dom'
import { Home } from './Screens/Home'
import { Login } from './Screens/Login'
import { SignUp } from './Screens/SignUp'
import { Deck } from './Screens/Deck'
import { Rules } from './Screens/Rules'
import { CreateDeck } from './Screens/Deck/CreateDeck'
import { EditDeck } from './Screens/Deck/EditDeck'
import { ConfrontProvider } from './context/confrontContext'
import { Rooms } from './Screens/Rooms'
import { ConfrontRoom } from './Screens/ConfrontRoom'

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
          <Route path="/deck/create" element={<CreateDeck/>} />
          <Route path="/deck/:deck_id" element={<EditDeck/>} />
          <Route path="/confront/rooms" element={
              <ConfrontProvider>
                  <Rooms/>
              </ConfrontProvider>
          }/>
          <Route path="/confront/:room_id" element={
            <ConfrontProvider>
                <ConfrontRoom/>
            </ConfrontProvider>
          }/>
        </>
      }
    //   about={<Route path="/" element={<AboutScreen />} />}
    />
  )
}