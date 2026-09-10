import React, { useState, useEffect, useRef } from 'react';
import {
  Smartphone,
  FileCode,
  Layers,
  Palette,
  CheckCircle2,
  ShieldAlert,
  Download,
  PhoneCall,
  Activity,
  Cpu
} from 'lucide-react';
import { MONET_THEMES, MonetTheme } from './utils/monetThemes';
import { INITIAL_CONTACTS, INITIAL_CALL_LOGS } from './utils/t9Search';
import { ActiveCallInfo, CallLogItem, Contact, TelecomCallState, AudioRoute } from './types';
import { PhoneShell } from './components/PhoneShell';
import { DialpadView } from './components/DialpadView';
import { RecentsView } from './components/RecentsView';
import { InCallView } from './components/InCallView';
import { NotificationShade } from './components/NotificationShade';
import { TelecomInspector } from './components/TelecomInspector';
import { CodeViewer } from './components/CodeViewer';
import { playDisconnectTone } from './utils/audioTones';

export default function App() {
  const [currentTheme, setCurrentTheme] = useState<MonetTheme>(MONET_THEMES[0]);
  const [activeTab, setActiveTab] = useState<'DIALPAD' | 'RECENTS'>('DIALPAD');
  const [mainView, setMainView] = useState<'SIMULATOR' | 'CODE' | 'SPECS'>('SIMULATOR');

  // Contact list and Call history state
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [callLogs, setCallLogs] = useState<CallLogItem[]>(INITIAL_CALL_LOGS);

  // Active call session state
  const [activeCall, setActiveCall] = useState<ActiveCallInfo | null>(null);
  const [isInCallView, setIsInCallView] = useState<boolean>(false);
  const [isNotificationShadeOpen, setIsNotificationShadeOpen] = useState<boolean>(false);

  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Call duration ticker
  useEffect(() => {
    if (activeCall && activeCall.state === 'ACTIVE') {
      callTimerRef.current = setInterval(() => {
        setActiveCall(prev => {
          if (!prev || prev.state !== 'ACTIVE') return prev;
          return {
            ...prev,
            durationSeconds: prev.durationSeconds + 1,
          };
        });
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }
    }

    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [activeCall?.state]);

  // Handle placing a new call
  const handleStartCall = (name: string, number: string) => {
    const contact = contacts.find(c => c.number === number || c.name === name);
    const avatarColor = contact ? contact.avatarColor : '#1a73e8';

    const newCall: ActiveCallInfo = {
      id: `call-${Date.now()}`,
      name: name || number,
      number: number,
      state: 'DIALING',
      startTime: Date.now(),
      durationSeconds: 0,
      isMuted: false,
      audioRoute: 'EARPIECE',
      isOnHold: false,
      hasForegroundService: true,
      notificationDismissible: false,
      avatarColor,
    };

    setActiveCall(newCall);
    setIsInCallView(true);

    // Simulate Telecom network transition: DIALING -> CONNECTING -> ACTIVE
    setTimeout(() => {
      setActiveCall(prev => (prev ? { ...prev, state: 'CONNECTING' } : null));
    }, 1000);

    setTimeout(() => {
      setActiveCall(prev => (prev ? { ...prev, state: 'ACTIVE' } : null));
    }, 2200);
  };

  // Handle answering an incoming call
  const handleAnswerCall = () => {
    if (!activeCall) return;
    setActiveCall(prev => (prev ? { ...prev, state: 'ACTIVE' } : null));
  };

  // Handle call termination (under any state)
  const handleHangUp = () => {
    if (!activeCall) return;

    playDisconnectTone();

    // Log this call into Recents
    const finishedCall = activeCall;
    const newLogItem: CallLogItem = {
      id: `cl-${Date.now()}`,
      name: finishedCall.name,
      number: finishedCall.number,
      direction: finishedCall.state === 'RINGING' ? 'MISSED' : 'OUTGOING',
      durationSeconds: finishedCall.durationSeconds,
      timestamp: Date.now(),
    };

    setCallLogs(prev => [newLogItem, ...prev]);

    // Transition to DISCONNECTED
    setActiveCall(prev => (prev ? { ...prev, state: 'DISCONNECTED' } : null));

    // Tear down InCallView and clear Foreground Service (simulating stopForeground(STOP_FOREGROUND_REMOVE))
    setTimeout(() => {
      setActiveCall(null);
      setIsInCallView(false);
      setIsNotificationShadeOpen(false);
    }, 650);
  };

  const handleToggleMute = () => {
    setActiveCall(prev => (prev ? { ...prev, isMuted: !prev.isMuted } : null));
  };

  const handleToggleSpeaker = () => {
    setActiveCall(prev => {
      if (!prev) return null;
      const nextRoute: AudioRoute =
        prev.audioRoute === 'EARPIECE' ? 'SPEAKER' :
        prev.audioRoute === 'SPEAKER' ? 'BLUETOOTH' : 'EARPIECE';
      return { ...prev, audioRoute: nextRoute };
    });
  };

  const handleToggleHold = () => {
    setActiveCall(prev => {
      if (!prev) return null;
      const nextState: TelecomCallState = prev.isOnHold ? 'ACTIVE' : 'HOLDING';
      return { ...prev, isOnHold: !prev.isOnHold, state: nextState };
    });
  };

  const handleSendDtmf = (digit: string) => {
    console.log(`Telecom InCallService DTMF tone: ${digit}`);
  };

  // Simulate an incoming call from TelecomManager
  const handleSimulateIncomingCall = () => {
    if (activeCall) return;
    const incomingContact = contacts[6] || contacts[0]; // Mom or Alice
    const newCall: ActiveCallInfo = {
      id: `incoming-${Date.now()}`,
      name: incomingContact.name,
      number: incomingContact.number,
      state: 'RINGING',
      startTime: Date.now(),
      durationSeconds: 0,
      isMuted: false,
      audioRoute: 'EARPIECE',
      isOnHold: false,
      hasForegroundService: true,
      notificationDismissible: false,
      avatarColor: incomingContact.avatarColor,
    };
    setActiveCall(newCall);
    setIsInCallView(true);
  };

  // Simulate Android OS Killing the InCallActivity to prove foreground service + notification survive
  const handleSimulateKillUi = () => {
    setIsInCallView(false);
    setIsNotificationShadeOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Top Application Bar */}
      <header className="border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Subsystem Badge */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md font-bold text-lg"
              style={{ backgroundColor: currentTheme.primary }}
            >
              <PhoneCall size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-white">
                  PotatoDialer
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  AOSP Android 10..15 (API 29..35)
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Zero-Bloat Telecom InCallService • Foreground Service • Material 3 Monet
              </p>
            </div>
          </div>

          {/* Navigation Mode Switcher */}
          <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
            <button
              id="nav-simulator"
              onClick={() => setMainView('SIMULATOR')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mainView === 'SIMULATOR'
                  ? 'bg-neutral-800 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Smartphone size={14} />
              <span>Live Phone Simulator</span>
            </button>

            <button
              id="nav-code"
              onClick={() => setMainView('CODE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mainView === 'CODE'
                  ? 'bg-neutral-800 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FileCode size={14} />
              <span>Kotlin &amp; XML Source</span>
            </button>

            <button
              id="nav-specs"
              onClick={() => setMainView('SPECS')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mainView === 'SPECS'
                  ? 'bg-neutral-800 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Layers size={14} />
              <span>Architecture Specs</span>
            </button>
          </div>

          {/* Monet Dynamic Color Theme Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 flex items-center gap-1">
              <Palette size={13} /> Monet Theme:
            </span>
            <select
              id="select-monet-theme"
              value={currentTheme.id}
              onChange={e => {
                const found = MONET_THEMES.find(t => t.id === e.target.value);
                if (found) setCurrentTheme(found);
              }}
              className="bg-neutral-900 border border-neutral-700 text-xs rounded-xl px-2.5 py-1.5 text-neutral-200 font-medium focus:ring-1 focus:ring-sky-500 focus:outline-none"
            >
              {MONET_THEMES.map(theme => (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {mainView === 'SIMULATOR' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Pixel/AOSP Simulated Smartphone Shell */}
            <div className="lg:col-span-6 flex justify-center">
              <PhoneShell
                theme={currentTheme}
                activeTab={activeTab}
                activeCall={activeCall}
                isInCallView={isInCallView}
                onTabChange={setActiveTab}
                onOpenNotificationShade={() => setIsNotificationShadeOpen(true)}
                onRestoreInCallView={() => {
                  setIsInCallView(true);
                  setIsNotificationShadeOpen(false);
                }}
              >
                {/* Active In-Call Screen */}
                {isInCallView && activeCall ? (
                  <InCallView
                    call={activeCall}
                    theme={currentTheme}
                    onHangUp={handleHangUp}
                    onAnswer={handleAnswerCall}
                    onToggleMute={handleToggleMute}
                    onToggleSpeaker={handleToggleSpeaker}
                    onToggleHold={handleToggleHold}
                    onSendDtmf={handleSendDtmf}
                  />
                ) : activeTab === 'DIALPAD' ? (
                  <DialpadView
                    theme={currentTheme}
                    contacts={contacts}
                    onStartCall={handleStartCall}
                  />
                ) : (
                  <RecentsView
                    theme={currentTheme}
                    callLogs={callLogs}
                    onStartCall={handleStartCall}
                  />
                )}

                {/* System Notification Shade Simulator */}
                <NotificationShade
                  call={activeCall}
                  theme={currentTheme}
                  isOpen={isNotificationShadeOpen}
                  onClose={() => setIsNotificationShadeOpen(false)}
                  onHangUpFromNotification={() => {
                    handleHangUp();
                  }}
                  onRestoreInCallActivity={() => {
                    setIsNotificationShadeOpen(false);
                    if (activeCall) {
                      setIsInCallView(true);
                    }
                  }}
                />
              </PhoneShell>
            </div>

            {/* Right: Telecom Subsystem Telemetry & Ghost Call Bug Verification Bench */}
            <div className="lg:col-span-6 space-y-4">
              <TelecomInspector
                activeCall={activeCall}
                isInCallView={isInCallView}
                onSimulateIncomingCall={handleSimulateIncomingCall}
                onSimulateKillUi={handleSimulateKillUi}
                onSimulateNetworkHangUp={handleHangUp}
                onOpenNotificationShade={() => setIsNotificationShadeOpen(true)}
              />

              {/* Quick Code Reference Card */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-xs text-neutral-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <FileCode size={15} className="text-sky-400" />
                    Android Telecom InCallService Bindings
                  </span>
                  <button
                    onClick={() => setMainView('CODE')}
                    className="text-sky-400 hover:underline font-semibold"
                  >
                    View All Files &rarr;
                  </button>
                </div>
                <p className="text-neutral-400 leading-relaxed">
                  The complete Kotlin files are structured under <code className="text-neutral-200">com.potato.dialer</code>, enforcing <code className="text-neutral-200">foregroundServiceType="phoneCall"</code>, <code className="text-neutral-200">NotificationCompat.FLAG_ONGOING_EVENT</code>, and zero memory leaks.
                </p>
              </div>
            </div>
          </div>
        )}

        {mainView === 'CODE' && (
          <div className="h-[750px]">
            <CodeViewer />
          </div>
        )}

        {mainView === 'SPECS' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-8 max-w-4xl mx-auto shadow-2xl">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">
                <CheckCircle2 size={14} /> Senior Native Android Architecture
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Potato-Spec AOSP Telecom Architecture &amp; Ghost Call Elimination
              </h2>
              <p className="text-neutral-400 text-sm mt-1 leading-relaxed">
                Comprehensive technical breakdown for deploying a low-overhead, zero-bloat Phone/Dialer app across Android 10 (API 29) to Android 15 (API 35).
              </p>
            </div>

            {/* Spec 1: Telecom Subsystem & InCallService */}
            <div className="space-y-3 border-t border-neutral-800 pt-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity size={18} className="text-sky-400" />
                1. Telecom Subsystem &amp; Custom InCallService
              </h3>
              <p className="text-neutral-300 text-xs leading-relaxed">
                When registered as the device's Default Phone App via <code className="text-neutral-100 font-mono">RoleManager.ROLE_DIALER</code>, the AOSP Telecom framework automatically binds to our declared <code className="text-neutral-100 font-mono">InCallService</code> (<code className="text-neutral-100 font-mono">CallService.kt</code>).
              </p>
              <ul className="list-disc pl-5 text-xs text-neutral-400 space-y-1">
                <li><strong className="text-neutral-200">onCallAdded(call)</strong>: Registers <code className="text-neutral-200">Call.Callback</code>, pushes instance to thread-safe <code className="text-neutral-200">CallManager</code>, and boots <code className="text-neutral-200">InCallActivity</code>.</li>
                <li><strong className="text-neutral-200">onCallRemoved(call)</strong>: Unregisters callbacks, invokes <code className="text-neutral-200">stopForeground(STOP_FOREGROUND_REMOVE)</code>, cancels notification ID 1001, and unreferences Call to prevent memory leaks.</li>
                <li><strong className="text-neutral-200">onCallAudioStateChanged(audioState)</strong>: Routes audio through Earpiece, Speakerphone, or Bluetooth headset.</li>
              </ul>
            </div>

            {/* Spec 2: Ghost Call Elimination */}
            <div className="space-y-3 border-t border-neutral-800 pt-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldAlert size={18} className="text-red-400" />
                2. Elimination of the "Ghost Call / Stuck in Background" Bug
              </h3>
              <p className="text-neutral-300 text-xs leading-relaxed">
                In many poorly architected dialers, calls can get stuck in the background when the user closes the activity, leaving the microphone open or telecom audio active without any way to hang up. Our implementation enforces:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <h4 className="font-bold text-white mb-1">Explicit Foreground Promotion</h4>
                  <p className="text-neutral-400 leading-relaxed">
                    Immediately calls <code className="text-neutral-200 font-mono">startForeground(NOTIFICATION_ID, notification, FOREGROUND_SERVICE_TYPE_PHONE_CALL)</code>. Android 14+ strict requirements are met.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <h4 className="font-bold text-white mb-1">Direct Hang Up Action</h4>
                  <p className="text-neutral-400 leading-relaxed">
                    A prominent "Hang Up" button in the notification tray fires a <code className="text-neutral-200 font-mono">BroadcastReceiver</code> with a <code className="text-neutral-200 font-mono">FLAG_IMMUTABLE</code> PendingIntent. Works even if the UI activity has been killed by the system!
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <h4 className="font-bold text-white mb-1">Non-Dismissible Lock</h4>
                  <p className="text-neutral-400 leading-relaxed">
                    Set with <code className="text-neutral-200 font-mono">setOngoing(true)</code>, <code className="text-neutral-200 font-mono">NotificationCompat.FLAG_ONGOING_EVENT</code>, and <code className="text-neutral-200 font-mono">PRIORITY_MAX</code> so the user cannot accidentally swipe it away.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <h4 className="font-bold text-white mb-1">Guaranteed Teardown</h4>
                  <p className="text-neutral-400 leading-relaxed">
                    Guaranteed call to <code className="text-neutral-200 font-mono">stopForeground(STOP_FOREGROUND_REMOVE)</code> on state disconnected or call removed, preventing zombie notifications.
                  </p>
                </div>
              </div>
            </div>

            {/* Spec 3: Potato-Spec Zero-RAM Optimization */}
            <div className="space-y-3 border-t border-neutral-800 pt-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Cpu size={18} className="text-emerald-400" />
                3. Potato-Spec Optimization (&lt; 15MB RAM Idle Consumption)
              </h3>
              <p className="text-neutral-300 text-xs leading-relaxed">
                Engineered for ultra low-spec Android Go and legacy AOSP devices:
              </p>
              <ul className="list-disc pl-5 text-xs text-neutral-400 space-y-1.5">
                <li><strong className="text-neutral-200">Zero-Allocation T9 Search</strong>: Uses a static lookup array for <code className="text-neutral-200">charArrayOf</code> mappings; no Regex patterns, String formatting, or temporary list allocations during rapid keypad typing.</li>
                <li><strong className="text-neutral-200">Immutable State Models</strong>: <code className="text-neutral-200">CallUiState</code> uses primitive types (<code className="text-neutral-200">Int, Long, Boolean</code>) to avoid boxing and prevent unnecessary Jetpack Compose recomposition passes.</li>
                <li><strong className="text-neutral-200">Proximity WakeLock</strong>: Acquires <code className="text-neutral-200">PROXIMITY_SCREEN_OFF_WAKE_LOCK</code> in InCallActivity to turn the display off during cheek contact, saving battery and preventing accidental screen touches.</li>
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 bg-neutral-900/60 py-3 px-6 text-center text-xs text-neutral-500">
        PotatoDialer AOSP Native Architecture • Production Kotlin &amp; Jetpack Compose • Target SDK 35 (Android 15) • Min SDK 29 (Android 10)
      </footer>
    </div>
  );
}
