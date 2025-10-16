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
    mediaLinks?:         string[];
    initDate:           Date;
    endDate:            Date;
    content:            string;
}
