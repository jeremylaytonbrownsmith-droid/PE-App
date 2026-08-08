import { Home, BookOpen, Wand2, CalendarRange, Settings } from 'lucide-react';

export const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/library', label: 'Library', icon: BookOpen },
  { to: '/generator', label: 'Sub Plan', icon: Wand2 },
  { to: '/pacing', label: 'Pacing', icon: CalendarRange },
  { to: '/settings', label: 'Settings', icon: Settings },
] as const;
