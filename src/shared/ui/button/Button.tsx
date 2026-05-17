import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button = ({
  variant = 'primary',
  children,
  ...props
}: ButtonProps) => {
  return (
    <button className={`button ${variant}`} {...props}>
      {children}
    </button>
  );
};