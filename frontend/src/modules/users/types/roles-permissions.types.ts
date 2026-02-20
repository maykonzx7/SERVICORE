export interface Role {
  role: string
  description?: string
}

export interface RolePermissions {
  role: string
  permissions: string[]
  description?: string
}

export interface Permission {
  resource: string
  action: string
  fullPermission: string // "resource:action"
}

export interface PermissionGroup {
  resource: string
  actions: string[]
}

export interface AllPermissions {
  permissions: string[]
  groupedByResource: Record<string, string[]>
}

export interface RolePermissionsMatrix {
  matrix: Array<{
    role: string
    permissions: string[]
  }>
  allPermissions: string[]
}

export interface RoleWithPermissions extends Role {
  permissions: string[]
  userCount?: number
}

