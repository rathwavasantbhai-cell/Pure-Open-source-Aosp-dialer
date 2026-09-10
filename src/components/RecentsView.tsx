import React, { useState } from 'react';
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Clock } from 'lucide-react';
import { CallLogItem, CallDirection } from '../types';
import { MonetTheme } from '../utils/monetThemes';

interface RecentsViewProps {
  theme: MonetTheme;
  callLogs: CallLogItem[];
  onStartCall: (name: string, number: string) => void;
}

export const RecentsView: React.FC<RecentsViewProps> = ({
  theme,
  callLogs,
  onStartCall,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'MISSED'>('ALL');

  const filteredLogs = filter === 'ALL'
    ? callLogs
    : callLogs.filter(item => item.direction === 'MISSED');

  const formatTimestamp = (time: number) => {
    const diffMins = Math.floor((Date.now() - time) / (1000 * 60));
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const formatDuration = (seconds: number) => {
    if (seconds <= 0) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins > 0 ? `${mins}m ` : ''}${secs}s`;
  };

  const renderDirectionIcon = (direction: CallDirection) => {
    switch (direction) {
      case 'INCOMING':
        return <PhoneIncoming size={16} className="text-emerald-600" />;
      case 'OUTGOING':
        return <PhoneOutgoing size={16} className="text-sky-600" />;
      case 'MISSED':
        return <PhoneMissed size={16} className="text-red-500" />;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden select-none">
      {/* Top Header & Filter Chips */}
      <div className="p-4 border-b border-black/5" style={{ backgroundColor: theme.surface }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold tracking-tight" style={{ color: theme.onSurface }}>
            Recents
          </h2>
          <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: theme.surfaceContainerHigh, color: theme.onSurfaceVariant }}>
            {filteredLogs.length} calls
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2">
          <button
            id="filter-all-calls"
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
              filter === 'ALL' ? 'shadow-xs' : 'opacity-70'
            }`}
            style={{
              backgroundColor: filter === 'ALL' ? theme.primary : theme.surfaceContainer,
              color: filter === 'ALL' ? theme.onPrimary : theme.onSurfaceVariant,
            }}
          >
            All Calls
          </button>
          <button
            id="filter-missed-calls"
            onClick={() => setFilter('MISSED')}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
              filter === 'MISSED' ? 'shadow-xs' : 'opacity-70'
            }`}
            style={{
              backgroundColor: filter === 'MISSED' ? '#ef4444' : theme.surfaceContainer,
              color: filter === 'MISSED' ? '#ffffff' : theme.onSurfaceVariant,
            }}
          >
            Missed Only
          </button>
        </div>
      </div>

      {/* Recents Call List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
        {filteredLogs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center" style={{ color: theme.onSurfaceVariant }}>
            <Clock size={36} className="mb-2 opacity-40" />
            <p className="text-sm font-medium">No call history found</p>
            <p className="text-xs opacity-70">Calls you place or receive will show here</p>
          </div>
        ) : (
          filteredLogs.map(log => {
            const isMissed = log.direction === 'MISSED';
            return (
              <div
                key={log.id}
                id={`call-log-${log.id}`}
                className="group flex items-center justify-between p-3 rounded-2xl transition-colors hover:opacity-90"
                style={{ backgroundColor: theme.surfaceContainer }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl" style={{ backgroundColor: theme.surfaceContainerHigh }}>
                    {renderDirectionIcon(log.direction)}
                  </div>
                  <div>
                    <div
                      className={`text-sm font-semibold leading-tight ${isMissed ? 'text-red-500 font-bold' : ''}`}
                      style={{ color: isMissed ? undefined : theme.onSurface }}
                    >
                      {log.name || log.number}
                    </div>
                    <div className="flex items-center gap-2 text-xs mt-0.5" style={{ color: theme.onSurfaceVariant }}>
                      <span>{log.number}</span>
                      <span>•</span>
                      <span>{formatTimestamp(log.timestamp)}</span>
                      {log.durationSeconds > 0 && (
                        <>
                          <span>•</span>
                          <span>{formatDuration(log.durationSeconds)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  id={`btn-callback-${log.id}`}
                  onClick={() => onStartCall(log.name, log.number)}
                  className="p-2.5 rounded-full transition-transform active:scale-90 hover:opacity-80"
                  style={{
                    backgroundColor: theme.primaryContainer,
                    color: theme.onPrimaryContainer,
                  }}
                  title="Call back"
                >
                  <Phone size={18} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
