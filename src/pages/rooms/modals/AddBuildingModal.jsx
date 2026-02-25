import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Building2 } from 'lucide-react';
import { createBuilding, getLocations } from '../../../helper/firebase_helper';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

const AddBuildingModal = ({ onClose, onSuccess }) => {
    const [form, setForm] = useState({ name: '', location_id: '', total_floors: '', description: '' });
    const [locations, setLocations] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        getLocations().then(r => setLocations(Array.isArray(r.data) ? r.data : r.data?.locations ?? [])).catch(() => { });
    }, []);

    const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(''); setSubmitting(true);
        try {
            await createBuilding({ ...form, total_floors: Number(form.total_floors) || undefined });
            onSuccess();
        } catch (err) {
            const d = err.response?.data?.detail;
            setError(Array.isArray(d) ? d.map(x => x.msg).join(', ') : (typeof d === 'string' ? d : 'Failed to create building.'));
        } finally { setSubmitting(false); }
    };

    return (
        <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="glass-panel p-6" style={{ width: '100%', maxWidth: '460px', margin: '0 16px' }}>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400"><Building2 size={18} /></div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Add Building</h2>
                            <p className="text-xs text-slate-400">Fill in building details</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700/50"><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input label="Building Name *" name="name" placeholder="Block A" value={form.name} onChange={handleChange} required />
                    <div className="input-group">
                        <label className="input-label">Location *</label>
                        <select name="location_id" value={form.location_id} onChange={handleChange} className="input-field" required style={{ cursor: 'pointer' }}>
                            <option value="">— Select Location —</option>
                            {locations.map(l => <option key={l.id ?? l._id} value={l.id ?? l._id}>{l.name}</option>)}
                        </select>
                    </div>
                    <Input label="Total Floors" name="total_floors" type="number" placeholder="5" value={form.total_floors} onChange={handleChange} />
                    <Input label="Description" name="description" placeholder="Optional notes" value={form.description} onChange={handleChange} />
                    {error && <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg"><AlertCircle size={14} className="text-rose-400 flex-shrink-0" /><p className="text-rose-400 text-xs">{error}</p></div>}
                    <div className="flex gap-3 justify-center mt-1">
                        <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>Cancel</Button>
                        <Button type="submit" className="gap-2" isLoading={submitting} disabled={submitting}><Building2 size={15} /> Add Building</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBuildingModal;
