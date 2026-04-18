import ytdl from '@distube/ytdl-core';

async function test() {
  try {
    const url = "https://www.youtube.com/watch?v=jNQXAC9IVRw"; // Example URL
    const info = await ytdl.getInfo(url);
    console.log("Formats total:", info.formats.length);
    console.log(info.formats.slice(0, 3));
  } catch (err) {
    console.error("YTDL Error:", err.message);
  }
}
test();
