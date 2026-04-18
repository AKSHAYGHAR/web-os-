async function test() {
  const instances = [
    "https://cobalt.q-n.space",
    "https://api.vkrdownloader.vercel.app/server?vkr=https://www.youtube.com/watch?v=jNQXAC9IVRw",
    "https://youtube-video-downloader-api.vercel.app/info?url=https://www.youtube.com/watch?v=jNQXAC9IVRw",
    "https://api.alybaba.dev/api/json"
  ];
  for (let inst of instances) {
     try {
       const res = await fetch(inst, { method: "HEAD" });
       console.log(inst, res.status);
     } catch(e) { }
  }
}
test();
