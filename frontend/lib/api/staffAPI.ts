const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ✅ Centralized fetch wrapper with better error handling
async function fetchJSON<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("authToken");
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data: any;
  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid JSON response from server");
  }

  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
}

// ✅ Types for Staff Management
export interface Staff {
  id: number;
  full_name: string;
  role: string;
  phone: string;
  user_id: number;
  user?: {
    id: number;
    username: string;
    type: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
  // Computed property - not stored in database
  department?: string;
}

export interface CreateStaffRequest {
  username: string;
  password: string;
  full_name: string;
  role: string;
  phone: string;
}

export interface UpdateStaffRequest {
  username?: string;
  password?: string;
  full_name?: string;
  role?: string;
  phone?: string;
  status?: string;
}

export interface ApiResponse<T> {
  message?: string;
  data?: T;
}

// ✅ Staff API
export const staffAPI = {
  // Get all staff users
  async getAllStaff(): Promise<Staff[]> {
    const staffList = await fetchJSON<Staff[]>("/staff");
    // Add computed department property
    return staffList.map(staff => ({
      ...staff,
      department: getDepartmentFromRole(staff.role)
    }));
  },

  // Get single staff by ID
  async getStaffById(id: number): Promise<Staff> {
    const staff = await fetchJSON<Staff>(`/staff/${id}`);
    // Add computed department property
    return {
      ...staff,
      department: getDepartmentFromRole(staff.role)
    };
  },

  // Create new staff user
  async createStaff(staffData: CreateStaffRequest): Promise<ApiResponse<Staff>> {
    return await fetchJSON<ApiResponse<Staff>>("/staff", {
      method: "POST",
      body: JSON.stringify({
        full_name: staffData.full_name,
        role: staffData.role,
        phone: staffData.phone,
        user_data: {
          username: staffData.username,
          password: staffData.password,
          status: "active",
          type: "staff",
        }
      }),
    });
  },

  // Update staff user
  async updateStaff(id: number, staffData: UpdateStaffRequest): Promise<ApiResponse<Staff>> {
    const updatePayload: any = {
      full_name: staffData.full_name,
      role: staffData.role,
      phone: staffData.phone,
    };

    // Add user data if any user fields are being updated
    if (staffData.username || staffData.password || staffData.status) {
      updatePayload.user_data = {};
      if (staffData.username !== undefined) updatePayload.user_data.username = staffData.username;
      if (staffData.password !== undefined && staffData.password.trim() !== "") {
        updatePayload.user_data.password = staffData.password;
      }
      if (staffData.status !== undefined) updatePayload.user_data.status = staffData.status;
    }

    return await fetchJSON<ApiResponse<Staff>>(`/staff/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatePayload),
    });
  },

  // Delete staff user (removes from both user and staff tables)
  async deleteStaff(id: number): Promise<ApiResponse<null>> {
    return await fetchJSON<ApiResponse<null>>(`/staff/${id}`, {
      method: "DELETE",
    });
  },
};

// ✅ Role options for staff
export const STAFF_ROLES = [
  { value: "superadmin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "business-supervisor", label: "Business Supervisor" },
  { value: "hr-supervisor", label: "HR Supervisor" },
  { value: "cs-supervisor", label: "CS Supervisor" },
  { value: "cs-officer", label: "CS Officer" },
  { value: "cd-supervisor", label: "CD Supervisor" },
  { value: "cd-officer", label: "CD Officer" },
  { value: "cd-committee", label: "CD Committee" },
  { value: "co-supervisor", label: "CO Supervisor" },
  { value: "co-officer", label: "CO Officer" },
  { value: "ac-supervisor", label: "AC Supervisor" },
  { value: "ac-officer", label: "AC Officer" },
  { value: "cto", label: "CTO" },
  { value: "fullstack-dev", label: "Fullstack Developer" },
  { value: "ux/ui", label: "UX/UI Designer" },
  { value: "junior-ds", label: "Junior Data Scientist" },
  { value: "mkt-supervisor", label: "Marketing Supervisor" },
  { value: "graphic-designer", label: "Graphic Designer" },
  { value: "op-manager", label: "Operations Manager" },
] as const;

// ✅ Status options for users
export const USER_STATUS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
  { value: "suspended", label: "Suspended" },
] as const;

// ✅ Department mapping from role
export const DEPARTMENTS = [
  { value: "cs", label: "Customer Support" },
  { value: "cd", label: "Credit" },
  { value: "co", label: "Collection" },
  { value: "it", label: "IT" },
  { value: "ac", label: "Finance" },
  { value: "mkt", label: "Digital Marketing" },
  { value: "hr", label: "Human Resources" },
  { value: "general", label: "General" },
] as const;

// ✅ Department mapping for unique departments (used in forms)
export const UNIQUE_DEPARTMENTS = [
  { value: "Customer Support", label: "Customer Support" },
  { value: "Credit", label: "Credit" },
  { value: "Collection", label: "Collection" },
  { value: "IT", label: "IT" },
  { value: "Finance", label: "Finance" },
  { value: "Digital Marketing", label: "Digital Marketing" },
  { value: "Human Resources", label: "Human Resources" },
  { value: "General", label: "General" },
] as const;

// ✅ Function to get department from role
export const getDepartmentFromRole = (role: string): string => {
  if (role.startsWith("cs-")) return "Customer Support";
  if (role.startsWith("cd-")) return "Credit";
  if (role.startsWith("co-")) return "Collection";
  if (role.startsWith("ac-")) return "Finance";
  if (role === "ux/ui") return "IT";
  if (role === "fullstack-dev") return "IT";
  if (role === "junior-ds") return "IT";
  if (role === "cto") return "IT";
  if (role === "mkt-supervisor") return "Digital Marketing";
  if (role === "graphic-designer") return "Digital Marketing";
  if (role === "hr-supervisor") return "Human Resources";
  if (role === "op-manager") return "General";
  if (role === "business-supervisor") return "General";
  if (role === "admin") return "General";
  if (role === "superadmin") return "General";
  return "General"; // default fallback
};

// ✅ Function to get department label
export const getDepartmentLabel = (role: string): string => {
  return getDepartmentFromRole(role);
};

export type StaffRole = typeof STAFF_ROLES[number]["value"];
export type Department = typeof DEPARTMENTS[number]["value"];
export type UserStatus = typeof USER_STATUS[number]["value"];