import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { useDropzone } from 'react-dropzone';
import { Video, Music, Scissors, UploadCloud, Download, X, Settings2, Crop as CropIcon } from 'lucide-react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// Local dependencies loaded directly via Vite avoiding deep imports
import coreURL from '@ffmpeg/core?url';
import wasmURL from '@ffmpeg/core/wasm?url';
import workerURL from '@ffmpeg/ffmpeg/worker?url';

export function VideoUtils() {
  const [ffmpeg, setFfmpeg] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingLog, setLoadingLog] = useState('');
  
  const [file, setFile] = useState(null);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const [fileUrl, setFileUrl] = useState(null);
  const [crop, setCrop] = useState(null);
  const [completedCrop, setCompletedCrop] = useState(null);
  const videoRef = useRef(null);


  useEffect(() => {
    // We only load ffmpeg once
    const load = async () => {
      setIsLoading(true);
      try {
        const fg = new FFmpeg();
        fg.on('log', ({ message }) => {
          setLoadingLog(message);
        });
        fg.on('progress', ({ progress, time }) => {
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
        setLoadingLog('Failed to load FFmpeg. Check console for COOP/COEP header errors.');
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
    setCrop(null);
    setCompletedCrop(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/*': ['.mp4', '.webm', '.mkv', '.avi', '.mov'] },
    maxFiles: 1
  });

  const clearFile = () => {
    setFile(null);
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    setFileUrl(null);
    setProcessedUrl(null);
    setProgress(0);
    setCrop(null);
    setCompletedCrop(null);
  };

  const executeFFmpeg = async () => {
    if (!ffmpeg || !file) return;
    setIsProcessing(true);
    setProgress(0);
    setProcessedUrl(null);

    try {
      // 1. Write file to internal FS
      await ffmpeg.writeFile('input_video', await fetchFile(file));
      
      let outName = `cropped_${Date.now()}.mp4`;
      let args = ['-i', 'input_video'];

      // 2. Add arguments based on selected tool
      if (completedCrop && videoRef.current && completedCrop.width > 0 && completedCrop.height > 0) {
         // visual cropping calculations
         const scaleX = videoRef.current.videoWidth / videoRef.current.clientWidth;
         const scaleY = videoRef.current.videoHeight / videoRef.current.clientHeight;
         const finalX = Math.round(completedCrop.x * scaleX);
         const finalY = Math.round(completedCrop.y * scaleY);
         const finalW = Math.round(completedCrop.width * scaleX);
         const finalH = Math.round(completedCrop.height * scaleY);
         
         args.push('-vf', `crop=${finalW}:${finalH}:${finalX}:${finalY}`);
      } else {
         args.push('-c', 'copy'); // Copy streams without re-encoding if not cropping
      }
      args.push(outName);

      // 3. Execute
      await ffmpeg.exec(args);

      // 4. Read output
      const data = await ffmpeg.readFile(outName);
      let mimeType = 'video/mp4';
      if (outName.endsWith('mp3')) mimeType = 'audio/mp3';
      else if (outName.endsWith('webm')) mimeType = 'video/webm';
      else if (outName.endsWith('mkv')) mimeType = 'video/x-matroska';

      const blob = new Blob([data.buffer], { type: mimeType });
      setProcessedUrl({ url: URL.createObjectURL(blob), name: outName, isAudio: mimeType.startsWith('audio') });

    } catch (err) {
       console.error("FFMPEG execution failed", err);
       alert("Error processing video. Check console.");
    } finally {
      setIsProcessing(false);
    }
  };




  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 relative z-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-3">
          Video Cropper
        </h1>
        <p className="text-gray-300">Advanced spatial video cropping entirely inside the browser.</p>
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
              <Video className="w-16 h-16 mb-4 text-green-700/50" />
              <p className="text-xl font-semibold mb-2 text-green-400">Drag & Drop Video Here</p>
            </div>
          )}

          {file && fileUrl && (
            <div className="relative h-full flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-full bg-gray-950 rounded-xl overflow-hidden border border-green-500/20 relative group flex items-center justify-center shadow-inner shadow-green-500/10">
                 <ReactCrop 
                    crop={crop} 
                    onChange={c => setCrop(c)} 
                    onComplete={c => setCompletedCrop(c)}
                    className="max-h-[50vh]"
                 >
                    <video 
                       ref={videoRef}
                       src={fileUrl} 
                       className="max-h-[50vh] w-auto max-w-full outline-none" 
                       controls 
                       controlsList="nodownload pwa"
                    />
                 </ReactCrop>
                <button
                  onClick={clearFile}
                  className="absolute top-4 right-4 p-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-white transition-all shadow-lg z-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Controls */}
        <div className="bg-black/60 border border-green-500/20 rounded-3xl p-6 shadow-xl flex flex-col gap-6">
          <div className="flex-1 flex flex-col gap-4 text-green-100">
              <div className="animate-fade-in grid gap-4">
                 <div className="pt-2">
                   <label className="flex items-center gap-2 text-md font-semibold text-green-300 mb-4">
                     <CropIcon className="w-5 h-5" /> Visual Spatial Crop
                   </label>
                   
                   <div className="bg-green-900/10 border border-green-500/20 p-4 rounded-xl">
                      {completedCrop && completedCrop.width > 0 ? (
                         <div className="text-sm">
                           <p className="text-green-400 font-bold mb-1">Crop Area Selected:</p>
                           <ul className="text-gray-300 list-disc list-inside">
                             <li>Width: {Math.round(completedCrop.width * (videoRef.current?.videoWidth / videoRef.current?.clientWidth || 1))}px</li>
                             <li>Height: {Math.round(completedCrop.height * (videoRef.current?.videoHeight / videoRef.current?.clientHeight || 1))}px</li>
                           </ul>
                         </div>
                      ) : (
                         <p className="text-sm text-gray-400">
                           Draw a box on the video preview (left) to select the area you want to crop. Leave unselected to keep original dimensions.
                         </p>
                      )}
                   </div>
                   
                   <p className="text-xs text-green-800 mt-4">Draw and adjust the rectangle directly on your video. The Neural Engine will calculate precise spatial coordinates automatically.</p>
                 </div>
              </div>
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
                
                {processedUrl.isAudio ? (
                  <audio src={processedUrl.url} controls className="w-full mb-4 outline-none" />
                ) : (
                  <video src={processedUrl.url} controls className="w-full mb-4 max-h-48 rounded bg-black outline-none" />
                )}

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
