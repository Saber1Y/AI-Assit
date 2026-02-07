"use client";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import * as React from "react";
import { z } from "zod";
import type { DataTableColumn, DataTableRow } from "@/types/analytics";

/**
 * Type for table variant
 */
type TableVariant = "default" | "compact" | "bordered";

/**
 * Type for sort direction
 */
type SortDirection = "asc" | "desc" | null;

/**
 * Variants for the Data Table component
 */
export const dataTableVariants = cva(
  "rounded-lg border overflow-hidden transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground shadow-sm",
        compact: "bg-card text-card-foreground shadow-sm",
        bordered: "bg-card text-card-foreground border-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/**
 * Zod schema for table column
 */
const tableColumnSchema = z.object({
  key: z.string().describe("Key to access data in row object"),
  label: z.string().describe("Display label for the column"),
  sortable: z.boolean().optional().describe("Whether the column can be sorted"),
  filterable: z.boolean().optional().describe("Whether the column can be filtered"),
  format: z.enum(["currency", "percentage", "date", "number", "text"]).optional().describe("How to format the column data"),
  width: z.string().optional().describe("CSS width for the column"),
});

/**
 * Zod schema for Data Table component
 */
export const dataTableSchema = z.object({
  data: z.array(z.any()).describe("Array of row data"),
  columns: z.array(tableColumnSchema).describe("Column definitions"),
  title: z.string().optional().describe("Title for the table"),
  variant: z.enum(["default", "compact", "bordered"]).optional().describe("Visual style variant"),
  pagination: z.object({
    page: z.number(),
    pageSize: z.number(),
    total: z.number(),
  }).optional().describe("Pagination information"),
  searchable: z.boolean().optional().describe("Whether to show search functionality"),
  sortable: z.boolean().optional().describe("Whether columns can be sorted"),
  className: z.string().optional().describe("Additional CSS classes for styling"),
});

export type DataTableProps = z.infer<typeof dataTableSchema>;

/**
 * Format cell value based on format type
 */
const formatCellValue = (value: any, format?: string): string => {
  if (value === null || value === undefined) return '-';
  
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(Number(value));
    case 'percentage':
      return `${(Number(value) * 100).toFixed(1)}%`;
    case 'date':
      return new Date(value).toLocaleDateString();
    case 'number':
      return new Intl.NumberFormat('en-US').format(Number(value));
    default:
      return String(value);
  }
};

/**
 * Data Table component for displaying tabular data
 */
export const DataTable = React.forwardRef<HTMLDivElement, DataTableProps>(
  ({ 
    className, 
    data, 
    columns, 
    title, 
    variant = 'default',
    pagination,
    searchable = true,
    sortable = true,
    ...props 
  }, ref) => {
    const [sortConfig, setSortConfig] = React.useState<{
      key: string;
      direction: SortDirection;
    } | null>(null);
    
    const [filters, setFilters] = React.useState<Record<string, string>>({});
    const [searchTerm, setSearchTerm] = React.useState('');

    // Apply sorting
    const sortedData = React.useMemo(() => {
      if (!sortConfig || !sortConfig.direction) return data;

      return [...data].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }, [data, sortConfig]);

    // Apply filters and search
    const filteredData = React.useMemo(() => {
      return sortedData.filter(row => {
        // Apply column filters
        for (const [key, value] of Object.entries(filters)) {
          if (value && String(row[key]).toLowerCase().indexOf(value.toLowerCase()) === -1) {
            return false;
          }
        }
        
        // Apply search
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          return columns.some(col => 
            String(row[col.key]).toLowerCase().indexOf(searchLower) !== -1
          );
        }
        
        return true;
      });
    }, [sortedData, filters, searchTerm, columns]);

    // Handle sort click
    const handleSort = (key: string) => {
      if (!sortable) return;
      
      setSortConfig(current => {
        if (current?.key === key) {
          // Toggle direction
          if (current.direction === 'asc') {
            return { key, direction: 'desc' };
          } else if (current.direction === 'desc') {
            return { key, direction: null };
          }
        }
        return { key, direction: 'asc' };
      });
    };

    // Handle filter change
    const handleFilter = (key: string, value: string) => {
      setFilters(prev => ({
        ...prev,
        [key]: value
      }));
    };

    return (
      <div
        ref={ref}
        className={cn(dataTableVariants({ variant }), className)}
        {...props}
      >
        {/* Title and Search */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            {title && (
              <h3 className="text-lg font-medium text-foreground">
                {title}
              </h3>
            )}
            
            {/* Search */}
            {searchable && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="absolute left-3 top-2.5 text-muted-foreground">
                  🔍
                </div>
              </div>
            )}
          </div>

          {/* Filters */}
          {columns.some(col => col.filterable) && (
            <div className="flex gap-2 flex-wrap mb-4">
              {columns.filter(col => col.filterable).map(column => (
                <input
                  key={column.key}
                  type="text"
                  placeholder={`Filter ${column.label}...`}
                  value={filters[column.key] || ''}
                  onChange={(e) => handleFilter(column.key, e.target.value)}
                  className="px-3 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ))}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Header */}
            <thead className="bg-muted/50 border-b">
              <tr>
                {columns.map(column => (
                  <th
                    key={column.key}
                    className={cn(
                      "px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider",
                      column.sortable && sortable && "cursor-pointer hover:bg-muted/80"
                    )}
                    style={{ width: column.width }}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {column.sortable && sortable && (
                        <span className="text-primary">
                          {sortConfig?.key === column.key ? (
                            sortConfig.direction === 'asc' ? '↑' : 
                            sortConfig.direction === 'desc' ? '↓' : '↕'
                          ) : '↕'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-border">
              {filteredData.map((row, index) => (
                <tr 
                  key={index}
                  className={cn(
                    "hover:bg-muted/30 transition-colors",
                    variant === 'compact' ? "py-2" : "py-3"
                  )}
                >
                  {columns.map(column => (
                    <td 
                      key={column.key}
                      className={cn(
                        "px-6 text-sm text-foreground",
                        variant === 'compact' ? "py-2" : "py-4"
                      )}
                    >
                      {formatCellValue(row[column.key], column.format)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* No data state */}
        {filteredData.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <div className="text-6xl mb-4">📊</div>
            <div className="font-medium">No data found</div>
            <div className="text-sm">Try adjusting your filters or search terms</div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t bg-muted/30">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              Showing {filteredData.length} of {data.length} items
            </div>
            
            {/* Pagination */}
            {pagination && (
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 border rounded hover:bg-muted transition-colors disabled:opacity-50"
                  disabled={pagination.page === 1}
                >
                  Previous
                </button>
                <span>
                  Page {pagination.page} of {Math.ceil(pagination.total / pagination.pageSize)}
                </span>
                <button
                  className="px-3 py-1 border rounded hover:bg-muted transition-colors disabled:opacity-50"
                  disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

DataTable.displayName = "DataTable";