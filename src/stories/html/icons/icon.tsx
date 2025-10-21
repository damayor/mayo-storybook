import React from 'react';

type IconSize = 'small' | 'medium' | 'large';

interface IconProps {
  technology: string;
  size?: IconSize;
  className?: string;
}

// Mapeo de tecnologías a sus nombres en devicons y variantes
export const techIconMap: Record<string, { name: string; variant: string }> = {
  'Unity': { name: 'unity', variant: 'original' },
  'Unreal': { name: 'unrealengine', variant: 'original' },
  'Javascript': { name: 'javascript', variant: 'plain' },
  'Typescript': { name: 'typescript', variant: 'plain' },
  'NodeJS': { name: 'nodejs', variant: 'original-wordmark' },
  'React': { name: 'react', variant: 'original-wordmark' },
  'Tailwind': { name: 'tailwindcss', variant: 'original' },
  'CSS': { name: 'css3', variant: 'plain' },
  // 'Oculus': { name: 'oculus', variant: 'original' }, //:(
  // 'Hololens': { name: 'windows8', variant: 'original' }, // :(( No hay icono específico de Hololens
  'ThreeJs': { name: 'threejs', variant: 'original' },
  // 'WebGL': { name: 'webpack', variant: 'plain' }, // No hay icono específico de WebGL
  'HTML': { name: 'html5', variant: 'plain' },
  'SCSS': { name: 'sass', variant: 'original' },
  // 'Vuforia': { name: 'unity', variant: 'original' }, // No hay icono específico de Vuforia
  'VSCode': { name: 'vscode', variant: 'original' },
  'Android': { name: 'android', variant: 'plain' },
  'Mongo': { name: 'mongodb', variant: 'plain-wordmark' },
  'Postman': { name: 'postman', variant: 'original' },
  'CSharp': { name: 'csharp', variant: 'line' },
  'Cpp': { name: 'cplusplus', variant: 'plain' },
  'Angular': { name: 'angular', variant: 'original' },
  'Figma': { name: 'figma', variant: 'original' },
  'Jenkins': { name: 'jenkins', variant: 'original' },
  'Redux': { name: 'redux', variant: 'original' },
  'Filezilla': { name: 'filezilla', variant: 'original' },



};

// Tamaños en píxeles
const sizeMap: Record<IconSize, number> = {
  small: 40,
  medium: 64,
  large: 96
};

export function Icon({ technology, size = 'medium', className = '' }: IconProps) {
  const iconConfig = techIconMap[technology];
  
  if (!iconConfig) {
    console.warn(`Technology "${technology}" not found in icon map`);
    return (
      <div 
        className={`flex items-center justify-center bg-gray-200 rounded-lg ${className}`}
        style={{ width: sizeMap[size], height: sizeMap[size] }}
      >
        <span className="text-gray-500 text-xs font-bold">?</span>
      </div>
    );
  }

  const { name, variant } = iconConfig;
  const pixelSize = sizeMap[size];
  
  // URL del CDN de devicons
  const iconUrl = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${name}/${name}-${variant}.svg`;

  return (
    <img
      src={iconUrl}
      alt={`${technology} icon`}
      className={`object-contain ${className}`}
      title={name}
      style={{ width: pixelSize, height: pixelSize }}
      onError={(e) => {
        // Fallback si la imagen no carga
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const parent = target.parentElement;
        if (parent) {
          parent.innerHTML = `<div class="flex items-center justify-center bg-gray-200 rounded-lg" style="width: ${pixelSize}px; height: ${pixelSize}px;">
            <span class="text-gray-500 text-xs font-bold">${technology.substring(0, 2).toUpperCase()}</span>
          </div>`;
        }
      }}
    />
  );
}