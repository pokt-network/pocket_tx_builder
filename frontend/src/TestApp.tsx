// Simple test component

function TestApp() {
  return (
    <div style={{ 
      "padding": "2rem", 
      "font-family": "Arial, sans-serif",
      "background-color": "white",
      "color": "black",
      "min-height": "100vh"
    }}>
      <h1 style={{ "color": "blue" }}>Pocket TX Builder Test Page</h1>
      <p>If you can see this text, the frontend rendering is working correctly.</p>
      <div style={{ "margin-top": "2rem", "padding": "1rem", "border": "1px solid #ccc" }}>
        <h2>Test Components</h2>
        <button 
          style={{ 
            "padding": "0.5rem 1rem", 
            "background-color": "blue", 
            "color": "white", 
            "border": "none", 
            "border-radius": "4px",
            "cursor": "pointer"
          }}
          onClick={() => alert('Button clicked!')}
        >
          Test Button
        </button>
      </div>
    </div>
  );
}

export default TestApp;
