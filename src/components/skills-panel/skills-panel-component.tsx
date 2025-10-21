import React, { useState } from 'react';
import { ChevronDown, Award, Clock, Wrench, Star } from 'lucide-react';
import type { TimelineEvent, SkillCategory, TabPanelProps, ToolsCategory } from 'Interfaces/projects';
import { Badge } from 'HtmlComponents/badge';
import { Heading } from 'HtmlComponents/headings';

type TabType = /*'achievements'*/ | 'timeline' | 'skills' | 'tools';

// Tabs Content Components
// function AchievementsTab({ achievements }: { achievements: Achievement[] }) {
//   return (
//     <div className="space-y-4 animate-fadeIn">
//       {achievements.map((achievement) => (
//         <div
//           key={achievement.id}
//           className="group relative bg-white/50 backdrop-blur-sm border border-gray-300/50 hover:border-camelot-800/50 rounded-xl p-5 transition-all duration-300 hover:bg-white/70"
//         >
//           <div className="flex items-start gap-4">
//             <div className="flex-shrink-0 mt-1">
//               <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-camelot-700 to-camelot-800">
//                 <Award size={20} className="text-white" />
//               </div>
//             </div>
//             <div className="flex-1">
//               <h3 className="text-lg font-bold text-gray-900 mb-1">
//                 {achievement.title} <span className="text-sm font-semibold text-camelot-800">• {achievement.year}</span>
//               </h3>
//               <p className="text-gray-700 text-sm leading-relaxed">
//                 {achievement.description}
//               </p>
//             </div>
//           </div>
//           <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-camelot-800 to-transparent rounded-r-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//         </div>
//       ))}
//     </div>
//   );
// }


function TimelineTab({ timeline }: { timeline: TimelineEvent[] }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {timeline.map((event, index) => (
        <div key={event.id} className="relative">
          {/* Línea conectora */}
          {index !== timeline.length - 1 && (
            <div className="absolute left-4 h-full top-8 w-1 bg-gradient-to-b from-camelot-800 to-camelot-600 opacity-50"></div>
          )}
          
          <div className="flex gap-4">
            {/* Punto de la línea */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-camelot-700 to-camelot-800 flex items-center justify-center border-4 border-white shadow-lg">
              </div>
            </div>
            
            {/* Contenido */}
            <a href={event.link ?? '#'} target="_blank" className="bg-white/50 backdrop-blur-sm border border-gray-300/50 hover:border-camelot-800/50 rounded-xl p-5 flex-1 transition-all duration-300 hover:bg-white/70">
              <Heading level={4} >
                {event.title} {event.company && `• ${event.company}`} <span className="text-sm font-semibold text-camelot-800">• {event.year}</span>
              </Heading>
              <p className="text-gray-700 text-sm">
                {event.description}
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
  // achievements = [], 
  timeline = [], 
  skills = [], 
  tools = [] 
}: Partial<TabPanelProps> = {}) {
  const [activeTab, setActiveTab] = useState<TabType>('skills');

  const tabConfig = [
    // { id: 'achievements', label: 'Achievements', icon: <Award size={18} /> },
    { id: 'timeline', label: 'Timeline', icon: <Clock size={18} /> },
    { id: 'skills', label: 'Skills', icon: <Star size={18} /> },
    { id: 'tools', label: 'Tools', icon: <Wrench size={18} /> }
  ];

  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20">
      <div className="max-w-4xl w-full">
        <Heading level={2} className='text-5xl font-lato font-bold mb-8 bg-gradient-to-r from-camelot-500 to-camelot-950 bg-clip-text text-transparent text-center'  variant='primary'>
          Experience & Skills
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
          {/* {activeTab === 'achievements' && <AchievementsTab achievements={achievements} />} */}
          {activeTab === 'timeline' && <TimelineTab timeline={timeline} />}
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
