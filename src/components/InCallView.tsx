import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PhoneOff,
  Phone,
  Grid,
  Pause,
  Play,
  Bluetooth,
  ChevronDown
} from 'lucide-react';
import { ActiveCallInfo, AudioRoute } from '../types';
import { MonetTheme } from '../utils/monetThemes';
import { playDtmfTone } from '../utils/audioTones';

interface InCallViewProps {
  call: ActiveCallInfo;
  theme: MonetTheme;
  onHangUp: () => void;
  onAnswer: () => void;
  onToggleMute: () => void;
  onToggleSpeaker: () => void;
  onToggleHold: () => void;
  onSendDtmf: (digit: string) => void;
}

export const InCallView: React.FC<InCallViewProps> = ({
  call,
  theme,
  onHangUp,
  onAnswer,
  onToggleMute,
  onToggleSpeaker,
  onToggleHold,
  onSendDtmf,
}) => {
  const [showKeypad, setShowKeypad] = useState(false);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getStatusText = () => {
    switch (call.state) {
      case 'RINGING':
        return 'Incoming Call...';
      case 'DIALING':
        return 'Dialing...';
      case 'CONNECTING':
        return 'Connecting...';
      case 'HOLDING':
        return 'Call On Hold';
      case 'ACTIVE':
        return formatTimer(call.durationSeconds);
      case 'DISCONNECTING':
      case 'DISCONNECTED':
        return 'Call Ended';
      default:
        return '';
    }
  };

  const isIncoming = call.state === 'RINGING';

  return (
    <div
      id="in-call-screen"
      className="flex flex-col h-full justify-between p-6 select-none relative overflow-hidden transition-colors"
      style={{ backgroundColor: theme.surface }}
    >
      {/* Top Header & Caller Information */}
      <div className="flex flex-col items-center pt-8 text-center">
        {/* Status Indicator */}
        <div
          id="incall-status-pill"
          className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-6 flex items-center gap-1.5"
          style={{
            backgroundColor: call.state === 'ACTIVE' ? theme.primaryContainer : theme.surfaceContainerHigh,
            color: call.state === 'ACTIVE' ? theme.onPrimaryContainer : theme.onSurfaceVariant,
          }}
        >
          {call.state === 'ACTIVE' && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
          {getStatusText()}
        </div>

        {/* Contact Monogram Avatar */}
        <div
          id="incall-caller-avatar"
          className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-md transition-transform"
          style={{ backgroundColor: call.avatarColor }}
        >
          {call.name.charAt(0) || '#'}
        </div>

        {/* Contact Name & Number */}
        <h1
          id="incall-caller-name"
          className="text-2xl font-bold tracking-tight mb-1"
          style={{ color: theme.onSurface }}
        >
          {call.name}
        </h1>
        <p
          id="incall-caller-number"
          className="text-sm font-mono opacity-80"
          style={{ color: theme.onSurfaceVariant }}
        >
          {call.number}
        </p>
      </div>

      {/* Center Keypad Overlay (for DTMF dial tones) */}
      {showKeypad ? (
        <div
          id="incall-keypad-modal"
          className="rounded-3xl p-4 my-2 border border-black/5 shadow-md"
          style={{ backgroundColor: theme.surfaceContainer }}
        >
          <div className="flex justify-between items-center mb-2 px-2">
            <span className="text-xs font-semibold uppercase" style={{ color: theme.onSurfaceVariant }}>
              Touch Tones (DTMF)
            </span>
            <button
              onClick={() => setShowKeypad(false)}
              className="p-1 rounded-full hover:opacity-75"
              style={{ color: theme.onSurfaceVariant }}
            >
              <ChevronDown size={18} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(digit => (
              <button
                key={digit}
                id={`incall-dtmf-${digit}`}
                onClick={() => {
                  playDtmfTone(digit);
                  onSendDtmf(digit);
                }}
                className="h-11 rounded-xl text-lg font-bold flex items-center justify-center active:scale-95 transition-transform"
                style={{ backgroundColor: theme.keypadBg, color: theme.onSurface }}
              >
                {digit}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1" />
      )}

      {/* Bottom Controls Area */}
      <div className="flex flex-col items-center gap-6 pb-6">
        {/* If Call is Active: Secondary Control Buttons (Mute, Speaker, Keypad, Hold) */}
        {!isIncoming && (
          <div className="grid grid-cols-4 gap-4 w-full max-w-xs">
            {/* Mute Button */}
            <div className="flex flex-col items-center gap-1.5">
              <button
                id="btn-toggle-mute"
                onClick={onToggleMute}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95 ${
                  call.isMuted ? 'shadow-md ring-2 ring-red-500/50' : ''
                }`}
                style={{
                  backgroundColor: call.isMuted ? '#ef4444' : theme.surfaceContainerHigh,
                  color: call.isMuted ? '#ffffff' : theme.onSurface,
                }}
                title={call.isMuted ? 'Unmute' : 'Mute'}
              >
                {call.isMuted ? <MicOff size={22} /> : <Mic size={22} />}
              </button>
              <span className="text-[11px] font-medium" style={{ color: theme.onSurfaceVariant }}>
                {call.isMuted ? 'Muted' : 'Mute'}
              </span>
            </div>

            {/* Keypad Drawer Toggle */}
            <div className="flex flex-col items-center gap-1.5">
              <button
                id="btn-toggle-keypad"
                onClick={() => setShowKeypad(!showKeypad)}
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95"
                style={{
                  backgroundColor: showKeypad ? theme.primary : theme.surfaceContainerHigh,
                  color: showKeypad ? theme.onPrimary : theme.onSurface,
                }}
                title="Dialpad"
              >
                <Grid size={22} />
              </button>
              <span className="text-[11px] font-medium" style={{ color: theme.onSurfaceVariant }}>
                Keypad
              </span>
            </div>

            {/* Speaker Toggle */}
            <div className="flex flex-col items-center gap-1.5">
              <button
                id="btn-toggle-speaker"
                onClick={onToggleSpeaker}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95 ${
                  call.audioRoute === 'SPEAKER' ? 'shadow-md' : ''
                }`}
                style={{
                  backgroundColor: call.audioRoute === 'SPEAKER' ? theme.primary : theme.surfaceContainerHigh,
                  color: call.audioRoute === 'SPEAKER' ? theme.onPrimary : theme.onSurface,
                }}
                title="Audio route"
              >
                {call.audioRoute === 'SPEAKER' ? (
                  <Volume2 size={22} />
                ) : call.audioRoute === 'BLUETOOTH' ? (
                  <Bluetooth size={22} />
                ) : (
                  <VolumeX size={22} />
                )}
              </button>
              <span className="text-[11px] font-medium" style={{ color: theme.onSurfaceVariant }}>
                {call.audioRoute === 'SPEAKER' ? 'Speaker' : 'Earpiece'}
              </span>
            </div>

            {/* Hold Toggle */}
            <div className="flex flex-col items-center gap-1.5">
              <button
                id="btn-toggle-hold"
                onClick={onToggleHold}
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95"
                style={{
                  backgroundColor: call.isOnHold ? '#f59e0b' : theme.surfaceContainerHigh,
                  color: call.isOnHold ? '#ffffff' : theme.onSurface,
                }}
                title="Hold call"
              >
                {call.isOnHold ? <Play size={22} /> : <Pause size={22} />}
              </button>
              <span className="text-[11px] font-medium" style={{ color: theme.onSurfaceVariant }}>
                {call.isOnHold ? 'Resume' : 'Hold'}
              </span>
            </div>
          </div>
        )}

        {/* Primary Call Action: If Incoming -> Answer/Reject. If Active -> Big Red End Call */}
        {isIncoming ? (
          <div className="flex items-center justify-around w-full max-w-xs pt-4">
            {/* Decline / Reject Button */}
            <div className="flex flex-col items-center gap-1.5">
              <button
                id="btn-decline-call"
                onClick={onHangUp}
                className="w-18 h-18 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90"
                style={{ backgroundColor: theme.endCallBg, color: '#ffffff' }}
                title="Decline Call"
              >
                <PhoneOff size={28} />
              </button>
              <span className="text-xs font-semibold" style={{ color: theme.onSurfaceVariant }}>
                Decline
              </span>
            </div>

            {/* Answer Button */}
            <div className="flex flex-col items-center gap-1.5">
              <button
                id="btn-answer-call"
                onClick={onAnswer}
                className="w-18 h-18 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 animate-bounce"
                style={{ backgroundColor: theme.answerBg, color: '#ffffff' }}
                title="Answer Call"
              >
                <Phone size={28} className="fill-current" />
              </button>
              <span className="text-xs font-semibold" style={{ color: theme.onSurfaceVariant }}>
                Answer
              </span>
            </div>
          </div>
        ) : (
          /* Signature Big Red End-Call Button */
          <div className="pt-2">
            <button
              id="btn-hang-up-call"
              onClick={onHangUp}
              className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-90 hover:brightness-110"
              style={{
                backgroundColor: theme.endCallBg,
                color: '#ffffff',
              }}
              title="End Call"
            >
              <PhoneOff size={32} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
