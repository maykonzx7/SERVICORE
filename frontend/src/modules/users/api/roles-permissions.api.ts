import { apiClient } from '@/shared/api/client'
import { API_ENDPOINTS } from '@/shared/constants/api'
import type {
  AllPermissions,
  RolePermissions,
  RolePermissionsMatrix,
  ListRolesResponse,
} from '../types/roles-permissions.types'

export const rolesPermissionsApi = {
  /**
   * Lista todos os roles válidos do sistema
   */
  async listRoles(): Promise<string[]> {
    const response = await apiClient.get<ListRolesResponse>(API_ENDPOINTS.ROLES)
    return response.data.roles
  },

  /**
   * Obtém permissões de um role específico
   */
  async getRolePermissions(role: string): Promise<RolePermissions> {
    const response = await apiClient.get<RolePermissions>(
      `${API_ENDPOINTS.ROLES}/${role}/permissions`
    )
    return response.data
  },

  /**
   * Lista todas as permissões do sistema
   */
  async listAllPermissions(): Promise<AllPermissions> {
    const response = await apiClient.get<AllPermissions>(API_ENDPOINTS.PERMISSIONS)
    return response.data
  },

  /**
   * Obtém matriz completa de roles x permissões
   */
  async getRolePermissionsMatrix(): Promise<RolePermissionsMatrix> {
    const response = await apiClient.get<RolePermissionsMatrix>(
      `${API_ENDPOINTS.ROLES}/matrix/permissions`
    )
    return response.data
  },
}

