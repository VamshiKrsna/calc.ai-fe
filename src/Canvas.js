import React, { useRef, useState, useEffect } from 'react';
import axios from "axios";

const Canvas = () => {
  const canvasRef = useRef(null);
  const [color, setColor] = useState('#FFFFFF'); // Set default ink color to white
  const [lineWidth, setLineWidth] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEraser, setIsEraser] = useState(false);
  const [resultText, setResultText] = useState(""); // state to store result text
  const [loading, setLoading] = useState(false); // state to manage loading state

  // Fill canvas with black background on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000000'; // Set background color to black
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the entire canvas
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = isEraser ? '#000000' : color; // Use black for eraser
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const toggleEraser = () => {
    setIsEraser(!isEraser);
  };

  const handleReset = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Resetting the background to black
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Optionally clear any drawings
    setIsDrawing(false);
  };

  // Handling submission to backend
  const handleSubmit = async () => {
    const canvas = canvasRef.current;

    // Create a new image with a black background
    const dataURL = canvas.toDataURL("image/png");

    // Convert data URL to Blob for submission
    const responseBlob = await fetch(dataURL);
    const blob = await responseBlob.blob();

    const formData = new FormData();
    formData.append("file", blob, "canvas.png");

    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/calculate/analyze-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Save a screenshot of the submission
      // const link = document.createElement('a');
      // link.href = dataURL; // Use the data URL of the canvas
      // link.download = 'canvas_screenshot.png'; // Set the file name
      // document.body.appendChild(link);
      // link.click(); // Trigger the download
      // document.body.removeChild(link); 
      const results = response.data;
      const formattedResult = results.map(item=>`${item.expr}: ${item.result}`).join(' , ');
      setResultText(formattedResult || "No Result Found");
    } catch (error) {
      console.error("Error sending canvas data:", error);
      setResultText("Error analyzing the image.");
    } finally {
      setLoading(false);
    }
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
        <button style={styles.submitButton} onClick={handleSubmit} disabled={loading}>
          {loading ? "Checking..." : "Check"}
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

      {/* Display result */}
      {resultText && (
        <div style={styles.resultContainer}>
          <h3 style={styles.resultTitle}>Result:</h3>
          <p style={styles.resultText}>{resultText}</p>
        </div>
      )}
    </div>
  );
};

// Styling
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
    borderRadius: '30%',
    cursor: 'pointer',
  },
  range: {
     width:'100px', 
     cursor:'pointer', 
   },
   button:{
     backgroundColor:'#4CAF50', 
     color:'white', 
     padding:'10px15px', 
     border:'none', 
     borderRadius:'8px', 
     cursor:'pointer', 
     display:'flex', 
     alignItems:'center', 
     justifyContent:'center', 
     transition:'background-color0.3sease', 
   },
   submitButton:{
     backgroundColor:'#007BFF', 
     color:'white', 
     padding:'10px20px', 
     border:'none', 
     borderRadius:'8px', 
     fontWeight:'bold', 
     cursor:'pointer', 
     transition:'background-color0.3sease', 
   },
   icon:{
     width:'20px', 
     height:'20px', 
   },
   canvas:{
     border:'2px solid #333', 
     borderRadius:'8px', 
     boxShadow:'04px12px rgba(0,0,0,0.1)', 
   },
   resultContainer:{
     marginTop:'20px', 
     textAlign:'center', 
     backgroundColor:'#f9f9f9', 
     padding:'10px', 
     borderRadius:'8px', 
     boxShadow:'04px12px rgba(0,0,0,0.1)', 
   },
   resultTitle:{
     fontSize:'18px', 
     fontWeight:'bold', 
     color:'#333', 
   },
   resultText:{
     fontSize:'16px', 
     color:'#555', 
   },  
};

export default Canvas;