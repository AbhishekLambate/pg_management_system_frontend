import React, { useState, useEffect } from 'react';
import { TrendingDown, Plus, Activity } from 'lucide-react';
import {
    Modal, ModalHeader, ModalBody, ModalFooter,
    Form, FormGroup, Label, Input as RSInput,
    Button as RSButton, Spinner
} from 'reactstrap';
import { Button } from '../../components/ui/Button';
import { getExpenses, createExpense } from '../../helper/firebase_helper';
import BreadCrumb from '../../components/Common/BreadCrumb';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        title: '', amount: '', category: 'Utilities',
        expense_date: new Date().toISOString().split('T')[0]
    });

    const toggleModal = () => setModal(m => !m);
    const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const useEffect = React.useEffect;
    useEffect(() => { fetchExpenses(); }, []);

    const fetchExpenses = async () => {
        try {
            const res = await getExpenses();
            setExpenses(res.data);
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
            await createExpense({
                ...form,
                amount: parseFloat(form.amount),
                expense_date: new Date(form.expense_date).toISOString()
            });
            toggleModal();
            setForm({ title: '', amount: '', category: 'Utilities', expense_date: new Date().toISOString().split('T')[0] });
            fetchExpenses();
        } catch (err) {
            alert('Error logging expense');
        } finally {
            setSubmitting(false);
        }
    };

    const total = expenses.reduce((acc, e) => acc + e.amount, 0);

    if (loading) return <div className="p-8 text-slate-400 flex justify-center"><Activity className="animate-spin" /></div>;

    return (
        <div className="flex flex-col gap-6">
            <BreadCrumb title="Expenses" pageTitle="Accounting" />

            <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 mb-0">Log operational costs and calculate profit margins.</p>
                <Button onClick={toggleModal} className="gap-2"><Plus size={18} /> Add Expense</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
                <div className="glass-panel p-6" style={{ borderLeft: '4px solid #f87171' }}>
                    <p className="text-sm text-slate-400 mb-1">Total Expenses Recorded</p>
                    <h2 className="text-3xl font-bold text-white">₹{total.toLocaleString()}</h2>
                </div>
            </div>

            <div className="card">
                <div className="card-header align-items-center d-flex border-bottom-0 pb-0">
                    <h4 className="card-title mb-0 flex-grow-1">Logged Expenses</h4>
                </div>
                <div className="card-body">
                    <div className="table-responsive table-card">
                        <table className="table table-hover table-striped align-middle table-nowrap mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="text-muted text-uppercase fs-11" style={{ padding: '12px 16px' }}>Description</th>
                                    <th className="text-muted text-uppercase fs-11" style={{ padding: '12px 16px' }}>Category</th>
                                    <th className="text-muted text-uppercase fs-11" style={{ padding: '12px 16px' }}>Date</th>
                                    <th className="text-muted text-uppercase fs-11" style={{ padding: '12px 16px' }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.length === 0 ? (
                                    <tr><td colSpan="4" className="p-8 text-center text-slate-500">No expenses logged yet.</td></tr>
                                ) : expenses.map(expense => (
                                    <tr key={expense.id}>
                                        <td className="p-4 text-white font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center">
                                                    <TrendingDown size={14} />
                                                </div>
                                                {expense.title}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 rounded bg-slate-500/15 text-xs text-slate-300">
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-400 text-sm">
                                            {new Date(expense.expense_date || expense.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-red-400 font-bold">- ₹{expense.amount.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Reactstrap Modal */}
            <Modal isOpen={modal} toggle={toggleModal} centered>
                <ModalHeader toggle={toggleModal}>Log New Expense</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit} id="expenseForm">
                        <FormGroup>
                            <Label for="title">Expense Title / Description</Label>
                            <RSInput id="title" name="title" placeholder="e.g. Plumbing Repair" value={form.title} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label for="amount">Amount (₹)</Label>
                            <RSInput type="number" id="amount" name="amount" min="0" placeholder="e.g. 1500" value={form.amount} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label for="category">Category</Label>
                            <RSInput type="select" id="category" name="category" value={form.category} onChange={handleChange}>
                                <option value="Utilities">Utilities (Electricity, Water, Wi-Fi)</option>
                                <option value="Maintenance">Maintenance & Repairs</option>
                                <option value="Food">Food & Groceries</option>
                                <option value="Staff">Staff Salary</option>
                                <option value="Miscellaneous">Miscellaneous</option>
                            </RSInput>
                        </FormGroup>
                        <FormGroup>
                            <Label for="expense_date">Date</Label>
                            <RSInput type="date" id="expense_date" name="expense_date" value={form.expense_date} onChange={handleChange} required />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <RSButton color="secondary" outline onClick={toggleModal}>Cancel</RSButton>
                    <RSButton color="primary" type="submit" form="expenseForm" disabled={submitting}>
                        {submitting ? <Spinner size="sm" /> : 'Log Expense'}
                    </RSButton>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default Expenses;
