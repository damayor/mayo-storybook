import React from 'react';

type IconSize = 'x-small' | 'small' | 'medium' | 'large';

interface IconProps {
  technology: string;
  size?: IconSize;
  className?: string;
}

// Mapeo de tecnologías a sus nombres en devicons y variantes
export const techIconMap: Record<string, { name: string; variant: string }> = {
  Unity: { name: 'unity', variant: 'original' },
  Unreal: { name: 'unrealengine', variant: 'original' },
  Javascript: { name: 'javascript', variant: 'plain' },
  Typescript: { name: 'typescript', variant: 'plain' },
  NodeJS: { name: 'nodejs', variant: 'original-wordmark' },
  React: { name: 'react', variant: 'original-wordmark' },
  Tailwind: { name: 'tailwindcss', variant: 'original' },
  CSS: { name: 'css3', variant: 'plain' },
  // 'Oculus': { name: 'oculus', variant: 'original' }, //:(
  // 'Hololens': { name: 'windows8', variant: 'original' }, // :(( No hay icono específico de Hololens
  ThreeJs: { name: 'threejs', variant: 'original' },
  WebGL: { name: 'opengl', variant: 'plain' },
  HTML: { name: 'html5', variant: 'plain' },
  SCSS: { name: 'sass', variant: 'original' },
  Vuforia: { name: 'vitess', variant: 'original' }, // No hay icono específico de Vuforia
  VSCode: { name: 'vscode', variant: 'original' },
  Android: { name: 'android', variant: 'plain' },
  Mongo: { name: 'mongodb', variant: 'plain-wordmark' },
  Postman: { name: 'postman', variant: 'original' },
  CSharp: { name: 'csharp', variant: 'line' },
  Cpp: { name: 'cplusplus', variant: 'plain' },
  Angular: { name: 'angular', variant: 'original' },
  Figma: { name: 'figma', variant: 'original' },
  Jenkins: { name: 'jenkins', variant: 'original' },
  Redux: { name: 'redux', variant: 'original' },
  Filezilla: { name: 'filezilla', variant: 'original' },
  Blender: { name: 'blender', variant: 'original' },
  Linux: { name: 'linux', variant: 'original' },
  K8: { name: 'kubernetes', variant: 'original' },
  Grafana: { name: 'grafana', variant: 'original' },
  Docker: { name: 'docker', variant: 'original' },
  Wordpress: { name: 'wordpress', variant: 'original' },
  Python: { name: 'python', variant: 'original' },
  FastAPI: { name: 'fastapi', variant: 'original-wordmark' },
};

// Tamaños en píxeles
const sizeMap: Record<IconSize, string> = {
  'x-small': 'w-6 h-6',
  small: 'w-10 h-10',
  medium: 'w-16 h-16',
  large: 'w-24 h-24',
};

export function Icon({ technology, size = 'medium', className = '' }: IconProps) {
  const iconConfig = techIconMap[technology];

  if (!iconConfig) {
    console.warn(`Technology "${technology}" not found in icon map`);
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 rounded-lg ${className} ${sizeMap[size]}`}
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
      className={`object-contain ${className} ${pixelSize}`}
      title={name}
      onError={(e) => {
        // Fallback si la imagen no carga
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const parent = target.parentElement;
        if (parent) {
          parent.innerHTML = `<div class="flex items-center justify-center bg-gray-200 rounded-lg ${pixelSize}">
            <span class="text-gray-500 text-xs font-bold">${technology.substring(0, 2).toUpperCase()}</span>
          </div>`;
        }
      }}
    />
  );
}
