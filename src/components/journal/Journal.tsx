import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { 
  Save, 
  Lock, 
  Unlock, 
  Search, 
  Calendar,
  BookOpen,
  Brain,
  Sparkles,
  Eye,
  EyeOff
} from "lucide-react";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: Date;
  isPrivate: boolean;
  aiInsights?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  tags?: string[];
}

const mockEntries: JournalEntry[] = [
  {
    id: "1",
    title: "A Great Day at Work",
    content: "Today was really productive. I finished the presentation and got positive feedback from my manager. Feeling accomplished and confident about tomorrow's meeting.",
    date: new Date(Date.now() - 86400000),
    isPrivate: false,
    sentiment: 'positive',
    aiInsights: "Your entry shows strong positive sentiment and accomplishment. Consider maintaining this momentum by setting clear goals for tomorrow.",
    tags: ["work", "accomplishment", "confidence"]
  },
  {
    id: "2",
    title: "Feeling Overwhelmed",
    content: "Had trouble sleeping last night, worried about the upcoming deadline. Need to find better ways to manage stress and anxiety.",
    date: new Date(Date.now() - 172800000),
    isPrivate: true,
    sentiment: 'negative',
    aiInsights: "Your entry indicates stress and sleep concerns. Consider practicing relaxation techniques before bed and breaking down large tasks into smaller, manageable steps.",
    tags: ["stress", "sleep", "anxiety", "deadlines"]
  }
];

