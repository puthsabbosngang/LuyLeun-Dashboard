// 🌐 Base API URL (configurable via .env)
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Global callback for auth state changes
let authStateChangeCallback: (() => void) | null = null;

export function setAuthStateChangeCallback(callback: () => void) {
  authStateChangeCallback = callback;
}

// 🧰 Safe JSON parser
async function safeParseJSON(response: Response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

// ⚙️ Centralized fetch wrapper with auto token & error handling
async function fetchJSON<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await safeParseJSON(response);

  if (!response.ok) {
    const message = data?.message || "API request failed";
    throw new Error(message);
  }

  return data;
}

// 🧱 Local Storage Helpers
function getToken(): string | null {
  return localStorage.getItem("authToken");
}

function saveAuthData(token: string, user: UserInfo) {
  localStorage.setItem("authToken", token);
  localStorage.setItem("userData", JSON.stringify(user));
  
  // DON'T clear custom permissions here - they should persist across sessions
  
  // Notify auth state change
  if (authStateChangeCallback) {
    authStateChangeCallback();
  }
}

function clearAuthData() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userData");
  // DON'T clear custom permissions on logout - they should persist
  
  // Notify auth state change
  if (authStateChangeCallback) {
    authStateChangeCallback();
  }
}

function getUserData(): UserInfo | null {
  const stored = localStorage.getItem("userData");
  return stored ? (JSON.parse(stored) as UserInfo) : null;
}

// 🧩 Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface StaffInfo {
  id: string;
  full_name: string;
  role: string;
  phone: string;
}

export interface UserInfo {
  id: string;
  username: string;
  type: "staff" | "customer";
  staff?: StaffInfo;
}

export interface LoginResponse {
  token: string;
  user: UserInfo;
}

export interface ApiError {
  message: string;
}

// 🔐 Auth API
export const authAPI = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const data = await fetchJSON<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      // Restrict access to staff users only
      if (data.user.type !== "staff") {
        throw new Error("Access denied. This dashboard is for staff accounts only.");
      }

      saveAuthData(data.token, data.user);
      return data;
    } catch (error: any) {
      if (
        error.message.includes("Access denied") ||
        error.message.includes("Staff accounts only")
      ) {
        throw new Error("Access denied. This dashboard is for staff accounts only.");
      }
      throw new Error(error.message || "Login failed. Please try again.");
    }
  },

  async getCurrentUser(): Promise<UserInfo> {
    const token = getToken();
    if (!token) throw new Error("No token found. Please log in again.");

    const data = await fetchJSON<{ user: UserInfo }>("/auth/me");

    if (data.user.type !== "staff") {
      clearAuthData();
      throw new Error("Access denied. This dashboard is for staff accounts only.");
    }

    // Keep user info updated
    localStorage.setItem("userData", JSON.stringify(data.user));
    return data.user;
  },

  logout() {
    clearAuthData();
  },

  getStoredUser() {
    return getUserData();
  },
};
