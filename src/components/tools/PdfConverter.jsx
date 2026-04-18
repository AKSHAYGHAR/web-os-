import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { FileText, Image as ImageIcon, UploadCloud, Download, X, Settings2 } from 'lucide-react';

// Configure PDF.js worker
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export function PdfConverter() {
  const [activeTab, setActiveTab] = useState('img-to-pdf'); // 'img-to-pdf' or 'pdf-to-img'
  
  return (
    <div className="w-full max-w-5xl mx-auto p-8 relative z-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-3">
          PDF Converter Master
        </h1>
        <p className="text-gray-300 text-lg">Fast, secure, and purely client-side PDF conversions.</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8 gap-4">
        <button
          onClick={() => setActiveTab('img-to-pdf')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
            activeTab === 'img-to-pdf' 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30' 
              : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
          }`}
        >
          <ImageIcon className="w-5 h-5" />
          Image to PDF
        </button>
        <button
          onClick={() => setActiveTab('pdf-to-img')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
            activeTab === 'pdf-to-img' 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30' 
              : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
          }`}
        >
          <FileText className="w-5 h-5" />
          PDF to Image
        </button>
      </div>

      {/* Content */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
        {activeTab === 'img-to-pdf' ? <ImageToPdf /> : <PdfToImage />}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Component: Image to PDF
// ----------------------------------------------------
function ImageToPdf() {
  const [images, setImages] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(acceptedFiles => {
    const newImages = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    }
  });

  const removeImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const convertToPdf = async () => {
    if (images.length === 0) return;
    setIsConverting(true);
    setProgress(0);
    
    try {
      const pdfDoc = await PDFDocument.create();
      const totalSteps = images.length;
      
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        
        // Artificial delay for an engaging "premium" processing feel (User Requested)
        // If there are few images, we artificially wait longer to guarantee at least a smooth progress flow
        const delayMs = Math.max(800, 5000 / totalSteps); 
        await new Promise(resolve => setTimeout(resolve, delayMs));
        
        const currentProgress = Math.round(((i + 1) / totalSteps) * 100);
        setProgress(currentProgress);

        const imageBytes = await file.arrayBuffer();
        let image;
        
        if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
          image = await pdfDoc.embedJpg(imageBytes);
        } else if (file.type === 'image/png') {
          image = await pdfDoc.embedPng(imageBytes);
        } else {
          continue; // skip unsupported for now
        }

        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }

      await new Promise(resolve => setTimeout(resolve, 500)); // Final polish delay

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Converted_Images.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Error creating PDF. Please ensure you are using JPG or PNG images.');
    } finally {
      setIsConverting(false);
      setProgress(0);
    }
  };

  return (
    <div className="flex flex-col gap-6 relative">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragActive ? 'border-green-500 bg-green-500/10' : 'border-gray-500 hover:border-gray-400 hover:bg-white/5'
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <p className="text-xl font-semibold mb-2">Drag & Drop Images Here</p>
        <p className="text-sm text-gray-400">Supports JPG, PNG (Max 10MB per file)</p>
      </div>

      {images.length > 0 && (
        <div className="mt-4 shrink-0">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Selected Images ({images.length})</h3>
            <button 
              onClick={() => setImages([])}
              className="text-sm text-green-400 hover:text-green-300 underline"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((file, idx) => (
              <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square bg-black/60 border border-green-500/20">
                <img 
                  src={file.preview} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                  alt="preview"
                />
                <button 
                  onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                  className="absolute top-2 right-2 p-1 bg-red-500/80 hover:bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2 text-xs truncate text-green-200">
                  {file.name}
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar Overlay */}
          {isConverting && (
            <div className="mt-8 bg-black/40 border border-green-500/20 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 animate-pulse pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center">
                <Settings2 className="w-10 h-10 animate-spin text-green-500 mb-4" />
                <h3 className="text-xl font-bold text-green-400 mb-2">Processing Magic...</h3>
                <div className="w-full h-4 bg-gray-900 rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-emerald-300 font-semibold">{progress}% Completed</p>
              </div>
            </div>
          )}

          {!isConverting && (
            <div className="mt-8 flex justify-end">
              <button
                onClick={convertToPdf}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold text-lg flex items-center gap-2 shadow-xl hover:shadow-green-500/20 transition-all"
              >
                <Download className="w-6 h-6" />
                Convert & Download PDF
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// Component: PDF to Image
// ----------------------------------------------------
function PdfToImage() {
  const [pdfFile, setPdfFile] = useState(null);
  const [renderedPages, setRenderedPages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    setPdfFile(file);
    setRenderedPages([]);
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      const pages = [];

      // Render pages one by one to avoid locking the UI completely
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 }); // Higher scale for better quality
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport: viewport }).promise;
        pages.push(canvas.toDataURL('image/jpeg', 0.9));
        
        // Update UI progressively
        setRenderedPages(prev => [...prev, canvas.toDataURL('image/jpeg', 0.9)]);
      }

    } catch (err) {
      console.error(err);
      alert('Error parsing PDF file.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  const downloadImage = (dataUrl, pageNum) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `page_${pageNum}.jpg`;
    a.click();
  };

  return (
    <div className="flex flex-col gap-6">
      {!pdfFile && (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragActive ? 'border-emerald-500 bg-emerald-500/10' : 'border-gray-500 hover:border-gray-400 hover:bg-white/5'
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-xl font-semibold mb-2">Drag & Drop a PDF Here</p>
          <p className="text-sm text-gray-400">Select exactly one PDF file</p>
        </div>
      )}

      {pdfFile && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-green-300">
              Extracting: <span className="text-emerald-400">{pdfFile.name}</span>
            </h3>
            <button 
              onClick={() => { setPdfFile(null); setRenderedPages([]); }}
              className="text-sm text-green-500 hover:text-green-400 bg-green-500/10 hover:bg-green-500/20 px-4 py-2 rounded-lg transition-colors border border-green-500/20"
            >
              Select Different File
            </button>
          </div>

          {isProcessing && renderedPages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Settings2 className="w-12 h-12 animate-spin text-emerald-500 mb-4" />
              <p className="text-lg text-emerald-300">Parsing PDF...</p>
            </div>
          )}

          {renderedPages.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderedPages.map((dataUrl, idx) => (
                <div key={idx} className="bg-black/60 rounded-xl overflow-hidden border border-green-500/20 flex flex-col group hover:border-green-500/50 transition-colors">
                  <div className="w-full h-48 bg-gray-950 border-b border-green-500/20 overflow-hidden relative p-4">
                    <img 
                      src={dataUrl} 
                      className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(52,211,153,0.2)]" 
                      alt={`Page ${idx + 1}`} 
                    />
                  </div>
                  <div className="p-4 flex justify-between items-center bg-black/50">
                    <span className="font-medium text-green-400">Page {idx + 1}</span>
                    <button 
                      onClick={() => downloadImage(dataUrl, idx + 1)}
                      className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-black px-3 py-1.5 rounded-lg transition-colors text-sm font-bold"
                    >
                      <Download className="w-4 h-4" />
                      Save
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {isProcessing && renderedPages.length > 0 && (
             <div className="mt-8 text-center text-emerald-400 animate-pulse font-bold">
               Extracting more pages... ({renderedPages.length} rendered)
             </div>
          )}
        </div>
      )}
    </div>
  );
}
