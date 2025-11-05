"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { staffAPI, STAFF_ROLES, USER_STATUS, CreateStaffRequest, UpdateStaffRequest, Staff, UNIQUE_DEPARTMENTS, getDepartmentFromRole } from "@/lib/api/staffAPI";
import { toast } from "sonner";

const createStaffFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  department: z.string().min(1, "Please select a department"),
  role: z.string().min(1, "Please select a role"),
  phone: z.string()
    .regex(/^0\d{8,9}$/, "Phone number must be 9-10 digits starting with 0 (e.g., 093505639 or 0935056391)")
    .min(9, "Phone number must be at least 9 digits")
    .max(10, "Phone number must be at most 10 digits"),
});

const editStaffFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().optional().refine((val) => !val || val.length >= 6, {
    message: "Password must be at least 6 characters"
  }),
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  department: z.string().min(1, "Please select a department"),
  role: z.string().min(1, "Please select a role"),
  phone: z.string()
    .regex(/^0\d{8,9}$/, "Phone number must be 9-10 digits starting with 0 (e.g., 093505639 or 0935056391)")
    .min(9, "Phone number must be at least 9 digits")
    .max(10, "Phone number must be at most 10 digits"),
  status: z.string().min(1, "Please select a status").optional(),
});

type CreateStaffFormData = z.infer<typeof createStaffFormSchema>;
type EditStaffFormData = z.infer<typeof editStaffFormSchema>;
type StaffFormData = CreateStaffFormData | EditStaffFormData;

interface StaffFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff?: Staff | null;
  onSuccess: () => void;
  allowedRoles?: string[]; // Optional prop to restrict available roles for creating
  allowedEditRoles?: string[]; // Optional prop to restrict available roles for editing
}

export function StaffFormDialog({ open, onOpenChange, staff, onSuccess, allowedRoles, allowedEditRoles }: StaffFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!staff;

  const form = useForm<StaffFormData>({
    resolver: zodResolver(isEditing ? editStaffFormSchema : createStaffFormSchema),
    mode: "onBlur", // Validate on blur for better UX
    defaultValues: {
      username: "",
      password: "",
      full_name: "",
      department: "",
      role: "",
      phone: "",
      ...(isEditing && { status: "" }),
    } as StaffFormData,
  });

  // Update form values when staff data changes
  useEffect(() => {
    if (staff && isEditing) {
      const currentDepartment = getDepartmentFromRole(staff.role || "");
      form.reset({
        username: staff.user?.username || "",
        password: "",
        full_name: staff.full_name || "",
        department: currentDepartment,
        role: staff.role || "",
        phone: staff.phone || "",
        status: staff.user?.status || "active",
      } as EditStaffFormData);
    } else {
      form.reset({
        username: "",
        password: "",
        full_name: "",
        department: "",
        role: "",
        phone: "",
      } as CreateStaffFormData);
    }
  }, [staff, isEditing, form]);

  // Watch for role changes to auto-update department
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "role" && value.role) {
        const roleDepartment = getDepartmentFromRole(value.role);
        if (value.department !== roleDepartment) {
          form.setValue("department", roleDepartment);
          // Trigger validation for department field
          form.trigger("department");
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (data: StaffFormData) => {
    setIsLoading(true);
    try {
      if (isEditing && staff) {
        const editData = data as EditStaffFormData;
        const updateData: UpdateStaffRequest = {
          username: editData.username,
          full_name: editData.full_name,
          role: editData.role,
          phone: editData.phone,
          status: editData.status,
        };
        
        // Only include password if it's provided
        if (editData.password && editData.password.trim() !== "") {
          updateData.password = editData.password;
        }
        
        await staffAPI.updateStaff(staff.id, updateData);
        toast.success("Staff member updated successfully");
      } else {
        const createData = data as CreateStaffFormData;
        const newStaffData: CreateStaffRequest = {
          username: createData.username,
          password: createData.password,
          full_name: createData.full_name,
          role: createData.role,
          phone: createData.phone,
        };
        
        await staffAPI.createStaff(newStaffData);
        toast.success("Staff member created successfully");
      }
      
      handleDialogClose(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      form.reset({
        username: "",
        password: "",
        full_name: "",
        department: "",
        role: "",
        phone: "",
      } as CreateStaffFormData);
    }
    onOpenChange(open);
  };

  // Get roles filtered by department and permissions
  const getRolesByDepartment = (department: string) => {
    let roles = department ? STAFF_ROLES.filter(role => {
      const roleDepartment = getDepartmentFromRole(role.value);
      return roleDepartment === department;
    }) : STAFF_ROLES;
    
    // Apply different role restrictions based on create vs edit mode
    if (isEditing && allowedEditRoles) {
      // For editing: filter by allowed edit roles
      roles = roles.filter(role => allowedEditRoles.includes(role.value));
    } else if (!isEditing && allowedRoles) {
      // For creating: filter by allowed create roles
      roles = roles.filter(role => allowedRoles.includes(role.value));
    }
    
    return roles;
  };

  // Handle department change
  const handleDepartmentChange = (department: string) => {
    // Get roles for this department
    const departmentRoles = getRolesByDepartment(department);
    const currentRole = form.getValues("role");
    
    // If current role is not in the new department, clear it
    if (currentRole && !departmentRoles.some(role => role.value === currentRole)) {
      form.setValue("role", "");
    }
  };

  // Handle role change
  const handleRoleChange = (role: string) => {
    // Auto-set department based on role
    const roleDepartment = getDepartmentFromRole(role);
    const currentDepartment = form.getValues("department");
    
    // Only update department if it's different
    if (currentDepartment !== roleDepartment) {
      form.setValue("department", roleDepartment);
    }
  };

  // Get current department from form
  const currentDepartment = form.watch("department");
  const availableRoles = getRolesByDepartment(currentDepartment);

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Staff Member" : "Add New Staff Member"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update the staff member's information."
              : "Create a new staff member account."
            }
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {!isEditing && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {isEditing && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter new password (leave empty to keep current)" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground mt-1">
                      Leave empty to keep the current password
                    </p>
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Department and Role in the same row */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value); // Update form state first
                        handleDepartmentChange(value); // Then handle custom logic
                      }}
                      value={field.value || ""}
                      onOpenChange={() => {
                        // Clear validation error when user opens the dropdown
                        if (form.formState.errors.department) {
                          form.clearErrors("department");
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {UNIQUE_DEPARTMENTS.map((dept) => (
                          <SelectItem key={dept.value} value={dept.value}>
                            {dept.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value); // Update form state first
                        handleRoleChange(value); // Then handle custom logic
                      }}
                      value={field.value || ""}
                      onOpenChange={() => {
                        // Clear validation error when user opens the dropdown
                        if (form.formState.errors.role) {
                          form.clearErrors("role");
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableRoles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input  
                      maxLength={10}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      {...field}
                      onChange={(e) => {
                        // Only allow digits
                        const value = e.target.value.replace(/\D/g, '');
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {isEditing && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value || ""}
                      onOpenChange={() => {
                        // Clear validation error when user opens the dropdown
                        if (isEditing && (form.formState.errors as any).status) {
                          form.clearErrors("status" as any);
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {USER_STATUS.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogClose(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading 
                  ? (isEditing ? "Updating..." : "Creating...") 
                  : (isEditing ? "Update Staff" : "Create Staff")
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}