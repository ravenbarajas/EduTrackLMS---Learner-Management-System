import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import CourseViewer from "@/pages/course-viewer";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/courses" component={Dashboard} />
      <Route path="/dashboard/progress" component={Dashboard} />
      <Route path="/dashboard/certifications" component={Dashboard} />
      <Route path="/dashboard/leaderboard" component={Dashboard} />
      <Route path="/dashboard/admin" component={Admin} />
      <Route path="/course/:id" component={CourseViewer} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
