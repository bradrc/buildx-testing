import axiosInstance from '../api/axiosInstance';
import type { Customer } from '../types/customer';

export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export const CustomerService = {
  async createCustomer(customer: Partial<Customer>): Promise<Customer> {
    const response = await axiosInstance.post('/customers', customer);
    return response.data;
  },

  async getCustomerById(id: string): Promise<Customer> {
    const response = await axiosInstance.get(`/customers/${id}`);
    return response.data;
  },

  async getAllCustomers(): Promise<Customer[]> {
    const response = await axiosInstance.get('/customers');
    return response.data;
  },

  async getPagedCustomers(pageNumber: number, pageSize: number, searchTerm?: string): Promise<PagedResponse<Customer>> {
    const response = await axiosInstance.get('/customers/paged', {
      params: { pageNumber, pageSize, searchTerm }
    });
    return response.data;
  },

  async updateCustomer(id: string, customer: Partial<Customer>): Promise<void> {
    await axiosInstance.put(`/customers/${id}`, customer);
  },

  async deleteCustomer(id: string): Promise<void> {
    await axiosInstance.delete(`/customers/${id}`);
  },
};
