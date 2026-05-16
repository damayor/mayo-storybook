import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Menu, X, Github, Linkedin, Mail, FileJson2, Terminal, RectangleGoggles, Instagram } from 'lucide-react';
import mayintLogo from '/assets/mayint.svg'
import { useTranslation } from 'react-i18next';
import { sendContactEmail } from '../../services/email.service';

import { Heading } from 'HtmlComponents/headings';
import { Card } from 'HtmlComponents/card';
import { projectsData, miniProjects } from '../../data/projects';
import { toolsAndExprience } from '../../data/experience';
import SkillsTabPanel from '../../components/skills-panel/skills-panel-component';
import { contactData } from 'Data/contact';
import { type SectionType, SECTIONS, SECTIONS_ARRAY } from 'Interfaces/portfolio-sections';
import { useScrollDetection } from '../../hooks/useScrollDetection';
import { useInView } from 'react-intersection-observer';
import InteractiveBackground3D from '../../components/interactive-background-3d/InteractiveBackground3D';
import { MiniCard } from 'HtmlComponents/mini-card';
import { projectsMini } from 'HtmlComponents/mini-card/mini-card.stories';


function LanguageSelector() {
  const { i18n } = useTranslation();
  const languages = [
    { code: 'en', name: 'English', flag: 'gb' },
    { code: 'de', name: 'Deutsch', flag: 'de' },
    { code: 'es', name: 'Español', flag: 'es' },
  ];

  return (
    <div className="px-4 pb-4">
      <div className="flex gap-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className={`flex-1 px-2 py-1 text-xs rounded transition-all flex justify-center ${
              i18n.language === lang.code
                ? 'bg-blue-500 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            <img
              src={`https://flagcdn.com/${lang.flag}.svg`}
              width="20"
              alt={lang.name}/>
          </button>
        ))}
      </div>
    </div>
  );
}
interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onNavigate: (section: SectionType) => void;
}

