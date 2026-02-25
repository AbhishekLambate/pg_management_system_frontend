import React, { useEffect, useState } from 'react';
import { MapPin, RefreshCw, AlertCircle, Plus, Eye, Trash2, MoreVertical } from 'lucide-react';
import { getLocations, deleteLocation } from '../../helper/firebase_helper';
import { Button } from '../../components/ui/Button';
import AddLocationModal from './modals/AddLocationModal';
import ViewLocationModal from './modals/ViewLocationModal';

const LocationsTab = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAdd, setShowAdd] = useState(false);
    const [viewItem, setViewItem] = useState(null);
    const [menuOpen, setMenuOpen] = useState(null); // id of open menu

    const fetchLocations = async () => {
        setLoading(true); setError(null);
        try {
            const res = await getLocations();
            setLocations(Array.isArray(res.data) ? res.data : res.data?.locations ?? []);
        } catch (e) { setError(e.response?.data?.message || 'Failed to load locations.'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchLocations(); }, []);

    const handleDelete = async (loc) => {
        if (!window.confirm(`Delete "${loc.name}"?`)) return;
        try {
            await deleteLocation(loc.id ?? loc._id);
            fetchLocations();
        } catch (e) { alert(e.response?.data?.detail || 'Delete failed.'); }
    };

    return (
        <>
            <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-slate-400">{locations.length} location{locations.length !== 1 ? 's' : ''}</p>
                <div className="flex gap-2">
                    <Button variant="ghost" className="gap-2 text-slate-400 hover:text-white" onClick={fetchLocations} disabled={loading}>
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
                    </Button>
                    <Button className="gap-2" onClick={() => setShowAdd(true)}>
                        <Plus size={15} /> Add Location
                    </Button>
                </div>
            </div>

            {loading && <div className="glass-panel p-10 flex items-center justify-center gap-3"><RefreshCw size={24} className="text-indigo-400 animate-spin" /><p className="text-slate-400 text-sm">Loading...</p></div>}
            {!loading && error && <div className="glass-panel p-8 flex flex-col items-center gap-3 border border-rose-500/20"><AlertCircle size={28} className="text-rose-400" /><p className="text-rose-400 text-sm">{error}</p><Button variant="outline" onClick={fetchLocations}>Retry</Button></div>}
            {!loading && !error && locations.length === 0 && (
                <div className="glass-panel p-12 flex flex-col items-center gap-3">
                    <MapPin size={36} className="text-slate-600" />
                    <p className="text-slate-400 text-sm">No locations yet.</p>
                    <Button className="gap-2" onClick={() => setShowAdd(true)}><Plus size={14} /> Add first location</Button>
                </div>
            )}
            {!loading && !error && locations.length > 0 && (
                <div className="glass-panel p-4">
                    <div className="overflow-x-auto">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                    {['Name', 'City', 'State', 'Pincode', 'Actions'].map(col => (
                                        <th key={col} className="text-xs font-semibold text-slate-400 uppercase tracking-wider"
                                            style={{ padding: '10px 14px', textAlign: col === 'Actions' ? 'center' : 'left' }}>{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {locations.map((loc, i) => (
                                    <tr key={loc.id ?? loc._id ?? i}
                                        style={{ borderBottom: i < locations.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                                        className="hover:bg-slate-800/30 transition-colors">
                                        <td style={{ padding: '12px 14px' }}>
                                            <div className="flex items-center gap-2">
                                                <MapPin size={14} className="text-indigo-400 flex-shrink-0" />
                                                <span className="text-sm font-medium text-white">{loc.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 14px' }}><span className="text-xs text-slate-300">{loc.city || '—'}</span></td>
                                        <td style={{ padding: '12px 14px' }}><span className="text-xs text-slate-300">{loc.state || '—'}</span></td>
                                        <td style={{ padding: '12px 14px' }}><span className="text-xs text-slate-300">{loc.pincode || '—'}</span></td>
                                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                                <button onClick={() => setMenuOpen(menuOpen === (loc.id ?? i) ? null : (loc.id ?? i))}
                                                    className="text-slate-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-700/50">
                                                    <MoreVertical size={15} />
                                                </button>
                                                {menuOpen === (loc.id ?? i) && (
                                                    <div style={{ position: 'absolute', right: 0, top: '110%', zIndex: 50, minWidth: '120px', background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', padding: '6px' }}>
                                                        <button onClick={() => { setMenuOpen(null); setViewItem(loc); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-indigo-500/20 rounded-lg transition-colors">
                                                            <Eye size={13} className="text-indigo-400" /> View
                                                        </button>
                                                        <button onClick={() => { setMenuOpen(null); handleDelete(loc); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-rose-500/20 rounded-lg transition-colors">
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

            {showAdd && <AddLocationModal onClose={() => setShowAdd(false)} onSuccess={() => { setShowAdd(false); fetchLocations(); }} />}
            {viewItem && <ViewLocationModal location={viewItem} onClose={() => setViewItem(null)} onUpdated={() => { setViewItem(null); fetchLocations(); }} />}
        </>
    );
};

export default LocationsTab;
