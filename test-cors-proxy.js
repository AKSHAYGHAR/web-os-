async function test() {
  const url = encodeURIComponent('https://www.yt-download.org/api/button/mp4/jNQXAC9IVRw');
  const res = await fetch(`https://api.allorigins.win/get?url=${url}`);
  const data = await res.json();
  console.log(data.contents.substring(0, 300));
}
test();
