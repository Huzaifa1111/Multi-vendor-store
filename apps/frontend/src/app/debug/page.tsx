export default function DebugPage() {
  return (
    <div>
      <h1 style={{ color: 'red', fontSize: '24px' }}>CSS Debug Page</h1>
      
      {/* Test 1: Inline styles (should always work) */}
      <div style={{ backgroundColor: 'lightblue', padding: '20px', margin: '10px' }}>
        <h2>Inline Style Test</h2>
        <p>If you see light blue background, CSS is working at basic level.</p>
      </div>
      
      {/* Test 2: Regular CSS class from globals.css */}
      <div className="test-tailwind" style={{ margin: '10px' }}>
        <h2>Direct CSS Class Test</h2>
        <p>If this is styled, globals.css is being loaded.</p>
      </div>
      
      {/* Test 3: Tailwind classes */}
      <div className="bg-red-500 text-white p-4 m-4 rounded">
        <h2>Tailwind Test</h2>
        <p>If this has red background, white text, padding, margin, and rounded corners, Tailwind is working.</p>
      </div>
      
      {/* Test 4: More Tailwind */}
      <div className="grid grid-cols-2 gap-4 m-4">
        <div className="bg-blue-500 p-4 text-white">Blue</div>
        <div className="bg-green-500 p-4 text-white">Green</div>
      </div>
    </div>
  );
}