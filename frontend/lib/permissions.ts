export interface UserPermissions {
  canViewAllTeamPerformance: boolean
  canViewStaffManagement: boolean
  canViewStaff: (targetStaff: any) => boolean
  canCreateStaff: boolean
  canEditStaff: (targetStaff: any) => boolean
  canDeleteStaff: (targetStaff: any) => boolean
}

export interface GrantablePermissions {
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
  canViewAll: boolean
  canAccessStaffManagement: boolean
  canManagePermissions: boolean
}

export interface UserWithCustomPermissions {
  userId: number
  username: string
  role: string
  customPermissions: GrantablePermissions
  grantedBy: number
  grantedAt: string
}

export const ROLE_HIERARCHY: Record<string, number> = {
  superadmin: 100,
  admin: 90,
  'business-supervisor': 85,
  'hr-supervisor': 80,
  'op-manager': 80,
  'mkt-supervisor': 75,
  cto: 85,
  'fullstack-dev': 70,
  'ux/ui': 70,
  'junior-ds': 65,
  'cs-supervisor': 60,
  'cd-supervisor': 60,
  'co-supervisor': 60,
  'ac-supervisor': 60,
  'cs-officer': 50,
  'cd-officer': 50,
  'cd-committee': 50,
  'co-officer': 50,
  'ac-officer': 50,
  'graphic-designer': 50,
  default: 0
}

export const IT_DEPARTMENT_ROLES = ['cto', 'fullstack-dev', 'ux/ui', 'junior-ds']

export function getRoleLevel(role: string): number {
  return ROLE_HIERARCHY[role] || ROLE_HIERARCHY['default']
}

export function isITDepartment(role: string): boolean {
  return IT_DEPARTMENT_ROLES.includes(role)
}

export function getUserPermissions(role: string, userId: number): UserPermissions {
  const userLevel = getRoleLevel(role)
  const custom = getCustomPermissions(userId)

  return {
    canViewStaffManagement:
      custom?.canAccessStaffManagement ?? canAccessStaffManagement(role),

    canViewStaff: (target: any) => {
      if (custom?.canViewAll) {
        const isSelf =
          target.user_id === userId || target.user?.id === userId
        const restrictedRoles = ['superadmin', 'admin', 'business-supervisor', 'cto']
        return !isSelf && !restrictedRoles.includes(target.role)
      }
      return canViewStaff(role, userId, target)
    },

    canCreateStaff: custom?.canCreate ?? canCreateStaff(role),

    canEditStaff: (target: any) => {
      if (custom?.canEdit && custom?.canViewAll) {
        const isSelf =
          target.user_id === userId || target.user?.id === userId
        return !isSelf && target.role !== 'superadmin'
      }
      return canEditStaff(role, userId, target)
    },

    canDeleteStaff: (target: any) => {
      if (custom?.canDelete && custom?.canViewAll) {
        const isSelf =
          target.user_id === userId || target.user?.id === userId
        return !isSelf && target.role !== 'superadmin'
      }
      return canDeleteStaff(role, userId, target)
    },

    canViewAllTeamPerformance:
      custom?.canViewAll ?? userLevel >= getRoleLevel('admin')
  }
}

function canAccessStaffManagement(role: string): boolean {
  if (!role) return false
  const normalized = role.toLowerCase().replace(/[\s-_]/g, '')
  const variations = [
    'superadmin',
    'super admin',
    'super-admin',
    'super_admin',
    'admin',
    'administrator'
  ]
  return variations.some(v => normalized === v.replace(/[\s-_]/g, '') || normalized.includes('admin'))
}

function canViewStaff(role: string, userId: number, target: any): boolean {
  // Superadmin can view all staff
  if (role === 'superadmin') return true
  
  // Admin can view non-superadmin staff
  if (role === 'admin') {
    return target.role !== 'superadmin'
  }
  
  return false
}

function canCreateStaff(role: string): boolean {
  return role === 'superadmin' || role === 'admin'
}

function canEditStaff(role: string, userId: number, target: any): boolean {
  // Superadmin can edit anyone
  if (role === 'superadmin') return true
  
  // Admin can edit non-superadmin staff
  if (role === 'admin') {
    const isSelf = target.user_id === userId || target.user?.id === userId
    return !isSelf && target.role !== 'superadmin'
  }
  
  return false
}

function canDeleteStaff(role: string, userId: number, target: any): boolean {
  // Superadmin can delete anyone (except themselves)
  if (role === 'superadmin') {
    const isSelf = target.user_id === userId || target.user?.id === userId
    return !isSelf
  }
  
  // Admin can delete non-superadmin staff (except themselves)
  if (role === 'admin') {
    const isSelf = target.user_id === userId || target.user?.id === userId
    return !isSelf && target.role !== 'superadmin'
  }
  
  return false
}

