import novaMascot from "@/assets/nova-mascot.png";

interface MascotSectionProps {
  level: number;
  streak: number;
}

const MascotSection = ({ level, streak }: MascotSectionProps) => {
  const getMascotMessage = () => {
    if (streak > 7) {
      return "Wow! You're on fire! 🔥 Your dedication is incredible!";
    } else if (streak > 3) {
      return "Great streak going! 🌟 Keep up the amazing work!";
    } else if (level > 5) {
      return "Look at you go! 🚀 You're becoming a learning champion!";
    } else if (level > 2) {
      return "You're making excellent progress! 📚 Keep exploring!";
    }
    return "Hello there! 👋 I'm NOVA, your friendly learning companion!";
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
      <div className="relative">
        <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 p-4 shadow-lg">
          <img 
            src={novaMascot} 
            alt="NOVA - Your Learning Assistant" 
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        {streak > 0 && (
          <div className="absolute -top-2 -right-2 bg-streak text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
            🔥 {streak}
          </div>
        )}
      </div>
      
      <div className="flex-1 text-center md:text-left">
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-primary/20 relative">
          <div className="absolute -left-3 top-6 w-6 h-6 bg-white border-l-2 border-b-2 border-primary/20 transform rotate-45 hidden md:block"></div>
          <p className="text-lg text-gray-700 leading-relaxed">
            {getMascotMessage()}
          </p>
          <div className="mt-4 text-sm text-muted-foreground">
            Ready to learn something amazing today? 🎓
          </div>
        </div>
      </div>
    </div>
  );
};

export default MascotSection;