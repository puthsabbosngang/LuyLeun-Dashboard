"use client";

import { useState, useMemo } from "react";
import { MoreHorizontal, Edit, Trash2, Key, Lock, ChevronUp, ChevronDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Staff, staffAPI, STAFF_ROLES, getDepartmentLabel } from "@/lib/api/staffAPI";
import { toast } from "sonner";

interface StaffTableProps {
  staff: Staff[];
  onEdit: (staff: Staff) => void;
  onRefresh: () => void;
  sortColumn: string;
  sortDirection: "asc" | "desc";
  onSort: (column: string, direction: "asc" | "desc") => void;
  canEditStaff: (staff: Staff) => boolean;
  canDeleteStaff: (staff: Staff) => boolean;
  canViewPermissions?: (staff: Staff) => boolean; // New permission for viewing/managing permissions
  onPermissionClick?: (staff: Staff) => void; // Callback for permission management
}

export function StaffTable({ 
  staff, 
  onEdit, 
  onRefresh, 
  sortColumn, 
  sortDirection, 
  onSort, 
  canEditStaff, 
  canDeleteStaff,
  canViewPermissions = () => false, // Default to false if not provided
  onPermissionClick
}: StaffTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Helper functions - defined before useMemo
  const getRoleLabel = (roleValue: string) => {
    if (!roleValue) return "Unknown Role";
    const role = STAFF_ROLES.find((r) => r.value === roleValue);
    return role ? role.label : roleValue.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return "N/A";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return "bg-green-100 text-green-800 border-green-200";
      case 'inactive':
        return "bg-red-100 text-red-800 border-red-200";
      case 'pending':
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDepartmentColor = (role: string) => {
    const department = getDepartmentLabel(role);
    switch (department) {
      case 'Customer Support':
        return "bg-emerald-100 text-emerald-800 border-emerald-200 shadow-sm";
      case 'Credit':
        return "bg-indigo-100 text-indigo-800 border-indigo-200 shadow-sm";
      case 'Collection':
        return "bg-amber-100 text-amber-800 border-amber-200 shadow-sm";
      case 'Finance':
        return "bg-rose-100 text-rose-800 border-rose-200 shadow-sm";
      case 'General':
        return "bg-slate-100 text-slate-800 border-slate-200 shadow-sm";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 shadow-sm";
    }
  };

  // No sorting logic needed here - it's handled by parent component
  // Staff data comes pre-sorted from parent

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle between asc and desc only (remove third state for simplicity)
      const newDirection = sortDirection === "asc" ? "desc" : "asc";
      onSort(column, newDirection);
    } else {
      onSort(column, "asc");
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ChevronUp className="h-4 w-4 ml-1 opacity-30" />;
    }
    return sortDirection === "asc" ? 
      <ChevronUp className="h-4 w-4 ml-1 text-blue-600" /> : 
      <ChevronDown className="h-4 w-4 ml-1 text-blue-600" />;
  };

  const getSortIndicator = (column: string) => {
    if (sortColumn !== column) return "";
    return sortDirection === "asc" ? " ↑" : " ↓";
  };

  const handlePermissionClick = (staff: Staff) => {
    if (onPermissionClick) {
      onPermissionClick(staff);
    } else {
      // Fallback message
      toast.info(`Permission management for ${staff.full_name} - Feature coming soon!`);
    }
  };

  const handleDeleteClick = (staff: Staff) => {
    setStaffToDelete(staff);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!staffToDelete) return;

    setIsDeleting(true);
    try {
      await staffAPI.deleteStaff(staffToDelete.id);
      toast.success("Staff member deleted successfully");
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete staff member");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setStaffToDelete(null);
    }
  };

  if (!staff.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <div className="text-lg font-medium">No staff member found</div>
        <p className="text-sm">Add your first staff member to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table Container */}
      <div className="rounded-lg border bg-white shadow-sm">
        <style dangerouslySetInnerHTML={{
          __html: `
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `
        }} />
        <div className="h-[420px] overflow-auto hide-scrollbar">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-20 border-b-2 shadow-sm">
              <TableRow>
                <TableHead 
                  className={`bg-white sticky top-0 z-20 font-semibold cursor-pointer hover:bg-gray-50 transition-colors select-none ${
                    sortColumn === "name" ? "bg-blue-50 text-blue-700" : ""
                  }`}
                  onClick={() => handleSort("name")}
                  title="Click to sort by name (ascending/descending)"
                >
                  <div className="flex items-center justify-between">
                    <span>Name{getSortIndicator("name")}</span>
                    {getSortIcon("name")}
                  </div>
                </TableHead>
                <TableHead 
                  className={`bg-white sticky top-0 z-20 font-semibold cursor-pointer hover:bg-gray-50 transition-colors select-none ${
                    sortColumn === "username" ? "bg-blue-50 text-blue-700" : ""
                  }`}
                  onClick={() => handleSort("username")}
                  title="Click to sort by username (ascending/descending)"
                >
                  <div className="flex items-center justify-between">
                    <span>Username{getSortIndicator("username")}</span>
                    {getSortIcon("username")}
                  </div>
                </TableHead>
                <TableHead 
                  className={`bg-white sticky top-0 z-20 font-semibold cursor-pointer hover:bg-gray-50 transition-colors select-none ${
                    sortColumn === "role" ? "bg-blue-50 text-blue-700" : ""
                  }`}
                  onClick={() => handleSort("role")}
                  title="Click to sort by role (ascending/descending)"
                >
                  <div className="flex items-center justify-between">
                    <span>Role{getSortIndicator("role")}</span>
                    {getSortIcon("role")}
                  </div>
                </TableHead>
                <TableHead 
                  className={`bg-white sticky top-0 z-20 font-semibold cursor-pointer hover:bg-gray-50 transition-colors select-none ${
                    sortColumn === "department" ? "bg-blue-50 text-blue-700" : ""
                  }`}
                  onClick={() => handleSort("department")}
                  title="Click to sort by department (ascending/descending)"
                >
                  <div className="flex items-center justify-between">
                    <span>Department{getSortIndicator("department")}</span>
                    {getSortIcon("department")}
                  </div>
                </TableHead>
                <TableHead 
                  className={`bg-white sticky top-0 z-20 font-semibold cursor-pointer hover:bg-gray-50 transition-colors select-none ${
                    sortColumn === "phone" ? "bg-blue-50 text-blue-700" : ""
                  }`}
                  onClick={() => handleSort("phone")}
                  title="Click to sort by phone number (ascending/descending)"
                >
                  <div className="flex items-center justify-between">
                    <span>Phone{getSortIndicator("phone")}</span>
                    {getSortIcon("phone")}
                  </div>
                </TableHead>
                <TableHead 
                  className={`bg-white sticky top-0 z-20 font-semibold cursor-pointer hover:bg-gray-50 transition-colors select-none ${
                    sortColumn === "status" ? "bg-blue-50 text-blue-700" : ""
                  }`}
                  onClick={() => handleSort("status")}
                  title="Click to sort by status (ascending/descending)"
                >
                  <div className="flex items-center justify-between">
                    <span>Status{getSortIndicator("status")}</span>
                    {getSortIcon("status")}
                  </div>
                </TableHead>
                <TableHead 
                  className={`bg-white sticky top-0 z-20 font-semibold cursor-pointer hover:bg-gray-50 transition-colors select-none ${
                    sortColumn === "created" ? "bg-blue-50 text-blue-700" : ""
                  }`}
                  onClick={() => handleSort("created")}
                  title="Click to sort by creation date (ascending/descending)"
                >
                  <div className="flex items-center justify-between">
                    <span>Created{getSortIndicator("created")}</span>
                    {getSortIcon("created")}
                  </div>
                </TableHead>
                <TableHead 
                  className={`bg-white sticky top-0 z-20 font-semibold cursor-pointer hover:bg-gray-50 transition-colors select-none ${
                    sortColumn === "updated" ? "bg-blue-50 text-blue-700" : ""
                  }`}
                  onClick={() => handleSort("updated")}
                  title="Click to sort by last update date (ascending/descending)"
                >
                  <div className="flex items-center justify-between">
                    <span>Updated{getSortIndicator("updated")}</span>
                    {getSortIcon("updated")}
                  </div>
                </TableHead>
                <TableHead className="w-[120px] bg-white sticky top-0 z-20 font-semibold text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((member: Staff, index: number) => (
                <TableRow 
                  key={member.id} 
                  className={`hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                  }`}
                >
                  <TableCell className="font-medium py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {member.full_name.charAt(0).toUpperCase()}
                      </div>
                      <span>{member.full_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="font-mono text-sm">{member.user?.username || "N/A"}</span>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="text-sm">{getRoleLabel(member.role)}</span>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getDepartmentColor(member.role)}`}>
                      {getDepartmentLabel(member.role)}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="font-mono text-sm">{member.phone || "N/A"}</span>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(member.user?.status || "unknown")}`}>
                      {member.user?.status ? 
                        member.user.status.charAt(0).toUpperCase() + member.user.status.slice(1).toLowerCase() 
                        : "Unknown"
                      }
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="text-sm text-muted-foreground">
                      {member.user?.created_at ? formatDate(member.user.created_at) : "N/A"}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="text-sm text-muted-foreground">
                      {member.user?.updated_at ? formatDate(member.user.updated_at) : "N/A"}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors"
                            title="Actions menu"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => canEditStaff(member) ? onEdit(member) : undefined}
                            className={`flex items-center space-x-2 ${
                              canEditStaff(member) 
                                ? "hover:bg-blue-50 cursor-pointer" 
                                : "text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            {canEditStaff(member) ? (
                              <Edit className="h-4 w-4 text-blue-600" />
                            ) : (
                              <Lock className="h-4 w-4 text-gray-400" />
                            )}
                            <span>Edit</span>
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem
                            onClick={() => canDeleteStaff(member) ? handleDeleteClick(member) : undefined}
                            className={`flex items-center space-x-2 ${
                              canDeleteStaff(member) 
                                ? "hover:bg-red-50 cursor-pointer" 
                                : "text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            {canDeleteStaff(member) ? (
                              <Trash2 className="h-4 w-4 text-red-600" />
                            ) : (
                              <Lock className="h-4 w-4 text-gray-400" />
                            )}
                            <span>Delete</span>
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem
                            onClick={() => canViewPermissions(member) ? handlePermissionClick(member) : undefined}
                            className={`flex items-center space-x-2 ${
                              canViewPermissions(member) 
                                ? "hover:bg-green-50 cursor-pointer" 
                                : "text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            {canViewPermissions(member) ? (
                              <Key className="h-4 w-4 text-green-600" />
                            ) : (
                              <Lock className="h-4 w-4 text-gray-400" />
                            )}
                            <span>Permission</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Staff Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {staffToDelete?.full_name}? This action
              cannot be undone and will also delete their user account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}