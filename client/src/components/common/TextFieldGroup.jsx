import React from 'react';

const TextFieldGroup = ({
  name,
  placeholder,
  value,
  label,
  error,
  info,
  type,
  onChange,
  disabled,
}) => (
  <div className="form-group">
    {info && (
      <small style={{ display: 'block' }} className="form-text">
        {info}
      </small>
    )}
    <input
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  </div>
);

export default TextFieldGroup;
