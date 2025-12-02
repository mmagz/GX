import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  Star,
  ShoppingCart,
  BarChart3, 
  Settings,
  ChevronRight
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

interface AppSidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    view: "dashboard"
  },
  {
    title: "Order Management",
    icon: ShoppingCart,
    view: "orders"
  },
  {
    title: "Product Management",
    icon: Package,
    view: "products"
  },
  {
    title: "Capsule Management",
    icon: Layers,
    view: "capsules"
  }
];

export function AppSidebar({ activeView, onNavigate }: AppSidebarProps) {
  return (
    <Sidebar className="border-r bg-[#EDE9E4] border-gray-200">
      <SidebarContent className="bg-[#EDE9E4]">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#404040]">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = activeView === item.view;
                return (
                  <SidebarMenuItem key={item.view}>
                    <SidebarMenuButton
                      onClick={() => onNavigate(item.view)}
                      isActive={isActive}
                      className={`
                        group transition-all
                        ${isActive 
                          ? 'bg-[#e6e1db] text-black hover:bg-[#e6e1db] hover:text-black shadow-inner' 
                          : 'hover:bg-[#EAE7E2]'
                        }
                      `}
                    >
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-black' : 'text-[#404040]'}`} />
                      <span className={isActive ? 'text-black' : ''}>{item.title}</span>
                      {isActive && (
                        <ChevronRight className="ml-auto w-4 h-4 text-black" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
