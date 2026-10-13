import {
  LayoutDashboard,
  Users,
  ArrowLeftRight,
  CreditCard,
  BarChart3,
  Truck,
  FileText,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "wouter";

const menuItems = [
  {
    title: "Tableau de Bord",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Employés",
    url: "/employees",
    icon: Users,
  },
  {
    title: "Transferts",
    url: "/transfers",
    icon: ArrowLeftRight,
  },
  {
    title: "Paiements",
    url: "/payments",
    icon: CreditCard,
  },
  {
    title: "Fiches de Paie",
    url: "/payslips",
    icon: FileText,
  },
  {
    title: "Rapports",
    url: "/reports",
    icon: BarChart3,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-md overflow-hidden">
  <img
    src="https://github.com/Louka85/TransAuvergnevtc-banque/raw/refs/heads/main/Logos/512%20x%20512%20.png"
    alt="FL Banking"
    className="w-full h-full object-contain"
  />
</div>
          <div>
            <h1 className="font-display font-bold text-lg text-sidebar-foreground">
              FL Banking
            </h1>
            <p className="text-xs text-muted-foreground">France Logistique</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`link-${item.title.toLowerCase()}`}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-muted-foreground text-center">
          Version 1.0.0 - Virtuel
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
