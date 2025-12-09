import { GoogleGenAI } from "@google/genai";
import { OptimizationResult } from '../types';

// Ayrıştırma (Parsing) Fonksiyonu
export const parseGeneratedContent = (rawText: string): OptimizationResult => {
  const result: OptimizationResult = {
    titles: [],
    description: "",
    tags: []
  };

  try {
    // Bölümleri ayır
    const titlesMatch = rawText.match(/1\. Başlıklar:([\s\S]*?)2\. Açıklama:/);
    const descriptionMatch = rawText.match(/2\. Açıklama:([\s\S]*?)3\. Etiketler:/);
    const tagsMatch = rawText.match(/3\. Etiketler:([\s\S]*)/);

    // 1. Başlıkları İşle
    if (titlesMatch && titlesMatch[1]) {
      result.titles = titlesMatch[1]
        .trim()
        .split('\n')
        .map(t => t.replace(/^\d+[\.\-\)]\s*/, '').trim()) // Satır başındaki "1. ", "- " gibi işaretleri temizle
        .filter(t => t.length > 0);
    }

    // 2. Açıklamayı İşle
    if (descriptionMatch && descriptionMatch[1]) {
      result.description = descriptionMatch[1].trim();
    }

    // 3. Etiketleri İşle
    if (tagsMatch && tagsMatch[1]) {
      result.tags = tagsMatch[1]
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);
    }
  } catch (error) {
    console.error("Parsing Error:", error);
    // Hata durumunda boş veya hatalı olduğunu belirten bir yapı döndürebiliriz
  }

  return result;
};

export const generateYouTubeContent = async (
  topic: string,
  emotion: string
): Promise<string> => {
  
  // API Key'i al (Global değişkenden veya Env'den)
  const apiKey = process.env.API_KEY || (window as any).MOCK_API_KEY;

  // TEST MODU: Eğer mock key kullanılıyorsa, gerçek API çağrısı yapma, sahte veri dön
  if (apiKey === "MOCK_KEY_FOR_TEST") {
    console.log("Mock Modu Aktif: Sahte veri döndürülüyor...");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 saniye bekle (loading simülasyonu)
    
    return `
1. Başlıklar:
1. (Şok Edici) ${topic} Hakkında Kimsenin Bilmediği Gerçekler!
2. Bu Yöntemle ${topic} Konusunda Usta Olun (Kesin Sonuç)
3. ${topic} Yaparken Asla Yapmamanız Gereken 5 Hata
4. İnanılmaz Dönüşüm: ${topic} ile Hayatım Değişti
5. Neden Herkes ${topic} Konuşuyor? (Detaylı Analiz)

2. Açıklama:
${topic} hakkında merak ettiğiniz her şeyi bu videoda derledik. ${emotion} duygusunu sonuna kadar hissedeceğiniz bu içerikte, daha önce hiç duymadığınız ipuçlarını paylaşıyoruz. Videoyu sonuna kadar izlemeyi ve abone olmayı unutmayın! #tavsiye

3. Etiketler:
${topic.toLowerCase().replace(/\s+/g, '')}, trend, viral, youtube, içerik, ${emotion.toLowerCase()}, rehber, nasıl yapılır, inceleme, ipuçları, 2024, eniyi, popüler, keşfet, öneri, eğitim, vlog, analiz, gerçekler, sırlar
    `.trim();
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });

  const systemPrompt = `SEN YOUTUBE İÇİN DÜNYANIN EN İYİ İÇERİK OPTİMİZASYON UZMANISIN. 
Görevin: Aşağıdaki [KONU] için, [DUYGU] öğesini maksimum düzeyde kullanarak YouTube'da tıklama oranını (CTR) artıracak içerik metinleri üretmektir.

Çıktıyı, her bölümü yeni bir satırda olmak üzere tam olarak aşağıdaki üç ana başlık altında yapılandır. Başka bir giriş veya sonuç cümlesi yazma.

1. Başlıklar: 5 adet, Türkçe, SEO uyumlu ve merak uyandıran başlık. (Mümkünse parantez içinde bir sayı/tanım kullan). Her başlık yeni bir satırda olsun.
2. Açıklama: 1 adet, 150 kelimeyi geçmeyecek, videonun içeriğini özetleyen, harekete geçirici (call-to-action) bir açıklama.
3. Etiketler: 20 adet, tek bir metin satırında virgülle ayrılmış (örnek: etiket1, etiket2, etiket3, ...).

---`;

  const userPrompt = `
[KONU]: ${topic}
[DUYGU]: ${emotion}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        // JSON yerine düz metin istiyoruz
      }
    });

    if (!response.text) {
      throw new Error("No response generated");
    }

    return response.text;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("İçerik üretilirken bir hata oluştu. Lütfen tekrar deneyin.");
  }
};