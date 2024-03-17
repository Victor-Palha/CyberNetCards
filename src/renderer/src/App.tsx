import { ToastContainer } from "react-toastify"
import { AppRoutes } from "./Routes"
import 'react-toastify/dist/ReactToastify.css';
import "./styles/globals.css"
import { AuthProvider } from "./context/authContext";

export function App(): JSX.Element {
  return (
    <AuthProvider>
      <AppRoutes />
      <ToastContainer
          limit={1}
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
      />
      </AuthProvider>
  )
}