import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';
import { Users, CreditCard, Home, Settings, LogOut, UserCircle2, DoorOpen } from 'lucide-react';

const navItems = [
    { to: '/', label: 'Dashboard', icon: Home, end: true },
    { to: '/users', label: 'Users', icon: UserCircle2 },
    { to: '/rooms', label: 'Rooms', icon: DoorOpen },
    { to: '/tenants', label: 'Tenants', icon: Users },
    { to: '/payments', label: 'Payments', icon: CreditCard },
    { to: '/settings', label: 'Settings', icon: Settings },
];

const Sidebar = () => {
    const { user, logout } = useAuth();

    return (
        <aside className="sidebar glass-panel">
            {/* Logo / Brand */}
            <div className="p-4 border-b border-white/10">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Home className="text-indigo-500" /> PG Manager
                </h2>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4 flex flex-col gap-1">
                {navItems.map(({ to, label, icon: Icon, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        style={{ textDecoration: 'none' }}
                    >
                        {({ isActive }) => (
                            <Button
                                variant="ghost"
                                className={`w-full justify-start gap-3 transition-colors ${isActive
                                    ? 'bg-indigo-500/20 text-indigo-400'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                    }`}
                            >
                                <Icon size={18} />
                                {label}
                            </Button>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white">
                        {user?.name?.[0]}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    </div>
                </div>
                <Button variant="outline" className="w-full gap-2" onClick={logout}>
                    <LogOut size={16} /> Logout
                </Button>
            </div>
        </aside>
    );
};

export default Sidebar;
