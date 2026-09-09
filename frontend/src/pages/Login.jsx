import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Loader2, Brain, ArrowRight, Sparkles, CheckCircle, Zap, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const features = [
    { icon: Sparkles, text: 'AI-generated notes from any syllabus' },
    { icon: Zap, text: 'Smart quizzes & adaptive flashcards' },
    { icon: BarChart3, text: 'Progress tracking with XP & streaks' },
];

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) { toast.error('Please fill in all fields'); return; }
        setLoading(true);
        try {
            const user = await login(email, password);
            toast.success(`Welcome back, ${user.name}!`);
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#0a0a0f]">
            {/* ─── LEFT BRANDING PANEL ─── */}
            <div className="hidden lg:flex flex-col justify-between w-[42%] relative bg-[#0e0e13] overflow-hidden p-12">
                {/* Ambient glow */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-600/15 rounded-full blur-[80px] translate-x-1/4 translate-y-1/4" />

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center glow-brand">
                        <Brain size={20} className="text-white" />
                    </div>
                    <span className="font-black text-white text-2xl tracking-tight">NoteAI</span>
                </div>

                {/* Center content */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative z-10"
                >
                    <h2 className="text-4xl font-black text-white leading-tight mb-4">
                        Your AI-powered<br />
                        <span className="gradient-text">study companion.</span>
                    </h2>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        Transform hours of studying into minutes of intelligent learning with AI-crafted notes tailored to your syllabus.
                    </p>
                    <div className="space-y-4">
                        {features.map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-violet-600/20 flex items-center justify-center flex-shrink-0">
                                    <Icon size={15} className="text-violet-400" />
                                </div>
                                <span className="text-slate-300 text-sm">{text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Testimonial */}
                    <div className="mt-10 p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                        <p className="text-slate-300 text-sm leading-relaxed mb-3">
                            "NoteAI helped me go from barely passing to top of my class. The AI notes are better than anything I could take manually."
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-xs font-bold text-white">A</div>
                            <div>
                                <p className="text-white text-xs font-semibold">Aanya S.</p>
                                <p className="text-slate-600 text-xs">Engineering Student</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Bottom badge */}
                <div className="relative z-10 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-xs text-slate-500">2,000+ students already learning smarter</span>
                </div>
            </div>

            {/* ─── RIGHT AUTH PANEL ─── */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
                {/* Mobile bg orbs */}
                <div className="lg:hidden fixed inset-0 pointer-events-none">
                    <div className="absolute -top-40 -left-40 w-80 h-80 bg-violet-600/15 rounded-full blur-[100px]" />
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-cyan-600/10 rounded-full blur-[80px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 w-full max-w-md"
                >
                    {/* Mobile logo */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center mx-auto mb-3 glow-brand">
                            <Brain size={24} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-black text-white">NoteAI</h1>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-black text-white mb-2">Welcome back</h2>
                        <p className="text-slate-500">Sign in to continue your learning journey.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email</label>
                            <div className="relative">
                                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full bg-[#0e0e13] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-slate-700 outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                                <a href="#" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-[#0e0e13] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-slate-700 outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <motion.button
                            whileHover={{ scale: 1.02, y: -1 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_30px_rgba(124,58,237,0.35)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
                        >
                            {loading ? <><Loader2 size={18} className="animate-spin" /> Signing in...</> : <><LogIn size={18} /> Sign In</>}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-white/[0.06]" />
                        <span className="text-xs text-slate-600">or</span>
                        <div className="flex-1 h-px bg-white/[0.06]" />
                    </div>

                    {/* Sign up link */}
                    <p className="text-center text-slate-500 text-sm">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                            Create one free <ArrowRight size={12} className="inline" />
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
