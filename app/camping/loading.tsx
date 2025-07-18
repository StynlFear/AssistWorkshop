export default function Loading() {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black flex items-center justify-center">
      <div className="text-center text-white">
        <div className="mb-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
        <h2 className="text-xl font-semibold mb-2">🏕️ Setting up camp...</h2>
        <p className="text-sm opacity-80">Loading your 3D camping experience</p>
      </div>
    </div>
  )
}
