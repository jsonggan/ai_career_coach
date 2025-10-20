interface AIHelpSectionProps {
  type: 'certificates' | 'courses' | 'projects';
  isVisible: boolean;
}

const helpContent = {
  certificates: {
    title: "Writing Great Certificate Descriptions:",
    tips: [
      { label: "Be specific:", example: "\"AWS Certified Solutions Architect - Professional\" instead of \"AWS Certificate\"" },
      { label: "Include skills:", example: "List relevant technical skills like \"Cloud Architecture, AWS Services, Security\"" },
      { label: "Add context:", example: "\"Validates expertise in designing distributed systems on AWS\"" },
      { label: "Mention impact:", example: "\"Enables me to design scalable cloud solutions for enterprise clients\"" }
    ]
  },
  courses: {
    title: "Writing Great Course Descriptions:",
    tips: [
      { label: "Include platform:", example: "\"Coursera\", \"edX\", \"Udemy\", \"LinkedIn Learning\"" },
      { label: "Mention duration:", example: "\"12-week course\", \"40 hours of content\"" },
      { label: "Describe learning:", example: "\"Comprehensive course covering React, Redux, and modern JavaScript\"" },
      { label: "Add outcomes:", example: "\"Built 5 projects including a full-stack e-commerce application\"" }
    ]
  },
  projects: {
    title: "Writing Great Project Descriptions:",
    tips: [
      { label: "Include project type:", example: "\"Web Application\", \"Mobile App\", \"Data Analysis\", \"Machine Learning\"" },
      { label: "List technologies:", example: "\"React, Node.js, MongoDB, AWS\"" },
      { label: "Describe the problem:", example: "\"Built to solve inventory management challenges for small businesses\"" },
      { label: "Highlight impact:", example: "\"Reduced manual tracking time by 70% and improved accuracy\"" },
      { label: "Add links:", example: "Include GitHub, live demo, or portfolio links when available" }
    ]
  }
};

export default function AIHelpSection({ type, isVisible }: AIHelpSectionProps) {
  if (!isVisible) return null;

  const content = helpContent[type];

  return (
    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="text-lg">🤖</div>
        <div>
          <h4 className="font-medium text-gray-900 mb-2">{content.title}</h4>
          <ul className="text-gray-700 text-sm space-y-1">
            {content.tips.map((tip, index) => (
              <li key={index}>
                • <strong>{tip.label}</strong> {tip.example}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
