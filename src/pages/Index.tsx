import { useState } from "react";
import NovaLogo from "@/components/NovaLogo";
import GameStats from "@/components/GameStats";
import SearchBox from "@/components/SearchBox";
import MascotSection from "@/components/MascotSection";
import useGameProgress from "@/hooks/useGameProgress";
import { useToast } from "@/hooks/use-toast";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const WEBHOOK_URL = "https://ignatius1325.app.n8n.cloud/webhook-test/a0f7747a-36f0-49cd-a820-27bf8228e192";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const { level, searches, streak, badges, incrementSearch, resetProgress } = useGameProgress();
  const { toast } = useToast();

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setAnswer([]);
    setHasSearched(true);
    
    const prevLevel = level;
    const prevBadges = badges;
    
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: query,
          timestamp: new Date().toISOString(),
          userLevel: level,
          userStreak: streak,
          searchCount: searches + 1,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        incrementSearch();
        
        // Check for level up or new badge animations
        setTimeout(() => {
          if (level > prevLevel) {
            setShowLevelUp(true);
            setTimeout(() => setShowLevelUp(false), 1500);
          }
          if (badges > prevBadges) {
            setShowBadge(true);
            setTimeout(() => setShowBadge(false), 1500);
          }
        }, 100);
        
        // Display only the output field value, formatted as bullet points
        if (data.output) {
          // Clean and format text as bullet points
          let cleanText = data.output
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
            .replace(/&amp;/g, '&') // Replace &amp; with &
            .replace(/&lt;/g, '<') // Replace &lt; with <
            .replace(/&gt;/g, '>') // Replace &gt; with >
            .replace(/&quot;/g, '"') // Replace &quot; with "
            .replace(/&#39;/g, "'") // Replace &#39; with '
            .replace(/\*+/g, '') // Remove asterisks (markdown bold/italic)
            .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove markdown links, keep text
            .replace(/`([^`]+)`/g, '$1') // Remove code backticks, keep text
            .replace(/#{1,6}\s*/g, '') // Remove markdown headers
            .trim(); // Remove extra whitespace
          
          // Split into sentences and create bullet points
          const sentences = cleanText
            .split(/[.!?]+/)
            .map(s => s.trim())
            .filter(s => s.length > 10); // Only keep substantial sentences
          
          setAnswer(sentences);
        } else {
          setAnswer(["No output received from NOVA. Please try again."]);
        }
        
        toast({
          title: "Response Received! 🚀",
          description: "NOVA has processed your question.",
        });
      } else {
        setAnswer(["Sorry, I couldn't process your question. Please try again! 😅"]);
        toast({
          title: "Oops! Something went wrong",
          description: "Please try asking your question again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending question:", error);
      setAnswer(["Connection error! Please check your internet and try again. 🌐"]);
      toast({
        title: "Connection Error",
        description: "Unable to reach NOVA. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="comic-panel bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/40 mx-4 mt-4">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <NovaLogo />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <div className="comic-panel bg-gradient-to-br from-accent/20 to-primary/20 border-accent/40 p-8 mx-4">
            <h1 className="text-6xl md:text-8xl font-black mb-4 transform -rotate-1 text-primary drop-shadow-lg comic-text">
              🚀 NOVA 🎮
            </h1>
            <p className="text-3xl font-black text-secondary transform rotate-1 comic-text">
              ASK! LEARN! WIN! 🏆
            </p>
          </div>
        </div>

        {/* Game Stats */}
        <div className={showLevelUp ? 'level-up-bounce' : ''}>
          <GameStats level={level} searches={searches} streak={streak} badges={badges} showBadgeGlow={showBadge} />
        </div>

        {/* Mascot Section */}
        <MascotSection level={level} streak={streak} />

        {/* Search Box */}
        <SearchBox onSearch={handleSearch} isLoading={isLoading} />

        {/* Answer Section */}
        {hasSearched && (
          <div className="mt-8 max-w-4xl mx-auto">
            <div className="speech-bubble mx-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-4xl">🤖</div>
                <h3 className="text-2xl font-black text-primary transform -rotate-1 comic-text">NOVA Says:</h3>
              </div>
              
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-muted-foreground comic-text">NOVA is thinking...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {answer.map((point, index) => (
                    <div key={index} className="bullet-point">
                      <div className="text-primary font-black text-xl">•</div>
                      <p className="text-foreground leading-relaxed flex-1">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reset Button (for development/testing) */}
        <div className="flex justify-center mt-8">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetProgress}
            className="text-muted-foreground"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Progress
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 mx-4">
          <div className="comic-panel text-center p-6 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/40 hover:scale-105 transition-transform">
            <div className="text-6xl mb-3">🤖</div>
            <h3 className="font-black text-primary text-xl comic-text">SMART AI!</h3>
          </div>
          
          <div className="comic-panel text-center p-6 bg-gradient-to-br from-secondary/20 to-secondary/5 border-secondary/40 hover:scale-105 transition-transform">
            <div className="text-6xl mb-3">🦸</div>
            <h3 className="font-black text-secondary text-xl comic-text">SUPER LEARN!</h3>
          </div>
          
          <div className="comic-panel text-center p-6 bg-gradient-to-br from-accent/20 to-accent/5 border-accent/40 hover:scale-105 transition-transform">
            <div className="text-6xl mb-3">🏅</div>
            <h3 className="font-black text-accent text-xl comic-text">WIN BADGES!</h3>
          </div>
          
          <div className="comic-panel text-center p-6 bg-gradient-to-br from-level/20 to-level/5 border-level/40 hover:scale-105 transition-transform">
            <div className="text-6xl mb-3">📈</div>
            <h3 className="font-black text-level text-xl comic-text">LEVEL UP!</h3>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="comic-panel bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/40 mt-16 py-6 mx-4 mb-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-3xl font-black text-primary comic-text">
            🎮 KEEP LEARNING! 🚀
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
