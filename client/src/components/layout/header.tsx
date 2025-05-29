import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export default function Header() {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();

  const isLandingPage = location === "/";

  const handleAuthAction = () => {
    if (user) {
      logout();
      setLocation("/");
    } else {
      setLocation("/");
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div 
              className="flex-shrink-0 flex items-center cursor-pointer"
              onClick={() => setLocation("/")}
            >
              <i className="fas fa-graduation-cap text-blue-500 text-2xl mr-2"></i>
              <span className="text-xl font-bold text-slate-900">SkillNest</span>
            </div>
          </div>
          
          {isLandingPage ? (
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <button className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium">
                  Features
                </button>
                <button className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium">
                  Pricing
                </button>
                <button className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium">
                  About
                </button>
                <Button className="bg-blue-500 hover:bg-blue-600">
                  Request Demo
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600">Welcome, {user.firstName}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAuthAction}
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          )}
          
          <div className="md:hidden">
            <button className="text-slate-600 hover:text-slate-900">
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
