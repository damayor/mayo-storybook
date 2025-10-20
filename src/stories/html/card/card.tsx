import type { DmColor, DmTheme } from "Interfaces/story-variants";
import './style.css' 
import { useState } from "react";
import { Badge } from "HtmlComponents/badge";
import { Button } from "HtmlComponents/button";
import { Heading } from "HtmlComponents/headings";
import { Icon } from "HtmlComponents/icons";

export interface CardProps {
  color?: DmColor
  theme?: DmTheme
  label?: string;
  projectTitle: string;
  subtitle: string;
  picture: string;
  tags: string[];
  technologies: string[];
  projectField: string;
  ctaLink?: string
}

export const Card = ({
  color = 'primary',
  label = '',
  theme = 'onlight',
  projectTitle, 
  subtitle, 
  picture,
  tags, 
  technologies, 
  projectField,
  ctaLink,
  ...props
}: CardProps) => {

  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="w-full sm:w-90 h-[500px] perspective-midrange"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div 
        className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* FRONT SIDE */}
        <div 
          className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Header con campo/categoría */}
          <div className="relative">

            {/* ToDo Badge de categoría */}
            {/* <div className="absolute top-4 right-4 z-10">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-camelot-800 text-white shadow-lg">
                {projectField}
              </span>
            </div> */}
            
            {/* Imagen */}
            <div className="h-48 w-full overflow-hidden bg-gray-100">
              <img 
                src={picture} 
                alt={projectTitle}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* <h3 className="text-2xl font-bold text-gray-800 mb-3">
              {projectTitle}
            </h3> */}
            <Heading level={3} children={projectTitle} />
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
              {subtitle}
            </p>

            <div className="flex flex-wrap gap-2 mb-4 mt-2 justify-center">
              {tags.map((tool, i) => (
                <span key={i} className="px-3 py-1 bg-camelot-700/20 text-camelot-800 rounded-full text-sm">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

      {/* BACK SIDE */}
        <div 
          className="absolute w-full h-full backface-hidden bg-gradient-to-br from-camelot-100 to-white rounded-2xl shadow-xl p-6 flex flex-col justify-center"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >

          <div className="flex flex-wrap gap-6 mb-8 justify-center">
            {technologies.map((tech) => (
              <Icon
                size="medium"
                technology={tech}
                className="mb-2"
              />
            ))}
          </div>

          {/* Tools/Technologies */}
          {/* My Comp Style */}
          {/* <div className="mb-6">
            <div className="flex flex-wrap gap-2 justify-center p-2">
              {tags.map((tool, index) => (
                <Badge
                  color="primary"
                  key={index}
                  label= {tool}
                />
              ))}
            </div>
          </div> */}


          <div className="text-center mb-6">
            <Button onClick={() =>  window.open(ctaLink, "_blank")} twStyle="p-2" color='info' label={"EXPLORE NOW"} />
          </div>
        </div>
      </div>
    </div>
  );
}