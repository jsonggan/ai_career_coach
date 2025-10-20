import { useState } from 'react';
import { UserProject } from '@/db/portfolio';
import Modal from './modal';
import ProjectForm from './project-form';
import AIHelpSection from './ai-help-section';

interface ProjectSectionProps {
  projects: UserProject[];
  onAddProject: (data: any) => Promise<void>;
  onDeleteProject: (projectId: number) => Promise<void>;
  isLoading?: boolean;
}

export default function ProjectSection({ 
  projects, 
  onAddProject, 
  onDeleteProject, 
  isLoading = false 
}: ProjectSectionProps) {
  const [showModal, setShowModal] = useState(false);
  const [showAIHelp, setShowAIHelp] = useState(false);

  const handleSubmit = async (data: any) => {
    await onAddProject(data);
    setShowModal(false);
  };

  const handleDelete = async (projectId: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await onDeleteProject(projectId);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAIHelp(!showAIHelp)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showAIHelp ? "Hide Help" : "Get Help"}
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            disabled={isLoading}
          >
            + Add Project
          </button>
        </div>
      </div>

      <AIHelpSection type="projects" isVisible={showAIHelp} />

      {projects.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">💻</div>
          <p>No projects added yet. Click "Add Project" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div key={project.project_id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{project.project_title}</h3>
                <button
                  onClick={() => handleDelete(project.project_id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                  disabled={isLoading}
                >
                  Delete
                </button>
              </div>
              {project.project_type && (
                <p className="text-sm text-gray-600 mb-2">Type: {project.project_type}</p>
              )}
              {project.project_date && (
                <p className="text-sm text-gray-500 mb-2">Date: {project.project_date ? new Date(project.project_date).toLocaleDateString() : 'N/A'}</p>
              )}
              {project.project_desc && (
                <p className="text-sm text-gray-700 mb-2">{project.project_desc}</p>
              )}
              {project.project_link && (
                <a 
                  href={project.project_link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:text-blue-800 text-sm block mb-2"
                >
                  View Project →
                </a>
              )}
              <div className="mt-2">
                {project.technologies && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-500 mb-1">Technologies:</p>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.split(',').map((tech, index) => (
                        <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {project.skills && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {project.skills.split(',').map((skill, index) => (
                        <span key={index} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-2 flex gap-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {project.difficulty_level}
                </span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  {project.estimated_time}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Project">
        <ProjectForm
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
          isLoading={isLoading}
        />
      </Modal>
    </div>
  );
}
