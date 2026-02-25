import React, { useEffect, useState } from 'react';
import { Building2, RefreshCw, AlertCircle, Plus, Eye, Trash2, MoreVertical } from 'lucide-react';
import { getBuildings, getLocations, deleteBuilding } from '../../helper/firebase_helper';
import { Button } from '../../components/ui/Button';
import AddBuildingModal from './modals/AddBuildingModal';
import ViewBuildingModal from './modals/ViewBuildingModal';

const BuildingsTab = () => {
    const [buildings, setBuildings] = useState([]);
    const [locations, setLocations] = useState([]);
    const [filterLoc, setFilterLoc] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAdd, setShowAdd] = useState(false);
    const [viewItem, setViewItem] = useState(null);
    const [menuOpen, setMenuOpen] = useState(null);

    const fetchAll = async () => {
        setLoading(true); setError(null);
        try {
            const [bRes, lRes] = await Promise.all([getBuildings(), getLocations()]);
            setBuildings(Array.isArray(bRes.data) ? bRes.data : bRes.data?.buildings ?? []);
            setLocations(Array.isArray(lRes.data) ? lRes.data : lRes.data?.locations ?? []);
        } catch (e) { setError(e.response?.data?.message || 'Failed to load buildings.'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAll(); }, []);

    const handleDelete = async (b) => {
        if (!window.confirm(`Delete "${b.name}"?`)) return;
        try { await deleteBuilding(b.id ?? b._id); fetchAll(); }
        catch (e) { alert(e.response?.data?.detail || 'Delete failed.'); }
    };

    // Resolve location name from id
    const locName = (b) => {
        if (b.location_name) return b.location_name;
        const l = locations.find(l => (l.id ?? l._id) === (b.location_id ?? b.location));
        return l?.name || '—';
    };

    const filtered = filterLoc ? buildings.filter(b => (b.location_id ?? b.location) === filterLoc) : buildings;

    return (
        <>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                    <p className="text-sm text-slate-400">{filtered.length} building{filtered.length !== 1 ? 's' : ''}</p>
                    {/* Location filter */}
                    <select value={filterLoc} onChange={e => setFilterLoc(e.target.value)}
                        className="input-field text-xs" style={{ padding: '6px 10px', cursor: 'pointer', minWidth: '160px' }}>
                        <option value="">All Locations</option>
                        {locations.map(l => <option key={l.id ?? l._id} value={l.id ?? l._id}>{l.name}</option>)}
                    </select>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" className="gap-2 text-slate-400 hover:text-white" onClick={fetchAll} disabled={loading}>
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
                    </Button>
                    <Button className="gap-2" onClick={() => setShowAdd(true)}><Plus size={15} /> Add Building</Button>
                </div>
            </div>

            {loading && <div className="glass-panel p-10 flex items-center justify-center gap-3"><RefreshCw size={24} className="text-indigo-400 animate-spin" /><p className="text-slate-400 text-sm">Loading...</p></div>}
            {!loading && error && <div className="glass-panel p-8 flex flex-col items-center gap-3 border border-rose-500/20"><AlertCircle size={28} className="text-rose-400" /><p className="text-rose-400 text-sm">{error}</p><Button variant="outline" onClick={fetchAll}>Retry</Button></div>}
            {!loading && !error && filtered.length === 0 && (
                <div className="glass-panel p-12 flex flex-col items-center gap-3">
                    <Building2 size={36} className="text-slate-600" />
                    <p className="text-slate-400 text-sm">No buildings found.</p>
                    <Button className="gap-2" onClick={() => setShowAdd(true)}><Plus size={14} /> Add first building</Button>
                </div>
            )}
            {!loading && !error && filtered.length > 0 && (
                <div className="glass-panel p-4">
                    <div className="overflow-x-auto">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                    {['Building', 'Location', 'Floors', 'Description', 'Actions'].map(col => (
                                        <th key={col} className="text-xs font-semibold text-slate-400 uppercase tracking-wider"
                                            style={{ padding: '10px 14px', textAlign: col === 'Actions' ? 'center' : 'left' }}>{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((b, i) => (
                                    <tr key={b.id ?? b._id ?? i}
                                        style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                                        className="hover:bg-slate-800/30 transition-colors">
                                        <td style={{ padding: '12px 14px' }}>
                                            <div className="flex items-center gap-2">
                                                <Building2 size={14} className="text-indigo-400 flex-shrink-0" />
                                                <span className="text-sm font-medium text-white">{b.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 14px' }}><span className="text-xs text-slate-300">{locName(b)}</span></td>
                                        <td style={{ padding: '12px 14px' }}><span className="text-xs text-slate-300">{b.total_floors ?? '—'}</span></td>
                                        <td style={{ padding: '12px 14px' }}><span className="text-xs text-slate-400">{b.description || '—'}</span></td>
                                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                                <button onClick={() => setMenuOpen(menuOpen === (b.id ?? i) ? null : (b.id ?? i))}
                                                    className="text-slate-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-700/50">
                                                    <MoreVertical size={15} />
                                                </button>
                                                {menuOpen === (b.id ?? i) && (
                                                    <div style={{ position: 'absolute', right: 0, top: '110%', zIndex: 50, minWidth: '120px', background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', padding: '6px' }}>
                                                        <button onClick={() => { setMenuOpen(null); setViewItem(b); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-indigo-500/20 rounded-lg transition-colors">
                                                            <Eye size={13} className="text-indigo-400" /> View
                                                        </button>
                                                        <button onClick={() => { setMenuOpen(null); handleDelete(b); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-rose-500/20 rounded-lg transition-colors">
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

            {showAdd && <AddBuildingModal onClose={() => setShowAdd(false)} onSuccess={() => { setShowAdd(false); fetchAll(); }} />}
            {viewItem && <ViewBuildingModal building={viewItem} onClose={() => setViewItem(null)} onUpdated={() => { setViewItem(null); fetchAll(); }} />}
        </>
    );
};

export default BuildingsTab;
