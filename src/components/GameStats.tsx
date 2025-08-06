import { Trophy, Zap, Target, Star } from "lucide-react";
import { Card } from "@/components/ui/card";

interface GameStatsProps {
  level: number;
  searches: number;
  streak: number;
  badges: number;
  showBadgeGlow?: boolean;
}

const GameStats = ({ level, searches, streak, badges, showBadgeGlow }: GameStatsProps) => {
  const searchesForNextLevel = Math.ceil((level + 1) * 5);
  const progressPercentage = Math.min((searches / searchesForNextLevel) * 100, 100);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 mx-4">
      <div className="comic-panel p-4 bg-gradient-to-br from-level/10 to-level/20 border-level/40">
        <div className="flex items-center gap-2 mb-1">
          <Target className="w-6 h-6 text-level" />
          <span className="font-black text-level comic-text">LVL {level}</span>
        </div>
        <div className="text-sm text-muted-foreground font-bold">
          {searches}/{searchesForNextLevel}
        </div>
        <div className="w-full bg-muted rounded-full h-3 mt-2 border-2 border-level/30">
          <div 
            className="bg-level h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="comic-panel p-4 bg-gradient-to-br from-streak/10 to-streak/20 border-streak/40">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-6 h-6 text-streak" />
          <span className="font-black text-streak comic-text">{streak} STREAK!</span>
        </div>
        <div className="text-sm text-muted-foreground font-bold">
          🔥 ON FIRE!
        </div>
      </div>

      <div className="comic-panel p-4 bg-gradient-to-br from-primary/10 to-primary/20 border-primary/40">
        <div className="flex items-center gap-2 mb-1">
          <Star className="w-6 h-6 text-primary" />
          <span className="font-black text-primary comic-text">{searches} ASKS!</span>
        </div>
        <div className="text-sm text-muted-foreground font-bold">
          KEEP ASKING!
        </div>
      </div>

      <div className={`comic-panel p-4 bg-gradient-to-br from-badge/10 to-badge/20 border-badge/40 ${showBadgeGlow ? 'achievement-glow' : ''}`}>
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="w-6 h-6 text-badge" />
          <span className="font-black text-badge comic-text">{badges} BADGES!</span>
        </div>
        <div className="text-sm text-muted-foreground font-bold">
          🏆 CHAMPION!
        </div>
      </div>
    </div>
  );
};

export default GameStats;