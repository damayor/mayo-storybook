import React, { type JSX } from 'react';
import type { DmColor } from '../../../interfaces/story-variants';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
    level: HeadingLevel;
    children: React.ReactNode;
    variant?: DmColor
    className?: string;
}

export const Heading: React.FC<HeadingProps> = ({ level, children, variant = 'neutral', className, ...props }) => {

    const getHeadingColor = () => 
        variant == 'info' ? 'text-white' : `text-${variant}` 

    switch (level) {
        case 1:
            //Todo Why so little? they've got in 6xl and bold
            return <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-lato font-bold uppercase tracking-wider text-primary ${  getHeadingColor()} ${className}`} {...props}>{children}</h1>;
        case 2:
            //Todo 5xl este si para title de cada secion, bold
            return <h2 className={`text-5xl font-roboto font-bold uppercase tracking-widest ${getHeadingColor()} ${className}`} {...props}>{children}</h2>;
        case 3:
            // <h3 className="text-2xl font-bold text-gray-800 mb-3"></h3>
            return <h3 className={`text-2xl font-roboto font-bold normal-case tracking-wider mb-3 ${getHeadingColor()} ${className}`} {...props}>{children}</h3>;
        case 4:
            return <h4 className={`text-lg font-roboto font-bold mb-1 ${getHeadingColor()} ${className}`} {...props}>{children}</h4>;
        case 5:
            return <h5 className={` ${className}`} {...props}>{children}</h5>;
        case 6:
            return <h6 className={` ${className}`} {...props}>{children}</h6>;
        default:
            return <h1 {...props}>{children}</h1>;
    }
};

