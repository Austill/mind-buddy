/**
 * ChatWidget Component - AI Assistant (Sereni) Interface
 * 
 * This is a floating chat widget that allows users to talk with Sereni,
 * an AI-powered mental wellness assistant. The widget can be:
 * - Minimized (just a button)
 * - Open (full chat interface)
 * - Showing crisis alerts when detected
 * 
 * Features:
 * - Real-time AI responses
 * - Conversation history
 * - Crisis detection and resources
 * - Sentiment-aware responses
 * - Smooth animations
 */

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  X, 
  Send, 
  Loader2,
  Sparkles,
  MinusCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  sendChatMessage, 
  getProactiveCheckIn,
  type ChatResponse
} from '@/services/aiService';

/**
 * Display format for a single message in the chat
 */
interface DisplayMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  sentiment?: string;
}

export default function ChatWidget() {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  
  // Controls whether chat is open or minimized
  const [isOpen, setIsOpen] = useState(false);
  
  // Current conversation ID (persists across messages)
  const [conversationId, setConversationId] = useState<string | undefined>();
  
  // All messages in current conversation
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  
  // Current message being typed by user
  const [currentMessage, setCurrentMessage] = useState('');
  
  // Loading state while waiting for AI response
  const [isLoading, setIsLoading] = useState(false);
  
  // Toast notifications for errors/success
  const { toast } = useToast();
  
  // Reference to scroll area to auto-scroll to new messages
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Reference to textarea for auto-focus
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ==========================================
  // EFFECTS
  // ==========================================

  /**
   * Auto-scroll to bottom when new messages arrive
   * This ensures users always see the latest message
   */
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  /**
   * Get proactive check-in message when chat is first opened
   * This makes Sereni feel more welcoming and personalized
   */
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      loadProactiveCheckIn();
    }
  }, [isOpen]);

  /**
   * Auto-focus on textarea when chat opens
   * Improves UX by letting user start typing immediately
   */
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  // ==========================================
  // HANDLERS
  // ==========================================

  /**
   * Load a proactive check-in message from Sereni
   * This personalizes the greeting based on user's recent mood patterns
   */
  const loadProactiveCheckIn = async () => {
    try {
      const checkIn = await getProactiveCheckIn();
      
      // Add Sereni's greeting as first message
      const greetingMessage: DisplayMessage = {
        id: 'check-in-' + Date.now(),
        content: checkIn.message,
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages([greetingMessage]);
    } catch (error) {
      console.error('Failed to load check-in:', error);
      
      // Fallback greeting if API fails
      const fallbackMessage: DisplayMessage = {
        id: 'fallback-' + Date.now(),
        content: "Hi! I'm Sereni, your mental wellness companion. How can I support you today?",
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages([fallbackMessage]);
    }
  };

  /**
   * Send user's message to AI and get response
   * Handles the complete message flow including error states
   */
  const handleSendMessage = async () => {
    // Validation: don't send empty messages
    if (!currentMessage.trim()) {
      return;
    }

    // Create user message object
    const userMessage: DisplayMessage = {
      id: 'user-' + Date.now(),
      content: currentMessage.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    // Optimistically add user message to UI immediately
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input field
    const messageToSend = currentMessage.trim();
    setCurrentMessage('');

    // Show loading state
    setIsLoading(true);

    try {
      // Call AI service to get Sereni's response
      const response: ChatResponse = await sendChatMessage(
        messageToSend,
        conversationId
      );

      // Store conversation ID for future messages
      if (!conversationId) {
        setConversationId(response.conversation_id);
      }

      // Create AI response message
      const aiMessage: DisplayMessage = {
        id: response.chat_id,
        content: response.ai_response,
        role: 'assistant',
        timestamp: new Date(),
        sentiment: response.sentiment,
      };

      // Add AI response to chat
      setMessages(prev => [...prev, aiMessage]);

      // If crisis detected, show alert
      if (response.requires_professional_help) {
        toast({
          title: "Crisis Support Available",
          description: "If you're in crisis, please reach out to: National Suicide Prevention Lifeline: 988",
          variant: "destructive",
          duration: 10000,
        });
      }

      // Notify if AI used fallback (model might be slow)
      if (response.source === 'fallback') {
        toast({
          title: 'Using backup response',
          description: 'AI model is warming up, responses may be slower.',
          duration: 3000,
        });
      }

    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Show error toast to user
      toast({
        title: 'Failed to send message',
        description: 'Please try again. If the issue persists, check your connection.',
        variant: 'destructive',
      });

      // Add error message to chat
      const errorMessage: DisplayMessage = {
        id: 'error-' + Date.now(),
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle Enter key to send message
   * Shift+Enter creates new line, Enter alone sends
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent new line
      handleSendMessage();
    }
  };

  // ==========================================
  // RENDER: MINIMIZED STATE (Floating Button)
  // ==========================================
  
  if (!isOpen) {
    return (
      <>
        {/* Floating chat button - bottom right corner */}
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-[hsl(var(--wellness-primary))] hover:bg-[hsl(var(--wellness-primary))] hover:scale-110 transition-all z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      </>
    );
  }

  // ==========================================
  // RENDER: OPEN STATE (Chat Interface)
  // ==========================================

  return (
    <>
      {/* Main Chat Widget Card */}
      <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col">
        {/* Header - Title and controls */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-[hsl(var(--wellness-primary)/0.1)] to-[hsl(var(--wellness-secondary)/0.1)]">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-[hsl(var(--wellness-primary))]" />
            <div>
              <h3 className="font-semibold text-lg">Sereni</h3>
              <p className="text-xs text-muted-foreground">
                Your AI Wellness Companion
              </p>
            </div>
          </div>
          
          {/* Control buttons */}
          <div className="flex items-center space-x-2">
            {/* Minimize button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <MinusCircle className="h-4 w-4" />
            </Button>
            
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsOpen(false);
              }}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area - Scrollable chat history */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-[hsl(var(--wellness-primary))] text-white'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Loading indicator when waiting for AI response */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area - Message composition */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            {/* Message input textarea */}
            <Textarea
              ref={textareaRef}
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... (Press Enter to send)"
              className="min-h-[60px] max-h-[120px] resize-none"
              disabled={isLoading}
            />
            
            {/* Send button */}
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !currentMessage.trim()}
              className="bg-[hsl(var(--wellness-primary))] hover:bg-[hsl(var(--wellness-primary))]"
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {/* Helper text */}
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </Card>
    </>
  );
}
