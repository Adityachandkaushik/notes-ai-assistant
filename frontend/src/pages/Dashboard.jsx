import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Plus, BookOpen, Clock, TrendingUp, Trash2, ChevronRight,
    FileText, Loader2, Brain, Zap, Target, BarChart3, Sparkles, Calendar, AlertTriangle
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';

export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { xp, level, streak } = useGamification();

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['syllabuses'],
        queryFn: () => api.get('/syllabus').then(r => r.data.data),
    });

    const syllabuses = data || [];

    const handleDelete = async (id, e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm('Delete this syllabus and all its notes?')) return;
        try {
            await api.delete(`/syllabus/${id}`);
            toast.success('Syllabus deleted');
            refetch();
        } catch {
            toast.error('Failed to delete');
        }
    };

    const totalTopics = syllabuses.reduce((a, s) => a + (s.totalTopics || 0), 0);
    const totalGenerated = syllabuses.reduce((a, s) => a + (s.generatedTopics || 0), 0);
    const completionPct = totalTopics > 0 ? Math.round((totalGenerated / totalTopics) * 100) : 0;

    // Find nearest upcoming exam
    const upcomingExams = syllabuses
        .filter(s => s.examDate && new Date(s.examDate) > new Date())
        .sort((a, b) => new Date(a.examDate) - new Date(b.examDate));
    const nextExam = upcomingExams[0] || null;
    const daysToExam = nextExam
        ? Math.ceil((new Date(nextExam.examDate) - new Date()) / (1000 * 60 * 60 * 24))
        : null;
    const examUrgency = daysToExam !== null
        ? daysToExam <= 7 ? 'red' : daysToExam <= 30 ? 'amber' : 'emerald'
        : null;

    const stats = [
        {
            label: 'Total Syllabuses', value: syllabuses.length, icon: FileText,
            color: 'text-violet-400', bg: 'bg-violet-600/15', glow: 'rgba(124,58,237,0.2)',
            accent: 'from-violet-600/20 to-transparent',
        },
        {
            label: 'Total Topics', value: totalTopics, icon: Brain,
            color: 'text-cyan-400', bg: 'bg-cyan-600/15', glow: 'rgba(6,182,212,0.2)',
            accent: 'from-cyan-600/20 to-transparent',
        },
        {
            label: 'Notes Generated', value: totalGenerated, icon: TrendingUp,
            color: 'text-emerald-400', bg: 'bg-emerald-600/15', glow: 'rgba(16,185,129,0.2)',
            accent: 'from-emerald-600/20 to-transparent',
        },
        {
            label: 'Completion Rate', value: `${completionPct}%`, icon: Target,
            color: 'text-amber-400', bg: 'bg-amber-600/15', glow: 'rgba(245,158,11,0.2)',
            accent: 'from-amber-600/20 to-transparent',
        },
    ];

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const firstName = user?.name?.split(' ')[0] || 'there';

    return (
        <div className="p-6 md:p-8 min-h-screen gradient-bg">
            {/* ─── Header ─── */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-white mb-1">
                            {greeting}, {firstName} 👋
                        </h1>
                        <p className="text-slate-500">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    {/* Quick XP badge */}
                    {xp > 0 && (
                        <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/[0.04] border border-white/[0.07]">
                            <div className="text-right">
                                <p className="text-xs text-slate-500">Level {level}</p>
                                <p className="text-sm font-bold text-violet-300">{xp} XP</p>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-violet-600/20 flex items-center justify-center">
                                <Zap size={16} className="text-amber-400" />
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* ─── Stats Strip ─── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
                {stats.map(({ label, value, icon: Icon, color, bg, glow, accent }, i) => (
                    <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.06 * i }}
                        className="relative overflow-hidden glass rounded-2xl p-5 border border-white/[0.06] hover:border-white/[0.1] transition-all"
                        style={{ boxShadow: `0 0 30px ${glow}` }}
                    >
                        {/* Accent gradient bg */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-50 pointer-events-none`} />
                        <div className="relative z-10">
                            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                                <Icon size={19} className={color} />
                            </div>
                            <p className="text-3xl font-black text-white">{value}</p>
                            <p className="text-xs text-slate-500 mt-1 font-medium">{label}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* ─── Exam Countdown Banner ─── */}
            {nextExam && (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className={`mb-6 flex items-center gap-4 rounded-2xl px-5 py-4 border ${
                        examUrgency === 'red'
                            ? 'bg-red-500/10 border-red-500/25 text-red-300'
                            : examUrgency === 'amber'
                            ? 'bg-amber-500/10 border-amber-500/25 text-amber-300'
                            : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
                    }`}
                >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        examUrgency === 'red' ? 'bg-red-500/20'
                        : examUrgency === 'amber' ? 'bg-amber-500/20'
                        : 'bg-emerald-500/20'
                    }`}>
                        {examUrgency === 'red' ? <AlertTriangle size={18} /> : <Calendar size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">
                            {daysToExam === 1 ? '⚠️ Exam TOMORROW!' : `📅 ${daysToExam} days to exam`}
                        </p>
                        <p className="text-xs opacity-70 truncate">{nextExam.title}</p>
                    </div>
                    <Link
                        to={`/progress/${nextExam._id}`}
                        className="shrink-0 text-xs font-semibold underline underline-offset-2 opacity-80 hover:opacity-100"
                    >
                        View Progress
                    </Link>
                </motion.div>
            )}

            {/* ─── Syllabuses section ─── */}
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-white">Your Syllabuses</h2>
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/upload')}
                    className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] text-sm"
                >
                    <Plus size={16} /> Upload New
                </motion.button>
            </div>

            {/* ─── Grid ─── */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="glass rounded-2xl p-5 border border-white/[0.06] min-h-[200px] animate-pulse">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-11 h-11 bg-white/[0.06] rounded-xl" />
                                <div className="w-16 h-5 bg-white/[0.06] rounded-full" />
                            </div>
                            <div className="w-3/4 h-4 bg-white/[0.06] rounded mb-2" />
                            <div className="w-1/2 h-3 bg-white/[0.04] rounded mb-6" />
                            <div className="h-1.5 bg-white/[0.06] rounded-full" />
                        </div>
                    ))}
                </div>
            ) : syllabuses.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative overflow-hidden glass rounded-3xl border border-white/[0.06] p-20 text-center"
                    style={{ boxShadow: '0 0 60px rgba(124,58,237,0.08)' }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent pointer-events-none" />
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-purple-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(124,58,237,0.4)]">
                            <BookOpen size={34} className="text-white" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-3">No syllabuses yet</h3>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
                            Upload your first syllabus to get started with AI note generation, quizzes, and progress tracking.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.04, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate('/upload')}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-[0_0_30px_rgba(124,58,237,0.4)]"
                        >
                            <Sparkles size={18} /> Upload Your First Syllabus
                        </motion.button>
                    </div>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {/* Upload card always first */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -3 }}
                        onClick={() => navigate('/upload')}
                        className="cursor-pointer group"
                    >
                        <div className="glass rounded-2xl p-5 border-2 border-dashed border-white/[0.1] hover:border-violet-500/40 transition-all min-h-[200px] flex flex-col items-center justify-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-violet-600/10 group-hover:bg-violet-600/20 flex items-center justify-center transition-all">
                                <Plus size={24} className="text-violet-400" />
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-white text-sm">Upload New Syllabus</p>
                                <p className="text-xs text-slate-600 mt-1">PDF, TXT or paste text</p>
                            </div>
                        </div>
                    </motion.div>

                    {syllabuses.map((s, i) => {
                        const pct = s.totalTopics ? Math.round(((s.generatedTopics || 0) / s.totalTopics) * 100) : 0;
                        const statusColors = {
                            completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
                            processing: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
                            pending: 'bg-slate-500/15 text-slate-400',
                        };
                        return (
                            <motion.div
                                key={s._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: (i + 1) * 0.06 }}
                                whileHover={{ y: -3 }}
                                className="group"
                            >
                                <Link to={`/notes/${s._id}`} className="block">
                                    <div className="glass rounded-2xl p-5 border border-white/[0.06] hover:border-violet-500/25 transition-all relative overflow-hidden">
                                        {/* Top left gradient accent */}
                                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        {/* Icon + Status */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-11 h-11 bg-gradient-to-br from-violet-600 to-purple-800 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.3)]">
                                                <BookOpen size={19} className="text-white" />
                                            </div>
                                            <div className="flex gap-2 items-center">
                                                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${statusColors[s.status] || statusColors.pending}`}>
                                                    {s.status}
                                                </span>
                                                <button
                                                    onClick={(e) => handleDelete(s._id, e)}
                                                    className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-all"
                                                >
                                                    <Trash2 size={12} className="text-red-400" />
                                                </button>
                                            </div>
                                        </div>

                                        <h3 className="font-bold text-white text-sm mb-1 line-clamp-2 leading-snug">{s.title}</h3>

                                        {/* Progress */}
                                        <div className="mt-4 mb-4">
                                            <div className="flex justify-between text-xs text-slate-600 mb-1.5">
                                                <span>{s.generatedTopics || 0}/{s.totalTopics || 0} notes</span>
                                                <span className="text-violet-400 font-medium">{pct}%</span>
                                            </div>
                                            <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${pct}%` }}
                                                    transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                                                    className="h-full bg-gradient-to-r from-violet-600 to-purple-500 rounded-full"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-700">
                                                <Clock size={11} />
                                                <span>{new Date(s.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <span className="text-xs text-violet-400 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                Continue <ChevronRight size={12} />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
