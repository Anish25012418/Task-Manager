import React from 'react';
import Login from "./pages/Auth/Login.jsx";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
           <Route path="/login" element={<Login/>} />
           {/*<Route path="/signUp" component={<Login/>} />*/}
        </Routes>
      </Router>
    </div>
  );
};

export default App;