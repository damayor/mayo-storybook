import React from 'react';
import type { DmColor, DmTheme } from '../../../interfaces/story-variants';

export interface ButtonProps {

  color?: DmColor
  size?: 'small' | 'medium' | 'large';
  theme?: DmTheme
  label?: string;
  onClick?: () => void;
}

export const Button = ({
  color = 'primary',
  size = 'medium',
  label = 'olakeace',
  theme,
  ...props
}: ButtonProps) => {
  const getButtonClass = ()  => {
    if (color !== "outline") {
      return `btn-${color} hover:bg-${color}/80`
    }
    else
    {
      if(theme == 'ondark') //Fixealo para que salga transparente, no fondo negro
      {
        return 'btn-neutral btn-outline'
      }
      else
      {
        return 'btn-outline'
      }
    }
  }


  return (
    <div>
      <button className={`w-32 h-10 rounded-sm btn ${getButtonClass()} `}>{label}</button>
    </div>

  );
};

