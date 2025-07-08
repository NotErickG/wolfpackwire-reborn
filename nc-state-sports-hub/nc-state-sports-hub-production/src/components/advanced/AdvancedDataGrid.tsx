// Advanced Data Grid Component - Senior Developer Scaffolding
// Reusable grid component with sorting, filtering, pagination, and virtualization

import React, { useState, useMemo, useCallback } from 'react';
import { useVirtualScrolling } from '../../hooks/useAdvancedFeatures';

interface Column<T> {
  key: keyof T;
  title: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, item: T, index: number) => React.ReactNode;
  filter?: 'text' | 'select' | 'date' | 'number';
  filterOptions?: { label: string; value: any }[];
}

interface AdvancedDataGridProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  virtualized?: boolean;
  containerHeight?: number;
  itemHeight?: number;
  loading?: boolean;
  onRowClick?: (item: T, index: number) => void;
  className?: string;
}

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface FilterConfig {
  [key: string]: any;
}

export function AdvancedDataGrid<T extends Record<string, any>>({
  data,
  columns,
  pageSize = 50,
  virtualized = false,
  containerHeight = 400,
  itemHeight = 50,
  loading = false,
  onRowClick,
  className = ''
}: AdvancedDataGridProps<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [filters, setFilters] = useState<FilterConfig>({});
  const [currentPage, setCurrentPage] = useState(1);

  // Apply filters
  const filteredData = useMemo(() => {
    return data.filter(item => {
      return Object.entries(filters).every(([key, filterValue]) => {
        if (!filterValue || filterValue === '') return true;
        
        const itemValue = item[key];
        if (typeof filterValue === 'string') {
          return String(itemValue).toLowerCase().includes(filterValue.toLowerCase());
        }
        return itemValue === filterValue;
      });
    });
  }, [data, filters]);

  // Apply sorting
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Apply pagination
  const paginatedData = useMemo(() => {
    if (virtualized) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, virtualized]);

  // Virtual scrolling setup
  const virtualScrolling = useVirtualScrolling(
    virtualized ? sortedData : [],
    itemHeight,
    containerHeight
  );

  const displayData = virtualized ? virtualScrolling.visibleItems : paginatedData;

  const handleSort = useCallback((key: string) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        return prev.direction === 'asc' 
          ? { key, direction: 'desc' }
          : null;
      }
      return { key, direction: 'asc' };
    });
  }, []);

  const handleFilter = useCallback((key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const renderHeader = () => (
    <thead className="bg-gray-50 sticky top-0">
      <tr>
        {columns.map((column) => (
          <th
            key={String(column.key)}
            className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
              column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
            }`}
            style={{ width: column.width }}
            onClick={column.sortable ? () => handleSort(String(column.key)) : undefined}
          >
            <div className="flex items-center justify-between">
              <span>{column.title}</span>
              {column.sortable && (
                <span className="ml-2">
                  {sortConfig?.key === column.key ? (
                    sortConfig.direction === 'asc' ? '↑' : '↓'
                  ) : (
                    '↕'
                  )}
                </span>
              )}
            </div>
          </th>
        ))}
      </tr>
      {/* Filter Row */}
      <tr className="bg-white border-b">
        {columns.map((column) => (
          <th key={String(column.key)} className="px-6 py-2">
            {column.filterable && (
              <div>
                {column.filter === 'select' ? (
                  <select
                    className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                    value={filters[String(column.key)] || ''}
                    onChange={(e) => handleFilter(String(column.key), e.target.value)}
                  >
                    <option value="">All</option>
                    {column.filterOptions?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={column.filter || 'text'}
                    className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                    placeholder={`Filter ${column.title}`}
                    value={filters[String(column.key)] || ''}
                    onChange={(e) => handleFilter(String(column.key), e.target.value)}
                  />
                )}
              </div>
            )}
          </th>
        ))}
      </tr>
    </thead>
  );

  const renderRow = (item: T, index: number, virtualIndex?: number) => (
    <tr
      key={virtualIndex !== undefined ? virtualIndex : index}
      className={`${
        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
      } hover:bg-gray-100 ${onRowClick ? 'cursor-pointer' : ''}`}
      onClick={onRowClick ? () => onRowClick(item, index) : undefined}
      style={virtualIndex !== undefined ? {
        transform: `translateY(${virtualScrolling.offsetY}px)`
      } : undefined}
    >
      {columns.map((column) => (
        <td key={String(column.key)} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {column.render 
            ? column.render(item[column.key], item, index)
            : String(item[column.key] || '')
          }
        </td>
      ))}
    </tr>
  );

  const renderPagination = () => {
    if (virtualized || totalPages <= 1) return null;

    return (
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{' '}
              <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span>
              {' '}to{' '}
              <span className="font-medium">
                {Math.min(currentPage * pageSize, sortedData.length)}
              </span>
              {' '}of{' '}
              <span className="font-medium">{sortedData.length}</span>
              {' '}results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === page
                        ? 'z-10 bg-red-50 border-red-500 text-red-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg ${className}`}>
      {virtualized ? (
        <div
          style={{ height: containerHeight, overflowY: 'auto' }}
          onScroll={virtualScrolling.onScroll}
        >
          <table className="min-w-full divide-y divide-gray-300">
            {renderHeader()}
            <tbody 
              className="bg-white divide-y divide-gray-200"
              style={{ height: virtualScrolling.totalHeight }}
            >
              {displayData.map(({ item, index }) => renderRow(item, index, index))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              {renderHeader()}
              <tbody className="bg-white divide-y divide-gray-200">
                {displayData.map((item, index) => renderRow(item, index))}
              </tbody>
            </table>
          </div>
          {renderPagination()}
        </>
      )}
    </div>
  );
}

export default AdvancedDataGrid;