import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/auth-context";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Module {
  id: string;
  type: "video" | "text" | "quiz";
  title: string;
  content: any;
}

export default function Admin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [courseTitle, setCourseTitle] = useState("New Leadership Course");
  const [courseDescription, setCourseDescription] = useState("Learn the fundamentals of effective leadership in this comprehensive course.");
  const [courseCategory, setCourseCategory] = useState("Leadership");
  const [courseLevel, setCourseLevel] = useState("beginner");
  const [courseDuration, setCourseDuration] = useState("4h 30m");
  const [modules, setModules] = useState<Module[]>([
    {
      id: "module-1",
      type: "video",
      title: "Welcome Video",
      content: { url: "", duration: "10:00" }
    }
  ]);

  const createCourseMutation = useMutation({
    mutationFn: async (courseData: any) => {
      return apiRequest("POST", "/api/courses", courseData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Course created successfully!"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create course. Please try again.",
        variant: "destructive"
      });
    }
  });

  const addModule = (type: "video" | "text" | "quiz") => {
    const newModule: Module = {
      id: `module-${modules.length + 1}`,
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Module`,
      content: type === "video" ? { url: "", duration: "0:00" } : 
               type === "quiz" ? { questions: [] } : ""
    };
    setModules([...modules, newModule]);
  };

  const updateModule = (index: number, updates: Partial<Module>) => {
    const updatedModules = modules.map((module, i) => 
      i === index ? { ...module, ...updates } : module
    );
    setModules(updatedModules);
  };

  const removeModule = (index: number) => {
    setModules(modules.filter((_, i) => i !== index));
  };

  const handlePublish = () => {
    const courseData = {
      title: courseTitle,
      description: courseDescription,
      category: courseCategory,
      level: courseLevel,
      duration: courseDuration,
      authorId: user?.id,
      modules,
      tags: [courseCategory.toLowerCase(), courseLevel],
      isPublished: true
    };

    createCourseMutation.mutate(courseData);
  };

  const handleSaveDraft = () => {
    const courseData = {
      title: courseTitle,
      description: courseDescription,
      category: courseCategory,
      level: courseLevel,
      duration: courseDuration,
      authorId: user?.id,
      modules,
      tags: [courseCategory.toLowerCase(), courseLevel],
      isPublished: false
    };

    createCourseMutation.mutate(courseData);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="pt-16 flex">
        <Sidebar />
        <div className="flex-1 lg:ml-64 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Course Builder</h1>
            <p className="text-slate-600">Create engaging courses with our intuitive builder</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Builder Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Add Components</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => addModule("video")}
                  >
                    <i className="fas fa-video text-blue-500 mr-3"></i>
                    Video
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => addModule("text")}
                  >
                    <i className="fas fa-align-left text-emerald-500 mr-3"></i>
                    Text Block
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => addModule("quiz")}
                  >
                    <i className="fas fa-question-circle text-purple-500 mr-3"></i>
                    Quiz
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Builder Area */}
            <div className="lg:col-span-3">
              <Card>
                {/* Course Header */}
                <CardContent className="p-6 border-b border-slate-200">
                  <Input
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    className="text-2xl font-bold border-none outline-none p-2 mb-2"
                    placeholder="Course Title"
                  />
                  <Textarea
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    placeholder="Course description..."
                    rows={2}
                    className="mb-4"
                  />
                  
                  <div className="grid grid-cols-3 gap-4">
                    <Select value={courseCategory} onValueChange={setCourseCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Leadership">Leadership</SelectItem>
                        <SelectItem value="Technical Skills">Technical Skills</SelectItem>
                        <SelectItem value="Communication">Communication</SelectItem>
                        <SelectItem value="Project Management">Project Management</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={courseLevel} onValueChange={setCourseLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Input
                      value={courseDuration}
                      onChange={(e) => setCourseDuration(e.target.value)}
                      placeholder="Duration (e.g., 4h 30m)"
                    />
                  </div>
                </CardContent>

                {/* Course Builder Canvas */}
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {modules.map((module, index) => (
                      <Card key={module.id} className="border border-slate-200 hover:border-blue-300 transition-colors">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <Input
                              value={module.title}
                              onChange={(e) => updateModule(index, { title: e.target.value })}
                              className="font-semibold text-slate-900 border-none outline-none"
                            />
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeModule(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <i className="fas fa-trash"></i>
                              </Button>
                            </div>
                          </div>

                          {module.type === "video" && (
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                              <div className="flex items-center mb-3">
                                <i className="fas fa-video text-blue-500 mr-2"></i>
                                <span className="font-medium text-slate-900">Video Content</span>
                              </div>
                              <div className="aspect-video bg-slate-200 rounded-lg flex items-center justify-center mb-4">
                                <Button className="bg-blue-500 hover:bg-blue-600">
                                  <i className="fas fa-upload mr-2"></i>
                                  Upload Video
                                </Button>
                              </div>
                              <Input
                                placeholder="Video URL"
                                value={module.content.url || ""}
                                onChange={(e) => updateModule(index, {
                                  content: { ...module.content, url: e.target.value }
                                })}
                              />
                            </div>
                          )}

                          {module.type === "text" && (
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                              <div className="flex items-center mb-3">
                                <i className="fas fa-align-left text-emerald-500 mr-2"></i>
                                <span className="font-medium text-slate-900">Text Content</span>
                              </div>
                              <Textarea
                                placeholder="Add your content here..."
                                value={module.content || ""}
                                onChange={(e) => updateModule(index, { content: e.target.value })}
                                rows={4}
                              />
                            </div>
                          )}

                          {module.type === "quiz" && (
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                              <div className="flex items-center mb-3">
                                <i className="fas fa-question-circle text-purple-500 mr-2"></i>
                                <span className="font-medium text-slate-900">Quiz</span>
                              </div>
                              <Button variant="outline" className="w-full">
                                <i className="fas fa-plus mr-2"></i>
                                Add Question
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}

                    <Button
                      variant="outline"
                      className="w-full border-2 border-dashed border-slate-300 p-6 text-slate-500 hover:border-blue-400 hover:text-blue-500"
                      onClick={() => addModule("text")}
                    >
                      <i className="fas fa-plus mr-2"></i>
                      Add New Module
                    </Button>
                  </div>
                </CardContent>

                {/* Course Actions */}
                <CardContent className="border-t border-slate-200 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="outline"
                        onClick={handleSaveDraft}
                        disabled={createCourseMutation.isPending}
                      >
                        Save Draft
                      </Button>
                      <Button variant="outline">
                        Preview
                      </Button>
                    </div>
                    <Button
                      onClick={handlePublish}
                      disabled={createCourseMutation.isPending}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      {createCourseMutation.isPending ? "Publishing..." : "Publish Course"}
                    </Button>
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
