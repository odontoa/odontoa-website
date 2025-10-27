'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard,
  Calendar,
  FileText,
  BookOpen,
  Settings,
  Menu,
  X,
  Plus,
  LogOut,
  ChevronRight,
  Home,
  Image
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Kontrolna tabla',
    icon: LayoutDashboard,
    href: '/admin-panel'
  },
  {
    id: 'calendar',
    label: 'Kalendar',
    icon: Calendar,
    href: '/admin-panel/calendar'
  },
  {
    id: 'blogs',
    label: 'Blogovi',
    icon: FileText,
    href: '/admin-panel/blogs'
  },
  {
    id: 'glossary',
    label: 'Recnici',
    icon: BookOpen,
    href: '/admin-panel/glossary'
  },
  {
    id: 'create-blog',
    label: 'Kreiraj Blog',
    icon: FileText,
    href: '/admin-panel/create-blog'
  },
  {
    id: 'create-glossary',
    label: 'Kreiraj Recnik',
    icon: BookOpen,
    href: '/admin-panel/create-glossary'
  },
  {
    id: 'media',
    label: 'Media',
    icon: Image,
    href: '/admin-panel/media'
  },
  {
    id: 'settings',
    label: 'Postavke',
    icon: Settings,
    href: '/admin-panel/settings'
  }
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const getBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs = [
      { label: 'Content Admin', href: '/admin-panel' }
    ];

    if (pathSegments.length > 1) {
      const currentPage = navigationItems.find(item => item.href === pathname);
      if (currentPage) {
        breadcrumbs.push({ label: currentPage.label, href: pathname });
      }
    }

    return breadcrumbs;
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('sr-RS', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getQuickActions = () => {
    return [
      {
        label: 'Kreiraj Blog',
        icon: FileText,
        action: () => handleNavigation('/admin-panel/create-blog'),
        variant: 'default' as const
      },
      {
        label: 'Novi Recnik',
        icon: BookOpen,
        action: () => handleNavigation('/admin-panel/create-glossary'),
        variant: 'outline' as const
      }
    ];
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out",
        isMobile ? (sidebarOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Home className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Odontoa</h2>
                <p className="text-xs text-slate-400">Content Admin Panel</p>
              </div>
            </div>
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.href)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors duration-200",
                    isActive 
                      ? "bg-blue-600 text-white" 
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" className="bg-slate-700 text-slate-200">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-700">
            <Button
              onClick={signOut}
              variant="ghost"
              className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Odjavi se
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        isMobile ? "ml-0" : "ml-64"
      )}>
        {/* Header Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Mobile menu button and breadcrumbs */}
            <div className="flex items-center space-x-4">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              
              {/* Breadcrumbs */}
              <nav className="flex items-center space-x-2 text-sm">
                {getBreadcrumbs().map((crumb, index) => (
                  <React.Fragment key={crumb.href}>
                    {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400" />}
                    <span className={cn(
                      index === getBreadcrumbs().length - 1 
                        ? "text-gray-900 font-medium" 
                        : "text-gray-500 hover:text-gray-700 cursor-pointer"
                    )}>
                      {crumb.label}
                    </span>
                  </React.Fragment>
                ))}
              </nav>
            </div>

            {/* Right side - Date and quick actions */}
            <div className="flex items-center space-x-4">
              {/* Date */}
              <div className="hidden sm:block text-sm text-gray-600">
                {getCurrentDate()}
              </div>

              {/* Quick Actions */}
              <div className="flex items-center space-x-2">
                {getQuickActions().map((action) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={action.label}
                      onClick={action.action}
                      variant={action.variant}
                      size="sm"
                      className="hidden sm:flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>{action.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
