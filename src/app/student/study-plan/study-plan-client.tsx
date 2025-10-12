"use client";

import { useState, useEffect } from "react";

// Define types for the study plan data
interface Course {
  courseCode: string;
  courseName: string;
  description: string;
  credits: number;
  level: number;
  prerequisites: string[];
  term: string;
  year: number;
  category: string;
  department: string;
}

interface UserCourse {
  courseCode: string;
  term: string;
  year: number;
  status: string;
  grade: string | null;
}

interface StudyPlanClientProps {
  coursesData: Course[];
  userCourseHistory: UserCourse[];
}

interface StudyItem {
  id: string;
  title: string;
  type: 'course' | 'certification' | 'project' | 'online-course' | 'custom';
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedHours: number;
  weeklyHours?: number;
  deadline?: string;
  category: string;
  prerequisites?: string[];
  provider?: string; // For online courses and certifications
  url?: string; // For online courses
  price?: string; // For paid courses/certs
  level?: string; // Beginner, Intermediate, Advanced
}

interface OnlineCourse {
  id: string;
  title: string;
  provider: string;
  description: string;
  estimatedHours: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  url: string;
  price: string;
  rating?: number;
}

interface Certification {
  id: string;
  title: string;
  provider: string;
  description: string;
  estimatedHours: number;
  level: 'Associate' | 'Professional' | 'Expert';
  category: string;
  examFee: string;
  validityPeriod: string;
  prerequisites?: string[];
}

