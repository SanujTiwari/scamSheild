import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Sparkles, Shield } from "lucide-react";
import { sendChatMessage } from "../services/chatService";

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I\'m ScamShield AI 🛡️ Ask me to analyze suspicious job offers, phishing emails, payment demands, or recruiter profiles!',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const quickQuestions = [
    'What are common job scam red flags?',
    'Is it safe to pay a training fee?',
    'How do I verify a recruiter\'s email?',
  ];

  const handleSend = async (messageText) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(text);
      setMessages(prev => [...prev, { role: 'assistant', content: response.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I\'m having trouble connecting to intelligence servers right now. Please try again.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 h-[520px] bg-[#0B111A]/95 border border-white/10 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col z-50 animate-scale-in overflow-hidden">
          {/* Header */}
          <div className="bg-[#080C13] text-white px-5 py-4 flex items-center justify-between flex-shrink-0 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 p-[1px]">
                <div className="w-full h-full bg-[#05070B] rounded-[11px] flex items-center justify-center">
                  <Shield className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
              <div>
                <h3 className="font-display text-[14px] font-bold text-white tracking-tight flex items-center gap-1.5">
                  ScamShield AI
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                </h3>
                <p className="font-mono text-[10px] text-[#94A3B8]">Fraud & Cyber Threat Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#05070B]/60">
            {messages.map((msg, index) => (
              <div key={index} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-[#080C13] border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                )}
                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-tr-xs shadow-md'
                    : 'bg-[#080C13] text-white border border-white/10 rounded-tl-xs shadow-xs'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2.5 items-center">
                <div className="w-6 h-6 rounded-lg bg-[#080C13] border border-white/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                </div>
                <div className="px-4 py-2.5 bg-[#080C13] border border-white/10 rounded-2xl rounded-tl-xs font-mono text-[11px] text-[#94A3B8] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                  Analyzing query...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length < 3 && (
            <div className="p-3 bg-[#080C13] border-t border-white/10 flex flex-wrap gap-1.5 flex-shrink-0">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="font-mono text-[10px] text-[#94A3B8] hover:text-white border border-white/10 hover:border-indigo-500/40 px-3 py-1 rounded-full bg-[#05070B] transition-all cursor-pointer text-left truncate max-w-full"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="border-t border-white/10 p-3 bg-[#080C13] flex-shrink-0">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask AI about scam signals..."
                disabled={isLoading}
                className="flex-1 bg-[#05070B] border border-white/10 rounded-xl px-4 py-2.5 text-[13px] text-white placeholder:text-[#94A3B8] focus:border-indigo-500 outline-none transition-all"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="p-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all disabled:opacity-40 cursor-pointer font-bold active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 sm:right-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-3 rounded-full shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:shadow-[0_0_35px_rgba(99,102,241,0.6)] transition-all duration-300 flex items-center gap-2.5 z-50 cursor-pointer font-mono text-[11px] uppercase tracking-widest font-bold active:scale-95"
      >
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        {isOpen ? (
          <>Close AI <X className="w-4 h-4" /></>
        ) : (
          <>ScamShield AI <MessageCircle className="w-4 h-4" /></>
        )}
      </button>
    </>
  );
}

export default ChatBot;
