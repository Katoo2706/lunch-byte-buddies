import { User, Heart } from 'lucide-react';

interface GenderIconProps {
  gender: 'male' | 'female';
  className?: string;
}

export const GenderIcon = ({ gender, className = "gender-icon" }: GenderIconProps) => {
  if (gender === 'male') {
    return <User className={`${className} text-blue-500`} />;
  }
  
  return <Heart className={`${className} text-pink-500`} />;
};