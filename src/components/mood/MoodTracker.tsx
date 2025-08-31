import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Calendar, TrendingUp, Save } from "lucide-react";

interface MoodEntry {
  id: string;
  date: Date;
  mood: number;
  emoji: string;
  note?: string;
  triggers?: string[];
}

const moodEmojis = [
  { value: 1, emoji: "😢", label: "Very Low", color: "hsl(var(--mood-poor))" },
  { value: 2, emoji: "😕", label: "Low", color: "hsl(var(--mood-low))" },
  { value: 3, emoji: "😐", label: "Neutral", color: "hsl(var(--mood-neutral))" },
  { value: 4, emoji: "😊", label: "Good", color: "hsl(var(--mood-good))" },
  { value: 5, emoji: "😃", label: "Excellent", color: "hsl(var(--mood-excellent))" },
];

const commonTriggers = [
  "Work stress", "Sleep issues", "Social interaction", "Exercise", 
  "Weather", "Family", "Health", "Financial concerns", "Relationships", "Other"
];

export default function MoodTracker() {
  const [currentMood, setCurrentMood] = useState([3]);
  const [note, setNote] = useState("");
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [customTrigger, setCustomTrigger] = useState("");
  const [recentEntries] = useState<MoodEntry[]>([
    {
      id: "1",
      date: new Date(Date.now() - 86400000),
      mood: 4,
      emoji: "😊",
      note: "Had a good day at work, feeling accomplished",
      triggers: ["Work stress", "Exercise"]
    },
    {
      id: "2", 
      date: new Date(Date.now() - 172800000),
      mood: 2,
      emoji: "😕",
      note: "Feeling a bit overwhelmed",
      triggers: ["Sleep issues", "Work stress"]
    }
  ]);

  const currentMoodData = moodEmojis.find(m => m.value === currentMood[0]) || moodEmojis[2];

  const handleTriggerToggle = (trigger: string) => {
    setSelectedTriggers(prev => 
      prev.includes(trigger)
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    );
  };

  const handleSaveMood = () => {
    // Prepare triggers array including custom trigger if provided
    let finalTriggers = [...selectedTriggers];
    if (selectedTriggers.includes("Other") && customTrigger.trim()) {
      finalTriggers = finalTriggers.filter(t => t !== "Other");
      finalTriggers.push(customTrigger.trim());
    }
    
    const entry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date(),
      mood: currentMood[0],
      emoji: currentMoodData.emoji,
      note: note.trim() || undefined,
      triggers: finalTriggers.length > 0 ? finalTriggers : undefined
    };
    
    console.log("Saving mood entry:", entry);
    // Here you would save to Supabase
    
    // Reset form
    setNote("");
    setSelectedTriggers([]);
    setCustomTrigger("");
    
    // Show success message
    alert("Mood entry saved successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Today's Mood Check-in */}
      <Card className="p-6 bg-gradient-to-br from-background to-[hsl(var(--wellness-primary)/0.05)]">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">How are you feeling today?</h2>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Mood Emoji Display */}
        <div className="text-center mb-8">
          <div className="text-8xl mb-4 animate-pulse">
            {currentMoodData.emoji}
          </div>
          <h3 className="text-xl font-semibold" style={{ color: currentMoodData.color }}>
            {currentMoodData.label}
          </h3>
        </div>

        {/* Mood Slider */}
        <div className="mb-8">
          <div className="mb-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>😢 Very Low</span>
              <span>😃 Excellent</span>
            </div>
            <Slider
              value={currentMood}
              onValueChange={setCurrentMood}
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
          </div>
          
          {/* Emoji Scale */}
          <div className="flex justify-between">
            {moodEmojis.map((mood) => (
              <Button
                key={mood.value}
                variant="ghost"
                size="sm"
                className={cn(
                  "text-2xl p-2 rounded-full transition-all",
                  currentMood[0] === mood.value && "bg-primary/10 scale-110"
                )}
                onClick={() => setCurrentMood([mood.value])}
              >
                {mood.emoji}
              </Button>
            ))}
          </div>
        </div>

        {/* Mood Note */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            What's on your mind? (Optional)
          </label>
          <Textarea
            placeholder="Share your thoughts, feelings, or what happened today..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>

        {/* Triggers */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">
            What influenced your mood today?
          </label>
          <div className="flex flex-wrap gap-2">
            {commonTriggers.map((trigger) => (
              <Badge
                key={trigger}
                variant={selectedTriggers.includes(trigger) ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-all hover:scale-105",
                  selectedTriggers.includes(trigger) && 
                  "bg-[hsl(var(--wellness-primary))] hover:bg-[hsl(var(--wellness-primary))]"
                )}
                onClick={() => handleTriggerToggle(trigger)}
              >
                {trigger}
              </Badge>
            ))}
          </div>
          
          {/* Custom Trigger Input */}
          {selectedTriggers.includes("Other") && (
            <div className="mt-3">
              <input
                type="text"
                placeholder="Describe what else influenced your mood..."
                value={customTrigger}
                onChange={(e) => setCustomTrigger(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
          )}
        </div>

        {/* Save Button */}
        <Button 
          onClick={handleSaveMood}
          className="w-full bg-[hsl(var(--wellness-primary))] hover:bg-[hsl(var(--wellness-primary))] text-white"
          size="lg"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Today's Mood
        </Button>
      </Card>

      {/* Recent Entries */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Entries</h3>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            View All
          </Button>
        </div>

        <div className="space-y-3">
          {recentEntries.map((entry) => (
            <div key={entry.id} className="flex items-start space-x-4 p-3 rounded-lg bg-muted/30">
              <div className="text-2xl">{entry.emoji}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">
                    {moodEmojis.find(m => m.value === entry.mood)?.label}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {entry.date.toLocaleDateString()}
                  </span>
                </div>
                {entry.note && (
                  <p className="text-sm text-muted-foreground mb-2">{entry.note}</p>
                )}
                {entry.triggers && (
                  <div className="flex flex-wrap gap-1">
                    {entry.triggers.map((trigger) => (
                      <Badge key={trigger} variant="secondary" className="text-xs">
                        {trigger}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}