interface CustomStudyItem {
  title: string;
  description: string;
  totalHours: number;
  weeklyHours: number;
  category: string;
  priority: 'high' | 'medium' | 'low';
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function StudyPlanClient({ coursesData, userCourseHistory }: StudyPlanClientProps) {
  // State management
  const [currentCourses, setCurrentCourses] = useState<Course[]>([]);
  const [completedCourses, setCompletedCourses] = useState<Course[]>([]);
  const [suggestedItems, setSuggestedItems] = useState<StudyItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [showChatbot, setShowChatbot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'recommended' | 'university' | 'online' | 'certifications' | 'custom'>('recommended');
  
  // Custom form state
  const [customForm, setCustomForm] = useState<CustomStudyItem>({
    title: '',
    description: '',
    totalHours: 0,
    weeklyHours: 0,
    category: 'Personal Development',
    priority: 'medium'
  });

  // Online Courses Data
  const onlineCourses: OnlineCourse[] = [
    {
      id: 'coursera-ml',
      title: 'Machine Learning Specialization',
      provider: 'Coursera (Stanford)',
      description: 'Comprehensive machine learning course by Andrew Ng covering supervised learning, unsupervised learning, and best practices',
      estimatedHours: 60,
      level: 'Intermediate',
      category: 'Artificial Intelligence',
      url: 'https://coursera.org/specializations/machine-learning',
      price: '$49/month',
      rating: 4.9
    },
    {
      id: 'udacity-react',
      title: 'React Nanodegree',
      provider: 'Udacity',
      description: 'Learn to build performant, accessible, and maintainable React applications',
      estimatedHours: 80,
      level: 'Intermediate',
      category: 'Web Development',
      url: 'https://udacity.com/course/react-nanodegree',
      price: '$399/month',
      rating: 4.7
    },
    {
      id: 'edx-algorithms',
      title: 'Introduction to Algorithms',
      provider: 'edX (MIT)',
      description: 'Rigorous introduction to algorithms and data structures from MIT',
      estimatedHours: 120,
      level: 'Advanced',
      category: 'Computer Science',
      url: 'https://edx.org/course/introduction-to-algorithms',
      price: 'Free (Verified: $99)',
      rating: 4.8
    },
    {
      id: 'pluralsight-cloud',
      title: 'AWS Cloud Architecture',
      provider: 'Pluralsight',
      description: 'Learn to design and implement scalable cloud solutions on AWS',
      estimatedHours: 45,
      level: 'Intermediate',
      category: 'Cloud Computing',
      url: 'https://pluralsight.com/paths/aws-cloud-architecture',
      price: '$29/month',
      rating: 4.6
    },
    {
      id: 'linkedin-python',
      title: 'Python Essential Training',
      provider: 'LinkedIn Learning',
      description: 'Master Python fundamentals and advanced concepts',
      estimatedHours: 30,
      level: 'Beginner',
      category: 'Programming',
      url: 'https://linkedin.com/learning/python-essential-training',
      price: '$29.99/month',
      rating: 4.5
    },
    {
      id: 'udemy-blockchain',
      title: 'Complete Blockchain Development',
      provider: 'Udemy',
      description: 'Build decentralized applications and smart contracts',
      estimatedHours: 50,
      level: 'Intermediate',
      category: 'Blockchain',
      url: 'https://udemy.com/course/blockchain-development',
      price: '$89.99',
      rating: 4.4
    }
  ];

  // Certifications Data
  const certifications: Certification[] = [
    {
      id: 'aws-solutions-architect',
      title: 'AWS Certified Solutions Architect',
      provider: 'Amazon Web Services',
      description: 'Validates expertise in designing distributed applications and systems on AWS',
      estimatedHours: 60,
      level: 'Associate',
      category: 'Cloud Computing',
      examFee: '$150',
      validityPeriod: '3 years',
      prerequisites: ['Basic AWS knowledge', '1+ years hands-on experience']
    },
    {
      id: 'google-data-engineer',
      title: 'Google Cloud Professional Data Engineer',
      provider: 'Google Cloud',
      description: 'Demonstrates ability to design, build, and manage data processing systems',
      estimatedHours: 80,
      level: 'Professional',
      category: 'Data Engineering',
      examFee: '$200',
      validityPeriod: '2 years',
      prerequisites: ['3+ years industry experience', 'GCP fundamentals']
    },
    {
      id: 'cissp',
      title: 'Certified Information Systems Security Professional',
      provider: 'ISC2',
      description: 'Advanced cybersecurity certification for security professionals',
      estimatedHours: 120,
      level: 'Expert',
      category: 'Cybersecurity',
      examFee: '$749',
      validityPeriod: '3 years',
      prerequisites: ['5 years security experience', 'Bachelor degree or equivalent']
    },
    {
      id: 'pmp',
      title: 'Project Management Professional',
      provider: 'PMI',
      description: 'Global standard for project management excellence',
      estimatedHours: 100,
      level: 'Professional',
      category: 'Project Management',
      examFee: '$555',
      validityPeriod: '3 years',
      prerequisites: ['Bachelor degree + 3 years PM experience', '35 hours PM education']
    },
    {
      id: 'tensorflow-developer',
      title: 'TensorFlow Developer Certificate',
      provider: 'TensorFlow',
      description: 'Demonstrates proficiency in using TensorFlow for machine learning',
      estimatedHours: 40,
      level: 'Associate',
      category: 'Machine Learning',
      examFee: '$100',
      validityPeriod: '3 years',
      prerequisites: ['Python programming', 'Basic ML knowledge']
    },
    {
      id: 'oracle-java',
      title: 'Oracle Certified Professional Java SE',
      provider: 'Oracle',
      description: 'Validates advanced Java programming skills',
      estimatedHours: 60,
      level: 'Professional',
      category: 'Programming',
      examFee: '$245',
      validityPeriod: 'Lifetime',
      prerequisites: ['Java Associate certification', '2+ years Java experience']
    }
  ];

  // Initialize data on component mount
  useEffect(() => {
    // Get current in-progress courses
    const current = userCourseHistory
      .filter(uc => uc.status === 'IN_PROGRESS')
      .map(uc => {
        const courseDetails = coursesData.find(c => c.courseCode === uc.courseCode);
        return courseDetails ? { ...courseDetails, ...uc } : null;
      })
      .filter(Boolean) as Course[];

    // Get completed courses
    const completed = userCourseHistory
      .filter(uc => uc.status === 'COMPLETED')
      .map(uc => {
        const courseDetails = coursesData.find(c => c.courseCode === uc.courseCode);
        return courseDetails ? { ...courseDetails, ...uc } : null;
      })
      .filter(Boolean) as Course[];

    setCurrentCourses(current);
    setCompletedCourses(completed);

    // Generate suggested study items
    generateSuggestions(completed, current);

    // Add initial chatbot message
    setChatMessages([{
      id: '1',
      text: "Hi! I'm your study planning assistant. I can help you create a realistic timeline for your academic goals. What would you like to achieve this semester?",
      sender: 'bot',
      timestamp: new Date()
    }]);
  }, [coursesData, userCourseHistory]);

  const generateSuggestions = (completed: Course[], current: Course[]) => {
    const completedCodes = completed.map(c => c.courseCode);
    const currentCodes = current.map(c => c.courseCode);
    const takenCodes = [...completedCodes, ...currentCodes];

    // Get available next courses based on prerequisites
    const availableCourses = coursesData.filter(course => {
      if (takenCodes.includes(course.courseCode)) return false;
      
      // Check if prerequisites are met
      if (course.prerequisites.length === 0) return true;
      return course.prerequisites.every(prereq => completedCodes.includes(prereq));
    });

    // Create suggested study items
    const suggestions: StudyItem[] = [];

    // Add top recommended courses
    availableCourses.slice(0, 6).forEach((course, index) => {
      suggestions.push({
        id: `course-${course.courseCode}`,
        title: `${course.courseCode}: ${course.courseName}`,
        type: 'course',
        description: course.description,
        priority: course.category === 'Core' ? 'high' : course.category === 'Specialization' ? 'medium' : 'low',
        estimatedHours: course.credits * 10, // Rough estimate: 10 hours per credit
        category: course.category,
        prerequisites: course.prerequisites
      });
    });

    // Add certification suggestions based on completed courses
    const aiCourses = completed.filter(c => c.courseName.toLowerCase().includes('machine learning') || c.courseName.toLowerCase().includes('artificial intelligence'));
    const securityCourses = completed.filter(c => c.courseName.toLowerCase().includes('security') || c.courseName.toLowerCase().includes('network'));
    const webCourses = completed.filter(c => c.courseName.toLowerCase().includes('software') || c.courseName.toLowerCase().includes('web'));

    if (aiCourses.length > 0) {
      suggestions.push({
        id: 'cert-ml-aws',
        title: 'AWS Machine Learning Specialty Certification',
        type: 'certification',
        description: 'Industry-recognized certification for ML engineers and data scientists',
        priority: 'high',
        estimatedHours: 40,
        category: 'Professional Development'
      });
    }

    if (securityCourses.length > 0) {
      suggestions.push({
        id: 'cert-cissp',
        title: 'CompTIA Security+ Certification',
        type: 'certification',
        description: 'Essential cybersecurity certification for security professionals',
        priority: 'high',
        estimatedHours: 60,
        category: 'Professional Development'
      });
    }

    if (webCourses.length > 0 || completed.some(c => c.courseName.toLowerCase().includes('programming'))) {
      suggestions.push({
        id: 'project-portfolio',
        title: 'Personal Portfolio Website',
        type: 'project',
        description: 'Build a professional portfolio showcasing your projects and skills',
        priority: 'medium',
        estimatedHours: 30,
        category: 'Portfolio Development'
      });
    }

    // Add general skill development suggestions
    suggestions.push(
      {
        id: 'cert-cloud-aws',
        title: 'AWS Cloud Practitioner Certification',
        type: 'certification',
        description: 'Foundation-level cloud computing certification',
        priority: 'medium',
        estimatedHours: 25,
        category: 'Cloud Computing'
      },
      {
        id: 'project-open-source',
        title: 'Contribute to Open Source Project',
        type: 'project',
        description: 'Make meaningful contributions to open source software',
        priority: 'medium',
        estimatedHours: 20,
        category: 'Professional Development'
      },
      {
        id: 'cert-data-google',
        title: 'Google Data Analytics Certificate',
        type: 'certification',
        description: 'Learn data analysis skills with hands-on projects',
        priority: 'low',
        estimatedHours: 50,
        category: 'Data Analytics'
      }
    );

    setSuggestedItems(suggestions);
  };

  const handleItemSelection = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const handleCustomFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customForm.title.trim() || !customForm.description.trim() || customForm.totalHours <= 0) {
      alert('Please fill in all required fields');
      return;
    }

    const customItem: StudyItem = {
      id: `custom-${Date.now()}`,
      title: customForm.title,
      type: 'custom',
      description: customForm.description,
      priority: customForm.priority,
      estimatedHours: customForm.totalHours,
      weeklyHours: customForm.weeklyHours,
      category: customForm.category
    };

    setSuggestedItems(prev => [...prev, customItem]);
    setCustomForm({
      title: '',
      description: '',
      totalHours: 0,
      weeklyHours: 0,
      category: 'Personal Development',
      priority: 'medium'
    });
    setActiveTab('recommended');
    alert('Custom study item added successfully!');
  };

