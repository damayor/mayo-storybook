import type {
  Lang,
  Milestone,
  SkillCategory,
  TabPanelProps,
  ToolsCategory,
} from 'Interfaces/projects';

// ─── Tools — language-agnostic ────────────────────────────────────────────────

export const tools: ToolsCategory[] = [
  {
    category: 'AI Engineering & Agentic Workflows',
    items: [
      'Claude Code',
      'Spec Driven Development (SDD)',
      'Agentic Coding Workflows',
      'Gemini',
      'NotebookLM',
      'Codex',
      'MCP (Model Context Protocol)',
      'Prompt & Context Engineering',
    ],
  },
  {
    category: 'Frontend & Web 3D',
    items: [
      'React',
      'TypeScript',
      'Three.js',
      'Next.js',
      'Angular',
      'Tailwind CSS',
      'SCSS',
      'Storybook',
      'Figma',
    ],
  },
  {
    category: 'Backend & Cloud',
    items: [
      'Node.js',
      'Nest.js',
      'Express',
      'FastAPI',
      'Python',
      'MongoDB',
      'PostgreSQL',
      'REST APIs',
      'Microservices',
    ],
  },
  {
    category: 'Visual Computing & XR',
    items: [
      'C++',
      'Unreal Engine',
      'Unity',
      'C#',
      'WebGL',
      'Blender',
      '3ds Max',
      'LiDAR',
      'WebXR',
      'OpenCV',
    ],
  },
  {
    category: 'SRE & DevOps',
    items: [
      'Linux Bash',
      'Jenkins',
      'Kubernetes',
      'Docker',
      'Grafana',
      'Instana',
      'Prometheus',
      'Opsgenie',
      'YAML',
      'Groovy',
    ],
  },

  // {
  //   category: 'Tooling & DX',
  //   items: ['Git', 'Vite', 'Vitest', 'Jest', 'ESLint', 'Jira', 'Confluence'],
  // },
];

// ─── Skills — language-keyed ──────────────────────────────────────────────────

