export default function EmptyState() {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-10 flex flex-col items-center text-center text-gray-600">
      <i className="pi pi-users text-5xl mb-4 text-gray-400" />
      <p className="text-xl m-0">
        Please select a colleague to provide assessment
      </p>
      <p className="text-sm m-0 mt-2">
        Choose from the dropdown above to get started
      </p>
    </div>
  );
}
