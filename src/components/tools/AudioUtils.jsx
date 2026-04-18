import React, { useState, useEffect, useCallback } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { useDropzone } from 'react-dropzone';
import { Music, Scissors, Download, X, Settings2, Volume2, FileAudio } from 'lucide-react';

// Local dependencies loaded directly via Vite avoiding deep imports
import coreURL from '@ffmpeg/core?url';
import wasmURL from '@ffmpeg/core/wasm?url';
import workerURL from '@ffmpeg/ffmpeg/worker?url';

export function AudioUtils() {
  const [ffmpeg, setFfmpeg] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingLog, setLoadingLog] = useState('');
  
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('trim'); // trim | convert | volume

  // Tool specific configurations
  const [trimStart, setTrimStart] = useState('00:00:00');
  const [trimEnd, setTrimEnd] = useState('');
  const [outputFormat, setOutputFormat] = useState('mp3');
  const [volume, setVolume] = useState('1.5'); // multiplier, e.g., 1.5 = 150%

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const fg = new FFmpeg();
        fg.on('log', ({ message }) => {
          setLoadingLog(message);
        });
        fg.on('progress', ({ progress }) => {
          setProgress(Math.round(progress * 100));
        });

        await fg.load({
          coreURL: coreURL,
          wasmURL: wasmURL,
          classWorkerURL: workerURL,
        });
        setFfmpeg(fg);
        setIsLoaded(true);
      } catch (err) {
        console.error(err);
        setLoadingLog('Failed to load FFmpeg.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setFileUrl(URL.createObjectURL(selectedFile));
    setProcessedUrl(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'audio/*': ['.mp3', '.wav', '.ogg', '.m4a', '.flac'] },
    maxFiles: 1
  });

  const clearFile = () => {
    setFile(null);
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    setFileUrl(null);
    setProcessedUrl(null);
    setProgress(0);
  };

  const executeFFmpeg = async () => {
    if (!ffmpeg || !file) return;
    setIsProcessing(true);
    setProgress(0);
    setProcessedUrl(null);

    try {
      // Get the original extension to pass properly to ffmpeg if needed, but 'input_audio' usually works with probing
      await ffmpeg.writeFile('input_audio', await fetchFile(file));
      
      let outName = 'output';
      let args = ['-i', 'input_audio'];

      if (activeTab === 'trim') {
        outName = `trimmed_${Date.now()}.${file.name.split('.').pop() || 'mp3'}`;
        if (trimStart !== '00:00:00' && trimStart !== '') {
          args.unshift('-ss', trimStart);
        }
        if (trimEnd !== '') {
          args.push('-to', trimEnd);
        }
        args.push('-c', 'copy');
        args.push(outName);

      } else if (activeTab === 'convert') {
        outName = `converted_${Date.now()}.${outputFormat}`;
        // Add specific encoders if needed, usually FFmpeg auto-detects based on extension
        if (outputFormat === 'mp3') {
           args.push('-c:a', 'libmp3lame', '-q:a', '2'); // VBR high quality
        } else if (outputFormat === 'ogg') {
           args.push('-c:a', 'libvorbis', '-q:a', '4');
        }
        args.push(outName);

      } else if (activeTab === 'volume') {
        outName = `vol_adjusted_${Date.now()}.${file.name.split('.').pop() || 'mp3'}`;
        args.push('-filter:a', `volume=${volume}`);
        args.push(outName);
      }

      await ffmpeg.exec(args);

      const data = await ffmpeg.readFile(outName);
      let mimeType = 'audio/mpeg';
      if (outName.endsWith('wav')) mimeType = 'audio/wav';
      else if (outName.endsWith('ogg')) mimeType = 'audio/ogg';
      else if (outName.endsWith('flac')) mimeType = 'audio/flac';
      else if (outName.endsWith('m4a')) mimeType = 'audio/mp4';

      const blob = new Blob([data.buffer], { type: mimeType });
      setProcessedUrl({ url: URL.createObjectURL(blob), name: outName });

    } catch (err) {
       console.error("FFMPEG execution failed", err);
       alert("Error processing audio. Check format support.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 relative z-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-3">
          Audio Utilities
        </h1>
        <p className="text-gray-300">Fast, local audio editing right inside your browser.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Uploader */}
        <div className="bg-black/60 border border-green-500/20 rounded-3xl p-6 shadow-xl flex flex-col">
          {!file && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all h-full min-h-[300px] flex flex-col items-center justify-center ${
                isDragActive ? 'border-green-500 bg-green-500/10' : 'border-gray-600 hover:border-gray-500 hover:bg-green-900/10'
              }`}
            >
              <input {...getInputProps()} />
              <Music className="w-16 h-16 mb-4 text-green-700/50" />
              <p className="text-xl font-semibold mb-2 text-green-400">Drag & Drop Audio Here</p>
            </div>
          )}

          {file && (
            <div className="relative h-full flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-full h-48 bg-gray-950 rounded-xl overflow-hidden border border-green-500/20 relative group flex flex-col items-center justify-center shadow-inner shadow-green-500/10 p-4">
                 <FileAudio className="w-16 h-16 text-green-500/50 mb-4" />
                 <p className="text-green-300 font-bold truncate max-w-[90%] text-center">{file.name}</p>
                 <audio src={fileUrl} controls className="w-full mt-4 h-10 outline-none" />
                 
                <button
                  onClick={clearFile}
                  className="absolute top-4 right-4 p-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-white transition-all shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Controls */}
        <div className="bg-black/60 border border-green-500/20 rounded-3xl p-6 shadow-xl flex flex-col gap-6">
          <div className="flex gap-2 bg-gray-950 p-2 rounded-xl mb-4">
             <button onClick={() => setActiveTab('trim')} className={`flex-1 flex justify-center items-center gap-2 py-2 rounded-lg font-bold text-sm ${activeTab === 'trim' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400'}`}>
                <Scissors className="w-4 h-4" /> Trim
             </button>
             <button onClick={() => setActiveTab('convert')} className={`flex-1 flex justify-center items-center gap-2 py-2 rounded-lg font-bold text-sm ${activeTab === 'convert' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400'}`}>
                <FileAudio className="w-4 h-4" /> Convert
             </button>
             <button onClick={() => setActiveTab('volume')} className={`flex-1 flex justify-center items-center gap-2 py-2 rounded-lg font-bold text-sm ${activeTab === 'volume' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400'}`}>
                <Volume2 className="w-4 h-4" /> Adjust Volume
             </button>
          </div>

          <div className="flex-1 flex flex-col gap-4 text-green-100">
            {activeTab === 'trim' && (
              <div className="animate-fade-in grid gap-4">
                 <div>
                   <label className="block text-sm font-semibold text-green-300 mb-2">Temporal Trim (Time)</label>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-gray-500">Start (HH:MM:SS)</span>
                        <input type="text" value={trimStart} onChange={(e) => setTrimStart(e.target.value)} placeholder="00:00:00" className="w-full bg-black/50 border border-green-500/30 rounded-lg px-3 py-2 font-mono outline-none" disabled={isProcessing}/>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">End (HH:MM:SS)</span>
                        <input type="text" value={trimEnd} onChange={(e) => setTrimEnd(e.target.value)} placeholder="00:00:15" className="w-full bg-black/50 border border-green-500/30 rounded-lg px-3 py-2 font-mono outline-none" disabled={isProcessing}/>
                      </div>
                   </div>
                   <p className="text-xs text-green-800 mt-4">Cull dead air by defining specific start and stop timestamps.</p>
                 </div>
              </div>
            )}

            {activeTab === 'convert' && (
              <div className="animate-fade-in grid gap-4">
                 <div>
                    <label className="block text-sm font-semibold text-green-300 mb-2">Target Format</label>
                    <select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)} className="w-full bg-black/50 border border-green-500/30 rounded-lg px-4 py-3 font-bold text-green-100 outline-none cursor-pointer" disabled={isProcessing}>
                       <option value="mp3">MP3 (.mp3)</option>
                       <option value="wav">WAV (.wav - Lossless)</option>
                       <option value="ogg">OGG (.ogg)</option>
                       <option value="flac">FLAC (.flac)</option>
                    </select>
                 </div>
                 <p className="text-xs text-green-800 mt-2">Transcode between lightweight and high-fidelity lossless formats natively in-browser.</p>
              </div>
            )}

            {activeTab === 'volume' && (
              <div className="animate-fade-in grid gap-4">
                 <div>
                    <label className="block text-sm font-semibold text-green-300 mb-2">Loudness Multiplier</label>
                    <div className="flex gap-4 items-center">
                       <input 
                         type="range" 
                         min="0.1" max="3" step="0.1" 
                         value={volume} 
                         onChange={(e) => setVolume(e.target.value)} 
                         className="flex-1 accent-green-500"
                         disabled={isProcessing}
                       />
                       <span className="font-mono text-green-400 bg-black/50 px-3 py-1 rounded-lg border border-green-500/20">{Number(volume).toFixed(1)}x</span>
                    </div>
                 </div>
                 <p className="text-xs text-green-800 mt-2">Boost or reduce native volume output. Over 2.0x may cause clipping or distortion.</p>
              </div>
            )}
          </div>

          {!processedUrl ? (
             <div className="mt-4">
              <button
                onClick={executeFFmpeg}
                disabled={!file || isProcessing || !isLoaded}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-black rounded-xl font-extrabold text-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)] disabled:opacity-50 transition-all relative overflow-hidden"
              >
                {(isProcessing || isLoading) && <div className="absolute inset-0 bg-green-400 opacity-20" style={{ width: `${progress}%`, transition: 'width 0.2s' }} />}
                {isProcessing || isLoading ? <Settings2 className="w-6 h-6 animate-spin relative z-10" /> : <Settings2 className="w-6 h-6 relative z-10" />}
                <span className="relative z-10">
                   {isLoading ? 'Booting Engine in Background...' : isProcessing ? `Executing... ${progress}%` : 'Execute Operation'}
                </span>
              </button>
             </div>
          ) : (
             <div className="mt-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-6 text-center animate-pulse-once">
                <p className="text-emerald-400 font-bold mb-4">Operation Successful!</p>
                
                <audio src={processedUrl.url} controls className="w-full mb-4 outline-none" />

                <a
                  href={processedUrl.url}
                  download={processedUrl.name}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg font-bold text-md flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all"
                >
                  <Download className="w-5 h-5" />
                  Save Output to Disk
                </a>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
