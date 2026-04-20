import axiosInstance from '../api/axiosInstance';
import type { Customer } from '../types/customer';

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
};
