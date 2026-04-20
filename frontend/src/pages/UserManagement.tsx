import React, { useState } from "react";
import UserTable from "../components/users/UserTable";
import UserForm from "../components/users/UserForm";
import Modal from "../components/common/Modal";
import type { UserResponse } from "../types/user";
import { userService } from "../services/userService";
import toast from "react-hot-toast";

const UserManagement: React.FC = () => {
  const [editingUser, setEditingUser] = useState<UserResponse | undefined>(undefined);
  const [isCreating, setIsCreating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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
    setRefreshKey(prev => prev + 1);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    try {
      await userService.delete(id);
      toast.success("User deleted successfully");
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const isModalOpen = !!(editingUser || isCreating);

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

      <div className="w-full">
        <UserTable 
          key={refreshKey} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleClose} 
        title={editingUser ? `Edit User: ${editingUser.username}` : "Create New User"}
      >
        <UserForm
          user={editingUser}
          onSave={handleClose}
          onCancel={handleClose}
        />
      </Modal>
    </div>
  );
};

export default UserManagement;
