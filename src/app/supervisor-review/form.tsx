"use client";

import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { toast, ToastContainer } from "react-toastify";
import clsx from "clsx";
import "react-toastify/dist/ReactToastify.css";

// Custom Star Rating Component (same as self-assessment)
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

export interface ManagerEvaluationFormData {
  personnelName: string;
  defenceRole: string;
  assessmentCycle: string;
  overallRating: number;
  goalsComment: string;
  strengthsComment: string;
  improvementSuggestions: string;
  finalComments: string;
}

interface ManagerEvaluationFormProps {
  defaultValues?: Partial<ManagerEvaluationFormData>;
  onSuccess?: () => void;
}

export default function ManagerEvaluationForm({
  defaultValues,
  onSuccess,
}: ManagerEvaluationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<ManagerEvaluationFormData>({
    defaultValues: {
      personnelName: "COL Edward Lim",
      defenceRole: "Joint Task Force Commander",
      assessmentCycle: "Mid-Year 2025",
      overallRating: 0,
      goalsComment: "",
      strengthsComment: "",
      improvementSuggestions: "",
      finalComments: "",
      ...defaultValues,
    },
    mode: "onChange",
  });

  const watchedGoalsComment = watch("goalsComment");
  const watchedStrengthsComment = watch("strengthsComment");
  const watchedImprovementSuggestions = watch("improvementSuggestions");
  const watchedFinalComments = watch("finalComments");
  const watchedOverallRating = watch("overallRating");

  const onSubmit = async (data: ManagerEvaluationFormData) => {
    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Manager evaluation data:", data);

      toast.success(
        "Personnel evaluation submitted successfully! The personnel will be notified.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

      // Call the success callback to return to dashboard
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to submit evaluation. Please try again.", {
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

  return (
    <>
      <ToastContainer />

      {/* Main Form Card */}
      <Card className="shadow-2 border-none bg-white rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-black mb-8">
              Defence Personnel Performance Evaluation
            </h2>

            <div className="flex items-center gap-2 mb-4">
              <i className="pi pi-user text-gray-600" />
              <h3 className="text-lg font-semibold text-black m-0">
                Personnel Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-1">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-900 mb-2">
                    Personnel Name
                  </label>
                  <Controller
                    name="personnelName"
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
                    Defence Role
                  </label>
                  <Controller
                    name="defenceRole"
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
                    Assessment Cycle
                  </label>
                  <Controller
                    name="assessmentCycle"
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

          {/* Overall Performance Rating */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <i className="pi pi-star text-gray-600" />
              <label className="text-lg font-semibold text-black m-0">
                Overall Performance Rating
              </label>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Rate the personnel&apos;s overall performance during this assessment
              period
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Controller
                  name="overallRating"
                  control={control}
                  rules={{
                    required: "Please provide an overall rating",
                    min: { value: 1, message: "Please select at least 1 star" },
                  }}
                  render={({ field }) => (
                    <StarRating
                      value={field.value}
                      onChange={field.onChange}
                      className={clsx(
                        errors.overallRating && "border-red-500 rounded p-1"
                      )}
                    />
                  )}
                />
                <span className="text-sm text-gray-600">
                  {watchedOverallRating > 0
                    ? `${watchedOverallRating} out of 5`
                    : "Select rating"}
                </span>
              </div>

              {errors.overallRating && (
                <small className="p-error">
                  {errors.overallRating.message}
                </small>
              )}

              {watchedOverallRating > 0 && (
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
                      {getRatingDescription(watchedOverallRating)} - You&apos;ve
                      rated the personnel&apos;s performance as{" "}
                      {watchedOverallRating} out of 5 stars.
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

          {/* Mission Objectives Achieved Comment */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <i className="pi pi-flag text-gray-600" />
              <label className="text-lg font-semibold text-black m-0">
                Comment on Mission Objectives Achieved
              </label>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Evaluate how well the personnel met their mission objectives and
              operational goals
            </p>

            {/* AI Progress Insights */}
            <div className="bg-gray-50 border border-green-200 rounded p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-green-600">AI</span>
                </div>
                <span className="text-sm font-medium text-green-900">
                  Progress Insights
                </span>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                  Based on learning activity
                </span>
              </div>
              <p className="text-sm text-green-700 mb-3">
                Based on COL Edward Lim&apos;s recent training activities and course
                completions, here are key progress highlights:
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-green-400 rounded-full mt-1 shrink-0"></div>
                  <p className="text-sm text-green-800 m-0">
                    <strong>Joint Operations Planning:</strong> Completed
                    &quot;Advanced Joint Operations Planning&quot; course (85% progress) -
                    demonstrating commitment to expanding tactical planning
                    skills beyond basic operations.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-green-400 rounded-full mt-1 shrink-0"></div>
                  <p className="text-sm text-green-800 m-0">
                    <strong>Leadership Development:</strong> Actively pursuing
                    &quot;Command and Control Leadership&quot; course (40% progress) -
                    aligning with senior officer career growth objectives.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-green-400 rounded-full mt-1 shrink-0"></div>
                  <p className="text-sm text-green-800 m-0">
                    <strong>Advanced Tactical Skills:</strong> Making progress
                    in &quot;Intelligence Analysis and Operations&quot; (70% progress) -
                    enhancing operational capabilities with intelligence-driven
                    insights.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-green-400 rounded-full mt-1 shrink-0"></div>
                  <p className="text-sm text-green-800 m-0">
                    <strong>Skill Improvement Tracking:</strong> Showing
                    consistent progress in Tactical Operations (Level 2→3, 60%
                    complete) and Joint Operations Planning (Level 1→2, 85%
                    complete).
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-green-200 mt-3">
                <p className="text-xs text-green-600 m-0">
                  💡 Tip: Consider how these training achievements align with
                  the personnel&apos;s performance objectives and career development
                  plan in defence operations.
                </p>
              </div>
            </div>

            <Controller
              name="goalsComment"
              control={control}
              rules={{
                required: "Please provide feedback on mission objectives",
              }}
              render={({ field }) => (
                <div>
                  <textarea
                    {...field}
                    placeholder="Provide feedback on the personnel's mission objective achievement, including specific examples of operational successes and any areas where objectives were not fully met..."
                    rows={6}
                    className={clsx(
                      "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical",
                      errors.goalsComment && "border-red-500 focus:ring-red-500"
                    )}
                  />
                  {errors.goalsComment && (
                    <small className="text-red-500 text-sm">
                      {errors.goalsComment.message}
                    </small>
                  )}
                </div>
              )}
            />
            <div className="text-xs text-gray-600 mt-1">
              {watchedGoalsComment?.length || 0}/1000 characters
            </div>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          {/* Strengths Comment */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <i className="pi pi-chart-line text-gray-600" />
              <label className="text-lg font-semibold text-black m-0">
                Comment on Strengths
              </label>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Highlight the personnel&apos;s key strengths and positive contributions
              to defence operations
            </p>
            <Controller
              name="strengthsComment"
              control={control}
              rules={{ required: "Please describe the personnel's strengths" }}
              render={({ field }) => (
                <div>
                  <textarea
                    {...field}
                    placeholder="Describe the personnel's strongest skills, qualities, and contributions. Include specific examples of how these strengths have benefited the unit or defence operations..."
                    rows={6}
                    className={clsx(
                      "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical",
                      errors.strengthsComment &&
                        "border-red-500 focus:ring-red-500"
                    )}
                  />
                  {errors.strengthsComment && (
                    <small className="text-red-500 text-sm">
                      {errors.strengthsComment.message}
                    </small>
                  )}
                </div>
              )}
            />
            <div className="text-xs text-gray-600 mt-1">
              {watchedStrengthsComment?.length || 0}/1000 characters
            </div>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          {/* Improvement Suggestions */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <i className="pi pi-exclamation-circle text-gray-600" />
              <label className="text-lg font-semibold text-black m-0">
                Suggestions for Improvement
              </label>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Provide constructive feedback and development recommendations
            </p>

            {/* AI Improvement Suggestions */}
            <div className="bg-gray-50 border border-purple-200 rounded p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-purple-600">AI</span>
                </div>
                <span className="text-sm font-medium text-purple-900">
                  Skill Development Recommendations
                </span>
                <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                  Based on skill profile
                </span>
              </div>
              <p className="text-sm text-purple-700 mb-3">
                Based on COL Edward Lim&apos;s current skill set and career
                trajectory, here are targeted improvement areas:
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-purple-400 rounded-full mt-1 shrink-0"></div>
                  <p className="text-sm text-purple-800 m-0">
                    <strong>Advanced Cyber Operations:</strong> While COL Lim
                    has strong tactical planning skills, developing expertise in
                    cyber defence operations and information warfare would
                    complement his current joint operations training and enhance
                    his ability to lead modern multi-domain operations.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-purple-400 rounded-full mt-1 shrink-0"></div>
                  <p className="text-sm text-purple-800 m-0">
                    <strong>Strategic Planning & Analysis:</strong> Given his
                    command role, developing skills in strategic planning and
                    operational analysis would strengthen his decision-making
                    capabilities and help bridge the gap between tactical
                    execution and strategic objectives.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-purple-200 mt-3">
                <p className="text-xs text-purple-600 m-0">
                  💡 Tip: These suggestions align with COL Lim&apos;s current
                  training path and can accelerate his growth toward senior
                  command leadership roles in defence operations.
                </p>
              </div>
            </div>

            <Controller
              name="improvementSuggestions"
              control={control}
              rules={{ required: "Please provide improvement suggestions" }}
              render={({ field }) => (
                <div>
                  <textarea
                    {...field}
                    placeholder="Identify areas for growth and provide specific, actionable suggestions for improvement in defence operations. Include development opportunities and training resources that could help..."
                    rows={6}
                    className={clsx(
                      "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical",
                      errors.improvementSuggestions &&
                        "border-red-500 focus:ring-red-500"
                    )}
                  />
                  {errors.improvementSuggestions && (
                    <small className="text-red-500 text-sm">
                      {errors.improvementSuggestions.message}
                    </small>
                  )}
                </div>
              )}
            />
            <div className="text-xs text-gray-600 mt-1">
              {watchedImprovementSuggestions?.length || 0}/1000 characters
            </div>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          {/* Final Comments */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <i className="pi pi-comment text-gray-600" />
              <label className="text-lg font-semibold text-black m-0">
                Final Comments
              </label>
              <span className="text-sm text-gray-600">(Optional)</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Add any additional feedback or context for this evaluation
            </p>
            <Controller
              name="finalComments"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  placeholder="Include any additional thoughts, recognition, or context that would be valuable for the personnel's development and future performance in defence operations..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                />
              )}
            />
            <div className="text-xs text-gray-600 mt-1">
              {watchedFinalComments?.length || 0}/500 characters
            </div>
          </div>

          {/* Submit Section */}
          <div className="bg-gray-100 rounded p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <p className="m-0 mb-1">
                  This evaluation will be shared with the personnel.
                </p>
                <p className="text-xs m-0">
                  Please ensure your feedback is constructive and professional.
                </p>
              </div>
              <Button
                type="submit"
                label={
                  isSubmitting ? "Submitting..." : "Submit Personnel Evaluation"
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
