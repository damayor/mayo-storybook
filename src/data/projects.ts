import type { Lang, MiniProject, Project } from "Interfaces/projects";

// ─── Shared non-translatable fields ──────────────────────────────────────────

const _sharedProjects = {
  frontend: {
    projectRealTitle: "3d-das",
    tags: ["Frontend", "UI/UX", "WebGL", "Visual Computing", "Responsive", "Storybook"],
    technologies: ["Typescript", "React", "CSS", "SCSS", "ThreeJs", "Figma"],
    projectField: "Frontend",
    images: ["/assets/images/projects/frontend/3ddas_tbt.png"],
    mediaLinks: ["https://mayinteractive.io/storybook/?path=/story/three-experiences-interactivepdp--interactive-pdp"],
    gifs: ["/assets/images/projects/frontend/volvo-3d.gif"],
    initDate: new Date(2022, 0, 1),
    endDate: new Date(2023, 10, 1),
  },
  proptech: {
    projectRealTitle: "Primera Este",
    tags: ["Full-Stack", "Microservices", "SRE", "REST APIs", "Web Hosting", "Observability"],
    technologies: ["NodeJS", "Postman", "Mongo", "Redux", "Filezilla"],
    projectField: "Reliability",
    images: [
      "/assets/images/projects/reliability/1E_quad_4.JPG",
      "/assets/images/projects/reliability/1E_quad_mail.JPG",
    ],
    gifs: ["/assets/images/projects/reliability/1E_intro2.gif"],
    mediaLinks: [
      "https://www.youtube.com/watch?v=JUJl6v0Scas",
      "https://www.youtube.com/watch?v=jXI6X0najy0"
    ],
    initDate: new Date(2020, 0, 1),
    endDate: new Date(2020, 10, 1),
  },
  xr: {
    projectRealTitle: "Volvo Customization",
    tags: ["Mobile Apps", "UI/UX", "FTP", "Mobile devices"],
    technologies: ["Unity", "CSharp", "Unreal", "Cpp", "Android"],
    projectField: "Frontend",
    images: [
      "/assets/images/projects/xr/VolvoS60.png",
      "/assets/images/projects/frontend/volvo-home.PNG"
    ],
    mediaLinks: ["https://umbraint.com/catalogosdigitales/catalogovolvo"],
    gifs: ["/assets/images/projects/frontend/volvo-3d.gif"],
    initDate: new Date(2020, 0, 1),
    endDate: new Date(2020, 10, 1),
  },
};

const _sharedMiniProjects = [
  {
    projectRealTitle: "ORTHÁPTICA",
    tags: ["Virtual Reality", "Oculus", "Haptic Interacion"],
    technologies: ["Unity", "CSharp", "Blender"],
    image: "/assets/images/projects/xr/OH_Resident.JPG",
  },
  {
    projectRealTitle: "Cv Angular renderer",
    tags: ["Full-Stack", "File Generator"],
    technologies: ["Angular", "NodeJS", "Typescript", "Tailwind"],
    image: "/assets/images/projects/reliability/cv-renderer.png",
  },
  {
    projectRealTitle: "ARMobile",
    tags: ["Augmented Reality", "Android"],
    technologies: ["Unity", "CSharp", "Vuforia", "Android"],
    image: "/assets/images/projects/xr/LisboaAR.png",
  },
  {
    projectRealTitle: "SRE in Checkout Service",
    tags: ["DevOps", "Incident management", "Code Quality"],
    technologies: ["Jenkins", "Linux", "K8", "Grafana", "Docker"],
    image: "/assets/images/projects/reliability/RealisticSRE.webp",
  },
  {
    projectRealTitle: "Virtual Reality in Unity",
    tags: ["Game Development", "Tutorials"],
    technologies: ["VSCode", "Unity", "CSharp"],
    image: "/assets/images/projects/xr/anastasio.png",
  },
  {
    projectRealTitle: "Swap Puzzle",
    tags: ["Game Development", "Mobile"],
    technologies: ["Unreal", "Cpp", "Android"],
    image: "/assets/images/projects/xr/swapPuzzle_random.jpg",
  },
  {
     projectRealTitle: "LiDAR Sensors with Three.Js",
    tags: ["Singal Tracking"],
    technologies: ["React", "Python", "Three.js"],
    image: "/assets/images/projects/xr/swapPuzzle_random.jpg",
    // Arquitectura de visores multi-sensor para el dataset nuScenes, integrando FastAPI (Python) y R3F para la visualización 3D de nubes de puntos LiDAR
  }
];

