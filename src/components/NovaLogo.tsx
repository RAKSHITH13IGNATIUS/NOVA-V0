import { Sparkles } from "lucide-react";

const NovaLogo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-primary-foreground" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-background"></div>
      </div>
      <div className="text-2xl font-bold">
        <span className="text-primary">NO</span>
        <span className="text-secondary">VA</span>
      </div>
    </div>
  );
};

export default NovaLogo;