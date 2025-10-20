import type { Project } from "Interfaces/projects";

export const projectsData: Record<string, Project> =
{
  "frontend": {
    projectPublicTitle: "Interactive E-commerce",
    projectRealTitle: "Volvo Customization",
    subtitle: "My goal was to bring innovation to e-commerce by building a web application that allows customers to personalize their products — changing colors, materials, and viewing them from different angles in real time.",
    tags: ["Frontend", "UI/UX", "WebGL", "Visual Computing"],
    technologies: ["Typescript", "React","CSS", "SCSS", "ThreeJs", "Figma"],
    projectField: "Frontend",
    images: [
      "src/assets/images/projects/frontend/VolvoInteractive.PNG",
      "src/assets/images/projects/frontend/volvo-home.PNG"
    ],
    mediaLinks: [
      "https://umbraint.com/catalogosdigitales/catalogovolvo"
    ],
    gifs: [
      "src/assets/images/projects/frontend/volvo-3d.gif"
    ],
    initDate: new Date(2020, 0, 1),
    endDate: new Date(2020, 10, 1),
    content: `Development and design of visual and interactive experiences for international brands in Colombia. My specialty is creating interactive content for web projects, Unity or Unreal applications, 360° tours, and VR/XR experiences. I have strong expertise in web technologies and led several projects based on Node.js, React.js, and Three.js — covering all layers of implementation (JavaScript, TypeScript, HTML5, CSS/SCSS, and hosting) along with frameworks for 3D, 360°, and interactive visualization. (*All 3D models or renders shown are property of Umbra3D.studio and adidas.)`
  },
  "xr": {
    projectRealTitle: "ORTHÁPTICA",
    projectPublicTitle: "Immersive Medical Trainer",
    subtitle: "One-to-one scale simulators combining visual and haptic interaction. I developed mixed-reality training tools — also known as ‘serious games’ — to provide immersive and practical learning experiences.",
    // resume: "I have got yet the experience in simulators with an one-to-one scale, not only with a visual interaction but on a haptic interaction too. I have also developed training simulators with mixed reality in order to acquire immersive learning or as it's called nowadays 'serious games'.",
    tags: ["Mixed Reality", "Oculus", "Hololens", "Haptic Interacion", "Serious Games"],
    technologies: ["Unity", "CSharp", "Unreal", "Cpp", "Android"],
    projectField: "XR",
    images: [
      "src/assets/images/projects/xr/OH_Resident.JPG",
      "src/assets/images/projects/xr/OHdavid.JPG"
    ],
    gifs: [
      "src/assets/images/projects/xr/OH_2D.gif"
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
      "src/assets/images/projects/reliability/1E_quad_4.JPG",
      "src/assets/images/projects/reliability/1E_quad_mail.JPG",
    ],
    gifs: [
      "src/assets/images/projects/reliability/1E_intro.gif",
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


export const newerProjects: Record<string, Project> =
{
  "frontend": {
    projectPublicTitle: "Interactive E-commerce",
    projectRealTitle: "3d-das",
    //ToDo
    subtitle: "With meshes of adidas market, to show more deeply and interactive if that would be the best fir for you",
    tags: ["Typescript", "React", "ThreeJs", "SCSS", "Unity"],
    technologies: ["Unity", "NodeJs", "React"],
    projectField: "Frontend",

    //Fotos de un zapato volando en el vaino
    //El Hotstpot
    images: [
      "src/assets/images/projects/frontend/volvoInteractive.PNG",
      "src/assets/images/projects/frontend/volvo-home.PNG"
    ],

    //Todo El Hotstpot actuando, o la rotacion
    gifs: [
      "src/assets/images/projects/frontend/volvo-3d.gif"
    ],
    mediaLinks: [
      "https://www.youtube.com/watch?v=Buu8ReSidRE"
    ],
    initDate: new Date(2022, 0, 1),
    endDate: new Date(2023, 10, 1),
    content: `Todo`
  },

}