import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  BarChart,
  Home,
  Table,
  CalendarDays,
  Package,
  Receipt,
  User,
  Users,
  Settings,
  Store,
  CookingPot,
} from "lucide-react";
import { cn } from "@/lib/utils";

const AppSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const restaurantMenuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: Home,
      roles: ["admin", "manager", "cashier", "waiter", "supervisor"],
    },
    {
      title: "Mesas",
      path: "/tables",
      icon: Table,
      roles: ["admin", "manager", "waiter", "supervisor"],
    },
    {
      title: "Pedidos",
      path: "/orders",
      icon: Receipt,
      roles: ["admin", "manager", "waiter", "cashier", "supervisor"],
    },
    {
      title: "Cozinha",
      path: "/kitchen",
      icon: CookingPot,
      roles: ["admin", "manager", "supervisor", "chef"],
    },
    {
      title: "Reservas",
      path: "/reservations",
      icon: CalendarDays,
      roles: ["admin", "manager", "supervisor", "waiter"],
    },
    {
      title: "Financeiro",
      path: "/finances/restaurant",
      icon: BarChart,
      roles: ["admin", "manager", "cashier"],
    },
  ];

  const rentalMenuItems = [
    {
      title: "Estoque",
      path: "/inventory",
      icon: Package,
      roles: ["admin", "manager", "supervisor"],
    },
    {
      title: "Locações",
      path: "/rentals",
      icon: Store,
      roles: ["admin", "manager", "supervisor"],
    },
    {
      title: "Financeiro",
      path: "/finances/rental",
      icon: BarChart,
      roles: ["admin", "manager", "cashier"],
    },
  ];

  const adminMenuItems = [
    {
      title: "Funcionários",
      path: "/employees",
      icon: Users,
      roles: ["admin", "manager"],
    },
    {
      title: "Clientes",
      path: "/customers",
      icon: User,
      roles: ["admin", "manager", "supervisor"],
    },
    {
      title: "Configurações",
      path: "/settings",
      icon: Settings,
      roles: ["admin"],
    },
  ];

  const renderMenu = (items: typeof restaurantMenuItems) => {
    return items
      .filter((item) => 
        user?.role && item.roles.includes(user.role)
      )
      .map((item) => (
        <SidebarMenuItem key={item.path}>
          <SidebarMenuButton
            asChild
            className={cn(
              isActive(item.path) && "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
          >
            <Link to={item.path} className="flex items-center gap-3">
              <item.icon size={18} />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ));
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center">
          <h1 className="text-lg font-bold text-sidebar-foreground">FastBotecos</h1>
          <div className="flex-1" />
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Restaurante & Bar</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderMenu(restaurantMenuItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Locação de Itens</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderMenu(rentalMenuItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Administração</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderMenu(adminMenuItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="flex flex-col gap-2">
          <div className="text-sm text-sidebar-foreground/80">
            Logado como <span className="font-semibold">{user?.name}</span>
          </div>
          <button
            onClick={logout}
            className="text-sm text-sidebar-foreground/80 hover:text-sidebar-foreground"
          >
            Sair
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
