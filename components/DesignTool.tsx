import React, { useState, useRef, useCallback } from 'react';
import { Upload, Image as ImageIcon, Download, Sparkles, AlertCircle, RefreshCw, RotateCcw, Video, Type, Palette, MoveHorizontal, ZoomIn, RotateCw, Sun } from 'lucide-react';
import { STYLES, ROOM_TYPES } from '../constants';
import { RoomStyle, RoomType, AspectRatio } from '../types';
import { redesignRoom, generateRoomFromText, generateRoomVideo } from '../services/geminiService';

type ToolMode = 'redesign' | 'create' | 'video';

const VIDEO_TEMPLATES = [
  {
    id: 'cinematic',
    title: 'Sinematik Pan',
    desc: 'Yavaş yatay kamera kaydırma.',
    prompt: "Cinematic slow horizontal camera pan of the room, 4k, high quality, smooth motion, photorealistic interior design.",
    icon: MoveHorizontal
  },
  {
    id: 'zoom',
    title: 'Yavaş Yakınlaşma',
    desc: 'Odaya doğru yumuşak zoom.',
    prompt: "Slow smooth camera zoom in into the room, keeping focus on the center furniture, 4k, high quality, photorealistic.",
    icon: ZoomIn
  },
  {
    id: 'orbit',
    title: 'Hafif Dönüş',
    desc: 'Oda etrafında hafifçe dön.',
    prompt: "Slow orbiting camera movement around the center of the room, showing depth, 4k, high quality, smooth motion.",
    icon: RotateCw
  },
  {
    id: 'ambient',
    title: 'Doğal Işık',
    desc: 'Gün ışığı ve gölge hareketleri.',
    prompt: "Static camera shot of the room with changing natural lighting, timelapse of sunlight moving across the floor, shadows shifting, 4k.",
    icon: Sun
  }
];

