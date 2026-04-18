import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { PdfConverter } from './components/tools/PdfConverter';
import { ImageUtils } from './components/tools/ImageUtils';
import { VideoUtils } from './components/tools/VideoUtils';
import { AudioUtils } from './components/tools/AudioUtils';
import { SocialDownloader } from './components/tools/SocialDownloader';
import { SplashScreen } from './components/SplashScreen';
import { ArrowLeft } from 'lucide-react';

function App() {
  const [activeTool, setActiveTool] = useState(null);
  const [showSplash, setShowSplash] = useState(true);

  const renderTool = () => {
    switch (activeTool) {
      case 'pdf-convert':
        return <PdfConverter />;
      case 'image-tools':
        return <ImageUtils />;
      case 'video-tools':
        return <VideoUtils />;
      case 'audio-tools':
        return <AudioUtils />;
      case 'social-download':
        return <SocialDownloader />;
      default:
        return <Dashboard onSelectTool={setActiveTool} />;
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-black text-gray-100 flex flex-col relative">
      {/* Starting Animation / Splash Screen */}
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      {/* Dynamic Top Bar */}
      {activeTool && (
        <div className="h-16 bg-green-950/20 backdrop-blur-md border-b border-green-500/20 flex items-center px-6 shrink-0 z-50">
          <button 
            onClick={() => setActiveTool(null)}
            className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors py-2 px-4 rounded-lg hover:bg-green-500/10"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold text-lg">Back to Dashboard</span>
          </button>
        </div>
      )}
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto relative z-10">
        {renderTool()}
      </div>
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
}

export default App;
