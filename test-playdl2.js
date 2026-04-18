import play from 'play-dl';

async function test() {
  const info = await play.video_info("https://www.youtube.com/watch?v=jNQXAC9IVRw");
  console.log(info.format[0]);
}
test();
