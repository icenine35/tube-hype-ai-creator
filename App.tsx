import React, { useState } from 'react';
import { Sparkles, Youtube, Loader2, AlertCircle } from 'lucide-react';
import { generateYouTubeContent, parseGeneratedContent } from './services/geminiService';
import { ResultSection } from './components/ResultSection';
import { EMOTIONS } from './constants';
import { OptimizationResult } from './types';

function App() {
  // 2. State Tanımlamaları
  const [topic, setTopic] = useState('');
  const [emotion, setEmotion] = useState(EMOTIONS[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 3. handleGenerate Fonksiyonu
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasyon: Konu veya duygu boşsa uyarı ver
    if (!topic.trim()) {
      alert('Lütfen bir video konusu giriniz.');
      return;
    }
    if (!emotion) {
      alert('Lütfen bir duygu seçiniz.');
      return;
    }

    // İşlem başlıyor
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // API Çağrısı - Ham metni al
      const rawText = await generateYouTubeContent(topic, emotion);
      
      // Ayrıştırma (Parsing) - Metni nesneye çevir
      const parsedObject = parseGeneratedContent(rawText);
      
      // Sonucu kaydet
      setResult(parsedObject);
      
    } catch (err: any) {
      setError(err.message || 'İçerik üretilirken bir sorun oluştu.');
    } finally {
      // İşlem bitti
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white pb-20">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-900/50">
              <Youtube className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                TubeHype AI
              </h1>
              <p className="text-xs text-gray-500 tracking-wider">İÇERİK OPTİMİZASYON UZMANI</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
             Gemini 2.5 Flash Aktif
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto mb-16">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Videonuzu <span className="text-red-500">Viral</span> Yapın
            </h2>
            <p className="text-gray-400 text-lg">
              Yapay zeka destekli başlık, açıklama ve etiket üreticisi.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 shadow-2xl backdrop-blur-sm">
            <div className="space-y-6">
              
              {/* Topic Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Video Konusu
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Örn: Evde yapılabilecek 5 dakikalık egzersizler..."
                  className="w-full bg-gray-900/80 border border-gray-600 text-white rounded-xl px-5 py-4 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all placeholder-gray-600 text-lg"
                  disabled={isLoading}
                />
              </div>

              {/* Emotion Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Hedef Duygu (CTR Tetikleyici)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {EMOTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setEmotion(opt.id)}
                      disabled={isLoading}
                      className={`
                        flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200
                        ${emotion === opt.id 
                          ? 'bg-red-500/20 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)] transform scale-105' 
                          : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500 hover:bg-gray-800'
                        }
                        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      <span className="text-2xl mb-1">{opt.emoji}</span>
                      <span className="text-xs font-medium">{opt.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-4 rounded-xl shadow-lg transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    İçerik Üretiliyor...
                  </>
                ) : (
                  <>
                    <Sparkles />
                    İçerik Üret
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Hata Gösterimi */}
        {error && (
          <div className="max-w-2xl mx-auto bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3 mb-8">
            <AlertCircle className="flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Sonuç Alanı */}
        {result && (
          <div id="results" className="scroll-mt-24">
             <ResultSection result={result} />
          </div>
        )}
      </main>

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default App;