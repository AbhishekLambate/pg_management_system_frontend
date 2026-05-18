import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import React, { useState } from 'react';
import { LogOut, AlertCircle } from 'lucide-react';
import { checkoutTenant } from '../../../helper/firebase_helper';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

const CheckoutConfirmModal = ({ tenant, onClose, onSuccess }) => {
    const [checkoutDate, setCheckoutDate] = useState('');
    const [remarks, setRemarks] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!tenant) return null;

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(''); setSubmitting(true);
        try {
            await checkoutTenant(tenant.id ?? tenant._id, {
                checkout_date: checkoutDate || undefined,
                remarks: remarks || undefined,
            });
            onSuccess();
        } catch (err) {
            const d = err.response?.data?.detail;
            setError(Array.isArray(d) ? d.map(x => x.msg).join(', ') : (typeof d === 'string' ? d : 'Checkout failed.'));
        } finally { setSubmitting(false); }
    };

    return (
        <Modal isOpen={true} toggle={onClose} centered className="theme-modal">
            <ModalBody className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-400 mx-auto mb-4">
                    <LogOut size={22} />
                </div>
                <h2 className="text-lg font-bold text-white mb-1">Checkout Tenant?</h2>
                <p className="text-slate-400 text-sm mb-5">
                    Check out <span className="text-white font-medium">{tenant.full_name}</span>. This will free up their room.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
                    <Input label="Checkout Date" type="date" value={checkoutDate} onChange={e => setCheckoutDate(e.target.value)} />
                    <div className="input-group">
                        <label className="input-label">Remarks (optional)</label>
                        <textarea
                            className="input-field"
                            rows={3}
                            placeholder="Reason for checkout, notes..."
                            value={remarks}
                            onChange={e => setRemarks(e.target.value)}
                            style={{ resize: 'none' }}
                        />
                    </div>
                    {error && <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg"><AlertCircle size={14} className="text-rose-400 flex-shrink-0" /><p className="text-rose-400 text-xs">{error}</p></div>}
                    <div className="flex gap-3 justify-center">
                        <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>Cancel</Button>
                        <Button type="submit" className="gap-2 bg-amber-600 hover:bg-amber-700 border-amber-600" isLoading={submitting} disabled={submitting}>
                            <LogOut size={14} /> Checkout
                        </Button>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    );
};

export default CheckoutConfirmModal;
