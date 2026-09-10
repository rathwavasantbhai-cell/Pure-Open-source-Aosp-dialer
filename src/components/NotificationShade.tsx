import React, { useState } from 'react';
import {
  PhoneCall,
  PhoneOff,
  ChevronUp,
  ShieldCheck,
  Lock,
  ExternalLink,
  Info,
  AlertCircle
} from 'lucide-react';
import { ActiveCallInfo } from '../types';
import { MonetTheme } from '../utils/monetThemes';

interface NotificationShadeProps {
  call: ActiveCallInfo | null;
  theme: MonetTheme;
  isOpen: boolean;
  onClose: () => void;
  onHangUpFromNotification: () => void;
  onRestoreInCallActivity: () => void;
}

export const NotificationShade: React.FC<NotificationShadeProps> = ({
  call,
  theme,
  isOpen,
  onClose,
  onHangUpFromNotification,
  onRestoreInCallActivity,
}) => {
  const [swipeAttempted, setSwipeAttempted] = useState(false);

  if (!isOpen) return null;

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSimulateSwipe = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSwipeAttempted(true);
    setTimeout(() => setSwipeAttempted(false), 2000);
  };

  return (
    <div
      id="android-notification-shade"
      className="absolute inset-0 z-50 flex flex-col justify-start bg-black/85 backdrop-blur-md text-white p-4 animate-in fade-in slide-in-from-top-4 duration-200 select-none overflow-y-auto"
    >
      {/* Top Header: System Time & Drag Handle */}
      <div className="flex items-center justify-between pt-2 pb-4 px-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold font-mono">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/80">
            Android 15 (API 35)
          </span>
        </div>

        <button
          id="btn-close-notification-shade"
          onClick={onClose}
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white/90 flex items-center gap-1 text-xs"
        >
          <ChevronUp size={16} /> Close Shade
        </button>
      </div>

      {/* Foreground Service Telephony Status Banner */}
      <div className="mt-3 p-3 rounded-2xl bg-white/5 border border-white/10 text-xs">
        <div className="flex items-center justify-between font-semibold text-emerald-400 mb-1">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} /> FOREGROUND SERVICE: phoneCall
          </span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-[10px]">
            ACTIVE
          </span>
        </div>
        <p className="text-white/70 leading-relaxed text-[11px]">
          Promoted by <code className="text-white font-mono">InCallService.startForeground()</code> to prevent Android OS killer from terminating audio or dropping the connection.
        </p>
      </div>

      {/* Ongoing Notifications List */}
      <div className="mt-4 flex-1">
        <div className="text-[11px] font-bold uppercase tracking-wider text-white/50 px-1 mb-2">
          Ongoing Sessions
        </div>

        {call ? (
          <div
            id="persistent-incall-notification"
            onClick={onRestoreInCallActivity}
            className={`relative rounded-2xl p-4 bg-neutral-900 border transition-all cursor-pointer shadow-lg hover:border-white/30 ${
              swipeAttempted
                ? 'border-red-500 animate-shake ring-2 ring-red-500/50'
                : 'border-white/15'
            }`}
          >
            {/* Locked Non-Dismissible Notification Badge */}
            <div className="flex items-center justify-between text-xs text-white/60 mb-2">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: theme.primary }}
                >
                  <PhoneCall size={11} />
                </div>
                <span className="font-semibold text-white/90">Potato Dialer</span>
                <span>•</span>
                <span className="font-mono text-emerald-400 font-semibold">
                  {call.state === 'ACTIVE' ? formatTimer(call.durationSeconds) : 'Connecting...'}
                </span>
              </div>

              {/* Strict Non-Dismissible Flag Visual */}
              <div
                id="badge-non-dismissible"
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-amber-300 text-[10px] font-medium"
                title="Notification cannot be swiped away while call is ongoing (FLAG_ONGOING_EVENT)"
              >
                <Lock size={10} /> Non-Dismissible
              </div>
            </div>

            {/* Notification Body */}
            <div className="flex items-center justify-between py-1">
              <div>
                <h4 className="text-base font-bold text-white leading-tight">
                  {call.name}
                </h4>
                <p className="text-xs text-white/60 font-mono mt-0.5">
                  {call.number} • {call.state === 'ACTIVE' ? 'Call in progress' : 'Dialing...'}
                </p>
              </div>

              <span className="text-xs text-sky-400 flex items-center gap-1 opacity-80 group-hover:opacity-100">
                Tap to return <ExternalLink size={12} />
              </span>
            </div>

            {/* Swipe Resistance Alert */}
            {swipeAttempted && (
              <div
                id="swipe-blocked-warning"
                className="mt-2 text-[11px] font-medium text-red-400 bg-red-950/60 p-2 rounded-xl border border-red-800 flex items-center gap-1.5"
              >
                <AlertCircle size={14} className="shrink-0" />
                <span>
                  STRICT RULE ENFORCED: Ongoing call notification cannot be dismissed.
                </span>
              </div>
            )}

            {/* DIRECT ACTION BUTTONS (MANDATORY REQUIREMENT) */}
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
              {/* Swipe Test Button */}
              <button
                id="btn-test-swipe"
                type="button"
                onClick={handleSimulateSwipe}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                title="Test if notification can be swiped away"
              >
                Try Swipe Away
              </button>

              {/* Prominent Hang Up Action Button */}
              <button
                id="btn-notification-hangup"
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  onHangUpFromNotification();
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
                title="Direct Hang Up action directly from notification tray"
              >
                <PhoneOff size={14} /> Hang Up
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl p-6 bg-white/5 text-center text-white/40 text-xs">
            No active phone call foreground services running.
          </div>
        )}

        {/* Technical Callout Explaining the Ghost Call Fix */}
        <div className="mt-4 p-3 rounded-2xl bg-sky-950/40 border border-sky-800/40 text-[11px] text-sky-200">
          <div className="font-bold flex items-center gap-1.5 mb-1 text-sky-300">
            <Info size={13} /> Ghost Call Prevention Mechanism
          </div>
          <p className="leading-relaxed opacity-90">
            The notification tray action connects directly to <code className="text-white font-mono">CallActionReceiver</code> via a PendingIntent with <code className="text-white font-mono">FLAG_IMMUTABLE</code>. When pressed, <code className="text-white font-mono">Call.disconnect()</code> and <code className="text-white font-mono">stopForeground(STOP_FOREGROUND_REMOVE)</code> execute instantaneously even if the InCallActivity was dead or destroyed!
          </p>
        </div>
      </div>
    </div>
  );
};