const _skills: Record<Lang, SkillCategory[]> = {
  en: [
    {
      category: 'AI Engineering & Spec Driven Development',
      items: [
        'Spec Driven Development (SDD) — Workshop Instructor',
        'Agentic Coding with Claude Code & AI-Native Tooling',
        'Strategic LLM Integration in Software Architectures',
        'Prompt & Context Engineering for Technical Research',
        'Accelerated, AI-Augmented Prototyping Methodologies',
      ],
    },
    {
      category: 'Systems & Distributed Architecture',
      items: [
        'Object-Oriented Design (OOD) & Design Patterns',
        'Microservices Architecture & Refactoring',
        'Scalability for Global-Scale Platforms',
        'Distributed Systems & Event-Driven Design',
        'Asynchronous Programming & System Orchestration',
      ],
    },
    {
      category: 'Visual Computing & Immersive Systems',
      items: [
        '3D Graphics Programming & Mathematics',
        'Real-Time Rendering & Optimization Principles',
        'Immersive Technology Design (AR/VR/XR)',
        'Computer Vision & Image Analysis Strategy',
        'HCI (Human-Computer Interaction) Architecture',
      ],
    },
    {
      category: 'Infrastructure & System Reliability (SRE)',
      items: [
        'Monitoring & Observability Culture',
        'Automated CI/CD Pipeline Architectures',
        'Cloud Infrastructure & Containerization Strategy',
        'Critical Incident Management & On-call Operations',
        'Performance Profiling & Memory Optimization',
      ],
    },
    {
      category: 'Frontend & Web 3D Engineering',
      items: [
        'Component-Based Architecture Design',
        'Web Performance Optimization (WPO)',
        'Advanced State Management Strategies',
        'API Design & Integration Patterns',
        'Responsive & Multisensorial Interface Design',
      ],
    },
    {
      category: 'Leadership & Technical Excellence',
      items: [
        'Technical Mentoring',
        'Agile Development & Product Lifecycle Management',
        'Architecture Reviews',
        'Technical Documentation',
        'Cross-functional Collaboration',
      ],
    },
  ],
  es: [
    {
      category: 'Ingeniería de IA y Spec Driven Development',
      items: [
        'Spec Driven Development (SDD) — Instructor de Workshop',
        'Programación Agéntica con Claude Code y Herramientas AI-Native',
        'Integración Estratégica de LLMs en Arquitecturas de Software',
        'Ingeniería de Prompts y Contexto para Investigación Técnica',
        'Metodologías de Prototipado Acelerado y Potenciado por IA',
      ],
    },
    {
      category: 'Sistemas y Arquitectura Distribuida',
      items: [
        'Diseño Orientado a Objetos (OOD) y Patrones de Diseño',
        'Arquitectura de Microservicios y Refactoring',
        'Escalabilidad para Plataformas a Escala Global',
        'Sistemas Distribuidos y Diseño Orientado a Eventos',
        'Programación Asíncrona y Orquestación de Sistemas',
      ],
    },
    {
      category: 'Computación Visual y Sistemas Inmersivos',
      items: [
        'Programación de Gráficos 3D y Matemáticas',
        'Renderizado en Tiempo Real y Principios de Optimización',
        'Diseño de Tecnología Inmersiva (AR/VR/XR)',
        'Visión por Computador y Estrategia de Análisis de Imágenes',
        'Arquitectura de HCI (Interacción Humano-Computador)',
      ],
    },
    {
      category: 'Infraestructura y Confiabilidad de Sistemas (SRE)',
      items: [
        'Cultura de Monitoreo y Observabilidad',
        'Arquitecturas de Pipelines CI/CD Automatizados',
        'Infraestructura Cloud y Estrategia de Contenerización',
        'Gestión de Incidentes Críticos y Operaciones On-call',
        'Profiling de Rendimiento y Optimización de Memoria',
      ],
    },
    {
      category: 'Ingeniería Frontend y Web 3D',
      items: [
        'Diseño de Arquitectura Basada en Componentes',
        'Optimización de Rendimiento Web (WPO)',
        'Estrategias Avanzadas de Gestión de Estado',
        'Diseño de APIs y Patrones de Integración',
        'Diseño de Interfaces Responsivas y Multisensoriales',
      ],
    },
    {
      category: 'Liderazgo y Excelencia Técnica',
      items: [
        'Mentoría Técnica',
        'Desarrollo Ágil y Gestión del Ciclo de Vida del Producto',
        'Revisiones de Arquitectura',
        'Documentación Técnica',
        'Colaboración Interfuncional',
      ],
    },
  ],
  de: [
    {
      category: 'KI-Engineering & Spec Driven Development',
      items: [
        'Spec Driven Development (SDD) — Workshop-Leiter',
        'Agentisches Programmieren mit Claude Code & KI-nativen Tools',
        'Strategische LLM-Integration in Software-Architekturen',
        'Prompt- und Context-Engineering für technische Forschung',
        'Beschleunigte, KI-gestützte Prototyping-Methoden',
      ],
    },
    {
      category: 'Systeme & Verteilte Architektur',
      items: [
        'Objektorientiertes Design (OOD) & Entwurfsmuster',
        'Microservices-Architektur & Refactoring',
        'Skalierbarkeit für globale Plattformen',
        'Verteilte Systeme & ereignisgesteuertes Design',
        'Asynchrone Programmierung & Systemorchestrierung',
      ],
    },
    {
      category: 'Visual Computing & Immersive Systeme',
      items: [
        '3D-Grafikprogrammierung & Mathematik',
        'Echtzeit-Rendering & Optimierungsprinzipien',
        'Immersives Technologiedesign (AR/VR/XR)',
        'Computer Vision & Bildanalysestrategie',
        'HCI-Architektur (Mensch-Computer-Interaktion)',
      ],
    },
    {
      category: 'Infrastruktur & Systemzuverlässigkeit (SRE)',
      items: [
        'Monitoring & Observability-Kultur',
        'Automatisierte CI/CD-Pipeline-Architekturen',
        'Cloud-Infrastruktur & Containerisierungsstrategie',
        'Kritisches Incident-Management & On-Call-Betrieb',
        'Performance-Profiling & Speicheroptimierung',
      ],
    },
    {
      category: 'Frontend & Web-3D-Engineering',
      items: [
        'Komponentenbasiertes Architekturdesign',
        'Web-Performance-Optimierung (WPO)',
        'Fortgeschrittene Zustandsverwaltungsstrategien',
        'API-Design & Integrationsmuster',
        'Responsives & multisensoriales Interfacedesign',
      ],
    },
    {
      category: 'Führung & Technische Exzellenz',
      items: [
        'Technisches Mentoring',
        'Agile Entwicklung & Produktlebenszyklusmanagement',
        'Architektur-Reviews',
        'Technische Dokumentation',
        'Funktionsübergreifende Zusammenarbeit',
      ],
    },
  ],
};

