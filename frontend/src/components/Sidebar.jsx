import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Upload, ChevronLeft, ChevronRight,
    Brain, Sparkles, LogOut, Shield, Sun, Moon, Search,
    Flame, Zap, BarChart3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useGamification } from '../context/GamificationContext';

const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/upload', icon: Upload, label: 'Upload Syllabus' },
];

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
    const { user, logout, isAdmin } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { level, streak, xp, xpProgress } = useGamification();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const sidebarContent = (
        <div className="flex flex-col h-full">
            {/* ─── Logo ─── */}
            <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.05]">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center flex-shrink-0 shadow-[0_0_16px_rgba(124,58,237,0.45)]">
                    <Brain size={18} className="text-white" />
                </div>
                <AnimatePresence>
                    {(!collapsed || mobileOpen) && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <span className="font-black text-white text-lg tracking-tight gradient-text">NoteAI</span>
                            <div className="flex items-center gap-1 mt-0.5">
                                <Sparkles size={9} className="text-violet-400" />
                                <span className="text-[10px] text-violet-400/80 font-medium">Powered by LLaMA 3.3</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                {mobileOpen && (
                    <button onClick={onMobileClose} className="ml-auto text-slate-500 hover:text-white transition-colors">
                        <ChevronLeft size={18} />
                    </button>
                )}
            </div>

            {/* ─── Search hint ─── */}
            {(!collapsed || mobileOpen) && (
                <button
                    onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }))}
                    className="mx-3 mt-3 flex items-center gap-2 px-3 py-2 rounded-xl text-slate-600 hover:text-white hover:bg-white/[0.05] transition-all text-xs border border-white/[0.05]"
                >
                    <Search size={13} />
                    <span>Search…</span>
                    <kbd className="ml-auto text-[10px] bg-white/[0.07] rounded px-1.5 py-0.5">Ctrl+K</kbd>
                </button>
            )}

            {/* ─── Nav ─── */}
            <nav className="flex-1 px-3 py-4 space-y-0.5">
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        onClick={onMobileClose}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive
                                ? 'text-violet-300'
                                : 'text-slate-500 hover:text-white hover:bg-white/[0.05]'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {/* Active left-accent bar */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeNavBar"
                                        className="absolute left-0 top-1 bottom-1 w-0.5 bg-gradient-to-b from-violet-400 to-purple-600 rounded-r-full"
                                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                    />
                                )}
                                {/* Active bg glow */}
                                {isActive && (
                                    <div className="absolute inset-0 bg-violet-600/10 rounded-xl" />
                                )}
                                <Icon size={18} className="relative z-10 flex-shrink-0" />
                                <AnimatePresence>
                                    {(!collapsed || mobileOpen) && (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="relative z-10 text-sm font-medium"
                                        >
                                            {label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* ─── User Info / XP ─── */}
            <div className="px-3 py-3 border-t border-white/[0.05] space-y-1">
                {(!collapsed || mobileOpen) && user && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-3 py-3 rounded-xl bg-white/[0.03] mb-2">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600/40 to-purple-600/40 flex items-center justify-center flex-shrink-0">
                                {isAdmin ? <Shield size={14} className="text-violet-300" /> : <span className="text-sm font-black text-violet-300">{user.name?.[0]?.toUpperCase()}</span>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                                <p className="text-[10px] text-slate-600 truncate">{isAdmin ? 'Admin' : user.email}</p>
                            </div>
                        </div>

                        {/* XP + Level + Streak row */}
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-violet-400 bg-violet-600/15 px-2 py-0.5 rounded-md">Lv.{level}</span>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                    <Zap size={10} className="text-amber-400" /> {xp} XP
                                </span>
                                {streak > 0 && (
                                    <span className="text-xs text-amber-400 flex items-center gap-0.5">
                                        <Flame size={10} /> {streak}d
                                    </span>
                                )}
                            </div>
                        </div>
                        {/* XP progress bar */}
                        <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                            <motion.div
                                animate={{ width: `${xpProgress * 100}%` }}
                                transition={{ duration: 0.8 }}
                                className="h-full bg-gradient-to-r from-violet-600 to-purple-400 rounded-full"
                            />
                        </div>
                        <p className="text-[10px] text-slate-700 mt-1 text-right">{Math.round(xpProgress * 100)}% to next level</p>
                    </motion.div>
                )}

                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    title="Toggle light/dark mode"
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-slate-600 hover:text-amber-400 hover:bg-amber-500/8 transition-all"
                >
                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    {(!collapsed || mobileOpen) && <span className="text-xs">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
                </button>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-slate-600 hover:text-red-400 hover:bg-red-500/8 transition-all"
                >
                    <LogOut size={16} />
                    {(!collapsed || mobileOpen) && <span className="text-xs">Logout</span>}
                </button>

                {/* Collapse toggle (desktop only) */}
                <button
                    onClick={onToggle}
                    className="w-full hidden md:flex items-center justify-center gap-2 px-3 py-2 mt-1 rounded-xl text-slate-700 hover:text-white hover:bg-white/[0.05] transition-all"
                >
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    {!collapsed && <span className="text-xs text-slate-600">Collapse</span>}
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop sidebar */}
            <motion.aside
                animate={{ width: collapsed ? 72 : 240 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="fixed left-0 top-0 h-full z-40 bg-[#0e0e13] border-r border-white/[0.05] hidden md:flex flex-col"
                style={{ minWidth: collapsed ? 72 : 240 }}
            >
                {sidebarContent}
            </motion.aside>

            {/* Mobile overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black z-40 md:hidden"
                            onClick={onMobileClose}
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed left-0 top-0 h-full w-64 z-50 bg-[#0e0e13] border-r border-white/[0.05] md:hidden flex flex-col"
                        >
                            {sidebarContent}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
