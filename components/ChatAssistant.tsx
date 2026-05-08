import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Mic, MapPin, Globe, Sparkles, Loader2 } from 'lucide-react';
import { chatWithDesigner, transcribeAudio } from '../services/geminiService';
import { ChatMessage } from '../types';

export const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Merhaba! Ben Yörpalas AI asistanıyım. Size dekorasyon fikirleri verebilir, trendleri araştırabilir veya yakındaki mobilyacıları bulabilirim. Nasıl yardımcı olabilirim?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      // Format history for API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await chatWithDesigner(history, userMsg);
      
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: response.text,
        groundingMetadata: response.groundingMetadata
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Üzgünüm, bir bağlantı hatası oluştu. Lütfen tekrar deneyin.", isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          setIsLoading(true);
          try {
             const text = await transcribeAudio(base64Audio);
             setInput(text);
          } catch (e) {
             console.error(e);
          } finally {
             setIsLoading(false);
          }
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Helper to render grounding chunks (Maps/Search)
  const renderGrounding = (metadata: any) => {
    if (!metadata?.groundingChunks) return null;
    
    const chunks = metadata.groundingChunks;
    const mapChunks = chunks.filter((c: any) => c.googleMaps);
    const webChunks = chunks.filter((c: any) => c.web);

    return (
      <div className="mt-3 space-y-2">
        {mapChunks.length > 0 && (
          <div className="flex flex-wrap gap-2">
             {mapChunks.map((c: any, i: number) => (
                <a 
                  key={i} 
                  href={c.googleMaps.googleMapsUri} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs bg-gold-50 text-gold-700 px-2 py-1 rounded border border-gold-100 hover:bg-gold-100"
                >
                   <MapPin size={12} /> {c.googleMaps.title}
                </a>
             ))}
          </div>
        )}
        {webChunks.length > 0 && (
          <div className="flex flex-wrap gap-2">
             {webChunks.map((c: any, i: number) => (
                <a 
                  key={i} 
                  href={c.web.uri} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200 hover:bg-slate-200"
                >
                   <Globe size={12} /> {c.web.title}
                </a>
             ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 bg-gold-600 text-white p-4 rounded-full shadow-2xl hover:bg-gold-700 transition-all transform hover:scale-105 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageSquare size={24} />
        <span className="ml-2 font-bold hidden md:block">AI Asistan</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
          {/* Header */}
          <div className="bg-navy-900 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="bg-gold-600 p-1.5 rounded-lg">
                <Sparkles size={18} />
              </div>
              <span className="font-bold">AI Tasarımcı</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-gold-600 text-white rounded-br-none' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                  } ${msg.isError ? 'bg-red-50 text-red-600 border-red-200' : ''}`}
                >
                  {/* Render text as markdown-like simple parser or just text */}
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  
                  {/* Render Grounding Sources */}
                  {msg.role === 'model' && msg.groundingMetadata && renderGrounding(msg.groundingMetadata)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2 text-slate-500 text-sm">
                  <Loader2 size={16} className="animate-spin text-gold-600" />
                  Düşünüyor...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex gap-2">
              <button
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                className={`p-3 rounded-xl transition-all ${
                  isRecording 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                <Mic size={20} />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Oda tasarımı hakkında sor..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-gold-600 text-white p-3 rounded-xl hover:bg-gold-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};