#!/usr/bin/env bash
# update_mindbuddy_files.sh
# Run this from the root of your local mind-buddy project to overwrite/add files.
set -euo pipefail

echo 'Updating files...'

mkdir -p "frontend/src/components/settings"
cat > "frontend/src/components/settings/Settings.tsx" <<'MFB_EOF'
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getJournalEntries } from '@/services/journalService';
import { getCurrentUser } from '@/services/authService';
import ThemeToggle from '@/components/theme/ThemeToggle';

export default function Settings() {
  const [user, setUser] = useState<any>(null);
  const [crisis, setCrisis] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('crisis_contacts') || 'null') || { phone: '', hotline: '' };
    } catch {
      return { phone: '', hotline: '' };
    }
  });

  useEffect(() => {
    (async () => {
      try {
        const profile = await getCurrentUser();
        setUser(profile);
      } catch (e) {
        console.warn('Could not load profile', e);
      }
    })();
  }, []);

  const exportData = async () => {
    try {
      const entries = await getJournalEntries();
      const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mind-buddy-entries.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      alert('Failed to export data.');
      console.error(e);
    }
  };

  const clearSession = () => {
    localStorage.removeItem('token');
    // keep crisis_contacts but clear app-specific session data
    alert('Cleared current session. You will be signed out.');
    window.location.href = '/';
  };

  const saveCrisis = () => {
    localStorage.setItem('crisis_contacts', JSON.stringify(crisis));
    alert('Crisis contacts saved locally.');
  };

  return (
    <div className="p-4">
      <Card className="p-4 mb-4">
        <h3 className="text-lg font-semibold mb-2">Account</h3>
        <div className="text-sm text-muted-foreground mb-2">{user ? `${user.firstName || ''} ${user.lastName || ''} — ${user.email}` : 'Not signed in'}</div>
        <div className="flex gap-2">
          <Button onClick={exportData}>Export my data (JSON)</Button>
          <Button onClick={clearSession} variant="ghost">Sign out / Clear session</Button>
        </div>
      </Card>

      <Card className="p-4 mb-4">
        <h3 className="text-lg font-semibold mb-2">Preferences</h3>
        <div className="flex items-center gap-4">
          <div>Theme</div>
          <ThemeToggle />
        </div>
      </Card>

      <Card className="p-4 mb-4">
        <h3 className="text-lg font-semibold mb-2">Crisis Support (local)</h3>
        <div className="mb-2 text-sm text-muted-foreground">You can store/edit local crisis contacts. In a production app this should be stored server-side in the user's profile.</div>
        <div className="space-y-2">
          <Input placeholder="Local phone number" value={crisis.phone} onChange={(e:any)=>setCrisis({...crisis, phone: e.target.value})} />
          <Input placeholder="Hotline number / org" value={crisis.hotline} onChange={(e:any)=>setCrisis({...crisis, hotline: e.target.value})} />
          <div className="flex gap-2 mt-2">
            <Button onClick={saveCrisis}>Save crisis contacts</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
MFB_EOF

mkdir -p "frontend/src/components/mood"
cat > "frontend/src/components/mood/MoodTracker.tsx" <<'MFB_EOF'
/* Updated MoodTracker.tsx - saves mood entries via API and shows recent entries */
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Calendar, TrendingUp, Save } from "lucide-react";
import { createJournalEntry, getJournalEntries } from "@/services/journalService";

interface MoodEntry {
  id: string;
  date: Date;
  mood: number;
  emoji: string;
  note?: string;
  triggers?: string[];
}

const triggerOptions = ["Work", "Family", "Health", "Sleep", "Other"];