export default function Journal() {
  const [entries] = useState<JournalEntry[]>(mockEntries);
  const [currentEntry, setCurrentEntry] = useState({
    title: "",
    content: "",
    isPrivate: false
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(true);

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveEntry = async () => {
    if (!currentEntry.title.trim() || !currentEntry.content.trim()) {
      alert("Please fill in both title and content");
      return;
    }

    // Simulate AI sentiment analysis
    const sentiment = analyzeSentiment(currentEntry.content);
    const aiInsights = generateAIInsights(currentEntry.content, sentiment);

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: currentEntry.title,
      content: currentEntry.content,
      date: new Date(),
      isPrivate: currentEntry.isPrivate,
      sentiment,
      aiInsights,
      tags: extractTags(currentEntry.content)
    };

    console.log("Saving journal entry:", newEntry);
    // Here you would save to Supabase with encryption for private entries

    // Reset form
    setCurrentEntry({ title: "", content: "", isPrivate: false });
    setIsWriting(false);
    
    alert("Journal entry saved successfully!");
  };

  // Simple sentiment analysis simulation
  const analyzeSentiment = (text: string): 'positive' | 'neutral' | 'negative' => {
    const positiveWords = ['good', 'great', 'happy', 'accomplished', 'confident', 'excited', 'love', 'wonderful'];
    const negativeWords = ['bad', 'sad', 'worried', 'anxious', 'overwhelmed', 'stressed', 'angry', 'frustrated'];
    
    const words = text.toLowerCase().split(/\s+/);
    const positiveCount = words.filter(word => positiveWords.some(pw => word.includes(pw))).length;
    const negativeCount = words.filter(word => negativeWords.some(nw => word.includes(nw))).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  const generateAIInsights = (content: string, sentiment: string): string => {
    const insights = {
      positive: [
        "Your entry shows strong positive sentiment. Consider maintaining this momentum by continuing the practices that led to these feelings.",
        "Great to see such optimism! This positive mindset can help you tackle future challenges.",
        "Your positive outlook is evident. Try to remember this feeling during more difficult times."
      ],
      negative: [
        "Your entry indicates some challenges. Consider practicing mindfulness or reaching out to someone you trust.",
        "It's normal to have difficult days. Remember that these feelings are temporary and will pass.",
        "Consider breaking down overwhelming tasks into smaller, manageable steps to reduce stress."
      ],
      neutral: [
        "Your entry shows balanced reflection. Consider what small changes might enhance your wellbeing.",
        "Neutral days are part of life's natural rhythm. Notice what might shift your energy positively.",
        "This seems like a day of steady progress. Consider celebrating small wins along the way."
      ]
    };
    
    const options = insights[sentiment as keyof typeof insights];
    return options[Math.floor(Math.random() * options.length)];
  };

  const extractTags = (content: string): string[] => {
    const commonTags = ['work', 'family', 'health', 'stress', 'happiness', 'goals', 'relationships', 'anxiety', 'accomplishment'];
    return commonTags.filter(tag => 
      content.toLowerCase().includes(tag) || 
      content.toLowerCase().includes(tag + 's') ||
      content.toLowerCase().includes(tag + 'ed')
    ).slice(0, 3);
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return 'hsl(var(--mood-good))';
      case 'negative': return 'hsl(var(--mood-low))';
      default: return 'hsl(var(--mood-neutral))';
    }
  };

  if (isWriting) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">New Journal Entry</h2>
            <Button
              variant="outline"
              onClick={() => setIsWriting(false)}
            >
              Back to Journal
            </Button>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                placeholder="Give your entry a title..."
                value={currentEntry.title}
                onChange={(e) => setCurrentEntry(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium mb-2">Your thoughts</label>
              <Textarea
                placeholder="Write about your day, feelings, thoughts, or anything on your mind..."
                value={currentEntry.content}
                onChange={(e) => setCurrentEntry(prev => ({ ...prev, content: e.target.value }))}
                className="min-h-[300px] resize-none"
              />
            </div>

            {/* Privacy Toggle */}
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentEntry(prev => ({ ...prev, isPrivate: !prev.isPrivate }))}
                className={cn(
                  "flex items-center space-x-2",
                  currentEntry.isPrivate && "bg-[hsl(var(--wellness-calm))] text-white"
                )}
              >
                {currentEntry.isPrivate ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                <span>{currentEntry.isPrivate ? "Private Entry" : "Regular Entry"}</span>
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentEntry.isPrivate ? "Encrypted and visible only to you" : "Regular journal entry"}
              </span>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSaveEntry}
              className="w-full bg-[hsl(var(--wellness-primary))] hover:bg-[hsl(var(--wellness-primary))] text-white"
              size="lg"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Entry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-br from-background to-[hsl(var(--wellness-secondary)/0.05)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Personal Journal</h2>
            <p className="text-muted-foreground">
              Reflect on your thoughts and track your mental wellness journey
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowAIInsights(!showAIInsights)}
              className="flex items-center space-x-2"
            >
              {showAIInsights ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>AI Insights</span>
            </Button>
            <Button
              onClick={() => setIsWriting(true)}
              className="bg-[hsl(var(--wellness-primary))] hover:bg-[hsl(var(--wellness-primary))] text-white"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              New Entry
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search your journal entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </Card>

      {/* Journal Entries */}
      <div className="space-y-4">
        {filteredEntries.map((entry) => (
          <Card key={entry.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-semibold">{entry.title}</h3>
                {entry.isPrivate && (
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <Lock className="w-3 h-3" />
                    <span>Private</span>
                  </Badge>
                )}
                {entry.sentiment && (
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getSentimentColor(entry.sentiment) }}
                    title={`Sentiment: ${entry.sentiment}`}
                  />
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{entry.date.toLocaleDateString()}</span>
              </div>
            </div>

            <p className="text-muted-foreground mb-4 line-clamp-3">
              {entry.content}
            </p>

            {entry.tags && entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {entry.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {showAIInsights && entry.aiInsights && (
              <Alert className="mt-4 bg-gradient-to-r from-[hsl(var(--wellness-primary)/0.05)] to-[hsl(var(--wellness-secondary)/0.05)] border-[hsl(var(--wellness-primary)/0.2)]">
                <Brain className="h-4 w-4" />
                <AlertDescription className="flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 mt-0.5 text-[hsl(var(--wellness-primary))]" />
                  <span>{entry.aiInsights}</span>
                </AlertDescription>
              </Alert>
            )}
          </Card>
        ))}

        {filteredEntries.length === 0 && (
          <Card className="p-12 text-center">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No entries found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Try adjusting your search terms" : "Start your journaling journey by writing your first entry"}
            </p>
            <Button 
              onClick={() => setIsWriting(true)}
              className="bg-[hsl(var(--wellness-primary))] hover:bg-[hsl(var(--wellness-primary))] text-white"
            >
              Write Your First Entry
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}