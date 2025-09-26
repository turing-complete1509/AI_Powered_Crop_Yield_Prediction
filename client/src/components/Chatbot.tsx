import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Bot, X, Maximize, Minimize } from "lucide-react";

interface Message {
  id: number;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
  location?: string;
  crop?: string;
}

const sendChatMessage = async (payload: { message: string; location: string }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const Chatbot = ({ isOpen, onToggle, location, crop }: ChatbotProps) => {
  const { t } = useTranslation();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: t('chatbot.welcomeMessageWithContext', { crop: crop || 'your crop', location: location || 'your location' }),
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const chatMutation = useMutation({
    mutationFn: sendChatMessage,
    onSuccess: (data) => {
      const botResponse: Message = { id: Date.now(), content: data.reply, sender: "bot", timestamp: new Date() };
      setMessages(prev => [...prev.filter(m => !m.isTyping), botResponse]);
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      const errorResponse: Message = { id: Date.now(), content: "Sorry, I'm having trouble connecting. Please try again later.", sender: "bot", timestamp: new Date() };
      setMessages(prev => [...prev.filter(m => !m.isTyping), errorResponse]);
    }
  });

  useEffect(() => {
    if (chatMutation.isPending) {
      const typingMessage: Message = { id: Date.now(), content: "Bot is typing...", sender: "bot", timestamp: new Date(), isTyping: true };
      setMessages(prev => [...prev, typingMessage]);
    }
  }, [chatMutation.isPending]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    const userMessage: Message = { id: Date.now(), content: inputMessage, sender: "user", timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate({ message: inputMessage, location: location || "an unknown location" });
    setInputMessage("");
  };

  return (
    <>
      <Button onClick={onToggle} className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full" size="icon">
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </Button>

      {isOpen && isMaximized && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => setIsMaximized(false)}
        />
      )}
      
      {isOpen && (
        <Card className={`fixed z-50 shadow-xl flex flex-col transition-all duration-300 ease-in-out ${
            isMaximized
              ? 'inset-5 rounded-xl'
              // --- THIS IS THE CHANGED LINE ---
              : 'bottom-24 right-6 w-full max-w-md h-[33rem] rounded-lg'
          }`}>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="w-5 h-5 text-primary" />
              {t('chatbot.title')}
            </CardTitle>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsMaximized(!isMaximized)}>
                {isMaximized ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onToggle}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex flex-col flex-1 overflow-hidden">
            <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
              <div className="space-y-4 pb-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`p-3 rounded-lg ${isMaximized ? 'max-w-2xl' : 'max-w-xs'} ${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      <div className="text-sm">
                        {message.isTyping ? "..." : (
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder={t('chatbot.placeholder')}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !chatMutation.isPending && sendMessage()}
                  disabled={chatMutation.isPending}
                />
                <Button onClick={sendMessage} disabled={!inputMessage.trim() || chatMutation.isPending} size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Chatbot;