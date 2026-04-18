import play from 'play-dl';
async function test() {
  try {
    const info = await play.video_info("https://www.youtube.com/watch?v=jNQXAC9IVRw");
    const formatUrl = info.format[0].url;
    
    // Attempt fetch with User-Agent
    const res = await fetch(formatUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    console.log("Status:", res.status);
    console.log("Content-Length:", res.headers.get("content-length"));
  } catch(e) {
    console.error(e);
  }
}
test();
