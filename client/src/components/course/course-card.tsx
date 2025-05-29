import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProgressBar from "./progress-bar";

interface CourseCardProps {
  course: any;
  progress?: number;
  enrollment?: any;
}

export default function CourseCard({ course, progress = 0, enrollment }: CourseCardProps) {
  const [, setLocation] = useLocation();

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Leadership": "bg-blue-100 text-blue-600",
      "Project Management": "bg-emerald-100 text-emerald-600",
      "Communication": "bg-purple-100 text-purple-600",
      "Analytics": "bg-blue-100 text-blue-600",
      "Security": "bg-red-100 text-red-600",
      "Marketing": "bg-orange-100 text-orange-600"
    };
    return colors[category] || "bg-slate-100 text-slate-600";
  };

  const getProgressColor = () => {
    if (progress === 100) return "bg-emerald-500";
    if (progress > 0) return "bg-blue-500";
    return "bg-slate-300";
  };

  const getButtonText = () => {
    if (progress === 100) return "View Certificate";
    if (progress > 0) return "Continue Learning";
    return "Start Course";
  };

  const getButtonVariant = () => {
    if (progress === 100) return "default";
    if (progress > 0) return "default";
    return "outline";
  };

  const getButtonIcon = () => {
    if (progress === 100) return "fas fa-certificate";
    return "";
  };

  const handleClick = () => {
    if (progress === 100) {
      setLocation("/dashboard/certifications");
    } else {
      setLocation(`/course/${course.id}`);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden">
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <Badge className={getCategoryColor(course.category)}>
            {course.category}
          </Badge>
          <span className="text-sm text-slate-500">{course.duration}</span>
        </div>
        
        <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">
          {course.title}
        </h3>
        
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>
        
        {enrollment && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Progress</span>
              <span className={`text-sm font-semibold ${
                progress === 100 ? "text-emerald-600" : "text-slate-900"
              }`}>
                {progress}%
              </span>
            </div>
            <ProgressBar progress={progress} />
          </div>
        )}
        
        <Button 
          className={`w-full ${
            progress === 100 
              ? "bg-emerald-500 hover:bg-emerald-600" 
              : progress > 0 
              ? "bg-blue-500 hover:bg-blue-600"
              : ""
          }`}
          variant={getButtonVariant()}
          onClick={handleClick}
        >
          {getButtonIcon() && <i className={`${getButtonIcon()} mr-2`}></i>}
          {getButtonText()}
        </Button>
      </CardContent>
    </Card>
  );
}
