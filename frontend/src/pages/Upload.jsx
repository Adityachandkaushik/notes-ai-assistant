import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload as UploadIcon, FileText, X, CheckCircle, Loader2,
    ArrowRight, Brain, File, AlignLeft, CloudUpload
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Upload() {
    const navigate = useNavigate();
    const [mode, setMode] = useState('drag');
    const [title, setTitle] = useState('');
    const [examDate, setExamDate] = useState('');
    const [file, setFile] = useState(null);
    const [pastedText, setPastedText] = useState('');
    const [dragging, setDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState('AI is processing your syllabus...');

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer?.files[0];
        if (f && (f.type === 'application/pdf' || f.type === 'text/plain')) {
            setFile(f);
        } else {
            toast.error('Only PDF and TXT files supported');
        }
    }, []);

    const onFileChange = (e) => {
        const f = e.target.files[0];
        if (f) setFile(f);
    };

    const handleSubmit = async () => {
        if (!title.trim()) { toast.error('Please add a title'); return; }
        if (!file && !pastedText.trim()) { toast.error('Please upload a file or paste your syllabus'); return; }

        setLoading(true);
        setLoadingMsg(file ? 'Reading your PDF...' : 'Processing syllabus text...');
        try {
            const formData = new FormData();
            formData.append('title', title);
            if (examDate) formData.append('examDate', examDate);
            if (file) formData.append('syllabus', file);
            else formData.append('pastedText', pastedText);

            if (file) {
                setTimeout(() => setLoadingMsg('AI is reading the PDF... (may take up to 2 mins for complex PDFs)'), 5000);
            }

            const { data } = await api.post('/syllabus/upload', formData);

            if (data.warning) {
                toast('⚠️ ' + data.warning, { icon: '⚠️', duration: 5000, style: { background: '#713f12', color: '#fef9c3' } });
            } else {
                toast.success(`✅ ${data.data.totalTopics} topics extracted!`);
            }
            navigate(`/notes/${data.data._id}`);
        } catch (err) {
            const msg = err.response?.data?.error || err.message || 'Upload failed';
            toast.error(msg, { duration: 6000 });
        } finally {
            setLoading(false);
            setLoadingMsg('AI is processing your syllabus...');
        }
    };

    return (
        <div className="min-h-screen gradient-bg p-6 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto"
            >
                {/* ─── Header ─── */}
                <div className="mb-10">
                    <h1 className="text-3xl font-black text-white mb-2">Upload Syllabus</h1>
                    <p className="text-slate-500">Transform your study materials into AI-powered notes, quizzes, and flashcards.</p>
                </div>

                {/* ─── Subject Info ─── */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Subject Title *</label>
                        <input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="e.g. Introduction to Machine Learning"
                            className="w-full bg-[#0e0e13] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder-slate-700 outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/50 transition-all"
                        />
                    </div>
                    <div className="w-full sm:w-[40%]">
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Exam Date</label>
                        <input
                            type="date"
                            value={examDate}
                            onChange={e => setExamDate(e.target.value)}
                            className="w-full bg-[#0e0e13] border border-white/[0.08] rounded-xl px-4 py-3.5 text-slate-300 outline-none focus:ring-2 focus:ring-violet-500/40 transition-all"
                            style={{ colorScheme: 'dark' }}
                        />
                    </div>
                </div>

                {/* ─── Tab Bar ─── */}
                <div className="flex gap-0 mb-6 border-b border-white/[0.07]">
                    {[['drag', '📄', 'Upload PDF'], ['paste', '✏️', 'Paste Text']].map(([m, emoji, label]) => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all relative ${mode === m ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            {emoji} {label}
                            {mode === m && (
                                <motion.div
                                    layoutId="tab-indicator"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-600 to-purple-500 rounded-full"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* ─── Content Area ─── */}
                <AnimatePresence mode="wait">
                    {mode === 'drag' ? (
                        <motion.div key="drag" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            {!file ? (
                                <div
                                    onDrop={onDrop}
                                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                                    onDragLeave={() => setDragging(false)}
                                    onClick={() => document.getElementById('fileInput').click()}
                                    className={`relative cursor-pointer rounded-2xl p-14 text-center transition-all duration-300 ${dragging
                                        ? 'border-2 border-violet-500 bg-violet-600/10 shadow-[0_0_40px_rgba(124,58,237,0.2)]'
                                        : 'border-2 border-dashed border-white/[0.1] hover:border-violet-500/50 hover:bg-violet-600/5'}`}
                                    style={dragging ? { borderImage: 'linear-gradient(135deg, #7C3AED, #06B6D4) 1' } : {}}
                                >
                                    <input id="fileInput" type="file" accept=".pdf,.txt" onChange={onFileChange} className="hidden" />

                                    <motion.div
                                        animate={dragging ? { scale: 1.15 } : { scale: 1 }}
                                        className="w-16 h-16 bg-violet-600/15 rounded-2xl flex items-center justify-center mx-auto mb-4"
                                    >
                                        <CloudUpload size={30} className="text-violet-400" />
                                    </motion.div>
                                    <p className="text-white font-bold text-lg mb-1">
                                        {dragging ? 'Drop it here!' : 'Drag & drop your syllabus'}
                                    </p>
                                    <p className="text-slate-600 text-sm mb-4">or click to browse files</p>

                                    {/* Format chips */}
                                    <div className="flex items-center justify-center gap-2 flex-wrap">
                                        {['PDF', 'TXT', 'Max 10MB'].map(tag => (
                                            <span key={tag} className="text-xs px-3 py-1 rounded-full bg-white/[0.05] text-slate-500 border border-white/[0.07]">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="glass rounded-2xl p-5 border border-emerald-500/30 flex items-center gap-4"
                                    style={{ boxShadow: '0 0 20px rgba(16,185,129,0.1)' }}
                                >
                                    <div className="w-12 h-12 bg-emerald-600/15 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <FileText size={22} className="text-emerald-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-semibold truncate">{file.name}</p>
                                        <p className="text-slate-500 text-sm">{(file.size / 1024).toFixed(1)} KB · Ready to process</p>
                                    </div>
                                    <CheckCircle size={20} className="text-emerald-400 flex-shrink-0" />
                                    <button onClick={() => setFile(null)} className="text-slate-600 hover:text-red-400 transition-colors p-1">
                                        <X size={18} />
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div key="paste" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="relative">
                                <textarea
                                    value={pastedText}
                                    onChange={e => setPastedText(e.target.value)}
                                    placeholder={`Paste your full syllabus text here...\n\ne.g.\nUnit 1: Introduction to Programming\n  1.1 Variables and Data Types\n  1.2 Control Flow\n\nUnit 2: Object-Oriented Programming\n  2.1 Classes and Objects`}
                                    rows={14}
                                    className="w-full bg-[#0e0e13] border border-white/[0.08] rounded-2xl px-5 py-4 text-white placeholder-slate-700 outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/40 transition-all resize-none font-mono text-sm leading-relaxed"
                                />
                                <div className="absolute bottom-4 right-4 text-xs text-slate-700">
                                    {pastedText.length.toLocaleString()} / 10,000
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ─── Submit ─── */}
                <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full mt-6 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 text-white font-bold py-4 rounded-2xl transition-all shadow-[0_0_30px_rgba(124,58,237,0.35)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
                >
                    {loading ? (
                        <><Loader2 size={20} className="animate-spin" /> {loadingMsg}</>
                    ) : (
                        <><Brain size={20} /> Extract Topics &amp; Generate Notes <ArrowRight size={18} /></>
                    )}
                </motion.button>

                <p className="text-center text-slate-600 text-xs mt-4">
                    Usually takes 30–60 seconds depending on syllabus length
                </p>

                {/* ─── Tips ─── */}
                <div className="mt-6 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 flex items-start gap-3">
                    <span className="text-lg flex-shrink-0">💡</span>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        <span className="text-amber-400 font-semibold">Pro tip:</span> For best results, use a structured syllabus with clear topic headings and sub-topics. The AI performs significantly better with organized content.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
