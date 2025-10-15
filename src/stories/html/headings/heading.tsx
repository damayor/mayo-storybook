import React, { type JSX } from 'react';
import type { DmColor } from '../../../interfaces/story-variants';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
    level: HeadingLevel;
    children: React.ReactNode;
    variant?: DmColor
}



export const Heading: React.FC<HeadingProps> = ({ level, children, variant = 'neutral', ...props }) => {

    const getHeadingColor = () => 
        variant == 'info' ? 'text-white' : `text-${variant}` 

    switch (level) {
        case 1:
            //Todo Why so little? they've got in 6xl and bold
            return <h1 className={`text-4xl font-lato font-bold uppercase tracking-wider text-primary ${  getHeadingColor()}`} {...props}>{children}</h1>;
        case 2:
            //Todo 5xl este si para title de cada secion, bold
            return <h2 className={`text-2xl font-roboto font-bold uppercase tracking-widest ${getHeadingColor()}`} {...props}>{children}</h2>;
        case 3:
            return <h3 className={`text-xl font-bold normal-case text-neutral tracking-widest ${getHeadingColor()}`} {...props}>{children}</h3>;
        case 4:
            return <h4 {...props}>{children}</h4>;
        case 5:
            return <h5 {...props}>{children}</h5>;
        case 6:
            return <h6 {...props}>{children}</h6>;
        default:
            return <h1 {...props}>{children}</h1>;
    }
};

