import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";

interface CertificatePreviewProps {
  certificate?: any;
  course?: any;
  isPreview?: boolean;
}

export default function CertificatePreview({ 
  certificate, 
  course, 
  isPreview = false 
}: CertificatePreviewProps) {
  const { user } = useAuth();

  // Default values for preview mode
  const certData = {
    courseTitle: course?.title || "Leadership Fundamentals",
    userName: user ? `${user.firstName} ${user.lastName}` : "John Doe",
    completionDate: certificate?.issuedAt 
      ? new Date(certificate.issuedAt).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      : "March 15, 2024",
    certificateId: certificate?.certificateId || "LF-2024-001",
    score: certificate?.score || 92,
    duration: course?.duration || "4.5 hours"
  };

  const handleDownload = () => {
    // In a real implementation, this would generate and download a PDF
    console.log("Downloading certificate:", certData.certificateId);
    
    // Mock download for demo purposes
    const blob = new Blob(
      [`Certificate for ${certData.courseTitle} - ${certData.userName}`], 
      { type: 'text/plain' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate-${certData.certificateId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Certificate - ${certData.courseTitle}`,
        text: `I've completed ${certData.courseTitle} and earned a certificate!`,
        url: window.location.href
      });
    } else {
      // Fallback to copying link
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Certificate Preview</CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* Certificate Template */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-8 text-center mb-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-center mb-4">
              <i className="fas fa-graduation-cap text-blue-500 text-4xl mr-3"></i>
              <div className="text-left">
                <h2 className="text-2xl font-bold text-slate-900">SkillNest</h2>
                <p className="text-sm text-slate-600">Learning Excellence</p>
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 border-b border-blue-200 pb-2">
              Certificate of Completion
            </h3>
          </div>
          
          {/* Main Content */}
          <div className="mb-6 space-y-4">
            <p className="text-sm text-slate-600">This certifies that</p>
            <p className="text-2xl font-bold text-slate-900 py-2 border-b border-slate-300">
              {certData.userName}
            </p>
            <p className="text-sm text-slate-600">has successfully completed the course</p>
            <p className="text-xl font-semibold text-blue-700 py-2">
              {certData.courseTitle}
            </p>
            <p className="text-sm text-slate-600">
              on {certData.completionDate}
            </p>
          </div>
          
          {/* Achievement Details */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-center">
            <div className="bg-white bg-opacity-50 rounded-lg p-3">
              <div className="text-lg font-bold text-slate-900">{certData.score}%</div>
              <div className="text-xs text-slate-600">Final Score</div>
            </div>
            <div className="bg-white bg-opacity-50 rounded-lg p-3">
              <div className="text-lg font-bold text-slate-900">{certData.duration}</div>
              <div className="text-xs text-slate-600">Duration</div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="border-t border-blue-200 pt-4 mt-6">
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>Certificate ID: {certData.certificateId}</span>
              <div className="flex items-center">
                <i className="fas fa-shield-alt mr-1"></i>
                <span>Verified by SkillNest</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        {!isPreview && (
          <div className="space-y-3">
            <Button 
              onClick={handleDownload} 
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              <i className="fas fa-download mr-2"></i>
              Download PDF
            </Button>
            <Button 
              variant="outline" 
              onClick={handleShare}
              className="w-full"
            >
              <i className="fas fa-share mr-2"></i>
              Share Certificate
            </Button>
          </div>
        )}
        
        {/* Certificate Status */}
        <div className="mt-4 text-center">
          <Badge 
            variant="default" 
            className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
          >
            <i className="fas fa-check-circle mr-1"></i>
            Verified Certificate
          </Badge>
        </div>
        
        {/* Additional Info */}
        <div className="mt-4 p-3 bg-slate-50 rounded-lg">
          <div className="text-xs text-slate-600 text-center">
            This certificate validates the successful completion of the course requirements 
            and demonstrates proficiency in {certData.courseTitle.toLowerCase()}.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
