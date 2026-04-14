import React, { useState, useCallback } from "react";
import UserTable from "../components/users/UserTable";
import UserForm from "../components/users/UserForm";
import type { UserResponse } from "../types/user";
import { userService } from "../services/userService";

const UserManagement: React.FC = () => {
  const [editingUser, setEditingUser] = useState<UserResponse | undefined>(undefined);
  const [isCreating, setIsCreating] = useState(false);

  const handleEdit = (user: UserResponse) => {
    setEditingUser(user);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingUser(undefined);
  };

  const handleClose = () => {
    setEditingUser(undefined);
    setIsCreating(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await userService.delete(id);
      alert("User deleted successfully");
    } catch (error) {
      alert("Failed to delete user");
    }
  };

  const refreshUsers = useCallback(() => {
    // This is a dummy function to trigger re-render or reload in UserTable
    // In a real app, we might use a state or a context
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={handleCreate}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Add New User
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UserTable onEdit={handleEdit} onDelete={handleDelete} refreshUsers={refreshUsers} />
        </div>
        <div className="lg:col-span-1">
          {(editingUser || isCreating) && (
            <UserForm
              user={editingUser}
              onSave={handleClose}
              onCancel={handleClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
