import React from 'react';

const TextField = ({
  label,
  icon,
  name,
  id,
  value,
  error,
  info,
  type,
  onChange
}) => {
  return (
    <div className='input-field col s12'>
      <i class='material-icons prefix'>{icon}</i>
      <input
        name={name}
        value={value}
        id={id}
        type={type}
        class='validate'
        onChange={onChange}
        required
        aria-required
      />
      <label className={value ? 'active' : null} htmlFor={id}>
        {label}
      </label>
      {error ? (
        <span class='error-text'>{error}</span>
      ) : !value ? (
        info ? (
          <span class='helper-text'>{info}</span>
        ) : null
      ) : null}
    </div>
  );
};

TextField.defaultProps = {
  type: 'text'
};

export default TextField;
