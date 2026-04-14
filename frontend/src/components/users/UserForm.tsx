import React from 'react';

export const UserForm: React.FC<any> = ({ user, onSave, onCancel }) => {
  return (
    <div>
      <h2>User Form</h2>
      {/* Form content will go here */}
      <button onClick={onSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default UserForm;