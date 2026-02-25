import React, { useEffect, useState } from 'react';
import { UserCircle2, Mail, Phone, ShieldCheck, RefreshCw, AlertCircle, UserPlus } from 'lucide-react';
import api_helper from '../../helper/api_helper';
import { Button } from '../../components/ui/Button';

// Sub-components
import ActionMenu from './ActionMenu';
import AddUserModal from './AddUserModal';
import ViewUserModal from './ViewUserModal';
import DeleteConfirmModal from './DeleteConfirmModal';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [viewUser, setViewUser] = useState(null);
    const [deleteUser, setDeleteUser] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api_helper.get('/auth/users');
            setUsers(Array.isArray(response.data) ? response.data : response.data.users ?? []);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleUserAdded = () => { setShowModal(false); fetchUsers(); };

    const handleDelete = async () => {
        if (!deleteUser) return;
        setDeleting(true);
        try {
            const id = deleteUser.id ?? deleteUser._id ?? deleteUser.username;
            await api_helper.delete(`/auth/users/${id}`);
            setDeleteUser(null);
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.detail || err.message || 'Failed to delete user.');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            {/* Page Heading */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Users</h1>
                    <p className="text-slate-400">Manage all registered users and tenants.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" className="gap-2 text-slate-400 hover:text-white" onClick={fetchUsers} disabled={loading}>
                        <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
                    </Button>
                    <Button className="gap-2" onClick={() => setShowModal(true)}>
                        <UserPlus size={16} /> Add User
                    </Button>
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="glass-panel p-12 flex flex-col items-center justify-center gap-4">
                    <RefreshCw size={32} className="text-indigo-400 animate-spin" />
                    <p className="text-slate-400 text-sm">Loading users...</p>
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="glass-panel p-8 flex flex-col items-center justify-center gap-4 border border-rose-500/20">
                    <AlertCircle size={32} className="text-rose-400" />
                    <p className="text-rose-400 text-sm font-medium">{error}</p>
                    <Button variant="outline" className="gap-2 mt-2" onClick={fetchUsers}>
                        <RefreshCw size={14} /> Try Again
                    </Button>
                </div>
            )}

            {/* Empty */}
            {!loading && !error && users.length === 0 && (
                <div className="glass-panel p-12 flex flex-col items-center justify-center gap-3">
                    <UserCircle2 size={40} className="text-slate-600" />
                    <p className="text-slate-400 text-sm">No users found.</p>
                    <Button className="gap-2 mt-2" onClick={() => setShowModal(true)}>
                        <UserPlus size={15} /> Add your first user
                    </Button>
                </div>
            )}

            {/* Table */}
            {!loading && !error && users.length > 0 && (
                <div className="glass-panel p-6">
                    <p className="text-xs text-slate-500 mb-4">
                        {users.length} user{users.length !== 1 ? 's' : ''} found
                    </p>
                    <div className="overflow-x-auto">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                    {['User', 'Contact', 'Role', 'Status', 'Actions'].map(col => (
                                        <th
                                            key={col}
                                            style={{ padding: '12px 16px', textAlign: col === 'Actions' ? 'center' : 'left' }}
                                            className="text-xs font-semibold text-slate-400 uppercase tracking-wider"
                                        >
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u, i) => (
                                    <tr
                                        key={u.id ?? u._id ?? i}
                                        style={{ borderBottom: i < users.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                                        className="hover:bg-slate-800/30 transition-colors"
                                    >
                                        {/* Avatar + Name */}
                                        <td style={{ padding: '14px 16px' }}>
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm flex-shrink-0">
                                                    {(u.name || u.username || '?')[0].toUpperCase()}
                                                </div>
                                                <span className="text-sm font-medium text-white">
                                                    {u.name || u.username || '—'}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Contact */}
                                        <td style={{ padding: '14px 16px' }}>
                                            <div className="flex flex-col gap-1">
                                                <span className="flex items-center gap-1 text-xs text-slate-300">
                                                    <Mail size={12} className="text-slate-500" /> {u.email || '—'}
                                                </span>
                                                {u.phone && (
                                                    <span className="flex items-center gap-1 text-xs text-slate-400">
                                                        <Phone size={12} className="text-slate-500" /> {u.phone}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Role */}
                                        <td style={{ padding: '14px 16px' }}>
                                            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${u.role === 'admin' || u.role === 'Admin'
                                                    ? 'bg-purple-500/15 text-purple-400'
                                                    : 'bg-slate-700/50 text-slate-300'
                                                }`}>
                                                {(u.role === 'admin' || u.role === 'Admin')
                                                    ? <ShieldCheck size={11} />
                                                    : <UserCircle2 size={11} />
                                                }
                                                {u.role || 'User'}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td style={{ padding: '14px 16px' }}>
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${u.is_active !== false && u.status !== 'Inactive'
                                                    ? 'bg-emerald-500/15 text-emerald-400'
                                                    : 'bg-rose-500/15 text-rose-400'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${u.is_active !== false && u.status !== 'Inactive' ? 'bg-emerald-400' : 'bg-rose-400'
                                                    }`} />
                                                {u.is_active !== false && u.status !== 'Inactive' ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                            <ActionMenu
                                                user={u}
                                                onView={(u) => setViewUser(u)}
                                                onDelete={(u) => setDeleteUser(u)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modals */}
            {showModal && (
                <AddUserModal onClose={() => setShowModal(false)} onSuccess={handleUserAdded} />
            )}
            {viewUser && (
                <ViewUserModal
                    user={viewUser}
                    onClose={() => setViewUser(null)}
                    onUpdated={() => { setViewUser(null); fetchUsers(); }}
                />
            )}
            {deleteUser && (
                <DeleteConfirmModal
                    user={deleteUser}
                    onClose={() => setDeleteUser(null)}
                    onConfirm={handleDelete}
                    deleting={deleting}
                />
            )}
        </>
    );
};

export default Users;
