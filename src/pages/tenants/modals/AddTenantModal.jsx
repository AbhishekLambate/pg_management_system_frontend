import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Users } from 'lucide-react';
import { createTenant, getRooms } from '../../../helper/firebase_helper';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

const AddTenantModal = ({ onClose, onSuccess }) => {
    const [form, setForm] = useState({
        full_name: '', email: '', phone: '', emergency_contact: '',
        gender: '', id_proof_type: '', id_proof_number: '',
        room_id: '', move_in_date: '',
    });
    const [rooms, setRooms] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        getRooms().then(r => setRooms(Array.isArray(r.data) ? r.data : r.data?.rooms ?? [])).catch(() => { });
    }, []);

    const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(''); setSubmitting(true);
        try {
            const payload = { ...form };
            if (!payload.room_id) delete payload.room_id;
            if (!payload.move_in_date) delete payload.move_in_date;
            await createTenant(payload);
            onSuccess();
        } catch (err) {
            const d = err.response?.data?.detail;
            setError(Array.isArray(d) ? d.map(x => x.msg).join(', ') : (typeof d === 'string' ? d : 'Failed to create tenant.'));
        } finally { setSubmitting(false); }
    };

    return (
        <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="glass-panel p-6" style={{ width: '100%', maxWidth: '520px', margin: '0 16px', maxHeight: '90vh', overflowY: 'auto' }}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400"><Users size={18} /></div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Add Tenant</h2>
                            <p className="text-xs text-slate-400">Fill in tenant details</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700/50"><X size={18} /></button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Personal */}
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Personal Info</p>
                    <Input label="Full Name *" name="full_name" placeholder="John Doe" value={form.full_name} onChange={handleChange} required />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <Input label="Email" name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} />
                        <Input label="Phone" name="phone" type="tel" placeholder="9876543210" value={form.phone} onChange={handleChange} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <Input label="Emergency Contact" name="emergency_contact" placeholder="9876543210" value={form.emergency_contact} onChange={handleChange} />
                        <div className="input-group">
                            <label className="input-label">Gender</label>
                            <select name="gender" value={form.gender} onChange={handleChange} className="input-field" style={{ cursor: 'pointer' }}>
                                <option value="">— Select —</option>
                                {GENDER_OPTIONS.map(g => <option key={g} value={g.toLowerCase()}>{g}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* ID Proof */}
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">ID Proof</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <Input label="ID Type" name="id_proof_type" placeholder="Aadhaar / PAN" value={form.id_proof_type} onChange={handleChange} />
                        <Input label="ID Number" name="id_proof_number" placeholder="XXXX-XXXX-XXXX" value={form.id_proof_number} onChange={handleChange} />
                    </div>

                    {/* Room Assignment */}
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Room Assignment (optional)</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="input-group">
                            <label className="input-label">Assign Room</label>
                            <select name="room_id" value={form.room_id} onChange={handleChange} className="input-field" style={{ cursor: 'pointer' }}>
                                <option value="">— No Room —</option>
                                {rooms.map(r => <option key={r.id ?? r._id} value={r.id ?? r._id}>Room {r.room_number}</option>)}
                            </select>
                        </div>
                        <Input label="Move-in Date" name="move_in_date" type="date" value={form.move_in_date} onChange={handleChange} />
                    </div>

                    {error && <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg"><AlertCircle size={14} className="text-rose-400 flex-shrink-0" /><p className="text-rose-400 text-xs">{error}</p></div>}

                    <div className="flex gap-3 justify-center mt-2">
                        <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>Cancel</Button>
                        <Button type="submit" className="gap-2" isLoading={submitting} disabled={submitting}><Users size={15} /> Add Tenant</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTenantModal;
