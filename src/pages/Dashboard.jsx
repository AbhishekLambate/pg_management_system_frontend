import React from 'react';
import { Users, CreditCard, Home } from 'lucide-react';

const Dashboard = () => {
    const stats = [
        { label: 'Total Occupancy', value: '85%', subtext: '+5% from last month', icon: Users },
        { label: 'Revenue (Monthly)', value: '₹1.2L', subtext: 'Pending: ₹15k', icon: CreditCard },
        { label: 'Available Beds', value: '12', subtext: 'Total: 80', icon: Home },
    ];

    return (
        <>
            {/* Page Heading */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
                <p className="text-slate-400">Welcome back, here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                {stats.map((stat, i) => (
                    <div key={i} className="glass-panel p-6 stat-card">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                            </div>
                            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                                <stat.icon size={20} />
                            </div>
                        </div>
                        <p className="text-xs text-slate-500">{stat.subtext}</p>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="glass-panel p-6 mt-6">
                <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
                <div className="flex flex-col gap-4">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-400">
                                    <Users size={18} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-white">New Tenant Registered</h4>
                                    <p className="text-xs text-slate-400">Rahul Kumar added to Room 104</p>
                                </div>
                            </div>
                            <span className="text-xs text-slate-500">2h ago</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Dashboard;
