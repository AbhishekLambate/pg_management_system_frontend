import React, { useState, useEffect } from 'react';
import { Users, Phone, MapPin, Plus, Activity } from 'lucide-react';
import {
    Modal, ModalHeader, ModalBody, ModalFooter,
    Form, FormGroup, Label, Input as RSInput,
    Button as RSButton, Spinner
} from 'reactstrap';
import { Button } from '../../components/ui/Button';
import { getStaff, createStaff } from '../../helper/firebase_helper';
import BreadCrumb from '../../components/Common/BreadCrumb';

const Staff = () => {
    const [staffMembers, setStaffMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        name: '', role: 'Maid', phone: '', location: '', status: 'Active'
    });

    const toggleModal = () => setModal(m => !m);
    const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const useEffect = React.useEffect;
    useEffect(() => { fetchStaff(); }, []);

    const fetchStaff = async () => {
        try {
            const res = await getStaff();
            setStaffMembers(res.data);
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
            await createStaff(form);
            toggleModal();
            setForm({ name: '', role: 'Maid', phone: '', location: '', status: 'Active' });
            fetchStaff();
        } catch (err) {
            alert('Error adding staff member');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-slate-400 flex justify-center"><Activity className="animate-spin" /></div>;

    return (
        <div className="flex flex-col gap-6">
            <BreadCrumb title="Staff" pageTitle="Management" />

            <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 mb-0">Manage your maids, guards, and cooks.</p>
                <Button onClick={toggleModal} className="gap-2"><Plus size={18} /> Add Staff</Button>
            </div>

            <div className="card">
                <div className="card-header align-items-center d-flex border-bottom-0 pb-0">
                    <h4 className="card-title mb-0 flex-grow-1">Staff Roster</h4>
                </div>
                <div className="card-body">
                    <div className="table-responsive table-card">
                        <table className="table table-hover table-striped align-middle table-nowrap mb-0">
                            <thead className="table-light">
                                <tr>
                                    {['Name', 'Role', 'Phone', 'Location', 'Status'].map(col => (
                                        <th key={col} className="text-muted text-uppercase fs-11" style={{ padding: '12px 16px' }}>{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {staffMembers.length === 0 ? (
                                    <tr><td colSpan="5" className="p-8 text-center text-slate-500">No staff members registered yet.</td></tr>
                                ) : staffMembers.map(staff => (
                                    <tr key={staff.id}>
                                        <td className="p-4 text-white font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                                                    {staff.name.charAt(0)}
                                                </div>
                                                {staff.name}
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-300">{staff.role}</td>
                                        <td className="p-4 text-slate-400 text-sm">
                                            <div className="flex items-center gap-1"><Phone size={14} /> {staff.phone}</div>
                                        </td>
                                        <td className="p-4 text-slate-400 text-sm">
                                            <div className="flex items-center gap-1"><MapPin size={14} /> {staff.location}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs ${staff.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                                {staff.status}
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
                <ModalHeader toggle={toggleModal}>Register New Staff</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit} id="staffForm">
                        <FormGroup>
                            <Label for="name">Full Name</Label>
                            <RSInput id="name" name="name" placeholder="e.g. Ramesh Kumar" value={form.name} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label for="role">Role / Job Title</Label>
                            <RSInput type="select" id="role" name="role" value={form.role} onChange={handleChange}>
                                <option value="Maid">Maid / Cleaning Staff</option>
                                <option value="Security Guard">Security Guard</option>
                                <option value="Cook">Cook / Kitchen Staff</option>
                                <option value="Manager">Manager / Caretaker</option>
                                <option value="Maintenance">Maintenance Worker</option>
                            </RSInput>
                        </FormGroup>
                        <FormGroup>
                            <Label for="phone">Phone Number</Label>
                            <RSInput id="phone" name="phone" placeholder="+91 9876543210" value={form.phone} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label for="location">Assignment Location</Label>
                            <RSInput id="location" name="location" placeholder="e.g. Building A / Main Gate" value={form.location} onChange={handleChange} required />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <RSButton color="secondary" outline onClick={toggleModal}>Cancel</RSButton>
                    <RSButton color="primary" type="submit" form="staffForm" disabled={submitting}>
                        {submitting ? <Spinner size="sm" /> : 'Register Staff'}
                    </RSButton>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default Staff;
