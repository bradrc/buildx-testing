import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerTable from "../components/customers/CustomerTable";
import ConfirmationModal from "../components/common/ConfirmationModal";
import type { Customer } from "../types/customer";
import { CustomerService } from "../services/customerService";
import toast from "react-hot-toast";

const CustomerManagement: React.FC = () => {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  
  // State for deletion confirmation
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

  const handleEdit = (customer: Customer) => {
    navigate(`/customers/edit/${customer.id}`);
  };

  const handleCreate = () => {
    navigate('/customers/new');
  };

  const requestDelete = (id: string) => {
    setCustomerToDelete(id);
  };

  const confirmDelete = async () => {
    if (!customerToDelete) return;
    
    try {
      await CustomerService.deleteCustomer(customerToDelete);
      toast.success("Customer deleted successfully");
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      toast.error("Failed to delete customer");
    } finally {
      setCustomerToDelete(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
        <button
          onClick={handleCreate}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Add New Customer
        </button>
      </div>

      <div className="w-full">
        <CustomerTable 
          key={refreshKey} 
          onEdit={handleEdit} 
          onDelete={requestDelete} 
        />
      </div>

      <ConfirmationModal 
        isOpen={!!customerToDelete}
        onClose={() => setCustomerToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default CustomerManagement;
