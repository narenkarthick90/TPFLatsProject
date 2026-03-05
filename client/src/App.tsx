import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import AuthPage from "@/pages/AuthPage";   // ✅ ADDED
import DashboardLayout from "@/pages/dashboard-layout";
import Projects from "@/pages/projects";
import ProjectDetails from "@/pages/project-details";
import Profile from "@/pages/profile";
import MyApplications from "@/pages/my-applications";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />

      {/* ✅ AUTH ROUTE ADDED */}
      <Route path="/auth" component={AuthPage} />

      <Route path="/projects">
        {() => (
          <DashboardLayout>
            <Projects />
          </DashboardLayout>
        )}
      </Route>

      <Route path="/projects/:id">
        {() => (
          <DashboardLayout>
            <ProjectDetails />
          </DashboardLayout>
        )}
      </Route>

      <Route path="/profile">
        {() => (
          <DashboardLayout>
            <Profile />
          </DashboardLayout>
        )}
      </Route>

      <Route path="/applications">
        {() => (
          <DashboardLayout>
            <MyApplications />
          </DashboardLayout>
        )}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;