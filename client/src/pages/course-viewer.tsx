import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import VideoPlayer from "@/components/course/video-player";
import QuizEngine from "@/components/course/quiz-engine";
import ProgressBar from "@/components/course/progress-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth-context";
import { apiRequest } from "@/lib/queryClient";

export default function CourseViewer() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [notes, setNotes] = useState("");

  // Fetch course details
  const { data: course, isLoading } = useQuery({
    queryKey: [`/api/courses/${id}`],
    enabled: !!id
  });

  // Fetch user enrollment
  const { data: enrollments } = useQuery({
    queryKey: [`/api/users/${user?.id}/enrollments`],
    enabled: !!user?.id
  });

  const enrollment = enrollments?.find((e: any) => e.courseId === parseInt(id || "0"));

  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async ({ enrollmentId, progress, completedModules }: any) => {
      return apiRequest("PATCH", `/api/enrollments/${enrollmentId}/progress`, {
        progress,
        completedModules
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/enrollments`] });
    }
  });

  const currentModule = course?.modules?.[currentModuleIndex];

  const handleModuleComplete = () => {
    if (!enrollment || !course) return;

    const completedModules = [...(enrollment.completedModules || [])];
    const moduleId = currentModule?.id;
    
    if (moduleId && !completedModules.includes(moduleId)) {
      completedModules.push(moduleId);
    }

    const progress = Math.round((completedModules.length / course.modules.length) * 100);

    updateProgressMutation.mutate({
      enrollmentId: enrollment.id,
      progress,
      completedModules
    });
  };

  const handleQuizComplete = (score: number) => {
    handleModuleComplete();
    // Move to next module
    if (currentModuleIndex < (course?.modules?.length || 0) - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-lg">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-lg">Course not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="pt-16 flex">
        <Sidebar />
        <div className="flex-1 lg:ml-64 p-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setLocation("/dashboard")}
              className="mb-4"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Courses
            </Button>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{course.title}</h1>
            <p className="text-slate-600">{course.description}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              {currentModule?.type === "video" && (
                <VideoPlayer
                  module={currentModule}
                  onComplete={handleModuleComplete}
                />
              )}

              {currentModule?.type === "quiz" && (
                <QuizEngine
                  module={currentModule}
                  onComplete={handleQuizComplete}
                />
              )}

              {currentModule?.type === "text" && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>{currentModule.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p>{currentModule.content}</p>
                    </div>
                    <Button
                      onClick={handleModuleComplete}
                      className="mt-4 bg-blue-500 hover:bg-blue-600"
                    >
                      Mark as Complete
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Notes Section */}
              <Card>
                <CardHeader>
                  <CardTitle>My Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Add your notes here..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="mb-4"
                  />
                  <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                    Save Note
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Course Sidebar */}
            <div className="lg:col-span-1">
              {/* Course Progress */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Course Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProgressBar
                    progress={enrollment?.progress || 0}
                    className="mb-4"
                  />
                  <p className="text-sm text-slate-600">
                    {enrollment?.completedModules?.length || 0} of {course.modules?.length || 0} modules completed
                  </p>
                </CardContent>
              </Card>

              {/* Course Modules */}
              <Card>
                <CardHeader>
                  <CardTitle>Course Modules</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {course.modules?.map((module: any, index: number) => {
                      const isCompleted = enrollment?.completedModules?.includes(module.id);
                      const isCurrent = index === currentModuleIndex;
                      const isLocked = index > currentModuleIndex && !isCompleted;

                      return (
                        <div
                          key={module.id}
                          className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                            isCurrent
                              ? "bg-blue-50 border border-blue-200"
                              : isCompleted
                              ? "hover:bg-slate-50"
                              : isLocked
                              ? "border border-slate-200"
                              : "hover:bg-slate-50"
                          }`}
                          onClick={() => !isLocked && setCurrentModuleIndex(index)}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                              isCurrent
                                ? "bg-blue-500"
                                : isCompleted
                                ? "bg-emerald-500"
                                : isLocked
                                ? "bg-slate-300"
                                : "bg-slate-400"
                            }`}
                          >
                            <i
                              className={`text-white text-sm ${
                                isCurrent
                                  ? "fas fa-play"
                                  : isCompleted
                                  ? "fas fa-check"
                                  : isLocked
                                  ? "fas fa-lock"
                                  : "fas fa-play"
                              }`}
                            ></i>
                          </div>
                          <div className="flex-1">
                            <div
                              className={`font-medium text-sm ${
                                isLocked ? "text-slate-500" : "text-slate-900"
                              }`}
                            >
                              {module.title}
                            </div>
                            <div className="text-xs text-slate-600">
                              {module.type === "video" && module.content?.duration}
                              {module.type === "quiz" && "Quiz"}
                              {module.type === "text" && "Reading"}
                              {isCurrent && " • Currently watching"}
                              {isCompleted && " • Completed"}
                              {isLocked && " • Locked"}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
