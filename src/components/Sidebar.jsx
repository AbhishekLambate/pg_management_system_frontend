import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';
import { Users, CreditCard, Home, Settings, LogOut, UserCircle2, DoorOpen, Briefcase, AlertTriangle, TrendingDown, ClipboardList, Megaphone, Sun, Moon } from 'lucide-react';

const navItems = [
    { to: '/', label: 'Dashboard', icon: Home, end: true },
    { to: '/rooms', label: 'Rooms', icon: DoorOpen },
    { to: '/tenants', label: 'Tenants', icon: Users },
    { to: '/payments', label: 'Payments', icon: CreditCard },
    { to: '/staff', label: 'Staff', icon: Briefcase },
    { to: '/complaints', label: 'Complaints', icon: AlertTriangle },
    { to: '/expenses', label: 'Expenses', icon: TrendingDown },
    { to: '/visitors', label: 'Visitors', icon: ClipboardList },
    { to: '/notices', label: 'Notice Board', icon: Megaphone },
    { to: '/users', label: 'Admin Users', icon: UserCircle2 },
    { to: '/settings', label: 'Settings', icon: Settings },
];

const Sidebar = () => {
    const { user, logout } = useAuth();
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        // Initialize theme from local storage or default to dark
        const savedTheme = localStorage.getItem('theme') || 'dark';
        if (savedTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            setIsDark(false);
        } else {
            document.documentElement.removeAttribute('data-theme');
            setIsDark(true);
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    };

    return (
        <aside className="sidebar glass-panel">
            {/* Logo / Brand */}
            <div className="p-4 border-b-theme">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Home className="text-indigo-500" /> PG Manager
                </h2>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4 flex flex-col gap-1">
                {navItems.filter(item => {
                    if (user?.role?.toLowerCase() !== 'admin' && (item.label === 'Admin Users' || item.label === 'Tenants')) return false;
                    return true;
                }).map(({ to, label, icon: Icon, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        style={{ textDecoration: 'none' }}
                    >
                        {({ isActive }) => (
                            <button className={`nav-btn ${isActive ? 'active' : ''}`}>
                                <Icon size={18} />
                                {label}
                            </button>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* User Profile & Footer Actions */}
            <div className="p-4 border-t-theme flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-2 px-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold" style={{ color: 'white' }}>
                        {user?.name?.[0]}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    </div>
                </div>
                
                <button onClick={toggleTheme} className="theme-toggle-btn">
                    {isDark ? <Sun size={16} /> : <Moon size={16} />} 
                    <span className="text-sm">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                
                <Button variant="outline" className="w-full gap-2 mt-2" onClick={logout}>
                    <LogOut size={16} /> Logout
                </Button>
            </div>
        </aside>
    );
};

export default Sidebar;
