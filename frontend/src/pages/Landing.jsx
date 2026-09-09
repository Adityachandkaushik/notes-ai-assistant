import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import {
    Brain, Zap, Target, BarChart3, ChevronRight, Sparkles,
    Star, ArrowRight, BookOpen, FlaskConical, Map, Shield,
    Users, FileText, TrendingUp, Clock, CheckCircle
} from 'lucide-react';

/* ---------- Animated counter ---------- */
function Counter({ to, suffix = '' }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });
    const count = useMotionValue(0);
    const rounded = useSpring(count, { stiffness: 80, damping: 20 });
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (inView) count.set(to);
        return rounded.on('change', v => setDisplay(Math.round(v)));
    }, [inView]);

    return <span ref={ref}>{display.toLocaleString()}{suffix}</span>;
}

const features = [
    {
        icon: Brain,
        color: 'from-violet-600 to-purple-700',
        glow: 'rgba(124,58,237,0.3)',
        title: 'AI-Powered Notes',
        desc: 'Transform any syllabus into structured, comprehensive study notes powered by LLaMA 3.3.',
    },
    {
        icon: Map,
        color: 'from-cyan-500 to-blue-600',
        glow: 'rgba(6,182,212,0.3)',
        title: 'Visual Flowcharts',
        desc: 'Auto-generate Mermaid diagrams and concept maps that make complex topics click instantly.',
    },
    {
        icon: Target,
        color: 'from-emerald-500 to-teal-600',
        glow: 'rgba(16,185,129,0.3)',
        title: 'Smart Quizzes',
        desc: 'Adaptive quizzes and flashcards generated from your notes to reinforce learning.',
    },
    {
        icon: BarChart3,
        color: 'from-amber-500 to-orange-600',
        glow: 'rgba(245,158,11,0.3)',
        title: 'Progress Tracking',
        desc: 'XP system, streaks, and detailed analytics to keep you motivated and on track.',
    },
];

const steps = [
    { n: '01', title: 'Upload Syllabus', desc: 'Drop a PDF or paste your syllabus text.' },
    { n: '02', title: 'AI Extracts Topics', desc: 'Our AI identifies and structures all topics.' },
    { n: '03', title: 'Notes Generated', desc: 'Detailed notes, diagrams, and quizzes created.' },
    { n: '04', title: 'Study & Succeed', desc: 'Track progress, quiz yourself, share notes.' },
];

const testimonials = [
    { name: 'Aanya S.', role: 'Engineering Student', stars: 5, text: 'NoteAI turned my 60-page syllabus into perfect notes in minutes. My GPA went from 3.1 to 3.8!' },
    { name: 'Rohan M.', role: 'Medical Aspirant', stars: 5, text: 'The AI-generated quizzes are insanely accurate. I feel like I have a personal tutor 24/7.' },
    { name: 'Priya K.', role: 'MBA Student', stars: 5, text: 'The flowcharts alone are worth it. Complex management concepts finally make sense visually.' },
];

