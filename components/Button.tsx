import React from 'react';
import {ButtonProps} from '../lib/definitions';


const Button: React.FC<ButtonProps> = ({ label, onClick, className = "", disabled = false, image }) => {
  const imageButtonStyle = `p-1 bg-transparent border-none shadow-none hover:opacity-80 transition-opacity cursor-pointer ${disabled ? "opacity-50 !cursor-not-allowed" : ""}
  ${className}`;
  const textButtonStyle = `px-6 py-2 w-full h-10 rounded shadow-md border border-gray-400 font-medium transition flex items-center justify-center cursor-pointer
    ${disabled 
      ? "bg-gray-300 text-gray-500 !cursor-not-allowed" 
      : "bg-yellow-200 hover:bg-yellow-300 text-black"
    }
    ${className}`;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={image ? imageButtonStyle : textButtonStyle}
    >
      {image ? (
        <img 
          src={image} 
          alt={label || "icon"} // 
          className="w-16 h-16 object-contain" 
        />
      ) : (
        <div dangerouslySetInnerHTML={{ __html: label || "" }} />
      )}
    </button>
  );
};

export default Button;