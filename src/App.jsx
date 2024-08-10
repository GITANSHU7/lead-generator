import { Flowbite } from "flowbite-react";
import { Toaster } from "react-hot-toast";
import {
    Route,
    BrowserRouter as Router,
    Routes
} from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./Context/AuthContext";
import PrivateRoute from "./Context/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import ForgetPassword from "./pages/ForgetPassword";
import NotAuthorized from "./pages/NotAuthorized";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

function App() {
  return (
    <>
      <AuthProvider>
        <Flowbite>
          <Toaster />

          <Router>
            <Routes>
              <Route element={<PrivateRoute />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/not-authorized" element={<NotAuthorized />} />
              </Route>
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path = "/forget-password" element = {<ForgetPassword />} />    
            </Routes>
          </Router>
        </Flowbite>
      </AuthProvider>
      {/* <Signup /> */}
    </>
  );
}

export default App;
