
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Send, User, Bot } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { fetchLiveWeatherByPlace, weatherCodeToSummary } from "@/lib/external/openMeteo";

interface Message {
  role: "user" | "assistant";
  content: string;
  id?: string;
  reactions?: {
    like: number;
    dislike: number;
    helpful: number;
    love: number;
  };
}

const AgricultureChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your agriculture assistant. Ask me anything about farming, crops, or traditional practices!",
      id: "welcome",
      reactions: { like: 0, dislike: 0, helpful: 0, love: 0 }
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Allow external suggested questions to trigger a send
  useEffect(() => {
    const handler = (e: any) => {
      const q = e?.detail?.question;
      const preset = e?.detail?.presetAnswer as string | undefined;
      if (typeof q === 'string' && q.trim() && !isLoading) {
        if (preset && preset.trim()) {
          const userId = `user-${Date.now()}`;
          const assistantId = `assistant-${Date.now() + 1}`;
          setMessages(prev => [
            ...prev,
            { role: "user", content: q.trim(), id: userId },
            { role: "assistant", content: preset.trim(), id: assistantId, reactions: { like: 0, dislike: 0, helpful: 0, love: 0 } }
          ]);
          return;
        }
        void sendMessage(q.trim());
      }
    };
    window.addEventListener('askChatbot', handler as EventListener);
    return () => window.removeEventListener('askChatbot', handler as EventListener);
  }, [isLoading]);

  const sendMessage = async (userMessage: string) => {
    // Add user message to chat
    setMessages(prev => [...prev, { role: "user", content: userMessage, id: `user-${Date.now()}` }]);
    setIsLoading(true);

    try {
      // Call the Supabase Edge Function for real-time AI response
      const { data, error } = await supabase.functions.invoke("agriculture-chatbot", {
        body: { message: userMessage }
      });

      if (error) {
        console.error("Supabase function error:", error);
        // Try direct API call as fallback
        try {
          const response = await fetch('https://derildzszqbqbgeygznk.functions.supabase.co/agriculture-chatbot', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage })
          });
          
          if (response.ok) {
            const apiData = await response.json();
            setMessages(prev => [...prev, { 
              role: "assistant", 
              content: apiData?.response || apiData?.message || getDemoResponse(userMessage),
              id: `assistant-${Date.now()}`,
              reactions: { like: 0, dislike: 0, helpful: 0, love: 0 }
            }]);
            setIsLoading(false);
            return;
          }
        } catch (fetchError) {
          console.error("Direct API call error:", fetchError);
        }
        
        // Use local "online tools" + improved demo response if all API calls fail
        const demoResponse = await getEnhancedResponse(userMessage);
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: demoResponse,
          id: `assistant-${Date.now()}`,
          reactions: { like: 0, dislike: 0, helpful: 0, love: 0 }
        }]);
        setIsLoading(false);
        return;
      }

      // Add assistant response from Supabase function
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: data?.response || data?.message || getDemoResponse(userMessage),
        id: `assistant-${Date.now()}`,
        reactions: { like: 0, dislike: 0, helpful: 0, love: 0 }
      }]);
      setIsLoading(false);
    } catch (error) {
      console.error("Error calling chatbot:", error);
      setIsLoading(false);
      
      // Add demo response on error
      const demoResponse = await getEnhancedResponse(userMessage);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: demoResponse,
        id: `assistant-${Date.now()}`,
        reactions: { like: 0, dislike: 0, helpful: 0, love: 0 }
      }]);
    }
  };

  const saveReactionLocally = (messageId: string, reactions: Message["reactions"]) => {
    try {
      const key = `chat_reactions_${messageId}`;
      localStorage.setItem(key, JSON.stringify(reactions));
    } catch {}
  };

  const loadReactionLocally = (messageId: string): Message["reactions"] | undefined => {
    try {
      const key = `chat_reactions_${messageId}`;
      const raw = localStorage.getItem(key);
      if (!raw) return undefined;
      return JSON.parse(raw);
    } catch {
      return undefined;
    }
  };

  const handleReaction = async (messageIndex: number, type: keyof NonNullable<Message["reactions"]>) => {
    setMessages(prev => {
      const next = [...prev];
      const target = { ...next[messageIndex] } as Message;
      if (!target.id) {
        target.id = `${messageIndex}-${Date.now()}`;
      }
      const current = target.reactions || { like: 0, dislike: 0, helpful: 0, love: 0 };
      const updated = { ...current, [type]: (current as any)[type] + 1 } as Message["reactions"];
      target.reactions = updated;
      next[messageIndex] = target;
      // persist locally
      saveReactionLocally(target.id, updated);
      return next;
    });

    // best-effort Supabase persistence (non-blocking)
    try {
      const msg = messages[messageIndex];
      const id = msg.id || `${messageIndex}`;
      await supabase.from("chatbot_feedback").insert({
        message_id: id,
        role: messages[messageIndex].role,
        reaction: type,
        created_at: new Date().toISOString(),
        message_content: messages[messageIndex].content?.slice(0, 500)
      });
    } catch {}
  };

  // Get demo response when API is unavailable
  const getDemoResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Crop recommendations
    if (message.includes('crop') && (message.includes('recommend') || message.includes('suggest') || message.includes('grow'))) {
      return "Based on agricultural best practices, I recommend choosing crops suited to your soil type and climate. For black soil, cotton and groundnut work well. For alluvial soil, rice and wheat are excellent choices. For red soil, consider millets and pulses. Always practice crop rotation to maintain soil health. Would you like specific recommendations for your region?";
    }
    
    // Pest control
    if (message.includes('pest') || message.includes('insect') || message.includes('disease')) {
      return "For natural pest control, I recommend:\n\n1. Neem oil spray: Mix 5ml neem oil per liter of water and spray weekly\n2. Companion planting: Grow marigolds, basil, or garlic near crops to repel pests\n3. Biological control: Use beneficial insects like ladybugs\n4. Crop rotation: Prevents pest buildup\n5. Remove affected plant parts immediately\n\nFor specific pest identification, upload a photo in the Disease Detection section. What pest are you dealing with?";
    }
    
    // Soil health
    if (message.includes('soil') || message.includes('fertile') || message.includes('manure')) {
      return "To improve soil health:\n\n1. Add organic matter: Use farmyard manure, compost, or vermicompost (2-5 tonnes per acre)\n2. Practice crop rotation: Rotate between legumes and cereals\n3. Use green manure: Grow crops like sunnhemp or daincha and plough them back\n4. Maintain soil pH: Most crops prefer pH 6.0-7.5. Add lime if acidic, sulfur if alkaline\n5. Avoid over-tillage: Excessive ploughing can damage soil structure\n\nWhat specific soil issue are you facing?";
    }
    
    // Water management
    if (message.includes('water') || message.includes('irrigation') || message.includes('rain')) {
      return "Water management tips:\n\n1. Drip irrigation: Saves 30-50% water compared to flood irrigation\n2. Mulching: Reduces evaporation by 50-70%\n3. Rainwater harvesting: Collect rainwater for dry periods\n4. SRI method: For rice, use System of Rice Intensification to save water\n5. Schedule irrigation: Water early morning or evening to reduce evaporation\n\nWhat crop are you irrigating?";
    }
    
    // Fertilizer
    if (message.includes('fertilizer') || message.includes('nutrient') || message.includes('npk')) {
      return "Fertilizer recommendations:\n\n1. Organic fertilizers: Farmyard manure (5-10 tonnes/acre), compost, vermicompost\n2. Chemical fertilizers: Use based on soil test results. Generally:\n   - Rice: NPK 10:26:26\n   - Wheat: NPK 12:32:16\n   - Cotton: NPK 20:10:10\n3. Apply in split doses: Apply nitrogen in 2-3 doses for better efficiency\n4. Micronutrients: Add zinc, boron, and iron as needed\n\nCheck the Fertilizer Recommendations section for crop-specific advice. What crop are you fertilizing?";
    }
    
    // Traditional practices
    if (message.includes('traditional') || message.includes('organic') || message.includes('natural')) {
      return "Traditional farming practices that work well:\n\n1. Crop rotation: Prevents soil depletion and pest buildup\n2. Intercropping: Grow multiple crops together (e.g., maize with beans)\n3. Zero tillage: Reduces soil erosion and conserves moisture\n4. Organic manuring: Use cow dung, compost, and green manure\n5. Neem-based pest control: Effective and eco-friendly\n6. Seed treatment: Use turmeric or ash to protect seeds\n\nThese practices have been used for generations and are still effective today. What would you like to know more about?";
    }
    
    // Weather
    if (message.includes('weather') || message.includes('rain') || message.includes('monsoon')) {
      return "Weather-related farming tips:\n\n1. Monitor forecasts: Check weather predictions before planting or harvesting\n2. Monsoon preparation: Ensure proper drainage to prevent waterlogging\n3. Heat waves: Mulch crops and provide shade for sensitive plants\n4. Cold protection: Cover crops with cloth or plastic during cold waves\n5. Wind protection: Plant windbreaks around fields\n\nCheck the Weather section for detailed forecasts for your region. What weather concern do you have?";
    }
    
    // General greeting
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! I'm your agriculture assistant. I can help you with:\n\n• Crop recommendations\n• Pest and disease management\n• Soil health improvement\n• Water management\n• Fertilizer advice\n• Traditional farming practices\n• Weather-based planning\n\nWhat would you like to know about farming today?";
    }
    
    // Default response
    return "I understand you're asking about: \"" + userMessage + "\"\n\nI can help you with various farming topics including:\n\n• Crop selection and cultivation\n• Pest and disease control\n• Soil health and fertilizers\n• Water management and irrigation\n• Traditional farming practices\n• Weather planning\n• Market prices\n\nCould you rephrase your question or check the relevant section in the app? For example, if you're asking about crop diseases, try the Disease Detection feature where you can upload photos for identification.";
  };

  const isWeatherQuestion = (msg: string) => {
    const m = msg.toLowerCase();
    return m.includes("weather") || m.includes("rain") || m.includes("temperature") || m.includes("forecast") || m.includes("monsoon");
  };

  const extractLocationQuery = (msg: string): string | null => {
    // lightweight heuristic: "weather in <place>" / "temperature at <place>"
    const m = msg.trim();
    const lower = m.toLowerCase();
    const markers = ["weather in ", "forecast in ", "temperature in ", "weather at ", "forecast at ", "temperature at "];
    for (const mk of markers) {
      const idx = lower.indexOf(mk);
      if (idx >= 0) {
        const q = m.slice(idx + mk.length).trim();
        return q.length >= 2 ? q : null;
      }
    }
    // if user wrote "Pune weather" / "Mumbai rain"
    if (lower.endsWith(" weather")) return m.slice(0, -" weather".length).trim() || null;
    if (lower.endsWith(" rain")) return m.slice(0, -" rain".length).trim() || null;
    return null;
  };

  const getEnhancedResponse = async (userMessage: string): Promise<string> => {
    // 1) If it's a weather question and we can infer location, answer with live data (online)
    if (isWeatherQuestion(userMessage)) {
      const loc = extractLocationQuery(userMessage);
      if (!loc) {
        return [
          "To give you a live forecast, tell me your location (district/city + state).",
          "",
          "Example: “weather in Pune, Maharashtra”",
        ].join("\n");
      }
      const live = await fetchLiveWeatherByPlace(`${loc}, India`);
      if (live) {
        const summary = weatherCodeToSummary(live.current.weatherCode);
        const todayRain = live.daily?.[0]?.precipitationMm ?? 0;
        const next2 = (live.daily || []).slice(0, 2).map((d) => {
          const day = new Date(d.date).toLocaleDateString("en-IN", { weekday: "short" });
          const hi = typeof d.tempMaxC === "number" ? Math.round(d.tempMaxC) : undefined;
          const lo = typeof d.tempMinC === "number" ? Math.round(d.tempMinC) : undefined;
          const r = typeof d.precipitationMm === "number" ? Math.round(d.precipitationMm) : undefined;
          return `${day}: ${hi ?? "--"}°/${lo ?? "--"}°, rain ${r ?? "--"} mm`;
        });

        return [
          `Live weather for ${live.name}${live.admin1 ? `, ${live.admin1}` : ""}:`,
          `- Current: ${Math.round(live.current.temperatureC)}°C, ${summary}${live.current.windSpeedKmh ? `, wind ${Math.round(live.current.windSpeedKmh)} km/h` : ""}`,
          `- Rain today (est.): ${Math.round(todayRain)} mm`,
          "",
          "Next days:",
          ...next2.map((x) => `- ${x}`),
          "",
          "Farming suggestion (general): If rain is expected, avoid spraying pesticides/fungicides in the 6–12 hours before rainfall; prefer early morning application and check label re-entry intervals.",
          "",
          "Source: Open‑Meteo (live).",
        ].join("\n");
      }

      return [
        "I couldn’t fetch live weather right now (network/CORS).",
        "Try again in a moment, or check the Weather page (it can also fall back to demo data).",
      ].join("\n");
    }

    // 2) Improved fallback: structured, reasoning-first answer
    const base = getDemoResponse(userMessage);
    return [
      base,
      "",
      "If you share 3 details, I can be more precise: crop, location (state/district), and current stage (sowing/growing/flowering/harvest).",
    ].join("\n");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    await sendMessage(userMessage);
  };

  return (
    <Card className="flex flex-col h-[600px] w-full max-w-2xl mx-auto">
      <div className="bg-agri-green p-4 text-white rounded-t-lg">
        <h2 className="text-lg font-semibold">Agriculture Assistant</h2>
        <p className="text-sm opacity-90">Ask about farming, crops, pests, and traditional practices</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div 
              className={`
                flex items-start space-x-2 max-w-[80%] 
                ${message.role === "user" 
                  ? "bg-agri-green-dark text-white rounded-l-lg rounded-tr-lg" 
                  : "bg-agri-cream text-gray-800 rounded-r-lg rounded-tl-lg"}
                p-3
              `}
            >
              <div className="flex-shrink-0 mt-1">
                {message.role === "user" 
                  ? <User className="h-5 w-5" /> 
                  : <Bot className="h-5 w-5" />}
              </div>
              <div>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.role === "assistant" && (
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => handleReaction(index, "like")}
                      className="px-2 py-1 rounded bg-white/70 hover:bg-white text-agri-green-dark"
                    >
                      👍 {message.reactions?.like || 0}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReaction(index, "helpful")}
                      className="px-2 py-1 rounded bg-white/70 hover:bg-white text-agri-green-dark"
                    >
                      ✅ {message.reactions?.helpful || 0}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReaction(index, "love")}
                      className="px-2 py-1 rounded bg-white/70 hover:bg-white text-agri-green-dark"
                    >
                      ❤️ {message.reactions?.love || 0}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReaction(index, "dislike")}
                      className="px-2 py-1 rounded bg-white/70 hover:bg-white text-agri-green-dark"
                    >
                      👎 {message.reactions?.dislike || 0}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-agri-cream text-gray-800 rounded-r-lg rounded-tl-lg p-3 flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a farming question..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default AgricultureChatbot;
