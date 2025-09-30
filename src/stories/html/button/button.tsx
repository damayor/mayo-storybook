import React from 'react';

// import './button.css';

export interface ButtonProps {

  color?: 'dark' | 'light' | 'primary';
  size?: 'small' | 'medium' | 'large';
  label: string;
  onClick?: () => void;
}

export const Button = ({
  color = 'primary',
  size = 'medium',
  label,
  ...props
}: ButtonProps) => {
  // const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
  return (
    <button className="btn btn-accent">{label}</button>
    // <button
    //   className="btn btn-lg"
    //   type="button"
    //   {...props}
    // >
    //   {label}
    // </button>
  );
};
