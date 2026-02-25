import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { updateRoom } from '../../../helper/firebase_helper';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

const ROOM_TYPES = [
    { value: 'single', label: 'Single' },
    { value: 'double', label: 'Double' },
    { value: 'triple', label: 'Triple' },
    { value: 'pg', label: 'PG' },
];

const ViewRoomModal = ({ room, onClose, onUpdated }) => {
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({
        room_number: room?.room_number || '',
        floor: room?.floor ?? '',
        room_type: room?.room_type || 'single',
        capacity: room?.capacity ?? '',
        rent_amount: room?.rent_amount ?? '',
        description: room?.description || '',
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    if (!room) return null;
    const isVacant = room.is_vacant !== false && room.status !== 'Occupied';
    const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSave = async () => {
        setError(''); setSaving(true);
        try {
            await updateRoom(room.id ?? room._id, {
                ...form,
                floor: Number(form.floor) || undefined,
                capacity: Number(form.capacity) || undefined,
                rent_amount: Number(form.rent_amount) || undefined,
            });
            onUpdated();
        } catch (err) {
            const d = err.response?.data?.detail;
            setError(Array.isArray(d) ? d.map(x => x.msg).join(', ') : (typeof d === 'string' ? d : 'Update failed.'));
        } finally { setSaving(false); }
    };

    return (
        <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="glass-panel p-6" style={{ width: '100%', maxWidth: '420px', margin: '0 16px', maxHeight: '90vh', overflowY: 'auto' }}>
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-white">{editMode ? 'Edit Room' : 'Room Details'}</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700/50"><X size={18} /></button>
                </div>

                {/* Status badge */}
                <div className="flex justify-center mb-5">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${isVacant ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'}`}>
                        <span className={`w-2 h-2 rounded-full ${isVacant ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        {isVacant ? 'Vacant' : 'Occupied'}
                    </span>
                </div>

                {!editMode ? (
                    <>
                        <div className="flex flex-col gap-3">
                            {[
                                { label: 'Room No.', value: room.room_number },
                                { label: 'Building', value: room.building_name || room.building_id || '—' },
                                { label: 'Floor', value: room.floor ?? '—' },
                                { label: 'Type', value: room.room_type || '—' },
                                { label: 'Capacity', value: room.capacity ?? '—' },
                                { label: 'Rent/month', value: room.rent_amount ? `₹${room.rent_amount}` : '—' },
                                { label: 'Description', value: room.description || '—' },
                            ].map(({ label, value }) => (
                                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                                    <span className="text-xs text-slate-400">{label}</span>
                                    <span className="text-xs text-white font-medium">{String(value)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3 mt-5 justify-center">
                            <Button variant="outline" onClick={onClose}>Close</Button>
                            <Button onClick={() => setEditMode(true)}>✏️ Edit</Button>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col gap-4">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <Input label="Room Number *" name="room_number" value={form.room_number} onChange={handleChange} required />
                            <Input label="Floor" name="floor" type="number" value={form.floor} onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Room Type</label>
                            <select name="room_type" value={form.room_type} onChange={handleChange} className="input-field" style={{ cursor: 'pointer' }}>
                                {ROOM_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                            </select>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <Input label="Capacity" name="capacity" type="number" value={form.capacity} onChange={handleChange} />
                            <Input label="Rent (₹)" name="rent_amount" type="number" value={form.rent_amount} onChange={handleChange} />
                        </div>
                        <Input label="Description" name="description" value={form.description} onChange={handleChange} />
                        {error && <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg"><AlertCircle size={14} className="text-rose-400 flex-shrink-0" /><p className="text-rose-400 text-xs">{error}</p></div>}
                        <div className="flex gap-3 justify-center mt-1">
                            <Button variant="outline" onClick={() => { setEditMode(false); setError(''); }} disabled={saving}>Cancel</Button>
                            <Button onClick={handleSave} isLoading={saving} disabled={saving}>💾 Save</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewRoomModal;
