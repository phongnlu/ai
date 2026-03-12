export default function LoadingSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-5 w-20 bg-gray-200 dark:bg-gray-600 rounded-full" />
        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-600 rounded" />
      </div>
      <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded mb-2 w-full" />
      <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded mb-4 w-3/4" />
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-2/3" />
      </div>
      <div className="flex justify-between">
        <div className="h-3 w-24 bg-gray-200 dark:bg-gray-600 rounded" />
        <div className="h-3 w-12 bg-gray-200 dark:bg-gray-600 rounded" />
      </div>
    </div>
  );
}
