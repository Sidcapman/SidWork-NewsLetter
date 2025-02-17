import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
}

export default function Button({
  isLoading,
  variant = 'primary',
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center";
  
  const variants = {
    primary: "bg-green-500 text-black hover:bg-green-400 disabled:opacity-50",
    secondary: "bg-gray-700 text-green-400 hover:bg-gray-600 disabled:opacity-50",
    outline: "border-2 border-green-500 text-green-400 hover:bg-green-500 hover:text-black disabled:opacity-50"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : children}
    </button>
  );
}