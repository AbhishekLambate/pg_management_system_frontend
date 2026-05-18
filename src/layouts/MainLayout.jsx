import React from 'react';
import { Outlet } from 'react-router-dom';
import Layout from '../Layouts';
import { Container } from 'reactstrap';

/**
 * MainLayout
 * Persistent shell for all authenticated pages.
 * Integrates Velzon layout.
 */
const MainLayout = () => {
    return (
        <Layout>
            <div className="page-content">
                <Container fluid>
                    <Outlet />
                </Container>
            </div>
        </Layout>
    );
};

export default MainLayout;

