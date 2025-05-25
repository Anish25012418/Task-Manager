import React from 'react';
import AuthImage from '../../assets/images/auth.jpg'

const AuthLayout = ({children}) => {
  return (
    <div className="flex">
      <div className="w-screen h-screen md:w-[40vw] px-12 pt-8 pb-12">
        <h2 className="text-lg font-medium text-black">Task Manager</h2>
        {children}
      </div>

      <div className="hidden md:flex w-[50vw] ml-auto h-screen items-center justify-center">
        <img src={AuthImage} alt="Auth Image" loading="lazy" className="lg:w-[100%] h-svh bg-[url('/bg.jpg')]"/>
      </div>
    </div>
  );
};

export default AuthLayout;