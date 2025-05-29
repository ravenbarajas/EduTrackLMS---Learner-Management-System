import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BadgeCardProps {
  badge: any;
  isEarned?: boolean;
  earnedAt?: Date;
}

export default function BadgeCard({ badge, isEarned = false, earnedAt }: BadgeCardProps) {
  return (
    <Card className={`transition-all hover:shadow-md ${
      isEarned ? "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200" : "bg-slate-50 border-slate-200"
    }`}>
      <CardContent className="p-6 text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
          isEarned ? "bg-emerald-500" : "bg-slate-300"
        }`}>
          <i className={`${badge.icon} text-white text-2xl`}></i>
        </div>
        
        <h3 className={`font-semibold mb-2 ${
          isEarned ? "text-emerald-900" : "text-slate-600"
        }`}>
          {badge.name}
        </h3>
        
        <p className={`text-sm mb-3 ${
          isEarned ? "text-emerald-700" : "text-slate-500"
        }`}>
          {badge.description}
        </p>
        
        <div className="flex items-center justify-center space-x-2">
          <Badge variant={isEarned ? "default" : "secondary"} className="text-xs">
            {isEarned ? "Earned" : "Locked"}
          </Badge>
          
          {badge.xpReward > 0 && (
            <Badge variant="outline" className="text-xs">
              +{badge.xpReward} XP
            </Badge>
          )}
        </div>
        
        {isEarned && earnedAt && (
          <p className="text-xs text-emerald-600 mt-2">
            Earned {earnedAt.toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
