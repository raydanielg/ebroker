import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { isRTL } from "@/utils/helperFunction";

/**
 * A reusable table component that can render dynamic columns and data
 *
 * Column Configuration Options:
 * - header: The text or element to display in the column header
 * - accessor: The key to access data from each row item (can use dot notation for nested properties)
 * - align: Text alignment - "left" (default), "center", or "right"
 * - className: Optional CSS class to apply to the column
 * - renderCell: Optional function to render custom cell content - gets passed row item and index
 *
 * Usage example:
 * ```jsx
 * const columns = [
 *   { header: "Name", accessor: "name" },
 *   { header: "Email", accessor: "email" },
 *   {
 *     header: "Actions",
 *     accessor: "id",
 *     renderCell: (item) => <button onClick={() => handleEdit(item.id)}>Edit</button>
 *   }
 * ];
 *
 * <ReusableTable
 *   columns={columns}
 *   data={users}
 *   isLoading={loading}
 * />
 * ```
 *
 * @param {Object} props Component props
 * @param {Array} props.columns Array of column definitions
 * @param {Array} props.data Array of data items to display in the table
 * @param {boolean} props.isLoading Whether the table is in a loading state
 * @param {React.ReactNode} props.emptyMessage Message to display when no data is available
 * @param {React.ReactNode} props.loadingComponent Custom loading component
 * @param {string} props.headerClassName CSS class for the table header
 * @param {function} props.rowClassName Function to get CSS class for a row
 * @param {function} props.onRowClick Function called when a row is clicked
 */
const ReusableTable = ({
  columns,
  data,
  isLoading = false,
  emptyMessage = "No data available",
  loadingComponent,
  tableClassName,
  headerClassName = "bg-gray-50",
  rowClassName,
  onRowClick,
  parentClassName,
}) => {
  const isRtl = isRTL()
  // Default loading component if none provided
  const defaultLoadingComponent = (
    <div className="flex min-h-[400px] items-center justify-center py-6">
      <svg
        className="primaryColor h-10 w-10 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );

  // Function to render cell content based on accessor or custom renderer
  const renderCellContent = (item, column, index) => {
    // Use custom renderer if provided
    if (column.renderCell) {
      return column.renderCell(item, index);
    }

    // Handle special case for nested properties with dot notation (e.g., "category.name")
    const accessor = column.accessor;
    if (accessor.includes && accessor.includes(".")) {
      const keys = accessor.split(".");
      let value = item;
      for (const key of keys) {
        if (value === null || value === undefined) return null;
        value = value[key];
      }
      return value;
    }

    // Regular property access
    return item[accessor];
  };

  // Get alignment class based on column alignment
  const getAlignmentClass = (align) => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  return (
    <Table className={tableClassName} parentClassName={parentClassName}>
      <TableHeader className={headerClassName}>
        <TableRow>
          {columns.map((column, index) => (
            <TableHead
              key={index}
              className={`p-4 text-sm font-semibold ${isRtl ? "last:rounded-tl-xl first:rounded-tr-xl border-r-0" : "first:rounded-tl-xl last:rounded-tr-xl"} ${getAlignmentClass(column.align)} ${column.className || ""}`}
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className="[&_tr:first-child]:newBorder overflow-x-auto w-full">
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center">
              {loadingComponent || defaultLoadingComponent}
            </TableCell>
          </TableRow>
        ) : data?.length > 0 ? (
          data.map((item, rowIndex) => (
            <TableRow
              key={rowIndex}
              className={`${rowClassName ? rowClassName(item, rowIndex) : ""} `}
              onClick={
                onRowClick ? () => onRowClick(item, rowIndex) : undefined
              }
              style={onRowClick ? { cursor: "pointer" } : undefined}
            >
              {columns.map((column, colIndex) => (
                <TableCell
                  key={colIndex}
                  className={` ${getAlignmentClass(column.align)} ${column.className || ""} p-4 last-child:rounded-br-xl first-child:rounded-bl-xl`}
                >
                  {renderCellContent(item, column, rowIndex)}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="py-6 text-center">
              {emptyMessage}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ReusableTable;
