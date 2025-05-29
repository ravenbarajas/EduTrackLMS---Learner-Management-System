import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";

export default function Leaderboard() {
  const { user } = useAuth();
  
  // Fetch leaderboard data
  const { data: leaderboard } = useQuery({
    queryKey: ["/api/leaderboard", { limit: 10 }]
  });

  // Fetch user badges
  const { data: userBadges } = useQuery({
    queryKey: [`/api/users/${user?.id}/badges`],
    enabled: !!user?.id
  });

  const userRank = leaderboard?.findIndex((u: any) => u.id === user?.id) + 1 || 0;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Leaderboard & Achievements</h1>
        <p className="text-slate-600">See how you rank against other learners and your earned badges</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Rankings */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Weekly Rankings</CardTitle>
                <Select defaultValue="week">
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {leaderboard?.map((learner: any, index: number) => {
                  const isCurrentUser = learner.id === user?.id;
                  const isTopThree = index < 3;
                  
                  return (
                    <div
                      key={learner.id}
                      className={`flex items-center p-4 rounded-lg border transition-colors ${
                        isCurrentUser
                          ? "bg-blue-50 border-blue-200"
                          : isTopThree
                          ? index === 0
                            ? "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200"
                            : index === 1
                            ? "bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200"
                            : "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full mr-4 text-sm font-bold ${
                          index === 0
                            ? "bg-amber-500 text-white"
                            : index === 1
                            ? "bg-slate-400 text-white"
                            : index === 2
                            ? "bg-orange-500 text-white"
                            : isCurrentUser
                            ? "bg-blue-500 text-white"
                            : "bg-slate-300 text-slate-600"
                        }`}
                      >
                        {index + 1}
                      </div>
                      
                      <img
                        src={`https://images.unsplash.com/photo-${
                          index === 0 ? '1507003211169-0a1dd7228f2d' :
                          index === 1 ? '1472099645785-5658abf4ff4e' :
                          index === 2 ? '1438761681033-6461ffad8d80' :
                          '1519345182560-3f2917c472ef'
                        }?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150`}
                        alt={`${learner.firstName} ${learner.lastName}`}
                        className="w-10 h-10 rounded-full mr-4"
                      />
                      
                      <div className="flex-1">
                        <div className={`font-semibold ${isCurrentUser ? 'text-blue-900' : 'text-slate-900'}`}>
                          {learner.firstName} {learner.lastName}
                          {isCurrentUser && " (You)"}
                        </div>
                        <div className="text-sm text-slate-600">{learner.department || "Unknown Department"}</div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`font-bold ${isCurrentUser ? 'text-blue-900' : 'text-slate-900'}`}>
                          {learner.totalXP} XP
                        </div>
                        <div className="text-sm text-slate-600">Level {learner.level}</div>
                      </div>
                      
                      {isTopThree && (
                        <i
                          className={`ml-4 ${
                            index === 0
                              ? "fas fa-crown text-amber-500"
                              : "fas fa-medal text-slate-400"
                          }`}
                        ></i>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Badges and Achievements */}
        <div className="lg:col-span-1">
          {/* Your Position */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Position</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">
                #{userRank || "N/A"}
              </div>
              <div className="text-sm text-slate-600 mb-4">Current Rank</div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-slate-900">{user?.totalXP || 0}</div>
                  <div className="text-xs text-slate-600">Total XP</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-900">{user?.level || 1}</div>
                  <div className="text-xs text-slate-600">Level</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {/* Mock badges since we have sample data */}
                <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fas fa-graduation-cap text-white"></i>
                  </div>
                  <div className="text-xs font-medium text-emerald-800">First Course</div>
                  <div className="text-xs text-emerald-600">Completed</div>
                </div>

                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fas fa-brain text-white"></i>
                  </div>
                  <div className="text-xs font-medium text-blue-800">Quick Learner</div>
                  <div className="text-xs text-blue-600">Completed</div>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fas fa-fire text-white"></i>
                  </div>
                  <div className="text-xs font-medium text-purple-800">On Fire</div>
                  <div className="text-xs text-purple-600">Completed</div>
                </div>

                <div className="text-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="w-12 h-12 bg-slate-300 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fas fa-star text-white"></i>
                  </div>
                  <div className="text-xs font-medium text-slate-600">Top Performer</div>
                  <div className="text-xs text-slate-500">Locked</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* XP Progress */}
          <Card>
            <CardHeader>
              <CardTitle>XP Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-blue-500">{user?.totalXP || 0}</div>
                <div className="text-sm text-slate-600">Total XP Earned</div>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Level {user?.level || 1}</span>
                  <span className="text-sm text-slate-600">Level {(user?.level || 1) + 1}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" 
                    style={{ width: "65%" }}
                  ></div>
                </div>
                <div className="text-center mt-2 text-sm text-slate-600">150 XP to next level</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
