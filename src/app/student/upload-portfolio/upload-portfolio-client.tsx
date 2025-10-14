"use client";

import { useState } from "react";

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
}

interface Course {
  id: string;
  name: string;
  platform: string;
  duration: string;
  description: string;
  skills: string[];
  completionDate: string;
}

interface Project {
  id: string;
  name: string;
  type: string;
  description: string;
  technologies: string[];
  skills: string[];
  date: string;
  link?: string;
}

export default function UploadPortfolioClient() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  
  const [showAIHelp, setShowAIHelp] = useState<string>("");

  // Certificate form state
  const [certForm, setCertForm] = useState({
    name: "",
    issuer: "",
    issueDate: "",
    expiryDate: ""
  });

  // Course form state
  const [courseForm, setCourseForm] = useState({
    name: "",
    platform: "",
    duration: "",
    description: "",
    skills: "",
    completionDate: ""
  });

  // Project form state
  const [projectForm, setProjectForm] = useState({
    name: "",
    type: "",
    description: "",
    technologies: "",
    skills: "",
    date: "",
    link: ""
  });

  const handleAddCertificate = () => {
    if (certForm.name && certForm.issuer && certForm.issueDate) {
      const newCert: Certificate = {
        id: Date.now().toString(),
        name: certForm.name,
        issuer: certForm.issuer,
        issueDate: certForm.issueDate,
        expiryDate: certForm.expiryDate
      };
      setCertificates([...certificates, newCert]);
      setCertForm({ name: "", issuer: "", issueDate: "", expiryDate: "" });
      setShowCertificateModal(false);
    }
  };

  const handleAddCourse = () => {
    if (courseForm.name && courseForm.platform && courseForm.completionDate) {
      const newCourse: Course = {
        id: Date.now().toString(),
        name: courseForm.name,
        platform: courseForm.platform,
        duration: courseForm.duration,
        description: courseForm.description,
        skills: courseForm.skills.split(',').map(s => s.trim()).filter(s => s),
        completionDate: courseForm.completionDate
      };
      setCourses([...courses, newCourse]);
      setCourseForm({ name: "", platform: "", duration: "", description: "", skills: "", completionDate: "" });
      setShowCourseModal(false);
    }
  };

  const handleAddProject = () => {
    if (projectForm.name && projectForm.type && projectForm.date) {
      const newProject: Project = {
        id: Date.now().toString(),
        name: projectForm.name,
        type: projectForm.type,
        description: projectForm.description,
        technologies: projectForm.technologies.split(',').map(s => s.trim()).filter(s => s),
        skills: projectForm.skills.split(',').map(s => s.trim()).filter(s => s),
        date: projectForm.date,
        link: projectForm.link
      };
      setProjects([...projects, newProject]);
      setProjectForm({ name: "", type: "", description: "", technologies: "", skills: "", date: "", link: "" });
      setShowProjectModal(false);
    }
  };

  const deleteItem = (type: 'certificate' | 'course' | 'project', id: string) => {
    if (type === 'certificate') {
      setCertificates(certificates.filter(c => c.id !== id));
    } else if (type === 'course') {
      setCourses(courses.filter(c => c.id !== id));
    } else if (type === 'project') {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload Portfolio</h1>
          <p className="text-lg text-gray-600 mb-4">
            Upload your certificates, courses, and projects to showcase your academic achievements and skills.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-lg">🤖</div>
              <div>
                <h3 className="font-medium text-blue-900 mb-1">AI Integration Notice</h3>
                <p className="text-blue-700 text-sm">
                  All the information you add here will be analyzed by our AI system to automatically update your 
                  <strong> Skill Competency</strong> tracking and customize your <strong>Study Plan</strong>. 
                  The AI will identify skills, suggest learning paths, and recommend relevant courses based on your portfolio.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Certificates Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Certificates</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAIHelp(showAIHelp === "certificates" ? "" : "certificates")}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {showAIHelp === "certificates" ? "Hide AI Help" : "Get AI Help"}
              </button>
              <button
                onClick={() => setShowCertificateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                + Add Certificate
              </button>
            </div>
          </div>

          {showAIHelp === "certificates" && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="text-lg">🤖</div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">AI Assistant - Writing Great Certificate Descriptions:</h4>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• <strong>Be specific:</strong> &quot;AWS Certified Solutions Architect - Professional&quot; instead of &quot;AWS Certificate&quot;</li>
                    <li>• <strong>Include skills:</strong> List relevant technical skills like &quot;Cloud Architecture, AWS Services, Security&quot;</li>
                    <li>• <strong>Add context:</strong> &quot;Validates expertise in designing distributed systems on AWS&quot;</li>
                    <li>• <strong>Mention impact:</strong> &quot;Enables me to design scalable cloud solutions for enterprise clients&quot;</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {certificates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🏆</div>
              <p>No certificates added yet. Click &quot;Add Certificate&quot; to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.map((cert) => (
                <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                    <button
                      onClick={() => deleteItem('certificate', cert.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Issued by: {cert.issuer}</p>
                  <p className="text-sm text-gray-500 mb-2">Issue Date: {cert.issueDate}</p>
                  {cert.expiryDate && <p className="text-sm text-gray-500 mb-2">Expiry Date: {cert.expiryDate}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Courses Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">External Courses</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAIHelp(showAIHelp === "courses" ? "" : "courses")}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {showAIHelp === "courses" ? "Hide AI Help" : "Get AI Help"}
              </button>
              <button
                onClick={() => setShowCourseModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                + Add Course
              </button>
            </div>
          </div>

          {showAIHelp === "courses" && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="text-lg">🤖</div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">AI Assistant - Writing Great Course Descriptions:</h4>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• <strong>Include platform:</strong> &quot;Coursera&quot;, &quot;edX&quot;, &quot;Udemy&quot;, &quot;LinkedIn Learning&quot;</li>
                    <li>• <strong>Mention duration:</strong> &quot;12-week course&quot;, &quot;40 hours of content&quot;</li>
                    <li>• <strong>Describe learning:</strong> &quot;Comprehensive course covering React, Redux, and modern JavaScript&quot;</li>
                    <li>• <strong>Add outcomes:</strong> &quot;Built 5 projects including a full-stack e-commerce application&quot;</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {courses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📚</div>
              <p>No courses added yet. Click &quot;Add Course&quot; to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course) => (
                <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{course.name}</h3>
                    <button
                      onClick={() => deleteItem('course', course.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Platform: {course.platform}</p>
                  <p className="text-sm text-gray-500 mb-2">Completed: {course.completionDate}</p>
                  {course.duration && <p className="text-sm text-gray-500 mb-2">Duration: {course.duration}</p>}
                  {course.description && <p className="text-sm text-gray-700 mb-2">{course.description}</p>}
                  {course.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {course.skills.map((skill, index) => (
                        <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAIHelp(showAIHelp === "projects" ? "" : "projects")}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {showAIHelp === "projects" ? "Hide AI Help" : "Get AI Help"}
              </button>
              <button
                onClick={() => setShowProjectModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                + Add Project
              </button>
            </div>
          </div>

          {showAIHelp === "projects" && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="text-lg">🤖</div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">AI Assistant - Writing Great Project Descriptions:</h4>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• <strong>Include project type:</strong> &quot;Web Application&quot;, &quot;Mobile App&quot;, &quot;Data Analysis&quot;, &quot;Machine Learning&quot;</li>
                    <li>• <strong>List technologies:</strong> &quot;React, Node.js, MongoDB, AWS&quot;</li>
                    <li>• <strong>Describe the problem:</strong> &quot;Built to solve inventory management challenges for small businesses&quot;</li>
                    <li>• <strong>Highlight impact:</strong> &quot;Reduced manual tracking time by 70% and improved accuracy&quot;</li>
                    <li>• <strong>Add links:</strong> Include GitHub, live demo, or portfolio links when available</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {projects.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">💻</div>
              <p>No projects added yet. Click &quot;Add Project&quot; to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{project.name}</h3>
                    <button
                      onClick={() => deleteItem('project', project.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Type: {project.type}</p>
                  <p className="text-sm text-gray-500 mb-2">Date: {project.date}</p>
                  {project.description && <p className="text-sm text-gray-700 mb-2">{project.description}</p>}
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
                      View Project →
                    </a>
                  )}
                  <div className="mt-2">
                    {project.technologies.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs text-gray-500 mb-1">Technologies:</p>
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.map((tech, index) => (
                            <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {project.skills.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {project.skills.map((skill, index) => (
                            <span key={index} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Certificate Modal */}
        <Modal isOpen={showCertificateModal} onClose={() => setShowCertificateModal(false)} title="Add Certificate">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Name *</label>
              <input
                type="text"
                value={certForm.name}
                onChange={(e) => setCertForm({...certForm, name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., AWS Certified Solutions Architect"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization *</label>
              <input
                type="text"
                value={certForm.issuer}
                onChange={(e) => setCertForm({...certForm, issuer: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Amazon Web Services"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date *</label>
              <input
                type="date"
                value={certForm.issueDate}
                onChange={(e) => setCertForm({...certForm, issueDate: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
              <input
                type="date"
                value={certForm.expiryDate}
                onChange={(e) => setCertForm({...certForm, expiryDate: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowCertificateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCertificate}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                Add Certificate
              </button>
            </div>
          </div>
        </Modal>

        {/* Course Modal */}
        <Modal isOpen={showCourseModal} onClose={() => setShowCourseModal(false)} title="Add Course">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Name *</label>
              <input
                type="text"
                value={courseForm.name}
                onChange={(e) => setCourseForm({...courseForm, name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Complete React Developer Course"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Platform *</label>
              <input
                type="text"
                value={courseForm.platform}
                onChange={(e) => setCourseForm({...courseForm, platform: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Udemy, Coursera, edX"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input
                  type="text"
                  value={courseForm.duration}
                  onChange={(e) => setCourseForm({...courseForm, duration: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 40 hours, 12 weeks"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Completion Date *</label>
                <input
                  type="date"
                  value={courseForm.completionDate}
                  onChange={(e) => setCourseForm({...courseForm, completionDate: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={courseForm.description}
                onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Describe what you learned and any projects you completed..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma-separated)</label>
              <input
                type="text"
                value={courseForm.skills}
                onChange={(e) => setCourseForm({...courseForm, skills: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., React, JavaScript, Web Development"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowCourseModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCourse}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
              >
                Add Course
              </button>
            </div>
          </div>
        </Modal>

        {/* Project Modal */}
        <Modal isOpen={showProjectModal} onClose={() => setShowProjectModal(false)} title="Add Project">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
              <input
                type="text"
                value={projectForm.name}
                onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., E-commerce Web Application"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Type *</label>
              <select
                value={projectForm.type}
                onChange={(e) => setProjectForm({...projectForm, type: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select project type</option>
                <option value="Web Application">Web Application</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Data Analysis">Data Analysis</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Desktop Application">Desktop Application</option>
                <option value="Game">Game</option>
                <option value="Research Project">Research Project</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Completion Date *</label>
              <input
                type="date"
                value={projectForm.date}
                onChange={(e) => setProjectForm({...projectForm, date: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={projectForm.description}
                onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Describe the project, problem it solves, and your role..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Technologies (comma-separated)</label>
              <input
                type="text"
                value={projectForm.technologies}
                onChange={(e) => setProjectForm({...projectForm, technologies: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., React, Node.js, MongoDB, AWS"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma-separated)</label>
              <input
                type="text"
                value={projectForm.skills}
                onChange={(e) => setProjectForm({...projectForm, skills: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Full-stack Development, Database Design, API Integration"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Link (optional)</label>
              <input
                type="url"
                value={projectForm.link}
                onChange={(e) => setProjectForm({...projectForm, link: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://github.com/username/project or https://project-demo.com"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowProjectModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProject}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
              >
                Add Project
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

