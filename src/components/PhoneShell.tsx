import React from 'react';
import {
  Wifi,
  SignalHigh,
  BatteryCharging,
  PhoneCall,
  History,
  Grid,
  ChevronDown
} from 'lucide-react';
import { MonetTheme } from '../utils/monetThemes';
import { ActiveCallInfo } from '../types';

interface PhoneShellProps {
  theme: MonetTheme;
  activeTab: 'DIALPAD' | 'RECENTS';
  activeCall: ActiveCallInfo | null;
  isInCallView: boolean;
  onTabChange: (tab: 'DIALPAD' | 'RECENTS') => void;
  onOpenNotificationShade: () => void;
  onRestoreInCallView: () => void;
  children: React.ReactNode;
}

export const PhoneShell: React.FC<PhoneShellProps> = ({
  theme,
  activeTab,
  activeCall,
  isInCallView,
  onTabChange,
  onOpenNotificationShade,
  onRestoreInCallView,
  children,
}) => {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="relative mx-auto w-full max-w-[390px] h-[780px] bg-neutral-900 rounded-[50px] p-3 shadow-2xl border-4 border-neutral-800 ring-1 ring-black/40 flex flex-col justify-between overflow-hidden">
      {/* Phone Screen Canvas */}
      <div
        id="phone-display-viewport"
        className="relative flex-1 w-full rounded-[40px] overflow-hidden flex flex-col justify-between shadow-inner"
        style={{ backgroundColor: theme.surface }}
      >
        {/* Top Android Status Bar */}
        <div
          id="android-status-bar"
          onClick={onOpenNotificationShade}
          className="h-10 px-5 pt-1.5 flex items-center justify-between text-xs cursor-pointer select-none transition-colors hover:bg-black/5"
          style={{ color: theme.onSurface }}
          title="Click to pull down Android Notification Shade"
        >
          {/* Left: Clock or Active In-Call Status Chip */}
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-tight">{currentTime}</span>
            {activeCall && !isInCallView && (
              <button
                id="status-bar-incall-chip"
                onClick={e => {
                  e.stopPropagation();
                  onRestoreInCallView();
                }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold animate-pulse"
                style={{ backgroundColor: theme.primaryContainer, color: theme.onPrimaryContainer }}
                title="Tap to return to active call"
              >
                <PhoneCall size={10} />
                <span>
                  {activeCall.state === 'ACTIVE'
                    ? `${Math.floor(activeCall.durationSeconds / 60)}:${String(activeCall.durationSeconds % 60).padStart(2, '0')}`
                    : 'Call'}
                </span>
              </button>
            )}
          </div>

          {/* Center: Punch Hole Camera & Notification Drawer Indicator */}
          <div className="flex items-center gap-1">
            <div className="w-3.5 h-3.5 rounded-full bg-black ring-1 ring-white/10" />
            <span className="text-[9px] opacity-40 hover:opacity-100 flex items-center gap-0.5 pl-1 font-mono">
              <ChevronDown size={11} /> Shade
            </span>
          </div>

          {/* Right: Cellular, Wi-Fi, Battery */}
          <div className="flex items-center gap-1.5 opacity-80">
            <SignalHigh size={13} />
            <Wifi size={13} />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-mono">100%</span>
              <BatteryCharging size={14} className="text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Main Phone Content Container */}
        <div className="relative flex-1 overflow-hidden">
          {children}
        </div>

        {/* Bottom Material 3 Navigation Bar (Hidden during active In-Call view) */}
        {!isInCallView && (
          <nav
            id="android-bottom-nav"
            className="h-16 flex items-center justify-around border-t border-black/5 select-none transition-colors"
            style={{ backgroundColor: theme.surfaceContainer }}
          >
            {/* Recents Tab */}
            <button
              id="tab-btn-recents"
              onClick={() => onTabChange('RECENTS')}
              className={`flex-1 py-1.5 flex flex-col items-center gap-1 transition-all ${
                activeTab === 'RECENTS' ? 'font-bold' : 'opacity-65 hover:opacity-90'
              }`}
              style={{
                color: activeTab === 'RECENTS' ? theme.onSurface : theme.onSurfaceVariant,
              }}
            >
              <div
                className={`px-4 py-1 rounded-full flex items-center justify-center transition-all ${
                  activeTab === 'RECENTS' ? 'shadow-xs' : ''
                }`}
                style={{
                  backgroundColor: activeTab === 'RECENTS' ? theme.primaryContainer : 'transparent',
                  color: activeTab === 'RECENTS' ? theme.onPrimaryContainer : 'inherit',
                }}
              >
                <History size={18} />
              </div>
              <span className="text-[11px] tracking-wide">Recents</span>
            </button>

            {/* Keypad Tab */}
            <button
              id="tab-btn-keypad"
              onClick={() => onTabChange('DIALPAD')}
              className={`flex-1 py-1.5 flex flex-col items-center gap-1 transition-all ${
                activeTab === 'DIALPAD' ? 'font-bold' : 'opacity-65 hover:opacity-90'
              }`}
              style={{
                color: activeTab === 'DIALPAD' ? theme.onSurface : theme.onSurfaceVariant,
              }}
            >
              <div
                className={`px-4 py-1 rounded-full flex items-center justify-center transition-all ${
                  activeTab === 'DIALPAD' ? 'shadow-xs' : ''
                }`}
                style={{
                  backgroundColor: activeTab === 'DIALPAD' ? theme.primaryContainer : 'transparent',
                  color: activeTab === 'DIALPAD' ? theme.onPrimaryContainer : 'inherit',
                }}
              >
                <Grid size={18} />
              </div>
              <span className="text-[11px] tracking-wide">Keypad</span>
            </button>
          </nav>
        )}

        {/* Bottom Android Gesture Navigation Bar Pill */}
        <div className="h-4 flex items-center justify-center pb-1 bg-transparent">
          <div className="w-28 h-1 rounded-full bg-neutral-400/40" />
        </div>
      </div>
    </div>
  );
};
