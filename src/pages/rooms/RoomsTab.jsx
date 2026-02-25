import React, { useEffect, useState } from 'react';
import { DoorOpen, RefreshCw, AlertCircle, Plus, Eye, Trash2, MoreVertical } from 'lucide-react';
import { getRooms, getBuildings, deleteRoom } from '../../helper/firebase_helper';
import { Button } from '../../components/ui/Button';
import AddRoomModal from './modals/AddRoomModal';
import ViewRoomModal from './modals/ViewRoomModal';

const RoomsTab = () => {
    const [rooms, setRooms] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [filterBuilding, setFilterBuilding] = useState('');
    const [vacantOnly, setVacantOnly] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAdd, setShowAdd] = useState(false);
    const [viewItem, setViewItem] = useState(null);
    const [menuOpen, setMenuOpen] = useState(null);

    const fetchAll = async () => {
        setLoading(true); setError(null);
        try {
            const [rRes, bRes] = await Promise.all([getRooms(), getBuildings()]);
            setRooms(Array.isArray(rRes.data) ? rRes.data : rRes.data?.rooms ?? []);
            setBuildings(Array.isArray(bRes.data) ? bRes.data : bRes.data?.buildings ?? []);
        } catch (e) { setError(e.response?.data?.message || 'Failed to load rooms.'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAll(); }, []);

    const handleDelete = async (r) => {
        if (!window.confirm(`Delete room "${r.room_number}"?`)) return;
        try { await deleteRoom(r.id ?? r._id); fetchAll(); }
        catch (e) { alert(e.response?.data?.detail || 'Delete failed.'); }
    };

    const buildingName = (r) => {
        if (r.building_name) return r.building_name;
        const b = buildings.find(b => (b.id ?? b._id) === (r.building_id ?? r.building));
        return b?.name || '—';
    };

    let displayed = rooms;
    if (filterBuilding) displayed = displayed.filter(r => (r.building_id ?? r.building) === filterBuilding);
    if (vacantOnly) displayed = displayed.filter(r => r.is_vacant !== false && r.status !== 'Occupied');

    const roomTypeColor = (type) => {
        const map = { single: 'bg-sky-500/15 text-sky-400', double: 'bg-indigo-500/15 text-indigo-400', triple: 'bg-purple-500/15 text-purple-400', pg: 'bg-amber-500/15 text-amber-400' };
        return map[type?.toLowerCase()] || 'bg-slate-700/50 text-slate-300';
    };

    const roomTypeLabel = (type) => {
        const map = { single: 'Single', double: 'Double', triple: 'Triple', pg: 'PG' };
        return map[type?.toLowerCase()] || type || '—';
    };

    return (
        <>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm text-slate-400">{displayed.length} room{displayed.length !== 1 ? 's' : ''}</p>
                    <select value={filterBuilding} onChange={e => setFilterBuilding(e.target.value)}
                        className="input-field text-xs" style={{ padding: '6px 10px', cursor: 'pointer', minWidth: '160px' }}>
                        <option value="">All Buildings</option>
                        {buildings.map(b => <option key={b.id ?? b._id} value={b.id ?? b._id}>{b.name}</option>)}
                    </select>
                    {/* Vacant toggle */}
                    <label className="flex items-center gap-2 cursor-pointer">
                        <div onClick={() => setVacantOnly(v => !v)}
                            style={{ width: '36px', height: '20px', borderRadius: '10px', background: vacantOnly ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.1)', position: 'relative', transition: 'background 0.2s', cursor: 'pointer', flexShrink: 0 }}>
                            <div style={{ position: 'absolute', top: '3px', left: vacantOnly ? '18px' : '3px', width: '14px', height: '14px', borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
                        </div>
                        <span className="text-xs text-slate-400">Vacant only</span>
                    </label>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" className="gap-2 text-slate-400 hover:text-white" onClick={fetchAll} disabled={loading}>
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
                    </Button>
                    <Button className="gap-2" onClick={() => setShowAdd(true)}><Plus size={15} /> Add Room</Button>
                </div>
            </div>

            {loading && <div className="glass-panel p-10 flex items-center justify-center gap-3"><RefreshCw size={24} className="text-indigo-400 animate-spin" /><p className="text-slate-400 text-sm">Loading...</p></div>}
            {!loading && error && <div className="glass-panel p-8 flex flex-col items-center gap-3 border border-rose-500/20"><AlertCircle size={28} className="text-rose-400" /><p className="text-rose-400 text-sm">{error}</p><Button variant="outline" onClick={fetchAll}>Retry</Button></div>}
            {!loading && !error && displayed.length === 0 && (
                <div className="glass-panel p-12 flex flex-col items-center gap-3">
                    <DoorOpen size={36} className="text-slate-600" />
                    <p className="text-slate-400 text-sm">No rooms found.</p>
                    <Button className="gap-2" onClick={() => setShowAdd(true)}><Plus size={14} /> Add first room</Button>
                </div>
            )}
            {!loading && !error && displayed.length > 0 && (
                <div className="glass-panel p-4">
                    <div className="overflow-x-auto">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                    {['Room', 'Building', 'Type', 'Floor', 'Capacity', 'Rent/mo', 'Status', 'Actions'].map(col => (
                                        <th key={col} className="text-xs font-semibold text-slate-400 uppercase tracking-wider"
                                            style={{ padding: '10px 14px', textAlign: col === 'Actions' ? 'center' : 'left' }}>{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {displayed.map((r, i) => {
                                    const isVacant = r.is_vacant !== false && r.status !== 'Occupied';
                                    return (
                                        <tr key={r.id ?? r._id ?? i}
                                            style={{ borderBottom: i < displayed.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                                            className="hover:bg-slate-800/30 transition-colors">
                                            <td style={{ padding: '12px 14px' }}>
                                                <div className="flex items-center gap-2">
                                                    <DoorOpen size={14} className="text-indigo-400 flex-shrink-0" />
                                                    <span className="text-sm font-medium text-white">{r.room_number}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '12px 14px' }}><span className="text-xs text-slate-300">{buildingName(r)}</span></td>
                                            <td style={{ padding: '12px 14px' }}>
                                                <span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${roomTypeColor(r.room_type)}`}>
                                                    {r.room_type || '—'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px 14px' }}><span className="text-xs text-slate-300">{r.floor ?? '—'}</span></td>
                                            <td style={{ padding: '12px 14px' }}><span className="text-xs text-slate-300">{r.capacity ?? '—'}</span></td>
                                            <td style={{ padding: '12px 14px' }}><span className="text-xs text-slate-300">{r.rent_amount ? `₹${r.rent_amount}` : '—'}</span></td>
                                            <td style={{ padding: '12px 14px' }}>
                                                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${isVacant ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${isVacant ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                                                    {isVacant ? 'Vacant' : 'Occupied'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                                    <button onClick={() => setMenuOpen(menuOpen === (r.id ?? i) ? null : (r.id ?? i))}
                                                        className="text-slate-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-700/50">
                                                        <MoreVertical size={15} />
                                                    </button>
                                                    {menuOpen === (r.id ?? i) && (
                                                        <div style={{ position: 'absolute', right: 0, top: '110%', zIndex: 50, minWidth: '120px', background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', padding: '6px' }}>
                                                            <button onClick={() => { setMenuOpen(null); setViewItem(r); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-indigo-500/20 rounded-lg transition-colors">
                                                                <Eye size={13} className="text-indigo-400" /> View
                                                            </button>
                                                            <button onClick={() => { setMenuOpen(null); handleDelete(r); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-rose-500/20 rounded-lg transition-colors">
                                                                <Trash2 size={13} className="text-rose-400" /> Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showAdd && <AddRoomModal onClose={() => setShowAdd(false)} onSuccess={() => { setShowAdd(false); fetchAll(); }} />}
            {viewItem && <ViewRoomModal room={viewItem} onClose={() => setViewItem(null)} onUpdated={() => { setViewItem(null); fetchAll(); }} />}
        </>
    );
};

export default RoomsTab;
