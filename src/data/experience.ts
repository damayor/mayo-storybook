import type { SkillCategory, TabPanelProps, ToolsCategory } from "Interfaces/projects";


export const skills: SkillCategory[] = [
    {
      "category": "Systems & Distributed Architecture",
      "items": [
        "Object-Oriented Design (OOD) & Design Patterns", //toReview
        "Microservices Architecture & Refactoring",
        "Scalability for Global-Scale Platforms",
        "Distributed Systems & Event-Driven Design", //toReview
        "Asynchronous Programming & System Orchestration", //toReview
      ]
    },
    {
      "category": "Visual Computing & Immersive Systems",
      "items": [
        "3D Graphics Programming & Mathematics",
        "Real-Time Rendering & Optimization Principles", //tocheck findExamples
        "Immersive Technology Design (AR/VR/XR)",
        "Computer Vision & Image Analysis Strategy",
        "HCI (Human-Computer Interaction) Architecture"
      ]
    },
    {
      "category": "Infrastructure & System Reliability (SRE)",
      "items": [
        "Monitoring & Observability Culture",
        "Automated CI/CD Pipeline Architectures",
        "Cloud Infrastructure & Containerization Strategy",
        "Critical Incident Management & On-call Operations",
        "Performance Profiling & Memory Optimization"
      ]
    },
    {
      "category": "Frontend & Web 3D Engineering",
      "items": [
        "Component-Based Architecture Design",
        "Web Performance Optimization (WPO)",
        "Advanced State Management Strategies",
        "API Design & Integration Patterns",
        "Responsive & Multisensorial Interface Design"
      ]
    },
    {
      "category": "Strategic AI & Modern Workflow",
      "items": [
        "AI-Augmented Development (SDD)",
        "Strategic LLM Integration in Software Architectures",
        "Prompt Engineering for Technical Research",
        "Accelerated Prototyping Methodologies"
      ]
    },
    {
      "category": "Leadership & Technical Excellence",
      "items": [
        "Technical Mentoring",
        "Agile Development & Product Lifecycle Management",
        "Architecture Reviews",
        "Technical Documentation",
        "Cross-functional Collaboration"
      ]
    }
  ];

