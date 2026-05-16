import type { MiniProject, Project } from "Interfaces/projects";

export const projectsData: Record<string, Project> =
{
  "frontend":{
    projectPublicTitle: "3D Apparel Microservice",
    projectRealTitle: "3d-das",
    subtitle: "Frontend microservice enabling e-commerce PDPs to interact with 3D apparel and footwear models from any angle.", //Tochk
    tags: ["Frontend", "UI/UX", "WebGL", "Visual Computing", "Responsive", "Storybook"],
    technologies: ["Typescript", "React","CSS", "SCSS", "ThreeJs", "Figma"],
    projectField: "Frontend",
    images: [
      "/assets/images/projects/frontend/3ddas_tbt.png"
    ],
    mediaLinks: [
      "https://mayinteractive.io/storybook/?path=/story/three-experiences-interactivepdp--interactive-pdp"
    ],
    gifs: [
      "/assets/images/projects/frontend/volvo-3d.gif" //ToDo Ahora si grabese el Gif
    ],
    initDate: new Date(2022, 0, 1),
    endDate: new Date(2023, 10, 1),
    content: `Development and design of visual and interactive experiences for 
    adidas brand in Colombia. My specialty is creating interactive 
    content for web projects, Unity or Unreal applications, 360° tours, 
    and VR/XR experiences. I have strong expertise in web technologies and 
    led several projects based on Node.js, React.js, and Three.js — 
    covering all layers of implementation (JavaScript, TypeScript, HTML5, CSS/SCSS, 
    and hosting) along with frameworks for 3D, 360°, and interactive visualization. 
    (*All 3D models or renders shown are property of Umbra3D.studio and adidas.)` //ToDo ya si mas enfocado
  },
  "proptech": {
    projectRealTitle: "Primera Este",
    projectPublicTitle: "PropTech",
    subtitle: "Full-stack development for interactive real-estate masterplans — combining advanced visualization with backend microservices that display real-time construction progress and sales data.",
    resume: "I have developed the front-end with Javascript, Typescript, ReactJS, CSS and all the needed frameworks for 3D, 360 and media interaction. I've got also a back-end experience like needed servers and the related web hosting requirements.",    
    tags: ["Full-Stack", "Microservices", "SRE", "REST APIs", "Web Hosting", "Observability"],
    technologies: ["NodeJS","Postman","Mongo", "Redux", "Filezilla"],
    projectField: "Reliability",
    images: [
      "/assets/images/projects/reliability/1E_quad_4.JPG",
      "/assets/images/projects/reliability/1E_quad_mail.JPG",
    ],
    gifs: [
      "/assets/images/projects/reliability/1E_intro2.gif",
    ],
    mediaLinks: [
      "https://www.youtube.com/watch?v=JUJl6v0Scas", //1a Este 
      "https://www.youtube.com/watch?v=jXI6X0najy0" //Zipa
    ],
    initDate: new Date(2020, 0, 1),
    endDate: new Date(2020, 10, 1),
    content:`
     "My work focused on architecture and advertising solutions for
      the real-estate market. The key deliverables included 
      interactive 3D masterplans and hyper-realistic architectural 
      visualizations. I contributed to both the visual and technical
      sides, from Unreal, Unity, and React.js development to 
      full-stack engineering for masterplan servers, 
      automated mailing systems, and visual analytics platforms."
    `
  },
    "xr": {
    projectPublicTitle: "Vehicle Personalization",
    projectRealTitle: "Volvo Customization",
    subtitle: "Delivering innovation to dealerships through mobile and web applications that allow customers to fully customize their vehicles—inside and out.",
    tags: ["Mobile Apps", "UI/UX", "FTP", "Mobile devices"],
    technologies: ["Unity", "CSharp", "Unreal", "Cpp", "Android"],
    projectField: "Frontend",
    images: [
      "/assets/images/projects/xr/VolvoS60.png",
      "/assets/images/projects/frontend/volvo-home.PNG"
    ],
    mediaLinks: [
      "https://umbraint.com/catalogosdigitales/catalogovolvo"
    ],
    gifs: [
      "/assets/images/projects/frontend/volvo-3d.gif"
    ],
    initDate: new Date(2020, 0, 1),
    endDate: new Date(2020, 10, 1),
    content: `Development and design of visual and interactive experiences for 
    international brands in Colombia. My specialty is creating interactive 
    content for web projects, Unity or Unreal applications, 360° tours, 
    and VR/XR experiences. I have strong expertise in web technologies and 
    led several projects based on Node.js, React.js, and Three.js — 
    covering all layers of implementation (JavaScript, TypeScript, HTML5, CSS/SCSS, 
    and hosting) along with frameworks for 3D, 360°, and interactive visualization. 
    (*All 3D models or renders shown are property of Umbra3D.studio and adidas.)`
  },
}

