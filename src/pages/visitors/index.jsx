import React, { useState, useEffect } from 'react';
import { UserCheck, Clock, Plus, Activity } from 'lucide-react';
import {
    Modal, ModalHeader, ModalBody, ModalFooter,
    Form, FormGroup, Label, Input as RSInput,
    Button as RSButton, Spinner
} from 'reactstrap';
import { Button } from '../../components/ui/Button';
import { getVisitors, createVisitor, getTenants } from '../../helper/firebase_helper';
import BreadCrumb from '../../components/Common/BreadCrumb';

const Visitors = () => {
    const [visitors, setVisitors] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({ name: '', tenant_id: '', relation: '' });

    const toggleModal = () => setModal(m => !m);
    const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const useEffect = React.useEffect;
    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [vRes, tRes] = await Promise.all([getVisitors(), getTenants()]);
            setVisitors(vRes.data);
            setTenants(tRes.data);
            if (tRes.data.length > 0) setForm(f => ({ ...f, tenant_id: tRes.data[0].id.toString() }));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createVisitor({
                ...form,
                tenant_id: parseInt(form.tenant_id),
                in_time: new Date().toISOString()
            });
            toggleModal();
            setForm({ name: '', tenant_id: tenants[0]?.id?.toString() || '', relation: '' });
            fetchData();
        } catch (err) {
            alert('Error logging visitor');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-slate-400 flex justify-center"><Activity className="animate-spin" /></div>;

    return (
        <div className="flex flex-col gap-6">
            <BreadCrumb title="Visitors" pageTitle="Management" />

            <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 mb-0">Track guests and deliveries for security.</p>
                <Button onClick={toggleModal} className="gap-2"><Plus size={18} /> New Entry</Button>
            </div>

            <div className="card">
                <div className="card-header align-items-center d-flex border-bottom-0 pb-0">
                    <h4 className="card-title mb-0 flex-grow-1">Visitor Logbook</h4>
                </div>
                <div className="card-body">
                    <div className="table-responsive table-card">
                        <table className="table table-hover table-striped align-middle table-nowrap mb-0">
                            <thead className="table-light">
                                <tr>
                                    {['Visitor Name', 'Visiting Tenant', 'Relation/Type', 'In Time', 'Out Time', 'Status'].map(col => (
                                        <th key={col} className="text-muted text-uppercase fs-11" style={{ padding: '12px 16px' }}>{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {visitors.length === 0 ? (
                                    <tr><td colSpan="6" className="p-8 text-center text-slate-500">No visitors recorded.</td></tr>
                                ) : visitors.map(visitor => (
                                    <tr key={visitor.id}>
                                        <td className="p-4 text-white font-medium">{visitor.name}</td>
                                        <td className="p-4 text-slate-300">{visitor.tenant_name}</td>
                                        <td className="p-4 text-slate-400 text-sm">{visitor.relation}</td>
                                        <td className="p-4 text-slate-400 text-sm">{visitor.in_time ? new Date(visitor.in_time).toLocaleTimeString() : '-'}</td>
                                        <td className="p-4 text-slate-400 text-sm">{visitor.out_time ? new Date(visitor.out_time).toLocaleTimeString() : '-'}</td>
                                        <td className="p-4">
                                            {!visitor.out_time ? (
                                                <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full flex w-fit items-center gap-1">
                                                    <Clock size={12} /> Inside
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 bg-slate-500/15 text-slate-300 text-xs rounded-full flex w-fit items-center gap-1">
                                                    <UserCheck size={12} /> Checked Out
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Reactstrap Modal */}
            <Modal isOpen={modal} toggle={toggleModal} centered>
                <ModalHeader toggle={toggleModal}>Log New Visitor</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit} id="visitorForm">
                        <FormGroup>
                            <Label for="name">Visitor Name</Label>
                            <RSInput id="name" name="name" placeholder="e.g. Suresh Verma" value={form.name} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label for="tenant_id">Visiting Tenant</Label>
                            <RSInput type="select" id="tenant_id" name="tenant_id" value={form.tenant_id} onChange={handleChange} required>
                                {tenants.map(t => (
                                    <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>
                                ))}
                                {tenants.length === 0 && <option disabled>No tenants available</option>}
                            </RSInput>
                        </FormGroup>
                        <FormGroup>
                            <Label for="relation">Relation / Type</Label>
                            <RSInput id="relation" name="relation" placeholder="e.g. Father, Friend, Courier" value={form.relation} onChange={handleChange} required />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <RSButton color="secondary" outline onClick={toggleModal}>Cancel</RSButton>
                    <RSButton color="primary" type="submit" form="visitorForm" disabled={submitting || tenants.length === 0}>
                        {submitting ? <Spinner size="sm" /> : 'Log Entry'}
                    </RSButton>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default Visitors;
