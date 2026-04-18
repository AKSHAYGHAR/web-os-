<div align="center">
  <img src="./src/assets/hero.png" alt="Web OS Logo" width="120" />
  <h1>🌐 Web OS Framework</h1>
  <p><strong>A Next-Generation Desktop Environment Operating Entirely Within Your Web Browser</strong></p>

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  <br />
</div>

<hr />

## ✨ Overview

**Web OS** is a browser-based operating system UI simulator packed with a suite of incredibly powerful decentralized client-side utility tools. Built with a premium "Glassmorphism" aesthetic, it seamlessly translates the robust feel of a traditional desktop into a dynamic web page.

Instead of relying on slow backend servers to process files, **Web OS utilizes modern WebAssembly (WASM)** engines like `ffmpeg.wasm` to perform intensive video and audio operations directly rendering within the user's browser securely!

---

## 🚀 Key Features

### 🖥️ Desktop Interface (Window Management)
* **Draggable & Resizable:** Move utility windows fluidly across the canvas with custom grab handles. 
* **Z-Index Layering:** Just like a real Desktop, clicking a window brings it smoothly to the front.
* **Persistent Taskbar:** Features a live animated clock and active-task tracking for window minimization.
* **Aesthetic Glass UI:** Utilizing hyper-modern Tailwind CSS blur utilities to achieve premium transparency effects.

### 🛠️ Built-in App Ecosystem
1. **📽 Video Utilities (FFmpeg WASM)**
   * Lightning fast visual Drag & Drop video cropper.
   * Trim videos directly in your browser.
2. **🎵 Audio Processing Server**
   * High-fidelity formatting, volume tuning, and audio extracting using pure WASM. 
3. **📲 Social Media Pipeline**
   * Next-Gen video downloading backend proxy designed to fetch streams from YouTube natively under the hood. (Includes fallback error-handling for geo-blocked DNS limits).
4. **📸 Image Enhancer**
   * Resize, compress, and alter formats of images without ever uploading them to a third-party server.
5. **📄 PDF Architect**
   * Multi-file PDF manipulations, image-to-PDF merging built exactly for standard utility workflow.

---

## 🛠️ Technology Stack

* **Core Framework:** React 18, Vite (for blazing fast HMR)
* **Styling Engine:** Tailwind CSS v3 
* **Iconography:** Lucide-React
* **Media Processing Engines:** 
  * `@ffmpeg/ffmpeg` & `@ffmpeg/util` (Multi-thread WASM Processing)
  * `play-dl` (Native Video Stream Pipeline Extraction)
* **Server Middleware:** Custom Vite Configuration Proxy

---

## 📦 Local Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AKSHAYGHAR/web-os-.git
   cd web-os
   ```

2. **Install Local Dependencies:**
   ```bash
   npm install 
   # or
   yarn install
   ```

3. **Start the Web OS Environment:**
   ```bash
   npm run dev
   ```
   *Your terminal will launch a local proxy instance, navigating to `http://localhost:5173` will spin up the Desktop Framework.*

> **Warning regarding the Video Cropper:** FFmpeg WebAssembly requires Cross-Origin Isolation to function. If you deploy this project to Vercel/Netlify, you **must** configure `require-corp` and `same-origin` headers in your deployment `vercel.json` config.

---

## 🤝 Contribution

Contributions, issues, and feature requests are welcome! If you want to build a new App for the Web OS, navigate to `src/config/appsConfig.jsx` and plug your new Tool Component directly into the internal architecture!

<div align="center">
  <p>Built with ❤️ by Akshay</p>
</div>
