import { useState, useRef, useEffect, useCallback } from "react";

const CHARACTER_SETS = {
  STANDARD: " .'`^\",:;Il!i><~+_-?][}{1)(|\\/*tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
  SIMPLE: " .:-=+*#%@",
  MATRIX: " 0OB01",
  BLOCKS: " ░▒▓█",
  DOTS: " .·:*%#"
};

function App() {
  const [resolution, setResolution] = useState(3);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(1);
  const [zoom, setZoom] = useState(1); // New Crop/Zoom feature
  const [invert, setInvert] = useState(false);
  const [charSet, setCharSet] = useState("STANDARD");
  const [image, setImage] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [fps, setFps] = useState(0);

  const videoRef = useRef(null);
  const processingCanvasRef = useRef(null);
  const displayCanvasRef = useRef(null);
  const requestRef = useRef(null);
  const lastTimeRef = useRef(0);
  const asciiBufferRef = useRef("");

  const processFrame = useCallback((imgSource, width, height) => {
    const pCanvas = processingCanvasRef.current;
    const dCanvas = displayCanvasRef.current;
    if (!pCanvas || !dCanvas) return;

    const pCtx = pCanvas.getContext("2d", { willReadFrequently: true });
    const dCtx = dCanvas.getContext("2d");

    const scale = resolution;
    const scaledWidth = Math.floor(width / scale);
    const scaledHeight = Math.floor((height / scale) * 0.55);

    pCanvas.width = scaledWidth;
    pCanvas.height = scaledHeight;

    // STEP — Implement Zoom/Crop logic
    // sw/sh are source dimensions based on zoom factor
    const sw = width / zoom;
    const sh = height / zoom;
    const sx = (width - sw) / 2;
    const sy = (height - sh) / 2;

    pCtx.drawImage(imgSource, sx, sy, sw, sh, 0, 0, scaledWidth, scaledHeight);

    const imageData = pCtx.getImageData(0, 0, scaledWidth, scaledHeight).data;

    dCanvas.width = width;
    dCanvas.height = height;
    dCtx.fillStyle = "#000";
    dCtx.fillRect(0, 0, width, height);

    const fontSize = scale;
    dCtx.font = `${fontSize}px monospace`;
    dCtx.fillStyle = "#3b82f6";
    dCtx.textAlign = "center";

    const chars = CHARACTER_SETS[charSet];
    let asciiOutput = "";

    // Contrast factor calculation
    const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));

    for (let y = 0; y < scaledHeight; y++) {
      let row = "";
      for (let x = 0; x < scaledWidth; x++) {
        const offset = (y * scaledWidth + x) * 4;

        let r = imageData[offset];
        let g = imageData[offset + 1];
        let b = imageData[offset + 2];

        if (contrast !== 1) {
          r = factor * (r - 128) + 128;
          g = factor * (g - 128) + 128;
          b = factor * (b - 128) + 128;
        }

        let bVal = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        bVal += brightness;
        if (invert) bVal = 255 - bVal;
        bVal = Math.max(0, Math.min(255, bVal));

        const charIndex = Math.floor((bVal / 255) * (chars.length - 1));
        const char = chars[charIndex];

        dCtx.fillText(char, x * scale, y * (scale / 0.55));
        row += char;
      }
      asciiOutput += row + "\n";
    }
    // Verify copying structure: Row-by-row with newlines confirmed
    asciiBufferRef.current = asciiOutput;
  }, [resolution, charSet, brightness, contrast, invert, zoom]);

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsCameraActive(false);
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        setImage(null);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera.");
    }
  };

  const stopCamera = () => {
    setIsCameraActive(false);
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  const copyToClipboard = async () => {
    if (!asciiBufferRef.current) return;
    setIsCopying(true);
    await navigator.clipboard.writeText(asciiBufferRef.current);
    setTimeout(() => setIsCopying(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col font-sans selection:bg-blue-500/30 overflow-hidden">
      {/* HUD Header - Renamed to ASCIIING, Increased Font Sizes */}
      <header className="fixed top-0 left-0 right-0 p-6 z-20 flex justify-between items-start pointer-events-none">
        <div className="bg-gray-900/90 backdrop-blur-xl border border-blue-500/40 px-6 py-3 rounded-xl pointer-events-auto shadow-[0_0_30px_rgba(59,130,246,0.1)]">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
            <div className="flex flex-col">
              <span className="text-xl font-mono tracking-[0.2em] text-blue-400 font-black uppercase leading-none">ASCIIING</span>
              <span className="text-[10px] font-mono text-blue-500/60 uppercase tracking-widest mt-1">Advanced Imaging Core // v3.0</span>
            </div>
          </div>
          <div className="flex gap-6 mt-3 pt-3 border-t border-white/5">
            <span className="text-xs font-mono text-gray-500 uppercase">FPS: <span className="text-blue-400 font-bold">{fps || '--'}</span></span>
            <span className="text-xs font-mono text-gray-500 uppercase">SOURCE: <span className="text-blue-400 font-bold">{image ? 'STATIC_IMAGE' : isCameraActive ? 'LIVE_STREAM' : 'NULL'}</span></span>
            <span className="text-xs font-mono text-gray-500 uppercase">ZOOM: <span className="text-blue-400 font-bold">{zoom.toFixed(1)}x</span></span>
          </div>
        </div>

        <div className="pointer-events-auto">
          <button
            onClick={copyToClipboard}
            className="bg-gray-900/90 backdrop-blur-xl border border-blue-500/40 p-4 rounded-xl hover:bg-blue-500/20 transition-all active:scale-95 shadow-xl group"
            title="Copy ASCII String"
          >
            <div className="flex items-center gap-3">
              <span className="text-blue-400 text-xl">{isCopying ? "✔" : "📋"}</span>
              <span className="text-xs font-mono text-blue-400 uppercase font-black tracking-widest group-hover:pl-1 transition-all">
                {isCopying ? "Copied" : "Extract ASCII"}
              </span>
            </div>
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Main Extended Viewer */}
        <div className="flex-1 relative flex items-center justify-center p-12 bg-[radial-gradient(circle_at_center,_#0a0b12_0%,_#020204_100%)]">
          <div className="relative w-full h-full border border-blue-500/10 rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex items-center justify-center bg-black">
            <video ref={videoRef} autoPlay playsInline className="hidden" />
            <canvas ref={processingCanvasRef} className="hidden" />
            <canvas ref={displayCanvasRef} className="max-w-full max-h-full object-contain" />

            {(!image && !isCameraActive) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-800 gap-6">
                <div className="relative">
                  <span className="text-[12rem] opacity-5 animate-spin-slow">⚛</span>
                  <div className="absolute inset-0 flex items-center justify-center uppercase text-xl font-mono tracking-[0.5em] opacity-40">Standby</div>
                </div>
                <span className="text-sm font-mono tracking-[0.6em] opacity-20 uppercase">Initialize Source to Begin Extraction</span>
              </div>
            )}

            {/* Overlays - Increased size */}
            <div className="absolute bottom-10 left-10 flex gap-6">
              <button
                onClick={isCameraActive ? stopCamera : startCamera}
                className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center transition-all shadow-2xl active:scale-90 ${isCameraActive ? 'border-red-500/50 bg-red-500/10 text-red-400' : 'border-blue-500/50 bg-blue-500/10 text-blue-400'
                  }`}
              >
                <span className="text-3xl">{isCameraActive ? "⏹" : "📷"}</span>
              </button>
              <label className="w-16 h-16 rounded-2xl border-2 border-blue-500/50 bg-blue-500/10 text-blue-400 flex items-center justify-center cursor-pointer hover:bg-blue-500/20 shadow-2xl transition-all active:scale-90">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <span className="text-3xl">📁</span>
              </label>
            </div>
          </div>
        </div>

        {/* Sidebar Settings - Scaled Up */}
        <aside className="w-[480px] border-l border-white/5 bg-[#050505] p-10 flex flex-col gap-10 overflow-y-auto hidden lg:flex shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
          <div className="flex justify-between items-center border-b border-white/5 pb-6">
            <h2 className="text-sm font-mono tracking-[0.3em] text-blue-400 uppercase font-black">Extraction Parameters</h2>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span className="text-xs text-gray-600 font-mono tracking-widest uppercase">SYST_ON</span>
            </div>
          </div>

          {/* Resolution - Increased fonts */}
          <div className="space-y-6">
            <div className="flex justify-between text-xs font-mono uppercase tracking-widest">
              <span className="text-gray-500 font-bold">Extraction Detail</span>
              <span className="text-blue-400 bg-blue-500/10 px-3 py-1 rounded-md">{13 - resolution}px</span>
            </div>
            <input
              type="range" min="2" max="12" step="1" value={resolution}
              onChange={(e) => setResolution(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Zoom - New Logic */}
          <div className="space-y-6">
            <div className="flex justify-between text-xs font-mono uppercase tracking-widest">
              <span className="text-gray-500 font-bold">Sensor Zoom (Crop)</span>
              <span className="text-blue-400 bg-blue-500/10 px-3 py-1 rounded-md">{zoom.toFixed(1)}x</span>
            </div>
            <input
              type="range" min="1" max="4" step="0.1" value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-blue-400"
            />
          </div>

          {/* Contrast */}
          <div className="space-y-6">
            <div className="flex justify-between text-xs font-mono uppercase tracking-widest">
              <span className="text-gray-500 font-bold">Contrast Response</span>
              <span className="text-blue-400 bg-blue-500/10 px-3 py-1 rounded-md">{contrast.toFixed(1)}</span>
            </div>
            <input
              type="range" min="0" max="2" step="0.1" value={contrast}
              onChange={(e) => setContrast(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Brightness */}
          <div className="space-y-6">
            <div className="flex justify-between text-xs font-mono uppercase tracking-widest">
              <span className="text-gray-500 font-bold">Luminance Bias</span>
              <span className="text-blue-400 bg-blue-500/10 px-3 py-1 rounded-md">{brightness > 0 ? `+${brightness}` : brightness}</span>
            </div>
            <input
              type="range" min="-100" max="100" step="1" value={brightness}
              onChange={(e) => setBrightness(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Character Set - Scaled up items */}
          <div className="space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-gray-500 font-bold">Character Mapping</span>
            <div className="grid grid-cols-2 gap-3">
              {Object.keys(CHARACTER_SETS).map(set => (
                <button
                  key={set}
                  onClick={() => setCharSet(set)}
                  className={`py-3 px-2 text-[10px] font-mono border-2 transition-all rounded-xl ${charSet === set ? 'border-blue-400 bg-blue-500/20 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-white/5 text-gray-600 hover:text-gray-400 hover:border-white/10'
                    }`}
                >
                  {set}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles - Scaled Up */}
          <div className="space-y-6 pt-6 border-t border-white/5">
            <div className="flex justify-between items-center cursor-pointer group" onClick={() => setInvert(!invert)}>
              <span className="text-xs font-mono uppercase tracking-widest text-gray-500 font-bold group-hover:text-gray-300 transition-colors">Inverse Polarity</span>
              <div className={`w-12 h-6 rounded-full border-2 transition-all p-1 ${invert ? 'border-blue-400 bg-blue-500/30' : 'border-white/10 bg-black'}`}>
                <div className={`w-3 h-3 rounded-full transition-all ${invert ? 'bg-blue-300 translate-x-5 shadow-[0_0_8px_#3b82f6]' : 'bg-gray-800 translate-x-0'}`}></div>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-10 border-t border-white/5 flex flex-col gap-4 opacity-50">
            <div className="flex justify-between text-[10px] font-mono text-gray-600 uppercase tracking-widest">
              <span>Kernel.Status</span>
              <span className="text-blue-500/80">Hyper_Active</span>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-gray-600 uppercase tracking-widest">
              <span>Sync.Clock</span>
              <span className="text-blue-500/80">Precision_RF</span>
            </div>
          </div>
        </aside>
      </main>

      {/* Global Style Enhancements */}
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
