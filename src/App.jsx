import { useState, useRef, useEffect, useCallback } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Viewer from "./components/Viewer";
import { useMediaSource } from "./hooks/useMediaSource";
import { processImageToAscii } from "./utils/asciiProcessor";

function App() {
  const [resolution, setResolution] = useState(3);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [pastingTarget, setPastingTarget] = useState("DARK");
  const [invert, setInvert] = useState(false);
  const [charSet, setCharSet] = useState("STANDARD");
  const [isCopying, setIsCopying] = useState(false);
  const [fps, setFps] = useState(0);

  const videoRef = useRef(null);
  const processingCanvasRef = useRef(null);
  const displayCanvasRef = useRef(null);
  const requestRef = useRef(null);
  const lastTimeRef = useRef(0);
  const asciiBufferRef = useRef("");

  const {
    image,
    setImage,
    isCameraActive,
    setIsCameraActive,
    handleImageUpload,
    startCamera,
    stopCamera
  } = useMediaSource(videoRef);

  const processFrame = useCallback((imgSource, width, height) => {
    if (!processingCanvasRef.current || !displayCanvasRef.current) return;

    const asciiResult = processImageToAscii({
      imgSource,
      width,
      height,
      processingCanvas: processingCanvasRef.current,
      displayCanvas: displayCanvasRef.current,
      resolution,
      charSet,
      brightness,
      contrast,
      invert,
      zoom,
      pastingTarget
    });

    asciiBufferRef.current = asciiResult;
  }, [resolution, charSet, brightness, contrast, invert, zoom, pastingTarget]);

  const animate = useCallback((time) => {
    if (lastTimeRef.current !== 0) {
      const delta = time - lastTimeRef.current;
      setFps(Math.round(1000 / delta));
    }
    lastTimeRef.current = time;

    if (isCameraActive && videoRef.current && videoRef.current.readyState === 4) {
      processFrame(videoRef.current, videoRef.current.videoWidth, videoRef.current.videoHeight);
    }
    requestRef.current = requestAnimationFrame(animate);
  }, [isCameraActive, processFrame]);

  useEffect(() => {
    if (isCameraActive) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(requestRef.current);
      lastTimeRef.current = 0;
      setFps(0);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isCameraActive, animate]);

  useEffect(() => {
    if (image && !isCameraActive) {
      processFrame(image, image.width, image.height);
    }
  }, [image, isCameraActive, processFrame]);

  const copyToClipboard = async () => {
    if (!asciiBufferRef.current) return;
    setIsCopying(true);
    await navigator.clipboard.writeText(asciiBufferRef.current);
    setTimeout(() => setIsCopying(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col font-sans selection:bg-blue-500/30 overflow-hidden">
      <Header
        fps={fps}
        image={image}
        isCameraActive={isCameraActive}
        zoom={zoom}
        isCopying={isCopying}
        onCopy={copyToClipboard}
      />

      <main className="flex-1 flex overflow-hidden">
        <Viewer
          displayCanvasRef={displayCanvasRef}
          processingCanvasRef={processingCanvasRef}
          videoRef={videoRef}
          image={image}
          isCameraActive={isCameraActive}
          onToggleCamera={isCameraActive ? stopCamera : startCamera}
          onImageUpload={handleImageUpload}
        />

        <Sidebar
          resolution={resolution} setResolution={setResolution}
          zoom={zoom} setZoom={setZoom}
          contrast={contrast} setContrast={setContrast}
          brightness={brightness} setBrightness={setBrightness}
          pastingTarget={pastingTarget} setPastingTarget={setPastingTarget}
          charSet={charSet} setCharSet={setCharSet}
          invert={invert} setInvert={setInvert}
        />
      </main>

      <style>{`
        input[type=range]::-webkit-slider-thumb {
            appearance: none;
            width: 18px;
            height: 18px;
            background: #60a5fa;
            border-radius: 6px;
            cursor: pointer;
            box-shadow: 0 0 20px rgba(96, 165, 250, 0.6);
            border: 2px solid white;
        }
        @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default App;
