import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface VideoPlayerProps {
  module: any;
  onComplete: () => void;
}

export default function VideoPlayer({ module, onComplete }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35); // Mock progress

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleComplete = () => {
    onComplete();
  };

  return (
    <Card className="overflow-hidden mb-6">
      <div className="aspect-video bg-slate-900 relative">
        {/* Video placeholder with play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            onClick={handlePlayPause}
            size="lg"
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-6"
            variant="ghost"
          >
            <i className={`${isPlaying ? 'fas fa-pause' : 'fas fa-play'} text-white text-3xl ${!isPlaying ? 'ml-1' : ''}`}></i>
          </Button>
        </div>
        
        {/* Video progress bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <div className="bg-white bg-opacity-20 rounded-full h-1 mb-2">
            <div 
              className="bg-blue-500 h-1 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-white text-sm">
            <span>12:45</span>
            <span>{module.title}</span>
            <span>{module.content?.duration || "36:20"}</span>
          </div>
        </div>
      </div>
      
      {/* Video Controls and Info */}
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-lg">{module.title}</CardTitle>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              <i className="fas fa-bookmark"></i>
            </Button>
            <Button variant="ghost" size="sm">
              <i className="fas fa-share"></i>
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={handlePlayPause}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <i className={`${isPlaying ? 'fas fa-pause' : 'fas fa-play'} mr-2`}></i>
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            
            <Button variant="outline" size="sm">
              <i className="fas fa-step-backward mr-2"></i>
              Previous
            </Button>
            
            <Button variant="outline" size="sm">
              <i className="fas fa-step-forward mr-2"></i>
              Next
            </Button>
          </div>
          
          <Button
            onClick={handleComplete}
            variant="outline"
            className="text-emerald-600 border-emerald-600 hover:bg-emerald-50"
          >
            <i className="fas fa-check mr-2"></i>
            Mark Complete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
