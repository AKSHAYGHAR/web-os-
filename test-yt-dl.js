async function test() {
  const res = await fetch("https://www.yt-download.org/api/button/mp4/jNQXAC9IVRw");
  console.log(res.status);
}
test();