export function getCurrentUserFromStorage(): { role: string; id: number } | null {
  try {
    if (typeof window === 'undefined') return null;
    
    const data = localStorage.getItem('userData')
    if (!data) return null

    const user = JSON.parse(data)
    if (user.staff?.role) {
      const ids = [
        parseInt(user.staff.user_id) || 0,
        parseInt(user.id) || 0,
        parseInt(user.staff.id) || 0
      ].filter(Boolean)
      const finalId = ids[0]
      return { role: user.staff.role, id: finalId }
    }
  } catch (err) {
    console.error('Error reading user data:', err)
  }
  return null
}

export function debugUserPermissions(userId: number) {
  return getCustomPermissions(userId)
}

export function getCreatableRoles(role: string, userId: number): string[] {
  const custom = getCustomPermissions(userId)
  const userLevel = getRoleLevel(role)

  // Allow superadmin and admin to create staff (with custom permissions as override)
  if (role !== 'superadmin' && role !== 'admin' && !custom?.canCreate) return []

  const baseRoles = [
    'admin',
    'business-supervisor',
    'hr-supervisor',
    'cs-supervisor',
    'cs-officer',
    'cd-supervisor',
    'cd-officer',
    'cd-committee',
    'co-supervisor',
    'co-officer',
    'ac-supervisor',
    'ac-officer',
    'cto',
    'fullstack-dev',
    'ux/ui',
    'junior-ds',
    'mkt-supervisor',
    'graphic-designer',
    'op-manager'
  ]

  if (role === 'superadmin') return baseRoles.filter(r => r !== 'superadmin')

  // Admin can create most roles except restricted ones
  if (role === 'admin') {
    const restricted = ['superadmin']
    return baseRoles.filter(r => !restricted.includes(r) && r !== role)
  }

  if (custom?.canCreate) {
    const restricted = ['superadmin', 'admin', 'business-supervisor', 'cto']
    return baseRoles.filter(
      r =>
        !restricted.includes(r) &&
        r !== role &&
        getRoleLevel(r) < userLevel
    )
  }

  return []
}

export function getEditableRoles(role: string, userId: number): string[] {
  const custom = getCustomPermissions(userId)
  const userLevel = getRoleLevel(role)

  // Allow superadmin and admin to edit staff (with custom permissions as override)
  if (role !== 'superadmin' && role !== 'admin' && !custom?.canEdit) return []

  const baseRoles = [
    'admin',
    'business-supervisor',
    'hr-supervisor',
    'cs-supervisor',
    'cs-officer',
    'cd-supervisor',
    'cd-officer',
    'cd-committee',
    'co-supervisor',
    'co-officer',
    'ac-supervisor',
    'ac-officer',
    'cto',
    'fullstack-dev',
    'ux/ui',
    'junior-ds',
    'mkt-supervisor',
    'graphic-designer',
    'op-manager'
  ]

  if (role === 'superadmin') return baseRoles.filter(r => r !== 'superadmin')

  // Admin can edit most roles except superadmin
  if (role === 'admin') {
    const restricted = ['superadmin']
    return baseRoles.filter(r => !restricted.includes(r))
  }

  if (custom?.canEdit) {
    const restricted = ['superadmin', 'admin', 'business-supervisor', 'cto']
    return baseRoles.filter(
      r =>
        !restricted.includes(r) &&
        r !== role &&
        getRoleLevel(r) < userLevel
    )
  }

  return []
}

export function getDeletableRoles(role: string, userId: number): string[] {
  const custom = getCustomPermissions(userId)
  const userLevel = getRoleLevel(role)

  // Allow superadmin and admin to delete staff (with custom permissions as override)
  if (role !== 'superadmin' && role !== 'admin' && !custom?.canDelete) return []

  const baseRoles = [
    'admin',
    'business-supervisor',
    'hr-supervisor',
    'cs-supervisor',
    'cs-officer',
    'cd-supervisor',
    'cd-officer',
    'cd-committee',
    'co-supervisor',
    'co-officer',
    'ac-supervisor',
    'ac-officer',
    'cto',
    'fullstack-dev',
    'ux/ui',
    'junior-ds',
    'mkt-supervisor',
    'graphic-designer',
    'op-manager'
  ]

  if (role === 'superadmin') return baseRoles.filter(r => r !== 'superadmin')

  // Admin can delete most roles except superadmin
  if (role === 'admin') {
    const restricted = ['superadmin']
    return baseRoles.filter(r => !restricted.includes(r))
  }

  if (custom?.canDelete) {
    const restricted = ['superadmin', 'admin', 'business-supervisor', 'cto']
    return baseRoles.filter(
      r =>
        !restricted.includes(r) &&
        r !== role &&
        getRoleLevel(r) < userLevel
    )
  }

  return []
}

