import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { CustomerService } from '../services/customerService';
import { CepService } from '../services/cepService';
import type { Customer } from '../types/customer';

const customerSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  document: z.string().min(11, 'Documento inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  address: z.object({
    zipCode: z.string().regex(/^\d{8}$/, 'CEP deve conter 8 dígitos'),
    street: z.string().min(1, 'Rua é obrigatória'),
    neighborhood: z.string().min(1, 'Bairro é obrigatório'),
    city: z.string().min(1, 'Cidade é obrigatória'),
    state: z.string().min(2, 'Estado é obrigatório'),
  }),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

const CustomerRegistration = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCepLoading, setIsCepLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      address: {
        zipCode: '',
        street: '',
        neighborhood: '',
        city: '',
        state: '',
      },
    },
  });

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length !== 8) return;

    setIsCepLoading(true);
    try {
      const data = await CepService.getAddressByCep(cep);
      setValue('address.street', data.street);
      setValue('address.neighborhood', data.neighborhood);
      setValue('address.city', data.city);
      setValue('address.state', data.state);
      toast.success('Endereço localizado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao buscar CEP');
    } finally {
      setIsCepLoading(false);
    }
  };

  const onSubmit = async (data: CustomerFormValues) => {
    setIsSubmitting(true);
    try {
      await CustomerService.createCustomer(data as Customer);
      toast.success('Cliente cadastrado com sucesso!');
      navigate('/customers'); // Assuming a list page exists or will exist
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao cadastrar cliente');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-slate-800">Cadastro de Cliente</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-700 border-b pb-2">Informações Básicas</h2>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600">Nome Completo</label>
              <input
                {...register('name')}
                className={`w-full p-2 border rounded-md outline-none transition-all ${errors.name ? 'border-red-500 focus:ring-1 ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-1 ring-blue-500'}`}
                placeholder="João Silva"
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600">E-mail</label>
              <input
                {...register('email')}
                type="email"
                className={`w-full p-2 border rounded-md outline-none transition-all ${errors.email ? 'border-red-500 focus:ring-1 ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-1 ring-blue-500'}`}
                placeholder="joao@email.com"
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-600">Documento (CPF/CNPJ)</label>
                <input
                  {...register('document')}
                  className={`w-full p-2 border rounded-md outline-none transition-all ${errors.document ? 'border-red-500 focus:ring-1 ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-1 ring-blue-500'}`}
                  placeholder="000.000.000-00"
                />
                {errors.document && <p className="text-xs text-red-500">{errors.document.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-600">Telefone</label>
                <input
                  {...register('phone')}
                  className={`w-full p-2 border rounded-md outline-none transition-all ${errors.phone ? 'border-red-500 focus:ring-1 ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-1 ring-blue-500'}`}
                  placeholder="(11) 99999-9999"
                />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
              </div>
            </div>
          </div>

          {/* Address Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-700 border-b pb-2">Endereço</h2>
            
            <div className="space-y-1 relative">
              <label className="text-sm font-medium text-slate-600">CEP</label>
              <div className="relative">
                <input
                  {...register('address.zipCode')}
                  onBlur={handleCepBlur}
                  className={`w-full p-2 border rounded-md outline-none transition-all ${errors.address?.zipCode ? 'border-red-500 focus:ring-1 ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-1 ring-blue-500'}`}
                  placeholder="00000000"
                />
                {isCepLoading && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Loader2 size={16} className="animate-spin text-blue-500" />
                  </div>
                )}
              </div>
              {errors.address?.zipCode && <p className="text-xs text-red-500">{errors.address.zipCode.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600">Rua</label>
              <input
                {...register('address.street')}
                className={`w-full p-2 border rounded-md outline-none transition-all ${errors.address?.street ? 'border-red-500 focus:ring-1 ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-1 ring-blue-500'}`}
              />
              {errors.address?.street && <p className="text-xs text-red-500">{errors.address.street.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600">Bairro</label>
              <input
                {...register('address.neighborhood')}
                className={`w-full p-2 border rounded-md outline-none transition-all ${errors.address?.neighborhood ? 'border-red-500 focus:ring-1 ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-1 ring-blue-500'}`}
              />
              {errors.address?.neighborhood && <p className="text-xs text-red-500">{errors.address.neighborhood.message}</p>}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-1">
                <label className="text-sm font-medium text-slate-600">Cidade</label>
                <input
                  {...register('address.city')}
                  className={`w-full p-2 border rounded-md outline-none transition-all ${errors.address?.city ? 'border-red-500 focus:ring-1 ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-1 ring-blue-500'}`}
                />
                {errors.address?.city && <p className="text-xs text-red-500">{errors.address.city.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-600">UF</label>
                <input
                  {...register('address.state')}
                  maxLength={2}
                  className={`w-full p-2 border rounded-md outline-none transition-all ${errors.address?.state ? 'border-red-500 focus:ring-1 ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-1 ring-blue-500'}`}
                />
                {errors.address?.state && <p className="text-xs text-red-500">{errors.address.state.message}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:bg-blue-400"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save size={18} />
                Salvar Cliente
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerRegistration;
