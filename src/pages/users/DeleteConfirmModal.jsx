import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const DeleteConfirmModal = ({ user, onClose, onConfirm, deleting }) => {
    if (!user) return null;

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
            <div className="glass-panel p-6" style={{ width: '100%', maxWidth: '400px', margin: '0 16px', textAlign: 'center' }}>
                <div className="w-12 h-12 rounded-full bg-rose-500/15 flex items-center justify-center text-rose-400 mx-auto mb-4">
                    <Trash2 size={22} />
                </div>
                <h2 className="text-lg font-bold text-white mb-2">Delete User?</h2>
                <p className="text-slate-400 text-sm mb-6">
                    Are you sure you want to delete{' '}
                    <span className="text-white font-medium">{user.name || user.username}</span>?
                    This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={onClose} disabled={deleting}>Cancel</Button>
                    <Button
                        className="gap-2 bg-rose-600 hover:bg-rose-700 border-rose-600"
                        onClick={onConfirm}
                        isLoading={deleting}
                        disabled={deleting}
                    >
                        <Trash2 size={14} /> Delete
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
