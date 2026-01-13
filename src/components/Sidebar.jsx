import React from 'react';
import { CHARACTER_SETS } from '../constants/charSets';

const Sidebar = ({
    resolution, setResolution,
    zoom, setZoom,
    contrast, setContrast,
    brightness, setBrightness,
    pastingTarget, setPastingTarget,
    charSet, setCharSet,
    invert, setInvert
}) => {
    return (
        <aside className="w-[480px] border-l border-white/5 bg-[#050505] p-10 flex flex-col gap-10 overflow-y-auto hidden lg:flex shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-center border-b border-white/5 pb-6">
                <h2 className="text-sm font-mono tracking-[0.3em] text-blue-400 uppercase font-black">Extraction Parameters</h2>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span className="text-xs text-gray-400 font-mono tracking-widest uppercase">SYST_ON</span>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex justify-between text-sm font-mono uppercase tracking-widest">
                    <span className="text-gray-300 font-bold">Extraction Detail</span>
                    <span className="text-blue-400 bg-blue-500/10 px-3 py-1 rounded-md">{13 - resolution}px</span>
                </div>
                <input
                    type="range" min="2" max="12" step="1" value={resolution}
                    onChange={(e) => setResolution(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
            </div>

            <div className="space-y-6">
                <div className="flex justify-between text-sm font-mono uppercase tracking-widest">
                    <span className="text-gray-300 font-bold">Sensor Zoom (Crop)</span>
                    <span className="text-blue-400 bg-blue-500/10 px-3 py-1 rounded-md">{zoom.toFixed(1)}x</span>
                </div>
                <input
                    type="range" min="1" max="4" step="0.1" value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-blue-400"
                />
            </div>

            <div className="space-y-6">
                <div className="flex justify-between text-sm font-mono uppercase tracking-widest">
                    <span className="text-gray-300 font-bold">Contrast Response</span>
                    <span className="text-blue-400 bg-blue-500/10 px-3 py-1 rounded-md">{contrast.toFixed(1)}</span>
                </div>
                <input
                    type="range" min="0" max="2" step="0.1" value={contrast}
                    onChange={(e) => setContrast(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
            </div>

            <div className="space-y-6">
                <div className="flex justify-between text-sm font-mono uppercase tracking-widest">
                    <span className="text-gray-300 font-bold">Luminance Bias</span>
                    <span className="text-blue-400 bg-blue-500/10 px-3 py-1 rounded-md">{brightness > 0 ? `+${brightness}` : brightness}</span>
                </div>
                <input
                    type="range" min="-100" max="100" step="1" value={brightness}
                    onChange={(e) => setBrightness(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
            </div>

            <div className="space-y-6">
                <span className="text-sm font-mono uppercase tracking-widest text-gray-300 font-bold">Pasting Target</span>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => setPastingTarget("LIGHT")}
                        className={`py-3 px-2 text-[11px] font-mono border-2 transition-all rounded-xl flex flex-col items-center gap-1 ${pastingTarget === "LIGHT" ? 'border-blue-400 bg-blue-500/20 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-white/10 text-gray-400 hover:text-gray-200 hover:border-white/20'
                            }`}
                    >
                        <span>NOTEPAD</span>
                        <span className="text-[9px] opacity-70">(Light BG)</span>
                    </button>
                    <button
                        onClick={() => setPastingTarget("DARK")}
                        className={`py-3 px-2 text-[11px] font-mono border-2 transition-all rounded-xl flex flex-col items-center gap-1 ${pastingTarget === "DARK" ? 'border-blue-400 bg-blue-500/20 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-white/10 text-gray-400 hover:text-gray-200 hover:border-white/20'
                            }`}
                    >
                        <span>SOCIAL</span>
                        <span className="text-[9px] opacity-70">(Dark BG)</span>
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <span className="text-sm font-mono uppercase tracking-widest text-gray-300 font-bold">Character Mapping</span>
                <div className="grid grid-cols-2 gap-3">
                    {Object.keys(CHARACTER_SETS).map(set => (
                        <button
                            key={set}
                            onClick={() => setCharSet(set)}
                            className={`py-3 px-2 text-[11px] font-mono border-2 transition-all rounded-xl ${charSet === set ? 'border-blue-400 bg-blue-500/20 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-white/10 text-gray-400 hover:text-gray-200 hover:border-white/20'
                                }`}
                        >
                            {set}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-white/5">
                <div className="flex justify-between items-center cursor-pointer group" onClick={() => setInvert(!invert)}>
                    <span className="text-sm font-mono uppercase tracking-widest text-gray-300 font-bold group-hover:text-white transition-colors">Inverse Polarity</span>
                    <div className={`w-14 h-7 rounded-full border-2 transition-all p-1 ${invert ? 'border-blue-400 bg-blue-500/30' : 'border-white/20 bg-black'}`}>
                        <div className={`w-4 h-4 rounded-full transition-all ${invert ? 'bg-blue-300 translate-x-6 shadow-[0_0_8px_#3b82f6]' : 'bg-gray-600 translate-x-0'}`}></div>
                    </div>
                </div>
            </div>

            <div className="mt-auto pt-10 border-t border-white/5 flex flex-col gap-4 opacity-80">
                <div className="flex justify-between text-xs font-mono text-gray-400 uppercase tracking-widest">
                    <span>Kernel.Status</span>
                    <span className="text-blue-500/80">Hyper_Active</span>
                </div>
                <div className="flex justify-between text-xs font-mono text-gray-400 uppercase tracking-widest">
                    <span>Sync.Clock</span>
                    <span className="text-blue-500/80">Precision_RF</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
