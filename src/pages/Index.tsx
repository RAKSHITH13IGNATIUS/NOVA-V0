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
  const [answer, setAnswer] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const { level, searches, streak, badges, incrementSearch, resetProgress } = useGameProgress();
  const { toast } = useToast();

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setAnswer("");
    setHasSearched(true);
    
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
        
        // Display only the output field value, stripped of HTML and markdown
        if (data.output) {
          // Strip HTML tags, decode HTML entities, and remove markdown formatting
          const cleanText = data.output
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
            .replace(/&amp;/g, '&') // Replace &amp; with &
            .replace(/&lt;/g, '<') // Replace &lt; with <
            .replace(/&gt;/g, '>') // Replace &gt; with >
            .replace(/&quot;/g, '"') // Replace &quot; with "
            .replace(/&#39;/g, "'") // Replace &#39; with '
            .replace(/\*+/g, '') // Remove asterisks (markdown bold/italic)
            .replace(/^\s*[\*\-\+]\s+/gm, '') // Remove bullet points at start of lines
            .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered list markers
            .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove markdown links, keep text
            .replace(/`([^`]+)`/g, '$1') // Remove code backticks, keep text
            .replace(/#{1,6}\s*/g, '') // Remove markdown headers
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .trim(); // Remove extra whitespace
          setAnswer(cleanText);
        } else {
          setAnswer("No output received from NOVA. Please try again.");
        }
        
        toast({
          title: "Response Received! 🚀",
          description: "NOVA has processed your question.",
        });
      } else {
        setAnswer("Sorry, I couldn't process your question. Please try again! 😅");
        toast({
          title: "Oops! Something went wrong",
          description: "Please try asking your question again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending question:", error);
      setAnswer("Connection error! Please check your internet and try again. 🌐");
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
      <header className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b-4 border-primary/20 shadow-xl">
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
          <h1 className="text-5xl md:text-7xl font-black mb-6 transform -rotate-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-lg">
            🚀 NOVA 🎮
          </h1>
          <p className="text-2xl font-bold text-primary mb-4 transform rotate-1">
            Ask ❓ Learn 🧠 Level Up! 📈
          </p>
        </div>

        {/* Game Stats */}
        <GameStats level={level} searches={searches} streak={streak} badges={badges} />

        {/* Mascot Section */}
        <MascotSection level={level} streak={streak} />

        {/* Search Box */}
        <SearchBox onSearch={handleSearch} isLoading={isLoading} />

        {/* Answer Section */}
        {hasSearched && (
          <div className="mt-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-4 border-primary/30 rounded-3xl p-8 shadow-2xl transform hover:scale-[1.02] transition-transform">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-4xl animate-bounce">🤖</div>
                <h3 className="text-2xl font-black text-primary transform -rotate-1">NOVA Says:</h3>
              </div>
              
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-muted-foreground">NOVA is thinking about your question...</p>
                </div>
              ) : (
                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {answer}
                  </p>
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
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <div className="text-center p-6 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl border-4 border-primary/30 transform hover:scale-105 transition-transform shadow-xl">
            <div className="text-5xl mb-3 animate-bounce">🤖</div>
            <h3 className="font-black text-primary text-xl">Smart AI!</h3>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-2xl border-4 border-secondary/30 transform hover:scale-105 transition-transform shadow-xl">
            <div className="text-5xl mb-3 animate-bounce">🦸</div>
            <h3 className="font-black text-secondary text-xl">Fun Learning!</h3>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl border-4 border-accent/30 transform hover:scale-105 transition-transform shadow-xl">
            <div className="text-5xl mb-3 animate-bounce">🏅</div>
            <h3 className="font-black text-accent text-xl">Win Badges!</h3>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-level/20 to-level/5 rounded-2xl border-4 border-level/30 transform hover:scale-105 transition-transform shadow-xl">
            <div className="text-5xl mb-3 animate-bounce">📈</div>
            <h3 className="font-black text-level text-xl">Level Up!</h3>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-primary/10 to-secondary/10 mt-16 py-8 border-t-4 border-primary/20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-2xl font-bold text-primary">
            🎮 Keep Learning! 🚀
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
