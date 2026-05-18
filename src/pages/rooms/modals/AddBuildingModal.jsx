import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Building2 } from 'lucide-react';
import { createBuilding, getLocations } from '../../../helper/firebase_helper';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

const AddBuildingModal = ({ onClose, onSuccess }) => {
    const [form, setForm] = useState({ name: '', location_id: '', total_floors: '', description: '' });
    const [locations, setLocations] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        getLocations().then(r => setLocations(Array.isArray(r.data) ? r.data : r.data?.locations ?? [])).catch(() => { });
    }, []);

    const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(''); setSubmitting(true);
        try {
            await createBuilding({ ...form, total_floors: Number(form.total_floors) || undefined });
            onSuccess();
        } catch (err) {
            const d = err.response?.data?.detail;
            setError(Array.isArray(d) ? d.map(x => x.msg).join(', ') : (typeof d === 'string' ? d : 'Failed to create building.'));
        } finally { setSubmitting(false); }
    };

    return (
        <Modal isOpen={true} toggle={onClose} centered className="theme-modal">
                <ModalHeader toggle={onClose}>Add Building</ModalHeader>
<ModalBody>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input label="Building Name *" name="name" placeholder="Block A" value={form.name} onChange={handleChange} required />
                    <div className="input-group">
                        <label className="input-label">Location *</label>
                        <select name="location_id" value={form.location_id} onChange={handleChange} className="input-field" required style={{ cursor: 'pointer' }}>
                            <option value="">— Select Location —</option>
                            {locations.map(l => <option key={l.id ?? l._id} value={l.id ?? l._id}>{l.name}</option>)}
                        </select>
                    </div>
                    <Input label="Total Floors" name="total_floors" type="number" placeholder="5" value={form.total_floors} onChange={handleChange} />
                    <Input label="Description" name="description" placeholder="Optional notes" value={form.description} onChange={handleChange} />
                    {error && <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg"><AlertCircle size={14} className="text-rose-400 flex-shrink-0" /><p className="text-rose-400 text-xs">{error}</p></div>}
                    </form>
</ModalBody>
<ModalFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>Cancel</Button>
                        <Button type="submit" className="gap-2" isLoading={submitting} disabled={submitting}><Building2 size={15} /> Add Building</Button>
                    </ModalFooter>
</Modal>
    );
};

export default AddBuildingModal;
