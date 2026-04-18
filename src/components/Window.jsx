import React from 'react';
import { Rnd } from 'react-rnd';
import { Minus, Square, X } from 'lucide-react';
import { useOS } from '../context/OSContext';

export const Window = ({ windowData }) => {
  const { apps, activeWindowId, closeWindow, minimizeWindow, maximizeWindow, focusWindow } = useOS();
  const app = apps.find(a => a.id === windowData.appId);
  
  if (!app || windowData.isMinimized) return null;

  const isActive = activeWindowId === windowData.id;
  const isMaximized = windowData.isMaximized;

  return (
    <Rnd
      default={{
        x: Math.random() * 100 + 50,
        y: Math.random() * 100 + 50,
        width: 600,
        height: 400,
      }}
      minWidth={300}
      minHeight={200}
      bounds="parent"
      disableDragging={isMaximized}
      enableResizing={!isMaximized}
      size={isMaximized ? { width: '100%', height: 'calc(100% - 48px)' } : undefined}
      position={isMaximized ? { x: 0, y: 0 } : undefined}
      onMouseDown={() => focusWindow(windowData.id)}
      onDragStart={() => focusWindow(windowData.id)}
      dragHandleClassName="window-drag-handle"
      className={`absolute flex flex-col rounded-xl overflow-hidden glass shadow-2xl transition-shadow ${isActive ? 'z-50 shadow-black/50' : 'z-10 shadow-black/20'}`}
      style={{ zIndex: isActive ? 50 : 10 }}
    >
      {/* Title Bar */}
      <div 
        className="window-drag-handle flex items-center justify-between px-4 py-2 bg-white/50 dark:bg-black/50 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 select-none cursor-move"
        onDoubleClick={() => maximizeWindow(windowData.id)}
      >
        <div className="flex items-center space-x-2 text-gray-800 dark:text-gray-200">
          <app.icon size={16} />
          <span className="text-sm font-medium">{app.name}</span>
        </div>
        
        <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
          <button onClick={() => minimizeWindow(windowData.id)} className="hover:text-blue-500 transition-colors">
            <Minus size={16} />
          </button>
          <button onClick={() => maximizeWindow(windowData.id)} className="hover:text-green-500 transition-colors">
            <Square size={14} />
          </button>
          <button onClick={() => closeWindow(windowData.id)} className="hover:text-red-500 transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* App Content */}
      <div className="flex-1 overflow-auto bg-white/90 dark:bg-[#1e1e1e]/90">
        <app.component />
      </div>
    </Rnd>
  );
};
