export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-lg font-medium text-gray-700">
        Loading Products from nearby store
      </p>
    </div>
  )
}
