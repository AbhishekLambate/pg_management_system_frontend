import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserCircle2, Mail, Phone, ShieldCheck, RefreshCw, AlertCircle, UserPlus } from 'lucide-react';
import api_helper from '../../helper/api_helper';
import { Button } from '../../components/ui/Button';

// Sub-components
import ActionMenu from './ActionMenu';
import AddUserModal from './AddUserModal';
import ViewUserModal from './ViewUserModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import BreadCrumb from '../../components/Common/BreadCrumb';

const Users = () => {
    const { user: currentUser } = useAuth();
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

    const useEffect = React.useEffect;
    useEffect(() => {
        if (currentUser?.role?.toLowerCase() === 'admin') {
            fetchUsers();
        }
    }, [currentUser]);

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

    if (currentUser?.role?.toLowerCase() !== 'admin') {
        return (
            <div className="glass-panel p-12 mt-10 flex flex-col items-center justify-center gap-3 text-center border-rose-500/20">
                <AlertCircle size={48} className="text-rose-500 mb-2" />
                <h2 className="text-2xl font-bold text-white">Access Denied</h2>
                <p className="text-slate-400">Only administrators can manage users.</p>
            </div>
        );
    }

    return (
        <>
            <BreadCrumb title="Users" pageTitle="Management" />

            {/* Page Heading Controls */}
            <div className="mb-4 flex items-center justify-between">
                <p className="text-slate-400 mb-0">Manage all registered users and tenants.</p>
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

            {/* Adapted Table */}
            {!loading && !error && users.length > 0 && (
                <div className="card">
                    <div className="card-header align-items-center d-flex border-bottom-0 pb-0">
                        <h4 className="card-title mb-0 flex-grow-1">Users List</h4>
                        <div className="flex-shrink-0">
                            <span className="badge bg-primary-subtle text-primary">
                                {users.length} user{users.length !== 1 ? 's' : ''} found
                            </span>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive table-card">
                            <table className="table table-hover table-striped align-middle table-nowrap mb-0">
                                <thead className="table-light">
                                    <tr>
                                        {['User', 'Contact', 'Role', 'Status', 'Actions'].map(col => (
                                            <th
                                                key={col}
                                                className="text-muted text-uppercase fs-11"
                                                style={{ textAlign: col === 'Actions' ? 'center' : 'left', padding: '12px 16px' }}
                                            >
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u, i) => (
                                        <tr key={u.id ?? u._id ?? i}>
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
                                                    : 'bg-slate-500/15 text-slate-300'
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
