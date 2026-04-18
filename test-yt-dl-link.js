async function run() {
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent('https://www.yt-download.org/api/button/mp4/jNQXAC9IVRw')}`;
  const response = await fetch(proxyUrl);
  const data = await response.json();
  const html = data.contents;
  const regex = /href="(https:\/\/www\.yt-download\.org\/download\/[^"]+)"/g;
  let match = regex.exec(html);
  if (match) {
    console.log("Download link:", match[1]);
    const dRes = await fetch(match[1], { method: 'HEAD' });
    console.log("Status:", dRes.status);
    console.log("Content-Type:", dRes.headers.get('content-type'));
  }
}
run();
