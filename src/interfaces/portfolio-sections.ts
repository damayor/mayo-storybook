
// ================== TIPOS CONSTANTE ==================
export const SECTIONS = {
  home: 'home',
  about: 'about',
  projects: 'projects',
  skills: 'skills',
  contact: 'contact'
} as const;

export type SectionType = typeof SECTIONS[keyof typeof SECTIONS];

// Array de secciones para usar en loops
export const SECTIONS_ARRAY: SectionType[] = [
  SECTIONS.home,
  SECTIONS.about,
  SECTIONS.projects,
  SECTIONS.skills,
  SECTIONS.contact
];

