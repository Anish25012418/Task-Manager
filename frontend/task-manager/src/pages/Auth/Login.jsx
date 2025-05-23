import React from 'react';
import AuthLayout from "../../components/layouts/AuthLayout.jsx";
import {Link, useNavigate} from "react-router-dom";
import Input from "../../components/inputs/Input.jsx";
import {validateEmail} from "../../utils/helper.js";

const Login = () => {
  const [loginCredentials, setLoginCredentials] = React.useState({email: '', password: ''});
  const [error, setError] = React.useState(null);

  // const navigate = useNavigate();

  const handleLogin = async (formData) => {
    const email = formData.get("email");
    const password = formData.get("password");
    if (!validateEmail(email)){
      setError("Please enter a valid email address");
      return;
    }
    if(!password){
      setError("Please enter your password");
      return;
    }
    setLoginCredentials({email, password});

    setError("");
  }
  return (
    <div>
      <AuthLayout>
        <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
          <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
          <p className="text-xs text-slate-700 mt-[5px] mb-6">Please enter your details to login</p>


          <form action={handleLogin}>
            <Input name="email" label="Email Address" placeholder="johndoe@example.com"
                   type="text"/>
            <Input name="password" label="Password" placeholder="Min 8 characters"
                   type="password"/>

            {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

            <button type="submit" className="btn-primary">Login</button>

            <p className="text-[13px] text-slate-800 mt-3">
              Don't have an account?{" "}
              <Link className="font-medium text-primary underline" to="/signup">SignUp</Link>
            </p>
          </form>
        </div>
      </AuthLayout>
    </div>
  );
};

export default Login;