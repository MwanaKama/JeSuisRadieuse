import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import CalendlyPopup from './CalendlyPopup';

interface CalendlyButtonProps {
  text?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CalendlyButton: React.FC<CalendlyButtonProps> = ({ 
  text = "Prendre un 1er RDV gratuit",
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const getButtonClasses = () => {
    const baseClasses = "font-poppins font-semibold inline-flex items-center space-x-2 transition-all hover:shadow-xl hover:scale-105 rounded-full";
    
    const variants = {
      primary: "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white",
      secondary: "bg-white text-purple-600 hover:bg-gray-100",
      outline: "border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg"
    };

    return `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  };

  return (
    <>
      <button
        onClick={() => setIsPopupOpen(true)}
        className={getButtonClasses()}
      >
        <Calendar className="h-5 w-5" />
        <span>{text}</span>
      </button>

      <CalendlyPopup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)} 
      />
    </>
  );
};

export default CalendlyButton;