export default function MoodTracker() {
  const [mood, setMood] = useState<number>(3);
  const [note, setNote] = useState<string>("");
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [customTrigger, setCustomTrigger] = useState("");
  const [recentEntries, setRecentEntries] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const entries = await getJournalEntries();
        setRecentEntries(entries);
      } catch (e) {
        console.error("Failed to load recent entries:", e);
      }
    };
    load();
  }, []);

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers(prev =>
      prev.includes(trigger) ? prev.filter(t => t !== trigger) : [...prev, trigger]
    );
  };

  const handleSaveMood = async () => {
    // Prepare triggers array including custom trigger if provided
    let finalTriggers = [...selectedTriggers];
    if (selectedTriggers.includes("Other") && customTrigger.trim()) {
      finalTriggers = finalTriggers.filter(t => t !== "Other");
      finalTriggers.push(customTrigger.trim());
    }

    const moodLabel = `${mood}/5`;
    const entryContent = note ? note : (finalTriggers.length ? `Triggers: ${finalTriggers.join(", ")}` : "");
    const title = `Mood check - ${new Date().toLocaleDateString()}`;

    const payload = {
      title,
      content: entryContent,
      isPrivate: false,
      mood: moodLabel
    };

    try {
      const saved = await createJournalEntry(payload);
      console.log("Saved mood entry:", saved);
      alert("Mood entry saved successfully!");
      // refresh recent entries
      const entries = await getJournalEntries();
      setRecentEntries(entries);
    } catch (err) {
      console.error("Error saving mood entry:", err);
      alert("Failed to save mood entry. See console for details.");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-background to-[hsl(var(--wellness-primary)/0.05)]">
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
          {mood >= 4 ? "😊" : mood === 3 ? "🙂" : mood === 2 ? "😕" : "😔"}
        </div>
      </div>

      <Card className="p-4">
        <div className="mb-4">
          <label className="block text-sm mb-1">Mood (1-5)</label>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Slider value={[mood]} min={1} max={5} step={1} onValueChange={(val:any) => setMood(val[0])} />
            </div>
            <div className="w-16 text-center">{mood}/5</div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Note (optional)</label>
          <Textarea value={note} onChange={(e:any) => setNote(e.target.value)} placeholder="Write anything about your mood..." />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Triggers (optional)</label>
          <div className="flex gap-2 flex-wrap">
            {triggerOptions.map(trigger => (
              <Badge
                key={trigger}
                onClick={() => toggleTrigger(trigger)}
                className={cn("cursor-pointer", selectedTriggers.includes(trigger) ? "bg-muted text-white" : "bg-surface")}
              >
                {trigger}
              </Badge>
            ))}
          </div>
          {selectedTriggers.includes("Other") && (
            <div className="mt-2">
              <input
                value={customTrigger}
                onChange={(e:any) => setCustomTrigger(e.target.value)}
                placeholder="Custom trigger"
                className="w-full px-3 py-2 text-sm border rounded"
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

      <Card className="mt-4">
        <div className="p-4">
          <h3 className="font-semibold mb-2">Recent Entries</h3>
          {recentEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground">No entries yet.</p>
          ) : (
            <div className="space-y-2">
              {recentEntries.slice(0,6).map((entry: any) => (
                <div key={entry.id} className="border rounded p-2">
                  <div className="text-xs text-muted-foreground">{new Date(entry.created_at).toLocaleString()}</div>
                  <div className="font-medium">{entry.title}</div>
                  <div className="text-sm">{entry.content}</div>
                  <div className="text-xs text-muted-foreground">Mood: {entry.mood}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
MFB_EOF

mkdir -p "frontend/src/components/layout"
cat > "frontend/src/components/layout/MentalHealthLayout.tsx" <<'MFB_EOF'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Settings, Heart, BookOpen, Brain, Phone, BarChart3, Crown, LogOut } from "lucide-react";
import MoodTracker from "@/components/mood/MoodTracker";
import Journal from "@/components/journal/Journal";
import Meditation from "@/components/meditation/Meditation";
import CrisisSupport from "@/components/crisis/CrisisSupport";
import ProgressDashboard from "@/components/progress/ProgressDashboard";
import PremiumFeatures from "@/components/premium/PremiumFeatures";
import ThemeToggle from "@/components/theme/ThemeToggle";
import sereniTreeImage from "@/assets/serenity-tree.png";
import { Outlet } from "react-router-dom";
import SettingsComponent from "@/components/settings/Settings";

interface NavItem {
  id: string;
  label: string;
  icon: any;
  key: string;
}

const navItems: NavItem[] = [
  { id: "mood", label: "Mood", icon: Heart, key: "mood" },
  { id: "journal", label: "Journal", icon: BookOpen, key: "journal" },
  { id: "meditation", label: "Meditation", icon: Brain, key: "meditation" },
  { id: "crisis", label: "Crisis Support", icon: Phone, key: "crisis" },
  { id: "progress", label: "Progress", icon: BarChart3, key: "progress" },
  { id: "premium", label: "Premium", icon: Crown, key: "premium" },
  { id: "settings", label: "Settings", icon: Settings, key: "settings" },
];

export default function MentalHealthLayout() {
  const [activeTab, setActiveTab] = useState<string>("mood");
  const [isOpen, setIsOpen] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  return (
    <div className="min-h-screen bg-muted-foreground">
      <div className="flex">
        <nav className="w-64 bg-background border-r p-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`flex items-center gap-3 w-full text-left p-2 rounded ${activeTab === item.key ? 'bg-muted' : ''}`}
              onClick={() => setActiveTab(item.key)}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === "mood" && <MoodTracker />}
          {activeTab === "journal" && <Journal />}
          {activeTab === "meditation" && <Meditation />}
          {activeTab === "crisis" && <CrisisSupport />}
          {activeTab === "progress" && <ProgressDashboard />}
          {activeTab === "premium" && <PremiumFeatures isPremium={isPremium} />}
          {activeTab === "settings" && <SettingsComponent />}
        </main>
      </div>
    </div>
  );
}
MFB_EOF

mkdir -p "frontend/src/services"
cat > "frontend/src/services/journalService.ts" <<'MFB_EOF'
import api from './authService';
import { JournalEntry } from '@/types';

export const getJournalEntries = async (): Promise<JournalEntry[]> => {
  const response = await api.get('/journal/entries');
  return response.data;
};

export const createJournalEntry = async (entry: {
  title: string;
  content: string;
  isPrivate?: boolean;
  mood?: string | number;
}): Promise<JournalEntry> => {
  const response = await api.post('/journal/entries', entry);
  return response.data;
};
MFB_EOF

mkdir -p "frontend/src/components/crisis"
cat > "frontend/src/components/crisis/CrisisSupport.tsx" <<'MFB_EOF'
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MapPin } from 'lucide-react';

export default function CrisisSupport() {
  const [contacts, setContacts] = useState<{phone?:string, hotline?:string}>({});

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('crisis_contacts') || 'null');
      if (saved) setContacts(saved);
      else setContacts({ phone: '+1-800-273-8255', hotline: 'Local emergency services' });
    } catch {
      setContacts({ phone: '+1-800-273-8255', hotline: 'Local emergency services' });
    }
  }, []);

  return (
    <div className="p-4">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">Crisis Support</h3>
        <p className="mb-4 text-sm text-muted-foreground">If you are in immediate danger call local emergency services right away.</p>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Emergency phone</div>
              <div className="font-medium">{contacts.phone}</div>
            </div>
            <Button onClick={()=>{ window.location.href = `tel:${contacts.phone}`; }}><Phone className="w-4 h-4 mr-2"/> Call</Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Hotline / Organization</div>
              <div className="font-medium">{contacts.hotline}</div>
            </div>
            <Button onClick={()=>navigator.clipboard.writeText(contacts.hotline || '')}>Copy</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
MFB_EOF

mkdir -p "backend/routes"
cat > "backend/routes/auth.py" <<'MFB_EOF'
# backend/routes/auth.py
from flask import Blueprint, request, jsonify, current_app
from backend.extensions import db
from backend.models.user import User
import jwt, datetime, traceback
from backend.decorators import token_required
from flask import g

auth = Blueprint("auth", __name__)


def _extract_email_password(data):
    """
    Accepts request JSON shaped as:
      - {"email": "a@b.com", "password": "pw"}
      - {"email": {"email": "a@b.com", "password": "pw"}}  (what your frontend is sending)
      - or other minor variants
    Returns (email, password) or (None, None).
    """
    if not data:
        return None, None

    # If email key holds a nested object with both email & password
    nested = data.get("email")
    if isinstance(nested, dict):
        email = nested.get("email") or nested.get("value")
        password = nested.get("password") or nested.get("passw") or nested.get("pass")
        return (email, password)

    # flat shape
    email = data.get("email") or data.get("username") or data.get("emailAddress")
    password = data.get("password") or data.get("pass")
    return (email, password)


@auth.route("/ping", methods=["GET"])
def ping_auth():
    return jsonify({"message": "auth blueprint is alive"}), 200


@auth.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json(silent=True) or request.form or {}
        email, password = _extract_email_password(data)

        if not email or not password:
            return jsonify({"message": "email and password are required"}), 400

        # basic duplicate check
        if User.query.filter_by(email=email).first():
            return jsonify({"message": "User already exists"}), 400

        # create user: use model's methods to set password
        new_user = User(email=email, first_name="", last_name="", phone=None)
        new_user.set_password(password)

        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User created successfully", "user": new_user.to_dict()}), 201

    except Exception as e:
        current_app.logger.error("Register error: %s\n%s", e, traceback.format_exc())
        return jsonify({"message": "Internal server error"}), 500


@auth.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json(silent=True) or request.form or {}
        email, password = _extract_email_password(data)

        if not email or not password:
            return jsonify({"message": "email and password are required"}), 400

        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return jsonify({"message": "Invalid credentials"}), 401

        secret = current_app.config.get("SECRET_KEY") or "a-very-secret-key-for-dev"
        payload = {
            "user_id": user.id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24),
            "iat": datetime.datetime.utcnow(),
        }

        token = jwt.encode(payload, secret, algorithm="HS256")
        if isinstance(token, bytes):
            token = token.decode("utf-8")

        return jsonify({"token": token, "user": user.to_dict()}), 200

    except Exception as e:
        current_app.logger.error("Login error: %s\n%s", e, traceback.format_exc())
        return jsonify({"message": "Internal server error"}), 500


@auth.route("/profile", methods=["GET"])
@token_required
def profile():
    """Return the current authenticated user's profile."""
    try:
        from flask import g
        if hasattr(g, 'current_user'):
            return jsonify(g.current_user.to_dict()), 200
        else:
            return jsonify({'message': 'User not found'}), 404
    except Exception as e:
        current_app.logger.error("Profile error: %s", e)
        return jsonify({'message': 'Internal server error'}), 500

MFB_EOF

mkdir -p "backend"
cat > "backend/SECURITY.md" <<'MFB_EOF'
# Security guidelines for Mind Buddy backend (summary)

- Password storage: use bcrypt (already implemented). Ensure `bcrypt.generate_password_hash` is used and never store plaintext passwords.
- Secret management: keep `Config.SECRET_KEY` out of repository and set via environment variable. Do **not** use the default secret in production.
- Token policy: JWT tokens are signed with HS256. Use short-ish expiry (e.g., 1h) for access tokens and refresh tokens if needed.
- Rate limiting: add rate limits on auth endpoints (login/register) to prevent brute force.
- Input validation: validate and sanitize inputs at the API boundary (especially registration and journal content).
- Database rules:
  - Use proper foreign keys (already present), and ensure rows are queried by `user_id` to avoid leaking other users' data.
  - Migrate schema with Alembic for controlled changes (migrations/ present).
- Transport: enforce HTTPS in production; configure CORS only for known origins.
- Logging: avoid logging sensitive data (passwords, tokens).
- Session policy: on logout, delete token client-side and optionally implement server-side token blacklist if needed.
MFB_EOF

echo 'All files written. Please run your usual install/build steps (npm install, backend env, etc.)'
