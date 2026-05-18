import React, { useEffect, useState, useRef } from 'react';
import { Eye, Trash2, MoreVertical } from 'lucide-react';

const ActionMenu = ({ user, onView, onDelete }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
            <button
                onClick={() => setOpen(o => !o)}
                className="text-theme-muted hover:text-white transition-colors p-1.5 rounded-lg hover:bg-theme-muted"
                title="Actions"
            >
                <MoreVertical size={16} />
            </button>

            {open && (
                <div
                    className="glass-panel"
                    style={{
                        position: 'absolute', right: 0, top: '110%',
                        zIndex: 50, minWidth: '130px',
                        padding: '6px',
                    }}
                >
                    <button
                        onClick={() => { setOpen(false); onView(user); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-theme-muted hover:text-white hover:bg-indigo-500/20 rounded-lg transition-colors"
                    >
                        <Eye size={14} className="text-indigo-400" /> View
                    </button>
                    <button
                        onClick={() => { setOpen(false); onDelete(user); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-theme-muted hover:text-white hover:bg-rose-500/20 rounded-lg transition-colors"
                    >
                        <Trash2 size={14} className="text-rose-400" /> Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default ActionMenu;
