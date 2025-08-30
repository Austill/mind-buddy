import { useState } from "react";
import { Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Heart, 
  BookOpen, 
  Brain, 
  Phone, 
  BarChart3, 
  Settings,
  Menu,
  X
} from "lucide-react";
import MoodTracker from "@/components/mood/MoodTracker";
import Journal from "@/components/journal/Journal";
import Meditation from "@/components/meditation/Meditation";
import CrisisSupport from "@/components/crisis/CrisisSupport";
import ProgressDashboard from "@/components/progress/ProgressDashboard";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  { id: "mood", label: "Mood Check", icon: <Heart className="w-5 h-5" />, path: "/mood" },
  { id: "journal", label: "Journal", icon: <BookOpen className="w-5 h-5" />, path: "/journal" },
  { id: "meditation", label: "Meditate", icon: <Brain className="w-5 h-5" />, path: "/meditation" },
  { id: "crisis", label: "Crisis Support", icon: <Phone className="w-5 h-5" />, path: "/crisis" },
  { id: "progress", label: "Progress", icon: <BarChart3 className="w-5 h-5" />, path: "/progress" },
];

export default function MentalHealthLayout() {
  const [activeTab, setActiveTab] = useState("mood");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[hsl(var(--wellness-primary))] to-[hsl(var(--wellness-secondary))] flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-[hsl(var(--wellness-primary))] to-[hsl(var(--wellness-secondary))] bg-clip-text text-transparent">
                MindWell
              </h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="container mx-auto px-4 py-2">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className={cn(
                    "justify-start space-x-2",
                    activeTab === item.id && "bg-[hsl(var(--wellness-primary))] hover:bg-[hsl(var(--wellness-primary))]"
                  )}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {item.icon}
                  <span className="text-sm">{item.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Navigation */}
      <div className="hidden md:block bg-background/50 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 py-2">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={cn(
                  "space-x-2",
                  activeTab === item.id && "bg-[hsl(var(--wellness-primary))] hover:bg-[hsl(var(--wellness-primary))]"
                )}
                onClick={() => setActiveTab(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {activeTab === "mood" && <MoodTracker />}
          {activeTab === "journal" && <Journal />}
          {activeTab === "meditation" && <Meditation />}
          {activeTab === "crisis" && <CrisisSupport />}
          {activeTab === "progress" && <ProgressDashboard />}
        </div>
      </main>
    </div>
  );
}