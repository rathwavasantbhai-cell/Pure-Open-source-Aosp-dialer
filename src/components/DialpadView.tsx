import React, { useState } from 'react';
import { Delete, Phone, User, Clock } from 'lucide-react';
import { MonetTheme } from '../utils/monetThemes';
import { Contact } from '../types';
import { playDtmfTone } from '../utils/audioTones';
import { searchContactsT9 } from '../utils/t9Search';

interface DialpadViewProps {
  theme: MonetTheme;
  contacts: Contact[];
  onStartCall: (name: string, number: string) => void;
}

const DIALPAD_KEYS = [
  { digit: '1', letters: ' ' },
  { digit: '2', letters: 'ABC' },
  { digit: '3', letters: 'DEF' },
  { digit: '4', letters: 'GHI' },
  { digit: '5', letters: 'JKL' },
  { digit: '6', letters: 'MNO' },
  { digit: '7', letters: 'PQRS' },
  { digit: '8', letters: 'TUV' },
  { digit: '9', letters: 'WXYZ' },
  { digit: '*', letters: '' },
  { digit: '0', letters: '+' },
  { digit: '#', letters: '' },
];

export const DialpadView: React.FC<DialpadViewProps> = ({
  theme,
  contacts,
  onStartCall,
}) => {
  const [dialDigits, setDialDigits] = useState<string>('');
  const matchedContacts = searchContactsT9(contacts, dialDigits);

  const handleDigitPress = (digit: string) => {
    playDtmfTone(digit);
    setDialDigits(prev => prev + digit);
  };

  const handleBackspace = () => {
    setDialDigits(prev => prev.slice(0, -1));
  };

  const handleLongPressZero = () => {
    playDtmfTone('0');
    setDialDigits(prev => (prev.endsWith('0') ? prev.slice(0, -1) + '+' : prev + '+'));
  };

  const handleCall = () => {
    if (!dialDigits.trim()) return;
    const match = matchedContacts[0];
    const name = match ? match.name : 'Unknown';
    onStartCall(name, dialDigits);
  };

  return (
    <div className="flex flex-col h-full justify-between select-none">
      {/* Top Display & T9 Search Area */}
      <div className="flex flex-col pt-3 px-4">
        {/* T9 Search Suggestions Banner */}
        {dialDigits.length > 0 && (
          <div
            id="t9-results-container"
            className="mb-3 max-h-32 overflow-y-auto rounded-2xl p-2 transition-all"
            style={{ backgroundColor: theme.surfaceContainerHigh }}
          >
            {matchedContacts.length > 0 ? (
              <div className="space-y-1">
                {matchedContacts.slice(0, 3).map(contact => (
                  <button
                    key={contact.id}
                    id={`t9-contact-${contact.id}`}
                    onClick={() => {
                      setDialDigits(contact.number);
                      onStartCall(contact.name, contact.number);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: theme.surface }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-xs"
                        style={{ backgroundColor: contact.avatarColor }}
                      >
                        {contact.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold" style={{ color: theme.onSurface }}>
                          {contact.name}
                        </div>
                        <div className="text-xs" style={{ color: theme.onSurfaceVariant }}>
                          {contact.number}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: theme.primaryContainer, color: theme.onPrimaryContainer }}>
                      T9 Match
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-xs text-center py-2 italic" style={{ color: theme.onSurfaceVariant }}>
                No contact matches "{dialDigits}"
              </div>
            )}
          </div>
        )}

        {/* Number Display Input & Backspace */}
        <div className="min-h-[56px] flex items-center justify-between px-2">
          <div className="flex-1 overflow-x-auto whitespace-nowrap text-center">
            {dialDigits ? (
              <span
                id="dialed-digits-display"
                className="text-3xl font-mono font-medium tracking-wider"
                style={{ color: theme.onSurface }}
              >
                {dialDigits}
              </span>
            ) : (
              <span className="text-sm italic" style={{ color: theme.onSurfaceVariant }}>
                Tap keys or type T9 name (e.g. 666 for Mom)
              </span>
            )}
          </div>

          {dialDigits.length > 0 && (
            <button
              id="btn-backspace"
              onClick={handleBackspace}
              onDoubleClick={() => setDialDigits('')}
              className="p-2.5 rounded-full hover:opacity-80 active:scale-90 transition-transform"
              style={{ color: theme.onSurfaceVariant }}
              title="Backspace (Double tap to clear all)"
            >
              <Delete size={22} />
            </button>
          )}
        </div>
      </div>

      {/* Dialpad Keys Grid (12 keys) */}
      <div className="px-6 py-2">
        <div className="grid grid-cols-3 gap-y-3.5 gap-x-6 max-w-[300px] mx-auto">
          {DIALPAD_KEYS.map(k => (
            <button
              key={k.digit}
              id={`dialkey-${k.digit}`}
              onClick={() => handleDigitPress(k.digit)}
              onContextMenu={e => {
                if (k.digit === '0') {
                  e.preventDefault();
                  handleLongPressZero();
                }
              }}
              className="w-18 h-18 mx-auto rounded-full flex flex-col items-center justify-center transition-all active:scale-95 shadow-xs border border-black/5"
              style={{
                backgroundColor: theme.keypadBg,
                color: theme.onSurface,
              }}
            >
              <span className="text-2xl font-semibold leading-none">{k.digit}</span>
              {k.letters && (
                <span
                  className="text-[10px] font-bold tracking-widest mt-0.5 leading-none opacity-70"
                  style={{ color: theme.onSurfaceVariant }}
                >
                  {k.letters}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Floating Green Call Button */}
      <div className="pb-4 pt-2 flex justify-center">
        <button
          id="btn-place-call"
          disabled={!dialDigits.trim()}
          onClick={handleCall}
          className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 disabled:opacity-30 disabled:scale-100"
          style={{
            backgroundColor: theme.answerBg,
            color: '#ffffff',
          }}
          title="Place Call"
        >
          <Phone size={28} className="fill-current" />
        </button>
      </div>
    </div>
  );
};
