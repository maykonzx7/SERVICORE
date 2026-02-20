/**
 * Mapeamento de Roles para Permissões
 * 
 * Define quais permissões cada role possui no sistema.
 * Este mapeamento é usado quando o backend não retorna permissões explícitas.
 */

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  ADMIN: [
    // Todas as permissões
    'user:view',
    'user:create',
    'user:update',
    'user:delete',
    'service-order:view',
    'service-order:create',
    'service-order:update',
    'service-order:delete',
    'financial:view',
    'financial:create',
    'financial:update',
    'financial:delete',
    'company:view',
    'company:create',
    'company:update',
    'company:delete',
  ],
  COMPANY_ADMIN: [
    // Gestão completa da empresa
    'user:view',
    'user:create',
    'user:update',
    'user:delete',
    'service-order:view',
    'service-order:create',
    'service-order:update',
    'service-order:delete',
    'financial:view',
    'financial:create',
    'financial:update',
    'company:view',
    'company:update',
  ],
  MANAGER: [
    // Gestão operacional
    'user:view',
    'service-order:view',
    'service-order:create',
    'service-order:update',
    'financial:view',
    'financial:create',
    'company:view',
  ],
  TECHNICIAN: [
    // Operações de campo
    'service-order:view',
    'service-order:update',
    'financial:view',
  ],
  CLIENT: [
    // Apenas visualização
    'service-order:view',
    'financial:view',
  ],
  USER: [
    // Permissões básicas
    'service-order:view',
  ],
}

/**
 * Obtém todas as permissões de um conjunto de roles
 */
export function getPermissionsFromRoles(roles: string[]): string[] {
  const permissions = new Set<string>()

  roles.forEach((role) => {
    const rolePermissions = ROLE_PERMISSIONS[role] || []
    rolePermissions.forEach((perm) => permissions.add(perm))
  })

  return Array.from(permissions)
}

/**
 * Verifica se um role tem uma permissão específica
 */
export function roleHasPermission(role: string, permission: string): boolean {
  const rolePermissions = ROLE_PERMISSIONS[role] || []
  return rolePermissions.includes(permission)
}

