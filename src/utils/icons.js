import {
  Code2, PenTool, Megaphone, BarChart3, Landmark, Users, TrendingUp, Headphones,
  BadgeCheck, MousePointerClick, Sparkles, Rocket, Briefcase,
} from 'lucide-react';

export const ICONS = { Code2, PenTool, Megaphone, BarChart3, Landmark, Users, TrendingUp, Headphones, BadgeCheck, MousePointerClick, Sparkles, Rocket };

export const getIcon = (name) => ICONS[name] || Briefcase;

export const TONES = {
  indigo: 'bg-indigo-50 text-indigo-600 ring-indigo-100',
  pink: 'bg-pink-50 text-pink-600 ring-pink-100',
  amber: 'bg-amber-50 text-amber-600 ring-amber-100',
  sky: 'bg-sky-50 text-sky-600 ring-sky-100',
  emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
  violet: 'bg-violet-50 text-violet-600 ring-violet-100',
  orange: 'bg-orange-50 text-orange-600 ring-orange-100',
  teal: 'bg-teal-50 text-teal-600 ring-teal-100',
};
