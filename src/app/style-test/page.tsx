export default function StyleTest() {
  return (
    <div className="min-h-screen bg-purple-600 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Style Test Page</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Card 1</h2>
            <p className="text-gray-600">This should have white background with shadow</p>
            <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
              Button
            </button>
          </div>

          <div className="bg-slate-100 rounded-lg p-6 border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Card 2</h2>
            <p className="text-slate-600">This should have light gray background with border</p>
            <div className="flex items-center gap-2 mt-4 text-sm text-slate-500">
              <span>✓ Tailwind working</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg p-6 text-white">
            <h2 className="text-xl font-semibold mb-4">Card 3</h2>
            <p className="opacity-90">This should have purple gradient background</p>
            <div className="mt-4 text-xs opacity-75">
              Purple theme test
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 font-jakarta">Font Test</h2>
          <p className="text-lg text-gray-700 mb-2">This should use Inter font (default)</p>
          <p className="text-lg text-gray-700 font-jakarta">This should use Jakarta font (if loaded)</p>
        </div>
      </div>
    </div>
  )
}