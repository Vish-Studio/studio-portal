import React, { useState } from 'react';
import { ChevronDown, CheckCircle2, Circle, Clock, Briefcase } from 'lucide-react';

// Mock data for projects and their timelines
const PROJECTS = [
  {
    id: 'p1',
    name: 'Website Redesign',
    addedAt: '2026-06-15T10:00:00Z',
    phases: [
      { id: '1', title: 'Research & Discovery', status: 'completed', date: 'Jun 1 - 5' },
      { id: '2', title: 'Wireframing & UI Design', status: 'completed', date: 'Jun 6 - 12' },
      { id: '3', title: 'Frontend Development', status: 'in-progress', date: 'Jun 13 - 25' },
      { id: '4', title: 'Backend Integration', status: 'pending', date: 'Jun 26 - Jul 10' },
      { id: '5', title: 'Testing & QA', status: 'pending', date: 'Jul 11 - 15' },
      { id: '6', title: 'Deployment', status: 'pending', date: 'Jul 16' },
    ]
  },
  {
    id: 'p2',
    name: 'Mobile App MVP',
    addedAt: '2026-06-10T14:30:00Z',
    phases: [
      { id: '1', title: 'Requirements Gathering', status: 'completed', date: 'May 20 - 25' },
      { id: '2', title: 'System Architecture', status: 'completed', date: 'May 26 - Jun 2' },
      { id: '3', title: 'API', status: 'completed', date: 'Jun 3 - 15' },
      { id: '4', title: 'App Dev', status: 'in-progress', date: 'Jun 16 - Jul 20' },
      { id: '5', title: 'Beta Release', status: 'pending', date: 'Aug 1' },
    ]
  },
  {
    id: 'p3',
    name: 'Marketing Campaign',
    addedAt: '2026-06-05T09:15:00Z',
    phases: [
      { id: '1', title: 'Strategy Definition', status: 'completed', date: 'Jun 1 - 3' },
      { id: '2', title: 'Asset Creation', status: 'in-progress', date: 'Jun 4 - 20' },
      { id: '3', title: 'Ad Copywriting', status: 'in-progress', date: 'Jun 10 - 25' },
      { id: '4', title: 'Campaign Launch', status: 'pending', date: 'Jul 1' },
    ]
  }
];

const sortedProjects = [...PROJECTS].sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());

export default function ProjectTimeline() {
  const [selectedProjectId, setSelectedProjectId] = useState(sortedProjects[0].id);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedProject = sortedProjects.find(p => p.id === selectedProjectId) || sortedProjects[0];

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-[32px] p-6 sm:p-8 flex flex-col min-h-[300px]">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 relative">
        <div className="flex items-center gap-3 text-xl font-semibold text-gray-900">
          <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
            <Briefcase size={18} className="text-gray-700" />
          </div>
          Project Timeline
        </div>
        
        {/* Dropdown */}
        <div className="relative z-20 w-full sm:w-auto">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full sm:w-[260px] flex items-center justify-between px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-xl font-medium text-sm text-gray-800 transition-colors"
          >
            <span className="truncate pr-4">{selectedProject.name}</span>
            <ChevronDown size={16} className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-lg rounded-xl py-2 z-30">
              {sortedProjects.map(project => (
                <button
                  key={project.id}
                  onClick={() => {
                    setSelectedProjectId(project.id);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50 flex items-center justify-between
                    ${project.id === selectedProjectId ? 'text-[#121316] bg-gray-50/50' : 'text-gray-600'}`}
                >
                  <span className="truncate">{project.name}</span>
                  {project.id === selectedProjectId && <div className="w-2 h-2 rounded-full bg-[#E0FA72]"></div>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 w-full overflow-x-auto pb-6 custom-scrollbar">
        <div className="min-w-fit px-4">
          <div className="flex items-start">
            {selectedProject.phases.map((phase, index) => {
              const isCompleted = phase.status === 'completed';
              const isInProgress = phase.status === 'in-progress';
              const isPending = phase.status === 'pending';
              
              // Determine line status to the *next* element
              const nextPhase = selectedProject.phases[index + 1];
              let lineClass = "bg-gray-100";
              if (nextPhase) {
                  if (phase.status === 'completed' && (nextPhase.status === 'completed' || nextPhase.status === 'in-progress')) {
                      lineClass = "bg-[#E0FA72]";
                  }
              }

              return (
                <div key={phase.id} className="flex items-start relative">
                  
                  {/* The Node Block */}
                  <div className="flex flex-col items-center w-28 group relative z-10">
                    {/* Status Icon/Node */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 flex-shrink-0
                      ${isCompleted ? 'bg-[#121316] text-white' : 
                        isInProgress ? 'bg-[#E0FE8A] text-gray-900 border-[3px] border-white shadow-[0_0_0_2px_#E0FE8A]' : 
                        'bg-white text-gray-300 border-2 border-dashed border-gray-200'}`}
                    >
                      {isCompleted && <CheckCircle2 size={18} strokeWidth={2.5} />}
                      {isInProgress && <Clock size={18} strokeWidth={2.5} />}
                      {isPending && <Circle size={14} className="opacity-50 text-gray-300" strokeWidth={2.5} />}
                    </div>
                    
                    {/* Phase Info */}
                    <div className="text-center w-full">
                      <h4 className={`text-[13px] font-semibold mb-1 leading-tight break-words px-1
                        ${isCompleted ? 'text-gray-900' : 
                          isInProgress ? 'text-[#121316]' : 'text-gray-400'}`}>
                        {phase.title}
                      </h4>
                      <p className="text-[11px] font-medium text-gray-400">{phase.date}</p>
                    </div>
                  </div>

                  {/* Connective Line (don't render after the last item) */}
                  {index < selectedProject.phases.length - 1 && (
                    <div className={`h-[2px] w-12 sm:w-20 mt-5 flex-shrink-0 transition-colors duration-500 rounded-full ${lineClass}`} />
                  )}

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
