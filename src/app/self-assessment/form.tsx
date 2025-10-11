"use client";

import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { toast, ToastContainer } from "react-toastify";
import clsx from "clsx";
import "react-toastify/dist/ReactToastify.css";

// Custom Star Rating Component
interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  maxStars?: number;
  className?: string;
}

const StarRating = ({
  value,
  onChange,
  readonly = false,
  maxStars = 5,
  className,
}: StarRatingProps) => {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  const handleStarClick = (starValue: number) => {
    if (!readonly && onChange) {
      onChange(starValue);
    }
  };

  const handleMouseEnter = (starValue: number) => {
    if (!readonly) {
      setHoveredValue(starValue);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoveredValue(null);
    }
  };

  return (
    <div className={clsx("flex items-center gap-1", className)}>
      {Array.from({ length: maxStars }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= value;
        const isHovered = hoveredValue !== null && starValue <= hoveredValue;
        const shouldFill = isFilled || isHovered;

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleStarClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
            className={clsx(
              "w-12 h-12 transition-colors duration-200",
              !readonly && "cursor-pointer",
              readonly && "cursor-default"
            )}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-full h-full"
              fill={shouldFill ? "#fbbf24" : "none"}
              stroke={shouldFill ? "#fbbf24" : "#bcbfc4"}
              strokeWidth="1.1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
};

// Simple filled stars for display only
const FilledStars = ({ count }: { count: number }) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: count }, (_, index) => (
        <svg key={index} viewBox="0 0 24 24" className="w-5 h-5" fill="#fbbf24">
          <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
            clipRule="evenodd"
          />
        </svg>
      ))}
    </div>
  );
};

export interface SelfAssessmentFormData {
  employeeName: string;
  appraisalCycle: string;
  jobRole: string;
  goalsAchieved: string;
  keyStrengths: string;
  areasForImprovement: string;
  selfRating: number;
  additionalComments: string;
}

interface UserData {
  userId: string;
  name: string;
  jobRole: string;
  systemRole: string;
  rank: string | null;
}

interface SelfAssessmentFormProps {
  defaultValues?: Partial<SelfAssessmentFormData>;
  userData?: UserData | null;
}

