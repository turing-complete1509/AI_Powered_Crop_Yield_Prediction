import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Bot, User, X } from "lucide-react";

interface Message {
  id: number;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
  location?: string;
  crop?: string;
}

const Chatbot = ({ isOpen, onToggle, location, crop }: ChatbotProps) => {
  const { t } = useTranslation();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: t('chatbot.welcomeMessageWithContext', { crop, location }),
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    const userMessage: Message = { id: Date.now(), content: inputMessage, sender: "user", timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setTimeout(() => {
      const botResponse: Message = { id: Date.now() + 1, content: "This is a simulated response.", sender: "bot", timestamp: new Date() };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
    setInputMessage("");
  };

  return (
    <>
      <Button onClick={onToggle} className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full" size="icon">
        <MessageCircle className="w-6 h-6" />
      </Button>
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-96 z-50 shadow-card">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="w-5 h-5 text-primary" />
              {t('chatbot.title')}
            </CardTitle>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onToggle}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 flex flex-col h-full">
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-4 pb-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`p-3 rounded-lg ${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-gradient-subtle border"}`}>
                      <p className="text-sm">{message.content}</p>
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
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <Button onClick={sendMessage} disabled={!inputMessage.trim()} size="icon">
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