import React from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';

/**
 * StatCard - A reusable animated stat card component.
 *
 * Props:
 *  - stats: Array of { label, value, icon?, badge?, badgeClass? }
 *  - cols: Optional responsive column config, defaults to { xl: 3, md: 6 }
 */
const StatCard = ({ stats, cols = { xl: 3, md: 6 } }) => {
    return (
        <Row className="mb-4">
            {stats.map((stat, idx) => (
                <Col xl={cols.xl} md={cols.md} key={idx}>
                    <Card className="card-animate border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                        <CardBody className="p-4">
                            <div className="d-flex align-items-center">
                                <div className="flex-grow-1 overflow-hidden">
                                    <p
                                        className="text-uppercase fw-medium text-muted text-truncate mb-0 fs-11"
                                        style={{ letterSpacing: '0.1em' }}
                                    >
                                        {stat.label}
                                    </p>
                                </div>
                                {stat.badge && (
                                    <div className="flex-shrink-0">
                                        <h5 className={`fs-14 mb-0 text-${stat.badgeClass || 'success'}`}>
                                            <i className={`fs-13 align-middle ${stat.badge}`}></i>{' '}
                                            {stat.percentage && `${stat.percentage}%`}
                                        </h5>
                                    </div>
                                )}
                            </div>
                            <div className="d-flex align-items-end justify-content-between mt-3">
                                <div>
                                    <h1 className="fw-bold mb-0" style={{ fontSize: '2rem' }}>
                                        {stat.value}
                                    </h1>
                                    {stat.subLabel && (
                                        <p className="text-muted mb-0 mt-1 fs-12">{stat.subLabel}</p>
                                    )}
                                </div>
                                {stat.icon && (
                                    <div className="avatar-sm flex-shrink-0">
                                        <span className={`avatar-title rounded fs-3 bg-${stat.iconBg || 'primary'}`}>
                                            <i className={stat.icon}></i>
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default StatCard;