export const getSkills = (lang: Lang): SkillCategory[] => _skills[lang] ?? _skills.en;

// backwards compat
export const skills = getSkills('en');

export const getAllSkills = (): string[] => skills.flatMap((g) => g.items);
export const getAllTools = (): string[] => tools.flatMap((g) => g.items);

// ─── Milestones — language-keyed ─────────────────────────────────────────────

const _milestones: Record<Lang, Milestone[]> = {
  en: [
    {
      id: '1',
      title: 'Quiero Estudiar Scholarship',
      place: 'Universidad de los Andes',
      description:
        "Awarded to top-tier national exam (ICFES) performers to study at Colombia's premier accredited university.",
      year: 2012,
    },
    {
      id: '2',
      title: 'Interactive and Visual Computing',
      place: 'Universidad de los Andes',
      description:
        'Academic minor focused on Computer Graphics fundamentals, including transform matrices, quaternions, and advanced interaction techniques for immersive environments.',
      year: 2017,
    },
    {
      id: '3',
      title: 'Internship in Visualization & HCI',
      place: 'TU Kaiserslautern',
      description:
        'Optimizing long-distance recognition in AR using OpenCV for Hololens within the AG HCI and Computer Graphics.',
      year: 2018,
    },
    {
      id: '4',
      title: 'VR in Unity — National Instructor',
      place: 'Science Clubs by SENA & UNAL',
      description:
        'Instructed high school students in Unity-based VR development, covering materials, humanoids, animation, and scripting.',
      year: 2019,
    },
    {
      id: '5',
      title: 'adidas Campus Program Instructor',
      place: 'adidas TechHub Bogotá',
      description:
        'Led technical mentorship and specialized training in React and TypeScript for high-potential engineering talent.',
      year: 2022,
    },
    {
      id: '6',
      title: 'Global E-commerce Architecture Refactor',
      place: 'adidas',
      description:
        'Engineered the strategic migration from Salesforce to a microservices architecture, orchestrating the refactor of the checkout service ensuring its stability and performance across 20+ global markets.',
      year: 2024,
    },
    {
      id: '7',
      title: 'Strategic Relocation to Germany',
      place: 'Germany',
      description:
        'Relocated to Berlin following official ZAB/Anabin recognition of my degree as equivalent to System- und Computertechnik (A4/H+).',
      year: 2025,
    },
    {
      id: '8',
      title: 'Spec Driven Development Workshop',
      place: 'Independent / AI Engineering',
      description:
        'Designed and delivered a workshop on Spec Driven Development, teaching engineers to pair specs with agentic tools like Claude Code — the start of a focused push to become a reference in AI-supported software engineering.',
      year: 2026,
    },
  ],
  es: [
    {
      id: '1',
      title: 'Beca Quiero Estudiar',
      place: 'Universidad de los Andes',
      description:
        'Becado por rendimiento sobresaliente en el examen nacional (ICFES) para estudiar en la universidad con mayor acreditación de Colombia.',
      year: 2012,
    },
    {
      id: '2',
      title: 'Computación Interactiva y Visual',
      place: 'Universidad de los Andes',
      description:
        'Minor académico enfocado en fundamentos de Gráficos por Computador, incluyendo matrices de transformación, cuaterniones y técnicas avanzadas de interacción para entornos inmersivos.',
      year: 2017,
    },
    {
      id: '3',
      title: 'Pasantía en Visualización e IHC',
      place: 'TU Kaiserslautern',
      description:
        'Optimización del reconocimiento a larga distancia en AR usando OpenCV para Hololens dentro del grupo AG HCI y Gráficos por Computador.',
      year: 2018,
    },
    {
      id: '4',
      title: 'Instructor Nacional de VR en Unity',
      place: 'Science Clubs by SENA & UNAL',
      description:
        'Instruyó a estudiantes de bachillerato en desarrollo de VR con Unity, abarcando materiales, humanoides, animación y scripting.',
      year: 2019,
    },
    {
      id: '5',
      title: 'Instructor del adidas Campus Program',
      place: 'adidas TechHub Bogotá',
      description:
        'Lideró mentoría técnica y formación especializada en React y TypeScript para talento de ingeniería de alto potencial.',
      year: 2022,
    },
    {
      id: '6',
      title: 'Refactor de Arquitectura de E-commerce Global',
      place: 'adidas',
      description:
        'Lideró la migración estratégica de Salesforce hacia una arquitectura de microservicios, orquestando el refactor del servicio de checkout y garantizando su estabilidad en más de 20 mercados globales.',
      year: 2024,
    },
    {
      id: '7',
      title: 'Reubicación Estratégica a Alemania',
      place: 'Alemania',
      description:
        'Reubicado en Berlín tras el reconocimiento oficial de ZAB/Anabin del título equivalente a System- und Computertechnik (A4/H+) y Tarjeta de Búsqueda de Empleo.',
      year: 2025,
    },
    {
      id: '8',
      title: 'Workshop de Spec Driven Development',
      place: 'Independiente / Ingeniería de IA',
      description:
        'Diseño y presentacion del workshop de Spec Driven Development, enseñando a ingenieros a combinar especificaciones con herramientas agénticas como Claude Code — el inicio de un enfoque estratégico para convertirse en referente en ingeniería de software potenciada por IA.',
      year: 2026,
    },
  ],
  de: [
    {
      id: '1',
      title: 'Quiero Estudiar Stipendium',
      place: 'Universidad de los Andes',
      description:
        'Stipendium für Spitzenleistungen im nationalen Eignungstest (ICFES) zum Studium an Kolumbiens erstklassig akkreditierter Universität.',
      year: 2012,
    },
    {
      id: '2',
      title: 'Interaktives und Visuelles Computing',
      place: 'Universidad de los Andes',
      description:
        'Akademische Vertiefung mit Schwerpunkt auf Grundlagen der Computergrafik, einschließlich Transformationsmatrizen, Quaternionen und fortgeschrittener Interaktionstechniken für immersive Umgebungen.',
      year: 2017,
    },
    {
      id: '3',
      title: 'Praktikum in Visualisierung & HCI',
      place: 'TU Kaiserslautern',
      description:
        'Optimierung der Langstreckenerkennung in AR mit OpenCV für Hololens innerhalb der AG HCI und Computergrafik.',
      year: 2018,
    },
    {
      id: '4',
      title: 'Nationaler VR-Kursleiter in Unity',
      place: 'Science Clubs by SENA & UNAL',
      description:
        'Unterrichtete Schüler in der Unity-basierten VR-Entwicklung mit Schwerpunkt auf Materialien, Humanoiden, Animation und Scripting.',
      year: 2019,
    },
    {
      id: '5',
      title: 'Kursleiter des adidas Campus Programs',
      place: 'adidas TechHub Bogotá',
      description:
        'Technisches Mentoring und spezialisierte Schulung in React und TypeScript für hochpotenzielle Ingenieurtalente.',
      year: 2022,
    },
    {
      id: '6',
      title: 'Globales E-Commerce-Architektur-Refactoring',
      place: 'adidas',
      description:
        'Strategische Migration von Salesforce zu einer Microservices-Architektur und Orchestrierung des Refactorings des Checkout-Services zur Sicherstellung von Stabilität und Performance in über 20 globalen Märkten.',
      year: 2024,
    },
    {
      id: '7',
      title: 'Strategischer Umzug nach Deutschland',
      place: 'Deutschland',
      description:
        'Umzug nach Berlin nach offizieller ZAB/Anabin-Anerkennung des Abschlusses als äquivalent zu System- und Computertechnik (A4/H+) sowie Chancenkarte.',
      year: 2025,
    },
    {
      id: '8',
      title: 'Spec Driven Development Workshop',
      place: 'Unabhängig / KI-Engineering',
      description:
        'Konzeption und Durchführung eines Workshops zu Spec Driven Development, in dem Ingenieuren vermittelt wird, Spezifikationen mit agentischen Tools wie Claude Code zu kombinieren — der Beginn einer gezielten Ausrichtung als Referenz für KI-gestützte Softwareentwicklung.',
      year: 2026,
    },
  ],
};

export const getMilestones = (lang: Lang): Milestone[] => _milestones[lang] ?? _milestones.en;

// backwards compat
export const toolsAndExprience: TabPanelProps = {
  milestones: getMilestones('en'),
  skills,
  tools,
};
