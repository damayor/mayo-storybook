import type { DmColor, DmTheme } from "Interfaces/story-variants";
import { Icon } from "HtmlComponents/icons";

export interface MiniCardProps {
  color?: DmColor
  theme?: DmTheme
  label?: string;
  projectPublicTitle: string;
  tags: string[];
  technologies: string[];
  ctaLink?: string
  resume:string
  image:string
}

export const MiniCard = ({
  projectPublicTitle, 
  tags, 
  technologies, 
  ctaLink,
  resume, 
  image,
  ...props
}: MiniCardProps) => {


  return (
     <div 
      className="group relative w-full h-80 md:h-96 rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-110 active:shadow-2xl cursor-pointer"
    >
      {/* Imagen de fondo */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110 group-active:scale-110"
        style={{ 
          backgroundImage: `url(${image})`,
        }}
      />
      
      {/* Degradado sutil solo en las esquinas */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-transparent to-black/60" />
      
      {/* Overlay hover */}
      <div className="absolute inset-0 bg-camelot-600/0 group-hover:bg-camelot-600/15 group-active:bg-camelot-600/15  transition-all duration-300" />
      
      {/* Contenido - Grid de 2 columnas */}
      <div className="relative h-full p-5 z-10">
        <div className="h-full flex flex-col">
          {/* Parte superior: Título, descripción e iconos en grid */}
          <div className="grid grid-cols-[1fr_auto] gap-4 mb-auto">
            {/* Columna izquierda: Título y descripción */}
            <div className="flex flex-col">
              {/* Título */}
              <h3 className="text-white font-bold text-xl mb-2 group-hover:text-camelot-300 group-active:text-camelot-300 transition-colors drop-shadow-lg">
                {projectPublicTitle}
              </h3>
              
              {/* Descripción */}
              <p className="text-white/90 text-sm leading-snug line-clamp-3 drop-shadow-md">
                {resume}
              </p>
            </div>

            {/* Columna derecha: Iconos en vertical */}
            <div className="flex flex-col gap-2 items-center">
              {technologies.map((tech, index) => (
                <div key={index} className="bg-black/40 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                  <Icon
                    size="x-small"
                    technology={tech}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Parte inferior: Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-camelot-500/40 backdrop-blur-sm text-camelot-100 text-xs font-medium rounded-full border border-camelot-400/40 shadow-lg"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}