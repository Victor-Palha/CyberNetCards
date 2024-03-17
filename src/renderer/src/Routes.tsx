import { Router, Route } from 'electron-router-dom'
import App from './App'

export function AppRoutes() {
  return (
    <Router
      main={
        <>
          <Route path="/" element={<App />} />
        </>
      }
    //   about={<Route path="/" element={<AboutScreen />} />}
    />
  )
}