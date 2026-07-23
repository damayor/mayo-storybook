import React, { useState, useRef } from 'react';
import {
  X,
  Github,
  Linkedin,
  Mail,
  FileJson2,
  Terminal,
  RectangleGoggles,
  Instagram,
  ChevronDown,
} from 'lucide-react';
import { ImpressumModal } from './impressum-modal';
import { Footer } from './footer';
import mayintLogo from '/assets/mayint.svg';
import { useTranslation } from 'react-i18next';

import { Heading } from 'HtmlComponents/headings';
import { Card } from 'HtmlComponents/card';
import { getProjectsData, getMiniProjects } from '../../data/projects';
import { getMilestones, getSkills, tools } from '../../data/experience';
import type { Lang } from 'Interfaces/projects';
import SkillsTabPanel from '../../components/skills-panel/skills-panel-component';
import { contactData } from 'Data/contact';
import { type SectionType, SECTIONS, SECTIONS_ARRAY } from 'Interfaces/portfolio-sections';
import { useScrollDetection } from '../../hooks/useScrollDetection';
import { useInView } from 'react-intersection-observer';
import CameraPathBackground from '../../components/camera-path-background/CameraPathBackground';
import InteractiveBackground3D from '../../components/interactive-background-3d/InteractiveBackground3D';
import { MiniCard } from 'HtmlComponents/mini-card';
import { flags } from '../../config/flags';
import { SoftPanel } from '../../components/soft-panel/soft-panel-component';

function LanguageSelector() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: 'gb' },
    { code: 'de', name: 'Deutsch', flag: 'de' },
    { code: 'es', name: 'Español', flag: 'es' },
  ];

  const current = languages.find((l) => l.code === i18n.language) ?? languages[0];
  const others = languages.filter((l) => l.code !== i18n.language);

  return (
    <div className="fixed top-3 right-3 md:top-6 md:right-6 z-30">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-camelot-950 to-camelot-500 p-0.5 cursor-pointer"
        aria-label={`Language: ${current.name}`}
      >
        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
          <img src={`https://flagcdn.com/w40/${current.flag}.png`} width="26" alt={current.name} />
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 flex flex-col gap-1">
          {others.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                i18n.changeLanguage(lang.code);
                setOpen(false);
              }}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-900/80 backdrop-blur-sm border border-slate-700 hover:border-camelot-500 flex items-center justify-center transition-all duration-200 overflow-hidden cursor-pointer"
              aria-label={lang.name}
            >
              <img src={`https://flagcdn.com/w40/${lang.flag}.png`} width="26" alt={lang.name} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onNavigate: (section: SectionType) => void;
}

// Componente Sidebar
function Sidebar({ isOpen, setIsOpen, onNavigate }: SidebarProps) {
  const { t } = useTranslation();

  const sections = [
    { id: 'home' as const, label: t('nav.home') },
    { id: 'about' as const, label: t('nav.about') },
    { id: 'projects' as const, label: t('nav.projects') },
    { id: 'skills' as const, label: t('nav.skills') },
    { id: 'contact' as const, label: t('nav.contact') },
  ];

  const handleNavClick = (sectionId: SectionType) => {
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
            <div className="flex justify-center gap-4">
              <a
                target="_blank"
                href={contactData.github}
                className="p-2 bg-slate-700 hover:bg-camelot-700 rounded-lg transition-colors"
              >
                <Github size={20} />
              </a>
              <a
                target="_blank"
                href={contactData.linkedin}
                className="p-2 bg-slate-700 hover:bg-camelot-700 rounded-lg transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                target="_blank"
                href={contactData.instagram}
                className="p-2 bg-slate-700 hover:bg-camelot-700 rounded-lg transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="mailto:david@mayinteractive.io"
                className="p-2 bg-slate-700 hover:bg-camelot-700 rounded-lg transition-colors"
              >
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
        <SoftPanel className="px-8 py-12 sm:px-24 sm:py-16">
          <div className="mb-6">
            <div className="w-27 h-27 mx-auto mb-6 rounded-full bg-gradient-to-br from-camelot-950 to-camelot-500 p-1">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-5xl font-lato">
                <img className="rounded-full" src={mayintLogo} alt="May Interactive Logo" />
              </div>
            </div>
          </div>
          <Heading level={1} children={t('home.title')} variant="primary" />
          <hr className="h-px my-6 bg-camelot-900 border-0 dark:bg-gray-700" />
          <p className="text-2xl text-camelot-800 mb-8 uppercase tracking-widest">
            {t('home.brand')} • {t('home.role')}
          </p>
          <hr className="h-px my-6 bg-camelot-900 border-0 dark:bg-gray-700" />
        </SoftPanel>
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
      {/* Panel is intentionally wider than the text column: the mask fade lives
          in that extra margin instead of eating into line-start/line-end letters. */}
      <SoftPanel className="w-full max-w-7xl z-10 px-8 py-16 sm:px-16 sm:py-24">
        <div className="max-w-3xl mx-auto">
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
            <p
              className="text-lg text-gray-200 mb-6 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: t('about.intro') }}
            />
            <p
              className="text-lg text-gray-200 mb-6 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: t('about.experience') }}
            />

            {/* Tagline */}
            <p className="text-lm font-bold text-gray-100 mb-10 text-center leading-relaxed italic">
              {t('about.tagline')}
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
      </SoftPanel>
    </section>
  );
}

