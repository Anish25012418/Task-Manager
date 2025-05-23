import React, {useState} from 'react';
import { FaRegEye, FaRegEyeSlash} from 'react-icons/fa6'

const Input = ({name, onChange, label, placeholder, type}) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = onChange || (() => {});
  const toggleShowPassword = () => setShowPassword(prev => !prev);

  return (
    <div>
      <label className="text-[13px] text-slate-800" htmlFor={name}>{label}</label>
      <div className="input-box">
        <input
          className="w-full bg-transparent outline-none"
          name={name}
          type={type === "password" ? showPassword ? "text" : "password" : type}
          placeholder={placeholder}
          onChange={handleChange}
          />

        {type === 'password' && (
          <>
            {showPassword ? (
              <FaRegEye size={22} className="text-primary cursor-pointer" onClick={() => toggleShowPassword()}/>
            ) : (
              <FaRegEyeSlash size={22} className="text-slate-400 cursor-pointer" onClick={() => toggleShowPassword()}/>
            )}
          </>
        )

        }

      </div>

    </div>
  );
};

export default Input;