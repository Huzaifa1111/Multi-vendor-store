export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
            <span className="block">Welcome to</span>
            <span className="block text-blue-600">Store App</span>
          </h1>
          <p className="text-4xl text-gray-600 mb-8">
            A modern e-commerce platform
          </p>
          
          {/* Test Tailwind classes */}
          <div className="inline-flex flex-col space-y-4 items-center">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Tailwind CSS Test
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-red-500 text-white p-3 rounded-lg text-center font-semibold">
                  Red
                </div>
                <div className="bg-green-500 text-white p-3 rounded-lg text-center font-semibold">
                  Green
                </div>
                <div className="bg-blue-500 text-white p-3 rounded-lg text-center font-semibold">
                  Blue
                </div>
                <div className="bg-purple-500 text-white p-3 rounded-lg text-center font-semibold">
                  Purple
                </div>
              </div>
              <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105">
                Test Button
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}