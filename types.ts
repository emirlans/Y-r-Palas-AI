export enum RoomStyle {
  Modern = 'Modern',
  Minimalist = 'Minimalist',
  Scandinavian = 'İskandinav',
  Industrial = 'Endüstriyel',
  Bohemian = 'Bohem',
  Traditional = 'Geleneksel',
  ArtDeco = 'Art Deco',
  Coastal = 'Sahil Evi',
  Farmhouse = 'Çiftlik Evi'
}

export enum RoomType {
  LivingRoom = 'Oturma Odası',
  Bedroom = 'Yatak Odası',
  Kitchen = 'Mutfak',
  Bathroom = 'Banyo',
  Office = 'Çalışma Odası',
  DiningRoom = 'Yemek Odası'
}

export interface DesignConfig {
  style: RoomStyle;
  roomType: RoomType;
  image: string; // Base64
}

export interface GeneratedResult {
  imageUrl: string;
  originalUrl: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
  groundingMetadata?: any;
}

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export interface TextToImageConfig {
  prompt: string;
  aspectRatio: AspectRatio;
  image?: string; // Optional base64 image for image-to-image generation
}

export interface VideoGenerationConfig {
  image: string; // Base64
  prompt: string;
}

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}
