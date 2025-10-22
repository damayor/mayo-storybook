import type { Project } from "Interfaces/projects";

export const projectsData: Record<string, Project> =
{
  "frontend":{
    projectPublicTitle: "Interactive E-commerce",
    projectRealTitle: "3d-das",
    subtitle: "Bring innovation to e-commerce by building a web microservice that allows customers to personalize their products, and interact with them from different angles.",
    tags: ["Frontend", "UI/UX", "WebGL", "Visual Computing", "Responsive", "Storybook"],
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
  "xr": {
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
  }
}


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
  }
}