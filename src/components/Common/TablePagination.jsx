import React from 'react';

const DEFAULT_ACCENT = '#4B38B3';

/**
 * TablePagination — Reusable pagination bar.
 *
 * Props:
 *  currentPage   number     Active page (1-indexed)
 *  totalPages    number     Total page count
 *  onPageChange  (page: number) => void   Called with the new page number
 *  accentColor   string     Active page background color (default: #4B38B3)
 */
const TablePagination = ({
    currentPage,
    totalPages,
    onPageChange,
    accentColor = DEFAULT_ACCENT,
}) => {
    // If you want it hidden when there's only 1 page, uncomment the next line:
    // if (totalPages <= 1) return null;
    const isFirst = currentPage === 1;
    const isLast = currentPage === totalPages;

    return (
        <div
            className="d-flex justify-content-end align-items-center"
            style={{ padding: '20px 24px', gap: '4px' }}
        >
            {/* Previous */}
            <button
                onClick={() => !isFirst && onPageChange(currentPage - 1)}
                disabled={isFirst}
                style={btnStyle({ isActive: false, isDisabled: isFirst, color: '#878A99', accentColor })}
            >
                Previous
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                    key={pg}
                    onClick={() => onPageChange(pg)}
                    style={btnStyle({ isActive: pg === currentPage, accentColor })}
                >
                    {pg}
                </button>
            ))}

            {/* Next */}
            <button
                onClick={() => !isLast && onPageChange(currentPage + 1)}
                disabled={isLast}
                style={btnStyle({ isActive: false, isDisabled: isLast, color: accentColor, accentColor })}
            >
                Next
            </button>
        </div>
    );
};

const btnStyle = ({ isActive, isDisabled, color, accentColor }) => ({
    height: '33px',
    minWidth: '33px',
    padding: '0 10px',
    backgroundColor: isActive ? accentColor : 'transparent',
    border: '1px solid transparent',
    borderRadius: '4px',
    fontFamily: "'Inter', sans-serif",
    fontSize: '13px',
    letterSpacing: '0.1px',
    color: isActive ? '#FFFFFF' : isDisabled ? '#aaa' : color || '#878A99',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    fontWeight: isActive ? 600 : 400,
    transition: 'all 0.15s',
});

export default TablePagination;
