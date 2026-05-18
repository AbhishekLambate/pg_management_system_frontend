import React, { useState, useEffect } from 'react';
import { Bell, Megaphone, Calendar, Plus, Activity } from 'lucide-react';
import {
    Modal, ModalHeader, ModalBody, ModalFooter,
    Form, FormGroup, Label, Input as RSInput,
    Button as RSButton, Spinner
} from 'reactstrap';
import { Button } from '../../components/ui/Button';
import { getNotices, createNotice } from '../../helper/firebase_helper';
import BreadCrumb from '../../components/Common/BreadCrumb';

const Notices = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({ title: '', content: '', type: 'Info' });

    const toggleModal = () => setModal(m => !m);
    const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const useEffect = React.useEffect;
    useEffect(() => { fetchNotices(); }, []);

    const fetchNotices = async () => {
        try {
            const res = await getNotices();
            setNotices(res.data);
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
            await createNotice(form);
            toggleModal();
            setForm({ title: '', content: '', type: 'Info' });
            fetchNotices();
        } catch (err) {
            alert('Error publishing notice');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-slate-400 flex justify-center"><Activity className="animate-spin" /></div>;

    return (
        <div className="flex flex-col gap-6">
            <BreadCrumb title="Notice Board" pageTitle="Management" />

            <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 mb-0">Broadcast announcements and alerts to all tenants.</p>
                <Button onClick={toggleModal} className="gap-2"><Plus size={18} /> New Notice</Button>
            </div>

            <div className="card">
                <div className="card-header align-items-center d-flex border-bottom-0 pb-0">
                    <h4 className="card-title mb-0 flex-grow-1">Announcements</h4>
                </div>
                <div className="card-body">
                    <div className="table-responsive table-card">
                        <table className="table table-hover table-striped align-middle table-nowrap mb-0">
                            <thead className="table-light">
                                <tr>
                                    {['Type', 'Notice Title', 'Content', 'Date'].map(col => (
                                        <th key={col} className="text-muted text-uppercase fs-11" style={{ padding: '12px 16px' }}>{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {notices.length === 0 ? (
                                    <tr><td colSpan="4" className="p-8 text-center text-slate-500">No notices published yet.</td></tr>
                                ) : notices.map(notice => (
                                    <tr key={notice.id}>
                                        <td className="p-4">
                                            <div className={`p-2 rounded-lg w-fit ${
                                                notice.type === 'Alert' ? 'bg-red-500/20 text-red-400' :
                                                notice.type === 'Reminder' ? 'bg-amber-500/20 text-amber-400' :
                                                'bg-blue-500/20 text-blue-400'
                                            }`}>
                                                {notice.type === 'Alert' ? <Bell size={18} /> : <Megaphone size={18} />}
                                            </div>
                                        </td>
                                        <td className="p-4 text-white font-bold max-w-xs truncate">{notice.title}</td>
                                        <td className="p-4 text-slate-300 text-sm max-w-md truncate">{notice.content}</td>
                                        <td className="p-4 text-slate-400 text-sm whitespace-nowrap">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} /> {new Date(notice.created_at).toLocaleDateString()}
                                            </div>
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
                <ModalHeader toggle={toggleModal}>Create New Notice</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit} id="noticeForm">
                        <FormGroup>
                            <Label for="title">Notice Title</Label>
                            <RSInput id="title" name="title" placeholder="e.g. Water Supply Interruption" value={form.title} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label for="type">Notice Type</Label>
                            <RSInput type="select" id="type" name="type" value={form.type} onChange={handleChange}>
                                <option value="Info">Information</option>
                                <option value="Alert">Alert (High Priority)</option>
                                <option value="Reminder">Reminder</option>
                            </RSInput>
                        </FormGroup>
                        <FormGroup>
                            <Label for="content">Content / Message</Label>
                            <RSInput type="textarea" id="content" name="content" rows={4}
                                placeholder="Write the notice content here..." 
                                value={form.content} onChange={handleChange} required />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <RSButton color="secondary" outline onClick={toggleModal}>Cancel</RSButton>
                    <RSButton color="primary" type="submit" form="noticeForm" disabled={submitting}>
                        {submitting ? <Spinner size="sm" /> : 'Publish Notice'}
                    </RSButton>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default Notices;