export const DesignTool: React.FC = () => {
  const [mode, setMode] = useState<ToolMode>('redesign');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null); // Can be image or video URL
  const [isVideo, setIsVideo] = useState(false);

  // Redesign State
  const [selectedStyle, setSelectedStyle] = useState<RoomStyle>(RoomStyle.Modern);
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType>(RoomType.LivingRoom);

  // Create (Text) State
  const [textPrompt, setTextPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');

  // Video State
  const [videoPrompt, setVideoPrompt] = useState(VIDEO_TEMPLATES[0].prompt);
  const [selectedTemplateId, setSelectedTemplateId] = useState(VIDEO_TEMPLATES[0].id);

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      setGeneratedOutput(null);
      setIsVideo(false);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    // Enable drop for all modes
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  }, [mode]);

  const handleTemplateClick = (template: typeof VIDEO_TEMPLATES[0]) => {
    setSelectedTemplateId(template.id);
    setVideoPrompt(template.prompt);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedOutput(null);
    setIsVideo(false);

    try {
      if (mode === 'redesign') {
        if (!selectedImage) throw new Error("Lütfen bir resim seçin.");
        const result = await redesignRoom({
          image: selectedImage,
          style: selectedStyle,
          roomType: selectedRoomType
        });
        setGeneratedOutput(result);
      } else if (mode === 'create') {
        // Updated validation: Allow if text is present OR if image is present
        if (!textPrompt && !selectedImage) throw new Error("Lütfen bir açıklama girin veya görsel yükleyin.");
        
        // If user didn't provide text but provided an image, use a default prompt
        const promptToSend = textPrompt || "High quality, photorealistic interior design";

        const result = await generateRoomFromText({
            prompt: promptToSend + ` Style: ${selectedStyle}`,
            aspectRatio: aspectRatio,
            image: selectedImage || undefined
        });
        setGeneratedOutput(result);
      } else if (mode === 'video') {
         if (!selectedImage) throw new Error("Lütfen video için bir resim seçin.");
         if (!videoPrompt) throw new Error("Lütfen bir video efekti seçin.");
         
         // Use Veo 3.1 API
         const result = await generateRoomVideo({
             image: selectedImage,
             prompt: videoPrompt
         });
         
         setGeneratedOutput(result);
         setIsVideo(true);
      }
    } catch (err: any) {
      console.error("Generation Error:", err);
      
      let isVeo404 = false;
      
      // Method 1: Check structured error properties
      if (err?.error?.code === 404 || err?.error?.status === 'NOT_FOUND' || err?.status === 404) {
          isVeo404 = true;
      }

      // Method 2: Check string representation
      const errString = JSON.stringify(err, Object.getOwnPropertyNames(err));
      if (
          errString.includes('404') || 
          errString.includes('NOT_FOUND') || 
          errString.includes('Requested entity was not found')
      ) {
          isVeo404 = true;
      }

      if (mode === 'video' && isVeo404) {
          const msg = "Veo özelliği için faturalandırma hesabı tanımlı (Paid Project) bir proje gereklidir. Lütfen açılan pencereden uygun bir proje seçin.";
          setError(msg);
          
          // Trigger AI Studio key selection dialog if available
          setTimeout(() => {
            const win = window as any;
            if (win.aistudio && win.aistudio.openSelectKey) {
                console.log("Opening Select Key Dialog due to 404...");
                win.aistudio.openSelectKey();
            }
          }, 200);
      } else {
          // Extract readable message
          const rawMsg = err?.message || err?.error?.message || (typeof err === 'string' ? err : "Bir hata oluştu.");
          setError(rawMsg.length < 200 ? rawMsg : "Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Determines if we should show the placeholder (Upload/Input info) or the result/preview
  // Logic updated: Show placeholder if no image AND mode isn't create, OR if mode is create but no output AND no selected image
  const showPlaceholder = (!selectedImage && mode !== 'create') || (mode === 'create' && !generatedOutput && !selectedImage);

  return (
    <section id="design-tool" className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-slate-50">
      {/* Background Elements for Hero Effect */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gold-100/30 rounded-[100%] blur-3xl opacity-40 mix-blend-multiply" />
        <div className="absolute top-20 right-0 w-[800px] h-[600px] bg-slate-200/40 rounded-[100%] blur-3xl opacity-50 mix-blend-multiply" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-gold-100 shadow-sm mb-6">
            <Sparkles size={14} className="text-gold-600 mr-2" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Yapay Zeka Destekli</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-navy-900 mb-6 tracking-tight leading-tight">
            Hayallerindeki Mekanı <span className="text-gold-600">Tasarla</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Fotoğrafları yenile, sıfırdan tasarla veya Veo teknolojisi ile odayı canlandır.
          </p>
        </div>

        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-700">
           {/* Tabs */}
           <div className="flex border-b border-slate-100">
              <button 
                onClick={() => setMode('redesign')}
                className={`flex-1 py-4 font-semibold flex items-center justify-center gap-2 transition-colors ${mode === 'redesign' ? 'bg-white text-gold-600 border-b-2 border-gold-600' : 'bg-slate-50 text-slate-500 hover:text-gold-600'}`}
              >
                  <RefreshCw size={18} />
                  Odayı Yenile
              </button>
              <button 
                onClick={() => setMode('create')}
                className={`flex-1 py-4 font-semibold flex items-center justify-center gap-2 transition-colors ${mode === 'create' ? 'bg-white text-gold-600 border-b-2 border-gold-600' : 'bg-slate-50 text-slate-500 hover:text-gold-600'}`}
              >
                  <Type size={18} />
                  Sıfırdan Tasarla
              </button>
              <button 
                onClick={() => setMode('video')}
                className={`flex-1 py-4 font-semibold flex items-center justify-center gap-2 transition-colors ${mode === 'video' ? 'bg-white text-gold-600 border-b-2 border-gold-600' : 'bg-slate-50 text-slate-500 hover:text-gold-600'}`}
              >
                  <Video size={18} />
                  Video Oluştur
              </button>
           </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[700px]">
            
            {/* Controls Sidebar */}
            <div className="lg:col-span-4 p-6 md:p-8 bg-white border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col h-full overflow-y-auto max-h-[800px]">
              
              {/* Mode: Redesign */}
              {mode === 'redesign' && (
                <div className="space-y-8 flex-1 animate-in fade-in">
                  <div>
                    <label className="block text-sm font-bold text-navy-900 mb-3">Oda Tipi</label>
                    <div className="grid grid-cols-2 gap-2">
                       {ROOM_TYPES.map((type) => (
                        <button
                          key={type.value}
                          onClick={() => setSelectedRoomType(type.value)}
                          className={`px-4 py-2.5 text-sm font-medium rounded-xl border transition-all text-left ${
                            selectedRoomType === type.value
                              ? 'border-gold-600 bg-gold-600 text-white'
                              : 'border-slate-200 hover:border-gold-200 text-slate-600'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-navy-900 mb-3">Tasarım Tarzı</label>
                    <div className="grid grid-cols-2 gap-3">
                      {STYLES.map((style) => (
                        <button
                          key={style.value}
                          onClick={() => setSelectedStyle(style.value)}
                          className={`flex flex-col items-center text-center p-3 rounded-xl border transition-all ${
                            selectedStyle === style.value
                              ? 'border-gold-600 bg-gold-50 text-gold-700 ring-1 ring-gold-600'
                              : 'border-slate-200 hover:border-slate-300 text-slate-600'
                          }`}
                        >
                          <style.icon size={22} className="mb-2" strokeWidth={1.5} />
                          <span className="text-xs font-semibold">{style.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Mode: Create */}
              {mode === 'create' && (
                  <div className="space-y-8 flex-1 animate-in fade-in">
                      <div>
                          <label className="block text-sm font-bold text-navy-900 mb-3">Hayalindeki Odayı Tarif Et</label>
                          <textarea 
                              className="w-full p-4 border border-slate-200 rounded-xl h-40 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none resize-none text-slate-700 font-sans"
                              placeholder="Örn: Boğaz manzaralı, modern mobilyalı, bol ışık alan, bej tonlarında geniş bir salon..."
                              value={textPrompt}
                              onChange={(e) => setTextPrompt(e.target.value)}
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-navy-900 mb-3">Görsel Oranı</label>
                          <div className="flex gap-2">
                              {['16:9', '1:1', '9:16'].map((r) => (
                                  <button
                                      key={r}
                                      onClick={() => setAspectRatio(r as AspectRatio)}
                                      className={`flex-1 py-2 rounded-lg border text-sm font-medium ${aspectRatio === r ? 'bg-gold-600 text-white border-gold-600' : 'border-slate-200 text-slate-600'}`}
                                  >
                                      {r}
                                  </button>
                              ))}
                          </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-navy-900 mb-3">Tasarım Tarzı (Opsiyonel)</label>
                        <select 
                           className="w-full p-3 border border-slate-200 rounded-xl text-slate-700 outline-none font-sans"
                           value={selectedStyle}
                           onChange={(e) => setSelectedStyle(e.target.value as RoomStyle)}
                        >
                           {STYLES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                      </div>
                  </div>
              )}

              {/* Mode: Video */}
              {mode === 'video' && (
                 <div className="space-y-8 flex-1 animate-in fade-in">
                     <div>
                        <label className="block text-sm font-bold text-navy-900 mb-3">Video Efekti Seç</label>
                        <div className="grid grid-cols-2 gap-3">
                           {VIDEO_TEMPLATES.map((t) => (
                              <button
                                 key={t.id}
                                 onClick={() => handleTemplateClick(t)}
                                 className={`text-left p-3 rounded-xl border transition-all flex flex-col gap-2 ${
                                    selectedTemplateId === t.id 
                                       ? 'border-gold-600 bg-gold-50 ring-1 ring-gold-600' 
                                       : 'border-slate-200 hover:border-slate-300'
                                 }`}
                              >
                                 <div className={`p-2 rounded-lg w-fit ${selectedTemplateId === t.id ? 'bg-gold-200 text-gold-700' : 'bg-slate-100 text-slate-600'}`}>
                                    <t.icon size={20} />
                                 </div>
                                 <div>
                                    <div className={`font-bold text-sm ${selectedTemplateId === t.id ? 'text-gold-700' : 'text-navy-900'}`}>{t.title}</div>
                                    <div className="text-xs text-slate-500 mt-0.5">{t.desc}</div>
                                 </div>
                              </button>
                           ))}
                        </div>
                     </div>
                     
                     <div>
                        <label className="block text-sm font-bold text-navy-900 mb-2">Prompt (İsteğe Bağlı Düzenle)</label>
                        <textarea 
                           value={videoPrompt}
                           onChange={(e) => setVideoPrompt(e.target.value)}
                           className="w-full p-3 text-sm border border-slate-200 rounded-xl h-24 focus:ring-2 focus:ring-gold-500 outline-none resize-none text-slate-600 bg-slate-50 font-sans"
                        />
                     </div>

                     <div className="bg-gold-50 p-3 rounded-lg text-gold-800 text-xs border border-gold-100">
                        <p className="font-semibold flex items-center gap-1 mb-1"><Video size={14}/> Veo 3.1 Pro</p>
                        Bu işlem faturalandırma hesabı bağlı bir proje gerektirir.
                     </div>
                 </div>
              )}

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t border-slate-100 sticky bottom-0 bg-white">
                {error && (
                   <div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-start gap-2 animate-in fade-in slide-in-from-bottom-2">
                      <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                      <div>{error}</div>
                   </div>
                )}
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || (mode === 'redesign' && !selectedImage) || (mode === 'create' && !textPrompt && !selectedImage) || (mode === 'video' && !videoPrompt)}
                  className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 ${
                    isGenerating || (mode === 'redesign' && !selectedImage) || (mode === 'create' && !textPrompt && !selectedImage) || (mode === 'video' && !videoPrompt)
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                      : 'bg-gold-600 hover:bg-gold-700 hover:shadow-gold-100/50'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="animate-spin" size={22} />
                      {mode === 'video' ? 'İşleniyor...' : 'Oluşturuluyor...'}
                    </>
                  ) : (
                    <>
                      <Sparkles size={22} />
                      {mode === 'create' ? 'Görsel Oluştur' : mode === 'video' ? 'Videoyu Başlat' : 'Yeniden Tasarla'}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Preview Area */}
            <div className="lg:col-span-8 bg-slate-50/50 p-6 md:p-10 flex flex-col items-center justify-center relative min-h-[500px]">
              
              {showPlaceholder ? (
                <div 
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full max-w-xl aspect-video border-3 border-dashed border-slate-300 rounded-[2rem] flex flex-col items-center justify-center bg-white transition-all group cursor-pointer hover:bg-slate-50`}
                >
                  <div className="p-6 bg-gold-50 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                    {mode === 'create' ? (
                        <Sparkles size={40} className="text-gold-600" />
                    ) : (
                        <Upload size={40} className="text-gold-600" />
                    )}
                  </div>
                  <h4 className="text-2xl font-bold text-navy-900 mb-2">
                      {mode === 'create' ? 'Hayalindeki Odayı Tarif Et' : 'Fotoğraf Yükle'}
                  </h4>
                  {mode === 'create' && <p className="text-sm text-gold-600 font-medium mb-1">(Veya bir referans görsel yükle)</p>}
                  <p className="text-slate-500 mt-1 text-center px-6 max-w-md">
                    {mode === 'create' 
                        ? 'Sol taraftaki panelden odanın detaylarını gir, stilini seç ve yapay zekanın tasarlamasını bekle.' 
                        : mode === 'video' 
                            ? 'Video oluşturmak için önce bir oda görseli yükleyin.' 
                            : 'Yenilemek istediğiniz odanın net bir fotoğrafını yükleyin.'
                    }
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col">
                   <div className="flex justify-between items-center mb-4">
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${!generatedOutput ? 'bg-gold-600 text-white' : 'bg-slate-200 text-slate-600'}`}>Girdi</span>
                        {generatedOutput && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gold-600 text-white animate-pulse">
                              Sonuç
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 ml-auto">
                        {generatedOutput && (
                            <button 
                                onClick={() => {
                                    if (isVideo) return;
                                    // Use generated output as input for video or redesign
                                    setSelectedImage(generatedOutput);
                                    setGeneratedOutput(null);
                                    setIsVideo(false);
                                }}
                                className="text-sm text-gold-600 hover:bg-gold-50 font-medium px-3 py-1 rounded-lg transition-colors"
                            >
                                Bunu Kullan
                            </button>
                        )}
                        <button 
                          onClick={() => {
                             setSelectedImage(null);
                             setGeneratedOutput(null);
                             setIsVideo(false);
                             setError(null);
                             setTextPrompt('');
                          }}
                          className="text-sm text-slate-500 hover:text-red-600 font-medium flex items-center gap-1 px-3 py-1 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <RotateCcw size={14} />
                          Temizle
                        </button>
                      </div>
                   </div>

                   <div className="flex-1 relative rounded-2xl overflow-hidden shadow-2xl bg-navy-900 group min-h-[400px] flex items-center justify-center">
                      {isGenerating && !generatedOutput && (
                         <div className="absolute inset-0 bg-black/50 z-10 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                            <RefreshCw className="animate-spin mb-4" size={48} />
                            <p className="font-medium text-lg">İşleniyor...</p>
                            <p className="text-sm text-slate-300 mt-2">
                                {mode === 'video' ? 'Yapay zeka videonuzu oluşturuyor (Bu işlem biraz zaman alabilir)...' : 'Görsel oluşturuluyor...'}
                            </p>
                         </div>
                      )}

                      {isVideo && generatedOutput ? (
                          <video 
                             src={generatedOutput} 
                             controls 
                             autoPlay 
                             loop 
                             className="w-full h-full object-contain max-h-[600px]"
                          />
                      ) : (
                          <img 
                            src={generatedOutput || selectedImage || ''} 
                            alt="Room Preview" 
                            className="w-full h-full object-contain max-h-[600px]"
                          />
                      )}
                      
                      {generatedOutput && (
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <a 
                            href={generatedOutput} 
                            download={`yorpalas-${mode}-${Date.now()}.${isVideo ? 'mp4' : 'png'}`}
                            className="bg-white text-navy-900 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-slate-100 transition-all flex items-center gap-2 transform hover:-translate-y-1"
                          >
                            <Download size={18} />
                            {isVideo ? 'Videoyu İndir' : 'Görseli İndir'}
                          </a>
                        </div>
                      )}
                   </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};