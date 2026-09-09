import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Brain, CheckCircle, Star, Loader2, ArrowLeft, ChevronRight, X, Calendar, Zap, Target } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

// Flashcard component
function FlashCard({ term, definition }) {
    const [flipped, setFlipped] = useState(false);
    return (
        <div className="flip-card w-full h-44 cursor-pointer" onClick={() => setFlipped(f => !f)}>
            <div className={`flip-card-inner relative w-full h-full ${flipped ? 'flipped' : ''}`}>
                {/* Front */}
                <div className="flip-card-front absolute inset-0 glass rounded-2xl border border-white/[0.08] flex flex-col items-center justify-center p-6 text-center">
                    <span className="text-xs text-violet-400 mb-2 font-medium uppercase tracking-wider">Term</span>
                    <p className="text-white font-bold text-lg">{term}</p>
                    <span className="text-xs text-slate-600 mt-3">Click to reveal</span>
                </div>
                {/* Back */}
                <div className="flip-card-back absolute inset-0 glass-strong rounded-2xl border border-violet-500/30 flex flex-col items-center justify-center p-6 text-center">
                    <span className="text-xs text-violet-400 mb-2 font-medium uppercase tracking-wider">Definition</span>
                    <p className="text-slate-300 text-sm leading-relaxed">{definition}</p>
                </div>
            </div>
        </div>
    );
}

