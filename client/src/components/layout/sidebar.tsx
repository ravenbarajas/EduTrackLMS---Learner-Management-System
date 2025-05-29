import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";

export default function Sidebar() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();

  const navigationItems = [
    {
      label: "Dashboard",
      icon: "fas fa-home",
      path: "/dashboard",
      roles: ["learner", "admin", "instructor"]
    },
    {
      label: "My Courses",
      icon: "fas fa-book",
      path: "/dashboard/courses",
      roles: ["learner", "admin", "instructor"]
    },
    {
      label: "Progress",
      icon: "fas fa-chart-line",
      path: "/dashboard/progress",
      roles: ["learner", "admin", "instructor"]
    },
    {
      label: "Certifications",
      icon: "fas fa-certificate",
      path: "/dashboard/certifications",
      roles: ["learner", "admin", "instructor"]
    },
    {
      label: "Leaderboard",
      icon: "fas fa-trophy",
      path: "/dashboard/leaderboard",
      roles: ["learner", "admin", "instructor"]
    }
  ];

  const adminItems = [
    {
      label: "Course Builder",
      icon: "fas fa-cog",
      path: "/dashboard/admin",
      roles: ["admin", "instructor"]
    }
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location === "/dashboard" || location === "/dashboard/courses";
    }
    return location === path;
  };

  const canAccess = (roles: string[]) => {
    return user && roles.includes(user.role);
  };

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform -translate-x-full lg:translate-x-0 transition-transform duration-200 ease-in-out z-30 top-16">
      <div className="flex flex-col h-full">
        {/* User Profile Section */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" 
              alt="User profile" 
              className="w-10 h-10 rounded-full mr-3" 
            />
            <div>
              <div className="font-semibold text-slate-900">
                {user ? `${user.firstName} ${user.lastName}` : "Guest"}
              </div>
              <div className="text-sm text-slate-500">
                {user?.role?.charAt(0).toUpperCase() + (user?.role?.slice(1) || "")}
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems
              .filter(item => canAccess(item.roles))
              .map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => setLocation(item.path)}
                    className={`w-full text-left flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? "bg-blue-100 text-blue-700"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <i className={`${item.icon} mr-3 text-slate-500`}></i>
                    {item.label}
                  </button>
                </li>
              ))}
            
            {/* Admin Section */}
            {adminItems.some(item => canAccess(item.roles)) && (
              <li className="pt-4">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 mb-2">
                  Admin Tools
                </div>
                {adminItems
                  .filter(item => canAccess(item.roles))
                  .map((item) => (
                    <button
                      key={item.path}
                      onClick={() => setLocation(item.path)}
                      className={`w-full text-left flex items-center px-4 py-3 rounded-lg transition-colors ${
                        isActive(item.path)
                          ? "bg-blue-100 text-blue-700"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <i className={`${item.icon} mr-3 text-slate-500`}></i>
                      {item.label}
                    </button>
                  ))}
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}
