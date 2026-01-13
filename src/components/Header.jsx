import React from 'react';

const Header = ({ fps, image, isCameraActive, zoom, isCopying, onCopy }) => {
    return (
        <header className="fixed top-0 left-0 right-0 p-6 z-20 flex justify-between items-start pointer-events-none">
            <div className="bg-gray-900/90 backdrop-blur-xl border border-blue-500/40 px-6 py-3 rounded-xl pointer-events-auto shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
                    <div className="flex flex-col">
                        <span className="text-xl font-mono tracking-[0.2em] text-blue-400 font-black uppercase leading-none">ASCIIING</span>
                        <span className="text-[10px] font-mono text-blue-500/60 uppercase tracking-widest mt-1 text-gray-400">FUN MAKING WITH ASCII</span>
                    </div>
                </div>
                <div className="flex gap-6 mt-3 pt-3 border-t border-white/5">
                    <span className="text-sm font-mono text-gray-400 uppercase">FPS: <span className="text-blue-400 font-bold">{fps || '--'}</span></span>
                    <span className="text-sm font-mono text-gray-400 uppercase">SOURCE: <span className="text-blue-400 font-bold">{image ? 'STATIC_IMAGE' : isCameraActive ? 'LIVE_STREAM' : 'NULL'}</span></span>
                    <span className="text-sm font-mono text-gray-400 uppercase">ZOOM: <span className="text-blue-400 font-bold">{zoom.toFixed(1)}x</span></span>
                </div>
            </div>

            <div className="pointer-events-auto">
                <button
                    onClick={onCopy}
                    className="bg-gray-900/90 backdrop-blur-xl border border-blue-500/40 p-4 rounded-xl hover:bg-blue-500/20 transition-all active:scale-95 shadow-xl group"
                    title="Copy ASCII String"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-blue-400 text-2xl">{isCopying ? "✔" : "📋"}</span>
                        <span className="text-sm font-mono text-blue-400 uppercase font-black tracking-widest group-hover:pl-1 transition-all">
                            {isCopying ? "Copied" : "Extract ASCII"}
                        </span>
                    </div>
                </button>
            </div>
        </header>
    );
};

export default Header;
