import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
  useDeactivateUserMutation,
  useActivateUserMutation,
} from "@/app/store/services/admin";
import { User } from "@/app/store/services/auth";
import { toast } from "sonner";

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
}

export const UsersTable: React.FC<UsersTableProps> = ({ users, isLoading }) => {
  const [deleteUser] = useDeleteUserMutation();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [deactivateUser] = useDeactivateUserMutation();
  const [activateUser] = useActivateUserMutation();

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId).unwrap();
      toast.success("User deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete user");
    }
  };

  const handleUpdateRole = async (userId: string, currentRole: string) => {
    try {
      const newRole = currentRole === "user" ? "admin" : "user";
      await updateUserRole({ userId, data: { role: newRole } }).unwrap();
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update user role");
    }
  };

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      if (isActive) {
        await deactivateUser(userId).unwrap();
        toast.success("User deactivated successfully");
      } else {
        await activateUser(userId).unwrap();
        toast.success("User activated successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(`Failed to ${isActive ? "deactivate" : "activate"} user`);
    }
  };

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role || "user"}</TableCell>
            <TableCell>{user.isActive ? "Active" : "Inactive"}</TableCell>
            <TableCell className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateRole(user.id, user.role || "user")}
              >
                Toggle Role
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleToggleUserStatus(user.id, user.isActive || false)
                }
              >
                {user.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteUser(user.id)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
