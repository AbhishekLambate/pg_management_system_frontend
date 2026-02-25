import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

/**
 * MainLayout
 * Persistent shell for all authenticated pages.
 * - Sidebar stays fixed on the left across every route.
 * - <Outlet /> is replaced by the matched child page component.
 */
const MainLayout = () => {
    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="dashboard-main">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
