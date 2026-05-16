import React, { useState } from 'react';
import { Wrench, Star, Gem } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Milestone, SkillCategory, TabPanelProps, ToolsCategory } from 'Interfaces/projects';
import { Heading } from 'HtmlComponents/headings';

type TabType = 'milestones' | 'skills' | 'tools';

// Tabs Content Components
function MilestonesTab({ milestones }: { milestones: Milestone[] }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {milestones.map((milestone, index) => (
        <div key={milestone.id} className="relative">
          {/* Línea conectora */}
          {index !== milestones.length - 1 && (
            <div className="absolute left-4 h-full top-8 w-1 bg-gradient-to-b from-camelot-800 to-camelot-600 opacity-50"></div>
          )}

          <div className="flex gap-4">
            {/* Punto de la línea */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-camelot-700 to-camelot-800 flex items-center justify-center border-4 border-white shadow-lg">
              </div>
            </div>

            {/* Contenido */}
            <a href={milestone.link ?? '#'} target="_blank" className="bg-white/50 backdrop-blur-sm border border-gray-300/50 hover:border-camelot-800/50 rounded-xl p-5 flex-1 transition-all duration-300 hover:bg-white/70">
              <Heading level={4} >
                {milestone.title} {milestone.place && `• ${milestone.place}`} <span className="text-sm font-semibold text-camelot-800">• {milestone.year}</span>
              </Heading>
              <p className="text-gray-700 text-sm">
                {milestone.description}
              </p>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

function SkillsTab({ skills }: { skills: SkillCategory[] }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {skills.map((category) => (
        <div key={category.category}>
          <Heading level={3} className='mb-5 mt-8 flex gap-2 items-center'>          
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-camelot-700 to-camelot-800 hidden sm:block"></span>
            {category.category}
          </Heading>
          <div className="flex flex-wrap gap-3">
            {category.items.map((skill) => (
              <div
                key={skill}
                className="px-4 py-2 bg-camelot-800/20 hover:bg-camelot-800/40 border border-camelot-800/30 hover:border-camelot-800/50 rounded-full text-sm font-medium text-gray-900 transition-all duration-300 cursor-default hover:scale-105"
              >
                {skill}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}


function ToolsTab({ tools }: { tools: ToolsCategory[] }) {
  //Imprimamelo como skills tambien, si al caso separado por items

  return (
    <div className="space-y-6 animate-fadeIn">
      {tools.map(({category, items}) => (
        <div key={category}>
          <Heading level={3} className='mb-5 mt-8 text-center'>{category}</Heading>
          <div className="flex flex-wrap gap-3 justify-center">
            {items.map((tool) => (
              <div
                key={tool}
                className="px-4 py-2 bg-camelot-800/20 hover:bg-camelot-800/40 border border-camelot-800/30 hover:border-camelot-800/50 rounded-full text-sm font-medium text-gray-900 transition-all duration-300 cursor-default hover:scale-105"
              >
                {tool}
              </div>              
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}


// Main Component
export default function SkillsTabPanel({
  milestones = [],
  skills = [],
  tools = []
}: Partial<TabPanelProps> = {}) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('tools');

  const tabConfig = [
    { id: 'milestones', label: t('skills.tabs.milestones'), icon: <Gem size={18} /> },
    { id: 'skills', label: t('skills.tabs.skills'), icon: <Star size={18} /> },
    { id: 'tools', label: t('skills.tabs.tools'), icon: <Wrench size={18} /> },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20">
      <div className="max-w-4xl w-full z-10">
        <Heading level={2} className='text-5xl font-lato font-bold mb-8 bg-gradient-to-r from-camelot-500 to-camelot-950 bg-clip-text text-transparent text-center'  variant='primary'>
          {t('skills.heading')}
        </Heading>
        {/* Tab Navigation */}
        <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl mb-8 p-1 overflow-x-auto shadow-lg">
          <div className="flex gap-1">
            {tabConfig.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 relative group ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {/* Background animado solo cuando está activo */}
                {activeTab === tab.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-camelot-700 to-camelot-800 rounded-xl -z-10"></div>
                )}
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/40 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 shadow-lg">
          {activeTab === 'milestones' && <MilestonesTab milestones={milestones} />}
          {activeTab === 'skills' && <SkillsTab skills={skills} />}
          {activeTab === 'tools' && <ToolsTab tools={tools} />}
        </div>
      </div>

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </section>
  );
}
