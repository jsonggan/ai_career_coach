interface SupervisorBannerProps {}

export default function SupervisorBanner({}: SupervisorBannerProps) {
  return (
    <div className="mb-0 bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className="p-1 bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center">
          <i className="pi pi-user-edit text-blue-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-blue-900 m-0">
            Supervisor View
          </h3>
          <p className="text-sm text-blue-700 m-0">
            You are viewing this form as a supervisor. This evaluation will be
            shared with the personnel.
          </p>
        </div>
      </div>
    </div>
  );
}
