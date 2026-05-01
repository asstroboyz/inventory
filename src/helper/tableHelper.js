/**
 * Table Helper for handling pagination, sorting, and display options
 * Designed to be consistent with the project's premium aesthetic and server-side logic
 */

export const paginationComponentOptions = {
    rowsPerPageText: 'Baris per halaman:',
    rangeSeparatorText: 'dari',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Semua',
};

/**
 * Hook-like logic for managing table states
 * Returns initial states and standard handlers
 */
export const getInitialTableState = () => ({
    page: 1,
    limit: 10,
    order: 'asc',
    orderBy: 'id',
    searchTerm: '',
});

/**
 * Formats sort direction for API calls
 * @param {string} direction - 'asc' or 'desc'
 */
export const formatSortDirection = (direction) => direction.toLowerCase();

/**
 * Helper to handle sorting logic compatible with react-data-table patterns
 * but adapted for our custom premium table
 */
export const handleTableSort = (column, sortDirection, setOrder, setOrderBy) => {
    // In our custom table, column might be a string (field name) or object
    const field = typeof column === 'string' ? column : column.id;
    setOrder(sortDirection);
    setOrderBy(field);
};
