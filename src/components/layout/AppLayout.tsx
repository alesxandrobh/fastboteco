import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";

interface AppLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
  allowedRoles?: Array<"admin" | "manager" | "cashier" | "waiter" | "supervisor">;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  requireAuth = true,
  allowedRoles = ["admin", "manager", "cashier", "waiter", "supervisor"]
}) => {
  const { isAuthenticated, isLoading, user, hasPermission } = useAuth();

  // Check if still loading authentication status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse font-medium">Carregando...</div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated, redirect to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated but doesn't have the required role
  if (requireAuth && isAuthenticated && !hasPermission(allowedRoles)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold text-destructive">Acesso Negado</h1>
        <p>Você não tem permissão para acessar esta página.</p>
        <a href="/" className="text-primary hover:underline">
          Voltar para o início
        </a>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-auto p-4">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