// Quiz component
function QuizModal({ questions, onClose, syllabusId }) {
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [done, setDone] = useState(false);

    const submitScore = async (finalScore) => {
        try {
            await api.post(`/progress/${syllabusId}/quiz-score`, { score: finalScore, total: questions.length });
        } catch { }
    };

    const handleAnswer = (idx) => {
        if (answered) return;
        setSelected(idx);
        setAnswered(true);
        const correct = idx === questions[current].correctIndex;
        if (correct) setScore(s => s + 1);
    };

    const next = () => {
        if (current < questions.length - 1) {
            setCurrent(c => c + 1);
            setSelected(null);
            setAnswered(false);
        } else {
            setDone(true);
            submitScore(score + (selected === questions[current].correctIndex ? 1 : 0));
        }
    };

    const q = questions[current];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-strong rounded-2xl border border-violet-500/20 w-full max-w-lg p-6 shadow-[0_0_60px_rgba(124,58,237,0.2)]"
            >
                <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-white flex items-center gap-2"><Brain size={18} className="text-violet-400" /> Quiz Time</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X size={18} /></button>
                </div>

                {!done ? (
                    <>
                        {/* Progress */}
                        <div className="flex items-center gap-2 mb-5">
                            <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                                <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${((current) / questions.length) * 100}%` }} />
                            </div>
                            <span className="text-xs text-slate-500">{current + 1}/{questions.length}</span>
                        </div>

                        <p className="text-white font-semibold mb-4 text-base">{q.question}</p>

                        <div className="space-y-2 mb-4">
                            {q.options.map((opt, i) => {
                                let cls = 'border-white/[0.08] text-slate-300 hover:border-violet-500/40';
                                if (answered) {
                                    if (i === q.correctIndex) cls = 'border-emerald-500/60 bg-emerald-600/10 text-emerald-300';
                                    else if (i === selected && i !== q.correctIndex) cls = 'border-red-500/60 bg-red-600/10 text-red-300';
                                    else cls = 'border-white/[0.04] text-slate-600';
                                }
                                return (
                                    <button key={i} onClick={() => handleAnswer(i)}
                                        className={`w-full text-left p-3 rounded-xl border glass text-sm transition-all ${cls}`}>
                                        <span className="font-medium mr-2 text-slate-500">{String.fromCharCode(65 + i)}.</span> {opt}
                                    </button>
                                );
                            })}
                        </div>

                        {answered && (
                            <div className="mb-4 p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                                <p className="text-xs text-slate-500">{q.explanation}</p>
                            </div>
                        )}

                        {answered && (
                            <button onClick={next} className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-2.5 rounded-xl transition-all text-sm flex items-center justify-center gap-1">
                                {current < questions.length - 1 ? 'Next Question' : 'See Results'}
                                <ChevronRight size={15} />
                            </button>
                        )}
                    </>
                ) : (
                    <div className="text-center py-4">
                        <div className="w-16 h-16 bg-violet-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Star size={28} className="text-violet-400" />
                        </div>
                        <p className="text-3xl font-black text-white mb-1">{score}/{questions.length}</p>
                        <p className="text-slate-500 mb-2">
                            {score / questions.length >= 0.8 ? '🎉 Excellent!' : score / questions.length >= 0.6 ? '👍 Good job!' : '📚 Keep practicing!'}
                        </p>
                        <button onClick={onClose} className="mt-4 bg-violet-600 text-white font-semibold px-5 py-2.5 rounded-xl">Done</button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}

export default function Progress() {
    const { syllabusId } = useParams();
    const [quizQuestions, setQuizQuestions] = useState(null);
    const [quizLoading, setQuizLoading] = useState(false);

    const { data: syllabusData } = useQuery({
        queryKey: ['syllabus', syllabusId],
        queryFn: () => api.get(`/syllabus/${syllabusId}`).then(r => r.data.data),
    });

    const { data: progressData } = useQuery({
        queryKey: ['progress', syllabusId],
        queryFn: () => api.get(`/progress/${syllabusId}`).then(r => r.data.data),
    });

    const { data: notesData } = useQuery({
        queryKey: ['all-notes', syllabusId],
        queryFn: () => api.get(`/notes/syllabus/${syllabusId}`).then(r => r.data.data),
    });

    const syllabus = syllabusData;
    const topics = syllabus?.topics || [];
    const completedTopics = progressData?.completedTopics || [];
    const quizScores = progressData?.quizScores || [];
    const allNotes = notesData || [];

    const progressPercent = topics.length ? Math.round((completedTopics.length / topics.length) * 100) : 0;

    // Study Planner calculations
    let daysLeft = null;
    let topicsLeft = topics.length - completedTopics.length;
    let topicsPerDay = 0;

    if (syllabus?.examDate) {
        const diff = new Date(syllabus.examDate) - new Date();
        daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
        if (daysLeft > 0 && topicsLeft > 0) {
            topicsPerDay = Math.ceil(topicsLeft / daysLeft);
        }
    }

    // Collect all flashcard terms from notes
    const allTerms = allNotes.flatMap(n => n.keyTerms || []).filter(t => t.term && t.definition);

    const startQuiz = async () => {
        setQuizLoading(true);
        try {
            const { data } = await api.post(`/chat/quiz/${syllabusId}`);
            setQuizQuestions(data.data);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Could not generate quiz. Generate some notes first!');
        } finally {
            setQuizLoading(false);
        }
    };

    return (
        <div className="min-h-screen gradient-bg p-6 md:p-8">
            {quizQuestions && (
                <QuizModal questions={quizQuestions} onClose={() => setQuizQuestions(null)} syllabusId={syllabusId} />
            )}

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <Link to={`/notes/${syllabusId}`} className="p-2 rounded-xl bg-white/[0.05] border border-white/[0.07] text-slate-500 hover:text-white hover:bg-white/[0.08] transition-all">
                        <ArrowLeft size={16} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-white">Study Progress</h1>
                        <p className="text-slate-500 text-sm">{syllabus?.title}</p>
                    </div>
                </div>

                {/* Automated Study Planner Alert */}
                {syllabus?.examDate && topicsLeft > 0 && daysLeft !== null && (
                    <div className="mb-8 glass-strong rounded-2xl p-6 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Calendar size={24} className="text-amber-400" />
                            </div>
                            <div>
                                <h3 className="text-amber-400 font-bold flex items-center gap-2">Study Planner Active</h3>
                                {daysLeft > 0 ? (
                                    <p className="text-slate-300 text-sm mt-1">
                                        Your exam is in <strong className="text-white">{daysLeft} days</strong>. You have <strong className="text-white">{topicsLeft} topics</strong> left to study.
                                    </p>
                                ) : (
                                    <p className="text-red-400 text-sm mt-1 font-semibold">
                                        Exam is today or past due! Finish your remaining {topicsLeft} topics immediately.
                                    </p>
                                )}
                            </div>
                        </div>
                        {daysLeft > 0 && (
                            <div className="bg-black/20 px-5 py-3 rounded-xl border border-white/[0.06] text-center md:text-right">
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Recommended Pace</p>
                                <p className="text-2xl font-black text-white">{topicsPerDay} <span className="text-sm font-normal text-slate-400">topics / day</span></p>
                            </div>
                        )}
                    </div>
                )}

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Topics Completed', value: completedTopics.length, total: topics.length, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-600/15', glow: 'rgba(16,185,129,0.15)', accent: 'from-emerald-600/15 to-transparent' },
                        { label: 'Study Progress', value: `${progressPercent}%`, icon: TrendingUp, color: 'text-violet-400', bg: 'bg-violet-600/15', glow: 'rgba(124,58,237,0.15)', accent: 'from-violet-600/15 to-transparent' },
                        { label: 'Flashcards', value: allTerms.length, icon: Star, color: 'text-cyan-400', bg: 'bg-cyan-600/15', glow: 'rgba(6,182,212,0.15)', accent: 'from-cyan-600/15 to-transparent' },
                        { label: 'Quizzes Taken', value: quizScores.length, icon: Target, color: 'text-pink-400', bg: 'bg-pink-600/15', glow: 'rgba(236,72,153,0.15)', accent: 'from-pink-600/15 to-transparent' },
                    ].map(({ label, value, total, icon: Icon, color, bg, glow, accent }) => (
                        <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                            className="relative overflow-hidden glass rounded-2xl p-5 border border-white/[0.06] hover:border-white/[0.1] transition-all"
                            style={{ boxShadow: `0 0 24px ${glow}` }}>
                            <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-60 pointer-events-none`} />
                            <div className="relative z-10">
                                <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                                    <Icon size={16} className={color} />
                                </div>
                                <p className={`text-3xl font-black ${color}`}>{value}</p>
                                <p className="text-slate-500 text-xs mt-1 font-medium">{label}</p>
                                {total !== undefined && <p className="text-slate-700 text-[10px] mt-0.5">of {total} topics</p>}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Progress + Topics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Topic Progress list */}
                    <div className="glass rounded-2xl p-6 border border-white/[0.06]">
                        <h3 className="font-bold text-white mb-5 flex items-center gap-2">
                            <div className="w-7 h-7 bg-violet-600/15 rounded-lg flex items-center justify-center">
                                <TrendingUp size={14} className="text-violet-400" />
                            </div>
                            Topic Progress
                        </h3>
                        <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                            {topics.map((t, i) => {
                                const done = completedTopics.includes(t._id);
                                return (
                                    <div key={t._id} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${done ? 'bg-emerald-500/5' : 'hover:bg-white/[0.02]'}`}>
                                        {done
                                            ? <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
                                            : <div className="w-3.5 h-3.5 rounded-full border border-slate-700 flex-shrink-0" />}
                                        <span className={`text-sm flex-1 ${done ? 'text-slate-500 line-through decoration-slate-700' : 'text-slate-300'}`}>{t.name}</span>
                                        {done && <span className="text-[10px] text-emerald-600 font-medium">Done</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quiz Section */}
                    <div className="glass rounded-2xl p-6 border border-white/[0.06]">
                        <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                            <div className="w-7 h-7 bg-violet-600/15 rounded-lg flex items-center justify-center">
                                <Brain size={14} className="text-violet-400" />
                            </div>
                            AI Quiz
                        </h3>
                        <p className="text-slate-500 text-sm mb-5">Test your knowledge with AI-generated questions from your notes</p>
                        <motion.button
                            whileHover={{ scale: 1.02, y: -1 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={startQuiz}
                            disabled={quizLoading}
                            className="w-full bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 transition-all shadow-[0_0_20px_rgba(124,58,237,0.25)]"
                        >
                            {quizLoading ? <><Loader2 size={16} className="animate-spin" /> Generating Quiz...</> : <><Brain size={16} /> Start AI Quiz</>}
                        </motion.button>

                        {quizScores.length > 0 && (
                            <div className="mt-5 p-4 bg-white/[0.02] rounded-xl border border-white/[0.05]">
                                <p className="text-xs text-slate-600 mb-3 uppercase tracking-wider font-medium">Recent Scores</p>
                                <div className="space-y-2">
                                    {quizScores.slice(-3).reverse().map((s, i) => {
                                        const pct = Math.round((s.score / s.total) * 100);
                                        return (
                                            <div key={i} className="flex justify-between items-center text-xs">
                                                <span className="text-slate-500">Quiz {quizScores.length - i}</span>
                                                <span className={`font-bold ${pct >= 80 ? 'text-emerald-400' : pct >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                                                    {s.score}/{s.total} · {pct}%
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Flashcards */}
                {allTerms.length > 0 && (
                    <div>
                        <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                            <Star size={18} className="text-violet-400" />
                            Flashcards <span className="text-slate-600 text-sm font-normal">({allTerms.length} cards)</span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {allTerms.map((t, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                >
                                    <FlashCard term={t.term} definition={t.definition} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {allTerms.length === 0 && allNotes.length === 0 && (
                    <div className="text-center glass rounded-2xl p-12 border border-white/[0.06]">
                        <p className="text-slate-500">Generate notes for your topics to unlock flashcards and quizzes</p>
                        <Link to={`/notes/${syllabusId}`} className="inline-flex items-center gap-2 mt-4 text-violet-400 hover:text-violet-300 text-sm">
                            Go to Notes <ChevronRight size={14} />
                        </Link>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
