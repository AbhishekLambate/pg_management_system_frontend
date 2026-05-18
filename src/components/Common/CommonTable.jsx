import React, { useState } from 'react';
import { Input, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

/**
 * CommonTable — Renders a styled table with optional search bar, toolbar, and sort dropdown.
 *
 * Pagination is NOT included — manage it in the parent and pass pre-sliced `data`.
 *
 * Props:
 *  columns           Array<ColumnDef>  Column definitions
 *  data              Array<Object>     Rows to display (pre-filtered & pre-sliced by parent)
 *  showSearch        boolean           Show search input (default: true)
 *  searchPlaceholder string            Search input placeholder
 *  onSearchChange    (term) => void    Called on every search keystroke (parent handles filtering)
 *  showCheckbox      boolean           Show row checkboxes (default: false)
 *  showActions       boolean           Show Edit/Remove action column (default: false)
 *  onEdit            (row) => void
 *  onRemove          (row) => void
 *  editModalTarget   string            Bootstrap modal target for Edit
 *  removeModalTarget string            Bootstrap modal target for Remove
 *  toolbar           ReactNode         Extra content rendered in the toolbar row
 *  sortOptions       Array<string>     Sort dropdown labels
 *  onSortChange      (value) => void   Called when sort changes
 *  tableId           string            id on <table>
 *  emptyTitle        string            Empty-state heading
 *  emptySubText      string            Empty-state sub-text
 *  headerStyle       Object            Extra <th> styles
 *  cellStyle         Object            Extra <td> styles
 *
 * ColumnDef shape:
 *  {
 *    key: string,
 *    label: string,
 *    hidden?: boolean,
 *    sortKey?: string,
 *    width?: string,
 *    align?: 'left' | 'center' | 'right',
 *    render?: (value, row) => ReactNode
 *  }
 */
const CommonTable = ({
    columns = [],
    data = [],
    showSearch = true,
    searchPlaceholder = 'Search...',
    onSearchChange,
    showCheckbox = false,
    showActions = false,
    onEdit,
    onRemove,
    editModalTarget = '#showModal',
    removeModalTarget = '#deleteRecordModal',
    toolbar,
    sortOptions,
    onSortChange,
    tableId = 'commonTable',
    emptyTitle = 'Sorry! No Result Found',
    emptySubText = "We've searched and did not find any records.",
    headerStyle: extraHeaderStyle = {},
    cellStyle: extraCellStyle = {},
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState(sortOptions?.[0] || '');
    const [allChecked, setAllChecked] = useState(false);
    const [checkedRows, setCheckedRows] = useState({});

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearchTerm(val);
        onSearchChange && onSearchChange(val);
    };

    // Checkbox helpers
    const handleCheckAll = (e) => {
        const checked = e.target.checked;
        setAllChecked(checked);
        const next = {};
        data.forEach((_, i) => { next[i] = checked; });
        setCheckedRows(next);
    };

    const handleRowCheck = (idx, e) => {
        const next = { ...checkedRows, [idx]: e.target.checked };
        setCheckedRows(next);
        setAllChecked(data.every((_, i) => next[i]));
    };

    // Visible (non-hidden) columns
    const visibleCols = columns.filter((c) => !c.hidden);

    const colCount =
        visibleCols.length +
        (showCheckbox ? 1 : 0) +
        (showActions ? 1 : 0);

    const baseHeaderStyle = {
        fontFamily: "'Inter', sans-serif",
        fontSize: '13px',
        lineHeight: '15px',
        letterSpacing: '0.1px',
        fontWeight: 500,
        padding: '12px 16px',
        // borderBottom: 'none',
        whiteSpace: 'nowrap',
        ...extraHeaderStyle,
    };

    const baseCellStyle = {
        fontFamily: "'Inter', sans-serif",
        fontSize: '13px',
        padding: '12px 16px',
        // borderBottom: 'none',
        verticalAlign: 'middle',
        background: 'transparent',
        ...extraCellStyle,
    };

    return (
        <div>
            {/* ── Toolbar ── */}
            {(showSearch || toolbar || sortOptions?.length > 0) && (
                <div
                    className="d-flex align-items-center gap-3 flex-wrap"
                    style={{ paddingTop: '18px' }}
                >
                    {showSearch && (
                        <div className="position-relative" style={{ width: '334px' }}>
                            <i
                                className="ri-search-line"
                                style={{
                                    position: 'absolute',
                                    left: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#878A99',
                                    fontSize: '12px',
                                    pointerEvents: 'none',
                                    zIndex: 1,
                                }}
                            />
                            <Input
                                type="text"
                                id={`${tableId}-search`}
                                placeholder={searchPlaceholder}
                                value={searchTerm}
                                onChange={handleSearch}
                                className="form-control"
                                style={{
                                    height: '38px',
                                    borderRadius: '4px',
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: '13px',
                                    paddingLeft: '34px',
                                    boxShadow: 'none',
                                }}
                            />
                        </div>
                    )}

                    {toolbar && (
                        <div className="d-flex gap-2 align-items-center">{toolbar}</div>
                    )}

                    {sortOptions?.length > 0 && (
                        <div className="ms-auto">
                            <UncontrolledDropdown>
                                <DropdownToggle
                                    tag="button"
                                    className="btn btn-light"
                                    style={{
                                        minWidth: '130px',
                                        height: '38px',
                                        borderRadius: '4px',
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: '13px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '0 12px',
                                        gap: '6px',
                                    }}
                                >
                                    {sortBy}
                                    <i className="ri-arrow-down-s-line" style={{ fontSize: '16px' }} />
                                </DropdownToggle>
                                <DropdownMenu end>
                                    {sortOptions.map((opt) => (
                                        <DropdownItem
                                            key={opt}
                                            onClick={() => {
                                                setSortBy(opt);
                                                onSortChange && onSortChange(opt);
                                            }}
                                            style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px' }}
                                        >
                                            {opt}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </div>
                    )}
                </div>
            )}

            {/* ── Table ── */}
            <div className="table-responsive" style={{ marginTop: '16px' }}>
                <table
                    className="table align-middle table-nowrap mb-0"
                    id={tableId}
                    style={{ borderCollapse: 'collapse', width: '100%' }}
                >
                    <thead className="table-light">
                        <tr>
                            {showCheckbox && (
                                <th scope="col" style={{ ...baseHeaderStyle, width: '50px' }}>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`${tableId}-checkAll`}
                                            checked={allChecked}
                                            onChange={handleCheckAll}
                                        />
                                    </div>
                                </th>
                            )}
                            {visibleCols.map((col) => (
                                <th
                                    key={col.key}
                                    className={col.sortKey ? 'sort' : ''}
                                    data-sort={col.sortKey || undefined}
                                    style={{
                                        ...baseHeaderStyle,
                                        ...(col.width ? { width: col.width } : {}),
                                        ...(col.align ? { textAlign: col.align } : {}),
                                    }}
                                >
                                    {col.label}
                                </th>
                            ))}
                            {showActions && (
                                <th style={{ ...baseHeaderStyle, textAlign: 'center' }}>Action</th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="list">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={colCount}>
                                    <div className="text-center py-4">
                                        <lord-icon
                                            src="https://cdn.lordicon.com/msoeawqm.json"
                                            trigger="loop"
                                            colors="primary:#121331,secondary:#08a88a"
                                            style={{ width: '75px', height: '75px' }}
                                        />
                                        <h5 className="mt-2">{emptyTitle}</h5>
                                        <p className="text-muted mb-0">{emptySubText}</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIdx) => (
                                <tr key={rowIdx}>
                                    {showCheckbox && (
                                        <th scope="row">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    name="chk_child"
                                                    value={`option${rowIdx + 1}`}
                                                    checked={!!checkedRows[rowIdx]}
                                                    onChange={(e) => handleRowCheck(rowIdx, e)}
                                                />
                                            </div>
                                        </th>
                                    )}
                                    {visibleCols.map((col) => (
                                        <td
                                            key={col.key}
                                            style={{
                                                ...baseCellStyle,
                                                ...(col.align ? { textAlign: col.align } : {}),
                                            }}
                                        >
                                            {col.render
                                                ? col.render(row[col.key], row)
                                                : row[col.key]}
                                        </td>
                                    ))}
                                    {showActions && (
                                        <td style={{ ...baseCellStyle, textAlign: 'center' }}>
                                            <div className="d-flex gap-2 justify-content-center">
                                                <button
                                                    className="btn btn-sm btn-success edit-item-btn"
                                                    data-bs-toggle="modal"
                                                    data-bs-target={editModalTarget}
                                                    onClick={() => onEdit && onEdit(row)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger remove-item-btn"
                                                    data-bs-toggle="modal"
                                                    data-bs-target={removeModalTarget}
                                                    onClick={() => onRemove && onRemove(row)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CommonTable;
