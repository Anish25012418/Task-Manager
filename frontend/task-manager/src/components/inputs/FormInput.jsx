import React from 'react';

const FormInput = ({name, label, onChange, value, placeHolder, type}) => {
  return (
    <div className="mt-4">
      <label className="text-xs font-medium text-slate-600" htmlFor={name}>{label}</label>
      <input placeholder={placeHolder}
             className="form-input"
             onChange={(e) => onChange(e)}
             name={name}
             value={value}
             type={type} />
    </div>
  );
};

export default FormInput;