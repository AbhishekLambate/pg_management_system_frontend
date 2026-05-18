import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { updateTenant } from '../../../helper/firebase_helper';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

const GENDER_OPTIONS = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
];

const ViewTenantModal = ({ tenant, onClose, onUpdated }) => {
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({
        full_name: tenant?.full_name || '',
        email: tenant?.email || '',
        phone: tenant?.phone || '',
        emergency_contact: tenant?.emergency_contact || '',
        gender: tenant?.gender || '',
        id_proof_type: tenant?.id_proof_type || '',
        id_proof_number: tenant?.id_proof_number || '',
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    if (!tenant) return null;
    const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSave = async () => {
        setError(''); setSaving(true);
        try {
            await updateTenant(tenant.id ?? tenant._id, form);
            onUpdated();
        } catch (err) {
            const d = err.response?.data?.detail;
            setError(Array.isArray(d) ? d.map(x => x.msg).join(', ') : (typeof d === 'string' ? d : 'Update failed.'));
        } finally { setSaving(false); }
    };

    const infoRows = [
        { label: 'Full Name', value: tenant.full_name || '—' },
        { label: 'Email', value: tenant.email || '—' },
        { label: 'Phone', value: tenant.phone || '—' },
        { label: 'Emergency Contact', value: tenant.emergency_contact || '—' },
        { label: 'Gender', value: tenant.gender || '—' },
        { label: 'ID Type', value: tenant.id_proof_type || '—' },
        { label: 'ID Number', value: tenant.id_proof_number || '—' },
        { label: 'Room', value: tenant.room_number ?? tenant.room_id ?? '—' },
        { label: 'Move-in Date', value: tenant.move_in_date || '—' },
        { label: 'Status', value: tenant.status || '—' },
    ];

    return (
        <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="glass-panel p-6" style={{ width: '100%', maxWidth: '440px', margin: '0 16px', maxHeight: '90vh', overflowY: 'auto' }}>
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-white">{editMode ? 'Edit Tenant' : 'Tenant Details'}</h2>
                    <button onClick={onClose} className="text-theme-muted hover:text-white transition-colors p-1 rounded-lg hover:bg-theme-muted"><X size={18} /></button>
                </div>

                {/* Avatar */}
                <div className="flex flex-col items-center gap-2 mb-5">
                    <div className="w-14 h-14 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-2xl">
                        {(tenant.full_name || '?')[0].toUpperCase()}
                    </div>
                    <p className="text-white font-semibold" style={{ wordBreak: 'break-all' }}>{tenant.full_name || '—'}</p>
                    <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full font-medium ${tenant.status === 'checked_out' ? 'bg-slate-700/60 text-slate-400' : 'bg-emerald-500/15 text-emerald-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${tenant.status === 'checked_out' ? 'bg-slate-500' : 'bg-emerald-400'}`} />
                        {tenant.status === 'checked_out' ? 'Checked Out' : 'Active'}
                    </span>
                </div>

                {/* VIEW MODE */}
                {!editMode && (
                    <>
                        <div className="flex flex-col gap-2">
                            {infoRows.map(({ label, value }) => (
                                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
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
                )}

                {/* EDIT MODE */}
                {editMode && (
                    <div className="flex flex-col gap-3">
                        <Input label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
                            <Input label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} />
                        </div>
                        <Input label="Emergency Contact" name="emergency_contact" value={form.emergency_contact} onChange={handleChange} />
                        <div className="input-group">
                            <label className="input-label">Gender</label>
                            <select name="gender" value={form.gender} onChange={handleChange} className="input-field" style={{ cursor: 'pointer' }}>
                                <option value="">— Select —</option>
                                {GENDER_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                            </select>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <Input label="ID Type" name="id_proof_type" value={form.id_proof_type} onChange={handleChange} />
                            <Input label="ID Number" name="id_proof_number" value={form.id_proof_number} onChange={handleChange} />
                        </div>
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

export default ViewTenantModal;
