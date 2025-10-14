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

export interface PeerReviewFormData {
  studentName: string;
  major: string;
  year: string;
  academicRating: number;
  collaborationRating: number;
  strengths: string;
  improvements: string;
  additionalComments: string;
}

interface PeerReviewFormProps {
  defaultValues?: Partial<PeerReviewFormData>;
}

export default function PeerReviewForm({
  defaultValues,
}: PeerReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<PeerReviewFormData>({
    defaultValues: {
      studentName: "Alice Chen",
      major: "Computer Science and Design",
      year: "Year 3",
      academicRating: 0,
      collaborationRating: 0,
      strengths: "",
      improvements: "",
      additionalComments: "",
      ...defaultValues,
    },
    mode: "onChange",
  });

  const watchedStrengths = watch("strengths");
  const watchedImprovements = watch("improvements");
  const watchedAdditionalComments = watch("additionalComments");
  const watchedAcademicRating = watch("academicRating");
  const watchedCollaborationRating = watch("collaborationRating");

  const onSubmit = async (data: PeerReviewFormData) => {
    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Peer review data:", data);

      toast.success(
        "Peer review submitted successfully! The student will be notified.",
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
      toast.error("Failed to submit review. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingDescription = (rating: number, type: "academic" | "collaboration") => {
    const academicDescriptions = {
      1: "Needs significant improvement in academic performance",
      2: "Below average academic work quality",
      3: "Good academic performance and understanding",
      4: "Excellent academic work and insights",
      5: "Outstanding academic excellence and innovation",
    };
    
    const collaborationDescriptions = {
      1: "Needs significant improvement in collaboration",
      2: "Below average teamwork skills",
      3: "Good collaboration and teamwork",
      4: "Excellent collaboration skills",
      5: "Outstanding team player and collaborator",
    };
    
    const descriptions = type === "academic" ? academicDescriptions : collaborationDescriptions;
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
              Peer Review Form
            </h2>

            <div className="flex items-center gap-2 mb-4">
              <i className="pi pi-user text-gray-600" />
              <h3 className="text-lg font-semibold text-black m-0">
                Student Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-1">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-900 mb-2">
                    Student Name
                  </label>
                  <Controller
                    name="studentName"
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
                    Major
                  </label>
                  <Controller
                    name="major"
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
                    Academic Year
                  </label>
                  <Controller
                    name="year"
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

          {/* Academic Performance Rating */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <i className="pi pi-graduation-cap text-gray-600" />
              <label className="text-lg font-semibold text-black m-0">
                Academic Performance Rating
              </label>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Rate this student&apos;s academic work quality, understanding, and contribution to learning
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Controller
                  name="academicRating"
                  control={control}
                  rules={{
                    required: "Please provide an academic performance rating",
                    min: { value: 1, message: "Please select at least 1 star" },
                  }}
                  render={({ field }) => (
                    <StarRating
                      value={field.value}
                      onChange={field.onChange}
                      className={clsx(
                        errors.academicRating &&
                          "border-red-500 rounded p-1"
                      )}
                    />
                  )}
                />
                <span className="text-sm text-gray-600">
                  {watchedAcademicRating > 0
                    ? `${watchedAcademicRating} out of 5`
                    : "Select rating"}
                </span>
              </div>

              {errors.academicRating && (
                <small className="p-error">
                  {errors.academicRating.message}
                </small>
              )}

                  {watchedAcademicRating > 0 && (
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
                      {getRatingDescription(watchedAcademicRating, "academic")} -
                      You&apos;ve rated this student&apos;s academic performance as{" "}
                      {watchedAcademicRating} out of 5 stars.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          {/* Collaboration Rating */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <i className="pi pi-users text-gray-600" />
              <label className="text-lg font-semibold text-black m-0">
                Collaboration and Teamwork Rating
              </label>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Rate how well this student collaborates and contributes to group work and peer learning
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Controller
                  name="collaborationRating"
                  control={control}
                  rules={{
                    required: "Please provide a collaboration rating",
                    min: { value: 1, message: "Please select at least 1 star" },
                  }}
                  render={({ field }) => (
                    <StarRating
                      value={field.value}
                      onChange={field.onChange}
                      className={clsx(
                        errors.collaborationRating &&
                          "border-red-500 rounded p-1"
                      )}
                    />
                  )}
                />
                <span className="text-sm text-gray-600">
                  {watchedCollaborationRating > 0
                    ? `${watchedCollaborationRating} out of 5`
                    : "Select rating"}
                </span>
              </div>

              {errors.collaborationRating && (
                <small className="p-error">
                  {errors.collaborationRating.message}
                </small>
              )}

              {watchedCollaborationRating > 0 && (
                <div className="bg-green-50 border border-green-200 rounded p-3 w-full">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-green-800">
                      {getRatingDescription(watchedCollaborationRating, "collaboration")} -
                      You&apos;ve rated this student&apos;s collaboration as{" "}
                      {watchedCollaborationRating} out of 5 stars.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          {/* Strengths */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <i className="pi pi-chart-line text-gray-600" />
              <label className="text-lg font-semibold text-black m-0">
                Strengths and Positive Qualities
              </label>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Highlight this student&apos;s key strengths and positive contributions to academic work and peer learning
            </p>
            <Controller
              name="strengths"
              control={control}
              rules={{
                required: "Please describe your peer's strengths",
              }}
              render={({ field }) => (
                <div>
                  <textarea
                    {...field}
                    placeholder="Describe your peer&apos;s strongest academic skills, qualities, and contributions. Include specific examples of how these strengths have benefited group work or class discussions..."
                    rows={6}
                    className={clsx(
                      "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical",
                      errors.strengths && "border-red-500 focus:ring-red-500"
                    )}
                  />
                  {errors.strengths && (
                    <small className="text-red-500 text-sm">
                      {errors.strengths.message}
                    </small>
                  )}
                </div>
              )}
            />
            <div className="text-xs text-gray-600 mt-1">
              {watchedStrengths?.length || 0}/1000 characters
            </div>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          {/* Areas for Improvement */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <i className="pi pi-exclamation-circle text-gray-600" />
              <label className="text-lg font-semibold text-black m-0">
                Areas for Improvement
              </label>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Provide constructive feedback for academic and professional development
            </p>
            <Controller
              name="improvements"
              control={control}
              rules={{ required: "Please provide improvement suggestions" }}
              render={({ field }) => (
                <div>
                  <textarea
                    {...field}
                    placeholder="Share constructive suggestions for areas where your peer could grow or develop. Focus on specific, actionable feedback that could help in their academic journey..."
                    rows={6}
                    className={clsx(
                      "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical",
                      errors.improvements && "border-red-500 focus:ring-red-500"
                    )}
                  />
                  {errors.improvements && (
                    <small className="text-red-500 text-sm">
                      {errors.improvements.message}
                    </small>
                  )}
                </div>
              )}
            />
            <div className="text-xs text-gray-600 mt-1">
              {watchedImprovements?.length || 0}/1000 characters
            </div>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          {/* Additional Comments */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <i className="pi pi-comment text-gray-600" />
              <label className="text-lg font-semibold text-black m-0">
                Additional Comments
              </label>
              <span className="text-sm text-gray-600">(Optional)</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Share any other thoughts or observations about working with this peer
            </p>
            <Controller
              name="additionalComments"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  placeholder="Include any additional feedback, observations, or context that would be helpful for your peer&apos;s academic development..."
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
                  This review will remain confidential and contribute to
                  your peer&apos;s academic development.
                </p>
                <p className="text-xs m-0">
                  Please provide honest and constructive feedback.
                </p>
              </div>
              <Button
                type="submit"
                label={
                  isSubmitting ? "Submitting..." : "Submit Peer Review"
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
