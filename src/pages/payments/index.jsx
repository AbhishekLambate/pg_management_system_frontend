import React, { useState, useEffect } from 'react';
import { CreditCard, Activity, CheckCircle, Clock } from 'lucide-react';
import api_helper from '../../helper/api_helper';
import BreadCrumb from '../../components/Common/BreadCrumb';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    const useEffect = React.useEffect;
    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const response = await api_helper.get('/payments/');
            setPayments(response.data);
        } catch (error) {
            console.error('Error fetching payments:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-slate-400 flex justify-center"><Activity className="animate-spin" /></div>;
    }

    return (
        <div className="flex flex-col gap-6">
            <BreadCrumb title="Payments" pageTitle="Accounting" />

            <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 mb-0">Track monthly rent collection and pending dues.</p>
            </div>

            <div className="card">
                <div className="card-header align-items-center d-flex border-bottom-0 pb-0">
                    <h4 className="card-title mb-0 flex-grow-1">Payments List</h4>
                </div>
                <div className="card-body">
                    <div className="table-responsive table-card">
                        <table className="table table-hover table-striped align-middle table-nowrap mb-0">
                            <thead className="table-light">
                                <tr>
                                    {['Tenant', 'Month', 'Amount', 'Status', 'Date', 'Mode'].map(col => (
                                        <th key={col} className="text-muted text-uppercase fs-11" style={{ padding: '12px 16px' }}>{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {payments.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-slate-500">
                                            No payment records found. 
                                        </td>
                                    </tr>
                                ) : (
                                    payments.map((payment) => (
                                        <tr key={payment.id}>
                                            <td className="p-4 text-white font-medium">{payment.tenant_name || `Tenant #${payment.tenant_id}`}</td>
                                            <td className="p-4 text-slate-300">{payment.month}</td>
                                            <td className="p-4 text-indigo-400 font-bold">₹{payment.amount}</td>
                                            <td className="p-4">
                                                {payment.status === 'paid' ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                                                        <CheckCircle size={12} /> Paid
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full">
                                                        <Clock size={12} /> Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-slate-400 text-sm">
                                                {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : '-'}
                                            </td>
                                            <td className="p-4 text-slate-400 text-sm uppercase">
                                                {payment.payment_mode || '-'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payments;
