export type Lang = 'en' | 'es' | 'de';

export interface Projects {
  projects: Project[];
}

export interface Project {
  projectRealTitle: string;
  projectPublicTitle: string;
  subtitle: string;
  resume?: string;
  tags: string[];
  technologies: string[];
  projectField: string;
  images: string[];
  gifs: string[];
  mediaLinks?: string[];
  initDate: Date;
  endDate: Date;
  content: string;
}

export interface MiniProject {
  projectRealTitle: string;
  projectPublicTitle: string;
  resume: string;
  image: string;
  gifs?: string[];
  tags: string[];
  technologies: string[];
}

export interface Milestone {
  id: string;
  year: string | number;
  title: string;
  company?: string;
  description?: string;
  tags?: string[];
  link?: string;
  place?: string;
}

export type SkillCategory = {
  category: string;
  items: string[];
};

export type ToolsCategory = {
  category: string;
  items: string[];
};

export interface TabPanelProps {
  milestones: Milestone[];
  skills: SkillCategory[];
  tools: ToolsCategory[];
}
