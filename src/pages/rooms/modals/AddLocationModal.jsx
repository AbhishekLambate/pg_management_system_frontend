import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import React, { useState } from 'react';
import { X, AlertCircle, MapPin } from 'lucide-react';
import { createLocation } from '../../../helper/firebase_helper';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

const AddLocationModal = ({ onClose, onSuccess }) => {
    const [form, setForm] = useState({ name: '', address: '', city: '', state: '', pincode: '' });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            await createLocation(form);
            onSuccess();
        } catch (err) {
            const d = err.response?.data?.detail;
            setError(Array.isArray(d) ? d.map(x => x.msg).join(', ') : (typeof d === 'string' ? d : 'Failed to create location.'));
        } finally { setSubmitting(false); }
    };

    return (
        <Modal isOpen={true} toggle={onClose} centered className="theme-modal">
                <ModalHeader toggle={onClose}>Add Location</ModalHeader>
<ModalBody>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input label="Name *" name="name" placeholder="e.g. Koramangala Branch" value={form.name} onChange={handleChange} required />
                    <Input label="Address" name="address" placeholder="Street address" value={form.address} onChange={handleChange} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <Input label="City" name="city" placeholder="Bangalore" value={form.city} onChange={handleChange} />
                        <Input label="State" name="state" placeholder="Karnataka" value={form.state} onChange={handleChange} />
                    </div>
                    <Input label="Pincode" name="pincode" placeholder="560034" value={form.pincode} onChange={handleChange} />
                    {error && <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg"><AlertCircle size={14} className="text-rose-400 flex-shrink-0" /><p className="text-rose-400 text-xs">{error}</p></div>}
                    </form>
</ModalBody>
<ModalFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>Cancel</Button>
                        <Button type="submit" className="gap-2" isLoading={submitting} disabled={submitting}><MapPin size={15} /> Add Location</Button>
                    </ModalFooter>
</Modal>
    );
};

export default AddLocationModal;
