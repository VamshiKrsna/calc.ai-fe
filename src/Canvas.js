import React, { useRef, useState } from 'react';

const Canvas = () => {
  const canvasRef = useRef(null);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEraser, setIsEraser] = useState(false);

  // Start drawing function
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = isEraser ? '#FFFFFF' : color; // Use white for eraser
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  // Drawing on canvas
  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  // Stop drawing
  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Toggle between eraser and marker
  const toggleEraser = () => {
    setIsEraser(!isEraser);
  };

  // Handle reset (reload the page)
  const handleReset = () => {
    window.location.reload(); // Refresh the page
  };

  // Handle submission to backend (empty for now)
  const handleSubmit = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png');

    // Placeholder for sending canvas data to the backend
    console.log('Sending canvas data to the backend:', dataURL);
  };

  return (
    <div style={styles.container}>
      <div style={styles.toolbar}>
        {/* Color Picker */}
        <div style={styles.tool}>
          <label style={styles.label}>Color:</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={styles.colorPicker}
          />
        </div>

        {/* Line Width Adjuster */}
        <div style={styles.tool}>
          <label style={styles.label}>Width: {lineWidth}px</label>
          <input
            type="range"
            min="1"
            max="20"
            value={lineWidth}
            onChange={(e) => setLineWidth(e.target.value)}
            style={styles.range}
          />
        </div>

        {/* Toggle Marker/Eraser */}
        <button style={styles.button} onClick={toggleEraser}>
          {isEraser ? (
            <img
              src="https://img.icons8.com/ios-filled/50/000000/pen.png"
              alt="Marker"
              style={styles.icon}
            />
          ) : (
            <img
              src="https://img.icons8.com/ios-filled/50/000000/eraser.png"
              alt="Eraser"
              style={styles.icon}
            />
          )}
        </button>

        {/* Reset Button */}
        <button style={styles.button} onClick={handleReset}>
          Reset
        </button>

        {/* Submit Button */}
        <button style={styles.submitButton} onClick={handleSubmit}>
          Check
        </button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={styles.canvas}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      ></canvas>
    </div>
  );
};

// Styles for the component
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: "'Poppins', sans-serif",
    margin: '20px',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: '20px',
    width: '80%',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  tool: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  label: {
    fontSize: '14px',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333',
  },
  colorPicker: {
    width: '40px',
    height: '40px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  range: {
    width: '100px',
    cursor: 'pointer',
  },
  button: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s ease',
  },
  submitButton: {
    backgroundColor: '#007BFF',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  icon: {
    width: '20px',
    height: '20px',
  },
  canvas: {
    border: '2px solid #333',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
};

export default Canvas;