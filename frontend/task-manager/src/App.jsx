import React from 'react';
import Login from "./pages/Auth/Login.jsx";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import SignUp from "./pages/Auth/SignUp.jsx";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
           <Route path="/login" element={<Login/>} />
           <Route path="/signup" element={<SignUp/>} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;