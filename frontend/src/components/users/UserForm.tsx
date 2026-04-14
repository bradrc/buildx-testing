import React from 'react';

const UserForm: React.FC<any> = ({ user, onSave, onCancel }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">{user ? 'Edit User' : 'Create User'}</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input 
            type="text" 
            className="mt-1 block w-full border border-gray-300 rounded-md p-2" 
            defaultValue={user?.name} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input 
            type="email" 
            className="mt-1 block w-full border border-gray-300 rounded-md p-2" 
            defaultValue={user?.email} 
          />
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button 
          onClick={onCancel} 
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button 
          onClick={onSave} 
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default UserForm;
