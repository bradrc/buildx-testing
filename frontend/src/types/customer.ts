export interface Address {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Customer {
  id?: string;
  name: string;
  email: string;
  document: string;
  phone: string;
  address: Address;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CepResponse {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  service: string;
}
