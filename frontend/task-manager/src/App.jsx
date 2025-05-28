import React from 'react';
import Login from "./pages/Auth/Login.jsx";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import SignUp from "./pages/Auth/SignUp.jsx";
import UserProvider from "./context/userContext.jsx";
import Root from "./pages/Root.jsx";
import UserDashboard from "./pages/User/UserDashboard.jsx";
import Dashboard from "./pages/Admin/Dashboard.jsx";
import CreateTask from "./pages/Admin/CreateTask.jsx";
import {Toaster} from "react-hot-toast";
import ManageTasks from "./pages/Admin/ManageTasks.jsx";
import ManageUsers from "./pages/Admin/ManageUsers.jsx";
import MyTasks from "./pages/User/MyTasks.jsx";

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

            //Tasks
            <Route path="/admin/create-task" element={<CreateTask/>}/>
            <Route path="/admin/tasks" element={<ManageTasks/>}/>

            //Users
            <Route path="/admin/users" element={<ManageUsers/>}/>

            //User Routes
            <Route path="/user/tasks" element={<MyTasks/>}/>
          </Routes>
        </Router>
      </div>

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          }
        }}/>
    </UserProvider>
  );
};

export default App;