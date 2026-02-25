import React, { useEffect, useState } from 'react';
import {
    Users, RefreshCw, AlertCircle, UserPlus, Eye, Trash2,
    MoreVertical, DoorOpen, LogOut, Mail, Phone
} from 'lucide-react';
import { getTenants, deleteTenant } from '../../helper/firebase_helper';
import { Button } from '../../components/ui/Button';
import AddTenantModal from './modals/AddTenantModal';
import ViewTenantModal from './modals/ViewTenantModal';
import AssignRoomModal from './modals/AssignRoomModal';
import CheckoutConfirmModal from './modals/CheckoutConfirmModal';

const Tenants = () => {
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAdd, setShowAdd] = useState(false);
    const [viewTenant, setViewTenant] = useState(null);
    const [assignTenant, setAssignTenant] = useState(null);
    const [checkoutTenant, setCheckoutTenant] = useState(null);
    const [menuOpen, setMenuOpen] = useState(null);
    const [filterStatus, setFilterStatus] = useState('');  // '' | 'active' | 'checked_out'

    const fetchTenants = async () => {
        setLoading(true); setError(null);
        try {
            const res = await getTenants();
            setTenants(Array.isArray(res.data) ? res.data : res.data?.tenants ?? []);
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to load tenants.');
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchTenants(); }, []);

    const handleDelete = async (t) => {
        if (!window.confirm(`Delete tenant "${t.full_name}"?`)) return;
        try { await deleteTenant(t.id ?? t._id); fetchTenants(); }
        catch (e) { alert(e.response?.data?.detail || 'Delete failed.'); }
    };

    const displayed = filterStatus
        ? tenants.filter(t => filterStatus === 'active' ? t.status !== 'checked_out' : t.status === 'checked_out')
        : tenants;

    const statusBadge = (t) => {
        const isActive = t.status !== 'checked_out';
        return (
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${isActive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-700/60 text-slate-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                {isActive ? 'Active' : 'Checked Out'}
            </span>
        );
    };

    return (
        <>
            {/* Page Heading */}
            <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-white">Tenants</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage all PG residents.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" className="gap-2 text-slate-400 hover:text-white" onClick={fetchTenants} disabled={loading}>
                        <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
                    </Button>
                    <Button className="gap-2" onClick={() => setShowAdd(true)}>
                        <UserPlus size={16} /> Add Tenant
                    </Button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-2 mb-5">
                {[
                    { value: '', label: 'All' },
                    { value: 'active', label: 'Active' },
                    { value: 'checked_out', label: 'Checked Out' },
                ].map(opt => (
                    <button key={opt.value} onClick={() => setFilterStatus(opt.value)}
                        style={{
                            padding: '5px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 500, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                            background: filterStatus === opt.value ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.05)',
                            color: filterStatus === opt.value ? '#a5b4fc' : 'rgba(148,163,184,0.8)',
                            boxShadow: filterStatus === opt.value ? '0 0 0 1px rgba(99,102,241,0.4)' : 'none',
                        }}>
                        {opt.label}
                    </button>
                ))}
                <span className="text-xs text-slate-500 ml-2">{displayed.length} tenant{displayed.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Loading */}
            {loading && <div className="glass-panel p-12 flex items-center justify-center gap-3"><RefreshCw size={28} className="text-indigo-400 animate-spin" /><p className="text-slate-400 text-sm">Loading tenants...</p></div>}

            {/* Error */}
            {!loading && error && <div className="glass-panel p-8 flex flex-col items-center gap-3 border border-rose-500/20"><AlertCircle size={28} className="text-rose-400" /><p className="text-rose-400 text-sm">{error}</p><Button variant="outline" onClick={fetchTenants}>Retry</Button></div>}

            {/* Empty */}
            {!loading && !error && displayed.length === 0 && (
                <div className="glass-panel p-12 flex flex-col items-center gap-3">
                    <Users size={40} className="text-slate-600" />
                    <p className="text-slate-400 text-sm">No tenants found.</p>
                    <Button className="gap-2" onClick={() => setShowAdd(true)}><UserPlus size={15} /> Add first tenant</Button>
                </div>
            )}

            {/* Table */}
            {!loading && !error && displayed.length > 0 && (
                <div className="glass-panel p-4">
                    <div className="overflow-x-auto">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                    {['Tenant', 'Contact', 'Room', 'Move-in', 'Status', 'Actions'].map(col => (
                                        <th key={col} className="text-xs font-semibold text-slate-400 uppercase tracking-wider"
                                            style={{ padding: '10px 14px', textAlign: col === 'Actions' ? 'center' : 'left' }}>{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {displayed.map((t, i) => (
                                    <tr key={t.id ?? t._id ?? i}
                                        style={{ borderBottom: i < displayed.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                                        className="hover:bg-slate-800/30 transition-colors">

                                        {/* Avatar + Name */}
                                        <td style={{ padding: '13px 14px' }}>
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm flex-shrink-0">
                                                    {(t.full_name || '?')[0].toUpperCase()}
                                                </div>
                                                <span className="text-sm font-medium text-white">{t.full_name || '—'}</span>
                                            </div>
                                        </td>

                                        {/* Contact */}
                                        <td style={{ padding: '13px 14px' }}>
                                            <div className="flex flex-col gap-1">
                                                {t.email && <span className="flex items-center gap-1 text-xs text-slate-300"><Mail size={11} className="text-slate-500" /> {t.email}</span>}
                                                {t.phone && <span className="flex items-center gap-1 text-xs text-slate-400"><Phone size={11} className="text-slate-500" /> {t.phone}</span>}
                                                {!t.email && !t.phone && <span className="text-xs text-slate-500">—</span>}
                                            </div>
                                        </td>

                                        {/* Room */}
                                        <td style={{ padding: '13px 14px' }}>
                                            {t.room_number || t.room_id
                                                ? <span className="inline-flex items-center gap-1 text-xs bg-indigo-500/15 text-indigo-400 px-2 py-0.5 rounded-full font-medium"><DoorOpen size={11} /> {t.room_number ?? t.room_id}</span>
                                                : <span className="text-xs text-slate-500">No room</span>
                                            }
                                        </td>

                                        {/* Move-in */}
                                        <td style={{ padding: '13px 14px' }}>
                                            <span className="text-xs text-slate-300">{t.move_in_date || '—'}</span>
                                        </td>

                                        {/* Status */}
                                        <td style={{ padding: '13px 14px' }}>{statusBadge(t)}</td>

                                        {/* Actions */}
                                        <td style={{ padding: '13px 14px', textAlign: 'center' }}>
                                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                                <button onClick={() => setMenuOpen(menuOpen === (t.id ?? i) ? null : (t.id ?? i))}
                                                    className="text-slate-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-700/50">
                                                    <MoreVertical size={15} />
                                                </button>
                                                {menuOpen === (t.id ?? i) && (
                                                    <div style={{ position: 'absolute', right: 0, top: '110%', zIndex: 50, minWidth: '150px', background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', padding: '6px' }}>
                                                        <button onClick={() => { setMenuOpen(null); setViewTenant(t); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-indigo-500/20 rounded-lg transition-colors">
                                                            <Eye size={13} className="text-indigo-400" /> View
                                                        </button>
                                                        <button onClick={() => { setMenuOpen(null); setAssignTenant(t); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-emerald-500/20 rounded-lg transition-colors">
                                                            <DoorOpen size={13} className="text-emerald-400" /> Assign Room
                                                        </button>
                                                        {t.status !== 'checked_out' && (
                                                            <button onClick={() => { setMenuOpen(null); setCheckoutTenant(t); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-amber-500/20 rounded-lg transition-colors">
                                                                <LogOut size={13} className="text-amber-400" /> Checkout
                                                            </button>
                                                        )}
                                                        <button onClick={() => { setMenuOpen(null); handleDelete(t); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-rose-500/20 rounded-lg transition-colors">
                                                            <Trash2 size={13} className="text-rose-400" /> Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modals */}
            {showAdd && <AddTenantModal onClose={() => setShowAdd(false)} onSuccess={() => { setShowAdd(false); fetchTenants(); }} />}
            {viewTenant && <ViewTenantModal tenant={viewTenant} onClose={() => setViewTenant(null)} onUpdated={() => { setViewTenant(null); fetchTenants(); }} />}
            {assignTenant && <AssignRoomModal tenant={assignTenant} onClose={() => setAssignTenant(null)} onSuccess={() => { setAssignTenant(null); fetchTenants(); }} />}
            {checkoutTenant && <CheckoutConfirmModal tenant={checkoutTenant} onClose={() => setCheckoutTenant(null)} onSuccess={() => { setCheckoutTenant(null); fetchTenants(); }} />}
        </>
    );
};

export default Tenants;
