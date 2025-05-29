import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import CourseCard from "@/components/course/course-card";
import Leaderboard from "@/components/gamification/leaderboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export default function Dashboard() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");

  // Determine current view from URL
  const getCurrentView = () => {
    if (location.includes("/leaderboard")) return "leaderboard";
    if (location.includes("/progress")) return "progress";
    if (location.includes("/certifications")) return "certifications";
    return "courses";
  };

  const currentView = getCurrentView();

  // Fetch user stats
  const { data: userStats } = useQuery({
    queryKey: [`/api/users/${user?.id}/stats`],
    enabled: !!user?.id
  });

  // Fetch user enrollments
  const { data: enrollments } = useQuery({
    queryKey: [`/api/users/${user?.id}/enrollments`],
    enabled: !!user?.id
  });

  // Fetch user certificates
  const { data: certificates } = useQuery({
    queryKey: [`/api/users/${user?.id}/certificates`],
    enabled: !!user?.id && currentView === "certifications"
  });

  // Fetch courses for course catalog
  const { data: courses } = useQuery({
    queryKey: ["/api/courses", { category: selectedCategory, search: searchTerm }],
    enabled: currentView === "courses"
  });

  const renderCoursesView = () => (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Learning Dashboard</h1>
        <p className="text-slate-600">Continue your learning journey and track your progress</p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
            </div>
            <div className="flex gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Categories">All Categories</SelectItem>
                  <SelectItem value="Leadership">Leadership</SelectItem>
                  <SelectItem value="Technical Skills">Technical Skills</SelectItem>
                  <SelectItem value="Communication">Communication</SelectItem>
                  <SelectItem value="Project Management">Project Management</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Levels">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Progress Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Courses in Progress</h3>
              <i className="fas fa-play-circle text-blue-500 text-xl"></i>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">
              {userStats?.inProgress || 0}
            </div>
            <p className="text-slate-600 text-sm">Keep up the momentum!</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Completed Courses</h3>
              <i className="fas fa-check-circle text-emerald-500 text-xl"></i>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">
              {userStats?.completed || 0}
            </div>
            <p className="text-slate-600 text-sm">Great progress!</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Certificates Earned</h3>
              <i className="fas fa-award text-amber-500 text-xl"></i>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">
              {userStats?.certificates || 0}
            </div>
            <p className="text-slate-600 text-sm">Keep learning!</p>
          </CardContent>
        </Card>
      </div>

      {/* Course Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrollments?.map((enrollment: any) => (
          <CourseCard
            key={enrollment.id}
            course={enrollment.course}
            progress={enrollment.progress}
            enrollment={enrollment}
          />
        ))}
      </div>
    </div>
  );

  const renderProgressView = () => (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Progress Tracking</h1>
        <p className="text-slate-600">Monitor your learning progress across all courses</p>
      </div>

      <div className="grid gap-6">
        {enrollments?.map((enrollment: any) => (
          <Card key={enrollment.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start">
                  <img
                    src={enrollment.course?.thumbnail}
                    alt={enrollment.course?.title}
                    className="w-20 h-16 rounded-lg mr-4 object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">
                      {enrollment.course?.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-2">
                      {enrollment.course?.description}
                    </p>
                    <div className="flex items-center text-sm text-slate-500">
                      <i className="fas fa-clock mr-1"></i>
                      <span>{enrollment.course?.duration}</span>
                      <span className="mx-2">•</span>
                      <span>{enrollment.course?.category}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900 mb-1">
                    {enrollment.progress}%
                  </div>
                  <div className="text-sm text-slate-600">Complete</div>
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${enrollment.progress}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCertificatesView = () => (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Certificates</h1>
        <p className="text-slate-600">View and manage your earned certificates</p>
      </div>

      <div className="grid gap-6">
        {certificates?.map((certificate: any) => (
          <Card key={certificate.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="w-20 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-certificate text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">
                      {certificate.course?.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-2">
                      Completed on {new Date(certificate.issuedAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center text-sm text-slate-500">
                      <i className="fas fa-clock mr-1"></i>
                      <span>{certificate.course?.duration}</span>
                      <span className="mx-2">•</span>
                      <i className="fas fa-star mr-1"></i>
                      <span>Score: {certificate.score}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                    <i className="fas fa-download mr-2"></i>
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <i className="fas fa-eye mr-2"></i>
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* In Progress Courses */}
        {enrollments?.filter((e: any) => e.progress > 0 && e.progress < 100).map((enrollment: any) => (
          <Card key={`progress-${enrollment.id}`} className="bg-slate-50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="w-20 h-16 bg-slate-300 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-hourglass-half text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-700 mb-1">
                      {enrollment.course?.title}
                    </h3>
                    <p className="text-slate-500 text-sm mb-2">
                      In Progress ({enrollment.progress}% complete)
                    </p>
                    <div className="w-40 bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Complete Course
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="pt-16 flex">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          {currentView === "courses" && renderCoursesView()}
          {currentView === "progress" && renderProgressView()}
          {currentView === "certifications" && renderCertificatesView()}
          {currentView === "leaderboard" && <Leaderboard />}
        </div>
      </div>
    </div>
  );
}
