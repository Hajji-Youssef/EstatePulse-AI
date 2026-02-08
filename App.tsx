
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, PredictionResult } from './types';
import { startChatSession, handleGeminiResponse } from './services/geminiService';
import PriceCard from './components/PriceCard';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const session = startChatSession();
    setChatSession(session);

    const welcomeMsg: ChatMessage = {
      id: 'welcome',
      role: 'model',
      content: "Bienvenue sur EstatePulse AI. Je suis votre consultant expert en estimation immobilière. Pour commencer une évaluation précise par régression, pourriez-vous me décrire votre bien ? (Surface en m², nombre de pièces, année de construction et standing du quartier).",
      timestamp: new Date()
    };
    setMessages([welcomeMsg]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || !chatSession) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await handleGeminiResponse(chatSession, input);
      
      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response.text || "Analyse terminée. Voici les résultats de notre moteur de régression.",
        timestamp: new Date(),
        prediction: response.prediction || undefined
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMsg: ChatMessage = {
        id: 'error',
        role: 'system',
        content: "Une erreur technique est survenue. Veuillez vérifier votre connexion.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center p-4 md:p-8 overflow-hidden">
      <div className="w-full max-w-5xl h-full glass-panel rounded-[2rem] shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Header de Prestige */}
        <header className="px-8 py-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <i className="fas fa-gem text-xl"></i>
            </div>
            <div>
              <h1 className="text-white font-extrabold text-2xl tracking-tight leading-none">EstatePulse <span className="text-indigo-400">AI</span></h1>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Intelligence Immobilière de Luxe</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Moteur Actif</span>
              <span className="text-white/40 text-[9px]">Regression Mode: Linear v2.4</span>
            </div>
            <div className="h-8 w-[1px] bg-white/10"></div>
            <button className="text-white/60 hover:text-white transition-colors">
              <i className="fas fa-cog"></i>
            </button>
          </div>
        </header>

        {/* Zone de Chat */}
        <main 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar bg-transparent"
        >
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex w-full animate-in fade-in slide-in-from-bottom-5 duration-500 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[75%] md:max-w-[65%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.role === 'model' && (
                  <div className="flex items-center gap-2 mb-2 ml-1">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Assistant EstatePulse</span>
                  </div>
                )}
                
                <div 
                  className={`
                    p-5 md:p-6 rounded-3xl message-shadow text-sm md:text-base leading-relaxed
                    ${msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none font-medium' 
                      : msg.role === 'system'
                        ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20 italic'
                        : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                    }
                  `}
                >
                  {msg.content}
                  {msg.prediction && <PriceCard prediction={msg.prediction} />}
                </div>
                
                <span className="text-[9px] mt-2 text-white/30 font-bold uppercase tracking-tighter px-2">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start items-center">
              <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 flex gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
        </main>

        {/* Input Flottant */}
        <footer className="p-6 md:p-10">
          <div className="relative group max-w-4xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2rem] blur opacity-25 group-focus-within:opacity-50 transition duration-500"></div>
            <div className="relative flex items-center gap-3 bg-slate-900 border border-white/10 rounded-[2rem] p-2 pr-4 pl-6 shadow-2xl">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ex: Maison de 120m², 4 chambres, Paris 16..."
                className="flex-1 bg-transparent text-white border-none py-4 text-sm md:text-base focus:ring-0 placeholder:text-slate-500 font-medium"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-500 disabled:opacity-30 disabled:grayscale transition-all shadow-lg active:scale-95"
              >
                <i className={`fas ${isTyping ? 'fa-circle-notch fa-spin' : 'fa-arrow-up'}`}></i>
              </button>
            </div>
          </div>
          <p className="text-center text-[9px] text-white/20 mt-6 font-bold uppercase tracking-[0.3em]">
            Algorithme de Régression Propriétaire & Gemini 3 Engine
          </p>
        </footer>

        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 5px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { 
            background: rgba(255, 255, 255, 0.1); 
            border-radius: 10px; 
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
        `}</style>
      </div>
    </div>
  );
};

export default App;
