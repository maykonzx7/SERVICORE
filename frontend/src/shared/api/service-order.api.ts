import axios from "axios";

export interface CreateServiceOrderDto {
  companyId: string;
  description: string;
  priority: string;
  value: number;
}

export interface ServiceOrderResponse {
  id: string;
  companyId: string;
  description: string;
  priority: string;
  value: number;
  status: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const serviceOrderApi = {
  create: (data: CreateServiceOrderDto) =>
    api.post<ServiceOrderResponse>("/service-orders", data),

  list: (companyId: string, page: number = 1, limit: number = 10) =>
    api.get<PaginatedResponse<ServiceOrderResponse>>("/service-orders", {
      params: { companyId, page, limit },
    }),

  getById: (id: string) =>
    api.get<ServiceOrderResponse>(`/service-orders/${id}`),

  start: (id: string) =>
    api.put<ServiceOrderResponse>(`/service-orders/${id}/start`),

  complete: (id: string) =>
    api.put<ServiceOrderResponse>(`/service-orders/${id}/complete`),

  cancel: (id: string) =>
    api.put<ServiceOrderResponse>(`/service-orders/${id}/cancel`),
};