  const handleCustomFormChange = (field: keyof CustomStudyItem, value: string | number) => {
    setCustomForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: chatInput,
      sender: 'user',
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setLoading(true);

    // Simulate AI response (in real implementation, this would call an AI service)
    setTimeout(() => {
      const botResponse = generateBotResponse(chatInput, selectedItems, suggestedItems);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botMessage]);
      setLoading(false);
    }, 1000);
  };

  const generateBotResponse = (userInput: string, selected: string[], suggestions: StudyItem[]): string => {
    const selectedItemsDetails = suggestions.filter(item => selected.includes(item.id));
    const totalHours = selectedItemsDetails.reduce((sum, item) => sum + item.estimatedHours, 0);

    if (userInput.toLowerCase().includes('timeline') || userInput.toLowerCase().includes('schedule')) {
      if (selectedItemsDetails.length === 0) {
        return "I'd be happy to help create a timeline! First, please select some courses, certifications, or projects from the suggestions above that you're interested in pursuing.";
      }

      const weeks = Math.ceil(totalHours / 10); // Assuming 10 hours per week
      return `Based on your selected items (${selectedItemsDetails.length} total, ~${totalHours} hours), here's a realistic timeline:

**Recommended Schedule (${weeks} weeks):**
${selectedItemsDetails.map((item, index) => {
        const weekStart = Math.floor((index * totalHours / selectedItemsDetails.length) / 10) + 1;
        const weekEnd = Math.floor(((index + 1) * totalHours / selectedItemsDetails.length) / 10);
        return `• Week ${weekStart}-${weekEnd}: ${item.title} (${item.estimatedHours}h)`;
      }).join('\n')}

**Tips for success:**
- Dedicate 8-12 hours per week to studying
- Take breaks between intensive courses
- Focus on high-priority items first
- Track your progress regularly

Would you like me to generate calendar events for these milestones?`;
    }

    if (userInput.toLowerCase().includes('difficult') || userInput.toLowerCase().includes('hard')) {
      return "I understand that balancing studies can be challenging! Here are some strategies:\n\n• Start with high-priority items that align with your career goals\n• Break large tasks into smaller, manageable chunks\n• Use the Pomodoro technique (25-min study sessions)\n• Join study groups or online communities\n• Don't hesitate to ask for help from instructors or peers\n\nWhat specific aspect are you finding most challenging?";
    }

    if (userInput.toLowerCase().includes('career') || userInput.toLowerCase().includes('job')) {
      return "Great question! Based on your course history, I can see some potential career paths:\n\n• **Software Engineer**: Focus on software construction and algorithms courses\n• **Data Scientist**: Emphasize statistics, machine learning, and data analytics\n• **Cybersecurity Specialist**: Prioritize security and network courses\n• **Product Manager**: Combine technical skills with business knowledge\n\nWhich career path interests you most? I can suggest a more targeted study plan!";
    }

    // Default response
    return "That's a great point! Let me help you with that. Can you tell me more about your specific goals or what you'd like to focus on? I can provide more targeted advice based on your current progress and interests.";
  };

  const generateCalendarLink = (item: StudyItem, deadline: Date) => {
    const startDate = new Date();
    const endDate = new Date(deadline);
    
    // Format dates for Google Calendar (YYYYMMDDTHHMMSSZ)
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `Study Plan: ${item.title}`,
      dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
      details: `${item.description}\n\nEstimated Time: ${item.estimatedHours} hours\nPriority: ${item.priority}\nCategory: ${item.category}`,
      location: 'Online'
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course': return '📚';
      case 'certification': return '🏆';
      case 'project': return '💻';
      case 'online-course': return '🌐';
      case 'custom': return '✏️';
      default: return '📋';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'recommended':
        return renderRecommendedItems();
      case 'university':
        return renderUniversityCourses();
      case 'online':
        return renderOnlineCourses();
      case 'certifications':
        return renderCertifications();
      case 'custom':
        return renderCustomForm();
      default:
        return renderRecommendedItems();
    }
  };

  const renderRecommendedItems = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {suggestedItems.map(item => {
        const isSelected = selectedItems.includes(item.id);
        return (
          <div
            key={item.id}
            onClick={() => handleItemSelection(item.id)}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              isSelected
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getTypeIcon(item.type)}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                    {item.priority} priority
                  </span>
                </div>
              </div>
              {isSelected && <div className="text-blue-500">✓</div>}
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{item.description}</p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{item.category}</span>
              <span>{item.estimatedHours} hours</span>
            </div>
            
            {item.prerequisites && item.prerequisites.length > 0 && (
              <div className="mt-2 text-xs text-gray-500">
                Prerequisites: {item.prerequisites.join(', ')}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderUniversityCourses = () => {
    const completedCodes = completedCourses.map(c => c.courseCode);
    const currentCodes = currentCourses.map(c => c.courseCode);
    const takenCodes = [...completedCodes, ...currentCodes];

    return (
      <div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">All University Courses</h3>
          <p className="text-gray-600">Complete catalog of SUTD Computer Science and Design program courses</p>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {coursesData.map(course => {
            const isTaken = takenCodes.includes(course.courseCode);
            const canEnroll = !isTaken && (course.prerequisites.length === 0 || 
              course.prerequisites.every(prereq => completedCodes.includes(prereq)));
            const isSelected = selectedItems.includes(`uni-${course.courseCode}`);

            return (
              <div
                key={course.courseCode}
                onClick={() => canEnroll && !isTaken ? handleItemSelection(`uni-${course.courseCode}`) : null}
                className={`border-2 rounded-lg p-4 transition-all ${
                  isTaken 
                    ? 'border-gray-100 bg-gray-50 opacity-60' 
                    : isSelected
                    ? 'border-blue-500 bg-blue-50 cursor-pointer'
                    : canEnroll
                    ? 'border-gray-200 hover:border-gray-300 cursor-pointer'
                    : 'border-gray-100 bg-gray-50 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl">📚</span>
                      <h4 className="font-semibold text-gray-900">{course.courseCode}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.category === 'Core' ? 'bg-red-100 text-red-800' :
                        course.category === 'Specialization' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {course.category}
                      </span>
                      <span className="text-xs text-gray-500">{course.credits} credits</span>
                    </div>
                    <h5 className="font-medium text-gray-800 mb-1">{course.courseName}</h5>
                    <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{course.term} {course.year}</span>
                      <span>Level: {course.level}</span>
                    </div>
                    
                    {course.prerequisites.length > 0 && (
                      <div className="mt-2 text-xs text-gray-500">
                        <span className="font-medium">Prerequisites: </span>
                        {course.prerequisites.join(', ')}
                        {!canEnroll && !isTaken && (
                          <span className="text-red-500 ml-2">⚠️ Missing prerequisites</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-center gap-2 ml-4">
                    {isTaken && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        completedCodes.includes(course.courseCode) 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {completedCodes.includes(course.courseCode) ? 'Completed' : 'Enrolled'}
                      </span>
                    )}
                    {isSelected && canEnroll && !isTaken && (
                      <div className="text-blue-500">✓</div>
                    )}
                    {!canEnroll && !isTaken && (
                      <div className="text-red-500">🔒</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderOnlineCourses = () => (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Online Courses</h3>
        <p className="text-gray-600">Popular online courses from top platforms to enhance your skills</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {onlineCourses.map(course => {
          const isSelected = selectedItems.includes(`online-${course.id}`);
          return (
            <div
              key={course.id}
              onClick={() => handleItemSelection(`online-${course.id}`)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌐</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{course.title}</h3>
                    <p className="text-sm text-blue-600 font-medium">{course.provider}</p>
                  </div>
                </div>
                {isSelected && <div className="text-blue-500">✓</div>}
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{course.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Level:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                    course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {course.level}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{course.category}</span>
                  <span>{course.estimatedHours} hours</span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Price:</span>
                  <span className="font-medium text-green-600">{course.price}</span>
                </div>
                
                {course.rating && (
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-gray-500">Rating:</span>
                    <span className="text-yellow-600">★ {course.rating}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-3 pt-3 border-t">
                <a
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Course →
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderCertifications = () => (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Certifications</h3>
        <p className="text-gray-600">Industry-recognized certifications to validate your expertise</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certifications.map(cert => {
          const isSelected = selectedItems.includes(`cert-${cert.id}`);
          return (
            <div
              key={cert.id}
              onClick={() => handleItemSelection(`cert-${cert.id}`)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{cert.title}</h3>
                    <p className="text-sm text-purple-600 font-medium">{cert.provider}</p>
                  </div>
                </div>
                {isSelected && <div className="text-blue-500">✓</div>}
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{cert.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Level:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    cert.level === 'Associate' ? 'bg-green-100 text-green-800' :
                    cert.level === 'Professional' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {cert.level}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{cert.category}</span>
                  <span>{cert.estimatedHours} hours</span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Exam Fee:</span>
                  <span className="font-medium text-orange-600">{cert.examFee}</span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Valid for:</span>
                  <span className="font-medium">{cert.validityPeriod}</span>
                </div>
              </div>
              
              {cert.prerequisites && cert.prerequisites.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Prerequisites: </span>
                    {cert.prerequisites.join(', ')}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderCustomForm = () => (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Custom Study Item</h3>
        <p className="text-gray-600">Create your own study goals, books, research projects, or any learning activity</p>
      </div>
      
      <div className="max-w-2xl">
        <form onSubmit={handleCustomFormSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={customForm.title}
              onChange={(e) => handleCustomFormChange('title', e.target.value)}
              placeholder="e.g., Read 'Clean Code' by Robert Martin"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={customForm.description}
              onChange={(e) => handleCustomFormChange('description', e.target.value)}
              placeholder="Describe what you'll learn or accomplish..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Hours *
              </label>
              <input
                type="number"
                value={customForm.totalHours || ''}
                onChange={(e) => handleCustomFormChange('totalHours', parseInt(e.target.value) || 0)}
                placeholder="0"
                min="1"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weekly Hours
              </label>
              <input
                type="number"
                value={customForm.weeklyHours || ''}
                onChange={(e) => handleCustomFormChange('weeklyHours', parseInt(e.target.value) || 0)}
                placeholder="0"
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={customForm.category}
                onChange={(e) => handleCustomFormChange('category', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Personal Development">Personal Development</option>
                <option value="Technical Skills">Technical Skills</option>
                <option value="Research">Research</option>
                <option value="Reading">Reading</option>
                <option value="Project">Project</option>
                <option value="Language Learning">Language Learning</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={customForm.priority}
                onChange={(e) => handleCustomFormChange('priority', e.target.value as 'high' | 'medium' | 'low')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('recommended')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Add to Study Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Study Plan</h1>
          <p className="text-lg text-gray-600">
            Plan and organize your study schedule to maximize your learning efficiency and achieve your academic goals.
          </p>
        </div>

        {/* Current Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Courses</h3>
            <div className="text-3xl font-bold text-blue-600 mb-2">{currentCourses.length}</div>
            <div className="space-y-2">
              {currentCourses.slice(0, 3).map(course => (
                <div key={course.courseCode} className="text-sm text-gray-600">
                  {course.courseCode}: {course.courseName}
                </div>
              ))}
              {currentCourses.length > 3 && (
                <div className="text-sm text-gray-500">+{currentCourses.length - 3} more</div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Completed Courses</h3>
            <div className="text-3xl font-bold text-green-600 mb-2">{completedCourses.length}</div>
            <div className="text-sm text-gray-600">
              Total Credits: {completedCourses.reduce((sum, course) => sum + course.credits, 0)}
            </div>
            <div className="text-sm text-gray-600">
              Average Grade: {completedCourses.filter(c => c.grade)
                .map(c => c.grade?.charAt(0))
                .join(', ') || 'N/A'}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Selected Items</h3>
            <div className="text-3xl font-bold text-purple-600 mb-2">{selectedItems.length}</div>
            <div className="text-sm text-gray-600">
              Est. Study Time: {suggestedItems
                .filter(item => selectedItems.includes(item.id))
                .reduce((sum, item) => sum + item.estimatedHours, 0)} hours
            </div>
          </div>
        </div>

        {/* Suggested Items with Tabs */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Study Options</h2>
            <div className="text-sm text-gray-600">
              Select items to add to your study plan
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'recommended', label: 'Recommended', icon: '⭐' },
                { id: 'university', label: 'University Courses', icon: '🏛️' },
                { id: 'online', label: 'Online Courses', icon: '🌐' },
                { id: 'certifications', label: 'Certifications', icon: '🏆' },
                { id: 'custom', label: 'Custom', icon: '✏️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {renderTabContent()}

          {selectedItems.length > 0 && (
            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Calendar Events</h3>
              <p className="text-gray-600 mb-4">
                Add your selected study items to Google Calendar with realistic deadlines.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedItems.map((itemId, index) => {
                  // Find the item from various sources
                  let item: StudyItem | undefined;
                  
                  if (itemId.startsWith('uni-')) {
                    const courseCode = itemId.replace('uni-', '');
                    const course = coursesData.find(c => c.courseCode === courseCode);
                    if (course) {
                      item = {
                        id: itemId,
                        title: `${course.courseCode}: ${course.courseName}`,
                        type: 'course',
                        description: course.description,
                        priority: course.category === 'Core' ? 'high' : 'medium',
                        estimatedHours: course.credits * 10,
                        category: course.category
                      };
                    }
                  } else if (itemId.startsWith('online-')) {
                    const onlineCourseId = itemId.replace('online-', '');
                    const onlineCourse = onlineCourses.find(c => c.id === onlineCourseId);
                    if (onlineCourse) {
                      item = {
                        id: itemId,
                        title: onlineCourse.title,
                        type: 'online-course',
                        description: onlineCourse.description,
                        priority: 'medium',
                        estimatedHours: onlineCourse.estimatedHours,
                        category: onlineCourse.category,
                        provider: onlineCourse.provider
                      };
                    }
                  } else if (itemId.startsWith('cert-')) {
                    const certId = itemId.replace('cert-', '');
                    const cert = certifications.find(c => c.id === certId);
                    if (cert) {
                      item = {
                        id: itemId,
                        title: cert.title,
                        type: 'certification',
                        description: cert.description,
                        priority: 'high',
                        estimatedHours: cert.estimatedHours,
                        category: cert.category,
                        provider: cert.provider
                      };
                    }
                  } else {
                    // Regular suggested items or custom items
                    item = suggestedItems.find(i => i.id === itemId);
                  }

                  if (!item) return null;

                  const deadline = new Date();
                  deadline.setDate(deadline.getDate() + (index + 1) * 14); // 2 weeks apart
                  
                  return (
                    <div key={itemId} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 flex items-center gap-2">
                          <span>{getTypeIcon(item.type)}</span>
                          {item.title}
                        </h4>
                        <span className="text-xs text-gray-500">
                          Due: {deadline.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{item.estimatedHours} hours</p>
                      {item.weeklyHours && (
                        <p className="text-sm text-gray-600 mb-1">{item.weeklyHours} hours/week</p>
                      )}
                      {item.provider && (
                        <p className="text-sm text-blue-600 mb-3">{item.provider}</p>
                      )}
                      <a
                        href={generateCalendarLink(item, deadline)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        <span>📅</span>
                        Add to Google Calendar
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Study Timeline Chatbot */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Study Timeline Assistant</h2>
            <button
              onClick={() => setShowChatbot(!showChatbot)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {showChatbot ? 'Hide Assistant' : 'Get Timeline Help'}
            </button>
          </div>

          {showChatbot && (
            <div className="border rounded-lg">
              <div className="h-80 overflow-y-auto p-4 bg-gray-50">
                {chatMessages.map(message => (
                  <div
                    key={message.id}
                    className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-900 border'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-white text-gray-900 border max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <form onSubmit={handleChatSubmit} className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about timelines, study strategies, or career advice..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={loading || !chatInput.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