export const miniProjects : MiniProject[] = [
      {
      projectRealTitle: "ORTHÁPTICA",
      projectPublicTitle: "Immersive Medical Trainer",
      resume: "Full-scale serious game combining visual and haptic interaction for immersive training experiences.",
      tags: ["Virtual Reality", "Oculus", "Haptic Interacion"],
      technologies: ["Unity", "CSharp", "Blender"],
      image: "/assets/images/projects/xr/OH_Resident.JPG"
    },
            {
      projectRealTitle: "Cv Angular renderer",
      projectPublicTitle: "PDF Curriculum Generator",
      resume: "Server-based tool that renders user data into multiple CV designs and exports them as PDF.",
      tags: ['Full-Stack', "File Generator"],
      technologies: ['Angular', "NodeJS", 'Typescript', "Tailwind",],
      image: "/assets/images/projects/reliability/cv-renderer.png"
    },
    
    {
      projectRealTitle: "ARMobile",
      projectPublicTitle: "AR Paintings Experience",
      resume: "AR experience that recognizes world-city paintings and reveals cultural elements on your mobile device.",
      tags: ["Augmented Reality", "Android"],
      technologies: ["Unity", "CSharp", "Vuforia", "Android"],
      image: "/assets/images/projects/xr/LisboaAR.png"
    },

           {
      projectRealTitle: "SRE in Checkout Service",
      projectPublicTitle: "SRE in Backend Orchestrator",
      resume: `Improved reliability of the Checkout via observability, alerts, and on-call support, with optimized CI/CD pipelines`,
      tags: ["DevOps", "Incident management","Code Quality"],
      technologies: ["Jenkins", "Linux", "K8", "Grafana", "Docker"],
      image: "/assets/images/projects/reliability/RealisticSRE.webp"
    },

        {
      projectRealTitle: "Virtual Reality in Unity",
      projectPublicTitle: "Instructor to Game Devs (UNAL + SENA)",
      resume: "Summer course for high-school students covering materials, humanoids, animation, and scripting.",
      tags: ['Game Development', 'Tutorials'],
      technologies: ['VSCode', 'Unity', 'CSharp'],
      image: "/assets/images/projects/xr/anastasio.png"
    },
 

    {
      projectRealTitle: "Swap Puzzle",
      projectPublicTitle: "Swap Puzzle",
      resume: "Casual game to mobile devices.",
      tags: ["Game Development", "Mobile",],
      technologies: ["Unreal", "Cpp", "Android"],
      image: "/assets/images/projects/xr/swapPuzzle_random.jpg"
    },


  ];