export default function Landing() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white font-sans overflow-x-hidden">
            {/* Ambient background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-600/8 rounded-full blur-[120px]" />
            </div>

            {/* ─── NAV ─── */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center glow-brand">
                        <Brain size={18} className="text-white" />
                    </div>
                    <span className="font-black text-white text-xl tracking-tight">NoteAI</span>
                </div>
                <div className="hidden md:flex items-center gap-1 px-4 py-2 rounded-2xl glass border border-white/[0.08]">
                    {['Features', 'How It Works', 'Testimonials'].map(item => (
                        <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                            className="px-4 py-1.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all">
                            {item}
                        </a>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/login" className="text-slate-400 hover:text-white text-sm transition-colors">Sign In</Link>
                    <Link to="/signup"
                        className="bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(124,58,237,0.35)] flex items-center gap-1.5">
                        Get Started <ArrowRight size={14} />
                    </Link>
                </div>
            </nav>

            {/* ─── HERO ─── */}
            <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 backdrop-blur-sm">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-sm text-violet-300 font-medium">✦ Powered by LLaMA 3.3 · Now with Flashcards & Quizzes</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6 max-w-5xl mx-auto">
                        Turn Your Syllabus Into
                        <span className="block gradient-text mt-1">AI Study Notes</span>
                        <span className="block text-white"> in Seconds.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Upload any syllabus and watch AI transform it into structured notes, visual flowcharts, adaptive quizzes, and flashcards — personalized for how you study.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/signup">
                            <motion.button
                                whileHover={{ scale: 1.04, y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all shadow-[0_0_40px_rgba(124,58,237,0.4)]"
                            >
                                <Sparkles size={18} /> Start for Free
                            </motion.button>
                        </Link>
                        <a href="#how-it-works">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 glass border border-white/[0.1] text-white font-semibold px-8 py-4 rounded-2xl text-base transition-all hover:bg-white/[0.08]"
                            >
                                See How It Works <ChevronRight size={16} />
                            </motion.button>
                        </a>
                    </div>

                    {/* Social proof */}
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <div className="flex -space-x-2">
                            {['A', 'R', 'P', 'J', 'K'].map((l, i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0a0a0f] bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-xs font-bold text-white">
                                    {l}
                                </div>
                            ))}
                        </div>
                        <div className="text-left ml-1">
                            <div className="flex text-amber-400 gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}</div>
                            <p className="text-xs text-slate-500">Loved by 2,000+ students</p>
                        </div>
                    </div>
                </motion.div>

                {/* Hero visual */}
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="relative mt-16 w-full max-w-4xl mx-auto"
                >
                    <div className="glass-strong rounded-3xl border border-white/[0.08] p-6 shadow-[0_0_80px_rgba(124,58,237,0.15)]">
                        {/* Mock dashboard preview */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-3 h-3 rounded-full bg-red-500/60" />
                            <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                            <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                            <div className="flex-1 mx-4 h-6 bg-white/[0.04] rounded-lg flex items-center px-3">
                                <span className="text-xs text-slate-600">noteai.app/notes/cs101</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-1 space-y-2">
                                {['Introduction', 'Data Types', 'Control Flow', 'Functions', 'OOP'].map((t, i) => (
                                    <div key={t} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all
                                        ${i === 2 ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30' : 'text-slate-500 hover:bg-white/[0.04]'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${i < 2 ? 'bg-emerald-400' : i === 2 ? 'bg-cyan-400' : 'bg-slate-600'}`} />
                                        {t}
                                    </div>
                                ))}
                            </div>
                            <div className="col-span-2 bg-[#0e0e13] rounded-2xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-bold text-white">Control Flow</span>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full border border-violet-500/40 text-violet-300 font-medium">✦ AI GENERATED</span>
                                </div>
                                <div className="space-y-2">
                                    {['Overview', 'Key Concepts', 'Real-World Examples', 'Key Terms'].map(s => (
                                        <div key={s} className="flex items-center gap-2">
                                            <div className="w-1 h-4 bg-gradient-to-b from-violet-500 to-transparent rounded-full" />
                                            <div className="h-2 bg-white/[0.06] rounded-full flex-1" />
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 flex gap-2">
                                    {['📝 Notes', '📊 Diagram', '🎯 Quiz', '🃏 Flashcards'].map(tab => (
                                        <span key={tab} className={`text-xs px-2.5 py-1 rounded-lg ${tab.includes('Notes') ? 'bg-violet-600/20 text-violet-300' : 'text-slate-600'}`}>{tab}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Floating badge */}
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute -top-4 -right-4 glass border border-emerald-500/30 bg-emerald-500/10 rounded-2xl px-4 py-2.5 flex items-center gap-2 shadow-lg"
                    >
                        <CheckCircle size={16} className="text-emerald-400" />
                        <span className="text-sm font-semibold text-white">14 topics extracted!</span>
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                        className="absolute -bottom-4 -left-4 glass border border-violet-500/30 bg-violet-500/10 rounded-2xl px-4 py-2.5 flex items-center gap-2 shadow-lg"
                    >
                        <Zap size={16} className="text-amber-400" />
                        <span className="text-sm font-semibold text-white">+50 XP earned!</span>
                    </motion.div>
                </motion.div>
            </section>

            {/* ─── STATS ─── */}
            <section className="py-16 px-6 border-t border-b border-white/[0.05]">
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                        { value: 2000, suffix: '+', label: 'Active Students' },
                        { value: 50000, suffix: '+', label: 'Notes Generated' },
                        { value: 500000, suffix: '+', label: 'Topics Extracted' },
                        { value: 94, suffix: '%', label: 'Avg Quiz Score' },
                    ].map(({ value, suffix, label }) => (
                        <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                            <p className="text-4xl font-black gradient-text mb-1">
                                <Counter to={value} suffix={suffix} />
                            </p>
                            <p className="text-sm text-slate-500">{label}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ─── FEATURES ─── */}
            <section id="features" className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                        <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-3">Features</p>
                        <h2 className="text-4xl md:text-5xl font-black mb-4">Everything you need to <span className="gradient-text">ace your exams</span></h2>
                        <p className="text-slate-400 max-w-xl mx-auto">A complete AI-powered study system built for modern learners.</p>
                    </motion.div>
                    <div className="grid md:grid-cols-2 gap-5">
                        {features.map(({ icon: Icon, color, glow, title, desc }, i) => (
                            <motion.div
                                key={title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -4 }}
                                className="glass rounded-2xl p-6 border border-white/[0.07] hover:border-white/[0.12] transition-all cursor-default group"
                            >
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                                    style={{ boxShadow: `0 0 20px ${glow}` }}>
                                    <Icon size={22} className="text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                                <p className="text-slate-400 leading-relaxed">{desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── HOW IT WORKS ─── */}
            <section id="how-it-works" className="py-24 px-6 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent">
                <div className="max-w-5xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                        <p className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-3">How It Works</p>
                        <h2 className="text-4xl md:text-5xl font-black mb-4">From syllabus to <span className="gradient-text">study-ready</span></h2>
                        <p className="text-slate-400 max-w-xl mx-auto">Four simple steps to transform how you study.</p>
                    </motion.div>
                    <div className="grid md:grid-cols-4 gap-5">
                        {steps.map(({ n, title, desc }, i) => (
                            <motion.div
                                key={n}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.12 }}
                                className="relative text-center glass rounded-2xl p-6 border border-white/[0.07]"
                            >
                                <div className="text-5xl font-black text-white/[0.06] mb-3">{n}</div>
                                <h3 className="font-bold text-white text-base mb-2">{title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                                {i < steps.length - 1 && (
                                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-slate-700 z-10">
                                        <ChevronRight size={20} />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── TESTIMONIALS ─── */}
            <section id="testimonials" className="py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                        <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-3">Testimonials</p>
                        <h2 className="text-4xl md:text-5xl font-black mb-4">Students <span className="gradient-text">love NoteAI</span></h2>
                    </motion.div>
                    <div className="grid md:grid-cols-3 gap-5">
                        {testimonials.map(({ name, role, stars, text }, i) => (
                            <motion.div
                                key={name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass rounded-2xl p-6 border border-white/[0.07]"
                            >
                                <div className="flex text-amber-400 gap-1 mb-4">
                                    {[...Array(stars)].map((_, j) => <Star key={j} size={13} fill="currentColor" />)}
                                </div>
                                <p className="text-slate-300 leading-relaxed mb-4 text-sm">"{text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center font-bold text-white text-sm">
                                        {name[0]}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white text-sm">{name}</p>
                                        <p className="text-xs text-slate-500">{role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA ─── */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative glass-strong rounded-3xl p-12 text-center border border-violet-500/20 overflow-hidden"
                        style={{ boxShadow: '0 0 80px rgba(124,58,237,0.12)' }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-cyan-600/5 pointer-events-none" />
                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center mx-auto mb-6 glow-brand">
                                <Brain size={30} className="text-white" />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black mb-4">Ready to study smarter?</h2>
                            <p className="text-slate-400 max-w-lg mx-auto mb-8 text-lg">
                                Join 2,000+ students already using NoteAI to transform their study habits.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/signup">
                                    <motion.button
                                        whileHover={{ scale: 1.04, y: -2 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-[0_0_40px_rgba(124,58,237,0.4)]"
                                    >
                                        <Sparkles size={18} /> Start Free Today
                                    </motion.button>
                                </Link>
                                <Link to="/login">
                                    <button className="flex items-center gap-2 border border-white/[0.12] text-slate-300 hover:text-white hover:bg-white/[0.06] font-semibold px-8 py-4 rounded-2xl transition-all">
                                        Sign In <ArrowRight size={16} />
                                    </button>
                                </Link>
                            </div>
                            <p className="text-xs text-slate-600 mt-6">Free to use · No credit card required · Instant access</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ─── FOOTER ─── */}
            <footer className="py-8 px-6 border-t border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center">
                        <Brain size={14} className="text-white" />
                    </div>
                    <span className="font-bold text-white">NoteAI</span>
                    <span className="text-slate-600 text-sm ml-2">© {new Date().getFullYear()}</span>
                </div>
                <div className="flex items-center gap-6 text-sm text-slate-500">
                    <a href="#features" className="hover:text-white transition-colors">Features</a>
                    <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
                    <Link to="/login" className="hover:text-white transition-colors">Login</Link>
                    <Link to="/signup" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">Sign Up Free</Link>
                </div>
            </footer>
        </div>
    );
}
