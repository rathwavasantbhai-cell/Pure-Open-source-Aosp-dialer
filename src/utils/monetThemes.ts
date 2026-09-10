export interface MonetTheme {
  id: string;
  name: string;
  primary: string;
  primaryContainer: string;
  onPrimary: string;
  onPrimaryContainer: string;
  surface: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  onSurface: string;
  onSurfaceVariant: string;
  outline: string;
  keypadBg: string;
  keypadHover: string;
  endCallBg: string;
  answerBg: string;
}

export const MONET_THEMES: MonetTheme[] = [
  {
    id: 'ocean-blue',
    name: 'Pixel Ocean (Blue)',
    primary: '#1a73e8',
    primaryContainer: '#d3e3fd',
    onPrimary: '#ffffff',
    onPrimaryContainer: '#041e49',
    surface: '#f8fafd',
    surfaceContainer: '#edf2fa',
    surfaceContainerHigh: '#e3ebf7',
    onSurface: '#191c20',
    onSurfaceVariant: '#44474f',
    outline: '#74777f',
    keypadBg: '#e9f1fc',
    keypadHover: '#dce8f9',
    endCallBg: '#dc2626',
    answerBg: '#16a34a',
  },
  {
    id: 'forest-moss',
    name: 'AOSP Moss (Sage)',
    primary: '#2d6a4f',
    primaryContainer: '#d8f3dc',
    onPrimary: '#ffffff',
    onPrimaryContainer: '#081c15',
    surface: '#f7faf8',
    surfaceContainer: '#eef5f0',
    surfaceContainerHigh: '#e2ede5',
    onSurface: '#191c1a',
    onSurfaceVariant: '#404943',
    outline: '#707973',
    keypadBg: '#e6f0e9',
    keypadHover: '#d8e6dc',
    endCallBg: '#dc2626',
    answerBg: '#16a34a',
  },
  {
    id: 'terracotta-earth',
    name: 'Lineage Earth (Warm)',
    primary: '#b05730',
    primaryContainer: '#ffdbcf',
    onPrimary: '#ffffff',
    onPrimaryContainer: '#380d00',
    surface: '#fff8f6',
    surfaceContainer: '#faeee9',
    surfaceContainerHigh: '#f3e3dc',
    onSurface: '#221915',
    onSurfaceVariant: '#53433e',
    outline: '#85736d',
    keypadBg: '#fae9e2',
    keypadHover: '#f5dad0',
    endCallBg: '#dc2626',
    answerBg: '#16a34a',
  },
  {
    id: 'berry-violet',
    name: 'Material Lavender',
    primary: '#6b4fa2',
    primaryContainer: '#eedcff',
    onPrimary: '#ffffff',
    onPrimaryContainer: '#260b54',
    surface: '#faf7fd',
    surfaceContainer: '#f2ecf8',
    surfaceContainerHigh: '#e9e0f2',
    onSurface: '#1d1a22',
    onSurfaceVariant: '#4a4453',
    outline: '#7b7485',
    keypadBg: '#ede5f5',
    keypadHover: '#e1d4ee',
    endCallBg: '#dc2626',
    answerBg: '#16a34a',
  },
  {
    id: 'amoled-dark',
    name: 'AMOLED Potato Saver',
    primary: '#8ab4f8',
    primaryContainer: '#1f2b3e',
    onPrimary: '#002f66',
    onPrimaryContainer: '#d3e3fd',
    surface: '#0f141c',
    surfaceContainer: '#171e29',
    surfaceContainerHigh: '#212937',
    onSurface: '#e1e2e8',
    onSurfaceVariant: '#c4c6cf',
    outline: '#8e9099',
    keypadBg: '#1a2230',
    keypadHover: '#253043',
    endCallBg: '#ef4444',
    answerBg: '#22c55e',
  }
];
