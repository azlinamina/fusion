import React, { useEffect, useState } from 'react';
import {
  Home, Network, BookOpen, CalendarDays, Users, StickyNote, Dumbbell, Flag,
  Menu, X, GraduationCap, User, Bell, ChevronLeft,
} from 'lucide-react';
import { cn } from '../utils';

export type PageKey = 'home' | 'org' | 'dskp' | 'rph' | 'headcount' | 'nota' | 'latihan' | 'program';

export const NAV: { key: PageKey; label: string; icon: React.ElementType; color: string }[] = [
  { key: 'home', label: 'HOME', icon: Home, color: 'from-green to-green-light' },
  { key: 'org', label: 'CARTA ORGANISASI', icon: Network, color: 'from-teal to-green' },
  { key: 'dskp', label: 'DSKP', icon: BookOpen, color: 'from-purple to-teal' },
  { key: 'rph', label: 'RPH', icon: CalendarDays, color: 'from-teal to-purple' },
  { key: 'headcount', label: 'HEADCOUNT', icon: Users, color: 'from-purple to-navy' },
  { key: 'nota', label: 'NOTA', icon: StickyNote, color: 'from-teal to-navy' },
  { key: 'latihan', label: 'LATIHAN', icon: Dumbbell, color: 'from-green to-teal' },
  { key: 'program', label: 'PROGRAM', icon: Flag, color: 'from-purple to-green' },
];

function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const date = now.toLocaleDateString('ms-MY', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const time = now.toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  return (
    <div className="hidden md:flex flex-col items-end leading-tight">
      <span className="text-[11px] text-slate-500">{date}</span>
      <span className="text-sm font-semibold text-navy tabular-nums">{time}</span>
    </div>
  );
}

export function Header({ page, onHome, onMenu }: { page: PageKey; onHome: () => void; onMenu: () => void }) {
  return (
    <header className="fixed top-0 inset-x-0 z-40 h-16 bg-gradient-to-r from-navy via-[#123c75] to-teal text-white shadow-lg">
      <div className="h-full px-4 sm:px-6 flex items-center gap-3">
        <button onClick={onMenu} className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-white/10" aria-label="Menu">
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green to-green-light flex items-center justify-center shadow-inner shrink-0">
            <GraduationCap className="w-6 h-6 text-navy" />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-sm sm:text-base leading-tight truncate">PORTAL AKADEMIK FIZIK & MATEMATIK</h1>
            <p className="text-[11px] text-green-light/90 truncate">Pusat Sumber Pengajaran dan Pembelajaran Digital</p>
          </div>
        </div>
        <div className="flex-1" />
        <Clock />
        <button
          onClick={onHome}
          className={cn('hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors', page === 'home' ? 'bg-white/20' : 'hover:bg-white/10')}
        >
          <Home className="w-4 h-4" /> Home
        </button>
        <button className="relative p-2 rounded-lg hover:bg-white/10" aria-label="Notifikasi">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green rounded-full" />
        </button>
        <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-white/10" aria-label="Profil">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple to-teal flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <span className="hidden sm:block text-sm font-medium">Guru Panitia</span>
        </button>
      </div>
    </header>
  );
}

export function Sidebar({ page, onNavigate, collapsed, onToggle }: { page: PageKey; onNavigate: (p: PageKey) => void; collapsed: boolean; onToggle: () => void }) {
  return (
    <aside className={cn(
      'hidden lg:flex flex-col fixed left-0 top-16 bottom-0 z-30 bg-navy text-white transition-all duration-300',
      collapsed ? 'w-[76px]' : 'w-64'
    )}>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {NAV.map((item) => {
          const active = page === item.key;
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              title={collapsed ? item.label : undefined}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative group',
                active ? 'bg-white/15 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'
              )}
            >
              {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r bg-gradient-to-b from-green to-green-light" />}
              <span className={cn('w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0', item.color, 'opacity-90')}>
                <Icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
              </span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>
      <button
        onClick={onToggle}
        className="mx-3 mb-4 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-sm text-white/80"
      >
        <ChevronLeft className={cn('w-4 h-4 transition-transform', collapsed && 'rotate-180')} />
        {!collapsed && 'Runtuhkan'}
      </button>
    </aside>
  );
}

export function MobileDrawer({ open, page, onNavigate, onClose }: { open: boolean; page: PageKey; onNavigate: (p: PageKey) => void; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-navy/60" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-72 bg-navy text-white shadow-2xl flex flex-col">
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          <span className="font-bold text-sm">Menu Navigasi</span>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10"><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV.map((item) => {
            const active = page === item.key;
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => { onNavigate(item.key); onClose(); }}
                className={cn('w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium', active ? 'bg-white/15 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white')}
              >
                <span className={cn('w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0', item.color)}>
                  <Icon className="w-[18px] h-[18px]" />
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export function MobileBottomNav({ page, onNavigate }: { page: PageKey; onNavigate: (p: PageKey) => void }) {
  const items = NAV.slice(0, 5);
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 shadow-[0_-4px_16px_rgba(13,48,104,.08)]">
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const active = page === item.key;
          const Icon = item.icon;
          return (
            <button key={item.key} onClick={() => onNavigate(item.key)} className="flex flex-col items-center py-2 gap-0.5">
              <Icon className={cn('w-5 h-5', active ? 'text-purple' : 'text-slate-400')} />
              <span className={cn('text-[10px] font-semibold', active ? 'text-purple' : 'text-slate-400')}>{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
