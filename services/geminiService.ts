import { GoogleGenAI, Modality, Type } from "@google/genai";
import { DesignConfig, TextToImageConfig, VideoGenerationConfig } from "../types";

// Helper to safely get the API Key in both Vite and other environments
const getApiKey = () => {
  // @ts-ignore - Vite uses import.meta.env
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    return import.meta.env.VITE_API_KEY;
  }
  return process.env.API_KEY;
};

const getClient = () => new GoogleGenAI({ apiKey: getApiKey() });

const styleMap: Record<string, string> = {
  'Modern': 'Modern',
  'Minimalist': 'Minimalist',
  'İskandinav': 'Scandinavian',
  'Endüstriyel': 'Industrial',
  'Bohem': 'Bohemian',
  'Geleneksel': 'Traditional',
  'Art Deco': 'Art Deco',
  'Sahil Evi': 'Coastal',
  'Çiftlik Evi': 'Farmhouse'
};

const roomTypeMap: Record<string, string> = {
  'Oturma Odası': 'Living Room',
  'Yatak Odası': 'Bedroom',
  'Mutfak': 'Kitchen',
  'Banyo': 'Bathroom',
  'Çalışma Odası': 'Home Office',
  'Yemek Odası': 'Dining Room'
};

/**
 * Redesigns a room based on an input image and style configuration using Flash Image.
 */
export const redesignRoom = async (config: DesignConfig): Promise<string> => {
  try {
    const ai = getClient();
    const mimeMatch = config.image.match(/^data:(image\/[a-zA-Z]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const base64Data = config.image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const stylePrompt = styleMap[config.style] || config.style;
    const roomPrompt = roomTypeMap[config.roomType] || config.roomType;

    const prompt = `
      Redesign this ${roomPrompt} to have a ${stylePrompt} interior design style.
      Maintain the architectural structure (walls, windows, ceiling, doors) of the original image.
      Update the furniture, colors, materials, and lighting to reflect the ${stylePrompt} aesthetic.
      The output must be a high-quality, photorealistic image.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType: mimeType } },
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    return extractImageFromResponse(response);
  } catch (error: any) {
    console.error("Error generating room design:", error);
    throw error;
  }
};

/**
 * Generates a new room image from text using Imagen 4.
 * If an image is provided, it uses Gemini 2.5 Flash Image for Image+Text generation.
 */
export const generateRoomFromText = async (config: TextToImageConfig): Promise<string> => {
  try {
    const ai = getClient();
    
    // If an image is provided, use Gemini 2.5 Flash Image (Multimodal)
    if (config.image) {
        const mimeMatch = config.image.match(/^data:(image\/[a-zA-Z]+);base64,/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
        const base64Data = config.image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: base64Data, mimeType: mimeType } },
                    { text: `Photorealistic interior design edit. ${config.prompt}. High quality, professional photography.` },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        return extractImageFromResponse(response);
    } 
    
    // If no image, use Imagen 4 (Text to Image)
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `Photorealistic interior design. ${config.prompt}. High quality, professional photography, 8k resolution.`,
      config: {
        numberOfImages: 1,
        aspectRatio: config.aspectRatio,
        outputMimeType: 'image/jpeg'
      }
    });

    const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    if (!base64ImageBytes) throw new Error("Görüntü oluşturulamadı.");
    
    return `data:image/jpeg;base64,${base64ImageBytes}`;

  } catch (error: any) {
    console.error("Error generating image:", error);
    throw error;
  }
};

/**
 * Generates a video from a room image using Veo (High Quality).
 */
export const generateRoomVideo = async (config: VideoGenerationConfig): Promise<string> => {
  const apiKey = getApiKey();
  const ai = getClient();
  const mimeMatch = config.image.match(/^data:(image\/[a-zA-Z]+);base64,/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
  const base64Data = config.image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

  try {
    // Using 'veo-3.1-generate-preview' for higher quality (Pro level) generation
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-generate-preview',
      prompt: config.prompt || "Cinematic camera pan of this beautiful room, photorealistic, 4k, slow smooth motion",
      image: {
        imageBytes: base64Data,
        mimeType: mimeType
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    while (!operation.done) {
      // Increased polling interval for the larger model
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) throw new Error("Video URI not found");

    const fetchUrl = `${videoUri}&key=${apiKey}`;

    try {
      // Attempt to download the video to create a local blob URL (cleaner, no API key exposed in DOM)
      const response = await fetch(fetchUrl);
      
      if (!response.ok) {
          console.warn(`Direct download failed (${response.status}), falling back to direct URI.`);
          // If fetch fails (e.g. CORS or 403), fall back to returning the signed URL directly
          return fetchUrl;
      }
      
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (downloadError) {
      console.warn("Video download failed (likely CORS), using direct URL:", downloadError);
      // Fallback: Return the direct URL. The video tag might be able to play it.
      return fetchUrl;
    }

  } catch (error) {
    console.error("Veo Error:", error);
    throw error;
  }
};

/**
 * Chat with the AI Interior Designer using Gemini 3 Pro with Tools.
 */
export const chatWithDesigner = async (
  history: { role: string, parts: { text: string }[] }[],
  message: string
) => {
  const ai = getClient();
  
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    history: history,
    config: {
      systemInstruction: "Sen 'Yörpalas' uygulamasının uzman yapay zeka iç mimarısın. Kullanıcılara dekorasyon, renk seçimi ve mobilya bulma konularında yardımcı olursun. Google Maps kullanarak mağaza önerileri yapabilir ve Google Search ile trendleri araştırabilirsin. Türkçe konuş.",
      tools: [
        { googleSearch: {} },
        { googleMaps: {} }
      ],
      thinkingConfig: { thinkingBudget: 1024 } // Enable thinking for reasoning
    }
  });

  const response = await chat.sendMessage({ message });
  
  return {
    text: response.text || "Yanıt oluşturulamadı.",
    groundingMetadata: response.candidates?.[0]?.groundingMetadata
  };
};

/**
 * Transcribe audio using Flash.
 */
export const transcribeAudio = async (audioBase64: string): Promise<string> => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: [
        { inlineData: { data: audioBase64, mimeType: 'audio/wav' } },
        { text: "Transcribe this audio to text accurately. Return only the text." }
      ]
    }
  });
  return response.text || "";
};

// Helper to extract image
function extractImageFromResponse(response: any): string {
  const candidate = response.candidates?.[0];
  if (candidate?.content?.parts) {
    for (const part of candidate.content.parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }
  throw new Error("Görüntü verisi bulunamadı.");
}