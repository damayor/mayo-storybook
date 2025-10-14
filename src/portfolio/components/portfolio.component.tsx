import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Menu, X, Github, Linkedin, Mail, ExternalLink, Code, Palette, Zap, Globe } from 'lucide-react';
import mayintLogo from './../../assets/mayint.svg'
import { useTranslation } from 'react-i18next';
import { Badge } from '../../stories/html/badge/badge';

// Componente de fondo 3D animado
function AnimatedSphere({ position, color, speed } : any) { 
  const meshRef = useRef<THREE.Mesh | null>(null)

  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * speed;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * speed * 0.5;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.3;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 32, 32]} position={position}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
}

function Background3D() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#4f46e5" />
        
        <AnimatedSphere position={[-3, 0, 0]} color="#4f46e5" speed={0.3} />
        <AnimatedSphere position={[3, 1, -2]} color="#06b6d4" speed={0.2} />
        <AnimatedSphere position={[0, -2, -1]} color="#8b5cf6" speed={0.25} />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}

function LanguageSelector() {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    // { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  return (
    <div className="fixed top-6 right-6 z-30">
      <div className="flex gap-2 bg-slate-800/80 backdrop-blur-sm rounded-lg p-2 border border-slate-700">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-2 ${
              i18n.language === lang.code
                ? 'bg-blue-500 text-white'
                : 'text-gray-300 hover:bg-slate-700'
            }`}
          >
            <span>{lang.flag}</span>
            <span className="hidden sm:inline">{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}
// Componente Sidebar
function Sidebar({ isOpen, setIsOpen, activeSection, setActiveSection } : SidebarProps) {
  const { t } = useTranslation();

  
  const sections = [
    { id: 'home', label: t('nav.home') , icon: '🏠' },
    { id: 'about', label: t('nav.about'),  icon: '👤' },
    { id: 'projects', label: t('nav.projects') , icon: '💼' },
    { id: 'skills', label: t('nav.skills'), icon: '⚡' },
    { id: 'contact', label: t('nav.contact') , icon: '📧' }
  ];

  const handleNavClick = (sectionId : string) => {
    setActiveSection(sectionId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 
        shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="text-gray-300" size={24} />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleNavClick(section.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-purple-700 to-camelot-950 text-white shadow-lg scale-105'
                    : 'text-gray-300 hover:bg-slate-700 hover:translate-x-1'
                }`}
              >
                <span className="text-2xl">{section.icon}</span>
                <span className="font-medium">{section.label}</span>
              </button>
            ))}
          </nav>

          <div className="border-t border-slate-700 pt-6 space-y-4">
            <div className="flex justify-center gap-4">
              <a href="#" className="p-2 bg-slate-700 hover:bg-camelot-700 rounded-lg transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="p-2 bg-slate-700 hover:bg-camelot-700 rounded-lg transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="p-2 bg-slate-700 hover:bg-camelot-700 rounded-lg transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Secciones del Portfolio
