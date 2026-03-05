import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Terminal } from "lucide-react";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Terminal className="h-12 w-12 text-primary animate-pulse" />
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = "/auth";
    return null;
  }

  return (
    <SidebarProvider style={{ "--sidebar-width": "18rem" } as React.CSSProperties}>
      <div className="flex min-h-screen w-full bg-background font-mono">
        <AppSidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <header className="flex items-center p-4 border-b-2 border-primary/20 bg-card/50 backdrop-blur-md sticky top-0 z-10">
            <SidebarTrigger className="text-primary hover:bg-primary/20 hover:text-primary transition-colors p-2" />
            <div className="ml-4 font-display text-muted-foreground tracking-widest">
              STATUS: <span className="text-primary animate-pulse">ONLINE</span>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
