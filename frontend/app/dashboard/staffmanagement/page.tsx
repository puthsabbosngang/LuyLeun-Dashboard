"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, RefreshCw, Users, Search, Filter, X, Lock, Key, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StaffTable } from "@/components/staff-table";
import { StaffFormDialog } from "@/components/staff-form-dialog";
import { Staff, staffAPI, getDepartmentLabel, DEPARTMENTS, STAFF_ROLES } from "@/lib/api/staffAPI";
import { getUserPermissions, setCustomPermissions, getCustomPermissions, getCreatableRoles, getEditableRoles, getDeletableRoles, getPermissionVersion } from "@/lib/permissions";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function StaffManagement() {
  const { user: authUser, loading: authLoading } = useAuth();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [permissionVersion, setPermissionVersion] = useState('0');
  
  // Initialize permission version after component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPermissionVersion(getPermissionVersion());
    }
  }, []);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  // Sorting state
  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Force component to re-render when user changes by tracking session changes
  useEffect(() => {
    const currentSessionId = localStorage.getItem('authToken') + '_' + Date.now();
    setSessionId(currentSessionId);
    
    // Clear any stale state when session changes
    setStaff([]);
    setLoading(true);
    setAccessDenied(false);
  }, [authUser?.id]);

  // Listen for permission changes to update UI
  useEffect(() => {
    const checkPermissionUpdates = () => {
      const currentVersion = getPermissionVersion();
      if (currentVersion !== permissionVersion) {
        setPermissionVersion(currentVersion);
      }
    };

    const interval = setInterval(checkPermissionUpdates, 1000);
    return () => clearInterval(interval);
  }, [permissionVersion]);

  // Individual user permission management
  const [selectedUser, setSelectedUser] = useState<Staff | null>(null);
  const [userPermissionDialogOpen, setUserPermissionDialogOpen] = useState(false);
  const [userPermissions, setUserPermissions] = useState({
    canAccessStaffManagement: false,
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canViewAll: false,
    canManagePermissions: false,
  });

  // Helper function to get consistent user ID
  const getUserId = (staff: Staff) => {
    return staff.user_id || staff.user?.id || staff.id;
  };

  // Get current user and permissions - use useMemo to ensure recalculation
  const currentUser = useMemo(() => {
    return authUser ? {
      role: authUser.staff?.role || authUser.role || authUser.type,
      id: authUser.id
    } : null;
  }, [authUser]);
  
  const permissions = useMemo(() => {
    return currentUser ? getUserPermissions(currentUser.role, currentUser.id) : null;
  }, [currentUser, permissionVersion]);
  
  const creatableRoles = useMemo(() => {
    return currentUser && permissions?.canCreateStaff ? getCreatableRoles(currentUser.role, currentUser.id) : [];
  }, [currentUser, permissions?.canCreateStaff, permissionVersion]);
  
  const editableRoles = useMemo(() => {
    return currentUser && permissions?.canEditStaff ? getEditableRoles(currentUser.role, currentUser.id) : [];
  }, [currentUser, permissions?.canEditStaff, permissionVersion]);
  
  const deletableRoles = useMemo(() => {
    return currentUser && permissions?.canDeleteStaff ? getDeletableRoles(currentUser.role, currentUser.id) : [];
  }, [currentUser, permissions?.canDeleteStaff, permissionVersion]);

  // Helper functions to check if specific staff can be edited/deleted based on role restrictions
  const canEditSpecificStaff = (staff: Staff): boolean => {
    if (!permissions?.canEditStaff) return false;
    return editableRoles.includes(staff.role);
  };

  const canDeleteSpecificStaff = (staff: Staff): boolean => {
    if (!permissions?.canDeleteStaff) return false;
    return deletableRoles.includes(staff.role);
  };

  // Reset access denied state when user changes
  useEffect(() => {
    if (authUser) {
      setAccessDenied(false);
    }
  }, [authUser?.id]); // Only trigger when user ID changes

  // Check page access on component mount
  useEffect(() => {
    // Wait for auth to complete loading
    if (authLoading) {
      return;
    }
    
    // If auth is done loading and no permissions, deny access
    if (!permissions?.canViewStaffManagement) {
      setAccessDenied(true);
      setLoading(false);
      return;
    }
    
    // If we have permissions, allow the page to proceed
    setAccessDenied(false);
  }, [permissions, authLoading]);

  const fetchStaff = async () => {
    if (!permissions?.canViewStaffManagement) {
      return;
    }
    
    try {
      const staffData = await staffAPI.getAllStaff();
      // Filter staff based on permissions
      const visibleStaff = staffData.filter(staffMember => 
        permissions.canViewStaff(staffMember)
      );
      setStaff(visibleStaff);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch staff data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!permissions?.canViewStaffManagement) {
      return;
    }
    
    setRefreshing(true);
    try {
      const staffData = await staffAPI.getAllStaff();
      // Filter staff based on permissions
      const visibleStaff = staffData.filter(staffMember => 
        permissions.canViewStaff(staffMember)
      );
      setStaff(visibleStaff);
      toast.success("Staff data refreshed");
    } catch (error: any) {
      toast.error(error.message || "Failed to refresh staff data");
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddStaff = () => {
    if (!permissions?.canCreateStaff) {
      toast.error("You don't have permission to create staff members");
      return;
    }
    setEditingStaff(null);
    setFormDialogOpen(true);
  };

  const handlePermissionClick = (staff: Staff) => {
    // Check if user can manage permissions (Super Admin or Admin with permission)
    const canManage = currentUser?.role === 'superadmin' || 
                     (currentUser?.role === 'admin' && getCustomPermissions(currentUser.id)?.canManagePermissions);
    
    if (canManage) {
      setSelectedUser(staff);
      // Load current permissions for this user using consistent ID
      const userId = getUserId(staff);
      const customPerms = getCustomPermissions(userId);
      setUserPermissions({
        canAccessStaffManagement: customPerms?.canAccessStaffManagement || false,
        canCreate: customPerms?.canCreate || false,
        canEdit: customPerms?.canEdit || false,
        canDelete: customPerms?.canDelete || false,
        canViewAll: customPerms?.canViewAll || false,
        canManagePermissions: customPerms?.canManagePermissions || false,
      });
      setUserPermissionDialogOpen(true);
    } else {
      toast.error('Only Super Admin or authorized Admin can manage permissions');
    }
  };

  const toggleAccessPermission = () => {
    if (!selectedUser || !currentUser) return;

    const newValue = !userPermissions.canAccessStaffManagement;
    const userId = getUserId(selectedUser);
    
    try {
      const success = setCustomPermissions(
        currentUser.id,
        userId,
        selectedUser.user?.username || selectedUser.full_name,
        selectedUser.role,
        {
          canAccessStaffManagement: newValue,
          canViewAll: newValue, // Grant view permissions when granting access
          canCreate: userPermissions.canCreate,
          canEdit: userPermissions.canEdit,
          canDelete: userPermissions.canDelete,
          canManagePermissions: userPermissions.canManagePermissions,
        }
      );

      if (success) {
        setUserPermissions(prev => ({
          ...prev,
          canAccessStaffManagement: newValue,
          canViewAll: newValue // Update local state as well
        }));
        
        // Immediately update permission version to trigger re-calculation
        setPermissionVersion(getPermissionVersion());
        
        toast.success(
          newValue 
            ? `Granted staff management access to ${selectedUser.full_name} (can view staff except Super Admin, admin, themselves)`
            : `Revoked staff management access from ${selectedUser.full_name}`
        );
        
        // Force refresh the permissions for the user who had permissions changed
        if (currentUser?.id === userId) {
          window.location.reload();
        }
      } else {
        toast.error('Failed to update permission');
      }
    } catch (error) {
      console.error('Error updating permission:', error);
      toast.error('Error updating permission');
    }
  };

  // Placeholder toggle functions for other permissions (UI only for now)
  const toggleCreatePermission = () => {
    if (!selectedUser || !currentUser) return;
    
    const newValue = !userPermissions.canCreate;
    const userId = getUserId(selectedUser);
    
    try {
      const success = setCustomPermissions(
        currentUser.id,
        userId,
        selectedUser.user?.username || selectedUser.full_name,
        selectedUser.role,
        {
          canAccessStaffManagement: userPermissions.canAccessStaffManagement,
          canViewAll: userPermissions.canViewAll,
          canCreate: newValue,
          canEdit: userPermissions.canEdit,
          canDelete: userPermissions.canDelete,
          canManagePermissions: userPermissions.canManagePermissions,
        }
      );

      if (success) {
        setUserPermissions(prev => ({
          ...prev,
          canCreate: newValue
        }));
        
        // Immediately update permission version to trigger re-calculation
        setPermissionVersion(getPermissionVersion());
        
        toast.success(
          newValue 
            ? `Granted CREATE permission to ${selectedUser.full_name} (can add staff for roles they can see, except same role)`
            : `Revoked CREATE permission from ${selectedUser.full_name}`
        );
        
      } else {
        toast.error('Failed to update create permission');
      }
    } catch (error) {
      console.error('Error updating create permission:', error);
      toast.error('Error updating create permission');
    }
  };

  const toggleEditPermission = () => {
    if (!selectedUser || !currentUser) return;
    
    const newValue = !userPermissions.canEdit;
    const userId = getUserId(selectedUser);
    
    try {
      const success = setCustomPermissions(
        currentUser.id,
        userId,
        selectedUser.user?.username || selectedUser.full_name,
        selectedUser.role,
        {
          canAccessStaffManagement: userPermissions.canAccessStaffManagement,
          canViewAll: userPermissions.canViewAll,
          canCreate: userPermissions.canCreate,
          canEdit: newValue,
          canDelete: userPermissions.canDelete,
          canManagePermissions: userPermissions.canManagePermissions,
        }
      );

      if (success) {
        setUserPermissions(prev => ({
          ...prev,
          canEdit: newValue
        }));
        
        // Immediately update permission version to trigger re-calculation
        setPermissionVersion(getPermissionVersion());
        
        toast.success(
          newValue 
            ? `Granted EDIT permission to ${selectedUser.full_name} (can edit staff for roles they can see, except same role)`
            : `Revoked EDIT permission from ${selectedUser.full_name}`
        );
        
      } else {
        toast.error('Failed to update edit permission');
      }
    } catch (error) {
      console.error('Error updating edit permission:', error);
      toast.error('Error updating edit permission');
    }
  };

  const toggleDeletePermission = () => {
    if (!selectedUser || !currentUser) return;
    
    const newValue = !userPermissions.canDelete;
    const userId = getUserId(selectedUser);
    
    try {
      const success = setCustomPermissions(
        currentUser.id,
        userId,
        selectedUser.user?.username || selectedUser.full_name,
        selectedUser.role,
        {
          canAccessStaffManagement: userPermissions.canAccessStaffManagement,
          canViewAll: userPermissions.canViewAll,
          canCreate: userPermissions.canCreate,
          canEdit: userPermissions.canEdit,
          canDelete: newValue,
          canManagePermissions: userPermissions.canManagePermissions,
        }
      );

      if (success) {
        setUserPermissions(prev => ({
          ...prev,
          canDelete: newValue
        }));
        
        // Immediately update permission version to trigger re-calculation
        setPermissionVersion(getPermissionVersion());
        
        toast.success(
          newValue 
            ? `Granted DELETE permission to ${selectedUser.full_name} (can delete staff for roles they can see, except same role)`
            : `Revoked DELETE permission from ${selectedUser.full_name}`
        );
        
      } else {
        toast.error('Failed to update delete permission');
      }
    } catch (error) {
      console.error('Error updating delete permission:', error);
      toast.error('Error updating delete permission');
    }
  };

  const toggleManagePermission = () => {
    if (!selectedUser || !currentUser) return;
    
    // Only Super Admin can grant permission management capabilities
    if (currentUser.role !== 'superadmin') {
      toast.error('Only Super Admin can grant permission management capabilities');
      return;
    }
    
    // Only allow granting to Admin users
    if (selectedUser.role !== 'admin') {
      toast.error('Permission management can only be granted to Admin users');
      return;
    }
    
    // Admin must have staff management access before they can manage permissions
    if (!userPermissions.canAccessStaffManagement) {
      toast.error('Admin must have staff management access before permission management can be granted');
      return;
    }
    
    const newValue = !userPermissions.canManagePermissions;
    const userId = getUserId(selectedUser);
    
    try {
      const success = setCustomPermissions(
        currentUser.id,
        userId,
        selectedUser.user?.username || selectedUser.full_name,
        selectedUser.role,
        {
          canAccessStaffManagement: userPermissions.canAccessStaffManagement,
          canViewAll: userPermissions.canViewAll,
          canCreate: userPermissions.canCreate,
          canEdit: userPermissions.canEdit,
          canDelete: userPermissions.canDelete,
          canManagePermissions: newValue,
        }
      );

      if (success) {
        setUserPermissions(prev => ({
          ...prev,
          canManagePermissions: newValue
        }));
        
        // Immediately update permission version to trigger re-calculation
        setPermissionVersion(getPermissionVersion());
        
        toast.success(
          newValue 
            ? `Granted PERMISSION MANAGEMENT to ${selectedUser.full_name} (can manage permissions for non-Admin users)`
            : `Revoked PERMISSION MANAGEMENT from ${selectedUser.full_name}`
        );
        
      } else {
        toast.error('Failed to update permission management capability');
      }
    } catch (error) {
      console.error('Error updating permission management capability:', error);
      toast.error('Error updating permission management capability');
    }
  };

  const handleEditStaff = (staff: Staff) => {
    if (!permissions?.canEditStaff(staff)) {
      toast.error("You don't have permission to edit this staff member");
      return;
    }
    setEditingStaff(staff);
    setFormDialogOpen(true);
  };

  const handleFormSuccess = () => {
    fetchStaff();
  };

  const handleFormClose = () => {
    setFormDialogOpen(false);
    setEditingStaff(null);
  };

  // Helper functions for filtering
  const getRoleLabel = (roleValue: string) => {
    if (!roleValue) return "Unknown Role";
    const role = STAFF_ROLES.find((r) => r.value === roleValue);
    return role ? role.label : roleValue.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Get unique departments and statuses for filter options
  const departments = useMemo(() => {
    const depts = [...new Set(staff.map(member => getDepartmentLabel(member.role)))];
    return depts.sort();
  }, [staff]);

  const statuses = useMemo(() => {
    const stats = [...new Set(staff.map(member => member.user?.status).filter(Boolean))];
    return stats.sort();
  }, [staff]);

  // Check if any filters are active
  const hasActiveFilters = filterRole !== "all" || filterDepartment !== "all" || filterStatus !== "all";

  // Enhanced filtering and sorting logic
  const filteredAndSortedStaff = useMemo(() => {
    let filtered = staff;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((member) => 
        member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.user?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getRoleLabel(member.role).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getDepartmentLabel(member.role).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (filterRole !== "all") {
      filtered = filtered.filter(member => member.role === filterRole);
    }

    // Apply department filter
    if (filterDepartment !== "all") {
      filtered = filtered.filter(member => getDepartmentLabel(member.role) === filterDepartment);
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(member => member.user?.status === filterStatus);
    }

    // Apply sorting
    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortColumn) {
          case "name":
            aValue = a.full_name.toLowerCase();
            bValue = b.full_name.toLowerCase();
            break;
          case "username":
            aValue = (a.user?.username || "").toLowerCase();
            bValue = (b.user?.username || "").toLowerCase();
            break;
          case "role":
            // Use role priority for sorting, then alphabetical
            const roleOrder: { [key: string]: number } = {
              'customer_service_manager': 1,
              'credit_manager': 2,
              'collection_manager': 3,
              'credit_analyst': 4,
              'collection_analyst': 5,
              'customer_service_agent': 6,
              'general_staff': 7
            };
            aValue = roleOrder[a.role] || 99;
            bValue = roleOrder[b.role] || 99;
            // If same priority, sort by role label alphabetically
            if (aValue === bValue) {
              aValue = getRoleLabel(a.role).toLowerCase();
              bValue = getRoleLabel(b.role).toLowerCase();
            }
            break;
          case "department":
            aValue = getDepartmentLabel(a.role).toLowerCase();
            bValue = getDepartmentLabel(b.role).toLowerCase();
            break;
          case "phone":
            // Handle phone number sorting more intelligently
            const aPhone = (a.phone || "").replace(/\D/g, ""); // Remove non-digits
            const bPhone = (b.phone || "").replace(/\D/g, "");
            // Convert to numbers if they're valid numbers, otherwise use string comparison
            if (aPhone && bPhone && !isNaN(Number(aPhone)) && !isNaN(Number(bPhone))) {
              aValue = Number(aPhone);
              bValue = Number(bPhone);
            } else {
              aValue = a.phone || "";
              bValue = b.phone || "";
            }
            break;
          case "status":
            aValue = (a.user?.status || "").toLowerCase();
            bValue = (b.user?.status || "").toLowerCase();
            break;
          case "created":
            // Handle created date with fallback for invalid dates
            const aCreated = a.user?.created_at ? new Date(a.user.created_at) : new Date(0);
            const bCreated = b.user?.created_at ? new Date(b.user.created_at) : new Date(0);
            aValue = aCreated.getTime();
            bValue = bCreated.getTime();
            break;
          case "updated":
          case "updated_at":
            // Handle updated date with fallback for invalid dates
            const aUpdated = a.user?.updated_at ? new Date(a.user.updated_at) : new Date(0);
            const bUpdated = b.user?.updated_at ? new Date(b.user.updated_at) : new Date(0);
            aValue = aUpdated.getTime();
            bValue = bUpdated.getTime();
            break;
          default:
            aValue = "";
            bValue = "";
        }

        // Handle comparison based on data type
        if (typeof aValue === "number" && typeof bValue === "number") {
          if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
          if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
          return 0;
        } else if (typeof aValue === "string" && typeof bValue === "string") {
          const comparison = aValue.localeCompare(bValue);
          return sortDirection === "asc" ? comparison : -comparison;
        } else {
          // Handle mixed types or role sorting with fallback strings
          const aStr = String(aValue);
          const bStr = String(bValue);
          const comparison = aStr.localeCompare(bStr);
          return sortDirection === "asc" ? comparison : -comparison;
        }
      });
    }

    return filtered;
  }, [staff, searchTerm, filterRole, filterDepartment, filterStatus, sortColumn, sortDirection]);

  // Filter functions
  const clearFilters = () => {
    setFilterRole("all");
    setFilterDepartment("all");
    setFilterStatus("all");
    setFilterDialogOpen(false);
  };

  const applyFilters = () => {
    setFilterDialogOpen(false);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilterRole("all");
    setFilterDepartment("all");
    setFilterStatus("all");
    setSortColumn("");
    setSortDirection("asc");
  };

  useEffect(() => {
    // Only fetch staff when auth is loaded and permissions are available
    if (!authLoading && permissions?.canViewStaffManagement) {
      fetchStaff();
    }
  }, [authLoading, permissions?.canViewStaffManagement]);

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">
            You don't have permission to access the Staff Management page.
          </p>
          <p className="text-sm text-muted-foreground">
            Contact your administrator if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
              <p className="text-muted-foreground">
                Manage staff user accounts and permissions
              </p>
              {currentUser && (
                <div className="flex items-center space-x-4">
                  <p className="text-xs text-blue-600 mt-1">
                    Current Role: {currentUser.role} | Permissions: 
                    {permissions?.canCreateStaff ? " Create" : ""} 
                    {permissions?.canViewStaffManagement ? " View" : ""}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">

            {/* Add Staff Button - Show for all users with access but lock if no permission */}
            {permissions?.canViewStaffManagement && (
              <Button 
                onClick={permissions?.canCreateStaff ? handleAddStaff : undefined}
                className={`flex items-center space-x-2 ${
                  permissions?.canCreateStaff 
                    ? "bg-blue-600 hover:bg-blue-700" 
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!permissions?.canCreateStaff}
                title={permissions?.canCreateStaff ? "Add new staff member" : "You don't have permission to add staff"}
              >
                {permissions?.canCreateStaff ? (
                  <Plus className="h-4 w-4" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                <span>Add Staff</span>
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </Button>

          </div>
        </div>

        {/* Stats Card */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staff.length}</div>
              <p className="text-xs text-muted-foreground">
                Active staff members
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {staff.filter(s => s.user?.status === "active").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently active accounts
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {DEPARTMENTS.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Active departments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Staff Table Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Staff Members</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {filteredAndSortedStaff.length} of {staff.length} staff member
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name, username, phone, role, or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filter Button */}
                <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
                  <Button
                    variant={hasActiveFilters ? "default" : "outline"}
                    onClick={() => setFilterDialogOpen(true)}
                    className="flex items-center space-x-2"
                  >
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                    {hasActiveFilters && (
                      <span className="ml-1 bg-white text-blue-600 rounded-full px-2 py-0.5 text-xs font-medium">
                        {[filterRole !== "all", filterDepartment !== "all", filterStatus !== "all"].filter(Boolean).length}
                      </span>
                    )}
                  </Button>

                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Filter</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      {/* Role Filter */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Role</label>
                        <Select value={filterRole} onValueChange={setFilterRole}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Roles" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            {STAFF_ROLES.map((role) => (
                              <SelectItem key={role.value} value={role.value}>
                                {role.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Department Filter */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Department</label>
                        <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Departments" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Departments</SelectItem>
                            {departments.map((dept) => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Status Filter */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Statuses" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            {statuses.filter((status): status is string => Boolean(status)).map((status) => (
                              <SelectItem key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <DialogFooter className="flex justify-between">
                      <Button variant="outline" onClick={clearFilters}>
                        Clear
                      </Button>
                      <Button onClick={applyFilters}>
                        Apply
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Clear All Filters and Sorting (if any active) */}
                {(hasActiveFilters || searchTerm || sortColumn) && (
                  <Button
                    variant="ghost"
                    onClick={clearAllFilters}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear All
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <StaffTable
              staff={filteredAndSortedStaff}
              onEdit={handleEditStaff}
              onRefresh={fetchStaff}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={(column: string, direction: "asc" | "desc") => {
                setSortColumn(column);
                setSortDirection(direction);
              }}
              canEditStaff={canEditSpecificStaff}
              canDeleteStaff={canDeleteSpecificStaff}
              canViewPermissions={(staff) => {
                const canManage = currentUser?.role === 'superadmin' || 
                                 (currentUser?.role === 'admin' && (getCustomPermissions(currentUser.id)?.canManagePermissions ?? false));
                return canManage;
              }}
              onPermissionClick={handlePermissionClick}
            />
          </CardContent>
        </Card>
      </div>

      {/* Staff Form Dialog */}
      <StaffFormDialog
        open={formDialogOpen}
        onOpenChange={handleFormClose}
        staff={editingStaff}
        onSuccess={handleFormSuccess}
        allowedRoles={creatableRoles}
        allowedEditRoles={editableRoles}
      />

      {/* Individual User Permission Dialog */}
      {selectedUser && (
        <Dialog open={userPermissionDialogOpen} onOpenChange={setUserPermissionDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5 text-yellow-600" />
                <span>Manage Permissions for {selectedUser.full_name}</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-sm mb-3">Current Role: {getRoleLabel(selectedUser.role)}</h3>
                <div className="space-y-2">
                  <div 
                    className="flex items-center justify-between p-2 bg-white rounded border cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={toggleAccessPermission}
                  >
                    <span className="text-sm">Access Staff Management</span>
                    <div className="flex items-center space-x-2">
                      {userPermissions.canAccessStaffManagement ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-xs text-green-600 font-medium">Granted</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-red-600" />
                          <span className="text-xs text-red-600 font-medium">Denied</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Other permissions - only interactive if access is granted */}
                  <div 
                    className={`flex items-center justify-between p-2 bg-white rounded border ${
                      userPermissions.canAccessStaffManagement 
                        ? 'cursor-pointer hover:bg-gray-50 transition-colors' 
                        : 'opacity-60 cursor-not-allowed'
                    }`}
                    onClick={userPermissions.canAccessStaffManagement ? () => toggleCreatePermission() : undefined}
                  >
                    <span className="text-sm">Add New Staff</span>
                    <div className="flex items-center space-x-2">
                      {userPermissions.canAccessStaffManagement ? (
                        userPermissions.canCreate ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-xs text-green-600 font-medium">Granted</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-red-600" />
                            <span className="text-xs text-red-600 font-medium">Denied</span>
                          </>
                        )
                      ) : (
                        <Lock className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  <div 
                    className={`flex items-center justify-between p-2 bg-white rounded border ${
                      userPermissions.canAccessStaffManagement 
                        ? 'cursor-pointer hover:bg-gray-50 transition-colors' 
                        : 'opacity-60 cursor-not-allowed'
                    }`}
                    onClick={userPermissions.canAccessStaffManagement ? () => toggleEditPermission() : undefined}
                  >
                    <span className="text-sm">Edit Staff</span>
                    <div className="flex items-center space-x-2">
                      {userPermissions.canAccessStaffManagement ? (
                        userPermissions.canEdit ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-xs text-green-600 font-medium">Granted</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-red-600" />
                            <span className="text-xs text-red-600 font-medium">Denied</span>
                          </>
                        )
                      ) : (
                        <Lock className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  <div 
                    className={`flex items-center justify-between p-2 bg-white rounded border ${
                      userPermissions.canAccessStaffManagement 
                        ? 'cursor-pointer hover:bg-gray-50 transition-colors' 
                        : 'opacity-60 cursor-not-allowed'
                    }`}
                    onClick={userPermissions.canAccessStaffManagement ? () => toggleDeletePermission() : undefined}
                  >
                    <span className="text-sm">Delete Staff</span>
                    <div className="flex items-center space-x-2">
                      {userPermissions.canAccessStaffManagement ? (
                        userPermissions.canDelete ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-xs text-green-600 font-medium">Granted</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-red-600" />
                            <span className="text-xs text-red-600 font-medium">Denied</span>
                          </>
                        )
                      ) : (
                        <Lock className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  {/* Permission Management - Only show for Admin users and only Super Admin can grant */}
                  {selectedUser && selectedUser.role === 'admin' && (
                    <div 
                      className={`flex items-center justify-between p-2 bg-white rounded border ${
                        (currentUser?.role === 'superadmin' && userPermissions.canAccessStaffManagement)
                          ? 'cursor-pointer hover:bg-gray-50 transition-colors' 
                          : 'opacity-60 cursor-not-allowed'
                      }`}
                      onClick={(currentUser?.role === 'superadmin' && userPermissions.canAccessStaffManagement) ? () => toggleManagePermission() : undefined}
                    >
                      <span className="text-sm">Permission Management</span>
                      <div className="flex items-center space-x-2">
                        {currentUser?.role === 'superadmin' ? (
                          !userPermissions.canAccessStaffManagement ? (
                            <>
                              <Lock className="h-4 w-4 text-gray-400" />
                              <span className="text-xs text-gray-500 font-medium">Requires Staff Access</span>
                            </>
                          ) : userPermissions.canManagePermissions ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-xs text-green-600 font-medium">Granted</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-red-600" />
                              <span className="text-xs text-red-600 font-medium">Denied</span>
                            </>
                          )
                        ) : (
                          <>
                            <Lock className="h-4 w-4 text-gray-400" />
                            <span className="text-xs text-gray-500 font-medium">Super Admin Only</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Show placeholder for non-Admin users */}
                  {selectedUser && selectedUser.role !== 'admin' && (
                    <div className="flex items-center justify-between p-2 bg-white rounded border opacity-60 cursor-not-allowed">
                      <span className="text-sm">Permission Management</span>
                      <div className="flex items-center space-x-2">
                        <Lock className="h-4 w-4 text-gray-400" />
                        <span className="text-xs text-gray-500 font-medium">Admin Only</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUserPermissionDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}