// Componente Sidebar
function Sidebar({ isOpen, setIsOpen, onNavigate } : SidebarProps) {
  const { t } = useTranslation();  

  const sections= [
    { id: 'home' as const, label: t('nav.home') },
    { id: 'about' as const, label: t('nav.about'),},
    { id: 'projects' as const, label: t('nav.projects') },
    { id: 'skills' as const, label: t('nav.skills')},
    { id: 'contact' as const, label: t('nav.contact') }
  ];
  
  const handleNavClick = (sectionId : SectionType) => {
    onNavigate(sectionId);
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
        className={`fixed top-0 left-0 h-full w-72 sm:w-96 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 
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
                className="w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 text-gray-300 hover:bg-slate-700 hover:translate-x-1"
              >
                <span className="font-medium">{section.label}</span>
              </button>
            ))}
          </nav>

          <div className="border-t border-slate-700 pt-6 space-y-4"> 
            {/* ToDo when you have all translated  */}
            <LanguageSelector/> 
           
            <div className="flex justify-center gap-4">
              <a target="_blank" href={contactData.github} className="p-2 bg-slate-700 hover:bg-camelot-700 rounded-lg transition-colors">
                <Github size={20} />
              </a>
              <a target="_blank" href={contactData.linkedin} className="p-2 bg-slate-700 hover:bg-camelot-700 rounded-lg transition-colors">
                <Linkedin size={20} />
              </a>
              <a target="_blank" href={contactData.instagram} className="p-2 bg-slate-700 hover:bg-camelot-700 rounded-lg transition-colors">
                <Instagram size={20} />
              </a>
              <a target="_blank" href={contactData.behance} className="p-2 bg-slate-700 hover:bg-camelot-700 rounded-lg transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const REVEAL_BASE = 'transition-all duration-700 ease-out';
const revealed = `${REVEAL_BASE} opacity-100 translate-y-0`;
const hidden = `${REVEAL_BASE} opacity-0 translate-y-8`;

// Secciones del Portfolio
function HomeSection() {

  const { t } = useTranslation();
  const { ref, inView } = useInView({ threshold: 0.1 });

  return (
    <section className="min-h-screen flex items-center justify-center px-6">
        <div ref={ref} className={`max-w-4xl text-center z-10 ${inView ? revealed : hidden}`}>
          <div className="mb-6">
            <div className="w-27 h-27 mx-auto mb-6 rounded-full bg-gradient-to-br from-camelot-950 to-camelot-500 p-1">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-5xl font-lato">
                <img className='rounded-full' src={mayintLogo} alt="May Interactive Logo" />
              </div>
            </div>
          </div>
          <Heading level={1} children={t('home.title')} variant='primary'/>
          <hr className="h-px my-6 bg-camelot-900 border-0 dark:bg-gray-700"/>
          <p className="text-2xl text-camelot-800 mb-8 uppercase tracking-widest">
            {t('home.brand')} • {t('home.role') }
          </p>
          <hr className="h-px my-6 bg-camelot-900 border-0 dark:bg-gray-700"/>
        </div>

    </section>
  );
}

// We can be Heroes Sections
function AboutSection() {

  const { t } = useTranslation();
  const { ref: classRef, inView: classInView } = useInView({ threshold: 0.15 });
  const { ref: bioRef, inView: bioInView } = useInView({ threshold: 0.1 });

  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20">
      <div className="max-w-4xl z-10 px-8 py-10 sm:px-12 sm:py-14">

        {/* Class / Major / Minor header — reference: aboutMe_Reference.png */}
        <div ref={classRef} className={`text-center mb-70 ${classInView ? revealed : hidden}`}>
          <p className="text-xs tracking-[0.35em] uppercase text-gray-400 mb-5">
            {t('home.subtitle')}
          </p>
          <p
            className="text-sm tracking-[0.2em] uppercase text-gray-200 leading-8 [&_b]:font-bold [&_b]:tracking-[0.25em]"
            dangerouslySetInnerHTML={{ __html: t('home.description') }}
          />
        </div>

        {/* Bio */}
        <div ref={bioRef} className={`${bioInView ? revealed : hidden}`}>
          <p className="text-lg text-gray-200 mb-6 leading-relaxed" dangerouslySetInnerHTML={{__html: t('about.intro')}} />
          <p className="text-lg text-gray-200 mb-6 leading-relaxed" dangerouslySetInnerHTML={{__html: t('about.experience')}} />

          {/* Tagline */}
          <p className="text-lm font-bold text-gray-100 mb-10 text-center leading-relaxed italic">
            I write code in OOP; I think in three dimensions; I celebrate in salsa.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="text-center p-4 border-2 border-slate-700 rounded-lg">
              <FileJson2 className="mx-auto mb-2 text-blue-400" size={32} />
              <p className="font-semibold text-gray-200">{t('about.mainSkills.frontend')}</p>
            </div>
            <div className="text-center p-4 border-2 border-slate-700 rounded-lg">
              <RectangleGoggles className="mx-auto mb-2 text-camelot-500" size={32} />
              <p className="font-semibold text-gray-200">{t('about.mainSkills.xr')}</p>
            </div>
            <div className="text-center p-4 border-2 border-slate-700 rounded-lg">
              <Terminal className="mx-auto mb-2 text-purple-500" size={32} />
              <p className="font-semibold text-gray-200">{t('about.mainSkills.reliability')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  const { t } = useTranslation();
  const projData = Object.values(projectsData);
  const { ref: mainRef, inView: mainInView } = useInView({ threshold: 0.1 });
  const { ref: otherRef, inView: otherInView } = useInView({ threshold: 0.1 });

  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20">
      <div className="max-w-6xl w-full z-10">
        <div ref={mainRef} className={mainInView ? revealed : hidden}>
          <Heading level={2} className='text-5xl font-lato font-bold mb-12 bg-gradient-to-r from-camelot-500 to-camelot-950 bg-clip-text text-transparent text-center' variant='primary'>
            {t('projects.title')}
          </Heading>
          <div className="grid grids-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projData.map((project) => (
              <Card
                picture={project.images.at(0)!}
                projectField={project.projectField}
                projectTitle={project.projectPublicTitle}
                subtitle={project.subtitle}
                tags={project.tags}
                technologies={project.technologies}
                ctaLink={project.mediaLinks?.at(0)}
              />
            ))}
          </div>
        </div>

        <div ref={otherRef} className={`max-w-7xl mx-auto py-16 sm:py-20 ${otherInView ? revealed : hidden}`}>
          <Heading level={2} className='text-5xl font-lato font-bold mb-12 bg-gradient-to-r from-camelot-500 to-camelot-950 bg-clip-text text-transparent text-center' variant='primary'>
            Other Projects
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {miniProjects.map((project, index) => (
              <MiniCard key={index} {...project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      setStatusMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    setIsLoading(true);
    setStatusMessage({ type: 'success', text: `${formData.name}, I will stay in contact soon!` });
    setIsLoading(false);
    setIsSubmitting(true);

    try {
      //Todo save as env vars
      const TELEGRAM_TOKEN = '8752645898:AAEzQAN3sVNOE9oQ9xQAPsNgXcrAOtVYeww'
      const CHAT_ID = '6471003088'

      const text = `
        *🔔 Nuevo mensaje para May Interactive*

        *Nombre:* ${formData.name}
        *Email:* ${formData.email}
        *Mensaje:*
        ${formData.message}

        ${new Date().toLocaleString('es-ES')}
          `.trim();

        const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text,
            parse_mode: 'Markdown',
          }),
        });

        if (!res.ok) throw new Error('Telegram error');

        setStatusMessage({ type: 'success', text: `${formData.name}, I will stay in contact soon!!!`});
        setFormData({ name: '', email: '', message: '' }); // Limpiar form

    } catch (err) {
      setStatusMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const { ref, inView } = useInView({ threshold: 0.1 });

  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20">
      <div ref={ref} className={`max-w-2xl w-full z-10 ${inView ? revealed : hidden}`}>
        <Heading level={2} className='text-5xl font-lato font-bold mb-8 bg-gradient-to-r from-camelot-500 to-camelot-950 bg-clip-text text-transparent text-center'  variant='primary'>
          {t('contact.title')}
        </Heading>        
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
          <p className="text-lg text-gray-300 mb-8 text-center">
           {t('contact.description')}
          </p>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-300 mb-2">{t('contact.form.name')}</label>
              <input 
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-gray-100 focus:border-camelot-500 focus:outline-none transition-colors"
                placeholder={t('contact.form.namePlaceholder')}
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">{t('contact.form.email')}</label>
              <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-gray-100 focus:border-camelot-500 focus:outline-none transition-colors"
                placeholder={t('contact.form.emailPlaceholder')}
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">{t('contact.form.message')}</label>
              <textarea 
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-gray-100 focus:border-camelot-500 focus:outline-none transition-colors resize-none"
                placeholder={t('contact.form.messagePlaceholder')}
              />
            </div>
            {statusMessage && (
              <div className={`p-4 rounded-lg text-center font-medium ${
                statusMessage.type === 'success' 
                  ? 'bg-green-500/20 text-green-300' 
                  : 'bg-red-500/20 text-red-300'
              }`}>
                {statusMessage.text}
              </div>
            )}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full px-8 py-3 bg-gradient-to-r from-purple-700 to-camelot-800 rounded-lg font-medium hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('contact.form.sending') || 'Sending...' : t('contact.form.submit')}
            </button>
          </form>
          <div className="flex justify-center gap-6 mt-8 pt-8 border-t border-slate-700">
            <a target="_blank" href={contactData.github} className="p-3 bg-slate-700 hover:bg-camelot-700 rounded-lg transition-colors">
              <Github size={24} />
            </a>
            <a target="_blank" href={contactData.linkedin} className="p-3 bg-slate-700 hover:bg-camelot-700 rounded-lg transition-colors">
              <Linkedin size={24} />
            </a>
            <a target="_blank" href={contactData.instagram} className="p-3 bg-slate-700 hover:bg-camelot-700 rounded-lg transition-colors">
              <Instagram size={24} />
            </a>
            <a target="_blank" href={contactData.behance} className="p-3 bg-slate-700 hover:bg-camelot-700 rounded-lg transition-colors">
              <Mail size={24} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillsRevealWrapper({ children }: { children: React.ReactNode }) {
  const { ref, inView } = useInView({ threshold: 0.05 });
  return (
    <div ref={ref} className={inView ? revealed : hidden}>
      {children}
    </div>
  );
}

// Componente Principal
export default function Portfolio() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionType>(SECTIONS.home);

  const sectionRefs = {
    home: useRef<HTMLDivElement>(null),
    about: useRef<HTMLDivElement>(null),
    projects: useRef<HTMLDivElement>(null),
    skills: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null),
  };

  useScrollDetection({ 
    sectionRefs, 
    setActiveSection 
  });

  const scrollToSection = (sectionKey: keyof typeof sectionRefs) => {
    sectionRefs[sectionKey].current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
    setSidebarOpen(false);
    setActiveSection(sectionKey);
  };

  return (
    <div data-theme={'dark'} className="min-h-screen w-screen text-white overflow-x-hidden">

      <InteractiveBackground3D />

      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen}
        onNavigate={scrollToSection}
      />


      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-3 left-3 md:top-6 md:left-6 z-30 w-15 h-15 md:w-18 md:h-18 mx-auto rounded-full bg-gradient-to-br from-camelot-950 to-camelot-500 p-1 cursor-pointer" 
      >
        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-5xl font-lato">
          <img className='rounded-full' src={mayintLogo} alt="May Interactive Logo" />
        </div>
      </button>

      {/* Contenido principal */}
      <main className="pointer-events-none">         
        <div ref={sectionRefs.home} className="pointer-events-auto z-10">
          <HomeSection />
        </div>
        
        <div ref={sectionRefs.about} className="pointer-events-auto z-10">
          <AboutSection />
        </div>
        
        <div ref={sectionRefs.projects} className="pointer-events-auto z-10">
          <ProjectsSection />
        </div>
        
        <div ref={sectionRefs.skills} className="pointer-events-auto z-10">
          <SkillsRevealWrapper>
            <SkillsTabPanel {...toolsAndExprience} />
          </SkillsRevealWrapper>
        </div>
        
        <div ref={sectionRefs.contact} className="pointer-events-auto">
          <ContactSection />
        </div>
      </main>

      {/* Indicador de sección */}
      <div className="fixed right-1 sm:right-6 top-1/2 -translate-y-1/2 z-30 space-y-1 sm:space-y-3 hidden sm:block">
      {SECTIONS_ARRAY.map((section) => (
        <button
          key={section}
          onClick={() => scrollToSection(section)}
          className={`block w-3 h-3 rounded-full transition-all duration-300 ${
            activeSection === section 
              ? 'bg-camelot-700 scale-150' 
              : 'bg-slate-600 hover:bg-slate-500'
          }`}
          title={section}
          aria-label={`Go to ${section} section`}
        />
      ))}
      </div> 
    </div>
  );
}