function HomeSection() {

  const { t } = useTranslation();

  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-4xl text-center">
        <div className="mb-6 animate-fade-in">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-camelot-950 to-camelot-500 p-1">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-5xl">
              <img className='rounded-full' src={mayintLogo} alt="May Interactive Logo" />
            </div>
          </div>
        </div>
        {/* deberia poner de hecho el heading 1... */}
        <h1 className="text-6xl font-bold mb-4 bg-camelot-800 bg-clip-text text-transparent">
          {t('home.title')}
        </h1>
        <p className="text-2xl text-gray-300 mb-8">
          {t('home.subtitle')}
        </p>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
          {t('home.description')}
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-8 py-3 bg-gradient-to-r from-purple-700 to-camelot-600 rounded-lg font-medium hover:scale-105 transition-transform shadow-lg">
            {t('home.viewProjects')}
          </button>
          <button className="px-8 py-3 border-2 bg-burg border-camelot-800 rounded-lg font-medium hover:bg-camelot-700/10 transition-colors">
            {t('home.contactMe')}
          </button>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {

  const { t } = useTranslation();
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-4xl">
        <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-camelot-600 to-camelot-950 bg-clip-text text-transparent">
          {t('about.title')}
        </h2>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
          <p className="text-lg text-gray-300 mb-6 leading-relaxed">
            {t('about.intro')}
          </p>
          <p className="text-lg text-gray-300 mb-6 leading-relaxed">
            {t('about.experience')}
          </p>
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="text-center p-4 bg-slate-700/50 rounded-lg">
              <Code className="mx-auto mb-2 text-blue-400" size={32} />
              <p className="font-semibold text-gray-200">{t('about.mainSkills.frontend')}</p>
            </div>
            <div className="text-center p-4 bg-slate-700/50 rounded-lg">
              <Palette className="mx-auto mb-2 text-purple-400" size={32} />
              <p className="font-semibold text-gray-200">{t('about.mainSkills.vrar')}</p>
            </div>
            <div className="text-center p-4 bg-slate-700/50 rounded-lg">
              <Zap className="mx-auto mb-2 text-yellow-400" size={32} />
              <p className="font-semibold text-gray-200">{t('about.mainSkills.production')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  const { t } = useTranslation();
  const projects =  t('projects.items', {returnObjects: true}) as Array<any>

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-6xl w-full">
        <h2 className="text-5xl font-bold mb-12 bg-gradient-to-r from-camelot-600 to-camelot-950 bg-clip-text text-transparent">
         {t('projects.title')}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div 
              key={index}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-camelot-500 transition-all hover:scale-105 cursor-pointer group"
            >
              <div className="text-6xl mb-4">{project.image}</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-100 group-hover:text-camelot-400 transition-colors">
                {t('projects.items.'+index+'.title')}
              </h3>
              <p className="text-gray-400 mb-4">
                 {t('projects.items.'+index+'.description')}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {(t('projects.items.'+index+'.tech', {returnObjects: true}) as Array<string>).map((tech, i) => (
                  <span key={i} className="px-3 py-1 bg-camelot-700/20 text-camelot-300 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
              <button className="flex items-center gap-2 text-camelot-400 hover:text-camelot-300 transition-colors">
                {t('projects.viewMore')} <ExternalLink size={16} /> 
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillsSection() {
  const { t } = useTranslation();

  // This should be in another data service script or json
  const skills = {
    'Frontend': ['React', 'TypeScript', 'Angular', 'Tailwind CSS', 'SCSS', 'Next.js', 'Storybook', 'Figma'],
    'Backend': ['Node.js', 'Postman', 'MongoDB', 'PostgreSQL', 'REST'],
    'Tools': ['Copilot', 'Git', 'Jira', 'Confluence','Vite', 'JUnit', 'Vitest'],
    'CI/CD': ['Docker', 'Kubernetes', 'YAML','Jenkins','Groovy','Opsgenie', 'Grafana', 'Kibana', 'Instana'],
    '3D': ['Unity', 'Unreal', 'UI/UX', 'AR', 'Oculus', 'VR', 'Hololens','ThreeJs', 'WebGL', 'Blender'],
    'FullStack': ['Javascript', 'C#', 'Linux', 'bash', 'C++', 'Java', 'Python'],

  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-5xl w-full">
        <h2 className="text-5xl font-bold mb-12 bg-gradient-to-r from-camelot-600 to-camelot-950 bg-clip-text text-transparent">
          {t('skills.title')}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(skills).map(([category, items], index) => (
            <div key={category} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              {/* //ToDo */}
              <h3 className="text-2xl font-bold mb-4 text-gray-100">{ t('skills.categories.'+index) }</h3>
              <div className="space-y-2 space-x-1">
                {items.map((skill, index) => (
                  <Badge key={index} color="outline" label={skill} />
                  // <div 
                  //   key={index}
                  //   className="bg-slate-700/50 px-4 py-2 rounded-lg text-gray-300 hover:bg-camelot-700/20 hover:text-camelot-300 transition-colors cursor-pointer"
                  // >
                  //   {skill}
                  // </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const { t } = useTranslation();

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-2xl w-full">
        <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-camelot-600 to-camelot-950 bg-clip-text text-transparent text-center">
          {t('contact.title')}
        </h2>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
          <p className="text-lg text-gray-300 mb-8 text-center">
           {t('contact.description')}
          </p>
          <form className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">{t('contact.form.name')}</label>
              <input 
                type="text"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-gray-100 focus:border-camelot-500 focus:outline-none transition-colors"
                placeholder={t('contact.form.namePlaceholder')}
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">{t('contact.form.email')}</label>
              <input 
                type="email"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-gray-100 focus:border-camelot-500 focus:outline-none transition-colors"
                placeholder={t('contact.form.emailPlaceholder')}
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">{t('contact.form.message')}</label>
              <textarea 
                rows={5}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-gray-100 focus:border-camelot-500 focus:outline-none transition-colors resize-none"
                placeholder={t('contact.form.messagePlaceholder')}
              />
            </div>
            <button 
              type="submit"
              // onClick={() => console.log(t('contact.form.successMessage'))}
              className="w-full px-8 py-3 bg-gradient-to-r from-purple-700 to-camelot-800 rounded-lg font-medium hover:scale-105 transition-transform shadow-lg"
            >
              {t('contact.form.submit')}
            </button>
          </form>
          <div className="flex justify-center gap-6 mt-8 pt-8 border-t border-slate-700">
            <a href="#" className="p-3 bg-slate-700 hover:bg-camelot-700 rounded-lg transition-colors">
              <Github size={24} />
            </a>
            <a href="#" className="p-3 bg-slate-700 hover:bg-camelot-700 rounded-lg transition-colors">
              <Linkedin size={24} />
            </a>
            <a href="#" className="p-3 bg-slate-700 hover:bg-camelot-700 rounded-lg transition-colors">
              <Mail size={24} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// Componente Principal
export default function Portfolio() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const renderSection = () => {
    switch (activeSection) {
      case 'home': return <HomeSection />;
      case 'about': return <AboutSection />;
      case 'projects': return <ProjectsSection />;
      case 'skills': return <SkillsSection />;
      case 'contact': return <ContactSection />;
      default: return <HomeSection />;
    }
  };

  return (
    <div className="min-h-screen w-screen bg-purple-800/10 text-white overflow-x-hidden">
      <Background3D />

      <LanguageSelector />
      
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Botón del menú hamburguesa */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-6 left-6 z-30 p-3 bg-slate-800/80 backdrop-blur-sm rounded-lg shadow-lg hover:bg-slate-700 transition-colors border border-slate-700"
      >
        <Menu size={24} />
      </button>

      {/* Contenido principal */}
      <main className="relative z-10">
        {renderSection()}
      </main>

      {/* Indicador de sección */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30 space-y-3">
        {['home', 'about', 'projects', 'skills', 'contact'].map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`block w-3 h-3 rounded-full transition-all ${
              activeSection === section 
                ? 'bg-camelot-700 scale-150' 
                : 'bg-slate-600 hover:bg-slate-500'
            }`}
            title={section}
          />
        ))}
      </div>
    </div>
  );
}