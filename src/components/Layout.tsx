
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { 
  Inbox, 
  BarChart3, 
  AlertCircle, 
  Settings, 
  Menu,
  X,
  Shield,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface LayoutProps {
  children: ReactNode;
}

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  {
    href: "/",
    label: "Dashboard",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    href: "/inbox",
    label: "Inbox",
    icon: <Inbox className="h-5 w-5" />,
  },
  {
    href: "/alerts",
    label: "Alerts",
    icon: <AlertCircle className="h-5 w-5" />,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile Header */}
      <div className="md:hidden border-b bg-background/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex h-16 items-center px-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-foreground">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <div className="flex items-center justify-center flex-1">
            <Link to="/" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg tracking-tight">PhishGuard</span>
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={cn(
            "bg-sidebar border-r z-30",
            "fixed inset-y-0 left-0 transition-all transform md:translate-x-0 w-64",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="h-full flex flex-col bg-gray-50/90 dark:bg-gray-900/90 backdrop-blur-sm">
            {/* Sidebar Header */}
            <div className="h-16 flex items-center gap-2 px-6 border-b">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg tracking-tight text-sidebar-foreground">PhishGuard</span>
              <Button 
                className="md:hidden ml-auto" 
                variant="ghost" 
                size="icon"
                onClick={toggleSidebar}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 px-3 py-6">
              <div className="space-y-1.5">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                      location.pathname === item.href
                        ? "bg-primary/10 text-primary font-medium dark:bg-primary/20"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/40 hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      {item.label}
                    </div>
                    {location.pathname === item.href && (
                      <ChevronRight className="h-4 w-4 text-primary opacity-70" />
                    )}
                  </Link>
                ))}
              </div>
            </nav>
            
            {/* Sidebar Footer */}
            <div className="border-t p-4 bg-gray-50/80 dark:bg-gray-900/80">
              <div className="flex items-center justify-between">
                <span className="text-xs text-sidebar-foreground">© 2023 PhishGuard</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </aside>
        
        {/* Content Area */}
        <main className="flex-1 md:ml-64">
          <div className="container py-6 md:py-8">
            {children}
          </div>
        </main>
        
        {/* Sidebar Backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden" 
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
