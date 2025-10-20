export interface Projects {
    projects: Project[];
}

export interface Project {
    projectRealTitle:   string;
    projectPublicTitle: string;
    subtitle:           string;
    resume?:             string;
    tags:               string[];
    technologies:          string[];
    projectField:       string;
    images:             string[];
    gifs:               string[];
    mediaLinks:         string[];
    initDate:           Date;
    endDate:            Date;
    content:            string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  year: number;
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  company?: string;
  description?: string;
  tags?: string[];
  link?: string
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
  achievements: Achievement[];
  timeline: TimelineEvent[];
  skills: SkillCategory[];
  tools: ToolsCategory[];
}