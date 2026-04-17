import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserResponse, UserCreateRequest, UserUpdateRequest } from '../../types/user';
import { userService } from '../../services/userService';
import toast from 'react-hot-toast';
import { Loader2, Save, X } from 'lucide-react';

const userSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  role: z.string().min(1, 'Role is required'),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserFormProps {
  user?: UserResponse;
  onSave: () => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSave, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const isEditing = !!user;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: user ? {
      username: user.username,
      email: user.email,
      role: user.role,
      password: '',
    } : {
      username: '',
      email: '',
      role: 'User',
      password: '',
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    setLoading(true);
    try {
      if (isEditing) {
        const updateData: UserUpdateRequest = {
          username: data.username,
          email: data.email,
          role: data.role,
        };
        await userService.update(user!.id, updateData);
        toast.success('User updated successfully');
      } else {
        const createData: UserCreateRequest = {
          username: data.username,
          email: data.email,
          password: data.password,
          role: data.role,
        };
        await userService.create(createData);
        toast.success('User created successfully');
      }
      onSave();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred while saving the user';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {isEditing ? 'Edit User' : 'Create New User'}
        </h2>
        <button 
          onClick={onCancel} 
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            {...register('username')}
            className={`w-full px-3 py-2 border rounded-md outline-none transition-all ${
              errors.username ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200 focus:border-indigo-500'
            }`}
            placeholder="johndoe"
          />
          {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            {...register('email')}
            type="email"
            className={`w-full px-3 py-2 border rounded-md outline-none transition-all ${
              errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200 focus:border-indigo-500'
            }`}
            placeholder="john@example.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        {!isEditing && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              {...register('password')}
              type="password"
              className={`w-full px-3 py-2 border rounded-md outline-none transition-all ${
                errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200 focus:border-indigo-500'
              }`}
              placeholder="******"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            {...register('role')}
            className={`w-full px-3 py-2 border rounded-md outline-none transition-all ${
              errors.role ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200 focus:border-indigo-500'
            }`}
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
          {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEditing ? 'Update User' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
