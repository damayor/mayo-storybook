import type { DmColor, DmTheme } from "Interfaces/story-variants";
import './style.css' 
import { useState } from "react";
import { Badge } from "HtmlComponents/badge";
import { Button } from "HtmlComponents/button";

export interface CardProps {
  color?: DmColor
  theme?: DmTheme
  label?: string;
  projectTitle: string;
  resume: string;
  picture: string;
  toolsUsed: string[];
  projectField: string;

  //content params
}

export const Card = ({
  color = 'primary',
  label = '',
  theme = 'onlight',
  projectTitle, resume, picture, toolsUsed, projectField,
  ...props
}: CardProps) => {

  // const project1 = 
  //   {
  //     projectTitle: "ORTHÁPTICA",
  //     resume: "Simulators with one-to-one scale, not only with a visual interaction but on a haptic interaction too. I've developed training simulators with mixed reality in order to acquire immersive learning or like it's called nowadays 'serious games'.",
  //     picture: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=400&h=300&fit=crop",
  //     toolsUsed: ["virtual reality", "oculus"],
  //     projectField: "VR Development"
  //   }

  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="w-80 h-96 perspective-midrange"
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
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              {projectTitle}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
              {resume}
            </p>
          </div>

          {/* Indicador de hover
          <div className="absolute bottom-4 right-4 text-gray-400 text-xs">
            mouseOver →
          </div> */}
        </div>

      {/* BACK SIDE */}
        <div 
          className="absolute w-full h-full backface-hidden bg-gradient-to-br from-camelot-800 to-camelot-900 rounded-2xl shadow-xl p-6 flex flex-col justify-center"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >

          {/* ToDo */}
          {/* Logo o icono (ejemplo con Unity) */} 
          <div className="text-center mb-6">
            <div className="inline-block bg-white rounded-lg p-4 mb-4">
              <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="#000" stroke="#000" strokeWidth="1"/>
                <path d="M12 8V16M8 10L12 14L16 10" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          {/* Título */}
          {/* <h3 className="text-2xl font-bold text-white text-center mb-4">
            {projectTitle}
          </h3> */}

          {/* Tools/Technologies */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 justify-center p-2">
              {toolsUsed.map((tool, index) => (
                <Badge
                  color="primary"
                  key={index}
                  label= {tool}
                />
              ))}
            </div>
          </div>
          <div className="text-center mb-6">
            {/*ToDo Call to Action */}
            <Button twStyle="p-2" color='info' label={"EXPLORE NOW!"} />
          </div>
        </div>
      </div>
    </div>
  );
}