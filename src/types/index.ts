export type CallDirection = 'INCOMING' | 'OUTGOING' | 'MISSED';

export interface CallLogItem {
  id: string;
  name: string;
  number: string;
  timestamp: number;
  durationSeconds: number;
  direction: CallDirection;
}

export interface Contact {
  id: string;
  name: string;
  number: string;
  avatarColor: string;
  lastCalled?: string;
}

export type TelecomCallState =
  | 'IDLE'
  | 'DIALING'
  | 'RINGING'
  | 'ACTIVE'
  | 'HOLDING'
  | 'DISCONNECTING'
  | 'DISCONNECTED';

export type AudioRoute = 'EARPIECE' | 'SPEAKER' | 'BLUETOOTH';

export interface ActiveCallInfo {
  id: string;
  name: string;
  number: string;
  state: TelecomCallState;
  startTime: number;
  durationSeconds: number;
  isMuted: boolean;
  audioRoute: AudioRoute;
  isOnHold: boolean;
  hasForegroundService: boolean;
  notificationDismissible: boolean;
  avatarColor: string;
}

export interface AndroidCodeFile {
  filename: string;
  path: string;
  language: 'kotlin' | 'xml' | 'gradle';
  description: string;
  content: string;
}
