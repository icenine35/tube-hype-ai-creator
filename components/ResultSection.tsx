import React, { useState } from 'react';
import { Copy, Check, Youtube, Hash, FileText } from 'lucide-react';
import { OptimizationResult } from '../types';

interface ResultSectionProps {
  result: OptimizationResult;
}

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 rounded-md hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
      title="Kopyala"
    >
      {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
    </button>
  );
};

export const ResultSection: React.FC<ResultSectionProps> = ({ result }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      
      {/* 1. Başlıklar Bölümü */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="bg-gray-900/50 p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-500">
            <Youtube size={20} />
            <h3 className="font-semibold text-lg text-white">1. Viral Başlıklar</h3>
          </div>
        </div>
        <div className="p-0">
          {result.titles.length > 0 ? (
            result.titles.map((title, idx) => (
              <div 
                key={idx} 
                className="group flex items-center justify-between p-4 border-b border-gray-700/50 last:border-0 hover:bg-gray-700/30 transition-colors"
              >
                <div className="flex gap-4 items-center">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <p className="text-gray-200 font-medium">{title}</p>
                </div>
                <CopyButton text={title} />
              </div>
            ))
          ) : (
            <div className="p-4 text-gray-500 text-sm">Başlık bulunamadı.</div>
          )}
        </div>
      </div>

      {/* 2. Açıklama Bölümü */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="bg-gray-900/50 p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-400">
            <FileText size={20} />
            <h3 className="font-semibold text-lg text-white">2. Optimize Açıklama</h3>
          </div>
          <CopyButton text={result.description} />
        </div>
        <div className="p-6 text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
          {result.description || "Açıklama bulunamadı."}
        </div>
      </div>

      {/* 3. Etiketler Bölümü */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="bg-gray-900/50 p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-400">
            <Hash size={20} />
            <h3 className="font-semibold text-lg text-white">3. SEO Etiketleri</h3>
          </div>
          <CopyButton text={result.tags.join(', ')} />
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            {result.tags.length > 0 ? (
              result.tags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1 rounded-full bg-gray-900 border border-gray-600 text-gray-300 text-sm hover:border-gray-500 transition-colors cursor-default"
                >
                  #{tag}
                </span>
              ))
            ) : (
               <div className="text-gray-500 text-sm">Etiket bulunamadı.</div>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-700/50 text-xs text-gray-500 flex justify-between items-center">
             <span>Toplam: {result.tags.length} etiket</span>
             <span className="italic">Kopyalamak için sağ üstteki ikonu kullanın</span>
          </div>
        </div>
      </div>
    </div>
  );
};