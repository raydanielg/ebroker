import React, { useState } from "react";
import ReusableTable from "./reusable-table";
import { Button } from "./button";

// Using a custom Badge component since shadcn Badge might not be installed
const Badge = ({ children, className }) => (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
        {children}
    </span>
);

const ReusableTableExample = () => {
    // Sample data
    const [users, setUsers] = useState([
        {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            role: "Admin",
            status: "active",
            joinDate: "2023-01-15",
            lastActive: "2023-05-20",
        },
        {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            role: "User",
            status: "inactive",
            joinDate: "2023-02-10",
            lastActive: "2023-04-18",
        },
        {
            id: 3,
            name: "Robert Johnson",
            email: "robert@example.com",
            role: "Editor",
            status: "pending",
            joinDate: "2023-03-22",
            lastActive: "2023-05-15",
        },
    ]);

    const [isLoading, setIsLoading] = useState(false);

    // Define table columns
    const columns = [
        {
            header: "ID",
            accessor: "id",
            align: "center",
            className: "w-16",
        },
        {
            header: "Name",
            accessor: "name",
            align: "left",
        },
        {
            header: "Email",
            accessor: "email",
            align: "left",
        },
        {
            header: "Role",
            accessor: "role",
            align: "center",
        },
        {
            header: "Status",
            accessor: "status",
            align: "center",
            renderCell: (user) => {
                const statusColors = {
                    active: "bg-green-100 text-green-700",
                    inactive: "bg-red-100 text-red-700",
                    pending: "bg-yellow-100 text-yellow-700",
                };

                return (
                    <Badge className={statusColors[user.status]}>
                        {user?.status?.charAt(0)?.toUpperCase() + user?.status?.slice(1)}
                    </Badge>
                );
            },
        },
        {
            header: "Join Date",
            accessor: "joinDate",
            align: "center",
        },
        {
            header: "Last Active",
            accessor: "lastActive",
            align: "center",
        },
        {
            header: "Actions",
            accessor: "id",
            align: "center",
            renderCell: (user) => (
                <div className="flex justify-center space-x-2">
                    <Button size="sm" variant="outline">
                        Edit
                    </Button>
                    <Button size="sm" variant="destructive">
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    // Example of toggling loading state
    const handleToggleLoading = () => {
        setIsLoading(!isLoading);
    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">User Management</h2>
            <div className="flex justify-between mb-4">
                <Button onClick={handleToggleLoading}>
                    {isLoading ? "Stop Loading" : "Simulate Loading"}
                </Button>
                <Button variant="default">Add New User</Button>
            </div>

            <div className="border rounded-lg">
                <ReusableTable
                    columns={columns}
                    data={users}
                    isLoading={isLoading}
                    emptyMessage="No users found"
                />
            </div>

            <div className="mt-8">
                <h3 className="text-lg font-medium mb-2">How to Use:</h3>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
                    {`import ReusableTable from "@/components/ui/reusable-table";

// Define your columns
const columns = [
  {
    header: "ID",
    accessor: "id",
    align: "center",
  },
  {
    header: "Name",
    accessor: "name",
    align: "left",
  },
  // Custom cell rendering
  {
    header: "Actions",
    accessor: "id",
    align: "center",
    renderCell: (item) => (
      <button onClick={() => handleAction(item.id)}>
        Edit
      </button>
    ),
  },
];

// Use the table
<ReusableTable
  columns={columns}
  data={yourData}
  isLoading={isLoading}
  emptyMessage="No data available"
/>`}
                </pre>
            </div>
        </div>
    );
};

export default ReusableTableExample; 