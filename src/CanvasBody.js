import React, {useRef, useState, useEffect} from "react";
import "./CanvasBody.css";
import axios from "axios";
// import Slider from "@mui/material/Slider"

const CanvasBody = () => {
    const canvasRef = useRef(null);
    const [color, setColor] = useState('#FFFFFF'); // Set default ink color to white
    const [lineWidth, setLineWidth] = useState(5);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isEraser, setIsEraser] = useState(false);
    const [resultText, setResultText] = useState(""); // state to store result text
    const [loading, setLoading] = useState(false); // state to manage loading state

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#0B211F'; // Set background color to black
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the entire canvas
    }, []);

    const startDrawing = (e) => {   
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = isEraser ? '#0B211F' : color; // Use black for eraser
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

    const handleSubmit = async (e) => {
        const canvas = canvasRef.current;
        const dataURL = canvas.toDataURL("image/png");
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
            const results = response.data;
            const formattedResult = results.map(item => `${item.expr}: ${item.result}`).join(' , ');
            setResultText(formattedResult || "No results found");
        } catch (error) {
            console.error("Error sending Data :",error);
            setResultText("Error Analyzing Image")
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="canvas-body">
            <div className="canvas">
                <canvas ref={canvasRef} width="800" height="360"></canvas>
            </div>
            <div className="options">
                <span style= {{fontSize: 13}}>Write any mathematical equation or a problem on the canvas using your cursor or stylus. </span>
                <div className="widthset">
                    <input className= "slider" type="range" name="widthSetter" min= "1" max="15" defaultValue={3}></input>
                </div>
                <button className="undo" onClick=""> Undo </button>
                <button className="redo" onClick=""> Redo </button>
            </div>
        </div>
    );
};

export default CanvasBody;