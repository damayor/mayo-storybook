import type { SkillCategory, TabPanelProps, ToolsCategory } from "Interfaces/projects";


export const skills: SkillCategory[] = [
  {
    category: "Frontend Engineering",
    items: [
      "Responsive Web Design",
    //   "Component-Based Architecture",
    //   "Web Performance Optimization",
    //   "State Management",
      "API Integration",
    //   "Accessibility (a11y)",
      "Testing",
      "Quality Code",
      "Functional Programming"
    ],
  },
  {
    category: "Interactive / 3D / XR Development",
    items: [
      "3D Graphics Programming",
    //   "WebGL / Three.js",
    //   "Shader Programming (GLSL)",
      "Mixed Reality (AR/VR/XR)",
    //   "Real-Time Rendering",
      "Physics Integration",
    //   "360° Web Experiences", // 2do plano
    //   "Optimization for Real-Time Scenes",
       "UI Development",
       //"UI/UX"
    ],
  },
  {
    category: "Software & Systems Engineering",
    items: [
      "Object-Oriented Programming (OOP)",
      "Data Structures & Algorithms",
    //   "Systems Design",
    //   "Memory & Performance Optimization", //C++ 
    //   "Cross-Platform Development",
    //   "Asynchronous Programming",
    //   "Event-Driven Systems",
      "Linux / Bash Scripting",
      "Debugging & Profiling",
      "Microservices"
    ],
  },
  {
    category: "SRE / DevOps / CI-CD",
    items: [
      "Continuous Integration & Delivery (CI/CD)",
      "Monitoring & Observability",
    //   "Automated Testing Pipelines",
      "Docker & Containerization",
    //   "Infrastructure as Code (IaC)",
      "Logging & Metrics",
      "Incident Management",
    ],
  },
  {
    category: "Professional & Collaboration",
    items: [
      "Agile Development",
    //   "Technical Documentation",
      "Mentoring & Code Reviews",
    //   "Cross-Functional Collaboration",
    //   "Communication with Design & Product Teams", //repech
    //   "Problem Solving & Creative Thinking", //repech
      "Version Control",
    ],
  },
];

export const tools: ToolsCategory[] = [
    {
      category: 'Frontend',
      items:  ['React', 'TypeScript', 'Tailwind CSS', 'SCSS', 'Three.js', 'Next.js', 'Storybook', 'Figma', 'CSS3'],
    },
    {
      category: 'Backend',
      items: ['Node.js', 'Redux', 'Express', 'MongoDB', 'PostgreSQL', 'Postman', 'REST APIs']
    },
    {
      category: 'VR/AR & Game Dev',
      items: ['Unity', 'C#','Unreal Engine', 'C++', 'Oculus SDK', 'Vuforia', 'Hololens', 'WebXR', 'WebGL', 'Blender', '3dMax']
    },
    {
      category: 'Tools',
      items: ['Git', 'VSCode', 'Vite', 'Jest', 'Vitest', 'ESLint','FileZilla', 'Jira','Confluence']
    },
     {
      category: "SRE / DevOps / CI-CD",
      items: ['Jenkins', 'Kubernetes', 'Docker', 'YAML','Groovy','Opsgenie', 'Grafana', 'Kibana', 'Instana'],
    },
    {
      category: 'Full Stack',
      items: ['Javascript', 'Angular', 'C++', 'C#', 'Linux', 'bash', 'Java', 'Python'],
    }
];

// 🧩 Utility method: flatten all skills into one array (no categories)
export const getAllSkills = (): string[] => {
  return skills.flatMap((skillGroup) => skillGroup.items);
};

export const getAllTools = (): string[] => {
  return tools.flatMap((toolsGroup) => toolsGroup.items);
};

export const toolsAndExprience : TabPanelProps = {
    achievements: [
      //1BQE
      //2Internship en TUKL
      //5 ... teaching in adidas campus programs
      //3 Research Monitor - IDI Imagine Group
      // 4 Opcion Academica! en Computacion visual
      // 5 Monitor de Introducction to programming
      {
        id: '1',
        title: 'ETHDenver 2022',
        description: 'Immersive Gallery - Developed an interactive VR experience showcasing digital art with Three.js and WebXR',
        year: 2022
      },
      {
        id: '2',
        title: 'Red Dot Design Award 2018',
        description: 'Communication Design Award - Recognition for innovative UI/UX design in immersive experiences',
        year: 2018
      },
      {
        id: '3',
        title: 'User Experience Awards 2017',
        description: 'Award Winner & Speaker - Shared insights on immersive web technologies and user interaction patterns',
        year: 2017
      },
      {
        id: '4',
        title: 'SXSW 2018 Innovation',
        description: 'Innovation Award Finalist - Selected for groundbreaking work in XR/VR applications',
        year: 2018
      },
      {
        id: '5',
        title: 'Cannes Future Lions 2017',
        description: 'Awards Shortlist - Recognized for creative excellence in digital innovation',
        year: 2017
      }
    ],
    timeline: [
      {
        id: '1',
        year: '2021 - 2025',
        title: 'Software Engineer, Frontend & SRE',
        company: 'adidas',
        description: `Development pillar of interactive 3D customization modules for sportswear PDPs using Three.js and Unity. 
          Also improved deployment reliability and speed through CI/CD automation with Jenkins, Kubernetes, and Grafana. 
          Contributed to the React/TypeScript front-end architecture for global e-commerce platforms like Yeezy, optimizing performance and user experience, `,
        tags: ['React', 'Typescript', 'Three.js', 'Unity', 'Jenkins', 'Kubernetes', 'Grafana', 'CI/CD', 'Node.js'],
        link: 'https://www.adidas.de/'
      },
      {
        id: '2',
        year: '2020',
        title: 'Game Developer',
        company: 'MadBricks',
        description: 'Developed and maintained hyper-casual games using Unity and Unreal (C++), enhancing gameplay, physics, and player retention through refined UI/UX and fast iteration.',
        link: 'https://www.linkedin.com/company/mad-bricks/'
      },
      {
        id: '3',
        year: '2020',
        title: 'Frontend Developer',
        company: 'Umbra 3D Studio - Umbra Interactive',
        description: 'Created immersive 3D web and VR applications for real estate (PropTech) and marketing campaigns using React, Three.js, and Unity, blending visual storytelling with interactive technology.',
        tags: ['React', 'Unity', 'Unreal Engine', 'C++', '3D Visualization', 'Virtual Reality'],
        link: 'https://umbra3d.studio/'
      },
      {
        id: '4',
        year: '2017 - 2019',
        title: 'Research Asistant',
        company: 'Universidad de los Andes',
        description: 'Designed a VR & haptic training simulator for trauma surgery using Unity and Oculus SDK, improving surgical skill acquisition; contributed to research in human-computer interaction and 3D visualization.' ,
        link: 'https://imagine.uniandes.edu.co/'
      },
      { 
        id: '5',
        year: '2019',
        title: 'Systems and Computing Engineering (M.Sc.)',
        company: 'Universidad de los Andes',
        link: 'https://www.uniandes.edu.co/'
        // description: 'Learned fundamentals of web development, worked on client projects using vanilla JS and jQuery'
      },
    ],
    skills,
    tools
  };