export const backups: Record<string, Project> =
{
  "volvo": {
    projectPublicTitle: "Interactive E-commerce",
    projectRealTitle: "Volvo Customization",
    subtitle: "Bring innovation to e-commerce by building a web application that allows customers to personalize their products, and interact with them from different angles.",
    tags: ["Frontend", "UI/UX", "WebGL", "Visual Computing"],
    technologies: ["Typescript", "React","CSS", "SCSS", "ThreeJs", "Figma"],
    projectField: "Frontend",
    images: [
      "/assets/images/projects/frontend/VolvoInteractive.PNG",
      "/assets/images/projects/frontend/volvo-home.PNG"
    ],
    mediaLinks: [
      "https://umbraint.com/catalogosdigitales/catalogovolvo"
    ],
    gifs: [
      "/assets/images/projects/frontend/volvo-3d.gif"
    ],
    initDate: new Date(2020, 0, 1),
    endDate: new Date(2020, 10, 1),
    content: `Development and design of visual and interactive experiences for 
    international brands in Colombia. My specialty is creating interactive 
    content for web projects, Unity or Unreal applications, 360° tours, 
    and VR/XR experiences. I have strong expertise in web technologies and 
    led several projects based on Node.js, React.js, and Three.js — 
    covering all layers of implementation (JavaScript, TypeScript, HTML5, CSS/SCSS, 
    and hosting) along with frameworks for 3D, 360°, and interactive visualization. 
    (*All 3D models or renders shown are property of Umbra3D.studio and adidas.)`
  },
  "adidas":
  {
    projectPublicTitle: "Interactive E-commerce",
    projectRealTitle: "3d-das",
    subtitle: "Bring innovation to e-commerce by building a web application that allows customers to personalize their products, and interact with them from different angles.",
    tags: ["Typescript", "React", "ThreeJs", "SCSS", "Unity"],
    technologies: ["Typescript", "React","CSS", "SCSS", "ThreeJs", "Figma"],
    projectField: "Frontend",
    images: [
      "/assets/images/projects/frontend/3ddas_tbt.png"
    ],
    mediaLinks: [
      "https://umbraint.com/catalogosdigitales/catalogovolvo"
    ],
    gifs: [
      "/assets/images/projects/frontend/volvo-3d.gif"
    ],
    initDate: new Date(2022, 0, 1),
    endDate: new Date(2023, 10, 1),
    content: `Development and design of visual and interactive experiences for 
    international brands in Colombia. My specialty is creating interactive 
    content for web projects, Unity or Unreal applications, 360° tours, 
    and VR/XR experiences. I have strong expertise in web technologies and 
    led several projects based on Node.js, React.js, and Three.js — 
    covering all layers of implementation (JavaScript, TypeScript, HTML5, CSS/SCSS, 
    and hosting) along with frameworks for 3D, 360°, and interactive visualization. 
    (*All 3D models or renders shown are property of Umbra3D.studio and adidas.)`
  },
   "orthaptica": {
    projectRealTitle: "ORTHÁPTICA",
    projectPublicTitle: "Immersive Medical Trainer",
    subtitle: "One-to-one scale simulators combining visual and haptic interaction. I developed mixed-reality training tools — also known as ‘serious games’ — to provide immersive learning experiences.",
    tags: ["Mixed Reality", "Oculus", "Hololens", "Haptic Interacion", "Serious Games"],
    technologies: ["Unity", "CSharp", "Unreal", "Cpp", "Android"],
    projectField: "XR",
    images: [
      "/assets/images/projects/xr/OH_Resident.JPG",
      "/assets/images/projects/xr/OHdavid.JPG"
    ],
    gifs: [
      "/assets/images/projects/xr/OH_2D.gif"
    ],
    mediaLinks: [
      "https://www.youtube.com/watch?v=Buu8ReSidRE"
    ],
    initDate: new Date(2017, 6, 1),
    endDate: new Date(2019, 7, 1),
    content: `This simulator reduces risk, particularly in surgical 
    training. It provides an immersive learning environment for 
    orthopedic residents using haptic devices to replicate surgical 
    procedures during trauma operations. Thanks to tactile feedback,
     residents can develop motor skills with higher precision and 
     engagement than what’s possible in a real surgical room.`
  },
}