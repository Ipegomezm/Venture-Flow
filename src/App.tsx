import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, 
  Lightbulb, 
  Target, 
  DollarSign, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  RefreshCw,
  Globe,
  Palette,
  Skull,
  Bomb,
  Zap,
  Gauge
} from 'lucide-react';
import { 
  generateBusinessIdea, 
  generateBrandImage, 
  crushIdea,
  type BusinessIdea, 
  type CrushingAnalysis 
} from './lib/gemini';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [crushing, setCrushing] = useState(false);
  const [idea, setIdea] = useState<BusinessIdea | null>(null);
  const [crushData, setCrushData] = useState<CrushingAnalysis | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setIdea(null);
    setCrushData(null);
    setImageUrl(null);
    try {
      const result = await generateBusinessIdea(prompt);
      setIdea(result);
      const img = await generateBrandImage(result.title, result.oneLiner);
      setImageUrl(img);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCrush = async () => {
    if (!idea) return;
    setCrushing(true);
    try {
      const result = await crushIdea(idea.title, prompt);
      setCrushData(result);
    } catch (error) {
      console.error("Crush operation failed:", error);
    } finally {
      setCrushing(false);
    }
  };

  return (
    <div id="app-container" className="min-h-screen bg-[#f5f5f5] text-[#1a1a1a] font-sans">
      {/* Header */}
      <header className="border-b border-black/5 bg-white p-6 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
              <Rocket size={18} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">VentureFlow AI</h1>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[11px] font-mono uppercase tracking-widest text-black/40">Entrepreneurial Sandbox v1.0</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-12">
        {/* Input Section */}
        <section id="input-section" className="mb-12">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-4xl font-light mb-4 tracking-tight">What's your next big idea?</h2>
            <p className="text-black/50 text-lg">Describe your business concept in a few sentences. AI will architect the rest.</p>
          </div>
          
          <div className="relative group max-w-4xl mx-auto">
            <textarea
              id="prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A subscription service for high-quality pet food delivered by autonomous drones..."
              className="w-full min-h-[160px] p-6 text-xl rounded-2xl bg-white border border-black/5 shadow-sm focus:outline-none focus:ring-1 focus:ring-black/10 transition-all resize-none placeholder:text-black/20"
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <button
                id="generate-button"
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="bg-black text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin" size={18} />
                    <span>Architecting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Draft Idea</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 pointer-events-none"
            >
              <div className="flex gap-2 mb-4">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="w-3 h-3 bg-black rounded-full"
                  />
                ))}
              </div>
              <p className="text-black/40 font-mono text-xs uppercase tracking-widest">Generating Strategy & Visualization</p>
            </motion.div>
          )}

          {idea && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Left Column: Summary & Basics */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-black/5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-1 bg-black/5 rounded text-black/60">Successive Concept</span>
                  </div>
                  <h3 className="text-5xl font-bold mb-4 tracking-tighter">{idea.title}</h3>
                  <p className="text-2xl text-black/60 font-light leading-relaxed mb-8 border-l-4 border-black/10 pl-6">
                    "{idea.oneLiner}"
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-black/40">
                        <AlertTriangle size={16} />
                        <span className="text-[11px] font-mono uppercase tracking-widest font-semibold">The Friction</span>
                      </div>
                      <p className="text-black/80 leading-relaxed">{idea.problem}</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-black/40">
                        <Lightbulb size={16} />
                        <span className="text-[11px] font-mono uppercase tracking-widest font-semibold">The Breakthrough</span>
                      </div>
                      <p className="text-black/80 leading-relaxed">{idea.solution}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5">
                    <div className="flex items-center gap-2 text-black/30 mb-4">
                      <Target size={18} />
                      <span className="text-[11px] font-mono uppercase tracking-widest font-bold">Ideal Customer</span>
                    </div>
                    <p className="text-lg font-medium">{idea.targetAudience}</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5">
                    <div className="flex items-center gap-2 text-black/30 mb-4">
                      <DollarSign size={18} />
                      <span className="text-[11px] font-mono uppercase tracking-widest font-bold">Revenue Flow</span>
                    </div>
                    <p className="text-lg font-medium">{idea.revenueModel}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-red-50/30 p-6 rounded-3xl border border-red-100">
                    <h4 className="text-[11px] font-mono uppercase tracking-widest text-red-400 font-bold mb-4">Reality Checks</h4>
                    <ul className="space-y-3">
                      {idea.potentialRisks.map((risk, index) => (
                        <li key={index} className="flex gap-3 text-sm text-red-900/70">
                          <span className="text-red-300">•</span>
                          {risk}
                        </li>
                      ))}
                    </ul>
                   </div>
                <div className="bg-black text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Zap size={80} />
                    </div>
                    <h4 className="text-[11px] font-mono uppercase tracking-widest text-white/40 font-bold mb-4">Immediate Actions</h4>
                    <ul className="space-y-3 mb-6 relative z-10">
                      {idea.nextSteps.map((step, index) => (
                        <li key={index} className="flex gap-3 text-sm items-start">
                          <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] shrink-0">
                            {index + 1}
                          </div>
                          {step}
                        </li>
                      ))}
                    </ul>
                    
                    {!crushData && !crushing && (
                      <button
                        onClick={handleCrush}
                        className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] animate-pulse"
                      >
                        <Skull size={20} />
                        <span>CRUSH THIS IDEA</span>
                      </button>
                    )}
                    {crushing && (
                      <div className="w-full py-4 bg-red-900/50 text-white rounded-2xl font-bold flex items-center justify-center gap-3 border border-red-700">
                        <RefreshCw className="animate-spin" size={20} />
                        <span className="uppercase tracking-widest text-xs">Simulating Reality...</span>
                      </div>
                    )}
                </div>

                {/* CRUSH DATA DISPLAY */}
                <AnimatePresence>
                  {crushData && (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="md:col-span-2 bg-[#1a1a1a] text-white p-10 rounded-[40px] border-4 border-red-600 shadow-[20px_20px_0_rgba(220,38,38,0.2)]"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                        <div>
                          <div className="flex items-center gap-3 text-red-500 mb-2">
                            <Bomb size={32} />
                            <h4 className="text-4xl font-black italic tracking-tighter uppercase">Brutal Reality Check</h4>
                          </div>
                          <p className="text-white/40 font-mono text-xs uppercase tracking-[0.3em]">Cynical VC Mode: Activated</p>
                        </div>
                        <div className="bg-red-600/10 border border-red-600/30 p-4 rounded-2xl flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-[10px] font-mono text-red-400 uppercase tracking-widest">Failure Probability</div>
                            <div className="text-3xl font-black text-red-500">{crushData.executionDifficulty}%</div>
                          </div>
                          <Gauge size={40} className="text-red-500" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-8">
                          <div>
                            <h5 className="text-red-500 font-mono text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                              <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                              The Brutal Honest Truth
                            </h5>
                            <p className="text-xl font-light leading-relaxed text-white/80 border-l-2 border-red-600/30 pl-6 italic">
                              "{crushData.brutalHonesty}"
                            </p>
                          </div>
                          
                          <div>
                            <h5 className="text-white/30 font-mono text-xs uppercase tracking-widest mb-4">Technical Nightmares</h5>
                            <ul className="space-y-4">
                              {crushData.technicalMoats.map((moat, i) => (
                                <li key={i} className="flex gap-4 items-start group">
                                  <div className="mt-1.5 w-1.5 h-1.5 bg-red-500 rounded-full shrink-0 group-hover:scale-150 transition-transform" />
                                  <span className="text-sm text-white/70 leading-relaxed font-medium">{moat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="space-y-8">
                          <div className="bg-red-600/5 p-6 rounded-3xl border border-red-600/10 hover:border-red-600/30 transition-colors">
                            <h5 className="text-red-400 font-mono text-xs uppercase tracking-widest mb-4">Market Killers</h5>
                            <div className="flex flex-wrap gap-2">
                              {crushData.marketKillers.map((killer, i) => (
                                <span key={i} className="px-3 py-1.5 bg-red-600/10 rounded-full text-xs text-red-100 border border-red-600/20">
                                  {killer}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                            <h5 className="text-white/30 font-mono text-xs uppercase tracking-widest mb-4">The "Money Pit"</h5>
                            <ul className="space-y-3">
                              {crushData.financialPains.map((pain, i) => (
                                <li key={i} className="text-sm flex justify-between items-center border-b border-white/5 pb-2">
                                  <span className="text-white/60">{pain}</span>
                                  <DollarSign size={14} className="text-red-500" />
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-black/30">
                      <Palette size={18} />
                      <span className="text-[11px] font-mono uppercase tracking-widest font-bold">Brand Visual</span>
                    </div>
                    {imageUrl && (
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-green-50 text-green-600 rounded border border-green-100 uppercase tracking-tighter">AI Generated</span>
                    )}
                  </div>
                  
                  <div className="aspect-square w-full bg-black/[0.02] rounded-2xl flex items-center justify-center relative overflow-hidden">
                    {imageUrl ? (
                      <motion.img 
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        src={imageUrl} 
                        alt="Brand Identity" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-black/20">
                        <RefreshCw className="animate-spin" size={24} />
                        <span className="text-xs uppercase tracking-widest font-mono">Visualizing...</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between border-t border-black/5 pt-4">
                      <span className="text-xs text-black/40">Visual Concept</span>
                      <span className="text-xs font-semibold uppercase tracking-wider">Minimalist Modern</span>
                    </div>
                    <button className="w-full py-3 rounded-xl border border-black text-black text-sm font-medium hover:bg-black/5 transition-all flex items-center justify-center gap-2">
                       Explore Visual Strategy <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5">
                  <div className="flex items-center gap-2 text-black/30 mb-4">
                    <Globe size={18} />
                    <span className="text-[11px] font-mono uppercase tracking-widest font-bold">Feasibility Index</span>
                  </div>
                  <div className="space-y-4">
                     <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-black/60 font-medium">Market Readiness</span>
                          <span className="font-bold">85%</span>
                        </div>
                        <div className="w-full h-1 bg-black/5 rounded-full">
                          <div className="w-[85%] h-full bg-black rounded-full" />
                        </div>
                     </div>
                     <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-black/60 font-medium">Scalability</span>
                          <span className="font-bold">72%</span>
                        </div>
                        <div className="w-full h-1 bg-black/5 rounded-full">
                          <div className="w-[72%] h-full bg-black rounded-full" />
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!idea && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 opacity-40 grayscale hover:grayscale-0 transition-all">
            <div className="p-6 border border-dashed border-black/20 rounded-3xl">
              <h4 className="text-[11px] font-mono uppercase mb-2 tracking-widest font-bold">Fast Validation</h4>
              <p className="text-xs">Go from abstract thought to structured deck in 12 seconds.</p>
            </div>
            <div className="p-6 border border-dashed border-black/20 rounded-3xl">
              <h4 className="text-[11px] font-mono uppercase mb-2 tracking-widest font-bold">AI Co-Founder</h4>
              <p className="text-xs">Tuned to identify risks you might miss in your honeymoon phase.</p>
            </div>
            <div className="p-6 border border-dashed border-black/20 rounded-3xl">
              <h4 className="text-[11px] font-mono uppercase mb-2 tracking-widest font-bold">Visual Moats</h4>
              <p className="text-xs">Generate instant brand concepts to feel the identity of your venture.</p>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-black/5 p-12 bg-white/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xs text-black/30 font-mono">© 2026 VENTUREFLOW AI / CONCEPT LABS</div>
          <div className="flex gap-8">
            <a href="#" className="text-xs text-black/40 hover:text-black transition-all">Privacy Strategy</a>
            <a href="#" className="text-xs text-black/40 hover:text-black transition-all">Terms of Service</a>
            <a href="#" className="text-xs text-black/40 hover:text-black transition-all">Support API</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