// ─── Language-keyed translatable content ─────────────────────────────────────

type ProjectText = Pick<Project, 'projectPublicTitle' | 'subtitle' | 'content' | 'resume'>;
type MiniProjectText = Pick<MiniProject, 'projectPublicTitle' | 'resume'>;

const _projectsText: Record<Lang, Record<string, ProjectText>> = {
  en: {
    frontend: {
      projectPublicTitle: "3D Apparel Microservice",
      subtitle: "Frontend microservice enabling e-commerce PDPs to interact with 3D apparel and footwear models from any angle.",
      content: `Development and design of visual and interactive experiences for adidas brand in Colombia. My specialty is creating interactive content for web projects, Unity or Unreal applications, 360° tours, and VR/XR experiences. I have strong expertise in web technologies and led several projects based on Node.js, React.js, and Three.js — covering all layers of implementation (JavaScript, TypeScript, HTML5, CSS/SCSS, and hosting) along with frameworks for 3D, 360°, and interactive visualization. (*All 3D models or renders shown are property of Umbra3D.studio and adidas.)`,
    },
    proptech: {
      projectPublicTitle: "PropTech",
      subtitle: "Full-stack development for interactive real-estate masterplans — combining advanced visualization with backend microservices that display real-time construction progress and sales data.",
      resume: "I have developed the front-end with Javascript, Typescript, ReactJS, CSS and all the needed frameworks for 3D, 360 and media interaction. I've got also a back-end experience like needed servers and the related web hosting requirements.",
      content: `My work focused on architecture and advertising solutions for the real-estate market. The key deliverables included interactive 3D masterplans and hyper-realistic architectural visualizations. I contributed to both the visual and technical sides, from Unreal, Unity, and React.js development to full-stack engineering for masterplan servers, automated mailing systems, and visual analytics platforms.`,
    },
    xr: {
      projectPublicTitle: "Vehicle Personalization",
      subtitle: "Delivering innovation to dealerships through mobile and web applications that allow customers to fully customize their vehicles—inside and out.",
      content: `Development and design of visual and interactive experiences for international brands in Colombia. My specialty is creating interactive content for web projects, Unity or Unreal applications, 360° tours, and VR/XR experiences. I have strong expertise in web technologies and led several projects based on Node.js, React.js, and Three.js — covering all layers of implementation (JavaScript, TypeScript, HTML5, CSS/SCSS, and hosting) along with frameworks for 3D, 360°, and interactive visualization. (*All 3D models or renders shown are property of Umbra3D.studio and adidas.)`,
    },
  },
  es: {
    frontend: {
      projectPublicTitle: "Microservicio 3D de Indumentaria",
      subtitle: "Microservicio frontend que permite a los PDPs de e-commerce interactuar con modelos 3D de ropa y calzado desde cualquier ángulo.",
      content: `Desarrollo y diseño de experiencias visuales e interactivas para la marca adidas en Colombia. Mi especialidad es crear contenido interactivo para proyectos web, aplicaciones en Unity o Unreal, recorridos 360° y experiencias VR/XR. Tengo sólida experiencia en tecnologías web y lideré varios proyectos basados en Node.js, React.js y Three.js — abarcando todas las capas de implementación (JavaScript, TypeScript, HTML5, CSS/SCSS y hosting), junto con frameworks para visualización 3D, 360° e interactiva. (*Todos los modelos 3D o renders mostrados son propiedad de Umbra3D.studio y adidas.)`,
    },
    proptech: {
      projectPublicTitle: "PropTech",
      subtitle: "Desarrollo full-stack para masterplans inmobiliarios interactivos — combinando visualización avanzada con microservicios backend que muestran el progreso de construcción y datos de ventas en tiempo real.",
      resume: "Desarrollé el frontend con JavaScript, TypeScript, ReactJS, CSS y todos los frameworks necesarios para interacción 3D, 360 y multimedia. También cuento con experiencia en backend, servidores y los requisitos de hosting web correspondientes.",
      content: `Mi trabajo se centró en soluciones de arquitectura y publicidad para el mercado inmobiliario. Los entregables clave incluyeron masterplans 3D interactivos y visualizaciones arquitectónicas hiperrealistas. Contribuí tanto al lado visual como técnico, desde el desarrollo en Unreal, Unity y React.js hasta la ingeniería full-stack para servidores de masterplan, sistemas de mailing automatizado y plataformas de analítica visual.`,
    },
    xr: {
      projectPublicTitle: "Personalización de Vehículos",
      subtitle: "Llevando innovación a los concesionarios mediante aplicaciones móviles y web que permiten a los clientes personalizar completamente sus vehículos, por dentro y por fuera.",
      content: `Desarrollo y diseño de experiencias visuales e interactivas para marcas internacionales en Colombia. Mi especialidad es crear contenido interactivo para proyectos web, aplicaciones en Unity o Unreal, recorridos 360° y experiencias VR/XR. Tengo sólida experiencia en tecnologías web y lideré varios proyectos basados en Node.js, React.js y Three.js — abarcando todas las capas de implementación (JavaScript, TypeScript, HTML5, CSS/SCSS y hosting), junto con frameworks para visualización 3D, 360° e interactiva. (*Todos los modelos 3D o renders mostrados son propiedad de Umbra3D.studio y adidas.)`,
    },
  },
  de: {
    frontend: {
      projectPublicTitle: "3D-Bekleidungs-Microservice",
      subtitle: "Frontend-Microservice, der E-Commerce-PDPs ermöglicht, mit 3D-Bekleidungs- und Schuhmodellen aus jedem Blickwinkel zu interagieren.",
      content: `Entwicklung und Design visueller und interaktiver Erlebnisse für die Marke adidas in Kolumbien. Meine Spezialität ist die Erstellung interaktiver Inhalte für Webprojekte, Unity- oder Unreal-Anwendungen, 360°-Touren und VR/XR-Erfahrungen. Ich verfüge über fundierte Kenntnisse in Webtechnologien und habe mehrere Projekte auf Basis von Node.js, React.js und Three.js geleitet — über alle Implementierungsebenen hinweg (JavaScript, TypeScript, HTML5, CSS/SCSS und Hosting) sowie Frameworks für 3D-, 360°- und interaktive Visualisierung. (*Alle gezeigten 3D-Modelle oder Renderings sind Eigentum von Umbra3D.studio und adidas.)`,
    },
    proptech: {
      projectPublicTitle: "PropTech",
      subtitle: "Full-Stack-Entwicklung für interaktive Immobilien-Masterpläne — mit fortschrittlicher Visualisierung und Backend-Microservices, die Baufortschritt und Verkaufsdaten in Echtzeit anzeigen.",
      resume: "Ich habe das Frontend mit JavaScript, TypeScript, ReactJS, CSS und allen erforderlichen Frameworks für 3D-, 360°- und Medieninteraktion entwickelt. Ich verfüge auch über Backend-Erfahrung mit Servern und den entsprechenden Web-Hosting-Anforderungen.",
      content: `Meine Arbeit konzentrierte sich auf Architektur- und Werbelösungen für den Immobilienmarkt. Die wichtigsten Lieferobjekte umfassten interaktive 3D-Masterpläne und hyperrealistische Architekturvisualisierungen. Ich trug sowohl zur visuellen als auch zur technischen Seite bei — von der Unreal-, Unity- und React.js-Entwicklung bis zur Full-Stack-Entwicklung für Masterplan-Server, automatisierte Mailing-Systeme und visuelle Analyseplattformen.`,
    },
    xr: {
      projectPublicTitle: "Fahrzeugpersonalisierung",
      subtitle: "Innovation in Autohäusern durch mobile und Web-Anwendungen, die Kunden ermöglichen, ihre Fahrzeuge vollständig zu individualisieren — innen und außen.",
      content: `Entwicklung und Design visueller und interaktiver Erlebnisse für internationale Marken in Kolumbien. Meine Spezialität ist die Erstellung interaktiver Inhalte für Webprojekte, Unity- oder Unreal-Anwendungen, 360°-Touren und VR/XR-Erfahrungen. Ich verfüge über fundierte Kenntnisse in Webtechnologien und habe mehrere Projekte auf Basis von Node.js, React.js und Three.js geleitet. (*Alle gezeigten 3D-Modelle oder Renderings sind Eigentum von Umbra3D.studio und adidas.)`,
    },
  },
};

