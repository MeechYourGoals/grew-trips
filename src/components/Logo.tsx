import React from 'react';
import logoImage from '../assets/triv-logo.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  withBackground?: boolean;
}

export const Logo = ({ size = 'md', className = '', withBackground = true }: LogoProps) => {
  const sizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-10 w-auto', 
    lg: 'h-12 w-auto'
  };

  const backgroundClasses = withBackground 
    ? 'bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5' 
    : '';

  return (
    <div className={`inline-flex items-center ${backgroundClasses} ${className}`}>
      <img 
        src={logoImage}
        alt="Triv"
        className={sizeClasses[size]}
      />
    </div>
  );
};