const BATCH_SIZE = 3;

function ProjectsSection({ lang }: { lang: Lang }) {
  const { t } = useTranslation();
  const projData = Object.values(getProjectsData(lang));
  const miniProjData = getMiniProjects(lang);
  const { ref: mainRef, inView: mainInView } = useInView({ threshold: 0.1 });
  const [visibleCount, setVisibleCount] = useState(0);
  const hasMore = visibleCount < miniProjData.length;

  const showMore = () => setVisibleCount((c) => Math.min(c + BATCH_SIZE, miniProjData.length));

  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20">
      <div className="max-w-6xl w-full z-10">
        <div ref={mainRef} className={mainInView ? revealed : hidden}>
          <div className="flex justify-center mb-12">
            <SoftPanel className="inline-block px-16 py-8 sm:px-24 sm:py-12">
              <Heading
                level={2}
                className="text-5xl font-lato font-bold bg-gradient-to-r from-camelot-500 to-camelot-800 bg-clip-text text-transparent text-center"
                variant="primary"
              >
                {t('projects.title')}
              </Heading>
            </SoftPanel>
          </div>
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

        <div className="max-w-7xl mx-auto py-16 sm:py-20">
          {visibleCount === 0 ? (
            <div className="flex justify-center pt-4">
              <SoftPanel className="inline-block px-8 py-8 sm:px-24 sm:py-12">
                <button
                  onClick={showMore}
                  className="flex flex-col items-center gap-2 text-gray-500 hover:text-camelot-400 transition-colors group"
                  aria-label={t('projects.otherProjects')}
                >
                  <span className="text-xs uppercase tracking-widest">
                    {t('projects.otherProjects')}
                  </span>
                  <ChevronDown size={28} className="animate-bounce group-hover:text-camelot-400" />
                </button>
              </SoftPanel>
            </div>
          ) : (
            <>
              <div className="flex justify-center mb-12">
                <SoftPanel className="inline-block px-16 py-8 sm:px-24 sm:py-12">
                  <Heading
                    level={2}
                    className="text-5xl font-lato font-bold bg-gradient-to-r from-camelot-500 to-camelot-800 bg-clip-text text-transparent text-center"
                    variant="primary"
                  >
                    {t('projects.otherProjects')}
                  </Heading>
                </SoftPanel>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {miniProjData.slice(0, visibleCount).map((project, index) => (
                  <MiniCard key={index} {...project} />
                ))}
              </div>
              {hasMore && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={showMore}
                    className="flex flex-col items-center gap-2 text-gray-500 hover:text-camelot-400 transition-colors group"
                    aria-label={t('projects.viewMore')}
                  >
                    <span className="text-xs uppercase tracking-widest">
                      {t('projects.viewMore')}
                    </span>
                    <ChevronDown
                      size={28}
                      className="animate-bounce group-hover:text-camelot-400"
                    />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

const CV_BY_LANG: Record<Lang, string> = {
  en: '/documents/CV.pdf',
  es: '/documents/HV.pdf',
  de: '/documents/LL.pdf',
};

function ContactSection({ lang }: { lang: Lang }) {
  const { t } = useTranslation();
  const { ref, inView } = useInView({ threshold: 0.1 });

  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20">
      <div ref={ref} className={`max-w-2xl w-full z-10 ${inView ? revealed : hidden}`}>
        <SoftPanel className="p-10 flex flex-col items-center gap-8">
          <p className="text-xl text-gray-300 text-center leading-relaxed">{t('contact.cta')}</p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:justify-center">
            <a
              href="https://calendly.com/may-interactive"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-8 py-4 bg-gradient-to-r from-camelot-700 to-camelot-800 rounded-xl font-semibold text-center hover:scale-105 transition-transform shadow-lg"
            >
              {t('contact.calendly')}
            </a>
            <a
              href={CV_BY_LANG[lang]}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-8 py-4 rounded-xl font-semibold text-center border-2 border-camelot-700 text-camelot-400 hover:bg-camelot-700/20 hover:scale-105 transition-all"
            >
              {t('contact.cv')}
            </a>
          </div>

          <div className="flex justify-center gap-6 pt-6 border-t border-slate-700 w-full">
            <a
              target="_blank"
              href={contactData.github}
              className="p-3 bg-slate-700 hover:bg-camelot-700 rounded-lg transition-colors"
            >
              <Github size={24} />
            </a>
            <a
              target="_blank"
              href={contactData.linkedin}
              className="p-3 bg-slate-700 hover:bg-camelot-700 rounded-lg transition-colors"
            >
              <Linkedin size={24} />
            </a>
            <a
              target="_blank"
              href={contactData.instagram}
              className="p-3 bg-slate-700 hover:bg-camelot-700 rounded-lg transition-colors"
            >
              <Instagram size={24} />
            </a>
            <a
              href="mailto:david@mayinteractive.io"
              className="p-3 bg-slate-700 hover:bg-camelot-700 rounded-lg transition-colors"
            >
              <Mail size={24} />
            </a>
          </div>
        </SoftPanel>
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
  const { i18n } = useTranslation();
  const lang = (i18n.language as Lang) ?? 'en';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionType>(SECTIONS.home);
  const [impressumOpen, setImpressumOpen] = useState(false);

  const sectionRefs = {
    home: useRef<HTMLDivElement>(null),
    about: useRef<HTMLDivElement>(null),
    projects: useRef<HTMLDivElement>(null),
    skills: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null),
  };

  useScrollDetection({
    sectionRefs,
    setActiveSection,
  });

  const scrollToSection = (sectionKey: keyof typeof sectionRefs) => {
    sectionRefs[sectionKey].current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    setSidebarOpen(false);
    setActiveSection(sectionKey);
  };

  return (
    <div data-theme={'dark'} className="min-h-screen w-screen text-white overflow-x-hidden">
      {flags.USE_CAMERA_PATH_BG ? <CameraPathBackground /> : <InteractiveBackground3D />}

      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} onNavigate={scrollToSection} />

      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-3 left-3 md:top-6 md:left-6 z-30 w-15 h-15 md:w-18 md:h-18 mx-auto rounded-full bg-gradient-to-br from-camelot-950 to-camelot-500 p-1 cursor-pointer"
      >
        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-5xl font-lato">
          <img className="rounded-full" src={mayintLogo} alt="May Interactive Logo" />
        </div>
      </button>

      <LanguageSelector />

      {/* Contenido principal */}
      <main className="pointer-events-none">
        <div ref={sectionRefs.home} className="pointer-events-auto z-10">
          <HomeSection />
        </div>

        <div ref={sectionRefs.about} className="pointer-events-auto z-10">
          <AboutSection />
        </div>

        <div ref={sectionRefs.projects} className="pointer-events-auto z-10">
          <ProjectsSection lang={lang} />
        </div>

        <div ref={sectionRefs.skills} className="pointer-events-auto z-10">
          <SkillsRevealWrapper>
            <SkillsTabPanel
              milestones={getMilestones(lang)}
              skills={getSkills(lang)}
              tools={tools}
            />
          </SkillsRevealWrapper>
        </div>

        <div ref={sectionRefs.contact} className="pointer-events-auto">
          <ContactSection lang={lang} />
        </div>

        <div className="pointer-events-auto">
          <Footer onImpressumOpen={() => setImpressumOpen(true)} />
        </div>
      </main>

      <ImpressumModal isOpen={impressumOpen} onClose={() => setImpressumOpen(false)} />

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