const _miniProjectsText: Record<Lang, MiniProjectText[]> = {
  en: [
    { projectPublicTitle: "Immersive Medical Trainer", resume: "Full-scale serious game combining visual and haptic interaction for immersive training experiences." },
    { projectPublicTitle: "PDF Curriculum Generator", resume: "Server-based tool that renders user data into multiple CV designs and exports them as PDF." },
    { projectPublicTitle: "AR Paintings Experience", resume: "AR experience that recognizes world-city paintings and reveals cultural elements on your mobile device." },
    { projectPublicTitle: "SRE in Backend Orchestrator", resume: "Improved reliability of the Checkout via observability, alerts, and on-call support, with optimized CI/CD pipelines." },
    { projectPublicTitle: "Instructor to Game Devs (UNAL + SENA)", resume: "Summer course for high-school students covering materials, humanoids, animation, and scripting." },
    { projectPublicTitle: "Swap Puzzle", resume: "Casual game for mobile devices." },
  ],
  es: [
    { projectPublicTitle: "Simulador Médico Inmersivo", resume: "Videojuego serio a escala real que combina interacción visual y háptica para experiencias de entrenamiento inmersivo." },
    { projectPublicTitle: "Generador de CV en PDF", resume: "Herramienta basada en servidor que renderiza datos del usuario en múltiples diseños de CV y los exporta como PDF." },
    { projectPublicTitle: "Experiencia AR con Pinturas", resume: "Experiencia de AR que reconoce pinturas de ciudades del mundo y revela elementos culturales en tu dispositivo móvil." },
    { projectPublicTitle: "SRE en Orquestador Backend", resume: "Mejoré la confiabilidad del Checkout mediante observabilidad, alertas y soporte on-call, con pipelines de CI/CD optimizados." },
    { projectPublicTitle: "Instructor de Desarrollo de Videojuegos (UNAL + SENA)", resume: "Curso de verano para estudiantes de bachillerato sobre materiales, humanoides, animación y scripting." },
    { projectPublicTitle: "Swap Puzzle", resume: "Juego casual para dispositivos móviles." },
  ],
  de: [
    { projectPublicTitle: "Immersiver Medizintrainer", resume: "Serious Game in Originalgröße, das visuelle und haptische Interaktion für immersive Trainingserfahrungen kombiniert." },
    { projectPublicTitle: "PDF-Lebenslauf-Generator", resume: "Serverbasiertes Tool, das Benutzerdaten in mehrere Lebenslauf-Designs rendert und als PDF exportiert." },
    { projectPublicTitle: "AR-Gemälde-Erlebnis", resume: "AR-Erfahrung, die Gemälde von Weltstädten erkennt und kulturelle Elemente auf dem Mobilgerät enthüllt." },
    { projectPublicTitle: "SRE im Backend-Orchestrator", resume: "Verbesserte Checkout-Zuverlässigkeit durch Observability, Alerts und On-Call-Support mit optimierten CI/CD-Pipelines." },
    { projectPublicTitle: "Spieleentwicklungs-Kursleiter (UNAL + SENA)", resume: "Sommerkurs für Schüler mit Schwerpunkt auf Materialien, Humanoiden, Animation und Scripting." },
    { projectPublicTitle: "Swap Puzzle", resume: "Casual-Spiel für mobile Geräte." },
  ],
};

