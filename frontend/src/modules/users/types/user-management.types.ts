export interface ManagedUser {
  id: string
  email: string
  name?: string | null
  roles: string[]
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface UserPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ListUsersResponse {
  data: ManagedUser[]
  pagination: UserPagination
}

export interface ListUsersParams {
  page?: number
  limit?: number
  search?: string
  role?: string
  active?: boolean
}

export interface CreateUserPayload {
  email: string
  password: string
  name?: string
  roles?: string[]
}

export interface UpdateUserPayload {
  email?: string
  name?: string
  active?: boolean
  roles?: string[]
}

export interface AssignRolesPayload {
  roles: string[]
}

export interface ListRolesResponse {
  roles: string[]
}

