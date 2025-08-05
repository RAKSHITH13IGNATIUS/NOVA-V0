import { useState } from "react";
import { Search, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface SearchBoxProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

const SearchBox = ({ onSearch, isLoading = false }: SearchBoxProps) => {
  const [query, setQuery] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast({
        title: "Oops!",
        description: "Please enter a question to search for answers!",
        variant: "destructive",
      });
      return;
    }
    onSearch(query.trim());
    setQuery("");
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-bold text-primary">Ask NOVA Anything!</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What would you like to learn today? 🤔"
          className="flex-1 text-lg py-3 border-primary/30 focus:border-primary"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          size="lg"
          disabled={isLoading || !query.trim()}
          className="bg-primary hover:bg-primary-hover text-primary-foreground px-6"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </form>
      
      <p className="text-sm text-muted-foreground mt-3 text-center">
        Ask about science, math, history, or any subject you're curious about! 🚀
      </p>
    </Card>
  );
};

export default SearchBox;