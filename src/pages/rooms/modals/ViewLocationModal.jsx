import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { updateLocation } from '../../../helper/firebase_helper';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

const ViewLocationModal = ({ location, onClose, onUpdated }) => {
    const { user } = useAuth();
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({
        name: location?.name || '', address: location?.address || '',
        city: location?.city || '', state: location?.state || '', pincode: location?.pincode || '',
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    if (!location) return null;
    const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSave = async () => {
        setError(''); setSaving(true);
        try {
            await updateLocation(location.id ?? location._id, form);
            onUpdated();
        } catch (err) {
            const d = err.response?.data?.detail;
            setError(Array.isArray(d) ? d.map(x => x.msg).join(', ') : (typeof d === 'string' ? d : 'Update failed.'));
        } finally { setSaving(false); }
    };

    return (
        <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="glass-panel p-6" style={{ width: '100%', maxWidth: '420px', margin: '0 16px' }}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-white">{editMode ? 'Edit Location' : 'Location Details'}</h2>
                    <button onClick={onClose} className="text-theme-muted hover:text-white transition-colors p-1 rounded-lg hover:bg-theme-muted"><X size={18} /></button>
                </div>

                {!editMode ? (
                    <>
                        <div className="flex flex-col gap-3">
                            {[
                                { label: 'Name', value: location.name },
                                { label: 'Address', value: location.address || '—' },
                                { label: 'City', value: location.city || '—' },
                                { label: 'State', value: location.state || '—' },
                                { label: 'Pincode', value: location.pincode || '—' },
                            ].map(({ label, value }) => (
                                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                                    <span className="text-xs text-slate-400">{label}</span>
                                    <span className="text-xs text-white font-medium">{String(value)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3 mt-5 justify-center">
                            <Button variant="outline" onClick={onClose}>Close</Button>
                            {user?.role?.toLowerCase() === 'admin' && (
                                <Button onClick={() => setEditMode(true)}>✏️ Edit</Button>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col gap-4">
                        <Input label="Name *" name="name" value={form.name} onChange={handleChange} required />
                        <Input label="Address" name="address" value={form.address} onChange={handleChange} />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <Input label="City" name="city" value={form.city} onChange={handleChange} />
                            <Input label="State" name="state" value={form.state} onChange={handleChange} />
                        </div>
                        <Input label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} />
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

export default ViewLocationModal;
