import React, {useContext, useState} from 'react';
import AuthLayout from "../../components/layouts/AuthLayout.jsx";
import {validateEmail} from "../../utils/helper.js";
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector.jsx";
import Input from "../../components/inputs/Input.jsx";
import {Link, useNavigate} from "react-router-dom";
import {API_PATHS} from "../../utils/apiPaths.js";
import {authHandler} from "../../utils/authHandler.js";
import {UserContext} from "../../context/userContext.jsx";
import uploadImage from "../../utils/uploadImage.js";

const SignUp = () => {
  const [profile, setProfile] = useState({
    profileImageUrl: "",
    name: "",
    email: "",
    password: "",
    adminInviteToken: "",
  })
  const [profileImage, setProfileImage] = useState(null)
  const [error, setError] = React.useState(null);

  const {updateUser} = useContext(UserContext);

  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (!profile.name) {
      setError("Please enter full name.");
      return;
    }
    if (!validateEmail(profile.email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!profile.password) {
      setError("Please enter your password");
      return;
    }

    setError("");

    if (profileImage){
      try {
        const imageUploadRes = await uploadImage(profileImage);
        console.log(imageUploadRes);
        setProfile((prevState) => ({...prevState, profileImageUrl: imageUploadRes.imageUrl || ""}));
      } catch (error) {
        setError(error);
      }
    }

    await authHandler({
      path: API_PATHS.AUTH.REGISTER,
      credentials: profile,
      updateUser,
      navigate,
      setError
    });
  }

  const handleChange = (e) => {
    const {name, value} = e.target;
    setProfile((prevState) => ({...prevState, [name]: value}));
  }

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today bt entering your details below.
        </p>

        <form action={handleSignUp}>
          <ProfilePhotoSelector image={profileImage} setImage={setProfileImage}/>
          <div className="grid grid-cols-1 md-grid-cols-2 gap-0">
            <Input name="name" value={profile.name} onChange={handleChange} placeholder="John Doe" type="text"
                   label="Full Name"/>
            <Input name="email" value={profile.email} onChange={handleChange} label="Email Address"
                   placeholder="johndoe@example.com"
                   type="text"/>
            <Input name="password" value={profile.password} onChange={handleChange} label="Password"
                   placeholder="Min 8 characters"
                   type="password"/>
            <Input name="adminInviteToken" value={profile.adminInviteToken} onChange={handleChange} label="Admin Invite Token"
                   placeholder="6 Digit Code"
                   type="text"/>
            {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

            <button type="submit" className="btn-primary">Sign Up</button>

            <p className="text-[13px] text-slate-800 mt-3">
              Already have an account?{" "}
              <Link className="font-medium text-primary underline" to="/login">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;