export default function SelfAssessmentForm({
  defaultValues,
  userData,
}: SelfAssessmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<SelfAssessmentFormData>({
    defaultValues: {
      employeeName: userData?.name || "Edward Lim",
      appraisalCycle: "Mid-Year 2025",
      jobRole: userData?.jobRole || "Product Designer",
      goalsAchieved: "",
      keyStrengths: "",
      areasForImprovement: "",
      selfRating: 0,
      additionalComments: "",
      ...defaultValues,
    },
    mode: "onChange",
  });

  const watchedGoalsAchieved = watch("goalsAchieved");
  const watchedKeyStrengths = watch("keyStrengths");
  const watchedAreasForImprovement = watch("areasForImprovement");
  const watchedAdditionalComments = watch("additionalComments");
  const watchedSelfRating = watch("selfRating");

  const onSubmit = async (data: SelfAssessmentFormData) => {
    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Self-assessment data:", data);

      toast.success(
        "Self-assessment submitted successfully! Your supervisor will review it shortly.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } catch (error) {
      toast.error("Failed to submit self-assessment. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingDescription = (rating: number) => {
    const descriptions = {
      1: "Needs Improvement",
      2: "Below Expectations",
      3: "Meets Expectations",
      4: "Exceeds Expectations",
      5: "Outstanding Performance",
    };
    return descriptions[rating as keyof typeof descriptions] || "";
  };

  const addGoalSuggestion = () => {
    const suggestionText =
      'Enhanced Tactical Operations Capabilities: Successfully completed "Advanced Joint Operations Planning" course (85% progress), enabling me to lead more effective multi-service task force operations and collaborate more effectively with inter-service teams on complex tactical missions. Applied these skills to optimize operational planning processes, resulting in improved mission success rates and reduced operational risks.';
    const currentValue = watchedGoalsAchieved;
    setValue(
      "goalsAchieved",
      currentValue ? `${currentValue}\n\n${suggestionText}` : suggestionText
    );
  };

  return (
    <>
      <ToastContainer />

      {/* Main Form Card */}
      <Card className="shadow-2 border-none bg-white rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6">
          {/* Employee Information Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-black mb-1">
              Performance Self-Assessment
            </h2>
            <p className="text-gray-600 mb-8">
              Reflect on your performance and provide honest feedback about your
              achievements and growth areas
            </p>

            <div className="flex items-center gap-2 mb-4">
              <i className="pi pi-user text-gray-600" />
              <h3 className="text-lg font-semibold text-black m-0">
                Employee Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-1">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-900 mb-2">
                    Employee Name
                  </label>
                  <Controller
                    name="employeeName"
                    control={control}
                    render={({ field }) => (
                      <InputText
                        {...field}
                        readOnly
                        className="text-sm px-3 py-2 bg-gray-100 text-gray-900 border border-gray-300 rounded-md"
                      />
                    )}
                  />
                </div>
              </div>

              <div className="col-span-1">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-900 mb-2">
                    Appraisal Cycle
                  </label>
                  <Controller
                    name="appraisalCycle"
                    control={control}
                    render={({ field }) => (
                      <InputText
                        {...field}
                        readOnly
                        className="text-sm px-3 py-2 bg-gray-100 text-gray-900 border border-gray-300 rounded-md"
                      />
                    )}
                  />
                </div>
              </div>

              <div className="col-span-1">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-900 mb-2">
                    Job Role
                  </label>
                  <Controller
                    name="jobRole"
                    control={control}
                    render={({ field }) => (
                      <InputText
                        {...field}
                        readOnly
                        className="text-sm px-3 py-2 bg-gray-100 text-gray-900 border border-gray-300 rounded-md"
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          {/* Goals Achieved Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <i className="pi pi-flag text-gray-600" />
              <label className="text-lg font-semibold text-black m-0">
                Goals Achieved
              </label>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Describe the key mission objectives and operational goals you have
              accomplished during this assessment period.
            </p>

            {/* AI Goal Suggestions */}
            <div className="bg-gray-50 border border-green-200 rounded p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-green-600">AI</span>
                </div>
                <span className="text-sm font-medium text-green-900">
                  Achievement Suggestion
                </span>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                  Based on completed courses
                </span>
              </div>
              <p className="text-sm text-green-700 mb-3">
                Based on your recent course completion, here&apos;s a goal
                achievement you might want to include:
              </p>
              <div className="bg-white border border-green-200 rounded p-3 mb-3">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-green-400 rounded-full mt-1 shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm text-green-800 m-0">
                      <strong>
                        Enhanced Tactical Operations Capabilities:
                      </strong>{" "}
                      Successfully completed &quot;Advanced Joint Operations
                      Planning&quot; course (85% progress), enabling me to lead
                      more effective multi-service task force operations and
                      collaborate more effectively with inter-service teams on
                      complex tactical missions. Applied these skills to
                      optimize operational planning processes, resulting in
                      improved mission success rates and reduced operational
                      risks.
                    </p>
                    <Button
                      type="button"
                      text
                      className="p-0 mt-2"
                      label="Add to Goals Achieved"
                      onClick={addGoalSuggestion}
                      pt={{
                        label: {
                          className:
                            "text-xs text-green-600 font-medium underline",
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-green-200">
                <p className="text-xs text-green-600 m-0">
                  💡 Tip: This suggestion is based on your completed learning
                  activities. You can customize it or add your own achievements.
                </p>
              </div>
            </div>

            <Controller
              name="goalsAchieved"
              control={control}
              rules={{ required: "Please describe your achieved goals" }}
              render={({ field }) => (
                <div>
                  <textarea
                    {...field}
                    placeholder="List your major operational accomplishments, completed missions, and achieved objectives. Be specific about the impact and results of your defence work..."
                    rows={6}
                    className={clsx(
                      "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical",
                      errors.goalsAchieved &&
                        "border-red-500 focus:ring-red-500"
                    )}
                  />
                  {errors.goalsAchieved && (
                    <small className="text-red-500 text-sm">
                      {errors.goalsAchieved.message}
                    </small>
                  )}
                </div>
              )}
            />
            <div className="text-xs text-gray-600 mt-1">
              {watchedGoalsAchieved?.length || 0}/1000 characters
            </div>
          </div>

          <div className="border-t border-gray-200 my-6 w-full"></div>

          {/* Key Strengths Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <i className="pi pi-chart-line text-gray-600" />
              <label className="text-lg font-semibold text-black m-0">
                Key Strengths
              </label>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Identify your core strengths and skills that have contributed to
              your success in defence operations.
            </p>

            {/* AI Suggestions */}
            <div className="bg-gray-50 border border-blue-200 rounded p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">AI</span>
                </div>
                <span className="text-sm font-medium text-blue-900">
                  AI-Powered Suggestions
                </span>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  Based on your profile
                </span>
              </div>
              <p className="text-sm text-blue-700 mb-3">
                Based on your service record and operational history, here are
                some strengths you might want to consider:
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-blue-400 rounded-full mt-1 shrink-0"></div>
                  <p className="text-sm text-blue-800 m-0">
                    <strong>Operational Leadership:</strong> Led multiple joint
                    task force operations and mentored junior officers,
                    demonstrating strong leadership in tactical planning and
                    execution.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-blue-400 rounded-full mt-1 shrink-0"></div>
                  <p className="text-sm text-blue-800 m-0">
                    <strong>Inter-Service Coordination:</strong> Successfully
                    coordinated with Army, Navy, and Air Force units on 15+
                    joint operations over the past year.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-blue-400 rounded-full mt-1 shrink-0"></div>
                  <p className="text-sm text-blue-800 m-0">
                    <strong>Mission-Critical Decision Making:</strong>{" "}
                    Consistently delivered operational plans that improved
                    mission success rates by 25% based on after-action reviews.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-blue-400 rounded-full mt-1 shrink-0"></div>
                  <p className="text-sm text-blue-800 m-0">
                    <strong>Technical Proficiency:</strong> Proficient in
                    command and control systems, tactical planning tools, and
                    mission-critical software, with experience in joint
                    operations protocols.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-blue-200 mt-3">
                <p className="text-xs text-blue-600 m-0">
                  💡 Tip: You can use these suggestions as inspiration for your
                  self-assessment or add your own unique strengths.
                </p>
              </div>
            </div>

            <Controller
              name="keyStrengths"
              control={control}
              rules={{ required: "Please describe your key strengths" }}
              render={({ field }) => (
                <div>
                  <textarea
                    {...field}
                    placeholder="Highlight your strongest skills, competencies, and personal qualities in defence operations. Include examples of how these strengths have benefited your unit or missions..."
                    rows={6}
                    className={clsx(
                      "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical",
                      errors.keyStrengths && "border-red-500 focus:ring-red-500"
                    )}
                  />
                  {errors.keyStrengths && (
                    <small className="text-red-500 text-sm">
                      {errors.keyStrengths.message}
                    </small>
                  )}
                </div>
              )}
            />
            <div className="text-xs text-gray-600 mt-1">
              {watchedKeyStrengths?.length || 0}/1000 characters
            </div>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          {/* Areas for Improvement Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <i className="pi pi-exclamation-circle text-gray-600" />
              <label className="text-lg font-semibold text-black m-0">
                Areas for Improvement
              </label>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Reflect on areas where you would like to grow and develop further
              in your defence career.
            </p>

            {/* AI Course/Certification Suggestions */}
            <div className="bg-gray-50 border border-orange-200 rounded p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-orange-600">AI</span>
                </div>
                <span className="text-sm font-medium text-orange-900">
                  Development Recommendations
                </span>
                <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                  Based on your profile
                </span>
              </div>
              <p className="text-sm text-orange-700 mb-3">
                Based on your current role and career trajectory, here are some
                courses and certifications that could help you grow:
              </p>
              <div className="flex flex-col gap-3">
                <div className="bg-white border border-orange-200 rounded p-3">
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-orange-400 rounded-full mt-1 shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-orange-800 m-0 mb-1">
                        <strong>
                          Advanced Strategic Planning Certification:
                        </strong>{" "}
                        Enhance your strategic thinking capabilities for
                        higher-level command positions.
                      </p>
                      <div className="flex items-center gap-2 text-xs text-orange-600">
                        <span>📚 6-month program</span>
                        <span>•</span>
                        <span>🎯 Leadership track</span>
                        <span>•</span>
                        <span>⭐ 4.8/5 rating</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-orange-200 rounded p-3">
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-orange-400 rounded-full mt-1 shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-orange-800 m-0 mb-1">
                        <strong>Digital Warfare Operations Course:</strong>{" "}
                        Develop expertise in cyber defence and digital
                        operations for modern warfare.
                      </p>
                      <div className="flex items-center gap-2 text-xs text-orange-600">
                        <span>📚 3-month intensive</span>
                        <span>•</span>
                        <span>🎯 Technical track</span>
                        <span>•</span>
                        <span>⭐ 4.9/5 rating</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-orange-200 rounded p-3">
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-orange-400 rounded-full mt-1 shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-orange-800 m-0 mb-1">
                        <strong>
                          International Military Cooperation Certificate:
                        </strong>{" "}
                        Strengthen your ability to work with allied forces and
                        international partners.
                      </p>
                      <div className="flex items-center gap-2 text-xs text-orange-600">
                        <span>📚 4-month program</span>
                        <span>•</span>
                        <span>🎯 Diplomatic track</span>
                        <span>•</span>
                        <span>⭐ 4.7/5 rating</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-3 border-t border-orange-200 mt-3">
                <p className="text-xs text-orange-600 m-0">
                  💡 Tip: These recommendations are tailored to your current
                  role and career progression. Consider which areas align with
                  your development goals.
                </p>
              </div>
            </div>
            <Controller
              name="areasForImprovement"
              control={control}
              rules={{ required: "Please describe areas for improvement" }}
              render={({ field }) => (
                <div>
                  <textarea
                    {...field}
                    placeholder="Identify skills or areas where you see opportunities for growth in defence operations. Consider challenges you've faced and how you plan to address them..."
                    rows={6}
                    className={clsx(
                      "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical",
                      errors.areasForImprovement &&
                        "border-red-500 focus:ring-red-500"
                    )}
                  />
                  {errors.areasForImprovement && (
                    <small className="text-red-500 text-sm">
                      {errors.areasForImprovement.message}
                    </small>
                  )}
                </div>
              )}
            />
            <div className="text-xs text-gray-600 mt-1">
              {watchedAreasForImprovement?.length || 0}/1000 characters
            </div>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          {/* Self-Rating Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <i className="pi pi-star text-gray-600" />
              <label className="text-lg font-semibold text-black m-0">
                Overall Self-Rating
              </label>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Rate your overall performance during this review period on a scale
              of 1 to 5 stars.
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Controller
                  name="selfRating"
                  control={control}
                  rules={{
                    required: "Please provide a self-rating",
                    min: { value: 1, message: "Please select at least 1 star" },
                  }}
                  render={({ field }) => (
                    <StarRating
                      value={field.value}
                      onChange={field.onChange}
                      className={clsx(
                        errors.selfRating && "border-red-500 rounded p-1"
                      )}
                    />
                  )}
                />
                <span className="text-sm text-gray-600">
                  {watchedSelfRating > 0
                    ? `${watchedSelfRating} out of 5`
                    : "Select your rating"}
                </span>
              </div>

              {errors.selfRating && (
                <small className="p-error">{errors.selfRating.message}</small>
              )}

              {watchedSelfRating > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3 w-full">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-blue-800">
                      {getRatingDescription(watchedSelfRating)} - You&apos;ve
                      rated your performance as {watchedSelfRating} out of 5
                      stars.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Rating Scale Reference */}
            <div className="bg-gray-100 rounded p-4 mt-4">
              <h4 className="text-sm font-medium text-black mb-3 mt-0">
                Rating Scale Reference:
              </h4>
              <div className="flex flex-col gap-2">
                {[
                  { stars: 1, label: "Needs Improvement" },
                  { stars: 2, label: "Below Expectations" },
                  { stars: 3, label: "Meets Expectations" },
                  { stars: 4, label: "Exceeds Expectations" },
                  { stars: 5, label: "Outstanding Performance" },
                ].map(({ stars, label }) => (
                  <div key={stars} className="flex items-center gap-2">
                    <FilledStars count={stars} />
                    <span className="text-sm text-gray-900">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          {/* Additional Comments Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <i className="pi pi-comment text-gray-600" />
              <label className="text-lg font-semibold text-black m-0">
                Additional Comments
              </label>
              <span className="text-sm text-gray-600">(Optional)</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Share any additional thoughts, feedback, or context you&apos;d
              like your supervisor to know.
            </p>
            <Controller
              name="additionalComments"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  placeholder="Include any additional information, feedback about your role, unit dynamics, resources needed, or suggestions for improvement in defence operations..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                />
              )}
            />
            <div className="text-xs text-gray-600 mt-1">
              {watchedAdditionalComments?.length || 0}/500 characters
            </div>
          </div>

          {/* Submit Section */}
          <div className="bg-gray-100 rounded p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <p className="m-0 mb-1">
                  Please review your responses before submitting.
                </p>
                <p className="text-xs m-0">
                  This assessment will be shared with your supervisor for
                  review.
                </p>
              </div>
              <Button
                type="submit"
                label={
                  isSubmitting ? "Submitting..." : "Submit Self-Assessment"
                }
                className={clsx(
                  "px-4 py-2 rounded-md transition-colors duration-200",
                  !isValid || isSubmitting
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-[#2663EB] text-white cursor-pointer hover:bg-[#1d4ed8]"
                )}
                loading={isSubmitting}
                disabled={!isValid || isSubmitting}
                pt={{
                  loadingIcon: {
                    className: "mr-2",
                  },
                }}
              />
            </div>
          </div>
        </form>
      </Card>
    </>
  );
}
