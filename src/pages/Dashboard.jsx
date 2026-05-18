import React, { useState, useEffect } from 'react';
import { Users, CreditCard, Home, Activity } from 'lucide-react';
import api_helper from '../helper/api_helper';

const Dashboard = () => {
    const [stats, setStats] = useState({
        total_capacity: 0,
        active_tenants: 0,
        available_beds: 0,
        projected_revenue: 0,
        occupancy_rate: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api_helper.get('/dashboard/stats');
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const displayStats = [
        { 
            label: 'Total Occupancy', 
            value: `${stats.occupancy_rate}%`, 
            subtext: `${stats.active_tenants} Active Tenants`, 
            icon: Users 
        },
        { 
            label: 'Revenue (Monthly)', 
            value: `₹${stats.projected_revenue.toLocaleString()}`, 
            subtext: 'Projected from active tenants', 
            icon: CreditCard 
        },
        { 
            label: 'Available Beds', 
            value: stats.available_beds, 
            subtext: `Out of ${stats.total_capacity} total beds`, 
            icon: Home 
        },
    ];

    if (loading) {
        return <div className="p-8 text-slate-400 flex justify-center"><Activity className="animate-spin" /></div>;
    }

    return (
        <>
            {/* Page Heading */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
                <p className="text-slate-400 mt-2">Welcome back, here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                {displayStats.map((stat, i) => (
                    <div key={i} className="glass-panel p-6 stat-card">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-white mt-2">{stat.value}</h3>
                            </div>
                            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                                <stat.icon size={24} />
                            </div>
                        </div>
                        <p className="text-sm text-slate-500">{stat.subtext}</p>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="glass-panel p-8 mt-8">
                <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
                <div className="flex flex-col gap-4">
                    <div className="text-slate-500 text-center py-8 border border-dashed border-slate-700/50 rounded-xl">
                        Activity logging will appear here soon.
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
