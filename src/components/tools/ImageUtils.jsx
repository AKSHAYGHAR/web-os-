import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {
  Image as ImageIcon,
  UploadCloud,
  Download,
  X,
  Settings2,
  Sliders,
  Layers,
  Crop
} from 'lucide-react';

export function ImageUtils() {
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'bulk'

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 relative z-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-3">
          Advanced Image Lab
        </h1>
        <p className="text-gray-300 text-lg">Pro-grade photo editing and bulk processing right in your browser.</p>
      </div>

      <div className="flex justify-center mb-8 gap-4">
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
            activeTab === 'editor'
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
              : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
          }`}
        >
          <Sliders className="w-5 h-5" />
          Single Photo Editor
        </button>
        <button
          onClick={() => setActiveTab('bulk')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
            activeTab === 'bulk'
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
              : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
          }`}
        >
          <Layers className="w-5 h-5" />
          Bulk Processor
        </button>
      </div>

      {activeTab === 'editor' ? <SingleEditor /> : <BulkProcessor />}
    </div>
  );
}

// ----------------------------------------------------------------- //
//                      SINGLE IMAGE EDITOR                          //
// ----------------------------------------------------------------- //
function SingleEditor() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Edit State
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);

  // Output State
  const [compressionRatio, setCompressionRatio] = useState(0.8);
  const [maxWidth, setMaxWidth] = useState('');
  const [outputFormat, setOutputFormat] = useState('image/jpeg');

  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    const selected = acceptedFiles[0];
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      imageRef.current = img;
      updateCanvas();
    };
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 1
  });

  const clearFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
  };

  const updateCanvas = useCallback(() => {
    if (!imageRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    // Use full size for exact processing mapping preview
    canvas.width = img.width;
    canvas.height = img.height;

    // Apply Filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }, [brightness, contrast, saturation, blur]);

  useEffect(() => {
    updateCanvas();
  }, [brightness, contrast, saturation, blur, updateCanvas]);

  const processAndDownload = async () => {
    if (!canvasRef.current || !file) return;
    setIsProcessing(true);

    try {
      // 1. Get filtered blob from canvas to bake in the filters
      const blob = await new Promise((resolve) => {
         canvasRef.current.toBlob(resolve, 'image/jpeg', 1.0); // Grab untouched max quality filtered blob
      });
      
      const fileExt = outputFormat.split('/')[1];
      const tempFile = new File([blob], `temp.${fileExt}`, { type: 'image/jpeg' });

      // 2. Pass to compressor for sizing/formats
      const options = {
        maxSizeMB: 50, 
        maxWidthOrHeight: maxWidth ? parseInt(maxWidth, 10) : undefined,
        useWebWorker: true,
        initialQuality: parseFloat(compressionRatio),
        fileType: outputFormat,
      };

      const compressedFile = await imageCompression(tempFile, options);

      // Force format fallback if browser-image-compression ignored the format request
      let finalBlob = compressedFile;
      if (compressedFile.type !== outputFormat) {
          finalBlob = await convertFormatCanvas(compressedFile, outputFormat, parseFloat(compressionRatio));
      }

      // Download
      saveAs(finalBlob, `edited_${file.name.split('.')[0]}.${fileExt}`);

    } catch (err) {
      console.error(err);
      alert('Error editing image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const convertFormatCanvas = (blob, format, quality) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = img.width;
        c.height = img.height;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        c.toBlob((newBlob) => resolve(newBlob), format, quality);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(blob);
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Visual Workspace */}
      <div className="bg-black/60 border border-green-500/20 rounded-3xl p-6 shadow-xl flex flex-col gap-6">
        {!file && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 flex-1 flex flex-col items-center justify-center ${
              isDragActive ? 'border-green-500 bg-green-500/10' : 'border-gray-600 hover:border-gray-500 hover:bg-green-900/10'
            }`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="w-16 h-16 mx-auto mb-4 text-green-700/50" />
            <p className="text-xl font-semibold mb-2 text-green-400">Add an Image to Edit</p>
          </div>
        )}

        {file && (
          <div className="flex flex-col relative flex-1">
             <div className="w-full relative h-[400px] bg-gray-950 rounded-xl overflow-hidden border border-green-500/20 group flex items-center justify-center checkered-bg">
                {/* CSS checkerboard pattern for transparent regions */}
                <style>{`.checkered-bg { background-image: linear-gradient(45deg, #111 25%, transparent 25%), linear-gradient(-45deg, #111 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #111 75%), linear-gradient(-45deg, transparent 75%, #111 75%); background-size: 20px 20px; background-position: 0 0, 0 10px, 10px -10px, -10px 0px; }`}</style>
                <canvas 
                  ref={canvasRef} 
                  className="max-w-full max-h-full object-contain filter drop-shadow-[0_0_10px_rgba(52,211,153,0.15)] transition-all"
                />
                
                <button
                  onClick={clearFile}
                  className="absolute top-4 right-4 p-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-white transition-all shadow-lg opacity-0 group-hover:opacity-100"
                >
                  <X className="w-5 h-5" />
                </button>
             </div>
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div className="bg-black/60 border border-green-500/20 rounded-3xl p-6 shadow-xl flex flex-col gap-6 overflow-y-auto max-h-[600px]">
        <h2 className="text-2xl font-bold flex items-center gap-2 border-b border-green-500/20 pb-3 text-white">
          <Crop className="w-5 h-5 text-green-400"/> Tuning & Export
        </h2>
        
        {/* Filters Wrapper */}
        <div className="grid gap-4">
          <h3 className="text-green-400 font-bold text-sm tracking-widest uppercase">Visual Filters</h3>
          <div>
            <label className="flex justify-between text-sm text-green-100 mb-1">
              <span>Brightness</span>
              <span>{brightness}%</span>
            </label>
            <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(e.target.value)} className="w-full accent-green-500" disabled={!file} />
          </div>
          <div>
            <label className="flex justify-between text-sm text-green-100 mb-1">
              <span>Contrast</span>
              <span>{contrast}%</span>
            </label>
            <input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(e.target.value)} className="w-full accent-green-500" disabled={!file} />
          </div>
          <div>
            <label className="flex justify-between text-sm text-green-100 mb-1">
              <span>Saturation</span>
              <span>{saturation}%</span>
            </label>
            <input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturation(e.target.value)} className="w-full accent-green-500" disabled={!file} />
          </div>
          <div>
            <label className="flex justify-between text-sm text-green-100 mb-1">
              <span>Blur Radius</span>
              <span>{blur}px</span>
            </label>
            <input type="range" min="0" max="20" value={blur} onChange={(e) => setBlur(e.target.value)} className="w-full accent-green-500" disabled={!file} />
          </div>
        </div>

        {/* Compression Wrapper */}
        <div className="grid gap-4 mt-2">
          <h3 className="text-green-400 font-bold text-sm tracking-widest uppercase border-t border-green-500/20 pt-4">Export Properties</h3>
          <div>
            <label className="flex justify-between text-sm text-green-100 mb-1">
              <span>Quality Ratio</span>
              <span>{Math.round(compressionRatio * 100)}%</span>
            </label>
            <input type="range" min="0.1" max="1" step="0.1" value={compressionRatio} onChange={(e) => setCompressionRatio(e.target.value)} className="w-full accent-green-500" disabled={!file} />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-semibold text-green-300 mb-2">Max Width (px)</label>
                <input 
                  type="number"
                  placeholder="Original"
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(e.target.value)}
                  disabled={!file}
                  className="w-full bg-gray-950 border border-green-500/20 rounded-lg px-3 py-2 text-green-100 placeholder-green-800 focus:outline-none focus:border-green-500 transition-all text-sm"
                />
             </div>
             <div>
                <label className="block text-xs font-semibold text-green-300 mb-2">Output Format</label>
                <select 
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  disabled={!file}
                  className="w-full bg-gray-950 border border-green-500/20 rounded-lg px-3 py-2 text-green-100 focus:outline-none focus:border-green-500 transition-all text-sm cursor-pointer"
                >
                  <option value="image/jpeg">JPEG</option>
                  <option value="image/png">PNG</option>
                  <option value="image/webp">WEBP</option>
                </select>
             </div>
          </div>
        </div>

        <button
          onClick={processAndDownload}
          disabled={!file || isProcessing}
          className="mt-6 w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-black rounded-xl font-extrabold text-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isProcessing ? <Settings2 className="w-6 h-6 animate-spin" /> : <Download className="w-6 h-6" />}
          {isProcessing ? 'Baking Edits...' : 'Download Finished Image'}
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------- //
//                      BULK PROCESSOR                               //
// ----------------------------------------------------------------- //
function BulkProcessor() {
  const [images, setImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const [compressionRatio, setCompressionRatio] = useState(0.8);
  const [maxWidth, setMaxWidth] = useState('');
  const [outputFormat, setOutputFormat] = useState('image/jpeg');

  const onDrop = useCallback((acceptedFiles) => {
    const newImages = acceptedFiles.map(f => Object.assign(f, { preview: URL.createObjectURL(f) }));
    setImages(prev => [...prev, ...newImages]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }
  });

  const removeFile = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const processBulk = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    setProgress(0);
    
    try {
      const zip = new JSZip();
      
      const options = {
        maxSizeMB: 50,
        maxWidthOrHeight: maxWidth ? parseInt(maxWidth, 10) : undefined,
        useWebWorker: true,
        initialQuality: parseFloat(compressionRatio),
        fileType: outputFormat,
      };

      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        
        let compressed = await imageCompression(file, options);
        // Fallback convert if needed
        if (compressed.type !== outputFormat) {
          compressed = await convertFormatCanvas(compressed, outputFormat, parseFloat(compressionRatio));
        }

        const ext = outputFormat.split('/')[1];
        const baseName = file.name.split('.')[0] || `image_${i}`;
        zip.file(`${baseName}_processed.${ext}`, compressed);

        setProgress(Math.round(((i + 1) / images.length) * 100));
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, 'bulk_processed_images.zip');

    } catch (err) {
      console.error(err);
      alert('Error during bulk processing.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const convertFormatCanvas = (blob, format, quality) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = img.width;
        c.height = img.height;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        c.toBlob((newBlob) => resolve(newBlob), format, quality);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(blob);
    });
  };

  return (
    <div className="bg-black/60 border border-green-500/20 rounded-3xl p-6 shadow-xl flex flex-col gap-6">
      
      {/* Top Banner Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-green-950/20 p-6 rounded-2xl border border-green-500/10">
        <div>
           <label className="flex justify-between text-sm text-green-100 mb-2">
             <span>Universal Compression %</span>
             <span>{Math.round(compressionRatio * 100)}%</span>
           </label>
           <input type="range" min="0.1" max="1" step="0.1" value={compressionRatio} onChange={(e) => setCompressionRatio(e.target.value)} className="w-full accent-green-500" disabled={isProcessing} />
        </div>
        <div>
           <label className="block text-sm text-green-100 mb-2">Global Max Width (px)</label>
           <input type="number" placeholder="Leave blank to keep sizes" value={maxWidth} onChange={(e) => setMaxWidth(e.target.value)} disabled={isProcessing} className="w-full bg-black/50 border border-green-500/30 rounded-lg px-3 py-1.5 text-green-100 focus:outline-none focus:border-green-500" />
        </div>
        <div>
           <label className="block text-sm text-green-100 mb-2">Export Format All</label>
           <select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)} disabled={isProcessing} className="w-full bg-black/50 border border-green-500/30 rounded-lg px-3 py-1.5 text-green-100 focus:outline-none focus:border-green-500 cursor-pointer">
             <option value="image/jpeg">JPEG</option>
             <option value="image/png">PNG</option>
             <option value="image/webp">WEBP</option>
           </select>
        </div>
      </div>

      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
          isDragActive ? 'border-green-500 bg-green-500/10' : 'border-gray-600 hover:border-gray-500 hover:bg-green-900/10'
        }`}
      >
        <input {...getInputProps()} />
        <Layers className="w-12 h-12 mx-auto mb-3 text-green-700/50" />
        <p className="text-xl font-semibold mb-1 text-green-400">Drag & Drop Multiple Images Here</p>
        <p className="text-sm text-gray-400">Add 50+ images at once!</p>
      </div>

      {images.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center bg-gray-900 px-4 py-2 rounded-xl">
             <span className="text-green-300 font-bold">{images.length} Images Loaded</span>
             <button onClick={() => setImages([])} className="text-sm text-red-400 hover:text-red-300">Clear Queue</button>
          </div>
          
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 max-h-60 overflow-y-auto p-2">
            {images.map((file, idx) => (
              <div key={idx} className="aspect-square bg-black border border-green-500/20 rounded-xl relative group overflow-hidden">
                <img src={file.preview} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all" alt="thumb"/>
                <button onClick={(e) => { e.stopPropagation(); removeFile(idx); }} className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {!isProcessing ? (
            <button
              onClick={processBulk}
              className="mt-4 w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-black rounded-xl font-extrabold text-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
            >
              <Download className="w-6 h-6" /> Batch Process & Download ZIP
            </button>
          ) : (
            <div className="mt-4 bg-black/40 border border-green-500/30 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 animate-pulse" />
              <div className="relative z-10 flex flex-col items-center">
                <Settings2 className="w-8 h-8 animate-spin text-green-500 mb-2" />
                <h3 className="text-lg font-bold text-green-400 mb-2">Compressing Bulk Queue...</h3>
                <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-green-500 transition-all" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-emerald-300 font-semibold text-sm">{progress}% Complete</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
