import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, Plus, Activity } from 'lucide-react';
import {
    Modal, ModalHeader, ModalBody, ModalFooter,
    Form, FormGroup, Label, Input as RSInput,
    Button as RSButton, Spinner
} from 'reactstrap';
import { Button } from '../../components/ui/Button';
import { getComplaints, createComplaint, getTenants } from '../../helper/firebase_helper';
import BreadCrumb from '../../components/Common/BreadCrumb';

const Complaints = () => {
    const [tickets, setTickets] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({ title: '', tenant_id: '', priority: 'Medium' });

    const toggleModal = () => setModal(m => !m);
    const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const useEffect = React.useEffect;
    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [ticketsRes, tenantsRes] = await Promise.all([getComplaints(), getTenants()]);
            setTickets(ticketsRes.data);
            setTenants(tenantsRes.data);
            if (tenantsRes.data.length > 0) {
                setForm(f => ({ ...f, tenant_id: tenantsRes.data[0].id.toString() }));
            }
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
            await createComplaint({ ...form, tenant_id: parseInt(form.tenant_id), status: 'Pending' });
            toggleModal();
            setForm({ title: '', tenant_id: tenants[0]?.id?.toString() || '', priority: 'Medium' });
            fetchData();
        } catch (err) {
            alert('Error creating complaint');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-slate-400 flex justify-center"><Activity className="animate-spin" /></div>;

    return (
        <div className="flex flex-col gap-6">
            <BreadCrumb title="Complaints" pageTitle="Management" />

            <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 mb-0">Track maintenance requests and tenant issues.</p>
                <Button onClick={toggleModal} className="gap-2"><Plus size={18} /> New Ticket</Button>
            </div>

            <div className="card">
                <div className="card-header align-items-center d-flex border-bottom-0 pb-0">
                    <h4 className="card-title mb-0 flex-grow-1">Tickets List</h4>
                </div>
                <div className="card-body">
                    <div className="table-responsive table-card">
                        <table className="table table-hover table-striped align-middle table-nowrap mb-0">
                            <thead className="table-light">
                                <tr>
                                    {['Issue / Ticket', 'Tenant', 'Priority', 'Date', 'Status'].map(col => (
                                        <th key={col} className="text-muted text-uppercase fs-11" style={{ padding: '12px 16px' }}>{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.length === 0 ? (
                                    <tr><td colSpan="5" className="p-8 text-center text-slate-500">No complaints found.</td></tr>
                                ) : tickets.map(ticket => (
                                    <tr key={ticket.id}>
                                        <td className="p-4 text-white font-medium">
                                            <div className="flex flex-col">
                                                <span className="text-white font-bold">{ticket.title}</span>
                                                <span className="text-xs text-indigo-400">{ticket.ticket_id}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-300">{ticket.tenant_name}</td>
                                        <td className="p-4">
                                            <div className={`flex items-center gap-1 ${ticket.priority === 'High' ? 'text-red-400' : ticket.priority === 'Medium' ? 'text-amber-400' : 'text-blue-400'}`}>
                                                <AlertCircle size={14} /> {ticket.priority}
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-400 text-sm">
                                            {new Date(ticket.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium 
                                                ${ticket.status === 'Resolved' ? 'bg-green-500/20 text-green-400' :
                                                    ticket.status === 'In Progress' ? 'bg-amber-500/20 text-amber-400' :
                                                    'bg-slate-500/20 text-slate-300'}`}>
                                                {ticket.status === 'Resolved' ? <CheckCircle size={12} /> : <Clock size={12} />}
                                                {' '}{ticket.status}
                                            </span>
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
                <ModalHeader toggle={toggleModal}>Log New Complaint / Ticket</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit} id="complaintForm">
                        <FormGroup>
                            <Label for="title">Issue Title</Label>
                            <RSInput id="title" name="title" placeholder="e.g. AC not cooling in Room 101" value={form.title} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label for="tenant_id">Reporting Tenant</Label>
                            <RSInput type="select" id="tenant_id" name="tenant_id" value={form.tenant_id} onChange={handleChange} required>
                                {tenants.map(t => (
                                    <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>
                                ))}
                                {tenants.length === 0 && <option disabled>No tenants available</option>}
                            </RSInput>
                        </FormGroup>
                        <FormGroup>
                            <Label for="priority">Priority</Label>
                            <RSInput type="select" id="priority" name="priority" value={form.priority} onChange={handleChange}>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </RSInput>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <RSButton color="secondary" outline onClick={toggleModal}>Cancel</RSButton>
                    <RSButton color="primary" type="submit" form="complaintForm" disabled={submitting || tenants.length === 0}>
                        {submitting ? <Spinner size="sm" /> : 'Create Ticket'}
                    </RSButton>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default Complaints;
