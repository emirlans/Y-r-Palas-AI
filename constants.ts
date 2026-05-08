import { RoomStyle, RoomType } from './types';
import { Armchair, BedDouble, Utensils, Bath, Monitor, ChefHat, Anchor, Leaf, Frame, Layers, Zap } from 'lucide-react';

export const STYLES = [
  { label: 'Modern', value: RoomStyle.Modern, icon: Zap },
  { label: 'Minimalist', value: RoomStyle.Minimalist, icon: Layers },
  { label: 'İskandinav', value: RoomStyle.Scandinavian, icon: Leaf },
  { label: 'Endüstriyel', value: RoomStyle.Industrial, icon: Frame },
  { label: 'Bohem', value: RoomStyle.Bohemian, icon: Armchair },
  { label: 'Geleneksel', value: RoomStyle.Traditional, icon: BedDouble },
  { label: 'Sahil Evi', value: RoomStyle.Coastal, icon: Anchor },
];

export const ROOM_TYPES = [
  { label: 'Oturma Odası', value: RoomType.LivingRoom },
  { label: 'Yatak Odası', value: RoomType.Bedroom },
  { label: 'Mutfak', value: RoomType.Kitchen },
  { label: 'Banyo', value: RoomType.Bathroom },
  { label: 'Çalışma Odası', value: RoomType.Office },
  { label: 'Yemek Odası', value: RoomType.DiningRoom },
];