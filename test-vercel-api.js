async function test() {
  try {
    const res = await fetch('https://youtube-video-downloader-api.vercel.app/info?url=https://www.youtube.com/watch?v=jNQXAC9IVRw');
    const data = await res.json();
    console.log(data);
  } catch(e) {
    console.log(e);
  }
}
test();
