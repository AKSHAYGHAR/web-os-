import React from 'react';
import { FileText, Image as ImageIcon, Video, Music, Download } from 'lucide-react';

export function Dashboard({ onSelectTool }) {
  const tools = [
    {
      id: 'pdf-convert',
      name: 'PDF Converter',
      description: 'Convert Images to PDF or Extract Pages from PDF.',
      icon: <FileText className="w-8 h-8 text-green-500" />
    },
    {
      id: 'image-tools',
      name: 'Image Utilities',
      description: 'Resize, Compress, and Convert Images.',
      icon: <ImageIcon className="w-8 h-8 text-green-400" />
    },
    {
      id: 'video-tools',
      name: 'Video Utilities',
      description: 'Trim, Compress, and Extract Audio.',
      icon: <Video className="w-8 h-8 text-emerald-400" />
    },
    {
      id: 'audio-tools',
      name: 'Audio Utilities',
      description: 'Convert, Merge, and Trim Audio.',
      icon: <Music className="w-8 h-8 text-emerald-500" />
    },
    {
      id: 'social-download',
      name: 'Video Downloader',
      description: 'Download videos from YouTube & Instagram.',
      icon: <Download className="w-8 h-8 text-cyan-500" />
    }
  ];

  return (
    <div className="w-full h-full p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-4">
            DOXMITECH Tools
          </h1>
          <p className="text-lg text-green-200/60 font-medium">
            A minimalist workspace for your everyday utility tools.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className="group bg-black/40 border border-green-500/20 rounded-2xl p-6 cursor-pointer hover:bg-green-950/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20"
            >
              <div className="w-16 h-16 rounded-2xl bg-black/60 shadow-inner shadow-green-500/10 border border-green-500/10 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300 group-hover:border-green-500/30">
                {tool.icon}
              </div>
              <h2 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">{tool.name}</h2>
              <p className="text-sm text-green-100/50">{tool.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
