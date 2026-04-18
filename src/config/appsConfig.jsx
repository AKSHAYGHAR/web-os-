import { 
  FolderIcon, 
  FileTextIcon, 
  WholeWordIcon, // using a substitute if unknown
  TypeIcon, 
  ImageIcon, 
  FileImageIcon, 
  BracesIcon, 
  CodeIcon, 
  PaletteIcon, 
  VideoIcon, 
  FilmIcon, 
  QrCodeIcon, 
  CalculatorIcon, 
  TimerIcon, 
  SettingsIcon 
} from 'lucide-react';
import * as Apps from '../apps';

export const APPS_CONFIG = [
  { id: 'file-explorer', name: 'File Explorer', category: 'File Management', icon: FolderIcon, component: Apps.FileExplorer },
  { id: 'notepad', name: 'Notepad', category: 'Text Tools', icon: FileTextIcon, component: Apps.AdvancedNotepad },
  { id: 'word-counter', name: 'Word Counter', category: 'Text Tools', icon: TypeIcon, component: Apps.WordCounter },
  { id: 'case-converter', name: 'Case Converter', category: 'Text Tools', icon: TypeIcon, component: Apps.CaseConverter },
  { id: 'image-compressor', name: 'Compressor', category: 'Image Tools', icon: ImageIcon, component: Apps.ImageCompressor },
  { id: 'svg-converter', name: 'SVG Converter', category: 'Image Tools', icon: FileImageIcon, component: Apps.SvgConverter },
  { id: 'json-formatter', name: 'JSON Formatter', category: 'Developer Tools', icon: BracesIcon, component: Apps.JsonFormatter },
  { id: 'html-encoder', name: 'HTML Encoder', category: 'Developer Tools', icon: CodeIcon, component: Apps.HtmlEncoder },
  { id: 'color-picker', name: 'Color Picker', category: 'Developer Tools', icon: PaletteIcon, component: Apps.ColorPicker },
  { id: 'screen-recorder', name: 'Recorder', category: 'Media Tools', icon: VideoIcon, component: Apps.ScreenRecorder },
  { id: 'video-gif', name: 'Video to GIF', category: 'Media Tools', icon: FilmIcon, component: Apps.VideoGifConverter },
  { id: 'qr-generator', name: 'QR Generator', category: 'Utility Tools', icon: QrCodeIcon, component: Apps.QrGenerator },
  { id: 'sip-calculator', name: 'SIP Calculator', category: 'Utility Tools', icon: CalculatorIcon, component: Apps.SipCalculator },
  { id: 'pomodoro', name: 'Pomodoro', category: 'Utility Tools', icon: TimerIcon, component: Apps.PomodoroTimer },
  { id: 'settings', name: 'Settings', category: 'System', icon: SettingsIcon, component: Apps.SystemSettings },
];
