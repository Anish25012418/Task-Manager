import React from 'react';
import Login from "./pages/Auth/Login.jsx";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import SignUp from "./pages/Auth/SignUp.jsx";
import UserProvider from "./context/userContext.jsx";
import Root from "./pages/Root.jsx";

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<SignUp/>}/>
          </Routes>
        </Router>
      </div>
    </UserProvider>
  );
};

export default App;