import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Brain,
  Lightbulb,
  Target,
  TrendingUp,
  FileText,
  Zap,
} from "lucide-react";
const genAI = new GoogleGenerativeAI("YOUR_GEMINI_API_KEY"); // Your exposed key!
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateContent(prompt) {
  const result = await model.generateContent(prompt);
  return result.response.text(); // Gemini’s answer as a string
}
export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "assistant",
      content:
        "Hi! I'm your AI Portfolio Assistant. I can help you write compelling content, suggest improvements, and optimize your portfolio for better visibility. What would you like to work on?",
      timestamp: new Date(),
    },
  ]);

  const quickActions = [
    {
      id: "bio",
      label: "Write Bio",
      icon: FileText,
      description: "Create a compelling About Me section",
    },
    {
      id: "skills",
      label: "Suggest Skills",
      icon: Target,
      description: "Recommend skills based on your field",
    },
    {
      id: "projects",
      label: "Improve Projects",
      icon: Lightbulb,
      description: "Enhance project descriptions",
    },
    {
      id: "trends",
      label: "Industry Trends",
      icon: TrendingUp,
      description: "Latest industry insights",
    },
  ];




  const suggestions = [
    {
      type: "content",
      title: "Enhance Your About Section",
      description:
        "Your About Me could be more engaging. Add personality and passion!",
      action: "Rewrite with AI",
      priority: "high",
    },
    {
      type: "skills",
      title: "Add Trending Skills",
      description:
        "Machine Learning and Docker are trending in your field.",
      action: "Add Skills",
      priority: "medium",
    },
    {
      type: "seo",
      title: "SEO Optimization",
      description:
        "Your portfolio could rank better with keyword optimization.",
      action: "Optimize",
      priority: "low",
    },
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      type: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: "assistant",
        content: generateAIResponse(message),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const generateAIResponse = (userMessage: string) => {
    const responses = [
      "I'd be happy to help you with that! Let me analyze your current portfolio and provide some personalized suggestions.",
      "Great question! Based on current industry trends, here's what I recommend...",
      "I can definitely assist with that. Let me create some content options for you to choose from.",
      "That's a smart approach! Here are some ways to make that section more impactful...",
    ];
    return responses[
      Math.floor(Math.random() * responses.length)
    ];
  };

  const handleQuickAction = (actionId: string) => {
    const actionMessages = {
      bio: "I'll help you write a compelling bio. What's your background and what are you passionate about in your field?",
      skills:
        "Based on your profile, I recommend adding these trending skills: Machine Learning, Docker, Kubernetes, and GraphQL. Should I add these to your portfolio?",
      projects:
        "Let me review your projects and suggest improvements. I can help make your descriptions more impactful and highlight key achievements.",
      trends:
        "Here are the top trending skills in your field: 1) AI/ML (95% demand increase), 2) Cloud Computing (80% increase), 3) DevOps (75% increase). Want to learn more about any of these?",
    };

    const aiMessage = {
      id: Date.now(),
      type: "assistant",
      content:
        actionMessages[actionId] ||
        "I'm here to help! What would you like to know?",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setActiveTab("chat");
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full gradient-primary text-white shadow-lg z-50"
      >
        <Brain className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[600px] glass border-0 shadow-2xl z-50 flex flex-col">
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm">
                AI Assistant
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Portfolio Helper
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-3">
          <Button
            variant={activeTab === "chat" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("chat")}
            className={
              activeTab === "chat"
                ? "gradient-secondary text-white"
                : ""
            }
          >
            <MessageCircle className="w-3 h-3 mr-1" />
            Chat
          </Button>
          <Button
            variant={
              activeTab === "suggestions" ? "default" : "ghost"
            }
            size="sm"
            onClick={() => setActiveTab("suggestions")}
            className={
              activeTab === "suggestions"
                ? "gradient-secondary text-white"
                : ""
            }
          >
            <Lightbulb className="w-3 h-3 mr-1" />
            Suggestions
          </Button>
          <Button
            variant={
              activeTab === "quick" ? "default" : "ghost"
            }
            size="sm"
            onClick={() => setActiveTab("quick")}
            className={
              activeTab === "quick"
                ? "gradient-secondary text-white"
                : ""
            }
          >
            <Zap className="w-3 h-3 mr-1" />
            Quick
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 flex flex-col">
        {activeTab === "chat" && (
          <>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.type === "user"
                          ? "gradient-primary text-white"
                          : "glass border border-border"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask me anything about your portfolio..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleSendMessage()
                  }
                  className="glass border-0"
                />
                <Button
                  size="sm"
                  onClick={handleSendMessage}
                  className="gradient-primary text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}

        {activeTab === "suggestions" && (
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <Card key={index} className="glass border-0">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm">
                        {suggestion.title}
                      </h4>
                      <Badge
                        variant="secondary"
                        className={
                          suggestion.priority === "high"
                            ? "bg-red-500/20 text-red-400"
                            : suggestion.priority === "medium"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-green-500/20 text-green-400"
                        }
                      >
                        {suggestion.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      {suggestion.description}
                    </p>
                    <Button
                      size="sm"
                      className="gradient-secondary text-white"
                    >
                      {suggestion.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}

        {activeTab === "quick" && (
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Card
                    key={action.id}
                    className="glass border-0 cursor-pointer hover:border-purple-500/50 transition-colors"
                    onClick={() => handleQuickAction(action.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm">
                            {action.label}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}