import { Trophy, Zap, Target, Star } from "lucide-react";
import { Card } from "@/components/ui/card";

interface GameStatsProps {
  level: number;
  searches: number;
  streak: number;
  badges: number;
}

const GameStats = ({ level, searches, streak, badges }: GameStatsProps) => {
  const searchesForNextLevel = Math.ceil((level + 1) * 5);
  const progressPercentage = Math.min((searches / searchesForNextLevel) * 100, 100);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Card className="p-4 bg-gradient-to-br from-level/10 to-level/20 border-level/30">
        <div className="flex items-center gap-2 mb-1">
          <Target className="w-5 h-5 text-level" />
          <span className="font-bold text-level">Level {level}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {searches}/{searchesForNextLevel} searches
        </div>
        <div className="w-full bg-muted rounded-full h-2 mt-2">
          <div 
            className="bg-level h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-streak/10 to-streak/20 border-streak/30">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-5 h-5 text-streak" />
          <span className="font-bold text-streak">{streak} Day Streak</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Keep learning daily!
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/20 border-primary/30">
        <div className="flex items-center gap-2 mb-1">
          <Star className="w-5 h-5 text-primary" />
          <span className="font-bold text-primary">{searches} Searches</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Questions asked
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-badge/10 to-badge/20 border-badge/30">
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="w-5 h-5 text-badge" />
          <span className="font-bold text-badge">{badges} Badges</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Achievements earned
        </div>
      </Card>
    </div>
  );
};

export default GameStats;