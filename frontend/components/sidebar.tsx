"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Home, 
  Users, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { authAPI } from "@/lib/api/authAPI";
import { STAFF_ROLES } from "@/lib/api/staffAPI";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  // Helper function to get role label
  const getRoleLabel = (roleValue: string) => {
    if (!roleValue) return "Unknown Role";
    const role = STAFF_ROLES.find((r) => r.value === roleValue);
    return role ? role.label : roleValue.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      
      // Check if user is staff type
      if (parsedUser.type !== "staff") {
        // Clear invalid session and redirect to login
        authAPI.logout();
        router.push("/login");
        return;
      }
      
      setUser(parsedUser);
    }
  }, [router]);

  const handleLogout = () => {
    authAPI.logout();
    router.push("/login");
  };

  const navigationItems = [
    {
      href: "/dashboard",
      icon: Home,
      label: "Overview",
      description: "Dashboard overview and analytics"
    },
    {
      href: "/dashboard/staffmanagement",
      icon: Users,
      label: "Staff Management", 
      description: "Manage staff users and permissions"
    }
  ];

  return (
    <div className={cn(
      "flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DL</span>
            </div>
            <span className="font-semibold text-lg">DLT Dashboard</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="p-2"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                isActive
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "text-blue-600")} />
              {!isCollapsed && (
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {item.description}
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200">
        {/* User Info with Logout */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            {!isCollapsed && user && (
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {user?.staff?.full_name || user?.username}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {user?.staff?.role ? getRoleLabel(user.staff.role) : user?.type}
                  </div>
                </div>
              </div>
            )}
            
            {/* Logout Button - Icon Only */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600 hover:bg-red-50 p-2"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Version Info */}
        {!isCollapsed && (
          <div className="px-4 pb-4">
            <div className="text-xs text-gray-500">
              Version 2.0.0
            </div>
          </div>
        )}
      </div>
    </div>
  );
}