// ─── Getters ──────────────────────────────────────────────────────────────────

export const getProjectsData = (lang: Lang): Record<string, Project> => {
  const text = _projectsText[lang] ?? _projectsText.en;
  return Object.fromEntries(
    Object.entries(_sharedProjects).map(([key, shared]) => [
      key,
      { ...shared, ...text[key] } as Project,
    ])
  );
};

export const getMiniProjects = (lang: Lang): MiniProject[] =>
  _sharedMiniProjects.map((shared, i) => ({
    ...shared,
    ...(_miniProjectsText[lang] ?? _miniProjectsText.en)[i],
  }));

// ─── Backwards-compat named exports (used by Storybook stories) ───────────────

export const projectsData = getProjectsData('en');
export const miniProjects = getMiniProjects('en');

// ─── Backups (not used in portfolio, kept for reference) ─────────────────────

export const backups: Record<string, Project> = {
  "volvo": {
    projectPublicTitle: "Interactive E-commerce",
    projectRealTitle: "Volvo Customization",
    subtitle: "Bring innovation to e-commerce by building a web application that allows customers to personalize their products, and interact with them from different angles.",
    tags: ["Frontend", "UI/UX", "WebGL", "Visual Computing"],
    technologies: ["Typescript", "React", "CSS", "SCSS", "ThreeJs", "Figma"],
    projectField: "Frontend",
    images: [
      "/assets/images/projects/frontend/VolvoInteractive.PNG",
      "/assets/images/projects/frontend/volvo-home.PNG"
    ],
    mediaLinks: ["https://umbraint.com/catalogosdigitales/catalogovolvo"],
    gifs: ["/assets/images/projects/frontend/volvo-3d.gif"],
    initDate: new Date(2020, 0, 1),
    endDate: new Date(2020, 10, 1),
    content: `Development and design of visual and interactive experiences for international brands in Colombia.`
  },
  "adidas": {
    projectPublicTitle: "Interactive E-commerce",
    projectRealTitle: "3d-das",
    subtitle: "Bring innovation to e-commerce by building a web application that allows customers to personalize their products, and interact with them from different angles.",
    tags: ["Typescript", "React", "ThreeJs", "SCSS", "Unity"],
    technologies: ["Typescript", "React", "CSS", "SCSS", "ThreeJs", "Figma"],
    projectField: "Frontend",
    images: ["/assets/images/projects/frontend/3ddas_tbt.png"],
    mediaLinks: ["https://umbraint.com/catalogosdigitales/catalogovolvo"],
    gifs: ["/assets/images/projects/frontend/volvo-3d.gif"],
    initDate: new Date(2022, 0, 1),
    endDate: new Date(2023, 10, 1),
    content: `Development and design of visual and interactive experiences for international brands in Colombia.`
  },
  "orthaptica": {
    projectRealTitle: "ORTHÁPTICA",
    projectPublicTitle: "Immersive Medical Trainer",
    subtitle: "One-to-one scale simulators combining visual and haptic interaction. I developed mixed-reality training tools — also known as 'serious games' — to provide immersive learning experiences.",
    tags: ["Mixed Reality", "Oculus", "Hololens", "Haptic Interacion", "Serious Games"],
    technologies: ["Unity", "CSharp", "Unreal", "Cpp", "Android"],
    projectField: "XR",
    images: [
      "/assets/images/projects/xr/OH_Resident.JPG",
      "/assets/images/projects/xr/OHdavid.JPG"
    ],
    gifs: ["/assets/images/projects/xr/OH_2D.gif"],
    mediaLinks: ["https://www.youtube.com/watch?v=Buu8ReSidRE"],
    initDate: new Date(2017, 6, 1),
    endDate: new Date(2019, 7, 1),
    content: `This simulator reduces risk, particularly in surgical training. It provides an immersive learning environment for orthopedic residents using haptic devices to replicate surgical procedures during trauma operations.`
  },
};
