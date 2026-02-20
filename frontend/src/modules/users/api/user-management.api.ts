import { apiClient } from '@/shared/api/client'
import { API_ENDPOINTS } from '@/shared/constants/api'
import type {
  AssignRolesPayload,
  CreateUserPayload,
  ListRolesResponse,
  ListUsersParams,
  ListUsersResponse,
  ManagedUser,
  UpdateUserPayload,
} from '../types/user-management.types'

export const userManagementApi = {
  async listUsers(params: ListUsersParams): Promise<ListUsersResponse> {
    const response = await apiClient.get<ListUsersResponse>(API_ENDPOINTS.USERS, { params })
    return response.data
  },

  async getUserById(id: string): Promise<ManagedUser> {
    const response = await apiClient.get<ManagedUser>(API_ENDPOINTS.USER_BY_ID(id))
    return response.data
  },

  async createUser(payload: CreateUserPayload): Promise<ManagedUser> {
    const response = await apiClient.post<ManagedUser>(API_ENDPOINTS.USERS, payload)
    return response.data
  },

  async updateUser(id: string, payload: UpdateUserPayload): Promise<ManagedUser> {
    const response = await apiClient.put<ManagedUser>(API_ENDPOINTS.USER_BY_ID(id), payload)
    return response.data
  },

  async assignRoles(id: string, payload: AssignRolesPayload): Promise<ManagedUser> {
    const response = await apiClient.put<ManagedUser>(
      API_ENDPOINTS.USER_ASSIGN_ROLES(id),
      payload
    )
    return response.data
  },

  async listRoles(): Promise<string[]> {
    const response = await apiClient.get<ListRolesResponse>(API_ENDPOINTS.ROLES)
    return response.data.roles
  },
}

