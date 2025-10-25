import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Send, Loader2 } from 'lucide-react';
import { VoiceInput } from '@/components/VoiceInput';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export default function Chat() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadMessages();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error loading messages",
        description: error.message
      });
    } else {
      setMessages((data as ChatMessage[]) || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Save user message
    const { error: userError } = await supabase
      .from('chat_messages')
      .insert({
        user_id: user.id,
        role: 'user',
        content: userMessage
      });

    if (userError) {
      toast({
        variant: "destructive",
        title: "Error sending message",
        description: userError.message
      });
      setIsLoading(false);
      return;
    }

    // Generate AI response (simple mock for now - you can integrate Lovable AI)
    const aiResponse = generateAIResponse(userMessage);

    // Save AI response
    const { error: aiError } = await supabase
      .from('chat_messages')
      .insert({
        user_id: user.id,
        role: 'assistant',
        content: aiResponse
      });

    if (aiError) {
      toast({
        variant: "destructive",
        title: "Error receiving response",
        description: aiError.message
      });
    }

    setIsLoading(false);
    loadMessages();
  };

  const generateAIResponse = (message: string): string => {
    // Simple response logic - can be enhanced with Lovable AI
    const lowercaseMsg = message.toLowerCase();
    
    if (lowercaseMsg.includes('sad') || lowercaseMsg.includes('depressed')) {
      return "I'm here for you. It's okay to feel sad sometimes. Remember that your feelings are valid. Would you like to talk about what's making you feel this way?";
    }
    if (lowercaseMsg.includes('anxious') || lowercaseMsg.includes('worried')) {
      return "It sounds like you're feeling anxious. Try taking a few deep breaths. What specifically is worrying you right now?";
    }
    if (lowercaseMsg.includes('happy') || lowercaseMsg.includes('great')) {
      return "That's wonderful! I'm so glad you're feeling happy. What's bringing you joy today?";
    }
    if (lowercaseMsg.includes('help') || lowercaseMsg.includes('advice')) {
      return "I'm here to support you. Remember: journaling can help process emotions, tracking your mood shows patterns, and self-care is important. How can I help you today?";
    }
    
    return "Thank you for sharing that with me. I'm here to listen and support you on your wellness journey. How are you feeling today?";
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInput(input + ' ' + transcript);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)]">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>AI Wellness Companion</CardTitle>
            <p className="text-sm text-muted-foreground">
              Your supportive AI friend for mental wellness
            </p>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-4">
              {messages.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="mb-2">Welcome! I'm your AI wellness companion.</p>
                  <p>Start a conversation and I'll be here to listen and support you.</p>
                </div>
              )}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                rows={3}
                className="resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <div className="flex gap-2 items-center">
                <VoiceInput onTranscript={handleVoiceTranscript} />
                <Button type="submit" disabled={!input.trim() || isLoading} className="gap-2">
                  <Send className="h-4 w-4" />
                  Send
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}