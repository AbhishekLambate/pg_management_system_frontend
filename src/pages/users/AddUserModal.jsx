import React, { useState } from 'react';
import { X, Eye, EyeOff, UserPlus, AlertCircle } from 'lucide-react';
import { authRegister } from '../../helper/firebase_helper';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const AddUserModal = ({ onClose, onSuccess }) => {
    const [form, setForm] = useState({ username: '', email: '', password: '', role: 'user' });
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setSubmitting(true);
        try {
            await authRegister(form);
            onSuccess();
        } catch (err) {
            const detail = err.response?.data?.detail;
            if (Array.isArray(detail)) setFormError(detail.map(d => d.msg || JSON.stringify(d)).join(', '));
            else setFormError(typeof detail === 'string' ? detail : err.response?.data?.message || 'Failed to create user.');
        } finally {
            setSubmitting(false);
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
            <div className="glass-panel p-6" style={{ width: '100%', maxWidth: '460px', margin: '0 16px' }}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                            <UserPlus size={18} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Add New User</h2>
                            <p className="text-xs text-slate-400">Fill in the details below</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700/50">
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input label="Username *" name="username" type="text" placeholder="john_doe" value={form.username} onChange={handleChange} required />
                    <Input label="Email *" name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required />

                    {/* Password with show/hide toggle */}
                    <div className="input-group">
                        <label className="input-label">Password *</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="input-field"
                                style={{ paddingRight: '40px', width: '100%', boxSizing: 'border-box' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(p => !p)}
                                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}
                                className="text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>
                    </div>

                    {/* Role */}
                    <div className="input-group">
                        <label className="input-label">Role</label>
                        <select name="role" value={form.role} onChange={handleChange} className="input-field" style={{ cursor: 'pointer' }}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    {/* Error */}
                    {formError && (
                        <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                            <AlertCircle size={14} className="text-rose-400 flex-shrink-0" />
                            <p className="text-rose-400 text-xs">{formError}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 mt-2 justify-center">
                        <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>Cancel</Button>
                        <Button type="submit" className="gap-2" isLoading={submitting} disabled={submitting}>
                            <UserPlus size={15} /> Add User
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;
