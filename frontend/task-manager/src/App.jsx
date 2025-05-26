import React from 'react';
import Login from "./pages/Auth/Login.jsx";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import SignUp from "./pages/Auth/SignUp.jsx";
import UserProvider from "./context/userContext.jsx";
import Root from "./pages/Root.jsx";
import UserDashboard from "./pages/User/UserDashboard.jsx";
import Dashboard from "./pages/Admin/Dashboard.jsx";

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<Root/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<SignUp/>}/>

            //Dashboard
            <Route path="/user/dashboard" element={<UserDashboard/>}/>
            <Route path="/admin/dashboard" element={<Dashboard/>}/>
          </Routes>
        </Router>
      </div>
    </UserProvider>
  );
};

export default App;