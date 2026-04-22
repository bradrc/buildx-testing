import React, { useEffect, useState } from 'react';
import type { Customer } from '../../types/customer';
import { CustomerService } from '../../services/customerService';
import { Edit2, Trash2, Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface CustomerTableProps {
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({ onEdit, onDelete }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await CustomerService.getPagedCustomers(page, pageSize, searchTerm);
      setCustomers(data.items);
      setTotalCount(data.totalCount);
    } catch (error) {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCustomers();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [page, searchTerm]);

  const totalPages = Math.ceil(totalCount / pageSize);

  if (loading && customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="mt-2 text-gray-500">Loading customers...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search customers by name or document..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Name</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Document</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Email</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Phone</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{customer.document}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{customer.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{customer.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit(customer)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3 p-1 hover:bg-indigo-50 rounded transition-colors"
                      title="Edit Customer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(customer.id!)}
                      className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                      title="Delete Customer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 bg-gray-50">
        <div className="text-sm text-gray-600">
          Showing {customers.length} of {totalCount} customers
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0}
            className="p-2 rounded-md border border-gray-300 bg-white text-gray-100 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerTable;
