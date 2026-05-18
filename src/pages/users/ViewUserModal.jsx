import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api_helper from '../../helper/api_helper';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const ViewUserModal = ({ user, onClose, onUpdated }) => {
    const { user: currentUser } = useAuth();
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({
        username: user?.username || '',
        full_name: user?.full_name || '',
        email: user?.email || '',
        role: user?.role || 'user',
    });
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');

    if (!user) return null;
    const isActive = user.is_active !== false && user.status !== 'Inactive';

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSave = async () => {
        setSaveError('');
        setSaving(true);
        try {
            const id = user.id ?? user._id ?? user.username;
            await api_helper.put(`/auth/users/${id}`, form);
            onUpdated();
        } catch (err) {
            const detail = err.response?.data?.detail;
            if (Array.isArray(detail)) setSaveError(detail.map(d => d.msg || JSON.stringify(d)).join(', '));
            else setSaveError(typeof detail === 'string' ? detail : err.response?.data?.message || 'Update failed.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            style={{
                position: 'fixed', inset: 0,
                backgroundColor: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 1000,
            }}
        >
            <div className="glass-panel p-6" style={{ width: '100%', maxWidth: '420px', margin: '0 16px' }}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-white">
                        {editMode ? 'Edit User' : 'User Details'}
                    </h2>
                    <button onClick={onClose} className="text-theme-muted hover:text-white transition-colors p-1 rounded-lg hover:bg-theme-muted">
                        <X size={18} />
                    </button>
                </div>

                {/* Avatar */}
                <div className="flex flex-col items-center gap-3 mb-6">
                    <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-2xl flex-shrink-0">
                        {(user.name || user.username || '?')[0].toUpperCase()}
                    </div>
                    <div className="text-center" style={{ maxWidth: '100%' }}>
                        <p className="text-white font-semibold text-lg" style={{ wordBreak: 'break-all' }}>
                            {user.full_name || user.name || user.username || '—'}
                        </p>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${isActive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                            {isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>

                {/* ── VIEW MODE ── */}
                {!editMode && (
                    <>
                        <div className="flex flex-col gap-3">
                            {[
                                { label: 'Full Name', value: user.full_name || '—' },
                                { label: 'Username', value: user.username },
                                { label: 'Email', value: user.email },
                                { label: 'Role', value: user.role || '—' },
                                { label: 'ID', value: user.id ?? user._id ?? '—' },
                            ].map(({ label, value }) => (
                                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                                    <span className="text-xs text-slate-400">{label}</span>
                                    <span className="text-xs text-white font-medium">{String(value)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3 mt-5 justify-center">
                            <Button variant="outline" onClick={onClose}>Close</Button>
                            <Button className="gap-2" onClick={() => setEditMode(true)}>✏️ Update</Button>
                        </div>
                    </>
                )}

                {/* ── EDIT MODE ── */}
                {editMode && (
                    <div className="flex flex-col gap-4">
                        {/* Username is read-only — it's used as the record ID in the PUT URL */}
                        <div className="input-group">
                            <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                Username
                                <span className="text-xs text-slate-500">read-only</span>
                            </label>
                            <input
                                value={form.username}
                                disabled
                                className="input-field"
                                style={{ opacity: 0.5, cursor: 'not-allowed' }}
                            />
                        </div>

                        <Input label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} placeholder="John Doe" />
                        <Input label="Email" name="email" value={form.email} onChange={handleChange} placeholder="email@example.com" type="email" />

                        <div className="input-group">
                            <label className="input-label">Role</label>
                            <select name="role" value={form.role} onChange={handleChange} className="input-field" style={{ cursor: currentUser?.role?.toLowerCase() === 'admin' ? 'pointer' : 'not-allowed' }} disabled={currentUser?.role?.toLowerCase() !== 'admin'}>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        {saveError && (
                            <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                                <AlertCircle size={14} className="text-rose-400 flex-shrink-0" />
                                <p className="text-rose-400 text-xs">{saveError}</p>
                            </div>
                        )}

                        <div className="flex gap-3 justify-center mt-1">
                            <Button variant="outline" onClick={() => { setEditMode(false); setSaveError(''); }} disabled={saving}>
                                Cancel
                            </Button>
                            <Button className="gap-2" onClick={handleSave} isLoading={saving} disabled={saving}>
                                💾 Save Changes
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewUserModal;