export function clearAllCustomPermissions(): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('customPermissions');
    }
  } catch (err) {
    console.error('Error clearing custom permissions:', err);
  }
}

// Only clear permissions when crossing user boundaries (different user IDs)
export function clearPermissionsForUserBoundary(newUserId: number): void {
  try {
    if (typeof window === 'undefined') return;
    
    const current = getCurrentUserFromStorage();
    if (!current || current.id !== newUserId) {
      localStorage.removeItem('customPermissions');
    }
  } catch (err) {
    console.error('Error in user boundary permission clearing:', err);
  }
}

export function getCustomPermissions(userId: number): GrantablePermissions | null {
  try {
    if (typeof window === 'undefined') return null;
    
    const stored = localStorage.getItem('customPermissions')
    if (!stored) return null
    
    const list: UserWithCustomPermissions[] = JSON.parse(stored)
    const userPerms = list.find(p => p.userId === userId)
    
    return userPerms ? userPerms.customPermissions : null
  } catch (err) {
    console.error('Error reading permissions:', err)
    return null
  }
}

function canManageUserPermissions(current: { role: string; id: number } | null): boolean {
  if (!current) return false
  if (current.role === 'superadmin') return true
  if (current.role === 'admin') {
    const perms = getCustomPermissions(current.id)
    return perms?.canManagePermissions ?? false
  }
  return false
}

export function setCustomPermissions(
  granterId: number,
  targetId: number,
  username: string,
  role: string,
  permissions: GrantablePermissions
): boolean {
  try {
    if (typeof window === 'undefined') return false;
    
    const current = getCurrentUserFromStorage()
    if (!current || !canManageUserPermissions(current)) return false

    if (permissions.canManagePermissions && current.role !== 'superadmin') return false
    if (permissions.canManagePermissions && !permissions.canAccessStaffManagement) return false
    if (current.role === 'admin' && role === 'admin' && targetId !== current.id) return false
    if (targetId === granterId) return false

    const existing = localStorage.getItem('customPermissions')
    const list: UserWithCustomPermissions[] = existing ? JSON.parse(existing) : []

    const updated = list.filter(p => p.userId !== targetId)
    updated.push({
      userId: targetId,
      username,
      role,
      customPermissions: permissions,
      grantedBy: granterId,
      grantedAt: new Date().toISOString()
    })

    localStorage.setItem('customPermissions', JSON.stringify(updated))
    localStorage.setItem('permissionVersion', Date.now().toString())
    
    return true
  } catch (err) {
    console.error('Error setting permissions:', err)
    return false
  }
}

export function removeCustomPermissions(granterId: number, targetId: number): boolean {
  try {
    if (typeof window === 'undefined') return false;
    
    const current = getCurrentUserFromStorage()
    if (!current || !canManageUserPermissions(current)) return false
    if (targetId === granterId) return false

    const existing = localStorage.getItem('customPermissions')
    const list: UserWithCustomPermissions[] = existing ? JSON.parse(existing) : []
    const updated = list.filter(p => p.userId !== targetId)

    localStorage.setItem('customPermissions', JSON.stringify(updated))
    localStorage.setItem('permissionVersion', Date.now().toString())
    
    return true
  } catch (err) {
    console.error('Error removing permissions:', err)
    return false
  }
}

export function getPermissionVersion(): string {
  if (typeof window === 'undefined') return '0';
  return localStorage.getItem('permissionVersion') || '0'
}

export function getAllUsersWithCustomPermissions(): UserWithCustomPermissions[] {
  try {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem('customPermissions')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function setBulkPermissions(
  ceoId: number,
  targetRoles: string[],
  permissions: GrantablePermissions,
  staffList: any[]
): boolean {
  try {
    const current = getCurrentUserFromStorage()
    if (!current || current.role !== 'ceo') return false

    const targets = staffList.filter(
      s => targetRoles.includes(s.role) && s.user_id !== ceoId
    )

    let count = 0
    for (const staff of targets) {
      if (
        setCustomPermissions(
          ceoId,
          staff.user_id,
          staff.user?.username || 'Unknown',
          staff.role,
          permissions
        )
      ) {
        count++
      }
    }

    return count > 0
  } catch (err) {
    console.error('Error applying bulk permissions:', err)
    return false
  }
}
