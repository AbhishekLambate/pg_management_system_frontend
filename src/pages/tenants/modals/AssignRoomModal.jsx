import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import React, { useState, useEffect } from 'react';
import { X, AlertCircle, DoorOpen } from 'lucide-react';
import { assignRoom, getRooms } from '../../../helper/firebase_helper';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

const AssignRoomModal = ({ tenant, onClose, onSuccess }) => {
    const [rooms, setRooms] = useState([]);
    const [roomId, setRoomId] = useState('');
    const [moveInDate, setMoveInDate] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        getRooms()
            .then(r => {
                const all = Array.isArray(r.data) ? r.data : r.data?.rooms ?? [];
                // Show only vacant rooms
                setRooms(all.filter(rm => rm.is_vacant !== false && rm.status !== 'Occupied'));
            })
            .catch(() => { });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(''); setSubmitting(true);
        try {
            await assignRoom(tenant.id ?? tenant._id, { room_id: roomId, move_in_date: moveInDate || undefined });
            onSuccess();
        } catch (err) {
            const d = err.response?.data?.detail;
            setError(Array.isArray(d) ? d.map(x => x.msg).join(', ') : (typeof d === 'string' ? d : 'Failed to assign room.'));
        } finally { setSubmitting(false); }
    };

    return (
        <Modal isOpen={true} toggle={onClose} centered className="theme-modal">
                <ModalHeader toggle={onClose}>Assign Room</ModalHeader>
<ModalBody>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="input-group">
                        <label className="input-label">Select Vacant Room *</label>
                        <select value={roomId} onChange={e => setRoomId(e.target.value)} className="input-field" required style={{ cursor: 'pointer' }}>
                            <option value="">— Select Room —</option>
                            {rooms.map(r => (
                                <option key={r.id ?? r._id} value={r.id ?? r._id}>
                                    Room {r.room_number} {r.room_type ? `(${r.room_type})` : ''} {r.rent_amount ? `— ₹${r.rent_amount}/mo` : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Input label="Move-in Date" type="date" value={moveInDate} onChange={e => setMoveInDate(e.target.value)} />
                    {error && <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg"><AlertCircle size={14} className="text-rose-400 flex-shrink-0" /><p className="text-rose-400 text-xs">{error}</p></div>}
                    </form>
</ModalBody>
<ModalFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>Cancel</Button>
                        <Button type="submit" className="gap-2" isLoading={submitting} disabled={submitting}><DoorOpen size={15} /> Assign Room</Button>
                    </ModalFooter>
</Modal>
    );
};

export default AssignRoomModal;
