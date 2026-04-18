import React, {useMemo} from 'react';
import { useOS } from '../context/OSContext';

export const StartMenu = ({ onClose }) => {
  const { apps, openApp } = useOS();

  const groupedApps = useMemo(() => {
    return apps.reduce((acc, app) => {
      if (!acc[app.category]) acc[app.category] = [];
      acc[app.category].push(app);
      return acc;
    }, {});
  }, [apps]);

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div 
        className="absolute bottom-14 left-2 w-96 max-h-[80vh] bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-3xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
        style={{ animation: 'slideUp 0.2s ease-out' }}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <input 
            type="text" 
            placeholder="Type to search..." 
            className="w-full bg-black/5 dark:bg-white/10 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200"
          />
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {Object.entries(groupedApps).map(([category, categoryApps]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                {category}
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {categoryApps.map(app => (
                  <button
                    key={app.id}
                    onClick={() => {
                      openApp(app.id);
                      onClose();
                    }}
                    className="flex flex-col items-center group"
                  >
                    <div className="w-12 h-12 flex items-center justify-center bg-white dark:bg-black/20 rounded-xl shadow-sm mb-2 group-hover:scale-110 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-all">
                      <app.icon className="text-gray-700 dark:text-gray-300 group-hover:text-blue-500" size={24} />
                    </div>
                    <span className="text-[10px] text-center text-gray-700 dark:text-gray-300 leading-tight">
                      {app.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-black/20 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              U
            </div>
            <span className="text-sm font-medium dark:text-white">User</span>
          </div>
        </div>
      </div>
    </>
  );
};
