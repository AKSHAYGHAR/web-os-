async function test() {
  const url = encodeURIComponent('https://www.yt-download.org/api/button/mp4/jNQXAC9IVRw');
  const res = await fetch(`https://api.allorigins.win/get?url=${url}`);
  const data = await res.json();
  
  // parse data.contents
  const html = data.contents;
  const regex = /href="(https:\/\/www\.yt-download\.org\/download\/[^"]+)"[^>]*>([^<]+)<\/a>/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
      console.log(match[2].trim(), '->', match[1]);
  }
}
test();
