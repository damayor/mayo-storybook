import React from 'react';

// import './button.css';

export const GL_BUTTON_THEME = {
  onlight: 'light',
  ondark: 'dark'
} as const

export type GlButtonTheme = keyof typeof GL_BUTTON_THEME

export type ButtonColor = 'primary' | 'secondary' | 'neutral' | 'white' | 'accent' | 'info' | 'success' |'warning' | 'error';

export interface ButtonProps {

  color?: ButtonColor
  size?: 'small' | 'medium' | 'large';
  theme?: GlButtonTheme
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
  // const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
  //Un map

  const getButtonClass = ()  => {
    if (color !== "white") {
      return `btn-${color} hover:bg-${color}/80`
    }
    else
    {
      if(theme == 'ondark') //Fixealo para que salga transparente, no fondo negro
      {
         'btn-neutral btn-outline'
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