export const tools: ToolsCategory[] = [
    {
      category: 'Frontend & Web 3D',
      items: ['React', 'TypeScript', 'Three.js', 'R3F', 'Next.js', 'Angular', 'Tailwind CSS', 'SCSS', 'Storybook', 'Figma'],
    },
    {
      category: 'Backend & Cloud',
      items: ['Node.js', 'Nest.js', 'Express', 'FastAPI', 'Python', 'MongoDB', 'PostgreSQL', 'REST APIs', 'Microservices'],
    },
    {
      category: 'Visual Computing & XR',
      items: ['C++','Unreal Engine', 'Unity', 'C#', 'WebGL', 'Blender', '3ds Max', 'LiDAR', 'WebXR', 'OpenCV', 'Oculus SDK', ],
    },
    {
      category: "SRE & DevOps",
      items: ['Linux Bash', 'Jenkins', 'Kubernetes', 'Docker', 'Grafana', 'Instana', 'Prometheus', 'Opsgenie', 'YAML', 'Groovy'],
    },
    {
      category: 'AI-Augmented Workflow',
      items: ['Claude', 'SDD', 'Gemini', 'NotebookLM', 'Google AI Studio', 'GitHub Copilot', 'Codex'],
    },
    {
      category: 'Tooling & DX',
      items: ['Git', 'Vite', 'Vitest', 'Jest', 'ESLint', 'Jira', 'Confluence'],
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
    "timeline": [
      {
        "id": "1",
        "title": "Quiero Estudiar Scholarship",
        "place": "Universidad de los Andes",
        "description": "Awarded to top-tier national exam (ICFES) performers to study at Colombia’s premier accredited university [1, 2].",
        "year": 2012
      },
      {
        "id": "2",
        "title": "Interactive and Visual Computing",
        "place": "Universidad de los Andes",
        "description": "Academic minor focused on **Computer Graphics fundamentals**, including transform matrices, quaternions, and advanced interaction techniques for immersive environments.",
        "year": 2017
      },
      {
        "id": "3",
        "title": "Internship in Visualization & HCI",
        "place": "TU Kaiserslautern",
        "description": "Optimizing long-distance recognition in <b>AR</b> using <b>OpenCV</b> for Hololens within the AG HCI and Computer Graphics [4, 5].",
        "year": 2018
      },
      {
        "id": "4",
        "title": "VR in Unity National Instructor",
        "place": "Science Clubs by SENA & UNAL",
        "description": "Instructed high school students in Unity-based VR development, covering materials, humanoids, animation, and scripting [6-8].",
        "year": 2019
      },
      {
        "id": "5",
        "title": "adidas Campus Program Instructor",
        "place": "adidas TechHub Bogotá",
        "description": "Led technical mentorship and specialized training in React and TypeScript for high-potential engineering talent [2, 9, 10].",
        "year": 2022
      },
      {
        "id": "6",
        "title": "Global E-commerce Architecture Refactor",
        "place": "adidas",
        "description": "Engineered the strategic migration from Salesforce to a **microservices architecture**, orchestrating the refactor of the checkout service ensuring its stability and performance across 20+ global markets.",
        "year": 2024
      },
      {
        "id": "7",
        "title": "Strategic Relocation to Germany",
        "place": "Berlin, Germany",
        "description": "Relocated to Berlin following official ZAB/Anabin recognition of my degree as equivalent to **System- und Computertechnik (A4/H+)** and Job Search Oportunity Card.",
        "year": 2025
      }
    ],
    // achievements: [
    //   {
    //     id: '1',
    //     year: '2021 - 2025',
    //     title: 'Software Engineer, Frontend & SRE',
    //     company: 'adidas',
    //     description: `Development pillar of interactive 3D customization modules for sportswear PDPs using Three.js and Unity. 
    //       Also improved deployment reliability and speed through CI/CD automation with Jenkins, Kubernetes, and Grafana. 
    //       Contributed to the React/TypeScript front-end architecture for global e-commerce platforms like Yeezy, optimizing performance and user experience, `,
    //     tags: ['React', 'Typescript', 'Three.js', 'Unity', 'Jenkins', 'Kubernetes', 'Grafana', 'CI/CD', 'Node.js'],
    //     link: 'https://www.adidas.de/'
    //   },
    //   {
    //     id: '2',
    //     year: '2020',
    //     title: 'Game Developer',
    //     company: 'MadBricks',
    //     description: 'Developed and maintained hyper-casual games using Unity and Unreal (C++), enhancing gameplay, physics, and player retention through refined UI/UX and fast iteration.',
    //     link: 'https://www.linkedin.com/company/mad-bricks/'
    //   },
    //   {
    //     id: '3',
    //     year: '2020',
    //     title: 'Frontend Developer',
    //     company: 'Umbra 3D Studio - Umbra Interactive',
    //     description: 'Created immersive 3D web and VR applications for real estate (PropTech) and marketing campaigns using React, Three.js, and Unity, blending visual storytelling with interactive technology.',
    //     tags: ['React', 'Unity', 'Unreal Engine', 'C++', '3D Visualization', 'Virtual Reality'],
    //     link: 'https://umbra3d.studio/'
    //   },
    //   {
    //     id: '4',
    //     year: '2017 - 2019',
    //     title: 'Research Asistant',
    //     company: 'Universidad de los Andes',
    //     description: 'Designed a VR & haptic training simulator for trauma surgery using Unity and Oculus SDK, improving surgical skill acquisition; contributed to research in human-computer interaction and 3D visualization.' ,
    //     link: 'https://imagine.uniandes.edu.co/'
    //   },
    //   { 
    //     id: '5',
    //     year: '2019',
    //     title: 'Systems and Computing Engineering (M.Sc.)',
    //     company: 'Universidad de los Andes',
    //     link: 'https://www.uniandes.edu.co/'
    //   },
    // ],
    skills,
    tools
  };