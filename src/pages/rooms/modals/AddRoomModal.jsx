import React, { useState, useEffect } from 'react';
import { X, AlertCircle, DoorOpen } from 'lucide-react';
import { createRoom, getBuildings } from '../../../helper/firebase_helper';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

const ROOM_TYPES = [
    { value: 'single', label: 'Single' },
    { value: 'double', label: 'Double' },
    { value: 'triple', label: 'Triple' },
    { value: 'pg', label: 'PG' },
];

const AddRoomModal = ({ onClose, onSuccess }) => {
    const [form, setForm] = useState({
        room_number: '', building_id: '', floor: '', room_type: 'single',
        capacity: '', rent_amount: '', description: '',
    });
    const [buildings, setBuildings] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        getBuildings().then(r => setBuildings(Array.isArray(r.data) ? r.data : r.data?.buildings ?? [])).catch(() => { });
    }, []);

    const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(''); setSubmitting(true);
        try {
            await createRoom({
                ...form,
                floor: Number(form.floor) || undefined,
                capacity: Number(form.capacity) || undefined,
                rent_amount: Number(form.rent_amount) || undefined,
            });
            onSuccess();
        } catch (err) {
            const d = err.response?.data?.detail;
            setError(Array.isArray(d) ? d.map(x => x.msg).join(', ') : (typeof d === 'string' ? d : 'Failed to create room.'));
        } finally { setSubmitting(false); }
    };

    return (
        <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="glass-panel p-6" style={{ width: '100%', maxWidth: '480px', margin: '0 16px', maxHeight: '90vh', overflowY: 'auto' }}>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400"><DoorOpen size={18} /></div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Add Room</h2>
                            <p className="text-xs text-slate-400">Fill in room details</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700/50"><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <Input label="Room Number *" name="room_number" placeholder="101" value={form.room_number} onChange={handleChange} required />
                        <Input label="Floor" name="floor" type="number" placeholder="1" value={form.floor} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Building *</label>
                        <select name="building_id" value={form.building_id} onChange={handleChange} className="input-field" required style={{ cursor: 'pointer' }}>
                            <option value="">— Select Building —</option>
                            {buildings.map(b => <option key={b.id ?? b._id} value={b.id ?? b._id}>{b.name}</option>)}
                        </select>
                    </div>
                    <div className="input-group">
                        <label className="input-label">Room Type</label>
                        <select name="room_type" value={form.room_type} onChange={handleChange} className="input-field" style={{ cursor: 'pointer' }}>
                            {ROOM_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <Input label="Capacity" name="capacity" type="number" placeholder="2" value={form.capacity} onChange={handleChange} />
                        <Input label="Rent (₹/month)" name="rent_amount" type="number" placeholder="8000" value={form.rent_amount} onChange={handleChange} />
                    </div>
                    <Input label="Description" name="description" placeholder="Optional notes" value={form.description} onChange={handleChange} />
                    {error && <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg"><AlertCircle size={14} className="text-rose-400 flex-shrink-0" /><p className="text-rose-400 text-xs">{error}</p></div>}
                    <div className="flex gap-3 justify-center mt-1">
                        <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>Cancel</Button>
                        <Button type="submit" className="gap-2" isLoading={submitting} disabled={submitting}><DoorOpen size={15} /> Add Room</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddRoomModal;
