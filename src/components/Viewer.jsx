import React from 'react';

const Viewer = ({
    displayCanvasRef,
    processingCanvasRef,
    videoRef,
    image,
    isCameraActive,
    onToggleCamera,
    onImageUpload
}) => {
    return (
        <div className="flex-1 relative flex items-center justify-center p-12 bg-[radial-gradient(circle_at_center,_#0a0b12_0%,_#020204_100%)]">
            <div className="relative w-full h-full border border-blue-500/10 rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex items-center justify-center bg-black">
                <video ref={videoRef} autoPlay playsInline className="hidden" />
                <canvas ref={processingCanvasRef} className="hidden" />
                <canvas ref={displayCanvasRef} className="max-w-full max-h-full object-contain" />

                {(!image && !isCameraActive) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-800 gap-6">
                        <div className="relative flex items-center justify-center">
                            <span className="text-[20rem] opacity-10 animate-spin-slow text-blue-500 leading-none">📷</span>
                            <div className="absolute inset-0 flex items-center justify-center uppercase text-5xl font-mono tracking-[0.5em] opacity-60 text-white pointer-events-none">Standby</div>
                        </div>
                        <span className="text-sm font-mono tracking-[0.6em] opacity-40 uppercase text-gray-300">Initialize Source to Begin Extraction</span>
                    </div>
                )}

                <div className="absolute bottom-10 left-10 flex gap-6">
                    <button
                        onClick={onToggleCamera}
                        className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center transition-all shadow-2xl active:scale-90 ${isCameraActive ? 'border-red-500/50 bg-red-500/10 text-red-400' : 'border-blue-500/50 bg-blue-500/10 text-blue-400'
                            }`}
                    >
                        <span className="text-3xl">{isCameraActive ? "⏹" : "📷"}</span>
                    </button>
                    <label className="w-16 h-16 rounded-2xl border-2 border-blue-500/50 bg-blue-500/10 text-blue-400 flex items-center justify-center cursor-pointer hover:bg-blue-500/20 shadow-2xl transition-all active:scale-90">
                        <input type="file" accept="image/*" onChange={onImageUpload} className="hidden" />
                        <span className="text-3xl">📁</span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default Viewer;
