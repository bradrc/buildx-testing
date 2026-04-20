import axios from 'axios';
import type { CepResponse } from '../types/customer';

const BRASIL_API_URL = 'https://brasilapi.com.br/api/cep/v1';

export const CepService = {
  async getAddressByCep(cep: string): Promise<CepResponse> {
    try {
      const response = await axios.get(`${BRASIL_API_URL}/${cep}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar CEP');
    }
  },
};
